import React, { useCallback, useEffect, useImperativeHandle } from 'react';

import DocumentProvider from 'context/document/DocumentProvider';
import usePrinterContext from 'context/printer/usePrinterContext';

import Content from './Content';
import { DocumentProps, DocumentRef } from './Document';

type ScreenProps = {
  isPrinting: boolean;
};

type ScreenElement = React.ReactElement<ScreenProps, React.JSXElementConstructor<any>>;

export type StaticDocumentProps = Omit<DocumentProps, 'container'> & {
  title?: string;
  renderOnInit?: boolean;
  screen: ScreenElement | ((screenProps: ScreenProps) => ScreenElement);
};

const StaticDocument = (
  {
    title,
    header,
    footer,
    children,
    screen: Screen,
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
        {React.isValidElement(Screen) ? Screen : <Screen isPrinting={isRendering} />}
      </div>
    </DocumentProvider>
  );
};

export default React.forwardRef(StaticDocument);
