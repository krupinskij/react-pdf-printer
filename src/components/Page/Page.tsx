import React, { Children } from 'react';

export interface Props {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const Page = ({ header, footer, children }: Props) => {
  return (
    <section data-printer-type="page">
      <article data-printer-segment="header">{header}</article>
      <article data-printer-segment="footer">{footer}</article>
      <article data-printer-segment="content">{children}</article>
    </section>
  );
};

export default Page;
