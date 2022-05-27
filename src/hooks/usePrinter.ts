import { useContext } from 'react';

import PrinterContext, { PrinterContextValue } from 'context/PrinterContext';

type UsePrinterType = Omit<PrinterContextValue, 'isLoading'>;

const usePrinter = (): UsePrinterType => {
  const contextValue = useContext<PrinterContextValue | null>(PrinterContext);
  if (!contextValue) {
    return {
      isPrinter: false,
      subscribe: () => {
        throw new Error('Subscription can only be run in context of Document.');
      },
      run: () => {
        throw new Error('Run can only be run in context of Document.');
      },
    };
  }

  const { isPrinter, subscribe, run } = contextValue;
  return { isPrinter, subscribe, run };
};

export default usePrinter;
