'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Button,
  Menu as MuiMenu,
  MenuItem,
  ListItemText 
} from "@mui/material";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";

export function Navbar() {
  const [registerAnchorEl, setRegisterAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  // Handle register menu open
  const handleRegisterOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setRegisterAnchorEl(event.currentTarget);
  };

  // Handle register menu close
  const handleRegisterClose = () => {
    setRegisterAnchorEl(null);
  };

  // Initialize auth state
  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    setIsLoggedIn(!!token);
    setRole(userRole);
  }, []);

  // MUI theme with custom medical colors (light mode only)
  const muiTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#2A7F62',
      },
      secondary: {
        main: '#3A5E6D',
      },
      background: {
        default: '#FFFFFF',
        paper: '#F5F9F8',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.9rem',
            padding: '8px 16px'
          },
        },
      },
    },
  });

  return (
    <MuiThemeProvider theme={muiTheme}>
      <header 
        className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-[#FFFFFF] border-[#E2E8F0]"
      >
        {/* Full width container with centered content */}
        <div className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo on the left */}
            <div className="flex items-center">
              <Link 
                href={isLoggedIn ? (role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard') : '/'} 
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <img 
                  src="/images/logo.png" 
                  alt="MediPal Logo"
                  className="h-12 w-auto object-contain" 
                />
              </Link>
            </div>

            {/* Auth buttons on the right */}
            <div className="flex items-center gap-3">
              {!isLoggedIn ? (
                <>
                  <Button 
                    variant="outlined"
                    href="/auth/login"
                    sx={{
                      fontSize: '0.95rem',
                      color: '#2D3748',
                      borderColor: '#E2E8F0',
                      '&:hover': {
                        borderColor: '#2D3748',
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleRegisterOpen}
                    sx={{
                      backgroundColor: '#2A7F62',
                      "&:hover": {
                        backgroundColor: '#1E6D54',
                      },
                      minWidth: 100,
                      padding: '6px 16px',
                    }}
                  >
                    Register
                  </Button>
                  
                  <MuiMenu
                    anchorEl={registerAnchorEl}
                    open={Boolean(registerAnchorEl)}
                    onClose={handleRegisterClose}
                    PaperProps={{
                      sx: {
                        backgroundColor: '#F5F9F8',
                      }
                    }}
                  >
                    <MenuItem 
                      onClick={handleRegisterClose} 
                      component={Link} 
                      href="/auth/register"
                    >
                      <ListItemText primary="Register as Patient" />
                    </MenuItem>
                    <MenuItem 
                      onClick={handleRegisterClose} 
                      component={Link} 
                      href="/auth/doctor-register"
                    >
                      <ListItemText primary="Register as Doctor" />
                    </MenuItem>
                  </MuiMenu>
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    href={role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'}
                    sx={{
                      fontSize: '0.95rem',
                      color: '#2D3748',
                      borderColor: '#E2E8F0',
                      '&:hover': {
                        borderColor: '#2D3748',
                      }
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('role');
                      window.location.href = '/';
                    }}
                    sx={{
                      fontSize: '0.95rem',
                      color: '#DC2626',
                      borderColor: '#DC2626',
                      '&:hover': {
                        borderColor: '#B91C1C',
                        backgroundColor: 'rgba(220, 38, 38, 0.1)',
                      }
                    }}
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </MuiThemeProvider>
  );
}