import { useContext } from 'react';

import PrinterContext, { PrinterContextValue } from 'context/PrinterContext';

const usePrinter = () => {
  return useContext<PrinterContextValue>(PrinterContext);
};

export default usePrinter;
