import React, { useReducer } from 'react';

import PrinterContext, { PrinterContextValue } from './PrinterContext';

interface Props {
  children: React.ReactNode;
}

type ReducerAction = {
  key: string;
  type: 'subscribe' | 'run';
};

const reducer = (state: Record<string, boolean>, { key, type }: ReducerAction) => {
  switch (type) {
    case 'subscribe': {
      return { ...state, [key]: false };
    }
    case 'run': {
      return { ...state, [key]: true };
    }
  }
};

const PrinterProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, {});
  const subscribe = (key: string) => {
    dispatch({ key, type: 'subscribe' });
    return () => {
      dispatch({ key, type: 'run' });
    };
  };

  const value: PrinterContextValue = {
    isPrinter: true,
    subscribe,
    isLoading: Object.values(state).every((value) => value),
  };

  return <PrinterContext.Provider value={value}>{children}</PrinterContext.Provider>;
};

export default PrinterProvider;
