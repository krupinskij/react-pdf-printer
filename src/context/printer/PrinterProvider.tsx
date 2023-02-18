import React from 'react';

import { PrinterConfiguration } from 'model';

import PrinterContext from './PrinterContext';

export type PrinterProviderProps = {
  configuration?: PrinterConfiguration;
  children: React.ReactNode;
};

const PrinterProvider = ({ configuration = {}, children }: PrinterProviderProps) => {
  return <PrinterContext.Provider value={{ configuration }}>{children}</PrinterContext.Provider>;
};

export default PrinterProvider;
