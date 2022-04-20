import { createContext } from 'react';

export type PrinterContextValue = {
  isPrinter: boolean;
};

const PrinterContext = createContext<PrinterContextValue>({ isPrinter: false });

export default PrinterContext;
