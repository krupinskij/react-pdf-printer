import React from 'react';

import { PrinterConfiguration } from 'model';
import { DeepPartial } from 'utilities/helperTypes';
import { merge } from 'utilities/helpers';

import PrinterContext from './PrinterContext';

export type PrinterProviderProps = {
  configuration?: DeepPartial<PrinterConfiguration>;
  children: React.ReactNode;
};

const defaultConfiguration: PrinterConfiguration = {
  useAsync: false,
  size: 'a4',
  orientation: 'portrait',
  pagination: { format: '#p / #c', formatPage: '#p', formatCount: '#c' },
};

const PrinterProvider = ({ configuration = {}, children }: PrinterProviderProps) => {
  const globalConfiguration = merge(defaultConfiguration, configuration);
  return (
    <PrinterContext.Provider value={{ configuration: globalConfiguration }}>
      {children}
    </PrinterContext.Provider>
  );
};

export default PrinterProvider;
