import React, { ReactNode, useState, useCallback } from 'react';

import DocumentProvider from 'context/document2/DocumentProvider';
import PrinterProvider from 'context/printer2/PrinterProvider';

import Content from './components/Content';
import { DocumentConfiguration } from './model';

type DocumentProps = {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  screen?: ReactNode | ((isLoading: boolean) => ReactNode);
  configuration?: DocumentConfiguration;
  onLoaded?: () => void;
};

const Document = ({ header, footer, children, screen, configuration, onLoaded }: DocumentProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAsync = false } = configuration || {};

  const handleLoaded = useCallback(() => {
    setIsLoading(false);
    setTimeout(() => onLoaded?.(), 0);
  }, [onLoaded, setIsLoading]);

  const screenChild = typeof screen === 'function' ? screen(isLoading) : screen;
  return (
    <DocumentProvider header={header} footer={footer}>
      <PrinterProvider isAsync={isAsync}>
        <Content configuration={configuration} printOnly={!!screen} onLoaded={handleLoaded}>
          {children}
        </Content>
        <div data-printer-screenonly="true">{screenChild}</div>
      </PrinterProvider>
    </DocumentProvider>
  );
};

export default Document;
