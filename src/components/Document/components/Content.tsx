import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react';

import PrinterContext, { PrinterContextValue } from 'context/PrinterContext';
import usePageDimensions from 'hooks/usePageDimensions';

import { DocumentConfiguration } from '../model';

type Props = {
  children: React.ReactNode;
  configuration?: DocumentConfiguration;
  printOnly: boolean;
  onLoaded?: () => void;
};

const Content = ({ children, configuration, printOnly, onLoaded }: Props) => {
  const { size = 'a4', orientation = 'portrait', pagination = {} } = configuration || {};

  const documentRef = useRef<HTMLDivElement>(null);
  const { isLoading } = useContext<PrinterContextValue | null>(PrinterContext)!;
  const { height } = usePageDimensions(size, orientation);

  useEffect(() => {
    if (isLoading || !documentRef.current) return;

    const articles = documentRef.current.querySelectorAll<HTMLElement>(
      '[data-printer-type="page"], [data-printer-type="view"]'
    );
    let pagesCount = -1;
    articles.forEach((article) => {
      const header = article.querySelector<HTMLElement>('[data-printer-component="header"]');
      const footer = article.querySelector<HTMLElement>('[data-printer-component="footer"]');
      const main = article.querySelector<HTMLElement>('[data-printer-component="main"]');

      if (!main || !header || !footer) return;

      pagesCount++;

      const headerHeight = header.clientHeight || 0;
      const footerHeight = footer.clientHeight || 0;

      header.style.top = `${pagesCount * 100}vh`;
      footer.style.top = `calc(${(pagesCount + 1) * 100}vh - ${footerHeight}px)`;
      main.style.paddingTop = `${headerHeight}px`;

      if (article.dataset.printerType === 'page') return;

      const divisibleElements = main.querySelectorAll<HTMLElement>('[data-printer-divisible]');
      divisibleElements.forEach((divisibleElement) => {
        let distanceFromTop = (pagesCount + 1) * height - footerHeight;
        if (article.previousElementSibling) {
          distanceFromTop =
            article.previousElementSibling.getBoundingClientRect().bottom + height - footerHeight;
        }
        const clientRect = divisibleElement.getBoundingClientRect();

        if (clientRect.top < distanceFromTop && clientRect.bottom > distanceFromTop) {
          const children = divisibleElement.childNodes as NodeListOf<HTMLElement>;
          let childDistFromTop = distanceFromTop;
          children.forEach((child) => {
            const childClientRect = child.getBoundingClientRect();
            if (
              childClientRect.top < childDistFromTop &&
              childClientRect.bottom > childDistFromTop
            ) {
              (child.previousSibling as HTMLElement).style.breakAfter = 'page';
              (child.previousSibling as HTMLElement).dataset.printerBreak = 'true';

              const placeholderElement = document.createElement('div');
              placeholderElement.style.height = `${headerHeight}px`;
              placeholderElement.dataset.placeholder = 'true';
              divisibleElement.insertBefore(placeholderElement, child);

              childDistFromTop += height - footerHeight;
              pagesCount++;
              const newHeader = header.cloneNode(true) as HTMLElement;
              newHeader.style.top = `${pagesCount * 100}vh`;
              newHeader.dataset.printerClone = 'true';
              article.appendChild(newHeader);

              const newFooter = footer.cloneNode(true) as HTMLElement;
              newFooter.style.top = `calc(${(pagesCount + 1) * 100}vh - ${footerHeight}px)`;
              newFooter.dataset.printerClone = 'true';
              article.appendChild(newFooter);
            }
          });
        }
      });
    });

    const { format = '#p / #c', formatPage = '#p', formatCount = '#c' } = pagination;

    const pages = documentRef.current.querySelectorAll<HTMLElement>(
      '[data-printer-component="pagination"]'
    );

    documentRef.current.style.setProperty(
      '--pagination-content',
      `'${format
        .replaceAll(formatPage, "'counter(printer-page)'")
        .replaceAll(formatCount, String(pages.length))}'`
    );

    onLoaded && onLoaded();

    return () => {
      const brokens =
        documentRef.current?.querySelectorAll<HTMLElement>('[data-printer-break="true"]') || [];
      brokens.forEach((elem) => {
        elem.style.breakAfter = 'auto';
        elem.dataset.printerBreak = 'false';
      });

      const placeholders =
        documentRef.current?.querySelectorAll<HTMLElement>('[data-printer-placeholder="true"]') ||
        [];
      placeholders.forEach((elem) => {
        elem.remove();
      });

      const clones =
        documentRef.current?.querySelectorAll<HTMLElement>('[data-printer-clone="true"]') || [];
      clones.forEach((elem) => {
        elem.remove();
      });
    };
  }, [isLoading, height, pagination, onLoaded]);
  return (
    <div ref={documentRef} data-printer-type="document" data-printer-printonly={printOnly}>
      {children}
    </div>
  );
};

export default Content;
