import React, { useContext, useEffect, useRef } from 'react';

import PrinterContext, { PrinterContextValue } from 'context/PrinterContext';
import usePageDimensions from 'hooks/usePageDimensions';
import { getMargin } from 'utilities/getMargin';

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
  const { height, width } = usePageDimensions(size, orientation);

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

      const headerHeight = header.clientHeight;
      const footerHeight = footer.clientHeight;

      header.style.top = `${pagesCount * 100}vh`;
      footer.style.top = `calc(${(pagesCount + 1) * 100}vh - ${footerHeight}px)`;

      const placeholderElement = document.createElement('div');
      placeholderElement.style.height = `${headerHeight}px`;
      placeholderElement.dataset.printerPlaceholder = 'true';
      article.insertBefore(placeholderElement, main);

      if (article.dataset.printerType === 'page') return;

      let distanceFromTop = height - footerHeight;
      if (article.previousElementSibling) {
        const { bottom: prevElemBottom } = article.previousElementSibling.getBoundingClientRect();
        distanceFromTop += prevElemBottom;
      }

      const divisibleElements = main.querySelectorAll<HTMLElement>('[data-printer-divisible]');
      divisibleElements.forEach((divisibleElement) => {
        const { bottom: divElemBottom, top: divElemTop } = divisibleElement.getBoundingClientRect();
        const { marginTop: divElemMarginTop, marginBottom: divElemMarginBottom } =
          getMargin(divisibleElement);

        if (
          divElemTop - divElemMarginTop < distanceFromTop &&
          divElemBottom + divElemMarginBottom > distanceFromTop
        ) {
          const children = Array.from(divisibleElement.childNodes as NodeListOf<HTMLElement>);
          children.forEach((child) => {
            const { top: childTop, bottom: childBottom } = child.getBoundingClientRect();
            const { marginTop: childMarginTop, marginBottom: childMarginBottom } = getMargin(child);

            if (
              childTop - childMarginTop < distanceFromTop &&
              childBottom + childMarginTop > distanceFromTop
            ) {
              distanceFromTop = height - footerHeight + childTop;
              pagesCount++;

              const prevSibling = child.previousElementSibling;

              const placeholderElement = document.createElement('div');
              placeholderElement.style.height = `${headerHeight}px`;
              placeholderElement.dataset.printerPlaceholder = 'true';
              divisibleElement.insertBefore(placeholderElement, child);

              if (prevSibling) {
                (prevSibling as HTMLElement).style.breakAfter = 'page';
                (prevSibling as HTMLElement).dataset.printerBreak = 'true';
              } else if (divisibleElement.previousSibling) {
                (divisibleElement.previousSibling as HTMLElement).style.breakAfter = 'page';
                (divisibleElement.previousSibling as HTMLElement).dataset.printerBreak = 'true';
              } else {
                placeholderElement.style.breakBefore = 'page';
              }

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

    documentRef.current.style.setProperty(
      '--pagination-content',
      `'${format
        .replaceAll(formatPage, "'counter(printer-page)'")
        .replaceAll(formatCount, String(pagesCount))}'`
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
    <div
      ref={documentRef}
      style={{ width: Math.floor(width) }}
      data-printer-type="document"
      data-printer-printonly={printOnly}
    >
      {children}
    </div>
  );
};

export default Content;
