/**
 * Plugin to generate llm.txt file for AI assistants
 *
 * This script aggregates documentation content into a single file
 * that can be easily copied and used as context for LLMs.
 */

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const OUTPUT_FILE = path.join(__dirname, '..', 'static', 'llms.txt');

// Files/directories to skip
const SKIP_PATTERNS = [
  'api/', // Auto-generated API docs
  'node_modules/',
  '.git/',
];

// Priority order for sections (higher priority = appears first)
const SECTION_PRIORITY = {
  'guides': 1,
  'stakers': 2,
  'developers': 3,
  'operators': 4,
  'bsns': 5,
};

function shouldSkip(filePath) {
  return SKIP_PATTERNS.some(pattern => filePath.includes(pattern));
}

function scanMdxFiles(dir, result = []) {
  if (!fs.existsSync(dir)) return result;

  fs.readdirSync(dir).forEach((name) => {
    const filePath = path.join(dir, name);
    if (shouldSkip(filePath)) return;

    if (fs.statSync(filePath).isDirectory()) {
      scanMdxFiles(filePath, result);
    } else if (name.endsWith('.md') || name.endsWith('.mdx')) {
      result.push(filePath);
    }
  });
  return result;
}

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { title: null, description: null, content };

  const frontmatter = match[1];
  const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/);
  const descMatch = frontmatter.match(/description:\s*["']?([^"'\n]+)["']?/);

  return {
    title: titleMatch ? titleMatch[1].trim() : null,
    description: descMatch ? descMatch[1].trim() : null,
    content: content.replace(/^---\n[\s\S]*?\n---\n*/, ''),
  };
}

function cleanContent(content) {
  // Remove import statements
  content = content.replace(/^import\s+.*$/gm, '');
  // Remove export statements
  content = content.replace(/^export\s+.*$/gm, '');
  // Remove JSX components (but keep their text content if simple)
  content = content.replace(/<[A-Z][a-zA-Z]*[^>]*\/>/g, '');
  content = content.replace(/<[A-Z][a-zA-Z]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, '');
  // Remove HTML comments
  content = content.replace(/<!--[\s\S]*?-->/g, '');
  // Clean up excessive newlines
  content = content.replace(/\n{3,}/g, '\n\n');
  // Trim whitespace
  content = content.trim();

  return content;
}

function getSectionFromPath(filePath) {
  const relativePath = path.relative(DOCS_DIR, filePath);
  const parts = relativePath.split(path.sep);
  return parts[0] || 'other';
}

function generateLlmTxt() {
  console.log('[llm.txt] Scanning documentation files...');

  const files = scanMdxFiles(DOCS_DIR);
  console.log(`[llm.txt] Found ${files.length} documentation files`);

  if (files.length === 0) {
    console.log('[llm.txt] No files found, creating placeholder...');
    createPlaceholder();
    return;
  }

  // Group files by section
  const sections = {};
  files.forEach(file => {
    const section = getSectionFromPath(file);
    if (!sections[section]) sections[section] = [];
    sections[section].push(file);
  });

  // Sort sections by priority
  const sortedSections = Object.keys(sections).sort((a, b) => {
    const priorityA = SECTION_PRIORITY[a] || 99;
    const priorityB = SECTION_PRIORITY[b] || 99;
    return priorityA - priorityB;
  });

  let output = '';
  let totalWords = 0;

  // Add header
  output += `# Babylon Labs Documentation
# https://docs.babylonlabs.io

This file contains the complete documentation for Babylon Labs,
a Bitcoin staking protocol that enables Bitcoin holders to stake
their BTC to secure Bitcoin Secured Networks (BSNs).

---

`;

  // Process each section
  sortedSections.forEach(section => {
    const sectionFiles = sections[section];
    output += `\n## ${section.charAt(0).toUpperCase() + section.slice(1)}\n\n`;

    sectionFiles.forEach(file => {
      try {
        const rawContent = fs.readFileSync(file, 'utf-8');
        const { title, description, content } = extractFrontmatter(rawContent);
        const cleanedContent = cleanContent(content);

        if (cleanedContent.length > 0) {
          const relativePath = path.relative(DOCS_DIR, file);
          output += `### ${title || relativePath}\n\n`;
          if (description) {
            output += `${description}\n\n`;
          }
          output += `${cleanedContent}\n\n---\n\n`;

          // Count words
          totalWords += cleanedContent.split(/\s+/).filter(w => w.length > 0).length;
        }
      } catch (err) {
        console.error(`[llm.txt] Error processing ${file}:`, err.message);
      }
    });
  });

  // Calculate token estimate (roughly 1.3 tokens per word for English)
  const tokenCount = Math.round(totalWords * 1.3);
  const lastUpdated = new Date().toISOString().split('T')[0];

  // Create metadata header
  const metadata = {
    wordCount: totalWords,
    tokenCount: tokenCount,
    lastUpdated: lastUpdated,
  };

  const metadataHeader = `<!-- METADATA: ${JSON.stringify(metadata)} -->\n\n`;

  // Write the file
  const finalOutput = metadataHeader + output;

  // Ensure static directory exists
  const staticDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, finalOutput, 'utf-8');

  console.log(`[llm.txt] Generated successfully!`);
  console.log(`[llm.txt] - Words: ${totalWords.toLocaleString()}`);
  console.log(`[llm.txt] - Tokens: ~${tokenCount.toLocaleString()}`);
  console.log(`[llm.txt] - Last Updated: ${lastUpdated}`);
  console.log(`[llm.txt] - Output: ${OUTPUT_FILE}`);
}

function createPlaceholder() {
  const lastUpdated = new Date().toISOString().split('T')[0];
  const metadata = {
    wordCount: 100,
    tokenCount: 130,
    lastUpdated: lastUpdated,
  };

  const placeholder = `<!-- METADATA: ${JSON.stringify(metadata)} -->

# Babylon Labs Documentation
# https://docs.babylonlabs.io

Babylon Labs is building Bitcoin staking infrastructure that enables
Bitcoin holders to stake their BTC to secure Bitcoin Secured Networks (BSNs).

## Core Concepts

- **Bitcoin Staking**: Lock BTC to earn staking rewards while securing networks
- **Finality Providers**: Operators who run nodes and provide finality for BSNs
- **Bitcoin Secured Networks (BSNs)**: Networks secured by Bitcoin staking

## Resources

- Documentation: https://docs.babylonlabs.io
- GitHub: https://github.com/babylonlabs-io
- Discord: https://discord.gg/babylonlabs

For complete documentation, visit https://docs.babylonlabs.io
`;

  const staticDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, placeholder, 'utf-8');
  console.log('[llm.txt] Created placeholder file');
}

// Docusaurus plugin wrapper
module.exports = function generateLlmTxtPlugin(context, options) {
  return {
    name: 'generate-llm-txt',
    async loadContent() {
      generateLlmTxt();
    },
  };
};

// Also export for CLI usage
module.exports.generateLlmTxt = generateLlmTxt;

// Run directly if called from command line
if (require.main === module) {
  generateLlmTxt();
}
