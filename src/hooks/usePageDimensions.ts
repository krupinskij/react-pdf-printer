import { useEffect, useState } from 'react';

import { Orientation, PageSize, Size } from 'components/Document/model';

const sizeMap: Record<PageSize, { width: number; height: number }> = {
  a3: { width: 1122.519685, height: 1587.4015748 },
  a4: { width: 793.7007874, height: 1122.519685 },
  a5: { width: 559.37007874, height: 793.7007874 },
  b4: { width: 944.88188976, height: 1334.1732283 },
  b5: { width: 665.19685039, height: 944.88188976 },
  'jis-b4': { width: 971.33858268, height: 1375.7480315 },
  'jis-b5': { width: 687.87401575, height: 971.33858268 },
  letter: { width: 816, height: 1056 },
  legal: { width: 816, height: 1344 },
  ledger: { width: 1056, height: 1632 },
};

type DimensionType = {
  width: number;
  height: number;
};

const setSizeCSSValue = (size: string) => {
  const styleSheets = document.styleSheets;

  for (let i = 0; i < styleSheets.length; i++) {
    findCssRule(styleSheets[i].cssRules, size);
  }
};

const findCssRule = (cssRules: CSSRuleList, size: string) => {
  for (let i = 0; i < cssRules.length; i++) {
    const cssRule = cssRules[i] as any;
    if (!(cssRule as any).cssRules) {
      (cssRule as any).style.size = size;
      return;
    }
    if (!cssRule.cssText.includes('@page')) continue;

    findCssRule(cssRule.cssRules, size);
  }
};

const usePageDimensions = (size: Size, orientation: Orientation): DimensionType => {
  const [dimensions, setDimensions] = useState<DimensionType>({ width: 0, height: 0 });

  useEffect(() => {
    let width = 0;
    let height = 0;
    let sizeCSSValue = '';
    if (typeof size === 'number') {
      width = height = size;
      sizeCSSValue = String(size);
    } else if (Array.isArray(size)) {
      [width, height] = size;
      sizeCSSValue = `${width} ${height}`;
    } else {
      const dimensions = sizeMap[size];
      width = dimensions.width;
      height = dimensions.height;
      sizeCSSValue = size;
    }

    if (orientation === 'landscape') {
      [width, height] = [height, width];
    }

    sizeCSSValue += ' ' + orientation;
    setSizeCSSValue(sizeCSSValue);
    setDimensions({ width, height });
  }, [size, orientation]);

  return dimensions;
};

export default usePageDimensions;
