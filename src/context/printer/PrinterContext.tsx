import { createContext } from 'react';

import { PrinterConfiguration } from 'model';

export type PrinterContextValue = {
  configuration: PrinterConfiguration;
};

const PrinterContext = createContext<PrinterContextValue | null>(null);

export default PrinterContext;
