import React, { ReactNode, ReactElement } from 'react';

import DocumentProvider from 'context/PrinterProvider';

import Content from './components/Content';
import Page from './components/articles/Page';
import View from './components/articles/View';
import { ArticleProps, DocumentConfiguration } from './model';

type DocumentProps = {
  header: ReactNode;
  footer: ReactNode;
  children: ReactElement<ArticleProps> | Array<ReactElement<ArticleProps>>;
  screen?: ReactNode;
  configuration?: DocumentConfiguration;
};

const Document = ({ header, footer, children, screen, configuration }: DocumentProps) => {
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

  return (
    <DocumentProvider>
      <Content configuration={configuration} printOnly={!!screen}>
        {documentChildren}
      </Content>
      <div data-printer-screenonly="true">{screen}</div>
    </DocumentProvider>
  );
};

export default Document;
