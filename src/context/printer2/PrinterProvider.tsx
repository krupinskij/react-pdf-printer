import React, { useCallback, useEffect, useReducer, useState } from 'react';

import PrinterContext, { PrinterContextValue } from './PrinterContext';

interface Props {
  isAsync: boolean;
  children: React.ReactNode;
}

type ReducerAction = {
  key: string;
  type: 'subscribe' | 'run';
};

const reducer = (state: Record<string, boolean>, { key, type }: ReducerAction) => {
  switch (type) {
    case 'subscribe':
      return { ...state, [key]: false };

    case 'run':
      return { ...state, [key]: true };
  }
};

const PrinterProvider = ({ isAsync, children }: Props) => {
  const [state, dispatch] = useReducer(reducer, {});
  const [isLoading, setIsLoading] = useState(true);

  const subscribe = useCallback((key: string) => {
    dispatch({ key, type: 'subscribe' });
  }, []);
  const run = useCallback((key: string) => {
    dispatch({ key, type: 'run' });
  }, []);

  useEffect(() => {
    if (isAsync) {
      const values = Object.values(state);
      const isSomeNotReady = values.some((isReady) => !isReady);
      setIsLoading(values.length === 0 || isSomeNotReady);
    } else {
      setIsLoading(false);
    }
  }, [state, isAsync]);

  const value: PrinterContextValue = {
    isPrinter: true,
    subscribe,
    run,
    isLoading,
  };

  return <PrinterContext.Provider value={value}>{children}</PrinterContext.Provider>;
};

export default PrinterProvider;
