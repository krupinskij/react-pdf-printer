import React, { ReactNode, useState, useCallback } from 'react';

import Content from 'components/Content';
import DocumentProvider from 'context/document2/DocumentProvider';
import PrinterProvider from 'context/printer2/PrinterProvider';
import { StaticDocumentProps } from 'model';

const Document = ({
  header,
  footer,
  children,
  screen,
  configuration,
  onPrint = window.print,
}: StaticDocumentProps) => {
  const [isPrinting, setIsPrinting] = useState(true);
  const { useAsync = false } = configuration || {};

  const handlePrint = useCallback(() => {
    setIsPrinting(false);
    setTimeout(() => onPrint(), 0);
  }, [onPrint, setIsPrinting]);

  const screenChild = typeof screen === 'function' ? screen(isPrinting) : screen;
  return (
    <DocumentProvider header={header} footer={footer}>
      <PrinterProvider isAsync={useAsync}>
        <Content configuration={configuration} printOnly={!!screen} onPrint={handlePrint}>
          {children}
        </Content>
        <div data-printer-screenonly="true">{screenChild}</div>
      </PrinterProvider>
    </DocumentProvider>
  );
};

export default Document;
