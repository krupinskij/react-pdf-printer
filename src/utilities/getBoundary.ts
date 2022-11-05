const getBoundingRect = (
  topElement: HTMLElement,
  bottomElement: HTMLElement
): { top: number; bottom: number } => {
  const elementBoundingRect = topElement.getBoundingClientRect();

  return {
    top: elementBoundingRect.top,
    bottom:
      topElement === bottomElement
        ? elementBoundingRect.bottom
        : bottomElement.getBoundingClientRect().bottom,
  };
};

const getMargins = (
  topElement: HTMLElement,
  bottomElement: HTMLElement
): { marginTop: number; marginBottom: number } => {
  const topElementComputedStyle = window.getComputedStyle(topElement);
  const firstChildStyle =
    topElement.firstElementChild && window.getComputedStyle(topElement.firstElementChild);

  const bottomElementComputedStyle =
    topElement === bottomElement ? topElementComputedStyle : window.getComputedStyle(bottomElement);
  const lastChildStyle =
    bottomElement.lastElementChild && window.getComputedStyle(bottomElement.lastElementChild);

  const marginTop = Number(topElementComputedStyle.marginTop.replace('px', ''));
  const marginBottom = Number(bottomElementComputedStyle.marginBottom.replace('px', ''));

  const firstChildMarginTop = Number(firstChildStyle?.marginTop.replace('px', '') || 0);
  const lastChildMarginBottom = Number(lastChildStyle?.marginBottom.replace('px', '') || 0);

  return {
    marginTop: Math.max(marginTop, firstChildMarginTop),
    marginBottom: Math.max(marginBottom, lastChildMarginBottom),
  };
};

export const getBoundary = (
  topElement: HTMLElement,
  bottomElement?: HTMLElement
): {
  top: number;
  bottom: number;
  marginTop: number;
  marginBottom: number;
} => {
  const { top, bottom } = getBoundingRect(topElement, bottomElement || topElement);
  const { marginTop, marginBottom } = getMargins(topElement, bottomElement || topElement);

  return {
    top,
    bottom,
    marginTop,
    marginBottom,
  };
};
