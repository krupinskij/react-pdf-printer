import React, { useState, useCallback } from 'react';

import Content from 'components/Content';
import DocumentProvider from 'context/document/DocumentProvider';
import { DocumentProps } from 'model';

export type StaticDocumentProps = DocumentProps & {
  screen: Exclude<React.ReactNode, null | undefined> | ((isPrinting: boolean) => React.ReactNode);
};

const StaticDocument = ({
  header,
  footer,
  children,
  screen,
  configuration,
  onPrint = window.print,
}: StaticDocumentProps) => {
  const [isPrinting, setIsPrinting] = useState(true);

  const handlePrint = useCallback(() => {
    setIsPrinting(false);
    setTimeout(() => onPrint(), 0);
  }, [onPrint, setIsPrinting]);

  const screenChild = typeof screen === 'function' ? screen(isPrinting) : screen;

  return (
    <DocumentProvider header={header} footer={footer} configuration={configuration}>
      <Content onPrint={handlePrint}>{children}</Content>
      <div data-printer-screenonly="true">{screenChild}</div>
    </DocumentProvider>
  );
};

export default StaticDocument;
