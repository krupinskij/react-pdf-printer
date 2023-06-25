import React, { createContext } from 'react';

import { PrinterConfiguration } from 'model';

export type DocumentContextValue = {
  header: React.ReactNode;
  footer: React.ReactNode;
  configuration: PrinterConfiguration;
  subscribe: (key: string) => void;
  run: (key: string) => void;
  reset: (key: string) => void;
  isPending: boolean;
};

const DocumentContext = createContext<DocumentContextValue | null>(null);

export default DocumentContext;
