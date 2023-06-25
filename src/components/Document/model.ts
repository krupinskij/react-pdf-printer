import React from 'react';

import { DocumentConfiguration } from 'model';
import { DeepPartial } from 'utilities/helperTypes';

export type SectionProps = {
  children: React.ReactNode;
};

export type ArticleProps = SectionProps & {
  header?: React.ReactNode;
  footer?: React.ReactNode;
};

export type PortalDocumentProps = {
  configuration?: DeepPartial<DocumentConfiguration>;
  header: React.ReactNode;
  footer: React.ReactNode;
  onRender?: () => void;
  children: React.ReactNode;
};

export type DocumentRef = {
  render: () => void;
};

type ScreenProps = {
  isRendering: boolean;
};

type ScreenElement = React.ReactElement<ScreenProps, React.JSXElementConstructor<any>>;

export type DocumentProps = PortalDocumentProps & {
  title?: string;
  renderOnInit?: boolean;
  screen: ScreenElement | ((screenProps: ScreenProps) => ScreenElement);
};
