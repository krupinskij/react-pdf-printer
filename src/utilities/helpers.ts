type Merge<T1 extends { [key: PropertyKey]: any }, T2 extends { [key: PropertyKey]: any }> = {
  [K in keyof T1 | keyof T2]: K extends keyof T2
    ? T2[K] extends { [key: PropertyKey]: any }
      ? Merge<T1[K], T2[K]>
      : T2[K]
    : T1[K];
};

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
