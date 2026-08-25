#!/usr/bin/env node
/**
 * Regenerate docs/trustless-bitcoin-vault/apis/schema-reference.mdx from the
 * committed SDL at static/schema/vault-indexer.graphql.
 *
 * The SDL itself is produced by scripts/fetch-vault-indexer-schema.mjs, which
 * introspects the live endpoint. Neither step uses an LLM: a hallucinated field
 * in a schema reference is indistinguishable from a real one to a reader, so
 * both stay mechanical.
 *
 * Usage: node scripts/gen-vault-indexer-docs.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SDL_PATH = resolve(root, 'static/schema/vault-indexer.graphql');
const DESCRIPTIONS_PATH = resolve(root, 'scripts/vault-indexer-descriptions.json');

/**
 * Prose shared with the site's GraphQL explorer, so the Schema Reference and
 * the explorer's Docs panel can never disagree. See that file's _comment.
 */
const DESCRIPTIONS = JSON.parse(readFileSync(DESCRIPTIONS_PATH, 'utf8'));
const TYPE_DESCRIPTIONS = DESCRIPTIONS.types ?? {};
const FIELD_DESCRIPTIONS = DESCRIPTIONS.fields ?? {};
const OUT_PATH = resolve(root, 'docs/trustless-bitcoin-vault/apis/schema-reference.mdx');

// Entity roots grouped by domain. Ponder derives the plural resolver by appending
// "s", which is why `stats` pluralises to the odd-looking `statss`.
const DOMAINS = [
  {
    title: 'Core vault',
    blurb:
      'The vault lifecycle and the actors that secure it. These entities exist regardless of which DeFi application a vault is used with.',
    entities: [
      ['vault', 'vaults'],
      ['vaultActivity', 'vaultActivitys'],
      ['vaultProvider', 'vaultProviders'],
      ['vaultProviderStats', 'vaultProviderStatss'],
      ['vaultKeeper', 'vaultKeepers'],
      ['vaultKeeperApplication', 'vaultKeeperApplications'],
      ['universalChallenger', 'universalChallengers'],
      ['universalChallengerVersion', 'universalChallengerVersions'],
      ['feeConfig', 'feeConfigs'],
      ['vaultFeeEscrow', 'vaultFeeEscrows'],
      ['application', 'applications'],
      ['token', 'tokens'],
      ['stats', 'statss'],
      ['protocolState', 'protocolStates'],
    ],
  },
  {
    title: 'Aave application',
    blurb:
      'State for the Aave v4 integration — the first application built on TBV. A vault used as Aave collateral appears in both domains.',
    entities: [
      ['aavePosition', 'aavePositions'],
      ['aavePositionCollateral', 'aavePositionCollaterals'],
      ['aaveVaultStatus', 'aaveVaultStatuss'],
      ['aaveUserProxy', 'aaveUserProxys'],
      ['aaveReserve', 'aaveReserves'],
      ['aaveConfig', 'aaveConfigs'],
    ],
  },
];

/** Extract `type Name { ... }` blocks from the SDL into a Map. */
function parseTypes(sdl) {
  const types = new Map();
  const re = /^type (\w+) \{\n([\s\S]*?)^\}/gm;
  let m;
  while ((m = re.exec(sdl)) !== null) {
    const fields = [];
    for (const line of m[2].split('\n')) {
      const f = line.match(/^\s{2}(\w+)(\([^)]*\))?:\s*(.+)$/);
      if (f) fields.push({ name: f[1], args: f[2] ?? '', type: f[3].trim() });
    }
    types.set(m[1], fields);
  }
  return types;
}

/** Extract `enum Name { ... }` blocks. */
function parseEnums(sdl) {
  const enums = new Map();
  const re = /^enum (\w+) \{\n([\s\S]*?)^\}/gm;
  let m;
  while ((m = re.exec(sdl)) !== null) {
    enums.set(
      m[1],
      m[2].split('\n').map((l) => l.trim()).filter(Boolean),
    );
  }
  return enums;
}

const sdl = readFileSync(SDL_PATH, 'utf8');
const types = parseTypes(sdl);
const enums = parseEnums(sdl);

// Escape for an MDX table cell. The backslash must go first: it is the escape
// character, so escaping `|` before `\` turns the input `a\|b` into `a\\|b`,
// which Markdown reads as a literal backslash followed by a live cell divider.
const esc = (s) =>
  s
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
const required = (t) => (t.endsWith('!') ? 'yes' : 'no');
const bare = (t) => t.replace(/[![\]]/g, '');

const out = [];
out.push(`---
title: Schema Reference
sidebar_label: Schema Reference
sidebar_position: 3
description: Every entity, field and type exposed by the Babylon vault indexer GraphQL API.
---

{/*
  GENERATED FILE — DO NOT EDIT BY HAND.
  Regenerate with: node scripts/gen-vault-indexer-docs.mjs
  Source of truth: static/schema/vault-indexer.graphql
*/}

# Schema Reference

Every entity exposed by the vault indexer, generated from the deployed schema.

Each entity has two resolvers:

- **Singular** — \`vault(id: "0x…")\` returns one record or \`null\`
- **Plural** — \`vaults(where:, orderBy:, orderDirection:, limit:, offset:)\` returns a page

A page always carries \`items\`, \`totalCount\` and \`pageInfo\`. \`limit\` caps at
1000; see [Limits and gotchas](./limits-and-gotchas.mdx) before writing a client.

:::note Types are lower-case
Ponder generates this API from the indexer's table definitions, so type names
match the table names and are lower-case (\`vault\`, not \`Vault\`). The plural of
\`stats\` is \`statss\` for the same reason — the generator appends an \`s\`.
:::
`);

for (const domain of DOMAINS) {
  out.push(`\n## ${domain.title}\n\n${domain.blurb}\n`);
  for (const [name, plural] of domain.entities) {
    const fields = types.get(name);
    if (!fields) {
      throw new Error(
        `Entity "${name}" is missing from the SDL. The deployed schema changed — ` +
          `re-run scripts/fetch-vault-indexer-schema.mjs and update DOMAINS in this script.`,
      );
    }
    out.push(`\n### \`${name}\`\n`);
    const blurb = TYPE_DESCRIPTIONS[name];
    if (blurb) out.push(`${blurb}\n`);
    out.push(`Query with \`${name}(…)\` or \`${plural}(…)\`.\n`);
    // Only widen the table where there is something to say. An empty Notes
    // column across 280-odd fields reads as unfinished rather than as complete.
    const annotated = fields.some((f) => FIELD_DESCRIPTIONS[`${name}.${f.name}`]);
    out.push(annotated ? `| Field | Type | Required | Notes |` : `| Field | Type | Required |`);
    out.push(annotated ? `| --- | --- | --- | --- |` : `| --- | --- | --- |`);
    for (const f of fields) {
      const label = f.args ? `${f.name}(…)` : f.name;
      const row = `| \`${label}\` | \`${esc(f.type)}\` | ${required(f.type)} |`;
      out.push(annotated ? `${row} ${esc(FIELD_DESCRIPTIONS[`${name}.${f.name}`] ?? '')} |` : row);
    }
    out.push('');
    // Surface enum values inline — a reader filtering on `status` needs them here,
    // not in a separate section.
    const used = [...new Set(fields.map((f) => bare(f.type)).filter((t) => enums.has(t)))];
    for (const e of used) {
      out.push(`\n\`${e}\` values: ${enums.get(e).map((v) => `\`${v}\``).join(' · ')}\n`);
    }
  }
}

out.push(`\n## Full SDL\n`);
out.push(
  `The complete schema is committed at [\`/schema/vault-indexer.graphql\`](pathname:///schema/vault-indexer.graphql).\n`,
);
out.push(
  `Introspection is available but depth-capped — see [Limits and gotchas](./limits-and-gotchas.mdx) for the four short queries that reconstruct it.\n`,
);

// The SDL is parsed with regexes, not a GraphQL parser. That is fine for
// Ponder's mechanical output, but a regex that stops matching does not throw —
// it silently yields fewer fields, and a schema reference that quietly loses a
// field is indistinguishable from a correct one to a reader. Count the field
// lines in the raw SDL and compare. This turns a silent loss into a loud stop.
const parsedFields = [...types.values()].reduce((n, f) => n + f.length, 0);

/**
 * Count field lines inside `type` blocks with a line scanner rather than the
 * parser's own regex.
 *
 * Using the same pattern for both sides would make the check self-consistent and
 * therefore useless: a type the parser skips would be skipped by the counter
 * too, and the totals would agree while a whole type was missing. This scanner
 * only needs a line to START with `type `, so `type Vault implements Node {`
 * still contributes — which is precisely the case that must be caught.
 */
function countTypeFieldLines(text) {
  let inType = false;
  let n = 0;
  for (const raw of text.split('\n')) {
    if (!inType) {
      if (/^type\s/.test(raw) && raw.includes('{')) inType = true;
      continue;
    }
    if (raw.startsWith('}')) inType = false;
    else if (/^\s{2}\w+(\([^)]*\))?:\s*\S/.test(raw)) n++;
  }
  return n;
}

const typeBlockFieldLines = countTypeFieldLines(sdl);

if (parsedFields !== typeBlockFieldLines) {
  console.error(
    `error: parsed ${parsedFields} fields but the SDL's type blocks contain ` +
      `${typeBlockFieldLines} field lines. The parser dropped ${typeBlockFieldLines - parsedFields}. ` +
      `Do not publish this — the schema reference would be silently incomplete.`,
  );
  process.exit(1);
}

writeFileSync(OUT_PATH, out.join('\n'));
console.log(
  `Wrote ${OUT_PATH}\n  entities: ${DOMAINS.reduce((n, d) => n + d.entities.length, 0)}` +
    `\n  types parsed: ${types.size}\n  enums parsed: ${enums.size}` +
    `\n  fields parsed: ${parsedFields}/${typeBlockFieldLines} (must match)`,
);
