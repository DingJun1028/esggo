import React, { createContext, useContext } from 'react';

const Context = createContext<any>(null);

export const OmniAgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Context.Provider value={{}}>{children}</Context.Provider>
);

export const useOmniAgent = () => useContext(Context);
export const ToastContainer = () => null;
