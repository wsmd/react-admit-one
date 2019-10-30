import React, { createContext } from 'react';
import useLazyValue from './utils/useLazyValue';
import { InstancesMap } from './types';

const AdmitOneBoundaryContext = createContext<InstancesMap | null>(null);

const AdmitOneBoundary: React.SFC = ({ children }) => {
  const instancesCache = useLazyValue<InstancesMap>(() => new Map());
  return (
    <AdmitOneBoundaryContext.Provider value={instancesCache}>
      {children}
    </AdmitOneBoundaryContext.Provider>
  );
};

export { AdmitOneBoundaryContext, AdmitOneBoundary };
