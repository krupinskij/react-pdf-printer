export const getMargin = (element: HTMLElement): { marginTop: number; marginBottom: number } => {
  const childComputedStyle = window.getComputedStyle(element);
  const firstChildStyle =
    element.firstElementChild && window.getComputedStyle(element.firstElementChild);
  const lastChildStyle =
    element.lastElementChild && window.getComputedStyle(element.lastElementChild);

  const marginTop = Number(childComputedStyle.marginTop.replace('px', ''));
  const marginBottom = Number(childComputedStyle.marginBottom.replace('px', ''));

  const firstChildMarginTop = Number(firstChildStyle?.marginTop.replace('px', '') || 0);
  const lastChildMarginBottom = Number(lastChildStyle?.marginBottom.replace('px', '') || 0);

  return {
    marginTop: Math.max(marginTop, firstChildMarginTop),
    marginBottom: Math.max(marginBottom, lastChildMarginBottom),
  };
};
