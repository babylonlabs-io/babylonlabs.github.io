const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

// Recursively scan all `.mdx` files
function scanMdxFiles(dir, result = []) {
  fs.readdirSync(dir).forEach((name) => {
    const filePath = path.join(dir, name);
    if (fs.statSync(filePath).isDirectory()) {
      scanMdxFiles(filePath, result);
    } else if (name.endsWith('.mdx')) {
      result.push(filePath);
    }
  });
  return result;
}

function extractJsAndRemoteMD(content) {
  const lines = content.split('\n');
  const codeLines = [];
  let inFrontmatter = false;
  let inRemoteMD = false, remoteMdBlock = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '---' && !inFrontmatter) { inFrontmatter = true; continue; }
    if (line.trim() === '---' && inFrontmatter) { inFrontmatter = false; continue; }
    if (inFrontmatter) continue;
    if (line.includes('<RemoteMD')) inRemoteMD = true;
    if (inRemoteMD) {
      remoteMdBlock.push(line);
      if (line.includes('/>')) {
        codeLines.push(remoteMdBlock.join('\n'));
        remoteMdBlock = [];
        inRemoteMD = false;
      }
      continue;
    }
    if (/^(import|export|const|let|var)\s/.test(line.trim())) {
      codeLines.push(line);
    }
  }
  return codeLines.join('\n');
}

function extractStringVariables(ast) {
  const vars = {};
  traverse(ast, {
    VariableDeclarator({ node }) {
      if (
        node.id.type === 'Identifier' &&
        node.init &&
        node.init.type === 'StringLiteral'
      ) {
        vars[node.id.name] = node.init.value;
      }
    }
  });
  return vars;
}

function getValueFromNode(node, variables) {
  if (!node) return null;
  if (node.type === 'StringLiteral') return node.value;
  if (node.type === 'Identifier') return variables[node.name];
  return null;
}

function extractNetworkVersions(objNode, variables) {
  if (!objNode || objNode.type !== 'ObjectExpression') return null;
  const versions = {};
  objNode.properties.forEach((prop) => {
    const key =
      prop.key.type === 'Identifier'
        ? prop.key.name
        : prop.key.type === 'StringLiteral'
          ? prop.key.value
          : '';
    versions[key] = getValueFromNode(prop.value, variables);
  });
  return versions;
}

// Get the base name of the `.mdx` file without extension
function getFileBaseName(filepath) {
  return path.basename(filepath, path.extname(filepath));
}

// Main: For each `.mdx` file, return an array where each element is {url, key}
function findRemoteMDTargets(content, variables) {
  const results = [];
  const jsCode = extractJsAndRemoteMD(content);
  let ast;
  try {
    ast = parser.parse(jsCode, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });
  } catch (e) {
    return [];
  }
  traverse(ast, {
    JSXElement({ node }) {
      if (!node.openingElement) return;
      const tagName = node.openingElement.name.name;
      if (tagName !== 'RemoteMD') return;
      let found = false;
      node.openingElement.attributes.forEach((attr) => {
        // <RemoteMD networkVersions={...} />
        if (
          attr.name &&
          attr.name.name === 'networkVersions' &&
          attr.value &&
          attr.value.expression
        ) {
          found = true;
          // networkVersions={{mainnet: ..., ...}}
          if (attr.value.expression.type === 'ObjectExpression') {
            const versions = extractNetworkVersions(attr.value.expression, variables);
            for (const [key, url] of Object.entries(versions)) {
              if (url) results.push({ url, key });
            }
          }
          // networkVersions={rawObj}
          if (attr.value.expression.type === 'Identifier') {
            let refName = attr.value.expression.name;
            if (variables[refName]) {
              // You can extend support for external objects
              results.push({ url: variables[refName], key: refName });
            }
          }
        }
        // <RemoteMD url="xxx" />
        if (
          attr.name &&
          attr.name.name === 'url' &&
          attr.value
        ) {
          if (attr.value.type === 'StringLiteral') {
            results.push({ url: attr.value.value, key: undefined });
          } else if (attr.value.expression && attr.value.expression.type === 'Identifier') {
            let refName = attr.value.expression.name;
            if (variables[refName]) {
              results.push({ url: variables[refName], key: undefined });
            }
          }
        }
      });
    }
  });
  return results;
}

function clearDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
  // Recreate the directory to ensure it exists and is empty
  fs.mkdirSync(dirPath, { recursive: true });
}

async function main() {
  const DOCS_DIR = path.resolve(__dirname, '../docs');
  const STATIC_REMOTE_DOCS = path.resolve(__dirname, '../static/remote-docs');
  // New: Clear the `remote-docs` directory each time
  clearDirectory(STATIC_REMOTE_DOCS);
  const mdxFiles = scanMdxFiles(DOCS_DIR, []);
  let total = 0, errorCount = 0;
  for (const mdx of mdxFiles) {
    const mdxContent = fs.readFileSync(mdx, 'utf-8');
    // First analyze all variables
    const jsCode = extractJsAndRemoteMD(mdxContent);
    let ast;
    let variables = {};
    try {
      ast = parser.parse(jsCode, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
      variables = extractStringVariables(ast);
    } catch {}
    const targets = findRemoteMDTargets(mdxContent, variables);
    if (targets.length === 0) continue;

    // docs/xxx/yyy.mdx => xxx/ relative directory
    const relPath = path.relative(DOCS_DIR, mdx);
    const relDir = path.dirname(relPath);
    const baseName = getFileBaseName(mdx);

    const targetDir = path.join(STATIC_REMOTE_DOCS, relDir);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    for (const { url, key } of targets) {
      // If there are multiple keys in the same group, append `-key`
      let name = (targets.length === 1 || key === undefined || key === null)
        ? `${baseName}.md`
        : `${baseName}-${key}.md`;
      const outPath = path.join(targetDir, name);
      try {
        const res = await fetch(url);
        if (!res.ok) {
          errorCount++;
          console.warn(`[WARN] Download failed [${res.status}]: ${url}`);
          continue;
        }
        fs.writeFileSync(outPath, await res.text(), 'utf-8');
        console.log('Fetched:', url, '=>', outPath);
        total++;
      } catch (err) {
        errorCount++;
        console.warn(`[ERROR] ${url} Download failed, reason: ${err.message}`);
      }
    }
  }
  console.log(`Total written ${total} remote md, errors ${errorCount}`);
}
main();