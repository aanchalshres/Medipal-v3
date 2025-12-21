'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@mui/material";
import {
  Calendar,
  FileText,
  Shield,
  Pill,
  Bell,
  User,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import {
  Menu as MuiMenu,
  MenuItem,
  ListItemButton,
  Divider,
  Badge,
  IconButton,
  ThemeProvider as MuiThemeProvider,
  createTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Drawer,
  Box
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

interface NavItem {
  name: string;
  path: string;
}

const navigationItems: NavItem[] = [
  { name: "Medical Records", path: "/medical-records" },
  { name: "Appointments", path: "/appointments" },
  { name: "Prescriptions", path: "/prescriptions" },
  { name: "Vaccination", path: "/vaccination" },
  { name: "Ambulance", path: "/ambulance" },
  // { name: "Health Analysis", path: "/health-analytics" },
];

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: 2,
    title: 'Upcoming Appointment',
    description: 'Tomorrow at 10:00 AM',
    time: '1 day ago',
    read: true
  },
  {
    id: 3,
    title: 'Lab Results Available',
    description: 'CBC report ready for review',
    time: '3 days ago',
    read: true
  }
];

export function MedicalNavbar() {
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  // Initialize theme and notifications after mount (client only)
  useEffect(() => {
    const savedTheme = typeof window !== 'undefined' ? (localStorage.getItem('theme') as 'light' | 'dark' | null) : null;
    // Force light mode by default
    setTheme(savedTheme || 'light');
    setUnreadCount(notifications.filter(n => !n.read).length);
    
    // Check if user is logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const userRole = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    setIsLoggedIn(!!token);
    setRole(userRole);
    
    setMounted(true);
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (theme) {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    if (theme) setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isActive = (path: string) => pathname === path;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
    setUnreadCount(0);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // MUI theme with custom medical colors
  const muiTheme = createTheme({
    palette: {
      mode: theme || 'light',
      primary: {
        main: theme === 'dark' ? '#2E7D32' : '#2A7F62',
      },
      secondary: {
        main: theme === 'dark' ? '#1E3A4D' : '#3A5E6D',
      },
      error: {
        main: theme === 'dark' ? '#FF5252' : '#D32F2F',
      },
      success: {
        main: theme === 'dark' ? '#4CAF50' : '#388E3C',
      },
      background: {
        default: theme === 'dark' ? '#121212' : '#FFFFFF',
        paper: theme === 'dark' ? '#1E1E1E' : '#F5F9F8',
      },
      text: {
        primary: theme === 'dark' ? '#E0E0E0' : '#2D3748',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.9rem',
            padding: '8px 16px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });

  const drawer = (
    <Box 
      sx={{ 
        width: 250,
        backgroundColor: theme === "dark" ? "#1E1E1E" : "#F5F9F8",
        height: '100%',
        padding: '20px 0'
      }}
    >
      <List>
        {navigationItems.map((item) => (
          <ListItem 
            key={item.name}
            disablePadding
            sx={{
              '&:hover': {
                backgroundColor: isActive(item.path) 
                  ? (theme === "dark" ? "#2E7D32" : "#2A7F62") + '20'
                  : (theme === "dark" ? "#2E7D32" : "#2A7F62") + '10',
              },
            }}
          >
            <ListItemButton 
              component={Link}
              href={item.path}
              onClick={handleDrawerToggle}
              sx={{
                color: isActive(item.path) 
                  ? (theme === "dark" ? "#4CAF50" : "#2A7F62")
                  : (theme === "dark" ? "#E0E0E0" : "#2D3748"),
                backgroundColor: isActive(item.path) 
                  ? (theme === "dark" ? "#2E7D32" : "#2A7F62") + '20'
                  : 'transparent',
                padding: '12px 24px'
              }}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ 
        backgroundColor: theme === "dark" ? "#424242" : "#E2E8F0"
      }} />
    </Box>
  );

  if (!mounted || theme === null || unreadCount === null) {
    // Prevent hydration mismatch by not rendering until client values are set
    return null;
  }

  return (
    <MuiThemeProvider theme={muiTheme}>
      <header 
        className="sticky top-0 z-50 w-full border-b bg-white border-gray-200"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Mobile menu button and logo */}
          <div className="flex items-center">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
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

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path)
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Theme Toggle */}
        

            {/* Notifications */}
           <>
  <IconButton 
    color="inherit"
    onClick={handleNotificationOpen}
  >
    <Badge badgeContent={unreadCount} color="error">
      <Bell className="h-5 w-5" />
    </Badge>
  </IconButton>
  
  {/* Notification Menu - This should be outside the IconButton */}
  <MuiMenu
    anchorEl={notificationAnchorEl}
    open={Boolean(notificationAnchorEl)}
    onClose={handleNotificationClose}
    PaperProps={{
      sx: {
        width: 360,
        maxHeight: 400,
        mt: 1.5,
        backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
      }
    }}
  >
    <div className={`p-4 border-b ${theme === "dark" ? "border-[#424242]" : "border-[#E2E8F0]"}`}>
      <h3 className="font-semibold">Notifications</h3>
    </div>
    <div className="max-h-80 overflow-auto">
      {notifications.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No notifications
        </div>
      ) : (
        notifications.map((notification) => (
          <MenuItem
            key={notification.id}
            onClick={handleNotificationClose}
            className={`border-b ${theme === "dark" ? "border-[#424242] hover:bg-[#2A2A2A]" : "border-[#E2E8F0] hover:bg-gray-50"}`}
          >
            <div className="w-full py-2">
              <div className="flex justify-between items-start">
                <span className={`font-medium ${notification.read ? "" : "text-primary"}`}>
                  {notification.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {notification.time}
                </span>
              </div>
              <p className="text-sm mt-1 text-muted-foreground">
                {notification.description}
              </p>
            </div>
          </MenuItem>
        ))
      )}
    </div>
    {notifications.length > 0 && (
      <div className={`p-2 border-t ${theme === "dark" ? "border-[#424242]" : "border-[#E2E8F0]"}`}>
        <Button 
          fullWidth 
          size="small"
          onClick={handleNotificationClose}
        >
          Mark all as read
        </Button>
      </div>
    )}
  </MuiMenu>
</>

            {/* User Menu - Only show when logged in */}
            {isLoggedIn && (
              <>
                <IconButton
                  color="inherit"
                  onClick={handleMenuOpen}
                  size="small"
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: '#2A7F62',
                      fontSize: '0.875rem'
                    }}
                  >
                    <User className="h-5 w-5" />
                  </Avatar>
                </IconButton>

                <MuiMenu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 200,
                      backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
                    }
                  }}
                >
                  <MenuItem
                    component={Link}
                    href="/profile-account"
                    onClick={handleMenuClose}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      localStorage.removeItem('token');
                      setIsLoggedIn(false);
                      handleMenuClose();
                      window.location.href = '/auth/login';
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </MenuItem>
                </MuiMenu>
              </>
            )}
          </div>

          {/* Notification Menu */}
     
        </div>

        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 250,
              backgroundColor: theme === "dark" ? "#1E1E1E" : "#F5F9F8"
            },
          }}
        >
          {drawer}
        </Drawer>
      </header>
    </MuiThemeProvider>
  );
}