'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Tabs,
  Tab,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Avatar,
  CircularProgress,
  Alert,
  Snackbar
  
} from "@mui/material";
import {
  Stethoscope,
  Eye,
  EyeOff,
  Phone,
  Lock,
  User,
  UserCheck,
  ArrowLeft
} from "lucide-react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState<'patient' | 'doctor'>('patient');
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    rememberMe: false
  });
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // API call to backend login endpoint
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password,
          role: tabValue
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('role', data.role);
        
        // Redirect based on user type
        router.push(data.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
      } else {
        setError(data.message || 'Login failed');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check if server is running.');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Enhanced medical-themed MUI theme
  const muiTheme = createTheme({
    palette: {
      primary: {
        main: "#2A7F62", // Medical green
        light: "#E8F5E9",
        dark: "#1B5E20"
      },
      secondary: {
        main: "#3A5E6D", // Medical blue
      },
      error: {
        main: "#D32F2F",
      },
      background: {
        default: "#F8FAFC",
        paper: "#FFFFFF",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
            padding: '12px 24px',
            borderRadius: '12px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(42, 127, 98, 0.2)'
            }
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.03)',
            overflow: 'visible'
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            marginBottom: '24px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              '& fieldset': {
                borderColor: "#E2E8F0",
                borderWidth: '2px'
              },
              '&:hover fieldset': {
                borderColor: "#2A7F62",
              },
              '&.Mui-focused fieldset': {
                borderColor: "#2A7F62",
                borderWidth: '2px'
              },
            },
            '& .MuiInputLabel-root': {
              color: '#64748B',
              fontWeight: 500,
              '&.Mui-focused': {
                color: '#2A7F62',
              },
            },
            '& .MuiOutlinedInput-input': {
              padding: '16px 16px'
            }
          }
        }
      },
      MuiTab: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              color: "#2A7F62",
              fontWeight: 600
            }
          }
        }
      }
    },
  });

  return (
    <MuiThemeProvider theme={muiTheme}>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-green-50">
        <Snackbar 
          open={openSnackbar} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
        
        <div className="w-full max-w-md space-y-6">
          {/* Back Button */}
          <Button
            startIcon={<ArrowLeft size={18} />}
            onClick={() => router.push('/')}
            sx={{
              color: '#64748B',
              fontWeight: 500,
              alignSelf: 'flex-start',
              '&:hover': {
                backgroundColor: 'rgba(42, 127, 98, 0.05)'
              }
            }}
          >
            Back
          </Button>

          {/* Logo and Title */}
          <div className="flex flex-col items-center">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <img 
                src="/images/logo.png" 
                alt="MediPortal Logo"
                className="h-20 w-80 object-contain" 
              />
            </Link>

            <Typography 
              variant="h4" 
              className="font-bold text-center mt-[-20px]"
              sx={{
                background: 'linear-gradient(90deg, #2A7F62, #3A5E6D)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                letterSpacing: '-0.5px',
              }}
            >
              Welcome to MediPal
            </Typography>
            <Typography variant="subtitle1" className="text-gray-500 text-center mt-1">
              Your health, our priority
            </Typography>
          </div>

          {/* Login Card */}
          <Card>
            <CardContent className="p-6">
              <Tabs
                value={tabValue}
                onChange={(_, newValue) => setTabValue(newValue)}
                variant="fullWidth"
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: "#2A7F62",
                    height: 3
                  },
                  mb: 3
                }}
              >
                <Tab 
                  value="patient" 
                  label={
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Patient</span>
                    </div>
                  }
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    padding: '12px 16px',
                    minHeight: '48px'
                  }}
                />
                <Tab 
                  value="doctor" 
                  label={
                    <div className="flex items-center space-x-2">
                      <UserCheck className="h-5 w-5" />
                      <span>Doctor</span>
                    </div>
                  }
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    padding: '12px 16px',
                    minHeight: '48px'
                  }}
                />
              </Tabs>

              <Box component="form" onSubmit={handleSubmit} className="space-y-4">
                <TextField
                  fullWidth
                  label="Phone Number"
                  type="tel"
                  placeholder="98XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone className="text-gray-400" />
                      </InputAdornment>
                    ),
                    inputProps: {
                      pattern: "[0-9]{10}",
                      maxLength: 10
                    }
                  }}
                  helperText="Enter 10-digit mobile number"
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock className="text-gray-400" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          sx={{ color: '#64748B' }}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <div className="flex items-center justify-between">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.rememberMe}
                        onChange={(e) => 
                          setFormData({ ...formData, rememberMe: e.target.checked })
                        }
                        size="medium"
                        sx={{
                          color: "#9CA3AF",
                          '&.Mui-checked': {
                            color: "#2A7F62",
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" color="#64748B">
                        Remember me
                      </Typography>
                    }
                  />
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-sm font-medium text-[#2A7F62] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    py: 2,
                    fontSize: '1rem',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    background: 'linear-gradient(90deg, #2A7F62, #3A5E6D)',
                    "&:hover": {
                      background: 'linear-gradient(90deg, #1E6D54, #2C4D5D)',
                      boxShadow: '0 4px 12px rgba(42, 127, 98, 0.3)'
                    },
                    "&.Mui-disabled": {
                      background: '#E2E8F0',
                      color: '#94A3B8'
                    }
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    `Sign In as ${tabValue === 'doctor' ? 'Doctor' : 'Patient'}`
                  )}
                </Button>

                <Divider sx={{ 
                  my: 2,
                  '&::before, &::after': {
                    borderColor: '#E2E8F0',
                  }
                }}>
                  <Typography variant="body2" sx={{ 
                    color: "#64748B",
                    px: 2,
                    backgroundColor: '#F8FAFC'
                  }}>
                    New to MediPortal?
                  </Typography>
                </Divider>

                <div className="flex flex-col space-y-3">
                  <Button 
                    variant="outlined"
                    fullWidth
                    component={Link}
                    href="/auth/register"
                    startIcon={<User className="h-5 w-5" />}
                    sx={{
                      color: "#2D3748",
                      borderColor: "#E2E8F0",
                      py: 1.5,
                      '&:hover': {
                        borderColor: "#2A7F62",
                        backgroundColor: 'rgba(42, 127, 98, 0.05)'
                      }
                    }}
                  >
                    Register as Patient
                  </Button>
                  <Button 
                    variant="outlined"
                    fullWidth
                    component={Link}
                    href="/auth/doctor-register"
                    startIcon={<UserCheck className="h-5 w-5" />}
                    sx={{
                      color: "#2D3748",
                      borderColor: "#E2E8F0",
                      py: 1.5,
                      '&:hover': {
                        borderColor: "#2A7F62",
                        backgroundColor: 'rgba(42, 127, 98, 0.05)'
                      }
                    }}
                  >
                    Register as Doctor
                  </Button>
                </div>
              </Box>
            </CardContent>
          </Card>
        </div>
      </div>
    </MuiThemeProvider>
  );
}