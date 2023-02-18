import { useContext } from 'react';

import DocumentContext, { DocumentContextValue } from './DocumentContext';

const useDocumentContext = (nullable?: boolean): DocumentContextValue => {
  const context = useContext<DocumentContextValue | null>(DocumentContext);

  if (!context && !nullable) {
    throw new Error('DocumentContext can only be executed under DocumentProvider');
  }

  return context as DocumentContextValue;
};

export default useDocumentContext;
