import { useContext } from 'react';

import DocumentContext, { DocumentContextValue } from 'context/document2/DocumentContext';

const useDocument = (): DocumentContextValue => {
  const contextValue = useContext<DocumentContextValue | null>(DocumentContext);
  if (!contextValue) {
    throw new Error('Page and View can only be used inside Document component.');
  }

  return contextValue;
};

export default useDocument;
