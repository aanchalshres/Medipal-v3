'use client';

import { useState } from "react";
import {
  Send,
  Smartphone,
  Download as DownloadIcon,
  MedicalInformation,
  MedicalServices,
  LocalHospital,
  Medication,
  Description,
  CheckCircle,
  Error,
  Notifications
} from "@mui/icons-material";
import {
  Button,
  TextField,
  Box,
  Typography,
  Snackbar,
  Alert,
  Avatar,
  Paper,
  Container,
  useTheme,
  useMediaQuery,
  ThemeProvider,
  createTheme
} from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Medical-optimized theme with improved color palette
const medicalTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2A7F62', // Cadmium Green - Primary buttons and important actions
    },
    secondary: {
      main: '#3A5E6D', // Teal Blue - Navigation and secondary elements
    },
    error: {
      main: '#D32F2F', // Alert Red - Critical warnings and errors
    },
    success: {
      main: '#388E3C', // Clinic Green - Success messages and positive actions
    },
    background: {
      default: '#FFFFFF', // White - Main background (sterile feel)
      paper: '#F5F9F8', // Ice Gray - Cards and tiles (reduces eye strain)
    },
    text: {
      primary: '#2D3748', // Charcoal - Body text and headings (optimal readability)
      secondary: '#5A677D',
    },
    divider: '#E2E8F0', // Cloud Gray - Borders and dividers (softer than pure gray)
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
        },
        contained: {
          boxShadow: '0 4px 12px rgba(42, 127, 98, 0.2)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(42, 127, 98, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(58, 94, 109, 0.08)',
          backgroundColor: '#F5F9F8', // Ice Gray for cards
        },
      },
    },
  },
});

// Dark mode overrides with medical-appropriate colors
const darkTheme = createTheme(medicalTheme, {
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#E0E0E0',
      secondary: '#B0B0B0',
      disabled: '#9E9E9E',
    },
    divider: '#424242',
    primary: {
      main: '#4CAF50', // Brighter green for better visibility in dark mode
    },
    secondary: {
      main: '#81C784', // Softer teal for dark mode
    },
  },
});

const DownloadSection = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info"
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';

  const handleSendSMS = async () => {
    setIsSubmitting(true);

    if (!phoneNumber) {
      setSnackbar({
        open: true,
        message: "Please enter a phone number",
        severity: "error"
      });
      setIsSubmitting(false);
      return;
    }

    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s+/g, ''))) {
      setSnackbar({
        open: true,
        message: "Please enter a valid phone number",
        severity: "error"
      });
      setIsSubmitting(false);
      return;
    }

   try {
  const response = await fetch('http://localhost:5000/api/download/send-download-link', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phoneNumber }),
  });

  const data = await response.json();

  // <-- Replace the old success/error check with this Twilio status check
  if (data.twilioStatus === 'failed') {
    setSnackbar({
      open: true,
      message: "SMS failed to deliver. Check the number.",
      severity: "error"
    });
  } else if (data.twilioStatus === 'sent' || data.twilioStatus === 'delivered') {
    setSnackbar({
      open: true,
      message: data.message,
      severity: "success"
    });
    setPhoneNumber("");
  } else {
    setSnackbar({
      open: true,
      message: data.message || "SMS status unknown",
      severity: "info"
    });
  }

} catch (error) {
  console.error('Error sending SMS:', error);
  setSnackbar({
    open: true,
    message: "Network error. Please try again.",
    severity: "error"
  });
} finally {
  setIsSubmitting(false);
}

  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : medicalTheme}>
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          background: isDarkMode
            ? 'linear-gradient(135deg, #121212 0%, #1E3A4D 100%)'
            : 'linear-gradient(135deg, #FFFFFF 0%, #F5F9F8 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
            iconMapping={{
              success: <CheckCircle fontSize="inherit" />,
              error: <Error fontSize="inherit" />,
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Decorative elements */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.1,
            backgroundImage: isDarkMode
              ? 'radial-gradient(#3A5E6D 1px, transparent 1px)'
              : 'radial-gradient(#2A7F62 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
            sx={{
              display: 'grid',
              gap: { xs: 4, md: 6 },
              gridTemplateColumns: { lg: '1fr 1fr' },
              alignItems: 'center'
            }}
          >
            {/* Left - Phone Mockup */}
            <Box
              component={motion.div}
              variants={itemVariants}
              sx={{
                order: { xs: 2, lg: 1 },
                mt: { xs: 4, lg: 0 },
                display: 'flex',
                justifyContent: { xs: 'center', lg: 'flex-start' }
              }}
            >
              <motion.div
                style={{ position: 'relative' }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {/* Phone Frame */}
                <Box
                  sx={{
                    width: { xs: 280, md: 320 },
                    height: { xs: 500, md: 600 },
                    background: isDarkMode
                      ? 'linear-gradient(135deg, #3A5E6D 0%, #2A7F62 100%)'
                      : 'linear-gradient(135deg, #3A5E6D 0%, #2A7F62 100%)',
                    borderRadius: '3rem',
                    p: 1,
                    boxShadow: 6
                  }}
                >
                  <Box sx={{
                    width: '100%',
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: '2.5rem',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Status Bar */}
                    <Box sx={{
                      bgcolor: 'primary.main',
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      px: 3,
                      color: 'common.white',
                      fontSize: 12
                    }}>
                      <span>9:41</span>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2 8H4V14H2V8ZM6 5H8V14H6V5ZM10 2H12V14H10V2Z" fill="currentColor" />
                        </svg>
                        <span>100%</span>
                      </Box>
                    </Box>

                    {/* App Header */}
                    <Box sx={{
                      bgcolor: 'primary.main',
                      p: 2,
                      color: 'common.white'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{
                          width: 32,
                          height: 32,
                          bgcolor: 'rgba(255,255,255,0.2)',
                          '& .MuiSvgIcon-root': { fontSize: 16 }
                        }}>
                          <MedicalInformation />
                        </Avatar>
                        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                          <img
                            src="/images/logo.png"
                            alt="MediPortal Logo"
                            className="h-14 w-40 object-contain mr-auto"
                          />
                        </Link>
                      </Box>
                    </Box>

                    {/* App Content */}
                    <Box sx={{
                      p: 2,
                      gap: 2,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      {/* Doctor Card */}
                      <motion.div
                        whileHover={{ y: -2 }}
                        style={{ width: '100%' }}
                      >
                        <Paper sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{
                              width: 48,
                              height: 48,
                              bgcolor: 'primary.light',
                              color: 'primary.contrastText'
                            }}>
                              <MedicalServices />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight="bold">
                                Govinda Kcee
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Cardiologist
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{
                            mt: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}>
                            <Typography variant="body2" color="text.secondary">
                              Next Appointment
                            </Typography>
                            <Typography variant="body2" color="primary.main" fontWeight="medium">
                              Today 2:30 PM
                            </Typography>
                          </Box>
                        </Paper>
                      </motion.div>

                      {/* Quick Actions */}
                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 1
                      }}>
                        {[
                          { icon: <Description color="primary" />, label: 'Records' },
                          { icon: <Medication color="primary" />, label: 'Prescriptions' }
                        ].map((item, index) => (
                          <motion.div
                            key={item.label}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Paper sx={{ p: 1.5, textAlign: 'center' }}>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: 'primary.light',
                                  mx: 'auto',
                                  mb: 1,
                                  color: 'primary.contrastText'
                                }}
                              >
                                {item.icon}
                              </Avatar>
                              <Typography variant="body2" fontWeight="medium">
                                {item.label}
                              </Typography>
                            </Paper>
                          </motion.div>
                        ))}
                      </Box>

                      {/* Recent Activity */}
                      <Box sx={{ mt: 'auto', gap: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle2" fontWeight="bold">Recent Activity</Typography>
                        <Box sx={{ gap: 1, display: 'flex', flexDirection: 'column' }}>
                          {[
                            { text: 'Lab results received', color: 'success.main' },
                            { text: 'Appointment confirmed', color: 'primary.main' }
                          ].map((activity, index) => (
                            <motion.div
                              key={activity.text}
                              style={{ display: 'flex', alignItems: 'center', gap: 1 }}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                            >
                              <Box sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: activity.color
                              }} />
                              <Typography variant="body2" color="text.secondary">
                                {activity.text}
                              </Typography>
                            </motion.div>
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Floating notification */}
                <motion.div
                  style={{
                    position: 'absolute',
                    bottom: -16,
                    right: -16,
                    width: 160
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                >
                  <Paper sx={{ p: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Notifications color="primary" fontSize="small" />
                      <Box>
                        <Typography variant="body2" fontWeight="medium">New message!</Typography>
                        <Typography variant="caption" color="text.secondary">Govinda Kcee...</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              </motion.div>
            </Box>

            {/* Right - Download Content */}
            <Box
              component={motion.div}
              variants={itemVariants}
              sx={{ order: { xs: 1, lg: 2 } }}
            >
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 'bold',
                    mb: { xs: 2, md: 3 },
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    lineHeight: 1.2,
                    background: isDarkMode
                      ? 'linear-gradient(45deg, #4CAF50, #81C784)' // Brighter greens for dark mode
                      : 'linear-gradient(45deg, #2A7F62, #3A5E6D)', // Original medical palette
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Download the MediPal app
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    mb: { xs: 3, md: 4 },
                    fontSize: { xs: '1rem', md: '1.125rem' }
                  }}
                >
                  Your emergency medical information is always accessible to first responders when needed.
                </Typography>
              </motion.div>

              {/* Phone Input */}
              <motion.div variants={itemVariants} style={{ marginBottom: isMobile ? 24 : 32 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Get the link to download the app
                </Typography>

                <Box sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 1,
                  maxWidth: 'md'
                }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'action.hover',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    px: 2,
                    height: 56,
                    minWidth: 80
                  }}>
                    <Typography variant="body1" color="text.secondary">+977</Typography>
                  </Box>
                  <TextField
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: 56,
                        '& fieldset': {
                          borderRadius: 1,
                        }
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendSMS}
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    startIcon={<Send />}
                    sx={{
                      height: 56,
                      borderRadius: 1,
                      px: 4,
                      whiteSpace: 'nowrap',
                      minWidth: { sm: 140 },
                      backgroundColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.dark'
                      }
                    }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send SMS'}
                  </Button>
                </Box>
              </motion.div>

              {/* Download Buttons Section - Updated to match reference */}
              <motion.div variants={itemVariants}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <DownloadIcon color="primary" />
                  Or download directly from:
                </Typography>

                <Box sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  alignItems: 'flex-start'
                }}>
                  <Link
                    href="https://play.google.com/store/apps/details?id=com.practo.fabric"
                    target="_blank"
                    rel="noopener noreferrer"
                    passHref
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        width: 160,
                        height: 48,
                        '&:hover': {
                          opacity: 0.9,
                          transition: 'opacity 0.2s ease'
                        }
                      }}
                    >
                      <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                        alt="Download on Google Play"
                        fill
                        className="object-contain"
                      />
                    </Box>
                  </Link>

                  <Link
                    href="https://apps.apple.com/in/app/practo/id953772015"
                    target="_blank"
                    rel="noopener noreferrer"
                    passHref
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        width: 160,
                        height: 48,
                        '&:hover': {
                          opacity: 0.9,
                          transition: 'opacity 0.2s ease'
                        }
                      }}
                    >
                      <Image
                        src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                        alt="Download on App Store"
                        fill
                        className="object-contain"
                      />
                    </Box>
                  </Link>
                </Box>
              </motion.div>

              {/* Emergency Section */}

            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default DownloadSection;