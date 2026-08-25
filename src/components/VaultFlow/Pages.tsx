import React from 'react';
import clsx from 'clsx';

import { Gear, LINE, ORANGE, Swap, TEAL } from './AppShell';
import s from './styles.module.css';

/*
 * Deposit and Borrow are not modals in the real app — they are full-page
 * takeovers: no sidebar, a close X top-left, and Testnet + settings still in
 * the top-right. These recreate them, along with the Loans page and the
 * Select-asset sheet the borrow flow passes through.
 */

const MUTED = '#8ba0ac';

function Info() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="inline h-4 w-4"
      style={{ color: TEAL }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
    >
      <circle cx="8" cy="8" r="6.6" />
      <path d="M8 7.2v4M8 4.9v.1" strokeLinecap="round" />
    </svg>
  );
}

function Heart({ colour = '#f0b429' }: { colour?: string }) {
  return (
    <svg viewBox="0 0 24 22" className="inline h-4 w-4" fill={colour}>
      <path d="M12 21S2 14.5 2 8.3A5.3 5.3 0 0112 5.6 5.3 5.3 0 0122 8.3C22 14.5 12 21 12 21z" />
    </svg>
  );
}

/**
 * Slider rail. `pct` is where the knob sits; the filled part uses `fill`.
 * `hitPct` drops an invisible target at the position the pointer drags to.
 */
function Slider({
  pct,
  fill,
  hitPct,
}: {
  pct: number;
  fill?: string;
  hitPct?: number;
}) {
  return (
    <div className="relative my-4 h-1.5">
      <div className="absolute inset-0 rounded-full" style={{ background: '#dfe6ea' }} />
      {hitPct !== undefined && (
        <span
          data-hit="slider"
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${hitPct}%` }}
        />
      )}
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-[width]"
        style={{ width: `${pct}%`, background: fill ?? 'transparent' }}
      />
      <span
        className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow"
        style={{ left: `calc(${pct}% - 10px)`, border: `1px solid ${LINE}` }}
      />
    </div>
  );
}

/** Full-page takeover chrome. */
export function FullPage({ children }: { children: React.ReactNode }) {
  return (
    <div className={clsx(s.animReveal, 'absolute inset-0 bg-white')}>
      <svg
        viewBox="0 0 24 24"
        className="absolute left-9 top-8 h-6 w-6"
        style={{ color: TEAL }}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M5 5l14 14M19 5L5 19" />
      </svg>

      <div className="absolute right-9 top-7 flex items-center gap-4">
        <span
          className="rounded-full px-3 py-1 text-[14px]"
          style={{ background: '#f9f9f9', color: ORANGE }}
        >
          Testnet
        </span>
        <Gear />
      </div>

      {children}
    </div>
  );
}

// ------------------------------------------------------------------ deposit

export function DepositPage({
  amountAt,
  providerAt,
  providerPressAt,
  submitPressAt,
}: {
  amountAt: number;
  providerAt: number;
  providerPressAt: number;
  submitPressAt: number;
}) {
  return (
    <FullPage>
      <div className="absolute left-1/2 top-[92px] w-[560px] -translate-x-1/2">
        <p className="mb-5 text-[30px] text-black">Deposit</p>

        <div
          className="rounded-lg border p-5"
          style={{ borderColor: LINE, background: '#fbfcfc' }}
        >
          <div className="flex items-center">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#b81a86] text-[18px] font-bold text-white">
              ₿
            </span>
            <span className="ml-3 text-[20px]" style={{ color: TEAL }}>
              Signet Bitcoin
            </span>
            <span
              className="ml-auto rounded px-4 py-2 text-right text-[20px] tabular-nums"
              style={{ background: '#f1f4f6', color: MUTED, minWidth: 96 }}
            >
              <Swap from="0" to="0.02" at={amountAt} />
            </span>
          </div>

          {/* Knob position tracks the amount the pointer just set. */}
          <div className={s.animReveal} style={{ animationDelay: '0s' }}>
            <Slider pct={0} hitPct={38} />
          </div>
          <div
            className={clsx(s.animReveal, '-mt-[26px]')}
            style={{ animationDelay: `${amountAt}s` }}
          >
            <Slider pct={38} fill={TEAL} />
          </div>

          <div className="flex items-center text-[15px]" style={{ color: MUTED }}>
            <span><Swap from="$0.00 USD" to="$1,276.52 USD" at={amountAt} /></span>
            <span className="ml-auto flex items-center gap-2">
              Balance: 0.05196029 sBTC <Info />
              <span className="rounded px-2 py-0.5" style={{ background: '#eef2f4' }}>
                Max
              </span>
            </span>
          </div>

          <div className="mt-3 flex items-center text-[15px]" style={{ color: TEAL }}>
            <span>Max to Borrow:</span>
            <span className="ml-auto">
              <Swap from="-- (CF=78%)" to="$995.68 (CF=78%)" at={amountAt} />
            </span>
          </div>
        </div>

        <div
          className="mt-4 flex items-center rounded-lg px-5 py-4 text-[17px]"
          style={{ background: '#f7f9fa', color: TEAL }}
        >
          Do not split
          <span className="ml-auto">⌄</span>
        </div>

        <div
          data-hit="provider"
          className={clsx(s.animPress, 'mt-4 flex items-center rounded-lg px-5 py-4 text-[17px]')}
          style={{ background: '#f7f9fa', animationDelay: `${providerPressAt}s` }}
        >
          <span style={{ color: TEAL }}>
            <Swap from="Select vault provider" to="Babylon Labs" at={providerAt} />
          </span>
          <span className="ml-auto" style={{ color: TEAL }}>
            ⌄
          </span>
        </div>

        {/* Disabled until there is an amount, then it becomes the real action. */}
        <div className="relative mt-4 h-[56px]">
          <div
            className={clsx(s.animFadeOut, 'absolute inset-0 flex items-center justify-center rounded text-[18px] text-white')}
            style={{ background: '#3d7285', animationDelay: `${amountAt}s` }}
          >
            Enter an amount
          </div>
          <div
            className={clsx(s.animReveal, 'absolute inset-0')}
            style={{ animationDelay: `${amountAt}s` }}
          >
            <div
              data-hit="submit"
              className={clsx(s.animPress, 'flex h-full items-center justify-center rounded text-[18px] text-white')}
              style={{ background: ORANGE, animationDelay: `${submitPressAt}s` }}
            >
              Deposit
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-2.5 text-[15px]">
          {[
            ['Transaction Reserve', '0.00012 sBTC'],
            ['Deposit Fee', '0.00004 sBTC'],
            ['VP commission', '0.5%'],
            ['Net payout', '0.01984 sBTC'],
          ].map(([k, v]) => (
            <div key={k} className="flex">
              <span style={{ color: TEAL }}>{k}</span>
              <span className="ml-auto" style={{ color: MUTED }}>
                <Swap from="--" to={v} at={amountAt} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </FullPage>
  );
}

// ------------------------------------------------------------------- borrow

export function SelectAssetPage({ pressAt }: { pressAt: number }) {
  const rows: [string, string, string, string, string][] = [
    ['USD Coin', 'USDC', '$1.00', '9.96M USDC', '0.02%'],
    ['Tether USD', 'USDT', '$1.00', '9.94M USDT', '0.03%'],
    ['Wrapped BTC', 'WBTC', '$63,839', '25M WBTC', '0.25%'],
  ];
  const dot = ['#2775ca', '#26a17b', '#0b0b0b'];

  return (
    <FullPage>
      <div className="absolute left-1/2 top-[190px] w-[620px] -translate-x-1/2">
        <div className="rounded-lg border" style={{ borderColor: LINE }}>
          <p className="mb-0 border-b px-6 py-5 text-[22px]" style={{ borderColor: LINE, color: TEAL }}>
            Select asset
          </p>

          <div className="px-4 py-4">
            <div className="mb-2 grid grid-cols-[1fr_90px_130px_90px] px-3 text-[14px]" style={{ color: MUTED }}>
              <span>Asset</span>
              <span>Price</span>
              <span>Available</span>
              <span>Borrow APR</span>
            </div>

            {rows.map(([name, sym, price, avail, apr], i) => (
              <div
                key={sym}
                data-hit={i === 0 ? 'usdc' : undefined}
                className={clsx(
                  i === 0 && s.animPress,
                  'mb-2 grid grid-cols-[1fr_90px_130px_90px] items-center rounded-lg px-3 py-3',
                )}
                style={{ background: '#f7f9fa', animationDelay: i === 0 ? `${pressAt}s` : undefined }}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold text-white"
                    style={{ background: dot[i] }}
                  >
                    {sym === 'USDC' ? '$' : sym === 'USDT' ? 'T' : '₿'}
                  </span>
                  <span>
                    <span className="block text-[15px]" style={{ color: TEAL }}>
                      {name}
                    </span>
                    <span className="block text-[13px]" style={{ color: MUTED }}>
                      {sym}
                    </span>
                  </span>
                </span>
                <span className="text-[15px]" style={{ color: TEAL }}>
                  {price}
                </span>
                <span className="text-[15px]" style={{ color: TEAL }}>
                  {avail}
                </span>
                <span className="text-[15px]" style={{ color: TEAL }}>
                  {apr}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FullPage>
  );
}

export function BorrowPage({
  assetPressAt,
  amountAt,
  submitPressAt,
}: {
  assetPressAt: number;
  amountAt: number;
  submitPressAt: number;
}) {
  return (
    <FullPage>
      <div className="absolute left-1/2 top-[128px] w-[560px] -translate-x-1/2">
        <p className="mb-5 text-[26px]" style={{ color: TEAL }}>
          Borrow
        </p>

        <div className="rounded-lg p-5" style={{ background: '#f7f9fa' }}>
          <div className="flex items-center">
            <span
              data-hit="asset"
              className={clsx(s.animPress, 'flex items-center gap-2 rounded-full py-2 pl-2 pr-4')}
              style={{ background: '#e6ecef', animationDelay: `${assetPressAt}s` }}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2775ca] text-[12px] font-bold text-white">
                $
              </span>
              <span className="text-[18px]" style={{ color: TEAL }}>
                USDC
              </span>
              <span style={{ color: TEAL }}>⌄</span>
            </span>

            <span
              className="ml-auto rounded px-4 py-2.5 text-right text-[20px] tabular-nums"
              style={{ background: '#eef2f4', color: MUTED, minWidth: 200 }}
            >
              <Swap from="0" to="165.49688157" at={amountAt} />
            </span>
          </div>

          <div className={s.animReveal}>
            <Slider pct={0} hitPct={34} />
          </div>
          <div className={clsx(s.animReveal, '-mt-[26px]')} style={{ animationDelay: `${amountAt}s` }}>
            <Slider pct={34} fill="#2f7fd4" />
          </div>

          <div className="flex items-center text-[15px]" style={{ color: MUTED }}>
            <span><Swap from="$0.00 USD" to="$165.50 USD" at={amountAt} /></span>
            <span className="ml-auto flex items-center gap-2">
              Available: 479.701106 USDC
              <span className="rounded px-2 py-0.5" style={{ background: '#eef2f4' }}>
                Max
              </span>
            </span>
          </div>
        </div>

        <div className="mt-4 rounded-lg p-5" style={{ background: '#f7f9fa' }}>
          <div className="flex text-[15px]">
            <span style={{ color: MUTED }}>Available liquidity</span>
            <span className="ml-auto" style={{ color: TEAL }}>
              9.96M USDC
            </span>
          </div>
          <div className="my-4 h-px" style={{ background: LINE }} />
          <div className="flex text-[15px]">
            <span className="flex items-center gap-1.5" style={{ color: MUTED }}>
              Borrow APR <Info />
            </span>
            <span className="ml-auto" style={{ color: TEAL }}>
              0.02%
            </span>
          </div>
          <div className="mt-3 flex text-[15px]">
            <span className="flex items-center gap-1.5" style={{ color: MUTED }}>
              Utilization <Info />
            </span>
            <span className="ml-auto" style={{ color: TEAL }}>
              0.4%
            </span>
          </div>
          <div className="my-4 h-px" style={{ background: LINE }} />
          <div className="flex text-[15px]">
            <span className="flex items-center gap-1.5" style={{ color: MUTED }}>
              Health factor <Info />
            </span>
            <span className="ml-auto flex items-center gap-1.5" style={{ color: TEAL }}>
              <Swap
                from={<><Heart /> 2.41</>}
                to={<><Heart /> 2.41 → <Heart colour="#3ea76a" /> 1.94</>}
                at={amountAt}
              />
            </span>
          </div>
        </div>

        <div className="relative mt-5 h-[56px]">
          <div
            className={clsx(s.animFadeOut, 'absolute inset-0 flex items-center justify-center rounded text-[18px] text-white')}
            style={{ background: '#9dbac6', animationDelay: `${amountAt}s` }}
          >
            Enter an amount
          </div>
          <div
            className={clsx(s.animReveal, 'absolute inset-0')}
            style={{ animationDelay: `${amountAt}s` }}
          >
            <div
              data-hit="submit"
              className={clsx(s.animPress, 'flex h-full items-center justify-center rounded text-[18px] text-white')}
              style={{ background: ORANGE, animationDelay: `${submitPressAt}s` }}
            >
              Borrow
            </div>
          </div>
        </div>
      </div>
    </FullPage>
  );
}

// -------------------------------------------------------------------- loans

export function LoansPage({
  borrowPressAt,
  borrowed,
  available,
  activeLoans,
}: {
  borrowPressAt: number;
  borrowed: React.ReactNode;
  available: React.ReactNode;
  activeLoans: React.ReactNode;
}) {
  return (
    <div className="px-[42px] pt-7">
      <div className="grid grid-cols-3 rounded-lg px-8 py-6" style={{ background: '#f9fafb' }}>
        <div className="pr-8">
          <p className="mb-2 text-[14px]" style={{ color: MUTED }}>
            Available to borrow
          </p>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="mb-0 text-[24px]" style={{ color: TEAL }}>
                {available}
              </p>
              <div className="mt-3 flex items-center gap-2 whitespace-nowrap">
                <span className="h-1 w-[88px] shrink-0 overflow-hidden rounded-full bg-slate-200">
                  <span className="block h-full w-[62%] rounded-full" style={{ background: ORANGE }} />
                </span>
                <span className="text-[13px]" style={{ color: MUTED }}>
                  62% remaining
                </span>
              </div>
            </div>
            <div
              data-hit="borrow"
              className={clsx(s.animPress, 'rounded px-6 py-2.5 text-[15px]')}
              style={{ background: '#dce6ec', color: TEAL, animationDelay: `${borrowPressAt}s` }}
            >
              Borrow
            </div>
          </div>
        </div>

        <div className="border-l px-8" style={{ borderColor: LINE }}>
          <p className="mb-2 text-[14px]" style={{ color: MUTED }}>
            Total borrowed
          </p>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="mb-0 text-[24px]" style={{ color: TEAL }}>
                {borrowed}
              </p>
              <div className="mt-3 flex items-center gap-2 whitespace-nowrap">
                <span className="h-1 w-[88px] shrink-0 overflow-hidden rounded-full bg-slate-200">
                  <span className="block h-full w-[38%] rounded-full" style={{ background: ORANGE }} />
                </span>
                <span className="text-[13px]" style={{ color: MUTED }}>
                  38% borrowed
                </span>
              </div>
            </div>
            <div className="rounded px-6 py-2.5 text-[15px]" style={{ background: '#eef2f5', color: '#9fb0bb' }}>
              Repay
            </div>
          </div>
        </div>

        <div className="border-l pl-8" style={{ borderColor: LINE }}>
          <p className="mb-2 flex items-center gap-1.5 text-[14px]" style={{ color: MUTED }}>
            Health factor <Info />
          </p>
          <p className="mb-2 flex items-center gap-2 text-[24px]" style={{ color: '#3ea76a' }}>
            1.94 <Heart colour="#3ea76a" />
          </p>
          <p className="mb-0 text-[13px]" style={{ color: MUTED }}>
            When the ratio falls below 1.0, liquidation may occur.
          </p>
        </div>
      </div>

      <p className="mb-3 mt-7 text-[20px]" style={{ color: TEAL }}>
        Active Loans {activeLoans}
      </p>

      <div className="rounded-lg border px-5 py-4" style={{ borderColor: LINE }}>
        <div className="grid grid-cols-[1fr_140px_180px_120px_auto] items-center gap-4">
          <span className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2775ca] text-[13px] font-bold text-white">
              $
            </span>
            <span className="text-[16px]" style={{ color: TEAL }}>
              165.49688157 USDC
            </span>
          </span>
          {[
            ['Borrow APR', '0.02%'],
            ['Available liquidity', '9.96M USDC'],
            ['Utilization', '0.4%'],
          ].map(([k, v]) => (
            <span key={k}>
              <span className="block text-[13px]" style={{ color: MUTED }}>
                {k}
              </span>
              <span className="block text-[15px]" style={{ color: TEAL }}>
                {v}
              </span>
            </span>
          ))}
          <span className="flex gap-3">
            {['Borrow more', 'Repay'].map((l) => (
              <span
                key={l}
                className="rounded px-5 py-2.5 text-[14px]"
                style={{ background: '#dce6ec', color: TEAL }}
              >
                {l}
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
