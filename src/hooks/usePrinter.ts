import { useContext } from 'react';

import PrinterContext, { PrinterContextValue, UsePrinterType } from 'context/PrinterContext';

const usePrinter = (key?: string): UsePrinterType => {
  const contextValue = useContext<PrinterContextValue | null>(PrinterContext);
  if (!contextValue || !key) {
    return {
      isPrinter: !!contextValue,
      subscribe: () => {},
      run: () => {},
    };
  }

  const { isPrinter, subscribe, run } = contextValue;
  return { isPrinter, subscribe: () => subscribe(key), run: () => run(key) };
};

export default usePrinter;
