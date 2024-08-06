import React from 'react';
import styles from './styles.module.css';
import one from '../../../static/img/firstgif.gif';
import two from '../../../static/img/installationguide.gif';
import four from '../../../static/img/modules.gif';
import six from '../../../static/img/resources.gif';
import eight from '../../../static/img/restapi.gif';
import nine from '../../../static/img/supp.gif';
import eleven from '../../../static/img/cli.gif';

const FeatureList = [
  {
    url: 'docs/introduction/overview',
    title: 'Introduction',
    image: one,
    description: (
      <> 
        Uncover the secrets of how Babylon operates.
      </>
    ),
  },
  {
    url: 'docs/user-guides/installation',
    title: 'Installation Guide',
    image: two,
    description: (
      <>
        Find out how to kick off your Babylon journey here.
      </>
    ),
  },
  {
    url: 'docs/developer-guides/modules/overview',
    title: 'Modules',
    image: four,
    description: (
      <>
        Discover the modules we offer.
      </>
    ),
  },
  {
    url: 'docs/user-guides/btc-staking-testnet/overview',
    title: 'Testnet',
    image: six,
    description: (
      <>
        Use the Testnet resources to enhance your Babylon understanding.
      </>
    ),
  },
  {
    url: 'docs/developer-guides/grpcrestapi',
    title: 'gRPC Gateway (REST API)',
    image: eight,
    description: (
      <>
        Have a look at our Rest API components!
      </>
    ),
  },
  {
    url: 'docs/support',
    title: 'Support',
    image: nine,
    description: (
      <>
        Get the support you need to succeed with our dedicated team of experts!
      </>
    ),
  },
  {
    url: 'docs/cli/babylond/cli',
    title: 'CLI Command',
    image: eleven,
    description: (
      <>
        A detailed guide on CLI commands.
      </>
    ),
  },
];

function Feature({image, title, description, url}) {
  return (
    <a className='urlstyle' href={url}>
        <div className="text--center">
          {/* <Svg className={styles.featureSvg} role="img" /> */}
          <img src={image}/>
        </div>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
    </a>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row center-homepage">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
