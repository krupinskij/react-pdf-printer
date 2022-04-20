import React from 'react';

export interface Props {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const View = ({ header, footer }: Props) => {
  return <div data-printer-type="view"></div>;
};

export default View;
