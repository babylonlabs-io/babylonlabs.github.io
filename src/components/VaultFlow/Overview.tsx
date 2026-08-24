import React from 'react';
import clsx from 'clsx';

import { LINE, ORANGE, TEAL } from './AppShell';
import s from './styles.module.css';

/** The Overview page — Position, Risk, Liquidation Analysis — as the app has it. */

function Info() {
  return (
    <svg viewBox="0 0 16 16" className="inline h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="8" cy="8" r="6.6" />
      <path d="M8 7.2v4M8 4.9v.1" strokeLinecap="round" />
    </svg>
  );
}

function Action({
  label,
  enabled,
  hit,
  pressAt,
}: {
  label: string;
  enabled?: boolean;
  hit?: string;
  pressAt?: number;
}) {
  return (
    <div
      data-hit={hit}
      className={clsx(pressAt !== undefined && s.animPress, 'rounded px-6 py-2.5 text-[15px]')}
      style={{
        background: enabled ? '#dce6ec' : '#eef2f5',
        color: enabled ? TEAL : '#9fb0bb',
        animationDelay: pressAt !== undefined ? `${pressAt}s` : undefined,
      }}
    >
      {label}
    </div>
  );
}

function Meter({ pct, label }: { pct: number; label: React.ReactNode }) {
  return (
    <div className="mt-2 flex items-center gap-2 whitespace-nowrap">
      <span className="h-1 w-[88px] shrink-0 overflow-hidden rounded-full bg-slate-200">
        <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: TEAL }} />
      </span>
      <span className="text-[13px] text-slate-400">{label}</span>
    </div>
  );
}

export default function Overview({
  collateral,
  available,
  borrowed,
  sub,
  depositHit,
  depositPressAt,
  borrowHit,
  borrowPressAt,
  borrowEnabled,
  health,
  borrowedPct,
}: {
  collateral: React.ReactNode;
  available: React.ReactNode;
  borrowed: React.ReactNode;
  sub: React.ReactNode;
  depositHit?: string;
  depositPressAt?: number;
  borrowHit?: string;
  borrowPressAt?: number;
  borrowEnabled?: boolean;
  /** Replaces the "No Position" line once there is a loan. */
  health?: React.ReactNode;
  borrowedPct?: React.ReactNode;
}) {
  return (
    <div className="px-[42px] pt-8">
      <p className={clsx(s.animFadeUp, 'mb-3 text-[20px]')} style={{ color: TEAL }}>
        Position
      </p>

      <div
        className={clsx(s.animFadeUp, 'mb-8 grid grid-cols-3 rounded-lg px-8 py-6')}
        style={{ background: '#f9fafb', animationDelay: '0.15s' }}
      >
        <div className="pr-8">
          <p className="mb-2 text-[14px] text-slate-500">
            Total collateral value <Info />
          </p>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="mb-0 text-[24px]" style={{ color: TEAL }}>
                {collateral}
              </p>
              <p className="mb-0 mt-1 text-[13px] text-slate-400">{sub}</p>
            </div>
            <Action label="Deposit" enabled hit={depositHit} pressAt={depositPressAt} />
          </div>
        </div>

        <div className="border-l px-8" style={{ borderColor: LINE }}>
          <p className="mb-2 text-[14px] text-slate-500">Available to borrow</p>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="mb-0 text-[24px]" style={{ color: TEAL }}>
                {available}
              </p>
              <Meter pct={borrowEnabled ? 62 : 0} label={borrowEnabled ? '62% remaining' : '0% remaining'} />
            </div>
            <Action
              label="Borrow"
              enabled={borrowEnabled}
              hit={borrowHit}
              pressAt={borrowPressAt}
            />
          </div>
        </div>

        <div className="border-l pl-8" style={{ borderColor: LINE }}>
          <p className="mb-2 text-[14px] text-slate-500">Total borrowed</p>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="mb-0 text-[24px]" style={{ color: TEAL }}>
                {borrowed}
              </p>
              <Meter pct={borrowedPct ? 41 : 0} label={borrowedPct ?? '0% borrowed'} />
            </div>
            <Action label="Repay" />
          </div>
        </div>
      </div>

      <p className={clsx(s.animFadeUp, 'mb-3 text-[20px]')} style={{ color: TEAL }} >
        Risk
      </p>

      <div
        className={clsx(s.animFadeUp, 'grid grid-cols-[1fr_auto] gap-10 rounded-lg border px-8 py-6')}
        style={{ borderColor: LINE, animationDelay: '0.3s' }}
      >
        <div>
          <div className="mb-1 flex items-center gap-3">
            <span className="text-[18px]" style={{ color: TEAL }}>
              Health Factor
            </span>
            <span className="ml-auto flex items-center gap-2 text-[15px] text-slate-400">
              {health ? <span className="text-emerald-600">2.41</span> : '—'}
              <svg viewBox="0 0 24 22" className="h-5 w-5 text-slate-300" fill="currentColor">
                <path d="M12 21S2 14.5 2 8.3A5.3 5.3 0 0112 5.6 5.3 5.3 0 0122 8.3C22 14.5 12 21 12 21z" />
              </svg>
            </span>
          </div>
          <p className="mb-3 max-w-[420px] text-[14px] leading-[19px] text-slate-500">
            Indicates the health of your position. When the ratio falls below
            1.0, liquidation may occur.
          </p>
          <p className="mb-4 flex items-center gap-2 text-[15px] text-slate-400">
            {health ?? (
              <>
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" /> No
                Position
              </>
            )}
          </p>

          <div className="grid max-w-[520px] grid-cols-3 rounded-lg border" style={{ borderColor: LINE }}>
            {[
              ['Liquidation BTC Price', health ? '$35,120' : '–'],
              ['Current BTC Price', '$63,826'],
              ['Collateral Factor', '78%'],
            ].map(([label, value], i) => (
              <div key={label} className={clsx('px-4 py-3', i > 0 && 'border-l')} style={{ borderColor: LINE }}>
                <p className="mb-1 text-[13px] text-slate-500">{label}</p>
                <p className="mb-0 text-[15px]" style={{ color: TEAL }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* BTC/USD price rail */}
        <div className="w-[420px] pt-1">
          <p className="mb-6 text-right text-[13px] text-slate-500">BTC/USD</p>
          <p className="mb-1 text-center text-[13px] text-slate-500">Current Price</p>
          <p className="mb-3 text-center text-[15px]" style={{ color: TEAL }}>
            $63,826
          </p>
          <div className="relative h-1 rounded-full bg-emerald-500">
            <span className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-500 bg-white" />
          </div>
          <div className="mt-2 flex justify-between text-[12px] text-slate-400">
            {['55k', '60k', '65k', '70k', '75k'].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <p className={clsx(s.animFadeUp, 'mb-3 mt-8 text-[20px]')} style={{ color: TEAL }}>
        Liquidation Analysis
      </p>
      <div
        className={clsx(s.animFadeUp, 'rounded-lg border py-10 text-center')}
        style={{ borderColor: LINE, animationDelay: '0.45s' }}
      >
        <p className="mb-1 text-[18px]" style={{ color: TEAL }}>
          No deposit yet
        </p>
        <p className="mb-0 text-[14px] text-slate-500">
          Add collateral to unlock borrowing and see how your position responds
          to liquidation risk.
        </p>
      </div>

      <span className="hidden" style={{ color: ORANGE }} />
    </div>
  );
}
