import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Tag } from '@styled-icons/bootstrap/Tag';
import Admonition from '@theme/Admonition';
import sanitizeHtml from 'sanitize-html';

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
  const [markdown, setMarkdown] = useState('');
  const [releases, setReleases] = useState([]);
  const [selectedRelease, setSelectedRelease] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentMdUrl, setCurrentMdUrl] = useState(rawUrl);
  const lastH2 = useRef('');
  const [headings, setHeadings] = useState([]);
  const [activeHeadingId, setActiveHeadingId] = useState('');
  const contentRef = useRef(null);
  const markdownRef = useRef(null);
  const [headerH1Height, setHeaderH1Height] = useState(0);
  const observerRef = useRef(null);
  const [anchorReady, setAnchorReady] = useState(false);
  const anchorNavScrollRef = useRef(0);
  const [forceExtract, setForceExtract] = useState(0);

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

  useEffect(() => {
    const getHeaderHeight = () => {
      const selectors = ['header', 'nav.navbar', '.site-header', 'h1:first-of-type'];
      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el) {
          const style = window.getComputedStyle(el);
          if (style.position === 'fixed' || style.position === 'sticky') {
            return el.offsetHeight;
          }
        }
      }
      return 60;
    };

    setHeaderH1Height(getHeaderHeight());

    const handleResize = () => {
      setHeaderH1Height(getHeaderHeight());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchMarkdown = async (mdUrl) => {
    setLoading(true);
    setHeadings([]);
    setAnchorReady(false);
    try {
      setCurrentMdUrl(mdUrl);
      const rawMdUrl = mdUrl.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
      const response = await fetch(rawMdUrl);
      if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
      const text = await response.text();
      setMarkdown(
        sanitizeHtml(text, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h2', 'h3', 'h4']),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt'],
            h2: ['id'],
            h3: ['id'],
            h4: ['id']
          }
        })
      );
      setErrorMessage('');

      setTimeout(() => {
        setForceExtract(prev => prev + 1);
      }, 500);
    } catch (e) {
      setMarkdown('');
      setErrorMessage('Documentation not found for the selected release.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchReleases() {
      const { owner, repo } = extractRepoInfo(rawUrl);
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/releases`;
      try {
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
              url = rawUrl.replace(/refs\/heads\/[^/]+/, release.tag_name)
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
        if (apiReleases.length > 0) {
          const latestMajor = apiReleases[0].key.split('.')[0];
          const sameMajorReleases = apiReleases.filter(r =>
            r.key.split('.')[0] === latestMajor
          );
          setReleases([...customReleases, ...sameMajorReleases]);
        } else {
          setReleases([...customReleases, ...apiReleases]);
        }
      } catch (err) {
        setReleases([]);
      }
    }

    if (!hideRelease) fetchReleases();
    return () => { cancelled = true; };
  }, [rawUrl, releaseVersions, hideRelease]);

  useEffect(() => {
    if (hideRelease || releases.length <= 1) return;

    const urlParam = getQueryParam('release');
    let initialKey = urlParam;

    if (initialKey && !releases.some(r => r.key === initialKey)) {
      initialKey = '';
    }
    if (!initialKey && defaultRelease) {
      initialKey = defaultRelease;
    }
    if (!initialKey && releases.length > 0) {
      initialKey = releases.find(r => !r.isCustom)?.key || releases[0].key;
    }

    setSelectedRelease(initialKey);
  }, [releases, defaultRelease, hideRelease]);

  useEffect(() => {
    if (hideRelease || releases.length <= 1) {
      fetchMarkdown(rawUrl);
      return;
    }

    const targetRelease = releases.find(r => r.key === selectedRelease);
    if (targetRelease) {
      fetchMarkdown(targetRelease.url);
    } else {
      setMarkdown('');
      setErrorMessage('Selected release not found');
      setLoading(false);
    }
  }, [selectedRelease, releases, hideRelease, rawUrl]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (loading || !markdown || !markdownRef.current) {
      return;
    }

    const extractHeadings = () => {
      if (!markdownRef.current) return;

      const headingElements = Array.from(markdownRef.current.querySelectorAll('h2, h3, h4'))
        .filter(el => {
          const text = el.textContent.trim();
          const isEmpty = text === '';
          const isToc = text.toLowerCase() === 'table of contents';
          return !isEmpty && !isToc;
        });

      if (headingElements.length > 0) {
        const extractedHeadings = headingElements.map(el => {
          let id = el.id;
          if (!id) {
            id = generateId(el.textContent);
            el.id = id;
          }
          return {
            id,
            text: el.textContent.trim(),
            level: parseInt(el.tagName.replace('H', ''), 10),
          };
        });

        setHeadings(extractedHeadings);
        return true;
      }
      return false;
    };

    const success = extractHeadings();

    if (!success) {
      const observer = new MutationObserver((mutations) => {
        const success = extractHeadings();
        if (success) {
          observer.disconnect();
          observerRef.current = null;
        }
      });

      observer.observe(markdownRef.current, {
        childList: true,
        subtree: true,
        attributes: true
      });
      observerRef.current = observer;
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, markdown, forceExtract]);

  useEffect(() => {
    if (headings.length > 0 && !loading) {
      setAnchorReady(true);
      if (typeof window !== 'undefined' && window.location.hash) {
        const hashId = window.location.hash.substring(1);
        setTimeout(() => {
          scrollToHeading(hashId);
        }, 100);
      }
    } else {
      setAnchorReady(false);
    }
  }, [headings.length, loading]);

  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window !== 'undefined' && window.location.hash && anchorReady) {
        const hashId = window.location.hash.substring(1);
        scrollToHeading(hashId);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [anchorReady]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current || headings.length === 0) return;

      const dropdownElement = document.querySelector('.babylon-dropdown');
      const dropdownH = dropdownElement ? dropdownElement.offsetHeight + 10 : 0;
      const fixedHeaderTotal = headerH1Height + dropdownH;
      const scrollPosition = window.scrollY - fixedHeaderTotal;

      let currentActiveId = '';
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        const element = document.getElementById(heading.id);
        if (!element) continue;

        const { offsetTop } = element;
        if (offsetTop <= scrollPosition) {
          currentActiveId = heading.id;
          break;
        }
      }

      if (currentActiveId !== activeHeadingId) {
        setActiveHeadingId(currentActiveId);
        if (currentActiveId && typeof window !== 'undefined') {
          window.history.replaceState(null, '', `#${currentActiveId}`);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeHeadingId, headings, headerH1Height]);

  const scrollToHeading = (id) => {
    let element = document.getElementById(id);
    if (!element) {
      const candidates = Array.from(document.querySelectorAll('h2, h3, h4'))
        .filter(el => generateId(el.textContent) === id);
      if (candidates.length > 0) {
        element = candidates[0];
      } else {
        return;
      }
    }

    const anchorNavEl = document.querySelector('.anchor-nav-container');
    if (anchorNavEl) {
      anchorNavScrollRef.current = anchorNavEl.scrollTop;
    }

    const dropdownElement = document.querySelector('.babylon-dropdown');
    const dropdownH = dropdownElement ? dropdownElement.offsetHeight - 40 : 0;
    const fixedHeaderTotal = headerH1Height + dropdownH;

    const getElementOffsetTop = (el) => {
      let offsetTop = 0;
      while (el) {
        offsetTop += el.offsetTop;
        el = el.offsetParent;
      }
      return offsetTop;
    };

    const elementOffset = getElementOffsetTop(element);
    const targetScrollTop = elementOffset - fixedHeaderTotal;

    window.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });

    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `#${id}`);
    }

    setTimeout(() => {
      setActiveHeadingId(id);
    }, 100);
  };

  const handleAnchorClick = (e, id) => {
    e.preventDefault();
    scrollToHeading(id);
  };

  const components = {
    img: ({ node }) => {
      const { alt, src } = node.properties;
      let rootUrl = (currentMdUrl || rawUrl).replace(/\/[^/]+\.md$/, '/');
      const newSrc = src && src.startsWith('./') ? `${rootUrl}${src.substring(1)}` : src;
      return <img src={newSrc} alt={alt} />;
    },
    h1: ({ children }) => {
      let count = 0;
      const id = generateId(String(children));
      return count++ === 0 ? null : <h1 id={id}>{children}</h1>;
    },
    h2: ({ children }) => {
      const text = String(children).trim();
      lastH2.current = text;
      const id = generateId(text);
      if (text.toLowerCase().includes('table of contents')) return null;
      return (
        <h2 id={id} style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
          <span style={{ marginRight: '8px' }}>{children}</span>
          <a
            href={`#${id}`}
            className="anchor-link"
            aria-label="Anchor link for heading"
            style={{
              opacity: 0.4,
              textDecoration: 'none',
              color: '#666',
              transition: 'opacity 0.2s',
              verticalAlign: 'middle'
            }}
            onMouseOver={(e) => { e.currentTarget.style.opacity = '1'; }}
            onMouseOut={(e) => { e.currentTarget.style.opacity = '0.4'; }}
            onClick={(e) => handleAnchorClick(e, id)}
          >
            #
          </a>
        </h2>
      );
    },
    ol: ({ children }) => {
      return lastH2.current.toLowerCase() === 'table of contents' ? null : <ol>{children}</ol>;
    },
    a: ({ node, children }) => {
      const { href } = node.properties;
      if (!href) return <a>{children}</a>;
      const resolvedHref = href.startsWith('.')
        ? resolveRelativePath(href, currentMdUrl || rawUrl)
        : href;
      return <a href={resolvedHref} target="_blank" rel="noopener noreferrer">{children}</a>;
    },
    h3: ({ children }) => {
      const text = String(children).trim();
      const id = generateId(text);
      return (
        <h3 id={id} style={{ position: 'relative', paddingLeft: '10px', display: 'inline-block', width: '100%' }}>
          <span style={{ marginRight: '8px' }}>{children}</span>
          <a
            href={`#${id}`}
            className="anchor-link"
            aria-label="Anchor link for heading"
            style={{
              opacity: 0.4,
              textDecoration: 'none',
              color: '#666',
              transition: 'opacity 0.2s',
              verticalAlign: 'middle'
            }}
            onMouseOver={(e) => { e.currentTarget.style.opacity = '1'; }}
            onMouseOut={(e) => { e.currentTarget.style.opacity = '0.4'; }}
            onClick={(e) => handleAnchorClick(e, id)}
          >
            #
          </a>
        </h3>
      );
    },
    h4: ({ children }) => {
      const text = String(children).trim();
      const id = generateId(text);
      return (
        <h4 id={id} style={{ position: 'relative', paddingLeft: '20px', display: 'inline-block', width: '100%' }}>
          <span style={{ marginRight: '8px' }}>{children}</span>
          <a
            href={`#${id}`}
            className="anchor-link"
            aria-label="Anchor link for heading"
            style={{
              opacity: 0.4,
              textDecoration: 'none',
              color: '#666',
              transition: 'opacity 0.2s',
              verticalAlign: 'middle'
            }}
            onMouseOver={(e) => { e.currentTarget.style.opacity = '1'; }}
            onMouseOut={(e) => { e.currentTarget.style.opacity = '0.4'; }}
            onClick={(e) => handleAnchorClick(e, id)}
          >
            #
          </a>
        </h4>
      );
    },
  };

  const handleReleaseChange = (event) => {
    const key = event.target.value;
    setSelectedRelease(key);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('release', key);
      window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
    }
  };

  const handleTagClick = () => {
    const found = releases.find(r => r.key === selectedRelease);
    if (found && !found.isCustom) {
      const { owner, repo } = extractRepoInfo(rawUrl);
      window.open(`https://github.com/${owner}/${repo}/releases/tag/${selectedRelease}`, '_blank');
    }
  };

  const AnchorNav = () => (
    <div
      className="anchor-nav-container"
      style={{
        position: 'fixed',
        right: '20px',
        top: `${headerH1Height + 60}px`,
        width: 'calc(17%)',
        maxHeight: 'calc(100vh - 180px)',
        overflowY: 'auto',
        padding: '10px 15px',
        zIndex: 100,
      }}
      onScroll={(e) => {
        anchorNavScrollRef.current = e.target.scrollTop;
      }}
    >
      <ul style={{ listStyle: 'none', paddingLeft: 20, margin: 0, borderLeft: '1px solid var(--ifm-toc-border-color)' }}>
        {headings.map(heading => (
          <li key={heading.id} style={{ margin: '8px 0' }}>
            <button
              onClick={() => scrollToHeading(heading.id)}
              style={{
                border: 'none',
                background: 'none',
                width: '100%',
                textAlign: 'left',
                color: activeHeadingId === heading.id ? '#348f94' : '#333',
                fontSize: heading.level === 2 ? '14px' : heading.level === 3 ? '13px' : '12px',
                padding: '4px 0',
                paddingLeft: heading.level === 2 ? '0' : heading.level === 3 ? '12px' : '24px',
                cursor: 'pointer',
              }}
            >
              {heading.text.replace(/#/g, '')}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
      <div
        ref={contentRef}
        style={{
          marginRight: anchorReady ? 'calc(17% + 40px)' : '0',
          transition: 'margin-right 0.3s ease',
        }}
      >
        {!hideRelease && releases.length > 1 && (
          <div style={{ marginBottom: '20px', padding: '12px 0' }} className="babylon-dropdown">
            <Tag
              className="h-5"
              onClick={handleTagClick}
              style={{ cursor: 'pointer', marginRight: '8px', verticalAlign: 'middle' }}
            />
            <label htmlFor="version-select" style={{ marginRight: '8px', fontSize: '14px' }}>
              Release tag:
            </label>
            <select
              id="version-select"
              value={selectedRelease}
              onChange={handleReleaseChange}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '14px',
              }}
            >
              {releases.map(release => (
                <option key={release.key} value={release.key}>
                  {release.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {errorMessage && !loading && (
          <Admonition type="warning" title="Error" style={{ marginBottom: '20px' }}>
            {errorMessage}
          </Admonition>
        )}

        {loading && !errorMessage && (
          <Admonition type="info" title="Loading" style={{ marginBottom: '20px', padding: '20px' }}>
            Loading documentation...
          </Admonition>
        )}

        <div ref={markdownRef} className="markdown-body" style={{ lineHeight: '1.6', fontSize: '16px' }}>
          <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
        </div>

        {!errorMessage && !loading && (
          <Admonition style={{ margin: '20px 0', padding: '12px' }}>
            This documentation's source is hosted on github.com.{' '}
            <a
              href={currentMdUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#348f94', textDecoration: 'underline' }}
            >
              View source and contribute
            </a>
          </Admonition>
        )}
      </div>

      {anchorReady && <AnchorNav />}
    </div>
  );
}
