import { useContext } from 'react';

import DocumentContext, { DocumentContextValue } from './DocumentContext';

const useDocumentContext = (nullable?: boolean): DocumentContextValue => {
  const context = useContext<DocumentContextValue | null>(DocumentContext);

  if (!context && !nullable) {
    throw new Error();
  }

  return context as DocumentContextValue;
};

export default useDocumentContext;
