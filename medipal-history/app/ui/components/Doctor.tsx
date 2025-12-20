'use client';

import { 
  Notifications as BellIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Person as UserIcon,
  Menu as MenuIcon
} from "@mui/icons-material";
import { 
  Button, 
  InputAdornment, 
  TextField, 
  Badge, 
  IconButton,
  useMediaQuery,
  Theme
} from "@mui/material";
import { useState } from "react";

export const Doctor = () => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title - Left Side */}
          <div className="flex items-center">
            {isMobile && (
              <IconButton 
                onClick={handleDrawerToggle}
                sx={{ color: '#2A7F62', mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-[#2A7F62]">
                MediPal
              </h1>
              <p className="text-sm text-gray-500">Doctor Dashboard</p>
            </div>
          </div>

          {/* Search Bar - Center */}
          {!isMobile && (
            <div className="flex-1 max-w-lg mx-8">
              <TextField
                fullWidth
                size="small"
                placeholder="Search patients, appointments..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="text-gray-400" />
                    </InputAdornment>
                  ),
                  className: "bg-white rounded-lg",
                  sx: {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2A7F62',
                    },
                  }
                }}
              />
            </div>
          )}

          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            <IconButton 
              className="relative text-gray-600 hover:text-[#2A7F62]"
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(42, 127, 98, 0.1)' 
                } 
              }}
            >
              <BellIcon />
              <Badge 
                color="error" 
                badgeContent={3}
                className="absolute -top-1 -right-1"
                sx={{
                  '& .MuiBadge-badge': {
                    height: 16,
                    minWidth: 16,
                    fontSize: '0.65rem',
                  }
                }}
              />
            </IconButton>
            
            <IconButton 
              className="text-gray-600 hover:text-[#2A7F62]"
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(42, 127, 98, 0.1)' 
                } 
              }}
            >
              <SettingsIcon />
            </IconButton>
            
            <Button
              variant="contained"
              startIcon={<UserIcon />}
              sx={{
                backgroundColor: '#2A7F62',
                '&:hover': {
                  backgroundColor: '#1e6b50',
                },
                color: 'white',
                textTransform: 'none',
                padding: '6px 16px',
                marginLeft: '8px'
              }}
            >
              {isMobile ? 'Profile' : 'Dr. Smith'}
            </Button>
          </div>
        </div>

        {/* Mobile Search - Shows below on mobile */}
        {isMobile && (
          <div className="pb-3 pt-1">
            <TextField
              fullWidth
              size="small"
              placeholder="Search..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-gray-400" />
                  </InputAdornment>
                ),
                className: "bg-white rounded-lg",
                sx: {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2A7F62',
                  },
                }
              }}
            />
          </div>
        )}
      </div>
    </header>
  );
};