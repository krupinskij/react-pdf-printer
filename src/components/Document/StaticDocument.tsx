import React, { useState, useCallback, useEffect, useImperativeHandle } from 'react';

import Content from 'components/Document/Content';
import DocumentProvider from 'context/document/DocumentProvider';
import usePrinterContext from 'context/printer/usePrinterContext';
import { DocumentProps } from 'model';

import { DocumentRef } from './Document';

type ScreenNode = Exclude<React.ReactNode, null | undefined>;

export type StaticDocumentProps = DocumentProps & {
  renderOnInit?: boolean;
  screen: ScreenNode | ((isPrinting: boolean) => ScreenNode);
};

const StaticDocument = (
  {
    header,
    footer,
    children,
    screen,
    configuration,
    renderOnInit = true,
    onRender = window.print,
  }: StaticDocumentProps,
  ref: React.Ref<DocumentRef>
) => {
  const { isRendering, setRendering } = usePrinterContext();

  useEffect(() => {
    setRendering(renderOnInit);
  }, [setRendering, renderOnInit]);

  const handleRender = useCallback(() => {
    setRendering(false);
    setTimeout(() => onRender(), 0);
  }, [onRender, setRendering]);

  useImperativeHandle(
    ref,
    () => ({
      render: () => setRendering(true),
    }),
    [setRendering]
  );

  const screenChild = typeof screen === 'function' ? screen(isRendering) : screen;

  return (
    <DocumentProvider header={header} footer={footer} configuration={configuration}>
      <Content onRender={handleRender} isRendering={isRendering}>
        {children}
      </Content>
      <div data-printer-screenonly="true">{screenChild}</div>
    </DocumentProvider>
  );
};

export default React.forwardRef(StaticDocument);
