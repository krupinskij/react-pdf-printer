import React, { ReactNode, ReactElement } from 'react';
import DocumentProvider from '../../context/PrinterProvider';
import Page, { PageProps } from '../Page';
import View, { ViewProps } from '../View';

interface Props {
  header: ReactNode;
  footer: ReactNode;
  children: ReactElement<PageProps | ViewProps> | Array<ReactElement<PageProps | ViewProps>>;
}

const Document = ({ header, footer, children }: Props) => {
  const documentChildren = React.Children.map(children, child => {
    if (
      !React.isValidElement<PageProps | ViewProps>(child) ||
      child.type !== Page ||
      child.type !== View
    ) {
      throw Error('Page and View are the only valid Document child components.');
    }

    const props = {
      header: child.props.header || header,
      footer: child.props.footer || footer,
    };
    return React.cloneElement(child, props);
  });
  return <DocumentProvider>{documentChildren}</DocumentProvider>;
};

export default Document;
