import React, { ReactNode, ReactElement } from 'react';

import DocumentProvider from 'context/PrinterProvider';

import DocumentContent from './components/DocumentContent';
import Page from './components/Page';
import View from './components/View';
import { ArticleProps } from './model';

type DocumentProps = {
  header: ReactNode;
  footer: ReactNode;
  children: ReactElement<ArticleProps> | Array<ReactElement<ArticleProps>>;
};

const Document = ({ header, footer, children }: DocumentProps) => {
  const documentChildren = React.Children.map(children, (child) => {
    console.log(
      !React.isValidElement<ArticleProps>(child),
      child.type !== Page,
      child.type !== View
    );
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

  return (
    <DocumentProvider>
      <DocumentContent>{documentChildren}</DocumentContent>
    </DocumentProvider>
  );
};

export default Document;
