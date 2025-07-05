import React, { createContext, useContext } from 'react';

const ColorSchemeContext = createContext<'light'>('light');
export const useForcedColorScheme = () => useContext(ColorSchemeContext);

export const ColorSchemeProvider = ({ children }: { children: React.ReactNode }) => (
  <ColorSchemeContext.Provider value="light">
    {children}
  </ColorSchemeContext.Provider>
);
