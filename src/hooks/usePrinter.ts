import { useCallback } from 'react';

import useDocumentContext from 'context/document/useDocumentContext';

type UsePrinterResult = {
  isPrinter: boolean;
  subscribe: () => void;
  run: () => void;
};

const usePrinter = (key?: string): UsePrinterResult => {
  const documentContext = useDocumentContext(true);

  if (!documentContext || !key) {
    return {
      isPrinter: !!documentContext,
      subscribe: useCallback(() => {}, []),
      run: useCallback(() => {}, []),
    };
  }

  const { subscribe, run } = documentContext;

  const subscribeCallback = useCallback(() => subscribe(key), [subscribe, key]);
  const runCallback = useCallback(() => run(key), [run, key]);

  return { isPrinter: true, subscribe: subscribeCallback, run: runCallback };
};

export default usePrinter;
