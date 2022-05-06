import React from 'react';

import { ArticleProps } from '../../model';
import Footer from '../sections/Footer';
import Header from '../sections/Header';
import Content from '../sections/Main';

const Page = ({ header, footer, children }: ArticleProps) => {
  return (
    <article data-printer-type="page">
      <Header>{header}</Header>
      <Footer>{footer}</Footer>
      <Content>{children}</Content>
    </article>
  );
};

export default Page;
