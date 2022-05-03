import React, { CSSProperties } from 'react';

import { ArticleProps } from '../model';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';

const style: CSSProperties = {
  height: '100vh',
  overflowY: 'hidden',
};

const Page = ({ header, footer, children }: ArticleProps) => {
  return (
    <article data-printer-type="page" style={style}>
      <Header>{header}</Header>
      <Footer>{footer}</Footer>
      <Content>{children}</Content>
    </article>
  );
};

export default Page;
