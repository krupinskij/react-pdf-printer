import React from 'react';

import { SectionProps } from '../model';

const Header = ({ children }: SectionProps) => (
  <section data-printer-section="header">{children}</section>
);

export default Header;
