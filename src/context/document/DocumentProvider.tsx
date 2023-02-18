import React, { useCallback, useEffect, useReducer, useState } from 'react';

import usePrinterContext from 'context/printer/usePrinterContext';
import { DocumentConfiguration } from 'model';
import { DeepPartial } from 'utilities/helperTypes';
import { merge } from 'utilities/helpers';

import DocumentContext from './DocumentContext';

export type DocumentProviderProps = {
  configuration?: DeepPartial<DocumentConfiguration>;
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
};

type ReducerAction = {
  key: string;
  type: 'subscribe' | 'run' | 'reset';
};

const reducer = (state: Record<string, boolean>, { key, type }: ReducerAction) => {
  switch (type) {
    case 'subscribe':
      return { ...state, [key]: false };

    case 'run':
      return { ...state, [key]: true };

    case 'reset':
      return {};
  }
};

const DocumentProvider = ({ configuration = {}, children, ...props }: DocumentProviderProps) => {
  const [asyncState, dispatch] = useReducer(reducer, {});
  const [isPending, setIsPending] = useState(true);

  const { configuration: printerConfiguration } = usePrinterContext();
  const globalConfiguration = merge(printerConfiguration, configuration);

  const { useAsync } = globalConfiguration;

  const subscribe = useCallback((key: string) => {
    dispatch({ key, type: 'subscribe' });
  }, []);
  const run = useCallback((key: string) => {
    dispatch({ key, type: 'run' });
  }, []);
  const reset = useCallback((key: string) => {
    dispatch({ key, type: 'reset' });
  }, []);

  useEffect(() => {
    if (useAsync) {
      const values = Object.values(asyncState);
      const isSomeNotReady = values.some((isReady) => !isReady);
      setIsPending(values.length === 0 || isSomeNotReady);
    } else {
      setIsPending(false);
    }
  }, [asyncState, useAsync]);

  return (
    <DocumentContext.Provider
      value={{ configuration: globalConfiguration, subscribe, run, reset, isPending, ...props }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export default DocumentProvider;
