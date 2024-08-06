import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useDocById} from '@docusaurus/theme-common/internal';
import {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';
function CardContainer({href, children}) {
  return (
    <Link
      href={href}
      className={clsx('card padding--lg', styles.cardContainer)}>
      {children}
    </Link>
  );
}
function CardLayout({href, icon, title, description}) {
  return (
    <CardContainer href={href}>
      <h2 className={clsx('text--truncate', styles.cardTitle)} title={title}>
        {icon} {title}
      </h2>
      {description && (
        <p
          className={clsx('text--truncate', styles.cardDescription)}
          title={description}>
          {description}
        </p>
      )}
    </CardContainer>
  );
}
function CardCategory({item}) {
  const href = item.href
  // Unexpected: categories that don't have a link have been filtered upfront
  if (!href) {
    return null;
  }
  return (
    <CardLayout
      href={href}
      icon="🗃️"
      title={item.label}
      description={translate(
        {
          message: '{count} items',
          id: 'theme.docs.DocCard.categoryDescription',
          description:
            'The default description for a category card in the generated index about how many items this category includes',
        },
        {count: item.items.length},
      )}
    />
  );
}
function CardLink({item}) {
  // const icon = isInternalUrl(item.href) ? '📄️' : '🔗';
  const icon = (item.label === "Babylon Overview") ? '📖'
  : (item.label === "A Primary Usecase - Securing PoS Chains") ? '🛠'
  : (item.label === "Architecture") ? '🔎'
  : (item.label === "Epoching Module") ? '📘'
  : (item.label === "Checkpointing Module") ? '📕'
  : (item.label === "BTC Checkpoint Module") ? '📙'
  : (item.label === "BTC Light Client Module") ? '📗'
  : (item.label === "Zone Concierge Module") ? '📔'
  : (item.label === "Vigilante Submitter Program") ? '📡'
  : (item.label === "Vigilante Reporter Program") ? '🎤'
  : (item.label === "Vigilante Monitor Program") ? '📺'
  : (item.label === "Network Information") ? '🧐'
  : (item.label === "Set up a Node") ? '👀'
  : (item.label === "Get Testnet Tokens") ? '🔎'
  : (item.label === "Become a Validator") ? '👨‍🏫'
  : (item.label === "Become a Vigilante") ? '👨‍💻'
  : (item.label === "Integrate with Babylon") ? '🔐' : '📄️';
  const doc = useDocById(item.docId ?? undefined);
  return (
    <CardLayout
      href={item.href}
      icon={icon}
      title={item.label}
      description={doc?.description}
    />
  );
}
export default function DocCard({item}) {
  switch (item.type) {
    case 'link':
      return <CardLink item={item} />;
    case 'category':
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}
