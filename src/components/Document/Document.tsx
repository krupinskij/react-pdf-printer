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
  onLoaded?: () => void;
};

const Document = ({ header, footer, children, screen, configuration, onLoaded }: DocumentProps) => {
  const { isAsync = false } = configuration || {};
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
    <DocumentProvider isAsync={isAsync}>
      <Content configuration={configuration} printOnly={!!screen} onLoaded={onLoaded}>
        {documentChildren}
      </Content>
      <div data-printer-screenonly="true">{screen}</div>
    </DocumentProvider>
  );
};

export default Document;
