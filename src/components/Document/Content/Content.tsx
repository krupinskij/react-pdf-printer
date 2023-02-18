import React, { useEffect, useRef } from 'react';

import useDocumentContext from 'context/document/useDocumentContext';
import usePageDimensions from 'hooks/usePageDimensions';
import { getBoundary } from 'utilities/getBoundary';

type Props = {
  children: React.ReactNode;
  isRendering: boolean;
  onRender: () => void;
};

type DivisibleElement = {
  parent: HTMLElement;
  topChild: HTMLElement;
  bottomChild: HTMLElement;
};

const Content = ({ children, isRendering, onRender }: Props) => {
  const { configuration, isPending } = useDocumentContext();
  const { pagination, orientation, size } = configuration;

  const documentRef = useRef<HTMLDivElement>(null);
  const { height, width } = usePageDimensions(size, orientation);

  const wasRendered = useRef(false);

  useEffect(() => {
    if (isPending || !isRendering || !documentRef.current) return;

    if (wasRendered.current) {
      onRender();
      return;
    }

    const articles = documentRef.current.querySelectorAll<HTMLElement>(
      '[data-printer-article="page"], [data-printer-article="pages"]'
    );
    let pagesCount = -1;
    articles.forEach((article) => {
      const header = article.querySelector<HTMLElement>('[data-printer-section="header"]');
      const footer = article.querySelector<HTMLElement>('[data-printer-section="footer"]');
      const main = article.querySelector<HTMLElement>('[data-printer-section="main"]');

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

      if (article.dataset.printerArticle === 'page') return;

      let distanceFromTop = height - footerHeight;
      if (article.previousElementSibling) {
        const { bottom: prevElemBottom } = article.previousElementSibling.getBoundingClientRect();
        distanceFromTop += prevElemBottom;
      }

      const divisibleElements = Array.from(
        main.querySelectorAll<HTMLElement>('[data-printer-divisible]')
      );

      let childrenElems: DivisibleElement[] = [];
      for (let dI = 0; dI < divisibleElements.length; dI++) {
        const divisibleElement = divisibleElements[dI];
        const childrenArray = Array.from(divisibleElement.childNodes as NodeListOf<HTMLElement>);

        const filteredArray: DivisibleElement[] = [];
        for (let i = 0; i < childrenArray.length; ) {
          const child = childrenArray[i];

          const printerSpan = child.dataset.printerSpan;
          if (!printerSpan) {
            filteredArray.push({
              parent: divisibleElement,
              topChild: child,
              bottomChild: child,
            });
            i++;
            continue;
          }

          const span = Math.max(parseInt(printerSpan) || 1, 1);
          if (span === 1) {
            filteredArray.push({
              parent: divisibleElement,
              topChild: child,
              bottomChild: child,
            });
            i++;
            continue;
          }

          const bottomChildIndex = Math.min(i + span, childrenArray.length) - 1;
          const bottomChild = childrenArray[bottomChildIndex];

          filteredArray.push({
            parent: divisibleElement,
            topChild: child,
            bottomChild,
          });

          i += span;
        }

        const mergeArray: DivisibleElement[] = [];
        for (let i = 0, j = 0; i < childrenElems.length || j < filteredArray.length; ) {
          if (i >= childrenElems.length) {
            mergeArray.push(...filteredArray.slice(j));
            break;
          }

          if (j >= filteredArray.length) {
            mergeArray.push(...childrenElems.slice(i));
            break;
          }

          const newChild = filteredArray[j].topChild;
          const { top: newChildTop } = newChild.getBoundingClientRect();

          let end = i;
          while (true) {
            const oldChild = childrenElems[end].topChild;
            const { top: oldChildTop } = oldChild.getBoundingClientRect();

            const dist = newChildTop - oldChildTop;

            if (dist < 0) break;

            end++;

            if (end >= childrenElems.length) break;
          }

          mergeArray.push(...childrenElems.slice(i, end), filteredArray[j]);
          i = end;
          j++;
        }

        childrenElems = mergeArray;
      }

      childrenElems.forEach((elem) => {
        const { parent, topChild, bottomChild } = elem;

        const {
          top: parentTop,
          bottom: parentBottom,
          marginTop: parentMarginTop,
          marginBottom: parentMarginBottom,
        } = getBoundary(parent);

        if (
          parentTop - parentMarginTop >= distanceFromTop ||
          parentBottom + parentMarginBottom <= distanceFromTop
        )
          return;

        const {
          top: childTop,
          bottom: childBottom,
          marginTop: childMarginTop,
          marginBottom: childMarginBottom,
        } = getBoundary(topChild, bottomChild);

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

    wasRendered.current = true;
    onRender();

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

      wasRendered.current = false;
    };
  }, [isPending, isRendering, height, pagination, onRender]);
  return (
    <div
      ref={documentRef}
      style={{ width: Math.floor(width) }}
      data-printer-type="document"
      data-printer-printonly={true}
    >
      {children}
    </div>
  );
};

export default Content;
