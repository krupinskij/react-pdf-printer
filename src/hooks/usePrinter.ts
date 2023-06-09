import { useCallback, useEffect } from 'react';

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

  const { subscribe, run, reset, isPending } = documentContext;

  const subscribeCallback = useCallback(() => subscribe(key), [subscribe, key]);
  const runCallback = useCallback(() => {
    setTimeout(() => run(key), 0);
  }, [run, key]);

  useEffect(
    () => () => {
      reset(key);
    },
    [key, isPending]
  );

  return {
    isPrinter: true,
    isRendering,
    subscribe: subscribeCallback,
    run: runCallback,
  };
};

export default usePrinter;
