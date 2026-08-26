import React, { useEffect, useMemo, useState } from 'react';
import { GraphiQL } from 'graphiql';
import { useColorMode } from '@docusaurus/theme-common';
import Link from '@docusaurus/Link';

import {
  ENDPOINT,
  createFetcher,
  usePresets,
  useVaultIndexerSchema,
  type Preset,
} from './schema';

import 'graphiql/style.css';
import styles from './FullExplorer.module.css';

type Section = { section: string | null; presets: Preset[] };
type Group = { group: string; sections: Section[] };

/**
 * Nest presets as page → workflow → step.
 *
 * The generated order is meaningful (Step 1 before Step 2), so this preserves
 * first-seen order at both levels rather than sorting.
 */
function nest(presets: Preset[]): Group[] {
  const groups: Group[] = [];
  for (const preset of presets) {
    let group = groups.find((g) => g.group === preset.group);
    if (!group) {
      group = { group: preset.group, sections: [] };
      groups.push(group);
    }
    let section = group.sections.find((s) => s.section === preset.section);
    if (!section) {
      section = { section: preset.section, presets: [] };
      group.sections.push(section);
    }
    section.presets.push(preset);
  }
  return groups;
}

const STARTER = `# Pick an example on the left, or write your own.
# Ctrl-Space completes field names. The Docs panel describes every entity.
{
  statss(limit: 1) {
    items {
      totalAvailableSats
      availableVaultCount
    }
  }
}`;

function initialQuery(): string {
  try {
    const linkedQuery = new URLSearchParams(window.location.search).get(
      'query'
    );
    return linkedQuery?.trim() ? linkedQuery : STARTER;
  } catch {
    return STARTER;
  }
}

function Chevron({ pointsLeft }: { pointsLeft: boolean }): JSX.Element {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={pointsLeft ? 'M7.5 2 4 6l3.5 4' : 'M4.5 2 8 6l-3.5 4'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FullExplorer(): JSX.Element {
  const { colorMode } = useColorMode();
  const { schema, settled } = useVaultIndexerSchema();
  const presets = usePresets();
  const fetcher = useMemo(() => createFetcher(), []);

  const [query, setQuery] = useState(initialQuery);
  const [active, setActive] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const groups = useMemo(() => nest(presets), [presets]);

  useEffect(() => {
    const name = /^query\d+$/.test(window.name) ? window.name : null;
    if (!name) {
      return undefined;
    }

    const previousTitle = document.title;
    document.title = name;
    return () => {
      document.title = previousTitle;
    };
  }, []);

  if (collapsed) {
    return (
      <div className={styles.shell}>
        <div className={styles.rail}>
          <button
            type="button"
            className={styles.railButton}
            onClick={() => setCollapsed(false)}
            title="Show example queries"
            aria-label="Show example queries"
          >
            <Chevron pointsLeft={false} />
            <span className={styles.railLabel}>Examples</span>
          </button>
        </div>
        <div className={styles.editor}>
          {settled ? (
            <GraphiQL
              fetcher={fetcher}
              query={query}
              onEditQuery={setQuery}
              schema={schema}
              forcedTheme={colorMode === 'dark' ? 'dark' : 'light'}
              defaultEditorToolsVisibility={false}
            />
          ) : (
            <div className={styles.loading}>Loading schema…</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.presets}>
        <div className={styles.presetsHeader}>
          <div className={styles.headerRow}>
            <h1 className={styles.heading}>Vault Indexer Explorer</h1>
            <button
              type="button"
              className={styles.collapse}
              onClick={() => setCollapsed(true)}
              title="Hide example queries"
              aria-label="Hide example queries"
            >
              <Chevron pointsLeft />
            </button>
          </div>
          <p className={styles.blurb}>
            Testnet, read-only, no key required. Every example below is executed
            against the live endpoint in CI.
          </p>
          <code className={styles.endpoint}>{ENDPOINT}</code>
        </div>

        <nav className={styles.presetList} aria-label="Example queries">
          {groups.map((group) => (
            <section key={group.group} className={styles.group}>
              <h2 className={styles.groupTitle}>{group.group}</h2>
              {group.sections.map((section) => (
                <div key={section.section ?? '_'} className={styles.section}>
                  {section.section && (
                    <h3 className={styles.sectionTitle}>{section.section}</h3>
                  )}
                  <ul className={styles.steps}>
                    {section.presets.map((preset, i) => {
                      const key = `${group.group}|${
                        section.section ?? '_'
                      }|${i}`;
                      return (
                        <li key={key}>
                          <button
                            type="button"
                            className={
                              active === key
                                ? `${styles.preset} ${styles.presetActive}`
                                : styles.preset
                            }
                            onClick={() => {
                              setQuery(preset.query);
                              setActive(key);
                            }}
                          >
                            {preset.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </section>
          ))}
          {presets.length === 0 && (
            <p className={styles.blurb}>Loading examples…</p>
          )}
        </nav>

        <footer className={styles.presetsFooter}>
          <Link to="/trustless-bitcoin-vault/apis/use-cases">Use cases</Link>
          <Link to="/trustless-bitcoin-vault/apis/schema-reference">
            Schema
          </Link>
          <Link to="/trustless-bitcoin-vault/apis/limits-and-gotchas">
            Limits
          </Link>
        </footer>
      </aside>

      <div className={styles.editor}>
        {settled ? (
          <GraphiQL
            fetcher={fetcher}
            query={query}
            onEditQuery={setQuery}
            schema={schema}
            forcedTheme={colorMode === 'dark' ? 'dark' : 'light'}
            defaultEditorToolsVisibility={false}
          />
        ) : (
          <div className={styles.loading}>Loading schema…</div>
        )}
      </div>
    </div>
  );
}
