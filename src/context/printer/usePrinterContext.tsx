import { useContext } from 'react';

import PrinterContext, { PrinterContextValue } from './PrinterContext';

function usePrinterContext(nullable?: boolean): PrinterContextValue {
  const context = useContext<PrinterContextValue | null>(PrinterContext);

  if (!context && !nullable) {
    throw new Error('PrinterContext can only be executed under PrinterProvider');
  }

  return context as PrinterContextValue;
}

export default usePrinterContext;
