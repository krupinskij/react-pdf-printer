import { useContext } from 'react';

import PrinterContext, { PrinterContextValue } from 'context/PrinterContext';

type UsePrinterType = Omit<PrinterContextValue, 'isLoading'>;

const usePrinter = (): UsePrinterType => {
  const contextValue = useContext<PrinterContextValue>(PrinterContext);
  if (!contextValue) {
    return {
      isPrinter: false,
      subscribe: () => {
        throw new Error('Subscription can only be run in context of Document.');
      },
    };
  }

  const { isPrinter, subscribe } = contextValue;
  return { isPrinter, subscribe };
};

export default usePrinter;
