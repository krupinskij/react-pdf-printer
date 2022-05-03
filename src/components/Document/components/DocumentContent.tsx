import React, { useContext, useLayoutEffect, useRef } from 'react';

import PrinterContext, { PrinterContextValue } from 'context/PrinterContext';

type Props = {
  children: React.ReactNode;
};

const a4Height = 1122.519685;

const DocumentContent = ({ children }: Props) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const { isLoading } = useContext<PrinterContextValue>(PrinterContext)!;

  useLayoutEffect(() => {
    if (isLoading || !documentRef.current) return;

    const articles = documentRef.current.querySelectorAll<HTMLElement>(
      '[data-printer-type="page"], [data-printer-type="view"]'
    );
    articles.forEach((article) => {
      const header = article.querySelector<HTMLElement>('[data-printer-segment="header"]');
      const footer = article.querySelector<HTMLElement>('[data-printer-segment="footer"]');
      const content = article.querySelector<HTMLElement>('[data-printer-segment="content"]');

      if (!content || !header || !footer) return;

      const headerHeight = header.clientHeight || 0;
      const footerHeight = footer.clientHeight || 0;

      header.style.top = '0px';
      footer.style.top = `calc(100vh - ${footerHeight}px)`;
      content.style.marginTop = `${headerHeight}px`;

      if (article.dataset.printerType === 'page') return;

      const divisableElements = content.querySelectorAll<HTMLElement>('[data-printer-divisable]');
      divisableElements.forEach((divisableElement) => {
        const distanceFromTop = a4Height - footerHeight;

        const clientRect = divisableElement.getBoundingClientRect();
        if (clientRect.top < distanceFromTop && clientRect.bottom > distanceFromTop) {
          const children = divisableElement.childNodes as NodeListOf<HTMLElement>;
          let childDistFromTop = distanceFromTop;
          let counter = 0;
          children.forEach((child) => {
            const childClientRect = child.getBoundingClientRect();
            if (
              childClientRect.top < childDistFromTop &&
              childClientRect.bottom > childDistFromTop
            ) {
              child.style.paddingTop = `${headerHeight}px`;
              (child.previousSibling as HTMLElement).style.breakAfter = 'page';
              childDistFromTop += a4Height - footerHeight;
              counter++;
              const newHeader = header.cloneNode(true) as HTMLElement;
              newHeader.style.top = `${counter * 100}vh`;
              article.appendChild(newHeader);

              const newFooter = footer.cloneNode(true) as HTMLElement;
              newFooter.style.top = `calc(${(counter + 1) * 100}vh - ${footerHeight}px)`;
              article.appendChild(newFooter);
            }
          });
        }
      });
    });
  }, [isLoading]);
  return <div ref={documentRef}>{children}</div>;
};

export default DocumentContent;
