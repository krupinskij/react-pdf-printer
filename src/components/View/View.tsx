import React from 'react';

export interface Props {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const View = ({ header, footer, children }: Props) => {
  return (
    <div data-printer-type="view">
      <article data-printer-segment="header">{header}</article>
      <article data-printer-segment="footer">{footer}</article>
      <article data-printer-segment="content">{children}</article>
    </div>
  );
};

export default View;
