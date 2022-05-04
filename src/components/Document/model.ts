import React from 'react';

export type SectionProps = {
  children: React.ReactNode;
};

export type ArticleProps = SectionProps & {
  header?: React.ReactNode;
  footer?: React.ReactNode;
};

export type DocumentConfiguration = {
  orientation?: Orientation;
  size?: Size;
};

export type Orientation = 'landscape' | 'portrait';

export type Size = number | [number, number] | PageSize;

export type PageSize =
  | 'a3'
  | 'a4'
  | 'a5'
  | 'b4'
  | 'b5'
  | 'jis-b4'
  | 'jis-b5'
  | 'letter'
  | 'legal'
  | 'ledger';
