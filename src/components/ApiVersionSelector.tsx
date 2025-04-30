import React from 'react';
import styles from './ApiVersionSelector.module.css';
import { useHistory, useLocation } from '@docusaurus/router';

interface Props {
  versions: {
    name: string;
    label: string;
    description: string;
  }[];
}

export default function ApiVersionSelector({ versions }: Props): JSX.Element {
  const history = useHistory();
  const location = useLocation();
  
  // Extract the current version from the URL
  const currentPathParts = location.pathname.split('/');
  const versionIndex = currentPathParts.findIndex(
    part => versions.some(v => v.name === part)
  );
  
  const currentVersion = versionIndex >= 0 ? currentPathParts[versionIndex] : versions[0].name;
  
  const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVersion = e.target.value;
    if (newVersion === currentVersion) return;
    
    // Replace the version in the path
    if (versionIndex >= 0) {
      currentPathParts[versionIndex] = newVersion;
    }
    
    const newPath = currentPathParts.join('/');
    history.push(newPath);
  };

  return (
    <div className={styles.versionSelector}>
      <div className={styles.versionSelectorLabel}>API Version:</div>
      <select
        value={currentVersion}
        onChange={handleVersionChange}
        className={styles.versionSelectorSelect}
      >
        {versions.map((version) => (
          <option key={version.name} value={version.name}>
            {version.label} ({version.description})
          </option>
        ))}
      </select>
    </div>
  );
}