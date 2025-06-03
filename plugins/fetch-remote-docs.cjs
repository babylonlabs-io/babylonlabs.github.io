const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

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

function extractReleaseVersions(objNode, variables) {
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

function getFileBaseName(filepath) {
  return path.basename(filepath, path.extname(filepath));
}

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
    console.warn(`Failed to parse JS code: ${e.message}`);
    return [];
  }

  traverse(ast, {
    JSXElement({ node }) {
      if (!node.openingElement) return;
      const tagName = node.openingElement.name.name;
      if (tagName !== 'RemoteMD') return;

      let rawUrl = null;
      let releaseVersions = null;
      let defaultRelease = null;
      let hideRelease = false;

      node.openingElement.attributes.forEach((attr) => {
        if (attr.name && attr.name.name === 'rawUrl') {
          rawUrl = getValueFromNode(attr.value?.expression || attr.value, variables);
        }

        if (attr.name && attr.name.name === 'releaseVersions') {
          if (attr.value?.expression?.type === 'ObjectExpression') {
            releaseVersions = extractReleaseVersions(attr.value.expression, variables);
          } else if (attr.value?.expression?.type === 'Identifier') {
            const refName = attr.value.expression.name;
            if (variables[refName]) {
              try {
                releaseVersions = JSON.parse(variables[refName]);
              } catch (e) {
                console.warn(`Failed to parse releaseVersions from variable: ${refName}`);
              }
            }
          }
        }

        if (attr.name && attr.name.name === 'defaultRelease') {
          defaultRelease = getValueFromNode(attr.value?.expression || attr.value, variables);
        }

        if (attr.name && attr.name.name === 'hideRelease') {
          hideRelease = getValueFromNode(attr.value?.expression || attr.value, variables) === true;
        }
      });

      if (!rawUrl) return;

      if (!releaseVersions) {
        results.push({
          url: rawUrl,
          key: null,
          hideRelease,
          isDefault: defaultRelease === null
        });
        return;
      }

      for (const [key, url] of Object.entries(releaseVersions)) {
        if (url) {
          results.push({
            url,
            key,
            hideRelease,
            isDefault: defaultRelease === key || (defaultRelease === null && key === Object.keys(releaseVersions)[0])
          });
        }
      }

      if (defaultRelease && !releaseVersions[defaultRelease]) {
        const defaultUrl = rawUrl.replace(/refs\/heads\/[^/]+/, defaultRelease);
        results.push({
          url: defaultUrl,
          key: defaultRelease,
          hideRelease,
          isDefault: true
        });
      }
    }
  });

  return results;
}

function clearDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
  fs.mkdirSync(dirPath, { recursive: true });
}

async function mdToStructuredHtml(mdContent, releaseTag = null) {
  const { remark } = await import('remark');
  const html = (await import('remark-html')).default;

  const versionHeader = releaseTag
    ? `<div class="release-badge">Version: <strong>${releaseTag}</strong></div>`
    : '';

  const file = await remark().use(html).process(mdContent);

  return `
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Remote Documentation</title>
  <style>
    .release-badge {
      background-color: #f0f0f0;
      padding: 8px 12px;
      margin-bottom: 16px;
      border-radius: 4px;
      font-size: 14px;
    }
    article {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
  </style>
</head>
<body>
  <article>
    ${versionHeader}
    ${file.value}
  </article>
</body>
</html>
  `;
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
    } catch (e) {
      console.warn(`Failed to parse JS code in ${mdx}: ${e.message}`);
      continue;
    }

    const targets = findRemoteMDTargets(mdxContent, variables);
    if (targets.length === 0) continue;

    const relPath = path.relative(DOCS_DIR, mdx);
    const relDir = path.dirname(relPath);
    const baseName = getFileBaseName(mdx);

    const targetDir = path.join(STATIC_REMOTE_DOCS, relDir);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    for (const { url, key, hideRelease, isDefault } of targets) {
      let name;
      if (!key || hideRelease) {
        name = `${baseName}.html`;
      } else {
        const safeKey = key.replace(/[^a-zA-Z0-9._-]/g, '-');
        name = `${baseName}-version-${safeKey}.html`;
      }

      const outPath = path.join(targetDir, name);

      try {
        const res = await fetch(url);
        if (!res.ok) {
          errorCount++;
          console.warn(`[WARN] Download failed [${res.status}]: ${url}`);
          continue;
        }

        const mdContent = await res.text();

        const htmlContent = await mdToStructuredHtml(mdContent, key);
        fs.writeFileSync(outPath, htmlContent, 'utf-8');

        const relHtmlPath = path.relative(STATIC_REMOTE_DOCS, outPath).replace(/\\/g, '/');

        const urlWithVersion = key
          ? `${relHtmlPath}?version=${encodeURIComponent(key)}`
          : relHtmlPath;

        htmlUrls.push(`/${urlWithVersion}`);

        console.log('Fetched:', url, '=>', outPath, key ? `(version: ${key})` : '');
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

  console.log(`Total written ${total} remote html files, errors ${errorCount}`);
}

main();