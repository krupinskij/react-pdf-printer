import React, { useContext, useLayoutEffect, useRef } from 'react';

import PrinterContext, { PrinterContextValue } from 'context/PrinterContext';
import usePageDimensions from 'hooks/usePageDimensions';

import { Orientation, Pagination, Size } from '../model';

type Props = {
  children: React.ReactNode;
  size: Size;
  orientation: Orientation;
  pagination: Pagination;
};

const DocumentContent = ({ children, size, orientation, pagination }: Props) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const { isLoading } = useContext<PrinterContextValue | null>(PrinterContext)!;
  const { height } = usePageDimensions(size, orientation);

  useLayoutEffect(() => {
    if (isLoading || !documentRef.current) return;

    const articles = documentRef.current.querySelectorAll<HTMLElement>(
      '[data-printer-type="page"], [data-printer-type="view"]'
    );
    let pagesCount = -1;
    articles.forEach((article) => {
      const header = article.querySelector<HTMLElement>('[data-printer-component="header"]');
      const footer = article.querySelector<HTMLElement>('[data-printer-component="footer"]');
      const content = article.querySelector<HTMLElement>('[data-printer-component="content"]');

      if (!content || !header || !footer) return;

      pagesCount++;

      const headerHeight = header.clientHeight || 0;
      const footerHeight = footer.clientHeight || 0;

      header.style.top = `${pagesCount * 100}vh`;
      footer.style.top = `calc(${(pagesCount + 1) * 100}vh - ${footerHeight}px)`;
      content.style.marginTop = `${headerHeight}px`;

      if (article.dataset.printerType === 'page') return;

      const divisableElements = content.querySelectorAll<HTMLElement>('[data-printer-divisable]');
      divisableElements.forEach((divisableElement) => {
        let distanceFromTop = (pagesCount + 1) * height - footerHeight;
        if (article.previousElementSibling) {
          distanceFromTop =
            article.previousElementSibling.getBoundingClientRect().bottom + height - footerHeight;
        }
        const clientRect = divisableElement.getBoundingClientRect();

        if (clientRect.top < distanceFromTop && clientRect.bottom > distanceFromTop) {
          const children = divisableElement.childNodes as NodeListOf<HTMLElement>;
          let childDistFromTop = distanceFromTop;
          children.forEach((child) => {
            const childClientRect = child.getBoundingClientRect();
            if (
              childClientRect.top < childDistFromTop &&
              childClientRect.bottom > childDistFromTop
            ) {
              child.style.paddingTop = `${headerHeight}px`;
              (child.previousSibling as HTMLElement).style.breakAfter = 'page';
              childDistFromTop += height - footerHeight;
              pagesCount++;
              const newHeader = header.cloneNode(true) as HTMLElement;
              newHeader.style.top = `${pagesCount * 100}vh`;
              article.appendChild(newHeader);

              const newFooter = footer.cloneNode(true) as HTMLElement;
              newFooter.style.top = `calc(${(pagesCount + 1) * 100}vh - ${footerHeight}px)`;
              article.appendChild(newFooter);
            } else {
              child.innerText += ` ${childClientRect.top} ${childClientRect.bottom} ${childDistFromTop}`;
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
  }, [isLoading, height, pagination]);
  return (
    <div ref={documentRef} data-printer-type="document">
      {children}
    </div>
  );
};

export default DocumentContent;
