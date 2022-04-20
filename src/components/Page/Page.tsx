import React from 'react';

export interface Props {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const Page = ({ header, footer }: Props) => {
  return <section data-printer-type="page"></section>;
};

export default Page;
