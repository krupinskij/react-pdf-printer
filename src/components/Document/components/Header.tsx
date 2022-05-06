import React, { CSSProperties } from 'react';

import { SectionProps } from '../model';

const style: CSSProperties = {
  position: 'absolute',
};

const Header = ({ children }: SectionProps) => (
  <section data-printer-component="header" style={style}>
    {children}
  </section>
);

export default Header;
