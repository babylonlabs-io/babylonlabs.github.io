import { useEffect, useMemo, useState } from 'react';
import { buildSchema, type GraphQLObjectType, type GraphQLSchema } from 'graphql';
import useBaseUrl from '@docusaurus/useBaseUrl';

import { FIELD_DESCRIPTIONS, PAGE_FIELD_DESCRIPTIONS, TYPE_DESCRIPTIONS } from './descriptions';

/**
 * The public testnet vault indexer endpoint.
 *
 * The browser sends its own User-Agent, so the 403 trap that catches default
 * library user-agents does not apply here.
 */
export const ENDPOINT = 'https://babylon-vault-indexer-api.testnet.babylonlabs.io/';

/** A plain POST fetcher. The endpoint serves no subscriptions. */
export function createFetcher() {
  return async (graphQLParams: Record<string, unknown>) => {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(graphQLParams),
    });
    // GraphQL errors arrive as HTTP 200 with an `errors` key, so return the
    // body whatever the status is.
    return response.json();
  };
}

/**
 * Attach human descriptions to a schema built from the SDL.
 *
 * Ponder generates the schema from table definitions and emits essentially no
 * descriptions, so without this GraphiQL's Docs panel is a bare list of names.
 * Mutating `description` after `buildSchema` is deliberate: it keeps the
 * deployed SDL as the sole owner of the schema's *shape*, while prose lives in
 * `descriptions.ts`. A field that disappears upstream simply stops being
 * annotated, so a stale description can never invent a field.
 */
function annotate(schema: GraphQLSchema): GraphQLSchema {
  for (const [typeName, description] of Object.entries(TYPE_DESCRIPTIONS)) {
    const type = schema.getType(typeName);
    if (type) (type as { description?: string }).description = description;
  }

  for (const [path, description] of Object.entries(FIELD_DESCRIPTIONS)) {
    const [typeName, fieldName] = path.split('.');
    const type = schema.getType(typeName) as GraphQLObjectType | undefined;
    const field = type?.getFields?.()[fieldName];
    if (field) field.description = description;
  }

  // Ponder generates one `<entity>Page` wrapper per entity. Annotating them by
  // hand would mean repeating the same three lines twenty times.
  for (const type of Object.values(schema.getTypeMap())) {
    if (!type.name.endsWith('Page')) continue;
    const fields = (type as GraphQLObjectType).getFields?.();
    if (!fields) continue;
    for (const [fieldName, description] of Object.entries(PAGE_FIELD_DESCRIPTIONS)) {
      if (fields[fieldName]) fields[fieldName].description = description;
    }
  }

  return schema;
}

type SchemaState = {
  /** Null when the SDL could not be loaded; GraphiQL still runs queries. */
  schema: GraphQLSchema | null;
  /**
   * True once the load has finished, successfully or not.
   *
   * GraphiQL introspects the moment it mounts, and this endpoint caps depth at
   * 10 while the introspection query is depth 21. Mounting before the SDL is
   * settled therefore prints a depth error into the response pane before the
   * reader has done anything. Callers should wait for this.
   */
  settled: boolean;
};

/** Load the committed SDL and return it annotated. */
export function useVaultIndexerSchema(): SchemaState {
  const sdlUrl = useBaseUrl('/schema/vault-indexer.graphql');
  const [state, setState] = useState<SchemaState>({ schema: null, settled: false });

  useEffect(() => {
    let cancelled = false;
    fetch(sdlUrl)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((sdl) => {
        if (!cancelled) setState({ schema: annotate(buildSchema(sdl)), settled: true });
      })
      .catch(() => {
        if (!cancelled) setState({ schema: null, settled: true });
      });
    return () => {
      cancelled = true;
    };
  }, [sdlUrl]);

  return state;
}

export type Preset = {
  group: string;
  section: string | null;
  title: string;
  query: string;
};

/** Load the preset queries harvested from the documentation at build time. */
export function usePresets(): Preset[] {
  const url = useBaseUrl('/vault-indexer-presets.json');
  const [presets, setPresets] = useState<Preset[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setPresets(data);
      })
      .catch(() => {
        /* the explorer is still usable with no presets */
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return useMemo(() => presets, [presets]);
}
