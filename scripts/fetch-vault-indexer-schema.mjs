#!/usr/bin/env node
/**
 * Introspect the deployed vault indexer and write static/schema/vault-indexer.graphql.
 *
 * The endpoint caps query depth at 10 (src/api/index.ts in babylon-vault-indexer),
 * so the standard getIntrospectionQuery() — depth 21 — is rejected outright. This
 * script splits introspection into four shallower queries that each stay under the
 * cap, then reassembles the SDL locally.
 *
 * Cloudflare in front of the endpoint 403s default library user-agents with no
 * GraphQL error body, so a custom UA is mandatory rather than cosmetic.
 *
 * Usage:
 *   node scripts/fetch-vault-indexer-schema.mjs            # write the SDL
 *   node scripts/fetch-vault-indexer-schema.mjs --check    # exit 1 if it drifted
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_PATH = resolve(root, 'static/schema/vault-indexer.graphql');
const ENDPOINT =
  process.env.VAULT_INDEXER_ENDPOINT ??
  'https://babylon-vault-indexer-api.testnet.babylonlabs.io/';
const USER_AGENT = 'babylonlabs-docs-schema-sync/1.0 (+https://docs.babylonlabs.io)';

const TYPE_REF = 'kind name ofType { kind name ofType { kind name ofType { kind name } } }';

// Four depth-safe queries. Each stays at or under depth 7; the cap is 10.
const QUERIES = {
  enums: `{ __schema { types { kind name description enumValues(includeDeprecated:true){ name description } } } }`,
  fields: `{ __schema { types { name fields(includeDeprecated:true){ name description type { ${TYPE_REF} } } } } }`,
  args: `{ __schema { types { name fields(includeDeprecated:true){ name args { name description defaultValue type { ${TYPE_REF} } } } } } }`,
  inputs: `{ __schema { types { name inputFields { name description defaultValue type { ${TYPE_REF} } } } } }`,
};

async function gql(query) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': USER_AGENT },
    body: JSON.stringify({ query }),
  });
  if (res.status === 403) {
    throw new Error(
      `403 from the edge. This is almost always a blocked User-Agent, not an auth or outage problem.`,
    );
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${ENDPOINT}`);
  const body = await res.json();
  if (body.errors) throw new Error(`GraphQL error: ${JSON.stringify(body.errors)}`);
  return body.data.__schema.types;
}

/** Render a TypeRef (kind/name/ofType chain) back into GraphQL type syntax. */
function ref(t) {
  if (!t) return 'Unknown';
  if (t.kind === 'NON_NULL') return `${ref(t.ofType)}!`;
  if (t.kind === 'LIST') return `[${ref(t.ofType)}]`;
  return t.name;
}

function buildSdl({ enums, fields, args, inputs }) {
  const byName = new Map();
  for (const t of enums) byName.set(t.name, { ...t });
  for (const t of fields) Object.assign(byName.get(t.name), { fields: t.fields });
  for (const t of inputs) Object.assign(byName.get(t.name), { inputFields: t.inputFields });

  const argMap = new Map();
  for (const t of args) for (const f of t.fields ?? []) argMap.set(`${t.name}.${f.name}`, f.args);

  const out = [];
  for (const t of [...byName.values()].sort((a, b) => a.name.localeCompare(b.name))) {
    if (t.name.startsWith('__')) continue;
    if (t.description) out.push(`""" ${t.description} """`);
    if (t.kind === 'SCALAR') {
      out.push(`scalar ${t.name}`, '');
      continue;
    }
    if (t.kind === 'ENUM') {
      out.push(`enum ${t.name} {`, ...t.enumValues.map((v) => `  ${v.name}`), '}', '');
      continue;
    }
    const kw = t.kind === 'INPUT_OBJECT' ? 'input' : 'type';
    const list = t.kind === 'INPUT_OBJECT' ? t.inputFields : t.fields;
    out.push(`${kw} ${t.name} {`);
    for (const f of list ?? []) {
      const a = argMap.get(`${t.name}.${f.name}`) ?? [];
      const argStr = a.length
        ? `(${a
            .map((x) => `${x.name}: ${ref(x.type)}${x.defaultValue != null ? ` = ${x.defaultValue}` : ''}`)
            .join(', ')})`
        : '';
      if (f.description) out.push(`  """ ${f.description} """`);
      out.push(
        `  ${f.name}${argStr}: ${ref(f.type)}${f.defaultValue != null ? ` = ${f.defaultValue}` : ''}`,
      );
    }
    out.push('}', '');
  }
  return out.join('\n');
}

/**
 * Hash the schema's shape, ignoring cosmetic churn. Ponder does not guarantee a
 * stable field order, so hashing the raw SDL would open an empty PR whenever the
 * generator reordered output.
 */
export function shapeHash(sdl) {
  const normalised = sdl
    .split('\n')
    .filter((l) => !l.trim().startsWith('"""'))
    .map((l) => l.trim())
    .filter(Boolean)
    .sort()
    .join('\n');
  return createHash('sha256').update(normalised).digest('hex');
}

const [enumsT, fieldsT, argsT, inputsT] = await Promise.all([
  gql(QUERIES.enums),
  gql(QUERIES.fields),
  gql(QUERIES.args),
  gql(QUERIES.inputs),
]);

const sdl = buildSdl({ enums: enumsT, fields: fieldsT, args: argsT, inputs: inputsT });

if (process.argv.includes('--check')) {
  let current = '';
  try {
    current = readFileSync(OUT_PATH, 'utf8');
  } catch {
    console.log('changed=true');
    console.error('No committed SDL found.');
    process.exit(1);
  }
  const same = shapeHash(current) === shapeHash(sdl);
  console.log(`changed=${!same}`);
  console.error(same ? 'Schema unchanged.' : 'Schema CHANGED — regeneration needed.');
  process.exit(same ? 0 : 1);
}

writeFileSync(OUT_PATH, sdl);
const typeCount = (sdl.match(/^(type|input|enum|scalar) /gm) ?? []).length;
console.log(`Wrote ${OUT_PATH}\n  types: ${typeCount}\n  shape: ${shapeHash(sdl).slice(0, 16)}`);
