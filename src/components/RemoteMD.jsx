import React from 'react';
import ReactMarkdown from 'react-markdown';
import {Tag} from '@styled-icons/bootstrap';
import {Globe} from '@styled-icons/boxicons-regular/Globe';
import Admonition from '@theme/Admonition';

function RemoteMD({
  networkVersions = {},
  hideEnv = false,
  hideRelease = false,
}) {
  const [markdown, setMarkdown] = React.useState('');
  const [releases, setReleases] = React.useState([]);
  const [selectedVersion, setSelectedVersion] = React.useState('');
  const [selectedNetwork, setSelectedNetwork] = React.useState(
    Object.keys(networkVersions)[0]
  );
  const [errorMessage, setErrorMessage] = React.useState('');
  const [showReleaseSelector, setShowReleaseSelector] = React.useState(true);
  const [loading, setLoading] = React.useState(true); // Track loading state
  const lastH2 = React.useRef('');

  // Function to fetch the raw markdown based on the selected network
  const fetchMarkdown = async (networkUrl) => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response = await fetch(networkUrl);
      if (!response.ok) {
        throw new Error('Document not found');
      }
      const text = await response.text();
      setMarkdown(text.replace(/<!--[\s\S]*?-->/g, '')); // Remove HTML comments
      setErrorMessage(''); // Clear any previous error message
    } catch (error) {
      console.error('Failed to fetch markdown:', error);
      setMarkdown(''); // Clear the page if no document is found
      setErrorMessage('Documentation not found for the selected network.'); // Set the error message
    } finally {
      setLoading(false); // Set loading to false after the fetch is completed
    }
  };

  const extractRepoInfo = (url) => {
    const urlParts = url.split('/');
    const owner = urlParts[3];
    const repo = urlParts[4];
    const filePath = urlParts.slice(7).join('/');
    return { owner, repo, filePath };
  };

  const fetchReleases = async () => {
    try {
      const { owner, repo } = extractRepoInfo(networkVersions[selectedNetwork]);
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`);
      if (!response.ok) {
        throw new Error('Releases not found');
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        // Filter out pre-releases (rc, alpha, beta versions)
        let stableReleases = data
          .map((release) => release.tag_name)
          .filter(tag => !tag.includes('-'));  // Excludes tags with '-' like rc, alpha, beta
        
        if (stableReleases.length === 0) {
          // If no stable releases, fall back to all releases
          stableReleases = data.map((release) => release.tag_name);
        }
        
        // Sort releases by version number
        const sortedReleases = stableReleases.sort((a, b) => {
          const [aMajor, aMinor, aPatch] = a.replace('v', '').split('.').map(Number);
          const [bMajor, bMinor, bPatch] = b.replace('v', '').split('.').map(Number);
          if (bMajor !== aMajor) return bMajor - aMajor;
          if (bMinor !== aMinor) return bMinor - aMinor;
          return bPatch - aPatch;
        });

        const latestMajorRelease = sortedReleases[0];
        const latestMajorReleaseUrl = networkVersions[selectedNetwork].replace(/refs\/heads\/[^/]+/, `${latestMajorRelease}`);
        const latestMajorReleaseResponse = await fetch(latestMajorReleaseUrl);
        
        if (!latestMajorReleaseResponse.ok) {
          return;
        }

        // Get all releases with the same major version
        const [currentMajor] = latestMajorRelease.replace('v', '').split('.').map(Number);
        const sameMajorReleases = sortedReleases.filter(release => {
          const [major] = release.replace('v', '').split('.').map(Number);
          return major === currentMajor;
        });

        if (sameMajorReleases.length === 1) {
          setReleases([latestMajorRelease]);
          setSelectedVersion(latestMajorRelease);
          setShowReleaseSelector(true);
        } else {
          const secondReleaseUrl = networkVersions[selectedNetwork].replace(/refs\/heads\/[^/]+/, `${sameMajorReleases[1]}`);
          const secondReleaseResponse = await fetch(secondReleaseUrl);
          if (secondReleaseResponse.ok) {
            setReleases(sameMajorReleases);
            setSelectedVersion(sameMajorReleases[0]);
            setShowReleaseSelector(true);
          } else {
            setReleases([sameMajorReleases[0]]);
            setSelectedVersion(sameMajorReleases[0]);
            setShowReleaseSelector(true);
          }
        }
      } else {
        throw new Error('No releases found');
      }
    } catch (error) {
      console.error('Failed to fetch releases:', error);
      setReleases([]);
      setErrorMessage('');
      setShowReleaseSelector(false);
    }
  };


  // Convert raw GitHub URL to regular GitHub URL
  const rawToGithubUrl = (rawUrl) => {
    return rawUrl
      .replace('raw.githubusercontent.com', 'github.com')
      .replace('refs/heads/', 'blob/');
  };

  const url = rawToGithubUrl(networkVersions[selectedNetwork]);

  const generateId = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-');
  };

  React.useEffect(() => {
    fetchMarkdown(networkVersions[selectedNetwork]);
    fetchReleases();
  }, [selectedNetwork]);

  // Handle version selection
  const handleVersionChange = (event) => {
    const selectedVersion = event.target.value;
    setSelectedVersion(selectedVersion);
    const newRawUrl = networkVersions[selectedNetwork].replace(
      /refs\/heads\/[^/]+/,
      `${selectedVersion}`
    );
    setMarkdown('');
    fetchMarkdown(newRawUrl);
  };

  // Handle network version selection
  const handleNetworkChange = (event) => {
    setSelectedNetwork(event.target.value);
    setMarkdown(''); // Clear the page when switching networks
    setErrorMessage(''); // Clear error message when switching networks
  };

  // Helper function to handle relative paths
  const resolveRelativePath = (href) => {
    const [path, anchor] = href.split('#');
    let baseUrl = url.replace(/\/[^/]+$/, '');
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
      let rootUrl = networkVersions[selectedNetwork].replace(/\/[^/]+\.md$/, '/');
      const newSrc = src.startsWith('./')
        ? `${rootUrl}${src.substring(1)}`
        : src;
      return <img src={newSrc} alt={alt}/>;
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
        ? resolveRelativePath(href)
        : href;
      return <a href={resolvedHref}>{children}</a>;
    },

    h3: ({ children }) => {
      const id = generateId(String(children));
      return <h3 id={id}>{children}</h3>;
    },
  };

  const handleTagClick = () => {
    const { owner, repo } = extractRepoInfo(networkVersions[selectedNetwork]);
    const releaseUrl = `https://github.com/${owner}/${repo}/releases/tag/${selectedVersion}`;
    window.open(releaseUrl, '_blank');
  };

  return (
    <>
      <div style={{ marginBottom: '20px' }} className="babylon-dropdown">
        {!hideEnv && (
          <>
            <Globe className="h-5"/>
            <label htmlFor="network-select">Network: </label>
            <select
              id="network-select"
              value={selectedNetwork}
              onChange={handleNetworkChange}
            >
              {Object.keys(networkVersions).map((network) => (
                <option key={network} value={network}>
                  {network}
                </option>
              ))}
            </select>
          </>
        )}
        {!hideRelease && showReleaseSelector && (
          <>
            <Tag
              className="h-5"
              onClick={handleTagClick}
              style={{ cursor: 'pointer' }}
            />
            <label htmlFor="version-select">Release tag: </label>
            <select
              id="version-select"
              value={selectedVersion}
              onChange={handleVersionChange}
            >
              {releases.map((release) => (
                <option key={release} value={release}>
                  {release}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* Show error message if fetching fails */}
      {errorMessage && !loading && (
        <Admonition type="warning" title="Error">
          {errorMessage}
        </Admonition>
      )}

      <ReactMarkdown components={components}>{markdown}</ReactMarkdown>

      {/* Show info message when the page loads successfully */}
      {!errorMessage && !loading && (
        <Admonition>
          This documentation's source is hosted on github.com/babylonlabs-io.{' '}
          <a href={url}>View source and contribute</a>
        </Admonition>
      )}
    </>
  );
}

export default RemoteMD;
