import { useCallback, useContext } from 'react';

import PrinterContext, {
  PrinterContextValue,
  UsePrinterType,
} from 'context/printer2/PrinterContext';

const usePrinter = (key?: string): UsePrinterType => {
  const contextValue = useContext<PrinterContextValue | null>(PrinterContext);
  if (!contextValue || !key) {
    return {
      isPrinter: !!contextValue,
      subscribe: useCallback(() => {}, []),
      run: useCallback(() => {}, []),
    };
  }

  const { isPrinter, subscribe, run } = contextValue;

  const subscribeCallback = useCallback(() => subscribe(key), [subscribe, key]);
  const runCallback = useCallback(() => run(key), [run, key]);

  return { isPrinter, subscribe: subscribeCallback, run: runCallback };
};

export default usePrinter;
