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
  logoLink,
  socialLinks 
}: { 
  icon: string; 
  name: string; 
  logoLink: string;
  socialLinks: { [key: string]: string } 
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-secondary-700 p-4 hover:border-primary">
      <Link to={logoLink} className="mb-3">
        <img src={icon} className="h-16 w-16" alt={`${name} logo`} />
      </Link>
      <span className="mb-2 font-medium">{name}</span>
      <div className="flex gap-2">
        {Object.entries(socialLinks).map(([platform, url]) => (
          <Link key={platform} to={url} className="text-text-400 hover:text-primary">
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
        name: 'Skip',
        icon: '/static/',
        logoLink: 'https://skip.money',
        socialLinks: {
          twitter: 'https://twitter.com/skip_protocol',
          website: 'https://skip.money'
        }
      },
      {
        name: 'Union',
        icon: '/static/landing-page/partners/union.png',
        logoLink: 'https://union.finance',
        socialLinks: {
          twitter: 'https://twitter.com/union_build',
          website: 'https://union.finance'
        }
      },
      {
        name: 'Axelar',
        icon: '/static/landing-page/partners/axelar.png',
        logoLink: 'https://axelar.network',
        socialLinks: {
          twitter: 'https://twitter.com/axelarnetwork',
          website: 'https://axelar.network'
        }
      }
    ],
    lsts: [
      {
        name: 'SatLayer',
        icon: '/static/landing-page/partners/satlayer.png',
        logoLink: 'https://satlayer.com',
        socialLinks: {
          twitter: 'https://twitter.com/satlayer',
          website: 'https://satlayer.com'
        }
      },
      {
        name: 'MilkyWay',
        icon: '/static/landing-page/partners/milkyway.png',
        logoLink: 'https://milkyway.zone',
        socialLinks: {
          twitter: 'https://twitter.com/milkywayzone',
          website: 'https://milkyway.zone'
        }
      },
      {
        name: 'Escher',
        icon: '/static/landing-page/partners/escher.png',
        logoLink: 'https://escherlabs.com',
        socialLinks: {
          twitter: 'https://twitter.com/escher_labs',
          website: 'https://escherlabs.com'
        }
      }
    ],
    dexes: [
      {
        name: 'Tower',
        icon: '/static/landing-page/partners/tower.png',
        logoLink: 'https://towerprotocol.com',
        socialLinks: {
          twitter: 'https://twitter.com/towerprotocol',
          website: 'https://towerprotocol.com'
        }
      },
      {
        name: 'Persistence',
        icon: '/static/landing-page/partners/persistence.png',
        logoLink: 'https://persistence.one',
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

      <h3 className="mb-12 text-3xl">
        Building the Bitcoin's Future Together
      </h3>

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
