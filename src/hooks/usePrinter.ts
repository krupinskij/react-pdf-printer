import { useCallback } from 'react';

import useDocumentContext from 'context/document/useDocumentContext';
import usePrinterContext from 'context/printer/usePrinterContext';

export type UsePrinterResult = {
  isPrinter: boolean;
  isRendering: boolean;
  subscribe: () => void;
  run: () => void;
};

const usePrinter = (key?: string): UsePrinterResult => {
  const { isRendering } = usePrinterContext();
  const documentContext = useDocumentContext(true);

  if (!documentContext || !key) {
    return {
      isPrinter: !!documentContext,
      isRendering,
      subscribe: useCallback(() => {}, []),
      run: useCallback(() => {}, []),
    };
  }

  const { subscribe, run } = documentContext;

  const subscribeCallback = useCallback(() => subscribe(key), [subscribe, key]);
  const runCallback = useCallback(() => run(key), [run, key]);

  return {
    isPrinter: true,
    isRendering,
    subscribe: subscribeCallback,
    run: runCallback,
  };
};

export default usePrinter;
