import { createContext } from 'react';

export type PrinterContextValue = {
  isPrinter: boolean;
  isLoading: boolean;
  subscribe: (Key: string) => void;
  run: (key: string) => void;
};

export type UsePrinterType = {
  isPrinter: boolean;
  subscribe: () => void;
  run: () => void;
};

const PrinterContext = createContext<PrinterContextValue | null>(null);

export default PrinterContext;
