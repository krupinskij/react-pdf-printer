import React, { CSSProperties } from 'react';

import { SectionProps } from '../model';

const style: CSSProperties = {
  position: 'absolute',
};

const Footer = ({ children }: SectionProps) => (
  <section data-printer-segment="footer" style={style}>
    {children}
  </section>
);

export default Footer;