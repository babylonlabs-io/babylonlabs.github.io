import React from 'react';
import clsx from 'clsx';

import AppShell, { LINE, ORANGE, TEAL } from './AppShell';
import { clickAt, CursorStep } from './cursor';
import Overview from './Overview';
import { BorrowPage, DepositPage, LoansPage, SelectAssetPage } from './Pages';
import s from './styles.module.css';

/*
 * Recreations of btc-vaults.testnet.babylonlabs.io, drawn in the DOM rather
 * than filmed. The stage is 1440x810 so the app's real pixel metrics — 240px
 * sidebar, 80px top bar, #ce6533 primary at 4px radius — transfer directly.
 *
 * Timings are seconds from the start of the scene. Each scene derives its
 * event times from its cursor's click times (see ./cursor), so the pointer
 * always arrives before the thing it triggers.
 */

export const STAGE_W = 1440;
export const STAGE_H = 810;

// ---------------------------------------------------------------- primitives

function Check({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style}>
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6 10.4l2.6 2.6L14 7.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * One animation per element.
 *
 * Two animation classes on the same element do NOT compose: each declares
 * `animation-name`, so whichever rule comes later in the stylesheet wins
 * outright and the other silently never runs. Nesting keeps every animation on
 * its own element, where opacity and transform compose the way they read.
 */
function Anim({
  cls,
  at,
  className,
  hit,
  style,
  children,
}: {
  cls: string;
  at: number;
  className?: string;
  hit?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div
      data-hit={hit}
      className={clsx(cls, className)}
      style={{ ...style, animationDelay: `${at}s` }}
    >
      {children}
    </div>
  );
}

/**
 * Cross-fades a value that changes partway through a scene. Both values share
 * one grid cell so the box sizes to the wider of the two — stacking them with
 * `absolute` would squeeze the incoming value into the outgoing one's width and
 * wrap it a character at a time.
 */
function Swap({
  from,
  to,
  at,
}: {
  from: React.ReactNode;
  to: React.ReactNode;
  at: number;
}) {
  const cell = { gridArea: '1 / 1' } as const;

  return (
    <span className="inline-grid whitespace-nowrap">
      <span className={s.animFadeOut} style={{ ...cell, animationDelay: `${at}s` }}>
        {from}
      </span>
      <span className={s.animReveal} style={{ ...cell, animationDelay: `${at}s` }}>
        {to}
      </span>
    </span>
  );
}

interface SubItem {
  label: string;
  /** When its checkmark lands. Omit for an item that stays pending. */
  at?: number;
}

function StepRow({
  n,
  title,
  count,
  countTo,
  countAt,
  at,
  items,
  done,
}: {
  n: number;
  title: string;
  count: string;
  countTo?: string;
  countAt?: number;
  at: number;
  items?: SubItem[];
  done?: boolean;
}) {
  return (
    <div
      className={clsx(s.animFadeUp, 'rounded-lg px-4 py-3')}
      style={{ animationDelay: `${at}s`, background: items ? '#f7f9fa' : undefined }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px]"
          style={
            done
              ? { background: '#16a34a', color: '#fff' }
              : { border: `1px solid ${LINE}`, color: '#7b8b96' }
          }
        >
          {done ? '✓' : n}
        </span>
        <span className="text-[15px]" style={{ color: TEAL }}>
          {title}
        </span>
        <span className="ml-auto text-[13px] tabular-nums text-slate-400">
          {countTo && countAt !== undefined ? (
            <Swap from={count} to={countTo} at={countAt} />
          ) : (
            count
          )}
        </span>
      </div>

      {items && (
        <div className="mt-2.5 space-y-2 pl-9">
          {items.map((item) => (
            <div key={item.label} className="flex items-start gap-2.5">
              <span className="relative mt-[3px] h-3.5 w-3.5 shrink-0">
                <span
                  className="absolute inset-0 rounded-full border"
                  style={{ borderColor: LINE }}
                />
                {item.at !== undefined && (
                  <Check
                    className={clsx(s.animPop, 'absolute -inset-px text-emerald-600')}
                    style={{ animationDelay: `${item.at}s` }}
                  />
                )}
              </span>
              <span className="text-[13px] leading-[17px] text-slate-500">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Wallet extension popup, anchored top-right the way a real one is. */
function WalletPopup({
  title,
  rows,
  cta,
  at,
  pressAt,
  outAt,
  hit,
  children,
}: {
  title: string;
  rows?: [string, string][];
  cta: string;
  at: number;
  pressAt: number;
  outAt: number;
  hit: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={clsx(s.animSlideIn, 'absolute right-[36px] top-[16px] z-30 w-[290px]')}
      style={{ animationDelay: `${at}s` }}
    >
      {/* A second wrapper carries the exit so it can't fight the entrance. */}
      <div
        className={clsx(
          s.animSlideOut,
          'overflow-hidden rounded-xl bg-[#1c1c1e] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.55)] ring-1 ring-white/10',
        )}
        style={{ animationDelay: `${outAt}s` }}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-3.5 py-2.5">
          <span className="h-4 w-4 rounded-[3px]" style={{ background: ORANGE }} />
          <span className="truncate text-[10px] text-white/45">
            btc-vaults.testnet.babylonlabs.io
          </span>
        </div>

        <div className="px-3.5 pb-3.5 pt-3">
          <p className="mb-3 text-center text-[13px] font-semibold text-white">
            {title}
          </p>

          {rows && (
            <div className="space-y-2">
              {rows.map(([label, value]) => (
                <div key={label}>
                  <span className="text-[9px] uppercase tracking-wide text-white/35">
                    {label}
                  </span>
                  <div className="mt-0.5 truncate rounded bg-white/[0.06] px-2 py-1.5 font-mono text-[10px] text-white/70">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {children}

          <div className="mt-3.5 flex gap-2">
            <div className="flex-1 rounded bg-white/[0.08] py-2 text-center text-[11px] font-medium text-white/70">
              Reject
            </div>
            <div
              data-hit={hit}
              className={clsx(
                s.animPress,
                'flex-1 rounded bg-[#f0a13c] py-2 text-center text-[11px] font-semibold text-[#3a2408]',
              )}
              style={{ animationDelay: `${pressAt}s` }}
            >
              {cta}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The Deposit Progress card. */
function DepositCard({
  children,
  barPct,
  barAt,
  banner,
  signPressAt,
  signPressAt2,
  at = 0.2,
}: {
  children: React.ReactNode;
  barPct: number;
  barAt: number;
  banner: React.ReactNode;
  /** Omit when the card is background context rather than the live step. */
  signPressAt?: number;
  signPressAt2?: number;
  at?: number;
}) {
  return (
    <div
      className={clsx(
        s.animFadeUp,
        'absolute left-[320px] top-[40px] w-[560px] overflow-hidden rounded-xl bg-white shadow-[0_18px_50px_-14px_rgba(18,73,94,0.28)] ring-1',
      )}
      style={{ animationDelay: `${at}s`, ['--tw-ring-color' as string]: LINE }}
    >
      <div className="px-6 pb-4 pt-5">
        <p className="mb-1.5 text-[20px]" style={{ color: TEAL }}>
          Deposit Progress{' '}
          <span className="text-[13px] text-slate-400">(~2 h)</span>
        </p>
        <p className="mb-3 text-[13px] leading-[17px] text-slate-500">
          Each step is divided into several wallet signature confirmations. Your
          Bitcoin will only be locked once the BTC Vault is activated.
        </p>
        <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200/80">
          <div
            className={clsx(s.animFill, 'h-full rounded-full bg-emerald-500')}
            style={{ ['--fill' as string]: `${barPct}%`, animationDelay: `${barAt}s` }}
          />
        </div>
      </div>

      <div className="border-t px-5 pb-5 pt-3" style={{ borderColor: LINE }}>
        {banner}
        <div className="mt-2.5 space-y-1">{children}</div>

        {/* Nested presses when the step needs two signing rounds. */}
        {signPressAt !== undefined && (
          <Anim cls={s.animPress} at={signPressAt} className="mt-4">
            <Anim
              cls={s.animPress}
              at={signPressAt2 ?? signPressAt}
              hit="sign"
              className="rounded py-2.5 text-center text-[14px] text-white"
              style={{
                background: ORANGE,
                ...(signPressAt2 === undefined ? { animationName: 'none' } : null),
              }}
            >
              Sign
            </Anim>
          </Anim>
        )}
      </div>
    </div>
  );
}

function Banner({ text, at }: { text: React.ReactNode; at: number }) {
  return (
    <div
      className={clsx(s.animFadeUp, 'flex items-center gap-2.5 rounded-lg bg-emerald-50 px-4 py-2.5')}
      style={{ animationDelay: `${at}s` }}
    >
      <Check className="h-[18px] w-[18px] text-emerald-600" />
      <span className="text-[13px] text-emerald-800">{text}</span>
    </div>
  );
}

// -------------------------------------------------------------------- scenes

export interface Scene {
  title: string;
  caption: string;
  duration: number;
  cursor: CursorStep[];
  /**
   * Region of the stage to zoom into on narrow screens. Fitting the whole
   * 1440px stage into a phone drops body text past legibility, so mobile crops
   * to each scene's focal point instead of shrinking everything.
   */
  focus: { x: number; y: number; w: number; h: number };
  render: () => React.ReactNode;
}

/** Deposit Progress card, in stage coordinates (content starts at x240/y80). */
const CARD_FOCUS = { x: 545, y: 105, w: 590, h: 600 };

// --- 1. Deposit: Overview -> full-page Deposit -> first signing round -----

const d1 = clickAt('deposit', 1.5);
const d2 = clickAt('slider', 3.3);
const d3 = clickAt('provider', 4.9);
const d4 = clickAt('submit', 6.5);
const d5 = clickAt('wallet1', 8.3);
const CARD_IN = d5.reactTime + 0.45;
const d6 = clickAt('sign', 11.0);
const d7 = clickAt('wallet2', 13.0);

// --- 2-4. On the Deposit Progress card --------------------------------------

const s2a = clickAt('sign', 1.9);
const s2b = clickAt('wallet1', 3.6);
const s3a = clickAt('sign', 1.9);
const s3b = clickAt('wallet1', 4.6);
const s4a = clickAt('download', 1.9);
const s4b = clickAt('activate', 6.5);

// --- 5. Borrow: Loans -> full-page Borrow -> asset -> amount -> confirm -----

const b1 = clickAt('borrow', 1.5);
const b2 = clickAt('asset', 3.2);
const b3 = clickAt('usdc', 4.9);
const b4 = clickAt('slider', 6.5);
const b5 = clickAt('submit', 8.1);
const b6 = clickAt('wallet1', 9.9);

export const SCENES: Scene[] = [
  {
    title: 'Deposit',
    caption:
      'Start on Overview, deposit signet BTC, and register the peg-in on Bitcoin.',
    duration: 18,
    focus: { x: 545, y: 100, w: 590, h: 610 },
    cursor: [
      { at: 0, x: 780, y: 760 },
      ...d1.steps,
      ...d2.steps,
      ...d3.steps,
      ...d4.steps,
      ...d5.steps,
      ...d6.steps,
      ...d7.steps,
    ],
    render: () => (
      <AppShell
        title="Overview"
        overlay={
          <>
            {/* Deposit is a full-page takeover in the real app, not a modal. */}
            <Anim cls={s.animFadeOut} at={d5.reactTime} className="absolute inset-0 z-10">
              <Anim cls={s.animReveal} at={d1.reactTime} className="absolute inset-0">
                <DepositPage
                  amountAt={d2.reactTime}
                  providerAt={d3.reactTime}
                  providerPressAt={d3.clickTime}
                  submitPressAt={d4.clickTime}
                />
              </Anim>
            </Anim>

            <WalletPopup
              hit="wallet1"
              at={d4.reactTime}
              pressAt={d5.clickTime}
              outAt={d5.reactTime}
              title="Signature request"
              cta="Sign"
              rows={[
                ['Network', 'Bitcoin Signet'],
                ['Account', 'tb1p8q9g4vfmywknm887…3vdwea'],
                ['Amount', '0.02 sBTC'],
              ]}
            />
            <WalletPopup
              hit="wallet2"
              at={d6.reactTime}
              pressAt={d7.clickTime}
              outAt={d7.reactTime}
              title="Sign transaction"
              cta="Confirm"
              rows={[
                ['Network', 'Bitcoin Signet'],
                ['To', 'tb1pqy2…4h8n0v'],
                ['Amount', '0.02 sBTC'],
              ]}
            />
          </>
        }
      >
        <Anim cls={s.animFadeOut} at={d1.reactTime} className="absolute inset-0">
          <Overview
            collateral="$0 USD"
            available="$0 USD"
            borrowed="$0 USD"
            sub="0 sBTC"
            depositHit="deposit"
            depositPressAt={d1.clickTime}
          />
        </Anim>

        {/* Deposit Progress takes over once the deposit is registered. */}
        <DepositCard
          at={CARD_IN}
          barPct={25}
          barAt={d7.reactTime + 1.6}
          signPressAt={d6.clickTime}
          banner={
            <Banner
              at={CARD_IN + 0.3}
              text={
                <Swap
                  from="0 of 4 steps completed"
                  to="1 of 4 steps completed"
                  at={d7.reactTime + 1.7}
                />
              }
            />
          }
        >
          <StepRow
            n={1}
            title="Register deposit"
            count="0/6"
            countTo="6/6"
            countAt={d7.reactTime + 1.5}
            at={CARD_IN + 0.45}
            items={[
              { label: 'Generate secret for the deposit', at: CARD_IN + 0.9 },
              { label: 'Sign the peg-in BTC transaction', at: d7.reactTime },
              { label: 'Link your Bitcoin and ETH addresses', at: d7.reactTime + 0.5 },
              { label: 'Sign and broadcast BTC pre-pegin tx', at: d7.reactTime + 1.0 },
            ]}
          />
          <StepRow n={2} title="Set up claim" count="0/2" at={CARD_IN + 0.6} />
          <StepRow n={3} title="Sign payout" count="0/4" at={CARD_IN + 0.75} />
          <StepRow n={4} title="Activate BTC Vault" count="0/3" at={CARD_IN + 0.9} />
        </DepositCard>
      </AppShell>
    ),
  },
  {
    title: 'Set up claim',
    caption:
      'Generate the Winternitz one-time signature that commits your claim path.',
    duration: 9,
    focus: CARD_FOCUS,
    cursor: [
      { at: 0, x: 780, y: 760 },
      ...s2a.steps,
      ...s2b.steps,
    ],
    render: () => (
      <AppShell title="Vaults">
        <DepositCard
          barPct={50}
          barAt={s2b.reactTime + 1.5}
          signPressAt={s2a.clickTime}
          banner={
            <Banner
              at={0.4}
              text={
                <Swap
                  from="1 of 4 steps completed"
                  to="2 of 4 steps completed"
                  at={s2b.reactTime + 1.6}
                />
              }
            />
          }
        >
          <StepRow n={1} title="Register deposit" count="6/6" at={0.6} done />
          <StepRow
            n={2}
            title="Set up claim"
            count="0/2"
            countTo="2/2"
            countAt={s2b.reactTime + 1.4}
            at={0.75}
            items={[
              { label: 'Set up Winternitz One-Time Signature (WOTS)', at: s2b.reactTime },
              { label: 'Prepare claim and payout transactions', at: s2b.reactTime + 0.6 },
            ]}
          />
          <StepRow n={3} title="Sign payout" count="0/4" at={0.9} />
          <StepRow n={4} title="Activate BTC Vault" count="0/3" at={1.05} />
        </DepositCard>

        <WalletPopup
          hit="wallet1"
          at={s2a.reactTime}
          pressAt={s2b.clickTime}
          outAt={s2b.reactTime}
          title="Generate Identifier"
          cta="Confirm"
          rows={[
            ['Application', 'babylon-btc-vault'],
            ['Account', 'tb1p8q9g4vfmywknm887…3vdwea'],
            ['Network', 'Bitcoin Signet'],
          ]}
        />
      </AppShell>
    ),
  },
  {
    title: 'Sign payout',
    caption:
      'Sign all four payout and recovery transactions with the vault provider.',
    duration: 11,
    focus: CARD_FOCUS,
    cursor: [
      { at: 0, x: 780, y: 760 },
      ...s3a.steps,
      ...s3b.steps,
    ],
    render: () => (
      <AppShell title="Vaults">
        <DepositCard
          barPct={75}
          barAt={s3b.reactTime + 1.8}
          signPressAt={s3a.clickTime}
          banner={
            <Banner
              at={0.4}
              text={
                <Swap
                  from="2 of 4 steps completed"
                  to="3 of 4 steps completed"
                  at={s3b.reactTime + 1.9}
                />
              }
            />
          }
        >
          <StepRow n={1} title="Register deposit" count="6/6" at={0.55} done />
          <StepRow n={2} title="Set up claim" count="2/2" at={0.7} done />
          <StepRow
            n={3}
            title="Sign payout"
            count="0/4"
            countTo="4/4"
            countAt={s3b.reactTime + 1.7}
            at={0.85}
            items={[
              { label: 'Authenticate session with vault provider', at: s3a.reactTime + 0.3 },
              { label: 'Sign payout transactions (4 of 4)', at: s3b.reactTime },
              { label: 'Sign recovery transactions', at: s3b.reactTime + 0.5 },
              { label: 'Awaiting vault provider verification', at: s3b.reactTime + 1.0 },
            ]}
          />
          <StepRow n={4} title="Activate BTC Vault" count="0/3" at={1.0} />
        </DepositCard>

        <WalletPopup
          hit="wallet1"
          at={s3a.reactTime}
          pressAt={s3b.clickTime}
          outAt={s3b.reactTime}
          title="Sign Multiple Transactions"
          cta="Sign all"
        >
          {/* Each transaction ticks over in turn while the pointer waits. */}
          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded bg-white/[0.06] px-2.5 py-2"
              >
                <span className="text-[10px] text-white/60">Transaction {i + 1}</span>
                <span className="relative h-[18px] w-[48px]">
                  <span
                    className={clsx(
                      s.animFadeOut,
                      'absolute inset-0 rounded bg-white/10 text-center text-[10px] leading-[18px] text-white/50',
                    )}
                    style={{ animationDelay: `${s3b.clickTime + 0.1 + i * 0.3}s` }}
                  >
                    Pending
                  </span>
                  <span
                    className={clsx(
                      s.animReveal,
                      'absolute inset-0 text-center text-[10px] leading-[18px] text-emerald-400',
                    )}
                    style={{ animationDelay: `${s3b.clickTime + 0.1 + i * 0.3}s` }}
                  >
                    Signed
                  </span>
                </span>
              </div>
            ))}
          </div>
        </WalletPopup>
      </AppShell>
    ),
  },
  {
    title: 'Activate vault',
    caption:
      'Download the recovery artifacts, then reveal the secret to activate on Ethereum.',
    duration: 11,
    focus: { x: 615, y: 145, w: 450, h: 520 },
    cursor: [
      { at: 0, x: 800, y: 760 },
      ...s4a.steps,
      ...s4b.steps,
    ],
    render: () => (
      <AppShell
        title="Vaults"
        overlay={
          <>
            <div
              className={clsx(s.animReveal, 'absolute inset-0 bg-[#12495e]/25')}
              style={{ animationDelay: '0.2s' }}
            />

            {/* Centring lives on the wrapper: `animPop` animates `transform`, which
                would otherwise replace the -translate-x-1/2 outright. */}
            <div className="absolute left-1/2 top-[80px] ml-[120px] w-[420px] -translate-x-1/2">
              {/* The dialog must clear out before the confirmation lands: the
                  confirmation card is shorter, so anything left behind shows
                  through below it. */}
              <Anim cls={s.animFadeOut} at={s4b.reactTime + 0.75}>
                <div
                  className={clsx(s.animPop, 'rounded-xl bg-white p-7 text-center shadow-[0_30px_80px_-20px_rgba(18,73,94,0.45)]')}
                  style={{ animationDelay: '0.3s' }}
                >
                  <svg viewBox="0 0 32 38" className="mx-auto mb-4 h-10 w-9" style={{ color: TEAL }}>
                    <path
                      d="M16 1.5L30 6v14c0 8.5-6 13.5-14 16.5C8 33.5 2 28.5 2 20V6z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </svg>

                  <p className="mb-2.5 text-[22px]" style={{ color: TEAL }}>
                    Activate your BTC Vault
                  </p>
                  <p className="mb-5 text-[13px] leading-[18px] text-slate-500">
                    Before activating,{' '}
                    <span style={{ color: TEAL }}>download the recovery artifacts</span>{' '}
                    of your BTC Vault. These files keep it functional even if your
                    vault provider becomes unavailable.
                  </p>

                  <div className="rounded-lg p-4 text-left" style={{ background: '#f7f9fa' }}>
                    <div className="mb-3 flex items-center gap-2.5">
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded text-[13px] text-white"
                        style={{ background: ORANGE }}
                      >
                        ⤓
                      </span>
                      <span className="flex-1">
                        <span className="block text-[13px]" style={{ color: ORANGE }}>
                          Recovery artifacts
                        </span>
                        <span className="block text-[12px] text-slate-500">
                          Encrypted backup files
                        </span>
                      </span>
                      <span className="text-[11px] text-slate-400">Up to ~1 GB</span>
                    </div>

                    {/* Button → download progress → downloaded, three states in place. */}
                    <div className="relative h-[32px]">
                      <Anim cls={s.animFadeOut} at={s4a.reactTime} className="absolute inset-0">
                        <Anim
                          cls={s.animPress}
                          at={s4a.clickTime}
                          hit="download"
                          className="flex h-full items-center justify-center rounded bg-white text-[12.5px] text-slate-600 ring-1"
                          style={{ ['--tw-ring-color' as string]: LINE }}
                        >
                          ⤓ Download Artifacts
                        </Anim>
                      </Anim>
                      <div
                        className={clsx(s.animReveal, 'absolute inset-0 flex items-center')}
                        style={{ animationDelay: `${s4a.reactTime}s` }}
                      >
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={clsx(s.animFill, 'h-full rounded-full bg-emerald-500')}
                            style={{
                              ['--fill' as string]: '100%',
                              animationDelay: `${s4a.reactTime + 0.1}s`,
                              animationDuration: '2.4s',
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className={clsx(
                          s.animReveal,
                          'absolute inset-0 flex items-center justify-center gap-2 rounded bg-emerald-50 text-[12.5px] text-emerald-700',
                        )}
                        style={{ animationDelay: `${s4a.reactTime + 2.6}s` }}
                      >
                        <Check className="h-4 w-4" /> Artifacts downloaded
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <div
                      className="flex-1 rounded py-2.5 text-center text-[13px] text-slate-500 ring-1"
                      style={{ ['--tw-ring-color' as string]: LINE }}
                    >
                      Cancel
                    </div>
                    {/* Present from the start — it is part of the dialog, not
                        something the download unlocks. */}
                    <Anim
                      cls={s.animPress}
                      at={s4b.clickTime}
                      hit="activate"
                      className="flex-1 rounded py-2.5 text-center text-[13px] text-white"
                      style={{ background: ORANGE }}
                    >
                      Activate vault
                    </Anim>
                  </div>
                </div>
              </Anim>

              {/* Confirmation lands after the click, replacing the dialog. */}
              <div
                className={clsx(s.animPop, 'absolute inset-x-0 top-0 rounded-xl bg-white p-9 text-center shadow-[0_30px_80px_-20px_rgba(18,73,94,0.45)]')}
                style={{ animationDelay: `${s4b.reactTime + 0.9}s` }}
              >
                <Check className="mx-auto mb-4 h-14 w-14 text-emerald-500" />
                <p className="mb-1.5 text-[20px]" style={{ color: TEAL }}>
                  BTC Vault active
                </p>
                <p className="mb-0 text-[13px] text-slate-500">
                  The PegIn transaction is broadcasting on Bitcoin. Your vault is now
                  supplied as collateral.
                </p>
              </div>
            </div>
          </>
        }
      >
        {/* The activation dialog stands alone — the signing card behind it
            belongs to the earlier steps, not to this one. */}
        <span />
      </AppShell>
    ),
  },
  {
    title: 'Borrow',
    caption:
      'On Loans, pick the asset, set the amount, confirm — and the loan lands.',
    duration: 17,
    focus: { x: 560, y: 100, w: 560, h: 620 },
    cursor: [
      { at: 0, x: 900, y: 760 },
      ...b1.steps,
      ...b2.steps,
      ...b3.steps,
      ...b4.steps,
      ...b5.steps,
      ...b6.steps,
    ],
    render: () => (
      <AppShell
        title="Loans"
        overlay={
          <>
            {/* Borrow is a full-page takeover; Select asset is another. */}
            <Anim cls={s.animFadeOut} at={b6.reactTime} className="absolute inset-0 z-10">
              <Anim cls={s.animReveal} at={b1.reactTime} className="absolute inset-0">
                <BorrowPage
                  assetPressAt={b2.clickTime}
                  amountAt={b4.reactTime}
                  submitPressAt={b5.clickTime}
                />
              </Anim>
            </Anim>

            <Anim cls={s.animFadeOut} at={b3.reactTime} className="absolute inset-0 z-20">
              <Anim cls={s.animReveal} at={b2.reactTime} className="absolute inset-0">
                <SelectAssetPage pressAt={b3.clickTime} />
              </Anim>
            </Anim>

            <WalletPopup
              hit="wallet1"
              at={b5.reactTime}
              pressAt={b6.clickTime}
              outAt={b6.reactTime}
              title="Transaction request"
              cta="Confirm"
              rows={[
                ['Network', 'Ethereum Sepolia'],
                ['Contract', 'Aave v4 Pool'],
                ['Borrow', '165.49688157 USDC'],
              ]}
            />

            {/* Pending, then the success state the whole scene builds to. The
                scrim stays so the confirmation doesn't float over a live page. */}
            <Anim
              cls={s.animReveal}
              at={b6.reactTime}
              className="absolute inset-0 z-10 bg-[#12495e]/25"
            >
              <span />
            </Anim>

            <div className="absolute left-1/2 top-[220px] z-20 w-[400px] -translate-x-1/2">
              <Anim cls={s.animFadeOut} at={b6.reactTime + 1.4}>
                <div
                  className={clsx(s.animPop, 'rounded-xl bg-white p-8 text-center shadow-[0_30px_80px_-20px_rgba(18,73,94,0.45)]')}
                  style={{ animationDelay: `${b6.reactTime}s` }}
                >
                  <div
                    className="mx-auto mb-4 h-10 w-10 rounded-full border-[3px] border-slate-200"
                    style={{ borderTopColor: ORANGE }}
                  />
                  <p className="mb-0 text-[15px] text-slate-600">
                    Confirming on Ethereum…
                  </p>
                </div>
              </Anim>

              <div
                className={clsx(s.animPop, 'absolute inset-x-0 top-0 rounded-xl bg-white p-10 text-center ring-1')}
                style={{ animationDelay: `${b6.reactTime + 1.5}s`, ['--tw-ring-color' as string]: LINE }}
              >
                <svg viewBox="0 0 64 64" className="mx-auto mb-7 h-[84px] w-[84px]">
                  <circle cx="32" cy="32" r="32" fill="#3b7fce" />
                  <path
                    d="M22 18.5a17 17 0 000 27M42 18.5a17 17 0 010 27"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M32 15v34M37 25.5c-1.2-2-3-2.8-5.4-2.8-3 0-5 1.6-5 4 0 5.6 11 2.8 11 8.6 0 2.6-2.3 4.3-5.6 4.3-2.7 0-4.7-1-5.8-3"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                  />
                </svg>

                <p className="mb-4 text-[30px]" style={{ color: TEAL }}>
                  Borrow successful
                </p>
                <p className="mb-8 text-[16px] text-slate-500">
                  165.49688157 USDC has been credited to your wallet.
                </p>
                <div
                  className="rounded py-3.5 text-center text-[17px] text-white"
                  style={{ background: ORANGE }}
                >
                  Done
                </div>
              </div>
            </div>
          </>
        }
      >
        <LoansPage
          borrowPressAt={b1.clickTime}
          available={<Swap from="$645.20 USD" to="$479.70 USD" at={b6.reactTime + 1.6} />}
          borrowed={<Swap from="$0.00 USD" to="$165.50 USD" at={b6.reactTime + 1.6} />}
          activeLoans={<Swap from="(0)" to="(1)" at={b6.reactTime + 1.6} />}
        />
      </AppShell>
    ),
  },
];
