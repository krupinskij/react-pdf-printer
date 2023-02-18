import React from 'react';

import { SectionProps } from '../model';

const Main = ({ children }: SectionProps) => (
  <section data-printer-section="main">{children}</section>
);

export default Main;
