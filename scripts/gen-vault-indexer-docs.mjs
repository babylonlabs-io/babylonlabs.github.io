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
const OUT_PATH = resolve(root, 'docs/trustless-bitcoin-vault/apis/schema-reference.mdx');

// Entity roots grouped by domain. Ponder derives the plural resolver by appending
// "s", which is why `stats` pluralises to the odd-looking `statss`.
const DOMAINS = [
  {
    title: 'Core vault',
    blurb:
      'The vault lifecycle and the actors that secure it. These entities exist regardless of which DeFi application a vault is used with.',
    entities: [
      ['vault', 'vaults', 'A single vault instance and its full lifecycle state.'],
      ['vaultActivity', 'vaultActivitys', 'Append-only event log of every action taken against a vault.'],
      ['vaultProvider', 'vaultProviders', 'A registered entity that provides vault services.'],
      ['vaultProviderStats', 'vaultProviderStatss', 'Aggregated counters per vault provider.'],
      ['vaultKeeper', 'vaultKeepers', 'A per-application participant in the vault security model.'],
      ['vaultKeeperApplication', 'vaultKeeperApplications', 'Join between a vault keeper and an application.'],
      ['universalChallenger', 'universalChallengers', 'A system-wide participant able to challenge invalid claims.'],
      ['universalChallengerVersion', 'universalChallengerVersions', 'Versioned challenger set.'],
      ['feeConfig', 'feeConfigs', 'Fee configuration. Currently empty on testnet — see Limits and gotchas.'],
      ['vaultFeeEscrow', 'vaultFeeEscrows', 'Escrowed fees for one vault. One row per vault.'],
      ['application', 'applications', 'A DeFi protocol integrated with the vault system.'],
      ['token', 'tokens', 'A token known to the indexer.'],
      ['stats', 'statss', 'Protocol-wide totals. Singleton.'],
      ['protocolState', 'protocolStates', 'Protocol-level singleton state, such as the active vault-core version.'],
    ],
  },
  {
    title: 'Aave application',
    blurb:
      'State for the Aave v4 integration — the first application built on TBV. A vault used as Aave collateral appears in both domains.',
    entities: [
      ['aavePosition', 'aavePositions', 'A depositor position, keyed by depositor address.'],
      ['aavePositionCollateral', 'aavePositionCollaterals', 'One vault pledged as collateral against a position.'],
      ['aaveVaultStatus', 'aaveVaultStatuss', 'Per-vault usage status within Aave.'],
      ['aaveUserProxy', 'aaveUserProxys', 'The proxy contract deployed for a user.'],
      ['aaveReserve', 'aaveReserves', 'An Aave reserve and its parameters.'],
      ['aaveConfig', 'aaveConfigs', 'Aave integration configuration. Singleton.'],
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

const esc = (s) => s.replace(/\|/g, '\\|').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const required = (t) => (t.endsWith('!') ? 'yes' : 'no');
const bare = (t) => t.replace(/[![\]]/g, '');

const out = [];
out.push(`---
title: Schema Reference
sidebar_label: Schema Reference
sidebar_position: 2
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
  for (const [name, plural, blurb] of domain.entities) {
    const fields = types.get(name);
    if (!fields) {
      throw new Error(
        `Entity "${name}" is missing from the SDL. The deployed schema changed — ` +
          `re-run scripts/fetch-vault-indexer-schema.mjs and update DOMAINS in this script.`,
      );
    }
    out.push(`\n### \`${name}\`\n`);
    out.push(`${blurb}\n`);
    out.push(`Query with \`${name}(…)\` or \`${plural}(…)\`.\n`);
    out.push(`| Field | Type | Required |`);
    out.push(`| --- | --- | --- |`);
    for (const f of fields) {
      const label = f.args ? `${f.name}(…)` : f.name;
      out.push(`| \`${label}\` | \`${esc(f.type)}\` | ${required(f.type)} |`);
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
  `The complete schema is committed at [\`/schema/vault-indexer.graphql\`](/schema/vault-indexer.graphql).\n`,
);
out.push(
  `Introspection is available but depth-capped — see [Limits and gotchas](./limits-and-gotchas.mdx) for the four short queries that reconstruct it.\n`,
);

writeFileSync(OUT_PATH, out.join('\n'));
console.log(
  `Wrote ${OUT_PATH}\n  entities: ${DOMAINS.reduce((n, d) => n + d.entities.length, 0)}` +
    `\n  types parsed: ${types.size}\n  enums parsed: ${enums.size}`,
);
