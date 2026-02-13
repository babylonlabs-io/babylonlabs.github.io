import React from 'react';
import ReactMarkdown from 'react-markdown';
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
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '-');
};

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
  const [selectedRelease, setSelectedRelease] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [currentMdUrl, setCurrentMdUrl] = React.useState(rawUrl);
  const lastH2 = React.useRef('');

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

  const components = {
    img: ({ node }) => {
      const { alt, src } = node.properties;
      let rootUrl = (currentMdUrl || rawUrl).replace(/\/[^/]+\.md$/, '/');
      const newSrc =
        src && src.startsWith('./') ? `${rootUrl}${src.substring(1)}` : src;
      return <img src={newSrc} alt={alt} />;
    },
    h1: ({ children }) => {
      let count = 0;
      const id = generateId(String(children));
      return count++ === 0 ? null : <h1 id={id}>{children}</h1>;
    },
    h2: ({ children }) => {
      lastH2.current = String(children);
      const id = generateId(String(children));
      return String(children).includes('Table of Contents') ? null : (
        <h2 id={id}>{children}</h2>
      );
    },
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
    h3: ({ children }) => {
      const id = generateId(String(children));
      return <h3 id={id}>{children}</h3>;
    },
  };

  React.useEffect(() => {
    let cancelled = false;

    async function fetchReleases() {
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
      const sortedReleases = [...customReleases, ...apiReleases];

      if (apiReleases.length > 0) {
        const latestMajor = apiReleases[0].key.split('.')[0];
        const sameMajorReleases = apiReleases.filter(r =>
          r.key.split('.')[0] === latestMajor
        );
        const finalReleases = customReleases.concat(sameMajorReleases);
        setReleases(finalReleases);
      } else {
        setReleases(sortedReleases);
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

  React.useEffect(() => {
    if (hideRelease || releases.length <= 1) return;

    const urlParam = getQueryParam('release');
    let initialKey = urlParam;

    if (initialKey && !releases.some(r => r.key === initialKey)) {
      initialKey = '';
    }

    if (!initialKey && defaultRelease) {
      // Only use defaultRelease if it exists in the available releases
      if (releases.some(r => r.key === defaultRelease)) {
        initialKey = defaultRelease;
      }
    }

    if (!initialKey && releases.length > 0) {
      initialKey = releases.find(r => !r.isCustom)?.key || releases[0].key;
    }

    setSelectedRelease(initialKey);
  }, [releases, defaultRelease, hideRelease]);

  React.useEffect(() => {
    if (hideRelease || releases.length <= 1) {
      fetchMarkdown(rawUrl);
      return;
    }

    const found = releases.find(r => r.key === selectedRelease);
    if (found) {
      fetchMarkdown(found.url);
    } else {
      setMarkdown('');
      setErrorMessage('Selected release not found');
    }
  }, [selectedRelease, releases, hideRelease, rawUrl]);

  const handleReleaseChange = (event) => {
    const key = event.target.value;
    setSelectedRelease(key);
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
      {!hideRelease && releases.length > 1 && (
        <div style={{ marginBottom: '20px' }} className="babylon-dropdown">
          <Tag
            className="h-5"
            onClick={handleTagClick}
            style={{ cursor: 'pointer', marginRight: 8 }}
          />
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
        </div>
      )}

      {errorMessage && !loading && (
        <Admonition type="warning" title="Error">
          {errorMessage}
        </Admonition>
      )}

      <ReactMarkdown components={components}>{markdown}</ReactMarkdown>

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