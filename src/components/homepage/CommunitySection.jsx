import React from 'react';
import Link from '@docusaurus/Link';

export default function CommunitySection() {
  return (
    <section className="no-underline-links">
      <div className="w-3/5 h-px mx-auto mb-8 bg-primary-200"></div>
      <div className="mx-auto flex w-full flex-col items-center justify-centefrom-[#262626] to-black px-4 py-16 pt-16 text-white dark:from-zinc-200/90 dark:to-white dark:text-zinc-700">
        <h2 className="text-3xl">
         <span
           className=" text-black dark:text-white rounded">Join the</span> <span style={{ color: 'var(--ifm-color-primary)' }}>community</span>
        </h2>
        <p className="mb-10 text-zinc-500">
          Engage with our ever-growing community to get the latest updates,
          product support, and more.
        </p>
        <div className="flex w-full flex-col items-center justify-center gap-2 text-sm font-semibold lg:flex-row lg:gap-8">
          <Link
            className="flex w-full items-center justify-center gap-2  border border-solid border-primary-100 px-8 py-2
            hover:border-primary-100  hover:text-primary-200 dark:hover:border-primary-200 dark:hover:text-[#33C5CE] lg:w-auto"
            href="https://discord.com/invite/babylonglobal"
          >
            Discord
          </Link>
          <Link
            className="flex w-full items-center justify-center gap-2  border border-solid border-primary-100 px-8 py-2
            hover:border-primary-100 hover:text-primary-200 dark:hover:border-primary-200 dark:hover:text-[#33C5CE] lg:w-auto"
            href="https://x.com/babylonlabs_io"
          >
           Twitter
          </Link>
          <Link
            className="flex w-full items-center justify-center gap-2 border border-solid border-primary-100 px-8 py-2
            hover:border-primary-100 hover:text-primary-200 dark:hover:border-primary-200 dark:hover:text-[#33C5CE] lg:w-auto"
            href="https://www.linkedin.com/company/babylon-labs-official/"
          >
           LinkedIn
          </Link>
        </div>
      </div>
    </section>
  );
}
