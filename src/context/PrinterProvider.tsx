import React from 'react';

import PrinterContext, { PrinterContextValue } from './PrinterContext';

interface DocumentProviderProps {
  children: React.ReactNode;
}

const PrinterProvider = ({ children }: DocumentProviderProps) => {
  const value: PrinterContextValue = {
    isPrinter: true,
  };

  return <PrinterContext.Provider value={value}>{children}</PrinterContext.Provider>;
};

export default PrinterProvider;
