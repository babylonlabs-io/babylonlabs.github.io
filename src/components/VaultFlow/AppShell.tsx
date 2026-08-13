import React from 'react';
import clsx from 'clsx';
import useBaseUrl from '@docusaurus/useBaseUrl';

import s from './styles.module.css';

/*
 * The persistent chrome of btc-vaults.testnet.babylonlabs.io: left sidebar,
 * top bar, content area. Metrics and colours below were measured off the live
 * app rather than eyeballed — sidebar 240px, top bar 80px, primary #ce6533 at
 * 4px radius, headings #12495e, borders #d7e1e7.
 *
 * The stage is 1440x810 so these numbers are the app's real pixel values.
 */

export const TEAL = '#12495e';
export const ORANGE = '#ce6533';
export const LINE = '#d7e1e7';

function NavItem({
  label,
  icon,
  active,
}: {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className="flex h-10 items-center gap-3 text-[16px]"
      style={{ color: active ? TEAL : '#4a5763' }}
    >
      <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
      {label}
    </div>
  );
}

const ICON = {
  overview: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2" y="2" width="6.5" height="6.5" rx="1" />
      <rect x="11.5" y="2" width="6.5" height="6.5" rx="1" />
      <rect x="2" y="11.5" width="6.5" height="6.5" rx="1" />
      <rect x="11.5" y="11.5" width="6.5" height="6.5" rx="1" />
    </svg>
  ),
  vaults: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="8.5" width="14" height="9" rx="1.5" />
      <path d="M6.5 8.5V6a3.5 3.5 0 017 0v2.5" />
    </svg>
  ),
  loans: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M10 2.5v15M13.2 6.2a3.2 3.2 0 00-3.2-1.7c-2 0-3.3 1-3.3 2.6 0 3.6 6.9 1.9 6.9 5.6 0 1.7-1.5 2.8-3.6 2.8a3.6 3.6 0 01-3.5-2" />
    </svg>
  ),
  activity: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="10" cy="10" r="7.8" />
      <path d="M10 5.5V10l3 1.8" strokeLinecap="round" />
    </svg>
  ),
};

/**
 * Lockup. The Babylon symbol is the real asset from static/logo, inlined so it
 * can be recoloured to the black the app uses (every logo file in the repo is
 * the teal "babylon docs" lockup, which is a different mark). The wordmarks
 * approximate the app's custom typeface.
 */
export function Brand() {
  return (
    <div className="flex min-w-0 items-center gap-2 overflow-hidden">
      <span className="flex shrink-0 items-center gap-1">
        <span className="text-[18px] font-bold leading-none tracking-[-0.02em] text-black">
          babylon
        </span>
        <svg viewBox="0 0 19 18" className="h-[12px] w-[13px]" fill="#000" fillRule="evenodd">
          <path d="M-.2795 2.8001c-.086-.237-.029-.5017.148-.6812l2.394-2.4268c.1761-.1777.4391-.2369.672-.1499l5.107 1.901c.1261.0463.208.1685.208.3036v1.1329c0 .0851-.032.1684-.0929.2276l-1.242 1.2588c-.0871.0888-.219.1184-.336.074l-1.3711-.5127-1.5069-.5628c-.1281-.0481-.252.0778-.205.2074l1.0609 2.9173a.324.324 0 0 1-.073.3405L3.3786 7.9497c-.1241.1259-.1241.3314 0 .4572l1.1109 1.1255a.326.326 0 0 1 .073.3406l-1.061 2.9173c-.0479.1295.076.2554.2041.2073l2.879-1.0755c.117-.0444.2479-.0148.3359.0741l1.2361 1.2531c.0609.0611.0929.1426.0929.2277v1.1329c0 .1351-.0819.2554-.208.3035L2.9425 16.82c-.2339.087-.495.0297-.672-.1499l-2.3949-2.4267c-.175-.1778-.234-.4443-.148-.6812l1.8759-5.1515a.65.65 0 0 0 0-.448L-.2774 2.7945l-.0021.0056zM18.21 13.5662c.086.237.029.5017-.148.6812l-2.395 2.4268c-.175.1777-.438.2369-.672.1499l-5.106-1.901c-.127-.0463-.209-.1685-.209-.3036v-1.1329c0-.0851.033-.1684.093-.2277l1.242-1.2587c.088-.0888.22-.1185.337-.074l1.371.5127 1.507.5627c.128.0482.252-.0777.205-.2073L13.373 9.877c-.043-.1184-.014-.2517.073-.3406l1.105-1.1198c.125-.1259.125-.3314 0-.4572l-1.11-1.1255c-.088-.0889-.117-.2221-.073-.3406l1.061-2.9173c.048-.1296-.077-.2554-.204-.2073l-2.879 1.0755c-.117.0444-.248.0148-.336-.0741L9.773 3.117a.324.324 0 0 1-.093-.2277V1.7564c0-.1351.084-.2554.209-.3035l5.103-1.9104c.233-.087.495-.0296.672.15l2.394 2.4267c.176.1777.234.4443.148.6812L16.33 7.952c-.053.1443-.053.3035 0 .4479l1.882 5.1682-.002-.0019z" />
        </svg>
      </span>

      <span className="h-4 w-px shrink-0 bg-slate-300" />

      <span className="flex shrink-0 items-center gap-1">
        <svg viewBox="0 0 36 20" className="h-[15px] w-[27px]" fill="#000">
          <path d="M3 19a15 15 0 0130 0h-4.6a10.4 10.4 0 00-20.8 0z" />
          <circle cx="13" cy="12.2" r="2.6" />
          <circle cx="23" cy="12.2" r="2.6" />
        </svg>
        <span className="text-[18px] font-bold leading-none tracking-[-0.02em] text-black">
          aave
        </span>
      </span>
    </div>
  );
}

export function Gear() {
  return (
    <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" fill="#4a5763">
      <path d="M21.3 13.6l-1.9-1.1a7.6 7.6 0 000-1l1.9-1.1a.6.6 0 00.2-.8l-1.8-3.1a.6.6 0 00-.8-.2l-1.9 1.1a7.4 7.4 0 00-.9-.5V4.7a.6.6 0 00-.6-.6h-3.6a.6.6 0 00-.6.6v2.2c-.3.1-.6.3-.9.5L8.5 6.3a.6.6 0 00-.8.2L5.9 9.6a.6.6 0 00.2.8L8 11.5a7.6 7.6 0 000 1l-1.9 1.1a.6.6 0 00-.2.8l1.8 3.1a.6.6 0 00.8.2l1.9-1.1c.3.2.6.4.9.5v2.2c0 .3.3.6.6.6h3.6c.3 0 .6-.3.6-.6v-2.2c.3-.1.6-.3.9-.5l1.9 1.1a.6.6 0 00.8-.2l1.8-3.1a.6.6 0 00-.2-.8zM12 15.1A3.1 3.1 0 1112 8.9a3.1 3.1 0 010 6.2z" />
    </svg>
  );
}

export default function AppShell({
  title,
  overlay,
  children,
}: {
  title: string;
  /**
   * Modal layer. Rendered as a sibling of the whole shell, not of the content
   * area — a dialog scrim has to dim the sidebar and top bar too.
   */
  overlay?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute inset-0 bg-white">
      {/* Sidebar */}
      <div
        className={clsx(s.animReveal, 'absolute inset-y-0 left-0 w-[240px] border-r')}
        style={{ borderColor: LINE }}
      >
        <div className="px-6 pt-7">
          <Brand />
        </div>

        <div className="mt-8 px-6">
          {/* The highlighted item has to follow the page, not sit on Overview. */}
          <NavItem label="Overview" icon={ICON.overview} active={title === 'Overview'} />
          <NavItem label="Vaults" icon={ICON.vaults} active={title === 'Vaults'} />
          <NavItem label="Loans" icon={ICON.loans} active={title === 'Loans'} />
          <NavItem label="Activity" icon={ICON.activity} active={title === 'Activity'} />
        </div>

        <div className="absolute inset-x-0 bottom-6 px-6">
          <div className="mb-3 flex gap-3 opacity-60">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="h-3.5 w-3.5 rounded-sm bg-slate-500/70" />
            ))}
          </div>
          <p className="mb-0 text-[13px] text-slate-500">
            Terms of Use - Privacy Policy
          </p>
        </div>
      </div>

      {/* Top bar */}
      <div
        className={clsx(s.animReveal, 'absolute left-[240px] right-0 top-0 flex h-20 items-center border-b px-[42px]')}
        style={{ borderColor: LINE }}
      >
        <span className="text-[24px]" style={{ color: TEAL }}>
          {title}
        </span>

        <span className="ml-auto flex items-center gap-4">
          <span
            className="rounded-full px-3 py-1 text-[14px]"
            style={{ background: '#f9f9f9', color: ORANGE }}
          >
            Testnet
          </span>
          {/* The two connected wallets: UniSat for Bitcoin, OKX for Ethereum.
              Loaded from static/logo so the marks can be replaced with the
              official assets without touching this component — the files
              currently there are approximations. */}
          <span className="flex items-center gap-2">
            <img src={useBaseUrl('/logo/unisat.svg')} alt="" className="h-7 w-7" />
            <img src={useBaseUrl('/logo/okx.svg')} alt="" className="h-7 w-7" />
          </span>
          <Gear />
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-[240px] right-0 top-20 overflow-hidden">
        {children}
      </div>

      {overlay}
    </div>
  );
}
