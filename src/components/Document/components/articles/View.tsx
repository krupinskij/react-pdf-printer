import React from 'react';

import useDocumentContext from 'context/document/useDocumentContext';

import { ArticleProps } from '../../model';
import Footer from '../sections/Footer';
import Header from '../sections/Header';
import Content from '../sections/Main';

const View = ({ header, footer, children }: ArticleProps) => {
  const { header: documentHeader, footer: documentFooter } = useDocumentContext();
  return (
    <article data-printer-type="view">
      <Header>{header || documentHeader}</Header>
      <Footer>{footer || documentFooter}</Footer>
      <Content>{children}</Content>
    </article>
  );
};

export default View;
