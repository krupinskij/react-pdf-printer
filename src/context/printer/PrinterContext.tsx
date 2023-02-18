import { createContext } from 'react';

import { PrinterConfiguration } from 'model';

export type PrinterContextValue = {
  configuration: PrinterConfiguration;
  isRendering: boolean;
  setRendering: (isRendering: boolean) => void;
};

const PrinterContext = createContext<PrinterContextValue | null>(null);

export default PrinterContext;
