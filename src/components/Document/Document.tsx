import React from 'react';
import DocumentProvider from './context/DocumentProvider';

interface DocumentProps {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}

const Document = ({ header, footer, children }: DocumentProps) => {
  return <DocumentProvider>{children}</DocumentProvider>;
};

export default Document;
