import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getDesignTokens } from '../styles/theme';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');

  // EFFECT: Set data attribute on body for global CSS to use
  useEffect(() => {
    document.body.setAttribute('data-mui-color-scheme', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('themeMode', newMode);
          return newMode;
        });
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => useContext(ColorModeContext);