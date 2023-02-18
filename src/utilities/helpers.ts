import { Merge } from './helperTypes';

export const merge = <
  T1 extends { [key: PropertyKey]: any },
  T2 extends { [key: PropertyKey]: any }
>(
  obj1: T1,
  obj2: T2
): Merge<T1, T2> =>
  Object.entries(obj2).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: typeof value === 'object' ? merge(obj1[key], obj2[key]) : value,
    }),
    obj1
  );
