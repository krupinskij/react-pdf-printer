import { useCallback } from 'react';

import useDocumentContext from 'context/document/useDocumentContext';
import usePrinterContext from 'context/printer/usePrinterContext';

type UseAsyncPrinterResult = {
  subscribe: () => void;
  run: () => void;
};

const useAsyncPrinter = (key: string): UseAsyncPrinterResult => {
  const printerContext = usePrinterContext();
  const documentContext = useDocumentContext(true);

  if (!documentContext) {
    return {
      subscribe: useCallback(() => {}, []),
      run: useCallback(() => {}, []),
    };
  }

  const { subscribe, run } = printerContext;

  return {
    subscribe: useCallback(() => subscribe(key), [subscribe, key]),
    run: useCallback(() => run(key), [run, key]),
  };
};

export default useAsyncPrinter;
