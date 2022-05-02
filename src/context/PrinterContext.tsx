import { createContext } from 'react';

export type PrinterContextValue = {
  isPrinter: boolean;
  isLoading: boolean;
  subscribe: (key: string) => () => void;
};

const PrinterContext = createContext<PrinterContextValue | null>(null);

export default PrinterContext;
