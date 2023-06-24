import { useEffect, useMemo } from 'react';

import { Orientation, PageSize, Size } from 'model';

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

const usePageDimensions = (size: Size, orientation: Orientation): DimensionType => {
  const { height, width, sizeValue } = useMemo(() => {
    let width = 0;
    let height = 0;
    let sizeValue = '';
    if (typeof size === 'number') {
      width = height = size;
      sizeValue = String(size);
    } else if (Array.isArray(size)) {
      [width, height] = size;
      sizeValue = `${width} ${height}`;
    } else {
      const dimensions = sizeMap[size];
      width = dimensions.width;
      height = dimensions.height;
      sizeValue = size;
    }

    if (orientation === 'landscape') {
      [width, height] = [height, width];
    }

    return { width, height, sizeValue };
  }, [size, orientation]);

  useEffect(() => {
    const style = document.createElement('style');
    const css = `
      @media print {
        @page {
          margin: 0;
          size: ${sizeValue} ${orientation};
        }
      }
    `;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [orientation, sizeValue]);

  return { width, height };
};

export default usePageDimensions;
