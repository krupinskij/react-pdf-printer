import React, { useContext, useEffect, useRef } from 'react';

import PrinterContext, { PrinterContextValue } from 'context/printer/PrinterContext';
import usePageDimensions from 'hooks/usePageDimensions';
import { getMargin } from 'utilities/getMargin';

import { DocumentConfiguration } from '../model';

type Props = {
  children: React.ReactNode;
  configuration?: DocumentConfiguration;
  printOnly: boolean;
  onLoaded: () => void;
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

      const divisibleElements = Array.from(
        main.querySelectorAll<HTMLElement>('[data-printer-divisible]')
      );

      const childrenElems = divisibleElements
        .flatMap((divisibleElement) =>
          Array.from(divisibleElement.childNodes as NodeListOf<HTMLElement>).map(
            (child, index, arr) => {
              if (child.dataset.printerOmit === 'true') {
                delete child.dataset.printerOmit;
                return {
                  parent: divisibleElement,
                  topChild: divisibleElement,
                  bottomChild: divisibleElement,
                };
              }

              const printerSpan = child.dataset.printerSpan;
              if (!printerSpan) {
                return {
                  parent: divisibleElement,
                  topChild: child,
                  bottomChild: child,
                };
              }

              const span = Math.max(parseInt(printerSpan) || 1, 1) - 1;
              if (span === 0) {
                return {
                  parent: divisibleElement,
                  topChild: child,
                  bottomChild: child,
                };
              }

              const bottomChildIndex = Math.min(index + span, arr.length - 1);
              const bottomChild = arr[bottomChildIndex];

              for (let i = index + 1; i <= index + span; i++) {
                arr[i].dataset.printOmit = 'true';
              }

              return {
                parent: divisibleElement,
                topChild: child,
                bottomChild,
              };
            }
          )
        )
        .filter((elem) => elem.parent !== elem.topChild)
        .sort((elem1, elem2) => {
          const child1 = elem1!.topChild;
          const child2 = elem2!.topChild;

          const { top: child1Top } = child1.getBoundingClientRect();
          const { top: child2Top } = child2.getBoundingClientRect();

          return child1Top - child2Top;
        });

      childrenElems.forEach((elem) => {
        const { parent, topChild, bottomChild } = elem;

        const { bottom: parentBottom, top: parentTop } = parent.getBoundingClientRect();
        const { marginTop: parentMarginTop, marginBottom: parentMarginBottom } = getMargin(parent);

        if (
          parentTop - parentMarginTop >= distanceFromTop ||
          parentBottom + parentMarginBottom <= distanceFromTop
        )
          return;

        const { top: childTop } = topChild.getBoundingClientRect();
        const { marginTop: childMarginTop } = getMargin(topChild);

        const { bottom: childBottom } = bottomChild.getBoundingClientRect();
        const { marginBottom: childMarginBottom } = getMargin(bottomChild);

        if (
          childTop - childMarginTop < distanceFromTop &&
          childBottom + childMarginBottom > distanceFromTop
        ) {
          distanceFromTop = height - footerHeight + childTop;
          pagesCount++;

          const prevSibling = topChild.previousElementSibling;

          const placeholderElement = document.createElement('div');
          placeholderElement.style.height = `${headerHeight}px`;
          placeholderElement.dataset.printerPlaceholder = 'true';
          parent.insertBefore(placeholderElement, topChild);

          if (prevSibling) {
            (prevSibling as HTMLElement).style.breakAfter = 'page';
            (prevSibling as HTMLElement).dataset.printerBreak = 'true';
          } else if (parent.previousSibling) {
            (parent.previousSibling as HTMLElement).style.breakAfter = 'page';
            (parent.previousSibling as HTMLElement).dataset.printerBreak = 'true';
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
    });

    const { format = '#p / #c', formatPage = '#p', formatCount = '#c' } = pagination;

    documentRef.current.style.setProperty(
      '--pagination-content',
      `'${format
        .replaceAll(formatPage, "'counter(printer-page)'")
        .replaceAll(formatCount, String(pagesCount + 1))}'`
    );

    onLoaded();

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
