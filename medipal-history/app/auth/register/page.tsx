"use client";
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
  Typography,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress,
  Alert,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  Radio,
  Avatar
} from "@mui/material";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Calendar,
  ShieldCheck,
  Smartphone,
  MapPin,
  FileText,
  BookUser,
  FileImage,
  HeartPulse,
  Droplet,
  AlertCircle,
  Pill,
  ClipboardList,
  Hash
} from "lucide-react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import { countries } from "countries-list";

export default function PatientRegisterPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    bloodGroup: '',
    
    // Medical Information
    height: '',
    weight: '',
    allergies: [] as string[],
    currentMedications: [] as string[],
    chronicConditions: [] as string[],
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    
    // Address Information
    address: '',
    city: '',
    country: '',
    postalCode: '',
    
    // Verification Documents
    citizenshipNumber: '',
    citizenshipIssuedDistrict: '',
    citizenshipDocument: null as File | null,
    profilePhoto: null as File | null,
    insuranceCard: null as File | null
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' as 'info' | 'success' | 'warning' | 'error'
  });

  const router = useRouter();

  // Data for dropdowns
  const nepaliDistricts = [
    'Kathmandu', 'Pokhara', 'Lalitpur', 'Bhaktapur', 'Biratnagar', 'Birgunj',
    'Dharan', 'Bharatpur', 'Janakpur', 'Butwal', 'Hetauda', 'Dhangadhi',
    'Nepalgunj', 'Itahari', 'Tulsipur', 'Birendranagar', 'Ghorahi', 'Kalaiya'
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const commonAllergies = ['Penicillin', 'Sulfa', 'Aspirin', 'Ibuprofen', 'Latex', 'Pollen', 'Dust', 'Nuts', 'Shellfish', 'Eggs'];
  const commonConditions = ['Diabetes', 'Hypertension', 'Asthma', 'Arthritis', 'Heart Disease', 'Thyroid Disorder', 'COPD', 'Depression'];
  const commonMedications = ['Metformin', 'Lisinopril', 'Atorvastatin', 'Levothyroxine', 'Albuterol', 'Sertraline', 'Omeprazole', 'Amlodipine'];

  // Validation functions
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 0) {
      // Personal Info Validation
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    } else if (step === 1) {
      // Medical Info Validation
      if (!formData.height) newErrors.height = 'Height is required';
      if (!formData.weight) newErrors.weight = 'Weight is required';
      if (!formData.emergencyContactName) newErrors.emergencyContactName = 'Emergency contact name is required';
      if (!formData.emergencyContactPhone) newErrors.emergencyContactPhone = 'Emergency contact phone is required';
      if (!formData.emergencyContactRelation) newErrors.emergencyContactRelation = 'Emergency contact relation is required';
    } else if (step === 2) {
      // Address Info Validation
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.country) newErrors.country = 'Country is required';
    } else if (step === 3) {
      // Document Validation
      if (!formData.citizenshipNumber) newErrors.citizenshipNumber = 'Citizenship number is required';
      if (!formData.citizenshipIssuedDistrict) newErrors.citizenshipIssuedDistrict = 'Issued district is required';
      if (!formData.citizenshipDocument) newErrors.citizenshipDocument = 'Citizenship document is required';
      if (!formData.profilePhoto) newErrors.profilePhoto = 'Profile photo is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [field]: e.target.files![0] }));
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Stepper handlers
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(activeStep)) {
      if (activeStep === steps.length - 1) {
        if (!termsAccepted) {
          setErrors(prev => ({ ...prev, terms: 'You must accept the terms and conditions' }));
          return;
        }

        setIsLoading(true);

        try {
          // Prepare form data for API
          const formDataToSend = new FormData();
          
          // Append all form fields to FormData
          Object.entries(formData).forEach(([key, value]) => {
            if (key === 'allergies' || key === 'currentMedications' || key === 'chronicConditions') {
              // Handle array fields
              if (Array.isArray(value)) {
                formDataToSend.append(key, JSON.stringify(value));
              }
            } else if (value instanceof File) {
              // Handle file uploads
              formDataToSend.append(key, value);
            } else if (value !== null && value !== undefined) {
              // Handle regular fields
              formDataToSend.append(key, value.toString());
            }
          });

          // Make API call to your backend
          const response = await fetch('http://localhost:5000/api/patients/register', {
            method: 'POST',
            body: formDataToSend,
            // Don't set Content-Type header when using FormData,
            
            // the browser will set it automatically with the correct boundary
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
          }

          setSnackbar({
            open: true,
            message: data.message || 'Patient registration successful!',
            severity: 'success'
          });
          
          // Redirect after a short delay
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } catch (error: any) {
          setSnackbar({
            open: true,
            message: error.message || 'An error occurred. Please try again.',
            severity: 'error'
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        handleNext();
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Stepper configuration
  const steps = [
    'Personal Information',
    'Medical Details',
    'Address Information',
    'Document Verification'
  ];

  // Medical-themed MUI theme
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
            borderRadius: '10px',
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
            marginBottom: '16px',
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
              padding: '14px 16px'
            }
          }
        }
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: '#E2E8F0',
            borderWidth: '1px',
            '&::before, &::after': {
              borderColor: 'inherit',
            }
          }
        }
      },
      MuiStepper: {
        styleOverrides: {
          root: {
            padding: '24px 0',
            '& .MuiStepLabel-label': {
              fontWeight: 500,
              color: '#64748B',
              '&.Mui-active, &.Mui-completed': {
                color: '#2A7F62',
                fontWeight: 600
              }
            },
            '& .MuiStepIcon-root': {
              color: '#E2E8F0',
              '&.Mui-active': {
                color: '#2A7F62'
              },
              '&.Mui-completed': {
                color: '#2A7F62'
              }
            }
          }
        }
      }
    },
  });

  // File upload display component
  const FileUploadField = ({ 
    label, 
    value, 
    onChange, 
    error, 
    helperText,
    icon: Icon
  }: {
    label: string;
    value: File | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
    helperText?: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <Box sx={{ mb: 3 }}>
      <input
        accept="image/*,.pdf,.doc,.docx"
        style={{ display: 'none' }}
        id={`file-upload-${label}`}
        type="file"
        onChange={onChange}
      />
      <label htmlFor={`file-upload-${label}`}>
        <Button
          component="span"
          variant="outlined"
          fullWidth
          sx={{
            p: 3,
            borderStyle: 'dashed',
            borderWidth: '2px',
            borderColor: error ? '#D32F2F' : '#E2E8F0',
            '&:hover': {
              borderColor: error ? '#D32F2F' : '#2A7F62',
              backgroundColor: '#F8FAFC'
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Icon className="h-8 w-8 mb-2 text-gray-400" />
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              {value ? value.name : `Upload ${label}`}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              {value ? 'Click to change' : 'Supports JPG, PNG, PDF, DOC'}
            </Typography>
          </Box>
        </Button>
      </label>
      {error && (
        <FormHelperText error sx={{ mt: 1, ml: 2 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );

  return (
    <MuiThemeProvider theme={muiTheme}>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="w-full max-w-4xl space-y-8">
          {/* Logo Header */}
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
              Patient Registration
            </Typography>
            <Typography variant="subtitle1" className="text-gray-500 text-center mt-2">
              Complete your profile to access healthcare services
            </Typography>
          </div>

          {/* Registration Card */}
          <Card>
            <CardContent className="p-6 md:p-8">
              {/* Stepper */}
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Divider sx={{ my: 4 }} />

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Personal Information */}
                {activeStep === 0 && (
                  <Box className="space-y-4">
                    <Typography variant="h6" className="font-semibold text-gray-700 flex items-center">
                      <User className="mr-2 h-5 w-5 text-primary" />
                      Personal Information
                    </Typography>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextField
                        fullWidth
                        name="fullName"
                        label="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <User className="text-gray-400" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        name="email"
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Mail className="text-gray-400" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
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

                      <TextField
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ShieldCheck className="text-gray-400" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        name="phone"
                        label="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Smartphone className="text-gray-400" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <FormControl fullWidth error={!!errors.gender}>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleSelectChange}
                          label="Gender"
                          sx={{
                            '& .MuiSelect-select': {
                              display: 'flex',
                              alignItems: 'center'
                            }
                          }}
                        >
                          <MenuItem value=""><em>Select gender</em></MenuItem>
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                          <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                        </Select>
                        {errors.gender && (
                          <FormHelperText>{errors.gender}</FormHelperText>
                        )}
                      </FormControl>

                      <TextField
                        fullWidth
                        name="dateOfBirth"
                        label="Date of Birth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        error={!!errors.dateOfBirth}
                        helperText={errors.dateOfBirth}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Calendar className="text-gray-400" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <FormControl fullWidth error={!!errors.bloodGroup}>
                        <InputLabel>Blood Group</InputLabel>
                        <Select
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleSelectChange}
                          label="Blood Group"
                          sx={{
                            '& .MuiSelect-select': {
                              display: 'flex',
                              alignItems: 'center'
                            }
                          }}
                        >
                          <MenuItem value=""><em>Select blood group</em></MenuItem>
                          {bloodGroups.map(group => (
                            <MenuItem key={group} value={group}>
                              <Droplet className="mr-2 h-4 w-4 text-gray-400" />
                              {group}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.bloodGroup && (
                          <FormHelperText>{errors.bloodGroup}</FormHelperText>
                        )}
                      </FormControl>
                    </div>
                  </Box>
                )}

                {/* Step 2: Medical Information */}
                {activeStep === 1 && (
                  <Box className="space-y-4">
                    <Typography variant="h6" className="font-semibold text-gray-700 flex items-center">
                      <HeartPulse className="mr-2 h-5 w-5 text-primary" />
                      Medical Information
                    </Typography>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextField
                        fullWidth
                        name="height"
                        label="Height (cm)"
                        type="number"
                        value={formData.height}
                        onChange={handleChange}
                        error={!!errors.height}
                        helperText={errors.height}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <User className="text-gray-400" />
                            </InputAdornment>
                          ),
                          inputProps: { min: 0 }
                        }}
                      />

                      <TextField
                        fullWidth
                        name="weight"
                        label="Weight (kg)"
                        type="number"
                        value={formData.weight}
                        onChange={handleChange}
                        error={!!errors.weight}
                        helperText={errors.weight}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ClipboardList className="text-gray-400" />
                            </InputAdornment>
                          ),
                          inputProps: { min: 0 }
                        }}
                      />

                      <FormControl fullWidth>
                        <TextField
                          name="allergies"
                          label="Allergies (if any)"
                          placeholder="Enter allergies separated by commas"
                          value={formData.allergies.join(', ')}
                          onChange={(e) => {
                            const values = e.target.value.split(',').map(item => item.trim());
                            setFormData(prev => ({ ...prev, allergies: values }));
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AlertCircle className="text-gray-400" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </FormControl>

                      <FormControl fullWidth>
                        <TextField
                          name="currentMedications"
                          label="Current Medications (if any)"
                          placeholder="Enter medications separated by commas"
                          value={formData.currentMedications.join(', ')}
                          onChange={(e) => {
                            const values = e.target.value.split(',').map(item => item.trim());
                            setFormData(prev => ({ ...prev, currentMedications: values }));
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Pill className="text-gray-400" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </FormControl>

                      <FormControl fullWidth>
                        <TextField
                          name="chronicConditions"
                          label="Chronic Conditions (if any)"
                          placeholder="Enter conditions separated by commas"
                          value={formData.chronicConditions.join(', ')}
                          onChange={(e) => {
                            const values = e.target.value.split(',').map(item => item.trim());
                            setFormData(prev => ({ ...prev, chronicConditions: values }));
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <HeartPulse className="text-gray-400" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </FormControl>

                      <div className="col-span-2">
                        <Typography variant="subtitle2" className="font-medium text-gray-600 mb-4">
                          Emergency Contact Information
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <TextField
                            fullWidth
                            name="emergencyContactName"
                            label="Full Name"
                            value={formData.emergencyContactName}
                            onChange={handleChange}
                            error={!!errors.emergencyContactName}
                            helperText={errors.emergencyContactName}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <User className="text-gray-400" />
                                </InputAdornment>
                              ),
                            }}
                          />

                          <TextField
                            fullWidth
                            name="emergencyContactPhone"
                            label="Phone Number"
                            value={formData.emergencyContactPhone}
                            onChange={handleChange}
                            error={!!errors.emergencyContactPhone}
                            helperText={errors.emergencyContactPhone}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Smartphone className="text-gray-400" />
                                </InputAdornment>
                              ),
                            }}
                          />

                          <TextField
                            fullWidth
                            name="emergencyContactRelation"
                            label="Relationship"
                            value={formData.emergencyContactRelation}
                            onChange={handleChange}
                            error={!!errors.emergencyContactRelation}
                            helperText={errors.emergencyContactRelation}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <User className="text-gray-400" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Box>
                )}

                {/* Step 3: Address Information */}
                {activeStep === 2 && (
                  <Box className="space-y-4">
                    <Typography variant="h6" className="font-semibold text-gray-700 flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-primary" />
                      Address Information
                    </Typography>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextField
                        fullWidth
                        name="address"
                        label="Full Address"
                        multiline
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                        error={!!errors.address}
                        helperText={errors.address}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MapPin className="text-gray-400 mt-1" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        name="city"
                        label="City"
                        value={formData.city}
                        onChange={handleChange}
                        error={!!errors.city}
                        helperText={errors.city}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MapPin className="text-gray-400" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <FormControl fullWidth error={!!errors.country}>
                        <TextField
                          name="country"
                          label="Country"
                          value={formData.country}
                          onChange={handleChange}
                          error={!!errors.country}
                          helperText={errors.country}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <MapPin className="text-gray-400" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </FormControl>

                      <TextField
                        fullWidth
                        name="postalCode"
                        label="Postal Code"
                        value={formData.postalCode}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Hash className="text-gray-400" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                  </Box>
                )}

                {/* Step 4: Document Verification */}
                {activeStep === 3 && (
                  <Box className="space-y-4">
                    <Typography variant="h6" className="font-semibold text-gray-700 flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-primary" />
                      Document Verification
                    </Typography>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextField
                        fullWidth
                        name="citizenshipNumber"
                        label="Citizenship Number"
                        value={formData.citizenshipNumber}
                        onChange={handleChange}
                        error={!!errors.citizenshipNumber}
                        helperText={errors.citizenshipNumber}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BookUser className="text-gray-400" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <FormControl fullWidth error={!!errors.citizenshipIssuedDistrict}>
                        <InputLabel>Citizenship Issued District</InputLabel>
                        <Select
                          name="citizenshipIssuedDistrict"
                          value={formData.citizenshipIssuedDistrict}
                          onChange={handleSelectChange}
                          label="Citizenship Issued District"
                          sx={{
                            '& .MuiSelect-select': {
                              display: 'flex',
                              alignItems: 'center'
                            }
                          }}
                        >
                          <MenuItem value=""><em>Select district</em></MenuItem>
                          {nepaliDistricts.map(district => (
                            <MenuItem key={district} value={district}>
                              <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                              {district}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.citizenshipIssuedDistrict && (
                          <FormHelperText>{errors.citizenshipIssuedDistrict}</FormHelperText>
                        )}
                      </FormControl>
                    </div>

                    <Typography variant="subtitle1" className="font-medium text-gray-600 mt-6 mb-4">
                      Please upload clear scans/photos of the following documents:
                    </Typography>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FileUploadField
                        label="Citizenship Document"
                        value={formData.citizenshipDocument}
                        onChange={handleFileChange('citizenshipDocument')}
                        error={!!errors.citizenshipDocument}
                        helperText={errors.citizenshipDocument}
                        icon={BookUser}
                      />

                      <FileUploadField
                        label="Profile Photo"
                        value={formData.profilePhoto}
                        onChange={handleFileChange('profilePhoto')}
                        error={!!errors.profilePhoto}
                        helperText={errors.profilePhoto}
                        icon={User}
                      />

                      <FileUploadField
                        label="Insurance Card (Optional)"
                        value={formData.insuranceCard}
                        onChange={handleFileChange('insuranceCard')}
                        icon={FileText}
                      />
                    </div>

                    {/* Terms and Conditions */}
                    <Box className="mt-6">
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={termsAccepted}
                            onChange={(e) => {
                              setTermsAccepted(e.target.checked);
                              if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                            }}
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
                            I certify that all information provided is accurate and agree to the{' '}
                            <Link href="/terms" className="text-primary font-medium hover:underline">Terms of Service</Link> and{' '}
                            <Link href="/privacy" className="text-primary font-medium hover:underline">Privacy Policy</Link>
                          </Typography>
                        }
                      />
                      {errors.terms && (
                        <Alert severity="error" sx={{ borderRadius: '12px', mt: 2 }}>
                          {errors.terms}
                        </Alert>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    disabled={activeStep === 0 || isLoading}
                    sx={{
                      minWidth: '120px',
                      borderColor: '#E2E8F0',
                      color: '#64748B',
                      '&:hover': {
                        borderColor: '#94A3B8',
                        backgroundColor: '#F8FAFC'
                      }
                    }}
                  >
                    Back
                  </Button>
                  
                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isLoading}
                      startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : null}
                      sx={{
                        minWidth: '180px',
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
                      {isLoading ? "Submitting..." : "Complete Registration"}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{
                        minWidth: '120px',
                        background: 'linear-gradient(90deg, #2A7F62, #3A5E6D)',
                        "&:hover": {
                          background: 'linear-gradient(90deg, #1E6D54, #2C4D5D)',
                          boxShadow: '0 4px 12px rgba(42, 127, 98, 0.3)'
                        }
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </form>
            </CardContent>
          </Card>

          <Typography variant="body2" className="text-center text-gray-500">
            Already have an account?{' '}
            <Link 
              href="/auth/login" 
              className="text-primary font-medium hover:underline"
            >
              Sign in here
            </Link>
          </Typography>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
          iconMapping={{
            success: <HeartPulse className="h-6 w-6" />,
            error: <HeartPulse className="h-6 w-6" />
          }}
        >
          <Typography fontWeight={500}>{snackbar.message}</Typography>
        </Alert>
      </Snackbar>
    </MuiThemeProvider>
  );
}