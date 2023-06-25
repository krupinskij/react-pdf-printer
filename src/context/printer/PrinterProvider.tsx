import React, { useState } from 'react';

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
  pagination: { format: '#p / #t', formatPage: '#p', formatTotal: '#t', style: 'decimal' },
};

const PrinterProvider = ({ configuration = {}, children }: PrinterProviderProps) => {
  const globalConfiguration = merge(defaultConfiguration, configuration);
  const [isRendering, setRendering] = useState(false);
  return (
    <PrinterContext.Provider
      value={{ configuration: globalConfiguration, isRendering, setRendering }}
    >
      {children}
    </PrinterContext.Provider>
  );
};

export default PrinterProvider;
