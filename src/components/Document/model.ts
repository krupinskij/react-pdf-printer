import React from 'react';

export type SectionProps = {
  children: React.ReactNode;
};

export type ArticleProps = SectionProps & {
  header?: React.ReactNode;
  footer?: React.ReactNode;
};
