import React, { ReactNode, ReactElement, useEffect } from 'react';

import DocumentProvider from 'context/PrinterProvider';

import DocumentContent from './components/DocumentContent';
import Page from './components/Page';
import View from './components/View';
import { ArticleProps, DocumentConfiguration } from './model';

type DocumentProps = {
  header: ReactNode;
  footer: ReactNode;
  children: ReactElement<ArticleProps> | Array<ReactElement<ArticleProps>>;
  configuration?: DocumentConfiguration;
};

const Document = ({ header, footer, children, configuration }: DocumentProps) => {
  const { size = 'a4', orientation = 'portrait', pagination = {} } = configuration || {};
  const { format = '#p / #c', formatPage = '#p', formatCount = '#c' } = pagination;

  const documentChildren = React.Children.map(children, (child) => {
    if (
      !React.isValidElement<ArticleProps>(child) ||
      (child.type !== Page && child.type !== View)
    ) {
      throw Error('Page and View are the only valid Document child components.');
    }

    const props = {
      header: child.props.header || header,
      footer: child.props.footer || footer,
    };
    return React.cloneElement(child, props);
  });

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--pagination-content',
      `'${format.replaceAll(formatPage, "'counter(printer-page)'")}'`
    );
  }, [format, formatPage, formatCount]);

  return (
    <DocumentProvider>
      <DocumentContent size={size} orientation={orientation} formatCount={formatCount}>
        {documentChildren}
      </DocumentContent>
    </DocumentProvider>
  );
};

export default Document;
