import React from 'react';

import { DeepPartial } from 'utilities/helperTypes';

type Orientation = 'landscape' | 'portrait';

type Size = number | [number, number] | PageSize;

type PageSize =
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

type Pagination = {
  format: string;
  formatPage: string;
  formatCount: string;
};

export type PrinterConfiguration = {
  orientation: Orientation;
  size: Size;
  pagination: Pagination;
  useAsync: boolean;
};

export type DocumentConfiguration = Omit<PrinterConfiguration, 'orientation' | 'size'>;

export type DocumentProps = {
  configuration?: DeepPartial<DocumentConfiguration>;
  header: React.ReactNode;
  footer: React.ReactNode;
  onPrint?: () => void;
  children: React.ReactNode;
};

export type PageProps = {
  header?: React.ReactNode;
  footer?: React.ReactNode;
};
