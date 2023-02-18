import useDocumentContext from 'context/document/useDocumentContext';
import usePrinterContext from 'context/printer/usePrinterContext';

type UsePrinterResult = {
  isPrinting: boolean;
  isPrinted: boolean;
  print: () => void;
};

const usePrinter = (): UsePrinterResult => {
  const printerContext = usePrinterContext();
  const documentContext = useDocumentContext(true);

  const { print } = printerContext;
  const { isPending } = documentContext;

  return {
    isPrinting: isPending,
    isPrinted: !!documentContext,
    print,
  };
};

export default usePrinter;
