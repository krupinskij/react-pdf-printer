import { createContext } from 'react';

export type PrinterContextValue = {
  isPrinter: boolean;
  isLoading: boolean;
  subscribe: (key: string) => () => void;
} | null;

const PrinterContext = createContext<PrinterContextValue>(null);

export default PrinterContext;
