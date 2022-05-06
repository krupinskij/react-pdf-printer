import React from 'react';

import { ArticleProps } from '../model';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';

const View = ({ header, footer, children }: ArticleProps) => {
  return (
    <article data-printer-type="view">
      <Header>{header}</Header>
      <Footer>{footer}</Footer>
      <Content>{children}</Content>
    </article>
  );
};

export default View;
