import React, { useContext, useLayoutEffect, useRef } from 'react';

import PrinterContext, { PrinterContextValue } from 'context/PrinterContext';
import usePageDimensions from 'hooks/usePageDimensions';

import { DocumentConfiguration, Orientation, Size } from '../model';

type Props = {
  children: React.ReactNode;
  size: Size;
  orientation: Orientation;
};

const DocumentContent = ({ children, size, orientation }: Props) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const { isLoading } = useContext<PrinterContextValue>(PrinterContext)!;
  const { height } = usePageDimensions(size, orientation);

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
        const distanceFromTop = height - footerHeight;

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
              childDistFromTop += height - footerHeight;
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
  }, [isLoading, height]);
  return <div ref={documentRef}>{children}</div>;
};

export default DocumentContent;
