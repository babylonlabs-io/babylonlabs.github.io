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

async function mdToStructuredHtml(mdContent) {
  const { remark } = await import('remark');
  const html = (await import('remark-html')).default;
  const file = await remark().use(html).process(mdContent);
  return `<html><body><article>${file.value}</article></body></html>`;
}

function generateSitemap(urls, baseUrl) {
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>
` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
` +
    urls.map(url =>
      `  <url>
    <loc>${baseUrl}${url}</loc>
  </url>`
    ).join('\n') + ' </urlset>';
  return sitemap;
}

async function main() {
  const DOCS_DIR = path.resolve(__dirname, '../docs');
  const STATIC_REMOTE_DOCS = path.resolve(__dirname, '../static/remote-docs');
  const BRANCH_NAME = process.env.BRANCH_NAME;
  const REMOTE_DOCS_BASE_URL =
    BRANCH_NAME === 'main'
      ? 'https://docs.babylonlabs.io/remote-docs'
      : 'https://docs.dev.babylonlabs.io/remote-docs';
  // New: Clear the `remote-docs` directory each time
  clearDirectory(STATIC_REMOTE_DOCS);
  const mdxFiles = scanMdxFiles(DOCS_DIR, []);
  let total = 0, errorCount = 0;
  const htmlUrls = [];
  for (const mdx of mdxFiles) {
    const mdxContent = fs.readFileSync(mdx, 'utf-8');
    const jsCode = extractJsAndRemoteMD(mdxContent);
    let ast;
    let variables = {};
    try {
      ast = parser.parse(jsCode, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
      variables = extractStringVariables(ast);
    } catch {}
    const targets = findRemoteMDTargets(mdxContent, variables);
    if (targets.length === 0) continue;

    const relPath = path.relative(DOCS_DIR, mdx);
    const relDir = path.dirname(relPath);
    const baseName = getFileBaseName(mdx);

    const targetDir = path.join(STATIC_REMOTE_DOCS, relDir);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    for (const { url, key } of targets) {
      let name = (targets.length === 1 || key === undefined || key === null)
        ? `${baseName}.md`
        : `${baseName}-${key}.md`;
      const outPath = path.join(targetDir, name);
      const htmlOutPath = outPath.replace(/\.md$/, '.html');
      try {
        const res = await fetch(url);
        if (!res.ok) {
          errorCount++;
          console.warn(`[WARN] Download failed [${res.status}]: ${url}`);
          continue;
        }
        const mdContent = await res.text();
        fs.writeFileSync(outPath, mdContent, 'utf-8');
        const htmlContent = await mdToStructuredHtml(mdContent);
        fs.writeFileSync(htmlOutPath, htmlContent, 'utf-8');
        fs.unlinkSync(outPath);
        const relHtmlPath = path.relative(STATIC_REMOTE_DOCS, htmlOutPath).replace(/\\/g, '/');
        htmlUrls.push(`/${relHtmlPath}`);
        console.log('Fetched:', url, '=>', htmlOutPath, '（md have deleted）');
        total++;
      } catch (err) {
        errorCount++;
        console.warn(`[ERROR] ${url} Download failed, reason: ${err.message}`);
      }
    }
  }
  if (htmlUrls.length > 0) {
    const sitemapContent = generateSitemap(htmlUrls, REMOTE_DOCS_BASE_URL);
    const sitemapPath = path.join(STATIC_REMOTE_DOCS, 'remote-docs-sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
    console.log(`Generated sitemap: ${sitemapPath} (contains ${htmlUrls.length} html pages)`);
  }
  console.log(`Total written ${total} remote html (md deleted), errors ${errorCount}`);
}
main();