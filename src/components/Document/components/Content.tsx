import React, { CSSProperties } from 'react';

import { SectionProps } from '../model';

const Content = ({ children }: SectionProps) => (
  <section data-printer-segment="content">{children}</section>
);

export default Content;
