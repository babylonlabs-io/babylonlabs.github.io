import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Tag } from '@styled-icons/bootstrap/Tag';
import Admonition from '@theme/Admonition';

function extractRepoInfo(url) {
  const urlParts = url.split('/');
  const owner = urlParts[3];
  const repo = urlParts[4];
  const filePath = urlParts.slice(7).join('/');
  return { owner, repo, filePath };
}

function getQueryParam(name) {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

const generateId = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-');
};

// Module-scope component — stable reference avoids unnecessary remounts
function HeadingWithAnchor({ level, children, idCounterMap }) {
  const baseId = generateId(String(children));
  const count = idCounterMap.get(baseId) || 0;
  idCounterMap.set(baseId, count + 1);
  const id = count === 0 ? baseId : `${baseId}-${count}`;
  const HeadingTag = `h${level}`;
  return (
    <HeadingTag id={id} className="anchor-heading">
      {children}
      <a href={`#${id}`} className="hash-link" aria-label={`Direct link to ${String(children)}`}>&#8203;</a>
    </HeadingTag>
  );
}

const defaultReleaseVersions = {};

const sortBySemVer = (a, b) => {
  const [aVer, bVer] = [a.key, b.key].map(v => v.replace(/^v/, '').split('.').map(Number));
  for (let i = 0; i < 3; i++) {
    if (aVer[i] > bVer[i]) return -1;
    if (aVer[i] < bVer[i]) return 1;
  }
  return 0;
};

export default function RemoteMD({
                                   rawUrl,
                                   releaseVersions = defaultReleaseVersions,
                                   defaultRelease = '',
                                   hideRelease = false
                                 }) {
  const [markdown, setMarkdown] = React.useState('');
  const [releases, setReleases] = React.useState([]); // [{key, label, url}]
  const [releasesLoaded, setReleasesLoaded] = React.useState(hideRelease);
  const [selectedRelease, setSelectedRelease] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [currentMdUrl, setCurrentMdUrl] = React.useState(rawUrl);
  const lastH2 = React.useRef('');
  const h1Count = React.useRef(0);
  const idCounterMap = React.useRef(new Map());

  // Capture URL hash on mount for one-time anchor scroll
  const initialHashRef = React.useRef(
    typeof window !== 'undefined' ? window.location.hash : ''
  );
  const hasScrolledRef = React.useRef(false);

  const resolveRelativePath = (href, renderUrl) => {
    const [path, anchor] = href.split('#');
    let baseUrl = renderUrl.replace(/\/[^/]+$/, '');
    let resolvedPath;

    if (path.startsWith('./')) {
      resolvedPath = `${baseUrl}/${path.substring(2)}`;
    } else if (path.startsWith('../')) {
      const levels = (path.match(/\.\.\//g) || []).length;
      for (let i = 0; i < levels; i++) {
        baseUrl = baseUrl.replace(/\/[^/]+$/, '');
      }
      const cleanPath = path.replace(/(\.\.\/)*/g, '');
      resolvedPath = `${baseUrl}/${cleanPath}`;
    } else {
      resolvedPath = path;
    }
    return anchor ? `${resolvedPath}#${anchor}` : resolvedPath;
  };

  // Reset render-pass counters before ReactMarkdown processes headings
  h1Count.current = 0;
  lastH2.current = '';
  idCounterMap.current.clear();

  const components = {
    img: ({ node }) => {
      const { alt, src } = node.properties;
      let rootUrl = (currentMdUrl || rawUrl).replace(/\/[^/]+\.md$/, '/');
      const newSrc =
        src && src.startsWith('./') ? `${rootUrl}${src.substring(1)}` : src;
      return <img src={newSrc} alt={alt} />;
    },
    h1: ({ children }) => {
      h1Count.current += 1;
      if (h1Count.current === 1) return null;
      return <HeadingWithAnchor level={1} idCounterMap={idCounterMap.current}>{children}</HeadingWithAnchor>;
    },
    h2: ({ children }) => {
      lastH2.current = String(children);
      if (String(children).includes('Table of Contents')) return null;
      return <HeadingWithAnchor level={2} idCounterMap={idCounterMap.current}>{children}</HeadingWithAnchor>;
    },
    h3: ({ children }) => {
      return <HeadingWithAnchor level={3} idCounterMap={idCounterMap.current}>{children}</HeadingWithAnchor>;
    },
    h4: ({ children }) => {
      return <HeadingWithAnchor level={4} idCounterMap={idCounterMap.current}>{children}</HeadingWithAnchor>;
    },
    h5: ({ children }) => {
      return <HeadingWithAnchor level={5} idCounterMap={idCounterMap.current}>{children}</HeadingWithAnchor>;
    },
    h6: ({ children }) => {
      return <HeadingWithAnchor level={6} idCounterMap={idCounterMap.current}>{children}</HeadingWithAnchor>;
    },
    table: ({ children }) => (
      <div className="remote-md-table-wrapper">
        <table>{children}</table>
      </div>
    ),
    ol: ({ children }) => {
      return lastH2.current === 'Table of Contents' ? null : (
        <ol>{children}</ol>
      );
    },
    a: ({ node, children }) => {
      const { href } = node.properties;
      if (!href) return <a>{children}</a>;
      const resolvedHref = href.startsWith('.')
        ? resolveRelativePath(href, currentMdUrl || rawUrl)
        : href;
      return <a href={resolvedHref}>{children}</a>;
    },
  };

  React.useEffect(() => {
    let cancelled = false;

    async function fetchReleases() {
      try {
        const { owner, repo } = extractRepoInfo(rawUrl);
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/releases`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        const stableReleases = data.filter(release =>
          !release.tag_name.includes('-') && !release.prerelease
        );

        const allReleases = [
          ...Object.entries(releaseVersions).map(([key, url]) => ({
            key,
            label: key,
            url,
            isCustom: true
          })),
          ...stableReleases.map(release => {
            let url;
            if (rawUrl.includes('release/')) {
              url = rawUrl.replace(/release\/v[\d.]+\w*/, `${release.tag_name}`);
            } else {
              url = rawUrl.replace(/refs\/heads\/[^/]+/, release.tag_name);
            }
            return {
              key: release.tag_name,
              label: release.tag_name,
              url,
              publishedAt: release.published_at
            }
          })
        ];

        const customReleases = allReleases.filter(r => r.isCustom);
        const apiReleases = allReleases.filter(r => !r.isCustom).sort(sortBySemVer);

        if (!cancelled) {
          if (apiReleases.length > 0) {
            const latestMajor = apiReleases[0].key.split('.')[0];
            const sameMajorReleases = apiReleases.filter(r =>
              r.key.split('.')[0] === latestMajor
            );
            setReleases(customReleases.concat(sameMajorReleases));
          } else {
            setReleases([...customReleases, ...apiReleases]);
          }
        }
      } catch {
        // Release fetch failed — releasesLoaded will trigger rawUrl fallback
      } finally {
        if (!cancelled) setReleasesLoaded(true);
      }
    }

    if (!hideRelease) fetchReleases();
    return () => {
      cancelled = true;
    };
  }, [rawUrl, releaseVersions, hideRelease]);

  const fetchMarkdown = async (mdUrl) => {
    setLoading(true);
    try {
      setCurrentMdUrl(mdUrl);
      const response = await fetch(mdUrl);
      if (!response.ok) throw new Error('Document not found');
      const text = await response.text();
      setMarkdown(text);
      setErrorMessage('');
    } catch (e) {
      setMarkdown('');
      setErrorMessage('Documentation not found for the selected release.');
    } finally {
      setLoading(false);
    }
  };

  // Anchor scroll — fires once after the first meaningful content load
  React.useEffect(() => {
    if (loading || !markdown || hasScrolledRef.current) return;
    const hash = initialHashRef.current;
    if (!hash) {
      hasScrolledRef.current = true;
      return;
    }

    // useEffect runs after paint, so DOM headings are already rendered
    const el = document.getElementById(hash.slice(1));
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      hasScrolledRef.current = true;
    }
    // If element not found, keep trying on next content load (e.g. version-specific
    // content may have the heading even if the initial rawUrl fallback did not)
  }, [loading, markdown]);

  // Determine initial release from URL param or default
  React.useEffect(() => {
    if (hideRelease || !releasesLoaded || releases.length === 0) return;

    const urlParam = getQueryParam('release');
    let initialKey = urlParam;

    if (initialKey && !releases.some(r => r.key === initialKey)) {
      initialKey = '';
    }

    if (!initialKey && defaultRelease) {
      if (releases.some(r => r.key === defaultRelease)) {
        initialKey = defaultRelease;
      }
    }

    if (!initialKey && releases.length > 0) {
      initialKey = releases.find(r => !r.isCustom)?.key || releases[0].key;
    }

    setSelectedRelease(initialKey);
  }, [releases, defaultRelease, hideRelease, releasesLoaded]);

  // Fetch markdown for the selected release (or rawUrl as fallback)
  React.useEffect(() => {
    if (hideRelease) {
      fetchMarkdown(rawUrl);
      return;
    }
    if (!releasesLoaded) return; // Still loading releases — wait
    if (releases.length === 0) {
      // No releases found, fall back to rawUrl
      fetchMarkdown(rawUrl);
      return;
    }
    if (!selectedRelease) return; // Release selection pending

    const found = releases.find(r => r.key === selectedRelease);
    if (found) {
      fetchMarkdown(found.url);
    } else {
      setMarkdown('');
      setErrorMessage('Selected release not found');
    }
  }, [selectedRelease, releases, releasesLoaded, hideRelease, rawUrl]);

  const handleReleaseChange = (event) => {
    const key = event.target.value;
    setSelectedRelease(key);
    // User-driven version change — don't re-scroll to initial anchor
    hasScrolledRef.current = true;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('release', key);
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}?${params}`
      );
    }
  };

  const handleTagClick = () => {
    const found = releases.find(r => r.key === selectedRelease);
    if (found && !found.isCustom) {
      const { owner, repo } = extractRepoInfo(rawUrl);
      window.open(`https://github.com/${owner}/${repo}/releases/tag/${selectedRelease}`, '_blank');
    }
  };

  return (
    <>
      {!hideRelease && releases.length > 0 && (
        <div style={{ marginBottom: '20px' }} className="babylon-dropdown">
          <Tag
            className="h-5"
            onClick={handleTagClick}
            style={{ cursor: 'pointer', marginRight: 8 }}
          />
          {releases.length === 1 ? (
            <span
              onClick={handleTagClick}
              style={{ cursor: 'pointer' }}
            >
              Release tag: <strong>{releases[0].label}</strong>
            </span>
          ) : (
            <>
              <label htmlFor="version-select" style={{ marginRight: 8 }}>Release tag: </label>
              <select
                id="version-select"
                value={selectedRelease}
                onChange={handleReleaseChange}
              >
                {releases.map((release) => (
                  <option key={release.key} value={release.key}>
                    {release.label}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      )}

      {errorMessage && !loading && (
        <Admonition type="warning" title="Error">
          {errorMessage}
        </Admonition>
      )}

      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]} components={components}>{markdown}</ReactMarkdown>

      {!errorMessage && !loading && (
        <Admonition>
          This documentation's source is hosted on github.com.{' '}
          <a
            href={currentMdUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View source and contribute
          </a>
        </Admonition>
      )}
    </>
  );
}
