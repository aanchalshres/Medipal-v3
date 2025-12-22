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

const patientNavigationItems: NavItem[] = [
  { name: "Dashboard", path: "/patient/dashboard" },
  { name: "Medical History", path: "/medical-records" },
  { name: "Reports", path: "/reports" },
  { name: "Appointments", path: "/appointments" },
];

const doctorNavigationItems: NavItem[] = [
  { name: "Dashboard", path: "/doctor/dashboard" },
  { name: "Search Patient", path: "/doctor/search-patient" },
  { name: "Consultations", path: "/doctor/consultations" },
  { name: "Appointments", path: "/doctor/appointments" },
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
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  // Initialize notifications and auth state
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
    
    // Check if user is logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const userRole = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    setIsLoggedIn(!!token);
    setRole(userRole);
  }, []);

  const isActive = (path: string) => pathname === path;

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
      error: {
        main: '#D32F2F',
      },
      success: {
        main: '#388E3C',
      },
      background: {
        default: '#FFFFFF',
        paper: '#F5F9F8',
      },
      text: {
        primary: '#2D3748',
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

  const navigationItems = role === 'doctor' ? doctorNavigationItems : patientNavigationItems;

  const drawer = (
    <Box 
      sx={{ 
        width: 250,
        backgroundColor: '#F5F9F8',
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
                  ? '#2A7F6220'
                  : '#2A7F6210',
              },
            }}
          >
            <ListItemButton 
              component={Link}
              href={item.path}
              onClick={handleDrawerToggle}
              sx={{
                color: isActive(item.path) 
                  ? '#2A7F62'
                  : '#2D3748',
                backgroundColor: isActive(item.path) 
                  ? '#2A7F6220'
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
        backgroundColor: '#E2E8F0'
      }} />
    </Box>
  );

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
                alt="MediPal Logo"
                className="h-40 w-40 object-contain" 
              />
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {(role === 'doctor' ? doctorNavigationItems : patientNavigationItems).map((item) => (
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
        backgroundColor: '#FFFFFF',
      }
    }}
  >
    <div className="p-4 border-b border-[#E2E8F0]">
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
            className="border-b border-[#E2E8F0] hover:bg-gray-50"
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
      <div className="p-2 border-t border-[#E2E8F0]">
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

            {/* Profile Icon and Logout Button - Only show when logged in */}
            {isLoggedIn && (
              <>
                <IconButton
                  component={Link}
                  href="/profile-account"
                  color="inherit"
                  size="small"
                  title="Profile"
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: '#E2E8F0',
                      color: '#2D3748',
                      fontSize: '0.875rem'
                    }}
                  >
                    <User className="h-5 w-5" />
                  </Avatar>
                </IconButton>

                <Button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    setIsLoggedIn(false);
                    window.location.href = '/auth/login';
                  }}
                  startIcon={<LogOut className="h-4 w-4" />}
                  sx={{
                    color: '#D32F2F',
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: '#FFEBEE'
                    }
                  }}
                >
                  Logout
                </Button>
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
              backgroundColor: '#F5F9F8'
            },
          }}
        >
          {drawer}
        </Drawer>
      </header>
    </MuiThemeProvider>
  );
}