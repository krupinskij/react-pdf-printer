import React from 'react';

import { SectionProps } from '../../model';

const Header = ({ children }: SectionProps) => (
  <section data-printer-component="header">{children}</section>
);

export default Header;
