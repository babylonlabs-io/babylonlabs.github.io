import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { ArrowUpRight } from 'lucide-react';

/**
 * The call to action at the foot of a research page.
 *
 * Replaces a bare "Read the paper" link with a card that names who wrote the
 * work, because on a research page the authors are the reason to click.
 *
 * The whole card is one anchor. A link wrapping a canvas is still a link, so
 * it keeps its focus ring, its context menu and its middle-click, and there
 * is exactly one tab stop. The pixel field is decorative and marked so.
 *
 * The field is client-only: it measures its container and draws to a canvas,
 * neither of which exists during prerender. The fallback is the finished
 * card, so the static build and a reader without JavaScript get the link and
 * every word of the text — only the animation is missing.
 */

type PaperCardProps = {
  /** Where the paper lives: an arXiv URL, or a path under /papers. */
  href: string;
  /** Paper title, as printed on the paper itself. */
  title: string;
  /** Authors, in the order the paper lists them. */
  authors: string;
  /** Publication venue or date, shown as a quiet third line. */
  meta?: string;
  /** Link label. Defaults to the destination's own name. */
  cta?: string;
};

function CardBody({
  title,
  authors,
  meta,
  cta,
}: Omit<PaperCardProps, 'href'>): JSX.Element {
  return (
    <div className="paper-card-content">
      <p className="mb-0 font-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        Read the paper
      </p>
      <h3 className="mb-0 font-display text-xl font-normal leading-snug tracking-tight text-foreground sm:text-2xl">
        {title}
      </h3>
      <p className="mb-0 text-sm leading-relaxed text-muted-foreground">
        {authors}
      </p>
      {meta && (
        <p className="mb-0 font-label text-xs text-muted-foreground">{meta}</p>
      )}
      <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
        {cta}
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </div>
  );
}

function isArxivUrl(href: string): boolean {
  try {
    return new URL(href, 'https://babylonlabs.io').hostname === 'arxiv.org';
  } catch {
    return false;
  }
}

export default function PaperCard({
  href,
  title,
  authors,
  meta,
  cta,
}: PaperCardProps): JSX.Element {
  const external = /^https?:\/\//.test(href);
  const label = cta ?? (isArxivUrl(href) ? 'View on arXiv' : 'Open the PDF');
  const body = (
    <CardBody title={title} authors={authors} meta={meta} cta={label} />
  );

  return (
    <a
      className="paper-card-link focus-ring"
      href={href}
      {...(external
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : { target: '_blank', rel: 'noopener' })}
    >
      <BrowserOnly fallback={<div className="pixel-card">{body}</div>}>
        {() => {
          const PixelCard = require('./PixelCard').default;
          return <PixelCard variant="paper">{body}</PixelCard>;
        }}
      </BrowserOnly>
    </a>
  );
}
