export const setSize = (size: string) => {
  const styleSheets = document.styleSheets;

  for (let i = 0; i < styleSheets.length; i++) {
    findCssRule(styleSheets[i].cssRules, size);
  }
};

const findCssRule = (cssRules: CSSRuleList, size: string) => {
  for (let i = 0; i < cssRules.length; i++) {
    const cssRule = cssRules[i] as any;
    if (!cssRule.cssRules) {
      cssRule.style.size = size;
      return;
    }
    if (!cssRule.cssText.includes('@page')) continue;

    findCssRule(cssRule.cssRules, size);
  }
};
