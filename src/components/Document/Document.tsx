import React, { useCallback, useImperativeHandle } from 'react';

import Content from 'components/Document/Content';
import DocumentProvider from 'context/document/DocumentProvider';
import usePrinterContext from 'context/printer/usePrinterContext';
import { DocumentProps as Prop } from 'model';

export type DocumentProps = Prop;

export type DocumentRef = {
  render: () => void;
};

const Document = (
  { header, footer, children, configuration, onRender = window.print }: DocumentProps,
  ref: React.Ref<DocumentRef>
) => {
  const { isRendering, setRendering } = usePrinterContext();

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

  return (
    <DocumentProvider header={header} footer={footer} configuration={configuration}>
      <Content onRender={handleRender} isRendering={isRendering}>
        {children}
      </Content>
    </DocumentProvider>
  );
};

export default React.forwardRef(Document);
