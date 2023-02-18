import React from 'react';

import useDocument from 'context/document2/useDocument';
import useDocumentContext from 'context/document/useDocumentContext';

import { ArticleProps } from '../../model';
import Footer from '../sections/Footer';
import Header from '../sections/Header';
import Content from '../sections/Main';

const Page = ({ header, footer, children }: ArticleProps) => {
  const { header: documentHeader, footer: documentFooter } = useDocumentContext();
  return (
    <article data-printer-type="page">
      <Header>{header || documentHeader}</Header>
      <Footer>{footer || documentFooter}</Footer>
      <Content>{children}</Content>
    </article>
  );
};

export default Page;
