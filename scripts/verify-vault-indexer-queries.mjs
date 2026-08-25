#!/usr/bin/env node
/**
 * Execute every GraphQL example in the vault indexer docs against the live
 * endpoint. Fail for documentation errors and warn for endpoint failures.
 *
 * This is the live correctness check for the API documentation. A GraphQL endpoint
 * is an unusually good verifier — it rejects an unknown field with an exact error
 * and often suggests the right name — which turns "did the model invent this?"
 * from a judgement call into a pass/fail test.
 *
 * Any fenced ```graphql block is executed. Mark a block as a non-executable
 * illustration with ```graphql title="skip-verify" and it is reported as skipped.
 *
 * Usage: node scripts/verify-vault-indexer-queries.mjs [file...]
 */

import { appendFileSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS_DIR = resolve(root, 'docs/trustless-bitcoin-vault/apis');
const ENDPOINT =
  process.env.VAULT_INDEXER_ENDPOINT ??
  'https://babylon-vault-indexer-api.testnet.babylonlabs.io/';
const USER_AGENT =
  'babylonlabs-docs-query-verify/1.0 (+https://docs.babylonlabs.io)';

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
    for (; j < lines.length && !/^```\s*$/.test(lines[j]); j++)
      body.push(lines[j]);
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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const backoff = (attempt) => 500 * 2 ** (attempt - 1);

/**
 * Execute one query, retrying only on transport-level failures.
 *
 * The distinction matters because a GraphQL error means the documentation is
 * wrong and must never be retried away. A 429, a 5xx or a dropped connection says
 * nothing about the documentation, and must produce a warning instead. The
 * endpoint does throttle a burst,
 * and this script sends every example on the page back to back.
 */
async function run(query, attempts = 4) {
  let last = 'unknown error';

  for (let attempt = 1; attempt <= attempts; attempt++) {
    let res;
    try {
      res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': USER_AGENT,
        },
        body: JSON.stringify({ query }),
      });
    } catch (err) {
      last = `network error: ${err.message}`;
      if (attempt < attempts) await sleep(backoff(attempt));
      continue;
    }

    if (res.status === 429 || res.status >= 500) {
      last = `HTTP ${res.status}`;
      if (attempt < attempts) {
        const retryAfter = Number(res.headers.get('retry-after'));
        await sleep(
          Number.isFinite(retryAfter) && retryAfter > 0
            ? retryAfter * 1000
            : backoff(attempt)
        );
      }
      continue;
    }

    // 403 is the blocked-user-agent trap. Retrying will never help, and the
    // generic "HTTP 403" reads as an outage, so name the real cause here.
    if (res.status === 403) {
      return {
        ok: false,
        kind: 'endpoint',
        reason:
          'HTTP 403 — the edge blocked this User-Agent. Not an outage or an auth wall.',
      };
    }
    if (!res.ok)
      return { ok: false, kind: 'endpoint', reason: `HTTP ${res.status}` };

    let body;
    try {
      body = await res.json();
    } catch {
      return { ok: false, kind: 'endpoint', reason: 'response was not JSON' };
    }
    // A GraphQL error is a documentation bug. Return it, never retry it.
    if (body.errors) {
      return {
        ok: false,
        kind: 'query',
        reason: body.errors.map((e) => e.message).join('; '),
      };
    }
    // Absence of `errors` is not success. A body of `{}` — or `{"data": null}`
    // from a proxy or a partial failure — would otherwise be recorded as a pass,
    // which is the one outcome this gate must never produce.
    if (body.data === undefined || body.data === null) {
      return {
        ok: false,
        kind: 'endpoint',
        reason: 'response carried neither `data` nor `errors`',
      };
    }
    return { ok: true, body };
  }

  return {
    ok: false,
    kind: 'endpoint',
    reason: `${last} after ${attempts} attempts`,
  };
}

let pass = 0;
let fail = 0;
let skip = 0;
const failures = [];
const warnings = [];
let endpointWarning = null;

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
      console.log(
        `${label}  FAIL  depth ${d} exceeds the endpoint cap of ${MAX_DEPTH}`
      );
      failures.push({
        file: basename(file),
        line: b.line,
        reason: `depth ${d} > ${MAX_DEPTH}`,
      });
      fail++;
      continue;
    }
    if (endpointWarning) {
      console.log(
        `${label}  WARN  skipped because the endpoint is unavailable`
      );
      continue;
    }
    // A small gap between examples. This is a shared public testnet endpoint,
    // and the whole page is sent back to back.
    await sleep(100);
    const r = await run(b.query);
    if (r.ok) {
      console.log(`${label}  PASS  depth ${d}`);
      pass++;
    } else if (r.kind === 'endpoint') {
      endpointWarning = r.reason;
      warnings.push({ file: basename(file), line: b.line, reason: r.reason });
      console.log(`${label}  WARN  ${r.reason}`);
    } else {
      console.log(`${label}  FAIL  ${r.reason}`);
      failures.push({ file: basename(file), line: b.line, reason: r.reason });
      fail++;
    }
  }
}

console.log(
  `\n${'-'.repeat(60)}\npass ${pass}   fail ${fail}   skip ${skip}   warn ${
    warnings.length
  }`
);
if (fail) {
  console.log('\nFailures:');
  for (const f of failures) console.log(`  ${f.file}:${f.line} — ${f.reason}`);
  process.exit(1);
}
if (warnings.length) {
  const message = `Vault Indexer endpoint warning for ${ENDPOINT}: ${endpointWarning}`;
  console.warn(`::warning::${message}`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `## Vault Indexer endpoint warning\n\n${message}\n\nThe deployment build runs deterministic SDL validation separately.\n`
    );
  }
  console.log(
    'The live check could not complete. The deployment can continue.'
  );
} else {
  console.log('All executable examples ran against the live endpoint.');
}
