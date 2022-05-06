import React from 'react';

import { SectionProps } from '../../model';

const Main = ({ children }: SectionProps) => (
  <section data-printer-component="main">{children}</section>
);

export default Main;
