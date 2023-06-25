import React from 'react';

import useDocumentContext from 'context/document/useDocumentContext';

import Footer from '../Section/Footer';
import Header from '../Section/Header';
import Content from '../Section/Main';
import { ArticleProps } from '../model';

export type PageProps = ArticleProps;

const Page = ({ header, footer, children }: PageProps) => {
  const { header: documentHeader, footer: documentFooter } = useDocumentContext();
  return (
    <article data-printer-article="page">
      <Header>{header || documentHeader}</Header>
      <Footer>{footer || documentFooter}</Footer>
      <Content>{children}</Content>
    </article>
  );
};

export default Page;
