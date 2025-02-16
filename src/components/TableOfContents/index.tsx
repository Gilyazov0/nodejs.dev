import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'gatsby';
import { PageTableOfContents, TableOfContentsItem } from '../../types';
import styles from './index.module.scss';

interface Props {
  tableOfContents?: PageTableOfContents;
}

// This adds the Class and Event prefixes
// To the Headings of Table of Contents
const prefix = (t: string) => {
  switch (t) {
    case 'C':
      return 'Class: ';
    case 'E':
      return 'Event: ';
    default:
      return '';
  }
};

const removeApiSpanTagFromItem = (item: TableOfContentsItem) => ({
  ...item,
  url: item.url
    ? item.url.replace(/datatag-(tagc|tagm|tage)--/, '')
    : undefined,
  title: item.title
    ? item.title.replace(/<DataTag tag="(M|C|E)" \/> /, (_, t) => prefix(t))
    : undefined,
});

const traverseTableOfContents = (
  items: TableOfContentsItem[],
  depth: number
) => (
  <ul>
    {items.map(removeApiSpanTagFromItem).map(item => (
      <li key={item.url}>
        {item.url && item.title && <Link to={item.url}>{item.title}</Link>}
        {item.items && depth < 2
          ? traverseTableOfContents(item.items, depth + 1)
          : null}
      </li>
    ))}
  </ul>
);

const TableOfContents = ({ tableOfContents }: Props): null | JSX.Element => {
  if (tableOfContents?.items) {
    return (
      <details className={styles.tableOfContents}>
        <summary>
          <strong>
            <FormattedMessage id="components.tableOfContents.heading" />
          </strong>
        </summary>
        {traverseTableOfContents(tableOfContents.items, 1)}
      </details>
    );
  }

  return null;
};

export default TableOfContents;
