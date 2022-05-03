import React, { useContext, useLayoutEffect, useRef } from 'react';

import PrinterContext, { PrinterContextValue } from 'context/PrinterContext';

type Props = {
  children: React.ReactNode;
};

const DocumentContent = ({ children }: Props) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const { isLoading } = useContext<PrinterContextValue>(PrinterContext)!;

  useLayoutEffect(() => {
    if (isLoading || !documentRef.current) return;

    const contentElements = documentRef.current.querySelectorAll(
      '[data-printer-type="page"], [data-printer-type="view"]'
    );
    contentElements.forEach((element) => {
      const header = element.querySelector('[data-printer-segment="header"]');
      const footer = element.querySelector('[data-printer-segment="footer"]');
      const content = element.querySelector<HTMLElement>('[data-printer-segment="content"]');

      const headerHeight = header?.clientHeight || 0;
      const footerHeight = footer?.clientHeight || 0;
      const contentHeight = window.innerHeight - (headerHeight + footerHeight);

      if (!content) return;

      content.style.marginTop = `${headerHeight}px`;
    });
  }, [isLoading]);
  return <div ref={documentRef}>{children}</div>;
};

export default DocumentContent;
