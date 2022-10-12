import React from 'react';

import DocumentContext, { DocumentContextValue } from './DocumentContext';

type Props = DocumentContextValue & {
  children: React.ReactNode;
};

const DocumentProvider = ({ children, ...value }: Props) => (
  <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>
);

export default DocumentProvider;
