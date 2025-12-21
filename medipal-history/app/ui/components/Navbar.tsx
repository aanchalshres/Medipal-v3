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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
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

  // Initialize theme and auth state
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
    
    // Check authentication
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    setIsLoggedIn(!!token);
    setRole(userRole);
  }, []);

  // Apply theme changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // MUI theme with custom medical colors
  const muiTheme = createTheme({
    palette: {
      mode: theme,
      primary: {
        main: theme === "dark" ? "#2E7D32" : "#2A7F62",
      },
      secondary: {
        main: theme === "dark" ? "#1E3A4D" : "#3A5E6D",
      },
      background: {
        default: theme === "dark" ? "#121212" : "#FFFFFF",
        paper: theme === "dark" ? "#1E1E1E" : "#F5F9F8",
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
        className={`sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
          theme === "dark" 
            ? "bg-[#121212] border-[#424242]" 
            : "bg-[#FFFFFF] border-[#E2E8F0]"
        }`}
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
                  alt="MediPortal Logo"
                  className="h-40 w-40 object-contain" 
                />
              </Link>
            </div>

            {/* Register button on the right - Only show when not logged in */}
            {!isLoggedIn && (
            <div className="flex items-center">
              <Button 
                variant="outlined"
                href="/auth/login"
                sx={{
                  fontSize: '0.95rem',
                  color: theme === "dark" ? "#E0E0E0" : "#2D3748",
                  borderColor: theme === "dark" ? "#424242" : "#E2E8F0",
                  '&:hover': {
                    borderColor: theme === "dark" ? "#E0E0E0" : "#2D3748",
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
                  backgroundColor: theme === "dark" ? "#2E7D32" : "#2A7F62",
                  "&:hover": {
                    backgroundColor: theme === "dark" ? "#1B5E20" : "#1E6D54",
                  },
                  minWidth: 100,
                  padding: '6px 16px',
                  marginLeft: '12px'
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
                    backgroundColor: theme === "dark" ? "#1E1E1E" : "#F5F9F8",
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
            </div>
            )}
          </div>
        </div>
      </header>
    </MuiThemeProvider>
  );
}