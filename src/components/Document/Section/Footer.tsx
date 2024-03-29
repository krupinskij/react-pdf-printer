import React from 'react';

import { SectionProps } from '../model';

const Footer = ({ children }: SectionProps) => (
  <section data-printer-section="footer">{children}</section>
);

export default Footer;
