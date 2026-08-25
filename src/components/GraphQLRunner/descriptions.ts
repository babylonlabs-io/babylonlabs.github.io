/**
 * Schema prose for the explorer's Docs panel.
 *
 * The text itself lives in `scripts/vault-indexer-descriptions.json`, which is
 * also what `scripts/gen-vault-indexer-docs.mjs` renders into the Schema
 * Reference page. Keeping one file means the explorer and the reference cannot
 * drift: an edit shows up in both, and neither can quietly gain prose the other
 * lacks.
 *
 * The import is resolved at build time, so this costs no extra request.
 */
import descriptions from '@site/scripts/vault-indexer-descriptions.json';

type Descriptions = {
  types?: Record<string, string>;
  fields?: Record<string, string>;
  pageFields?: Record<string, string>;
};

const data = descriptions as Descriptions;

/** Entity descriptions, keyed by type name. */
export const TYPE_DESCRIPTIONS: Record<string, string> = data.types ?? {};

/** Field descriptions, keyed by `TypeName.fieldName`. */
export const FIELD_DESCRIPTIONS: Record<string, string> = data.fields ?? {};

/** Descriptions shared by every generated `*Page` wrapper. */
export const PAGE_FIELD_DESCRIPTIONS: Record<string, string> = data.pageFields ?? {};
