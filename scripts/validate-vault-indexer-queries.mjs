#!/usr/bin/env node
/**
 * Validate every GraphQL example against the committed Vault Indexer SDL.
 *
 * This check stays inside the static build. It does not call the live endpoint,
 * so an API outage cannot stop the documentation deployment.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSchema, parse, validate } from 'graphql';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS_DIR = resolve(root, 'docs/trustless-bitcoin-vault/apis');
const SDL_PATH = resolve(root, 'static/schema/vault-indexer.graphql');

const files = process.argv.slice(2).length
  ? process.argv.slice(2).map((file) => resolve(root, file))
  : readdirSync(DOCS_DIR)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => resolve(DOCS_DIR, file));

/** Pull fenced graphql blocks, with their line number and meta string. */
function extractBlocks(text) {
  const blocks = [];
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const open = lines[i].match(/^```graphql(.*)$/);
    if (!open) continue;
    const meta = open[1] ?? '';
    const body = [];
    let j = i + 1;
    for (; j < lines.length && !/^```\s*$/.test(lines[j]); j += 1)
      body.push(lines[j]);
    blocks.push({ line: i + 1, meta, query: body.join('\n') });
    i = j;
  }
  return blocks;
}

/** Brace-nesting depth, which is what the server's depth rule counts. */
function queryDepth(query) {
  let depth = 0;
  let max = 0;
  for (const ch of query.replace(/#[^\n]*/g, '')) {
    if (ch === '{') max = Math.max(max, ++depth);
    else if (ch === '}') depth -= 1;
  }
  return max;
}

const schema = buildSchema(readFileSync(SDL_PATH, 'utf8'));
let pass = 0;
let fail = 0;
let skip = 0;
const failures = [];

for (const file of files) {
  const blocks = extractBlocks(readFileSync(file, 'utf8'));
  if (!blocks.length) continue;
  console.log(`\n${basename(file)}`);

  for (const block of blocks) {
    const label = `  L${String(block.line).padStart(4)}`;
    if (/skip-verify/.test(block.meta)) {
      console.log(`${label}  SKIP  (marked non-executable)`);
      skip += 1;
      continue;
    }

    const depth = queryDepth(block.query);
    if (depth > 10) {
      console.log(
        `${label}  FAIL  depth ${depth} exceeds the endpoint cap of 10`
      );
      failures.push({
        file: basename(file),
        line: block.line,
        reason: `depth ${depth} > 10`,
      });
      fail += 1;
      continue;
    }

    let document;
    try {
      document = parse(block.query);
    } catch (error) {
      console.log(`${label}  FAIL  ${error.message}`);
      failures.push({
        file: basename(file),
        line: block.line,
        reason: error.message,
      });
      fail += 1;
      continue;
    }

    const errors = validate(schema, document);
    if (errors.length) {
      const reason = errors.map((error) => error.message).join('; ');
      console.log(`${label}  FAIL  ${reason}`);
      failures.push({ file: basename(file), line: block.line, reason });
      fail += 1;
      continue;
    }

    console.log(`${label}  PASS  depth ${depth}`);
    pass += 1;
  }
}

console.log(`\n${'-'.repeat(60)}\npass ${pass}   fail ${fail}   skip ${skip}`);
if (fail) {
  console.log('\nFailures:');
  for (const failure of failures) {
    console.log(`  ${failure.file}:${failure.line} — ${failure.reason}`);
  }
  process.exit(1);
}
console.log('All executable examples validate against the committed SDL.');
