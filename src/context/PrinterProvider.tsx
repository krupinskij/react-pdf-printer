import React, { useEffect, useReducer, useState } from 'react';

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
  console.log(state, key, type);
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
  const subscribe = (key: string) => {
    dispatch({ key, type: 'subscribe' });
    return () => {
      dispatch({ key, type: 'run' });
    };
  };

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
    isLoading,
  };

  return <PrinterContext.Provider value={value}>{children}</PrinterContext.Provider>;
};

export default PrinterProvider;
