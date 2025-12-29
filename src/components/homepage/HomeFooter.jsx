import React, {useState} from 'react';
import Link from '@docusaurus/Link';
import {Linkedin, Youtube, Github} from '@styled-icons/boxicons-logos';
import {XIcon} from '@site/src/icons';
import ThemedImage from '@theme/ThemedImage';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import LlmCopyButton from '@site/src/components/LlmCopyButton';

const developers = [
  {
    name: 'Docs',
    href: '/guides/overview/',
  },
  {
    name: 'Developer Events',
    href: 'https://linktr.ee/buildonbabylon',
  },
  {
    name: 'Project Showcase',
    href: 'https://dorahacks.io/hackathon/babylon-hakcer-house-bangkok/buidl',
  }
];

function Links({ name, links, isAccordion }) {
  //To control accordion in footer
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (href) => {
    setActiveAccordion((prevAccordion) =>
      prevAccordion === href ? null : href
    );
  };

  return (
    <div>
      <h3 className="font-jakarta text-base font-semibold uppercase text-gray-400 dark:text-[#fff]">
        {name}
      </h3>
      <div className="flex flex-col gap-3">
        {links.map(({ name, href, isAccordion, content }) => (
          <Link
            key={name}
            href={href}
            className="text-base text-gray-700 hover:text-primary hover:no-underline dark:text-[#f9f9f9] hover:dark:text-primary"
            onClick={() => (isAccordion ? toggleAccordion(href) : null)}
          >
            {name}
            {isAccordion && activeAccordion === href && (
              <ul style={{ paddingLeft: '1rem', listStyle: 'unset' }}>
                {content.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-base text-gray-700 hover:text-primary hover:no-underline dark:text-[#f9f9f9] hover:dark:text-primary"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const { withBaseUrl } = useBaseUrlUtils();
  return (
    <footer>
      <div className="mx-auto flex w-full max-w-[1080px] flex-col px-6 py-12">
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <ThemedImage
            isLogo
            alt="Babylon"
            className="h-9 w-fit lg:h-12"
            sources={{
              light: withBaseUrl('/logo/babylon.svg'),
              dark: withBaseUrl('/logo/babylon_dark.svg'),
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 gap-y-12 md:justify-between lg:flex lg:flex-wrap dark:hover:text-[#BEDCC9]">
          <Links name="Developers" links={developers} className="dark:hover:text-[#00e0ff]"/>
        </div>

        <hr className="my-12 !bg-gray-300 dark:!bg-[#999]"/>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
          <div className="flex flex-wrap gap-2 text-sm text-gray-500">
            <Link
              href="https://babylonlabs.io/privacy-policy"
              className="text-inherit hover:text-black hover:underline dark:text-[#999] dark:hover:text-[#BEDCC9]"
            >
              Privacy Policy
            </Link>
            &bull;
            <Link
              href="https://babylonlabs.io/terms"
              className="text-inherit hover:text-black hover:underline dark:text-[#999] dark:hover:text-[#BEDCC9]"
            >
              Terms of Service
            </Link>
            &bull;
            <span className="text-inherit dark:text-[#999]">
              &copy; {new Date().getFullYear()} Babylon Labs.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <LlmCopyButton />
            <Link
              href="https://github.com/babylonlabs-io"
              aria-label="Babylon LabsGitHub Organization"
            >
              <Github className="h-7 w-7 text-zinc-400 hover:text-primary"/>
            </Link>
            <Link
              href="https://www.linkedin.com/company/babylon-labs-official/"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-7 w-7 text-zinc-400 hover:text-primary"/>
            </Link>
            <Link href="https://x.com/babylonlabs_io" aria-label="Twitter">
              <XIcon className="h-7 w-7 text-zinc-400 hover:text-primary"/>
            </Link>
            <Link
              href="https://www.youtube.com/@babylonlabs"
              aria-label="Babylon Labs YouTube Channel"
            >
              <Youtube className="h-7 w-7 text-zinc-400 hover:text-primary"/>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
