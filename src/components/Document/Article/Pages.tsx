import React from 'react';

import useDocumentContext from 'context/document/useDocumentContext';

import Footer from '../Section/Footer';
import Header from '../Section/Header';
import Content from '../Section/Main';
import { ArticleProps } from '../model';

export type PagesProps = ArticleProps;

const Pages = ({ header, footer, children }: PagesProps) => {
  const { header: documentHeader, footer: documentFooter } = useDocumentContext();
  return (
    <article data-printer-article="pages">
      <Header>{header || documentHeader}</Header>
      <Footer>{footer || documentFooter}</Footer>
      <Content>{children}</Content>
    </article>
  );
};

export default Pages;
