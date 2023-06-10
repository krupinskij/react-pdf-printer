import React, { useCallback, useEffect, useImperativeHandle, useState } from 'react';
import ReactDOM from 'react-dom';

import DocumentProvider from 'context/document/DocumentProvider';
import usePrinterContext from 'context/printer/usePrinterContext';
import { DocumentConfiguration } from 'model';
import { DeepPartial } from 'utilities/helperTypes';

import Content from './Content';

export type DocumentProps = {
  configuration?: DeepPartial<DocumentConfiguration>;
  header: React.ReactNode;
  footer: React.ReactNode;
  onRender?: () => void;
  children: React.ReactNode;
  container?: HTMLElement;
};
export type DocumentRef = {
  render: () => void;
};

const Document = (
  { header, footer, children, configuration, container, onRender = window.print }: DocumentProps,
  ref: React.Ref<DocumentRef>
) => {
  const { isRendering, setRendering } = usePrinterContext();

  const [portalContainer, setPortalContainer] = useState<HTMLElement>();
  useEffect(() => {
    let portalContainer: HTMLElement;
    if (container) {
      portalContainer = container;
    } else {
      portalContainer = document.createElement('div');
      document.body.appendChild(portalContainer);
    }
    portalContainer.dataset.printerType = 'portal';

    setPortalContainer(portalContainer);

    return () => {
      if (!container) {
        document.body.removeChild(portalContainer);
      }
    };
  }, [container]);

  const handleRender = useCallback(() => {
    setRendering(false);
    setTimeout(() => onRender(), 0);
  }, [onRender, setRendering]);

  useImperativeHandle(
    ref,
    () => ({
      render: () => {
        setTimeout(() => setRendering(true), 0);
      },
    }),
    [setRendering]
  );

  if (!portalContainer) return null;

  return ReactDOM.createPortal(
    <DocumentProvider header={header} footer={footer} configuration={configuration}>
      <Content documentType="portal" onRender={handleRender} isRendering={isRendering}>
        {children}
      </Content>
    </DocumentProvider>,
    portalContainer
  );
};

export default React.forwardRef(Document);
