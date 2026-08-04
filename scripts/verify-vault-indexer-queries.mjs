#!/usr/bin/env node
/**
 * Execute every GraphQL example in the vault indexer docs against the live
 * endpoint, and fail if any of them does not run.
 *
 * This is the correctness gate for LLM-drafted documentation. A GraphQL endpoint
 * is an unusually good verifier — it rejects an unknown field with an exact error
 * and often suggests the right name — which turns "did the model invent this?"
 * from a judgement call into a pass/fail test.
 *
 * Any fenced ```graphql block is executed. Mark a block as a non-executable
 * illustration with ```graphql title="skip-verify" and it is reported as skipped.
 *
 * Usage: node scripts/verify-vault-indexer-queries.mjs [file...]
 */

import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS_DIR = resolve(root, 'docs/trustless-bitcoin-vault/apis');
const ENDPOINT =
  process.env.VAULT_INDEXER_ENDPOINT ??
  'https://babylon-vault-indexer-api.testnet.babylonlabs.io/';
const USER_AGENT = 'babylonlabs-docs-query-verify/1.0 (+https://docs.babylonlabs.io)';

// Mirrors the deployment's limits (babylon-vault-indexer src/api/index.ts).
// Checked locally so a doc example that would be rejected is caught as a doc bug
// rather than surfacing as a confusing runtime error for a reader.
const MAX_DEPTH = 10;

const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(DOCS_DIR)
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => resolve(DOCS_DIR, f));

/** Pull fenced graphql blocks, with their line number and meta string. */
function extractBlocks(text) {
  const blocks = [];
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const open = lines[i].match(/^```graphql(.*)$/);
    if (!open) continue;
    const meta = open[1] ?? '';
    const body = [];
    let j = i + 1;
    for (; j < lines.length && !/^```\s*$/.test(lines[j]); j++) body.push(lines[j]);
    blocks.push({ line: i + 1, meta, query: body.join('\n') });
    i = j;
  }
  return blocks;
}

/** Brace-nesting depth, which is what the server's depth rule counts. */
function queryDepth(q) {
  let depth = 0;
  let max = 0;
  for (const ch of q.replace(/#[^\n]*/g, '')) {
    if (ch === '{') max = Math.max(max, ++depth);
    else if (ch === '}') depth--;
  }
  return max;
}

async function run(query) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': USER_AGENT },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
  const body = await res.json();
  if (body.errors) return { ok: false, reason: body.errors.map((e) => e.message).join('; ') };
  return { ok: true, body };
}

let pass = 0;
let fail = 0;
let skip = 0;
const failures = [];

for (const file of files) {
  const blocks = extractBlocks(readFileSync(file, 'utf8'));
  if (!blocks.length) continue;
  console.log(`\n${basename(file)}`);
  for (const b of blocks) {
    const label = `  L${String(b.line).padStart(4)}`;
    if (/skip-verify/.test(b.meta)) {
      console.log(`${label}  SKIP  (marked non-executable)`);
      skip++;
      continue;
    }
    const d = queryDepth(b.query);
    if (d > MAX_DEPTH) {
      console.log(`${label}  FAIL  depth ${d} exceeds the endpoint cap of ${MAX_DEPTH}`);
      failures.push({ file: basename(file), line: b.line, reason: `depth ${d} > ${MAX_DEPTH}` });
      fail++;
      continue;
    }
    const r = await run(b.query);
    if (r.ok) {
      console.log(`${label}  PASS  depth ${d}`);
      pass++;
    } else {
      console.log(`${label}  FAIL  ${r.reason}`);
      failures.push({ file: basename(file), line: b.line, reason: r.reason });
      fail++;
    }
  }
}

console.log(`\n${'-'.repeat(60)}\npass ${pass}   fail ${fail}   skip ${skip}`);
if (fail) {
  console.log('\nFailures:');
  for (const f of failures) console.log(`  ${f.file}:${f.line} — ${f.reason}`);
  process.exit(1);
}
console.log('All executable examples ran against the live endpoint.');
