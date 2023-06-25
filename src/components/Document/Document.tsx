import React, { useCallback, useEffect, useImperativeHandle } from 'react';

import DocumentProvider from 'context/document/DocumentProvider';
import usePrinterContext from 'context/printer/usePrinterContext';

import Content from './Content';
import { DocumentProps, DocumentRef } from './model';

const Document = (
  {
    title,
    header,
    footer,
    children,
    screen: Screen,
    configuration,
    renderOnInit = true,
    onRender = window.print,
  }: DocumentProps,
  ref: React.Ref<DocumentRef>
) => {
  const { isRendering, setRendering } = usePrinterContext();

  useEffect(() => {
    setRendering(renderOnInit);
  }, [setRendering, renderOnInit]);

  useEffect(() => {
    if (!title) return;
    const originalTitle = document.title;
    document.title = title;

    return () => {
      document.title = originalTitle;
    };
  }, [title]);

  const handleRender = useCallback(() => {
    setRendering(false);
    setTimeout(() => onRender(), 0);
  }, [onRender, setRendering]);

  useImperativeHandle(
    ref,
    () => ({
      render: () => {
        setRendering(true);
      },
    }),
    [setRendering]
  );

  return (
    <DocumentProvider header={header} footer={footer} configuration={configuration}>
      <Content documentType="static" onRender={handleRender} isRendering={isRendering}>
        {children}
      </Content>
      <div data-printer-screenonly="true">
        {React.isValidElement(Screen) ? Screen : <Screen isRendering={isRendering} />}
      </div>
    </DocumentProvider>
  );
};

export default React.forwardRef(Document);
