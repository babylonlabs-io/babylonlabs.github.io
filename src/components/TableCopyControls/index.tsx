import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { tableToCsv, tableToMarkdown } from './serializers';
import './styles.css';

type Format = 'markdown' | 'csv';

/**
 * Floating "Copy as Markdown / Copy as CSV" toolbar for documentation tables.
 *
 * Mounted once in Root. It never wraps or mutates the tables themselves
 * (they are React-owned DOM, from MDX or from RemoteMD's ReactMarkdown);
 * instead it tracks the hovered/tapped table via delegated listeners and
 * portals an absolutely positioned toolbar over its top-right corner.
 */
export default function TableCopyControls(): JSX.Element | null {
  const [anchor, setAnchor] = useState<HTMLTableElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [copied, setCopied] = useState<Format | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const copiedTimer = useRef<number | undefined>(undefined);

  const reposition = useCallback((table: HTMLTableElement) => {
    if (!table.isConnected) {
      setAnchor(null);
      return;
    }
    const rect = table.getBoundingClientRect();
    setPosition({
      top: rect.top + window.scrollY + 4,
      left: rect.right + window.scrollX - 4,
    });
  }, []);

  useEffect(() => {
    const eligibleTable = (
      target: EventTarget | null
    ): HTMLTableElement | null => {
      if (!(target instanceof Element)) {
        return null;
      }
      const table = target.closest('table');
      // Only decorate content tables; `main` excludes overlays such as
      // the chat widget, which renders its own markdown.
      if (!table || !table.closest('main')) {
        return null;
      }
      return table;
    };

    // `mouseover` covers hover on desktop; `click` covers tap on touch
    // devices (and is harmless on desktop). Moving/tapping outside both
    // the table and the toolbar hides the toolbar.
    const handlePointer = (event: Event) => {
      const table = eligibleTable(event.target);
      if (table) {
        setAnchor(table);
        return;
      }
      if (
        event.target instanceof Node &&
        toolbarRef.current?.contains(event.target)
      ) {
        return;
      }
      setAnchor(null);
    };

    document.addEventListener('mouseover', handlePointer);
    document.addEventListener('click', handlePointer);
    return () => {
      document.removeEventListener('mouseover', handlePointer);
      document.removeEventListener('click', handlePointer);
    };
  }, []);

  useEffect(() => {
    if (!anchor) {
      return undefined;
    }
    setCopied(null);
    reposition(anchor);
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => reposition(anchor));
    };
    // Capture phase also catches scrolls inside overflow containers.
    window.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
    };
  }, [anchor, reposition]);

  useEffect(() => () => window.clearTimeout(copiedTimer.current), []);

  const copy = async (format: Format) => {
    if (!anchor) {
      return;
    }
    const text =
      format === 'markdown' ? tableToMarkdown(anchor) : tableToCsv(anchor);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      setCopied(format);
      window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy table:', error);
    }
  };

  if (!anchor) {
    return null;
  }

  return createPortal(
    <div
      ref={toolbarRef}
      className="table-copy-toolbar"
      style={{ top: position.top, left: position.left }}
      role="toolbar"
      aria-label="Copy table"
    >
      <button
        type="button"
        className="table-copy-button"
        onClick={() => copy('markdown')}
      >
        {copied === 'markdown' ? 'Copied ✓' : 'Copy as Markdown'}
      </button>
      <button
        type="button"
        className="table-copy-button"
        onClick={() => copy('csv')}
      >
        {copied === 'csv' ? 'Copied ✓' : 'Copy as CSV'}
      </button>
    </div>,
    document.body
  );
}
