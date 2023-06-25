export type Merge<T1 extends Object, T2 extends Object> = {
  [K in keyof (T1 & T2)]: K extends Extract<keyof T2, keyof T1>
    ? T2[K] extends Object
      ? T1[K] extends Object
        ? Merge<T1[K], T2[K]>
        : T1[K] & T2[K]
      : T1[K] & T2[K]
    : K extends keyof T2
    ? T2[K]
    : K extends keyof T1
    ? T1[K]
    : never;
};

export type DeepPartial<T extends Object> = {
  [K in keyof T]?: T[K] extends Object ? DeepPartial<T[K]> : T[K] | undefined;
};
