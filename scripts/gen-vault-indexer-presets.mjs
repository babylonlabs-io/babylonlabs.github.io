#!/usr/bin/env node
/**
 * Builds the explorer's preset list from the API documentation.
 *
 * Presets are not hand-maintained. Every ```graphql block on the API pages is
 * extracted with the heading above it, so the explorer offers exactly the
 * queries the docs teach. `verify-vault-indexer-queries.mjs` already executes
 * each of those blocks against testnet in CI, which means a preset cannot be
 * broken without the build going red first.
 *
 * Output: static/vault-indexer-presets.json
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS_DIR = resolve(root, 'docs/trustless-bitcoin-vault/apis');
const OUT_PATH = resolve(root, 'static/vault-indexer-presets.json');

/** Pages to harvest, in the order a reader meets them. */
const PAGES = [
  ['use-cases.mdx', 'Use cases'],
  ['query-cookbook.mdx', 'Cookbook'],
  ['limits-and-gotchas.mdx', 'Limits'],
];

/** Blocks whose point is to fail are not useful as a starting query. */
function isDeliberateFailure(query) {
  return /limit:\s*1001/.test(query) || /__schema[\s\S]*ofType[\s\S]*ofType[\s\S]*ofType/.test(query);
}

/**
 * Walk a page, tracking the most recent heading, and pair each fenced graphql
 * block with it.
 */
function harvest(file, group) {
  const lines = readFileSync(resolve(DOCS_DIR, file), 'utf8').split('\n');
  const out = [];
  let heading = null;
  let section = null;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    const h = line.match(/^(#{2,4})\s+(.*)$/);
    if (h) {
      const text = h[2].replace(/[`*]/g, '').trim();
      if (h[1].length === 2) section = text;
      heading = text;
      continue;
    }

    if (!/^```graphql/.test(line)) continue;
    if (/norun/.test(line)) continue;

    const body = [];
    for (i += 1; i < lines.length && !/^```\s*$/.test(lines[i]); i += 1) body.push(lines[i]);
    const query = body.join('\n').trim();
    if (!query || isDeliberateFailure(query)) continue;

    out.push({
      group,
      section: section && section !== heading ? section : null,
      title: heading ?? group,
      query,
    });
  }
  return out;
}

const known = new Set(readdirSync(DOCS_DIR));
const presets = PAGES.filter(([f]) => known.has(f)).flatMap(([f, g]) => harvest(f, g));

if (presets.length === 0) {
  console.error('No presets extracted — the docs layout probably changed.');
  process.exit(1);
}

// Two pages can legitimately teach the same query; keep the first occurrence.
const seen = new Set();
const deduped = presets.filter((p) => {
  const key = p.query.replace(/\s+/g, ' ');
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

writeFileSync(OUT_PATH, `${JSON.stringify(deduped, null, 2)}\n`);

const byGroup = deduped.reduce((acc, p) => ({ ...acc, [p.group]: (acc[p.group] ?? 0) + 1 }), {});
console.log(`Wrote ${deduped.length} presets to static/vault-indexer-presets.json`);
for (const [g, n] of Object.entries(byGroup)) console.log(`  ${g}: ${n}`);
if (deduped.length !== presets.length) {
  console.log(`  (${presets.length - deduped.length} duplicate queries dropped)`);
}
