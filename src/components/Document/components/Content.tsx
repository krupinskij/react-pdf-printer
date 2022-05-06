import React from 'react';

import { SectionProps } from '../model';

const Content = ({ children }: SectionProps) => (
  <section data-printer-component="content">{children}</section>
);

export default Content;
