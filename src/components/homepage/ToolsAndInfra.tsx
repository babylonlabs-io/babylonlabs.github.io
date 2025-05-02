import React from 'react';
import Link from '@docusaurus/Link';
import { DocumentRegular, OpenRegular } from '@fluentui/react-icons';
import { GitHub, Twitter } from 'react-feather';

function SDK({ icon, to, name }: { icon: string; name: string; to?: string }) {
  return (
    <Link
      to={to}
      className="flex cursor-pointer items-center rounded-lg border border-secondary-700 p-2.5 text-inherit hover:border-primary hover:text-primary hover:no-underline"
    >
      <img src={icon} className="mr-2 h-7 w-7" />
      <span className="font-medium">{name}</span>
    </Link>
  );
}

function PartnerCard({ 
  icon, 
  name, 
  tileLink,
  socialLinks 
}: { 
  icon: string; 
  name: string; 
  tileLink: string;
  socialLinks: { [key: string]: string } 
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-secondary-700 p-4 hover:border-primary">
      <Link to={tileLink} className="mb-3 aspect-square w-full max-w-[200px] flex items-center justify-center p-4">
        <img src={icon} className="max-w-full max-h-full object-contain" alt={`${name} logo`} />
      </Link>
      <Link to={tileLink} className="text-white mb-2 font-medium hover:text-primary">{name}</Link>
      <div className="flex gap-2">
        {Object.entries(socialLinks).map(([platform, url]) => (
          <Link key={platform} to={url} className="text-white hover:text-primary">
            {platform === 'twitter' && <Twitter className="h-5 w-5" />}
            {platform === 'website' && <OpenRegular className="h-5 w-5" />}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ToolsAndInfra() {
  const partners = {
    bridges: [
      {
        name: 'Skip (Eureka)',
        icon: '/img/landing-page/tools-and-infra/skip.png',
        tileLink: 'https://go.cosmos.network/',
        socialLinks: {
          twitter: 'https://x.com/SkipProtocol',
          website: 'https://go.cosmos.network/'
        }
      },
      {
        name: 'Union',
        icon: '/img/landing-page/tools-and-infra/union.png',
        tileLink: 'https://btc.union.build/',
        socialLinks: {
          twitter: 'https://x.com/union_build',
          website: 'https://btc.union.build/'
        }
      },
      {
        name: 'Squid Router (Axelar)',
        icon: '/img/landing-page/tools-and-infra/squid.png',
        tileLink: 'https://app.squidrouter.com/',
        socialLinks: {
          twitter: 'https://x.com/axelar',
          website: 'https://app.squidrouter.com/'
        }
      }
    ],
    lsts: [
      {
        name: 'SatLayer',
        icon: '/img/landing-page/tools-and-infra/satlayer.png',
        tileLink: 'https://cube.satlayer.xyz/',
        socialLinks: {
          twitter: 'https://x.com/satlayer',
          website: 'https://cube.satlayer.xyz/'
        }
      },
      {
        name: 'Escher',
        icon: '/img/landing-page/tools-and-infra/escher.jpg',
        tileLink: 'https://app.escher.finance/',
        socialLinks: {
          twitter: 'https://x.com/escher_fi',
          website: 'https://app.escher.finance/'
        }
      },
      {
        name: 'MilkyWay',
        icon: '/img/landing-page/tools-and-infra/milkyway.jpg',
        tileLink: 'https://app.milkyway.zone/stake?tab=stake',
        socialLinks: {
          twitter: 'https://x.com/milky_way_zone',
          website: 'https://app.milkyway.zone/stake?tab=stake'
        }
      }
    ],
    dexes: [
      {
        name: 'Tower',
        icon: '/img/landing-page/tools-and-infra/tower.jpg',
        tileLink: 'https://towerprotocol.com',
        socialLinks: {
          twitter: 'https://twitter.com/towerprotocol',
          website: 'https://towerprotocol.com'
        }
      },
      {
        name: 'Persistence',
        icon: '/img/landing-page/tools-and-infra/persistence.jpg',
        tileLink: 'https://app.persistence.one/?from=BABY&to=XPRT',
        socialLinks: {
          twitter: 'https://twitter.com/PersistenceOne',
          website: 'https://persistence.one'
        }
      }
    ]
  };

  return (
    <section className="mx-auto mb-16 flex w-full max-w-5xl flex-col p-4 py-0">
      <span className="mb-2 uppercase tracking-wider text-text-400">
        Tools & Infrastructure
      </span>

      {/* <h3 className="mb-12 text-3xl">
        Building the Bitcoin's Future Together
      </h3> */}

      <div className="mb-10">
        <h4 className="mb-6 text-2xl">Bridges</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {partners.bridges.map((partner) => (
            <PartnerCard key={partner.name} {...partner} />
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h4 className="mb-6 text-2xl">Liquid Staking Tokens</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {partners.lsts.map((partner) => (
            <PartnerCard key={partner.name} {...partner} />
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-6 text-2xl">Decentralized Exchanges</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {partners.dexes.map((partner) => (
            <PartnerCard key={partner.name} {...partner} />
          ))}
        </div>
      </div>
    </section>
  );
}
