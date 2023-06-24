import React, { ComponentProps } from 'react';

type Props = ComponentProps<'span'>;

const Pagination: React.FC = (props: Props) => (
  <span {...props} data-printer-component="pagination" />
);

export default Pagination;
