import React, { createContext } from 'react';

export type DocumentContextValue = {
  header: React.ReactNode;
  footer: React.ReactNode;
};

const PrinterContext = createContext<DocumentContextValue | null>(null);

export default PrinterContext;
