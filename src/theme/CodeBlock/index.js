import React from 'react';
import CodeBlock from '@theme-original/CodeBlock';
import GraphQLRunner from '@site/src/components/GraphQLRunner';
import styles from '@site/src/components/GraphQLRunner/styles.module.css';

/**
 * Adds a Run button to ```graphql code blocks, which opens the query in an
 * explorer without the reader having to copy, paste and retype it.
 *
 * Every other code block is passed straight through untouched.
 */
export default function CodeBlockWrapper(props) {
  const { children, className, language, metastring } = props;

  const resolvedLanguage =
    language ??
    (typeof className === 'string' ? className.match(/language-(\w+)/)?.[1] : undefined);

  // Fenced code arrives as a string. Anything else (a React tree from a JSX
  // <CodeBlock> child, for example) has no reliable source text to send.
  const query = typeof children === 'string' ? children.trim() : null;

  // `norun` opts an individual block out, for snippets that are illustrative
  // rather than executable.
  const optedOut = typeof metastring === 'string' && metastring.includes('norun');

  if (resolvedLanguage !== 'graphql' || !query || optedOut) {
    return <CodeBlock {...props} />;
  }

  return (
    <div className={styles.wrapper}>
      <GraphQLRunner query={query} />
      <CodeBlock {...props} />
    </div>
  );
}
