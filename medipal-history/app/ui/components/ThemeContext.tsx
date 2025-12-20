"use client";
import { createContext, useContext, ReactNode, useState, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

type ThemeContextType = {
  toggleColorMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light mode palette
                background: {
                  default: '#FFFFFF',
                  paper: '#F5F9F8',
                },
                primary: {
                  main: '#2A7F62',
                },
                secondary: {
                  main: '#3A5E6D',
                },
                error: {
                  main: '#D32F2F',
                },
                success: {
                  main: '#388E3C',
                },
                text: {
                  primary: '#2D3748',
                  secondary: '#4A5568',
                },
                divider: '#E2E8F0',
              }
            : {
                // Dark mode palette
                background: {
                  default: '#121212',
                  paper: '#1E1E1E',
                },
                primary: {
                  main: '#2E7D32',
                },
                secondary: {
                  main: '#1E3A4D',
                },
                error: {
                  main: '#FF5252',
                },
                success: {
                  main: '#4CAF50',
                },
                text: {
                  primary: '#E0E0E0',
                  secondary: '#B0B0B0',
                },
                divider: '#424242',
              }),
        },
        typography: {
          fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
          h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
          },
          h2: {
            fontSize: '2rem',
            fontWeight: 600,
          },
          h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
          },
          h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
          },
          h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
          },
          h6: {
            fontSize: '1rem',
            fontWeight: 600,
          },
          body1: {
            fontSize: '1rem',
          },
          body2: {
            fontSize: '0.875rem',
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 8,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 8,
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ toggleColorMode }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within an AppThemeProvider');
  }
  return context;
}