import React, { CSSProperties } from 'react';

import { SectionProps } from '../model';

const style: CSSProperties = {
  position: 'absolute',
};

const Content = ({ children }: SectionProps) => (
  <section data-printer-segment="content" style={style}>
    {children}
  </section>
);

export default Content;
