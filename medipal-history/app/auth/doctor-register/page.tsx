'use client';

import { useState, useEffect } from "react";
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
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Autocomplete,
  Chip,
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
} from "@mui/material";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Stethoscope,
  BadgePlus,
  BookUser,
  FileText,
  ClipboardList,
  BriefcaseMedical,
  MapPin,
  Calendar,
  ShieldCheck,
  GraduationCap,
  Hospital,
  Smartphone,
  CreditCard,
  Banknote,
  FileSignature,
  FileSearch,
  FileDigit,
  FileArchive,
  FileImage,
  FileUp,
  FileInput
} from "lucide-react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import { countries } from "countries-list";

interface Doctor {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  licenseNumber: string;
  specialization: string[];
  yearsOfExperience: number;
  hospital: string;
  qualifications: string;
  availableDays: string[];
  consultationFee: number;
  paymentMethods: string[];
  address: string;
  city: string;
  country: string;
  postalCode: string;
  citizenshipNumber: string;
  citizenshipIssuedDistrict: string;
  licenseDocument: string;
  degreeDocument: string;
  citizenshipDocument: string;
  profilePhoto: string;
  isVerified: boolean;
  verificationStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  licenseNumber: string;
  specialization: string[];
  yearsOfExperience: string;
  hospital: string;
  qualifications: string;
  availableDays: string[];
  consultationFee: string;
  paymentMethods: string[];
  address: string;
  city: string;
  country: string;
  postalCode: string;
  citizenshipNumber: string;
  citizenshipIssuedDistrict: string;
  licenseDocument: File | null;
  degreeDocument: File | null;
  citizenshipDocument: File | null;
  profilePhoto: File | null;
}

export default function DoctorRegisterPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    licenseNumber: '',
    specialization: [],
    yearsOfExperience: '',
    hospital: '',
    qualifications: '',
    availableDays: [],
    consultationFee: '',
    paymentMethods: [],
    address: '',
    city: '',
    country: '',
    postalCode: '',
    citizenshipNumber: '',
    citizenshipIssuedDistrict: '',
    licenseDocument: null,
    degreeDocument: null,
    citizenshipDocument: null,
    profilePhoto: null
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
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [nepaliDistricts, setNepaliDistricts] = useState<string[]>([]);

  const router = useRouter();

  // Fetch initial data for dropdowns
  useEffect(() => {
    // Set default values for dropdowns
    setSpecializations([
      'Cardiology', 'Dermatology', 'Endocrinology', 'Family Medicine',
      'Gastroenterology', 'General Surgery', 'Internal Medicine', 'Neurology',
      'Obstetrics/Gynecology', 'Oncology', 'Ophthalmology', 'Orthopedics',
      'Otolaryngology', 'Pediatrics', 'Psychiatry', 'Pulmonology',
      'Radiology', 'Urology'
    ]);
    
    setAvailableDays([
      'Sunday', 'Monday', 'Tuesday', 'Wednesday',
      'Thursday', 'Friday', 'Saturday'
    ]);
    
    setPaymentMethods([
      'Cash', 'Credit Card', 'Debit Card', 'Mobile Payment',
      'Bank Transfer', 'Insurance'
    ]);
    
    setNepaliDistricts([
      'Kathmandu', 'Pokhara', 'Lalitpur', 'Bhaktapur', 'Biratnagar', 'Birgunj',
      'Dharan', 'Bharatpur', 'Janakpur', 'Butwal', 'Hetauda', 'Dhangadhi',
      'Nepalgunj', 'Itahari', 'Tulsipur', 'Birendranagar', 'Ghorahi', 'Kalaiya'
    ]);
  }, []);

  const countriesList = Object.values(countries).map(country => country.name);

  // Validation functions
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 0) {
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
    } else if (step === 1) {
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
      if (formData.specialization.length === 0) newErrors.specialization = 'At least one specialization is required';
      if (!formData.yearsOfExperience) newErrors.yearsOfExperience = 'Years of experience is required';
      if (!formData.hospital) newErrors.hospital = 'Hospital/clinic name is required';
      if (!formData.qualifications) newErrors.qualifications = 'Qualifications are required';
      if (!formData.consultationFee) newErrors.consultationFee = 'Consultation fee is required';
    } else if (step === 2) {
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.country) newErrors.country = 'Country is required';
    } else if (step === 3) {
      if (!formData.citizenshipNumber) newErrors.citizenshipNumber = 'Citizenship number is required';
      if (!formData.citizenshipIssuedDistrict) newErrors.citizenshipIssuedDistrict = 'Issued district is required';
      if (!formData.licenseDocument) newErrors.licenseDocument = 'License document is required';
      if (!formData.degreeDocument) newErrors.degreeDocument = 'Degree document is required';
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

  const handleSpecializationChange = (event: any, newValue: string[]) => {
    setFormData(prev => ({ ...prev, specialization: newValue }));
    if (errors.specialization) setErrors(prev => ({ ...prev, specialization: '' }));
  };

  const handleDaysChange = (event: any, newValue: string[]) => {
    setFormData(prev => ({ ...prev, availableDays: newValue }));
  };

  const handlePaymentMethodsChange = (event: any, newValue: string[]) => {
    setFormData(prev => ({ ...prev, paymentMethods: newValue }));
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
          // Create FormData for file uploads
          const formDataToSend = new FormData();
          
          // Append all form fields
          formDataToSend.append('fullName', formData.fullName);
          formDataToSend.append('email', formData.email);
          formDataToSend.append('password', formData.password);
          formDataToSend.append('phone', formData.phone);
          formDataToSend.append('gender', formData.gender);
          formDataToSend.append('dateOfBirth', formData.dateOfBirth);
          formDataToSend.append('licenseNumber', formData.licenseNumber);
          formData.specialization.forEach(spec => formDataToSend.append('specialization', spec));
          formDataToSend.append('yearsOfExperience', formData.yearsOfExperience);
          formDataToSend.append('hospital', formData.hospital);
          formDataToSend.append('qualifications', formData.qualifications);
          formData.availableDays.forEach(day => formDataToSend.append('availableDays', day));
          formDataToSend.append('consultationFee', formData.consultationFee);
          formData.paymentMethods.forEach(method => formDataToSend.append('paymentMethods', method));
          formDataToSend.append('address', formData.address);
          formDataToSend.append('city', formData.city);
          formDataToSend.append('country', formData.country);
          formDataToSend.append('postalCode', formData.postalCode);
          formDataToSend.append('citizenshipNumber', formData.citizenshipNumber);
          formDataToSend.append('citizenshipIssuedDistrict', formData.citizenshipIssuedDistrict);
          
          // Append files if they exist
          if (formData.licenseDocument) {
            formDataToSend.append('licenseDocument', formData.licenseDocument);
          }
          if (formData.degreeDocument) {
            formDataToSend.append('degreeDocument', formData.degreeDocument);
          }
          if (formData.citizenshipDocument) {
            formDataToSend.append('citizenshipDocument', formData.citizenshipDocument);
          }
          if (formData.profilePhoto) {
            formDataToSend.append('profilePhoto', formData.profilePhoto);
          }

          const response = await fetch('http://localhost:5000/api/doctors/register', {
            method: 'POST',
            body: formDataToSend,
            // Don't set Content-Type header when using FormData, the browser will set it automatically
          });

          const responseData = await response.json();

          if (!response.ok) {
            throw new Error(responseData.message || 'Registration failed');
          }

          setSnackbar({
            open: true,
            message: 'Doctor registration submitted for verification!',
            severity: 'success'
          });
          
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
    'Professional Details',
    'Practice Location',
    'Document Verification'
  ];

  // Enhanced medical-themed MUI theme
  const muiTheme = createTheme({
    palette: {
      primary: {
        main: "#2A7F62",
        light: "#E8F5E9",
        dark: "#1B5E20"
      },
      secondary: {
        main: "#3A5E6D",
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
              Doctor Registration
            </Typography>
            <Typography variant="subtitle1" className="text-gray-500 text-center mt-2">
              Complete your profile to join our network of healthcare professionals
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
                    </div>
                  </Box>
                )}

                {/* Step 2: Professional Information */}
                {activeStep === 1 && (
                  <Box className="space-y-4">
                    <Typography variant="h6" className="font-semibold text-gray-700 flex items-center">
                      <BriefcaseMedical className="mr-2 h-5 w-5 text-primary" />
                      Professional Information
                    </Typography>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextField
                        fullWidth
                        name="licenseNumber"
                        label="Medical License Number"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        error={!!errors.licenseNumber}
                        helperText={errors.licenseNumber}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgePlus className="text-gray-400" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <FormControl fullWidth error={!!errors.specialization}>
                        <Autocomplete
                          multiple
                          options={specializations}
                          value={formData.specialization}
                          onChange={handleSpecializationChange}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Specializations"
                              placeholder="Select your specialties"
                              error={!!errors.specialization}
                              helperText={errors.specialization}
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Stethoscope className="text-gray-400" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                {...getTagProps({ index })}
                                label={option}
                                sx={{
                                  borderRadius: '8px',
                                  backgroundColor: '#E8F5E9',
                                  color: '#1B5E20',
                                  fontWeight: 500,
                                  marginRight: '6px',
                                  '& .MuiChip-deleteIcon': {
                                    color: '#2A7F62'
                                  }
                                }}
                              />
                            ))
                          }
                        />
                      </FormControl>

                      <TextField
                        fullWidth
                        name="yearsOfExperience"
                        label="Years of Experience"
                        type="number"
                        value={formData.yearsOfExperience}
                        onChange={handleChange}
                        error={!!errors.yearsOfExperience}
                        helperText={errors.yearsOfExperience}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Calendar className="text-gray-400" />
                            </InputAdornment>
                          ),
                          inputProps: { min: 0, max: 50 }
                        }}
                      />

                      <TextField
                        fullWidth
                        name="hospital"
                        label="Hospital/Clinic Name"
                        value={formData.hospital}
                        onChange={handleChange}
                        error={!!errors.hospital}
                        helperText={errors.hospital}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Hospital className="text-gray-400" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        name="qualifications"
                        label="Qualifications (MD, MBBS, etc.)"
                        value={formData.qualifications}
                        onChange={handleChange}
                        error={!!errors.qualifications}
                        helperText={errors.qualifications}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <GraduationCap className="text-gray-400" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        name="consultationFee"
                        label="Consultation Fee (NPR)"
                        type="number"
                        value={formData.consultationFee}
                        onChange={handleChange}
                        error={!!errors.consultationFee}
                        helperText={errors.consultationFee}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Banknote className="text-gray-400" />
                            </InputAdornment>
                          ),
                          inputProps: { min: 0 }
                        }}
                      />

                      <FormControl fullWidth>
                        <Autocomplete
                          multiple
                          options={availableDays}
                          value={formData.availableDays}
                          onChange={handleDaysChange}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Available Days"
                              placeholder="Select available days"
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Calendar className="text-gray-400" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                {...getTagProps({ index })}
                                label={option}
                                sx={{
                                  borderRadius: '8px',
                                  backgroundColor: '#E3F2FD',
                                  color: '#1565C0',
                                  fontWeight: 500,
                                  marginRight: '6px',
                                  '& .MuiChip-deleteIcon': {
                                    color: '#1976D2'
                                  }
                                }}
                              />
                            ))
                          }
                        />
                      </FormControl>

                      <FormControl fullWidth>
                        <Autocomplete
                          multiple
                          options={paymentMethods}
                          value={formData.paymentMethods}
                          onChange={handlePaymentMethodsChange}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Accepted Payment Methods"
                              placeholder="Select payment methods"
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <CreditCard className="text-gray-400" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                {...getTagProps({ index })}
                                label={option}
                                sx={{
                                  borderRadius: '8px',
                                  backgroundColor: '#E8F5E9',
                                  color: '#2E7D32',
                                  fontWeight: 500,
                                  marginRight: '6px',
                                  '& .MuiChip-deleteIcon': {
                                    color: '#388E3C'
                                  }
                                }}
                              />
                            ))
                          }
                        />
                      </FormControl>
                    </div>
                  </Box>
                )}

                {/* Step 3: Address Information */}
                {activeStep === 2 && (
                  <Box className="space-y-4">
                    <Typography variant="h6" className="font-semibold text-gray-700 flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-primary" />
                      Practice Location
                    </Typography>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextField
                        fullWidth
                        name="address"
                        label="Practice Address"
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
                        <Autocomplete
                          options={countriesList}
                          value={formData.country}
                          onChange={(event, newValue) => {
                            setFormData(prev => ({ ...prev, country: newValue || '' }));
                            if (errors.country) setErrors(prev => ({ ...prev, country: '' }));
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Country"
                              error={!!errors.country}
                              helperText={errors.country}
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <MapPin className="text-gray-400" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
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
                              <FileDigit className="text-gray-400" />
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
                      <FileSearch className="mr-2 h-5 w-5 text-primary" />
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FileUploadField
                        label="Medical License"
                        value={formData.licenseDocument}
                        onChange={handleFileChange('licenseDocument')}
                        error={!!errors.licenseDocument}
                        helperText={errors.licenseDocument}
                        icon={FileText}
                      />

                      <FileUploadField
                        label="Medical Degree"
                        value={formData.degreeDocument}
                        onChange={handleFileChange('degreeDocument')}
                        error={!!errors.degreeDocument}
                        helperText={errors.degreeDocument}
                        icon={GraduationCap}
                      />

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
                    </div>

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
            success: <Stethoscope className="h-6 w-6" />,
            error: <Stethoscope className="h-6 w-6" />
          }}
        >
          <Typography fontWeight={500}>{snackbar.message}</Typography>
        </Alert>
      </Snackbar>
    </MuiThemeProvider>
  );
}