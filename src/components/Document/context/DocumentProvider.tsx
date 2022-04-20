import React, { createContext } from 'react';
import { DocumentContextValue } from './model';

const DocumentContext = createContext<DocumentContextValue>({ isPrinter: false });

interface DocumentProviderProps {
  children: React.ReactNode;
}

const DocumentProvider = ({ children }: DocumentProviderProps) => {
  const value: DocumentContextValue = {
    isPrinter: true,
  };

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
};

export default DocumentProvider;
