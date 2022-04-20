import PrinterContext, { PrinterContextValue } from 'context/PrinterContext';
import { useContext } from 'react';

const usePrinter = () => {
  return useContext<PrinterContextValue>(PrinterContext);
};

export default usePrinter;
