"use client";
import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Dialog,
  DialogContent,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { User, Phone, Mail, Calendar, MapPin, Heart, Activity, FileText, Edit, Download, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  maxWidth: 1000,
  margin: 'auto',
}));

const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
    <Icon className="h-5 w-5" style={{ color: '#2A7F62', marginRight: '12px', marginTop: '2px' }} />
    <Box>
      <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.875rem' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ color: '#2D3748', fontWeight: 500 }}>
        {value || 'Not provided'}
      </Typography>
    </Box>
  </Box>
);

const ProfileView = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [role, setRole] = useState<string | null>(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const handleGenerateCard = () => {
    if (!userData.profilePhoto) {
      setSnackbarMessage('Please upload a profile photo to generate your digital card. You can add it by editing your profile.');
      setSnackbarOpen(true);
      return;
    }
    setCardOpen(true);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('role');
        setRole(userRole);
        
        if (!token) {
          setError('Please login to view your profile');
          setLoading(false);
          return;
        }

        const endpoint = userRole === 'doctor' 
          ? 'http://localhost:5000/api/doctors/profile'
          : 'http://localhost:5000/api/patients/profile';

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (data.success) {
          setUserData(data.user);
        } else {
          setError(data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('Unable to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `medipal-health-card-${userData.fullName?.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error generating card:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#2A7F62' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!userData) return null;

  return (
    <Box sx={{ 
      backgroundColor: '#F5F9F8', 
      minHeight: '100vh', 
      py: 5,
    }}>
      <StyledPaper>
        {/* Header with Avatar and Basic Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            src={userData.profilePhoto}
            sx={{
              width: 120,
              height: 120,
              bgcolor: '#2A7F62',
              fontSize: '2.5rem',
              mr: 3
            }}
          >
            {userData.fullName?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ color: '#2D3748', fontWeight: 'bold', mb: 1 }}>
              {userData.fullName}
            </Typography>
            <Chip 
              label={role === 'doctor' ? 'Doctor' : 'Patient'} 
              sx={{ 
                backgroundColor: '#E8F5E9', 
                color: '#2A7F62',
                fontWeight: 600,
                mb: 1
              }} 
            />
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              Member since {new Date(userData.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {role === 'patient' && (
              <Button
                onClick={handleGenerateCard}
                variant="contained"
                startIcon={<CreditCard className="h-4 w-4" />}
                sx={{
                  bgcolor: '#2A7F62',
                  '&:hover': {
                    bgcolor: '#1E6D54'
                  }
                }}
              >
                Generate Digital Card
              </Button>
            )}
            <Button
              component={Link}
              href="/profile-account/edit"
              variant="outlined"
              startIcon={<Edit className="h-4 w-4" />}
              sx={{
                color: '#2A7F62',
                borderColor: '#2A7F62',
                '&:hover': {
                  borderColor: '#1E6D54',
                  backgroundColor: '#E8F5E9'
                }
              }}
            >
              Edit Profile
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Personal Information */}
        <Typography variant="h6" sx={{ color: '#2D3748', fontWeight: 'bold', mb: 3 }}>
          Personal Information
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <InfoItem icon={Mail} label="Email" value={userData.email} />
          <InfoItem icon={Phone} label="Phone" value={userData.phone} />
          <InfoItem icon={User} label="Gender" value={userData.gender} />
          <InfoItem 
            icon={Calendar} 
            label="Date of Birth" 
            value={userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : 'Not provided'} 
          />
          <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
            <InfoItem 
              icon={MapPin} 
              label="Address" 
              value={`${userData.address || ''}, ${userData.city || ''}, ${userData.country || ''}`} 
            />
          </Box>
        </Box>

        {role === 'patient' && (
          <>
            <Divider sx={{ my: 4 }} />

            {/* Medical Information */}
            <Typography variant="h6" sx={{ color: '#2D3748', fontWeight: 'bold', mb: 3 }}>
              Medical Information
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <InfoItem icon={Activity} label="Blood Group" value={userData.bloodGroup} />
              <InfoItem icon={Heart} label="Height / Weight" value={`${userData.height || 'N/A'} cm / ${userData.weight || 'N/A'} kg`} />
              {userData.allergies && userData.allergies.length > 0 && (
                <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Heart className="h-5 w-5" style={{ color: '#2A7F62', marginRight: '12px', marginTop: '2px' }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.875rem', mb: 1 }}>
                        Allergies
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {userData.allergies.map((allergy: string, index: number) => (
                          <Chip 
                            key={index} 
                            label={allergy} 
                            size="small"
                            sx={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
              {userData.medications && userData.medications.length > 0 && (
                <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <FileText className="h-5 w-5" style={{ color: '#2A7F62', marginRight: '12px', marginTop: '2px' }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.875rem', mb: 1 }}>
                        Current Medications
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {userData.medications.map((med: string, index: number) => (
                          <Chip 
                            key={index} 
                            label={med} 
                            size="small"
                            sx={{ backgroundColor: '#E0F2FE', color: '#0369A1' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Emergency Contact */}
            <Typography variant="h6" sx={{ color: '#2D3748', fontWeight: 'bold', mb: 3 }}>
              Emergency Contact
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <InfoItem icon={User} label="Name" value={userData.emergencyContact?.name} />
              <InfoItem icon={Phone} label="Phone" value={userData.emergencyContact?.phone} />
              <InfoItem icon={Heart} label="Relation" value={userData.emergencyContact?.relation} />
            </Box>
          </>
        )}

        {role === 'doctor' && (
          <>
            <Divider sx={{ my: 4 }} />

            {/* Professional Information */}
            <Typography variant="h6" sx={{ color: '#2D3748', fontWeight: 'bold', mb: 3 }}>
              Professional Information
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <InfoItem icon={FileText} label="License Number" value={userData.licenseNumber} />
              <InfoItem icon={Activity} label="Years of Experience" value={userData.yearsOfExperience} />
              <InfoItem icon={MapPin} label="Hospital" value={userData.hospital} />
              <InfoItem icon={User} label="Consultation Fee" value={`$${userData.consultationFee || 'N/A'}`} />
              {userData.specialization && userData.specialization.length > 0 && (
                <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Heart className="h-5 w-5" style={{ color: '#2A7F62', marginRight: '12px', marginTop: '2px' }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.875rem', mb: 1 }}>
                        Specializations
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {userData.specialization.map((spec: string, index: number) => (
                          <Chip 
                            key={index} 
                            label={spec} 
                            size="small"
                            sx={{ backgroundColor: '#E8F5E9', color: '#2A7F62' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </>
        )}
      </StyledPaper>

      {/* Digital Health Card Dialog */}
      {role === 'patient' && (
        <Dialog
          open={cardOpen}
          onClose={() => setCardOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ 
            style: { 
              borderRadius: '16px', 
              overflow: 'visible',
              backgroundColor: 'transparent',
              boxShadow: 'none'
            } 
          }}
        >
          <DialogContent sx={{ p: 0, backgroundColor: 'transparent' }}>
            <Box sx={{ position: 'relative' }}>
              {/* Card Container */}
              <Box
                ref={cardRef}
                sx={{
                  width: '100%',
                  maxWidth: 800,
                  aspectRatio: '16/9',
                  background: 'linear-gradient(135deg, #f0f9f4 0%, #e8f5f0 100%)',
                  borderRadius: '24px',
                  p: 4,
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                }}
              >
                {/* Decorative crosses background */}
                <Box sx={{ position: 'absolute', top: 20, left: 20, opacity: 0.15 }}>
                  <Box sx={{ width: 40, height: 40, bgcolor: '#c5dbc7', borderRadius: 1 }} />
                </Box>
                <Box sx={{ position: 'absolute', top: 40, left: 80, opacity: 0.1 }}>
                  <Box sx={{ width: 30, height: 30, bgcolor: '#8ec3b0', borderRadius: 1 }} />
                </Box>
                <Box sx={{ position: 'absolute', top: 20, right: 20, opacity: 0.15 }}>
                  <Box sx={{ width: 45, height: 45, bgcolor: '#8ec3b0', borderRadius: 1 }} />
                </Box>
                <Box sx={{ position: 'absolute', top: 60, right: 80, opacity: 0.1 }}>
                  <Box sx={{ width: 35, height: 35, bgcolor: '#c5dbc7', borderRadius: 1 }} />
                </Box>

                {/* Logo */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <img 
                    src="/images/logo.png" 
                    alt="MediPal Logo"
                    style={{ height: '60px', objectFit: 'contain' }}
                  />
                </Box>

                {/* Main Content */}
                <Box sx={{ display: 'flex', gap: 3, mt: 3 }}>
                  {/* Left: Photo placeholder */}
                  <Box
                    sx={{
                      width: 200,
                      height: 240,
                      bgcolor: '#2f7d6d',
                      borderRadius: 2,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {userData.profilePhoto ? (
                      <img 
                        src={userData.profilePhoto} 
                        alt="Profile"
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    ) : (
                      <Typography sx={{ color: 'white', fontSize: '4rem' }}>
                        {userData.fullName?.charAt(0).toUpperCase()}
                      </Typography>
                    )}
                  </Box>

                  {/* Middle: Patient Info */}
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1.5 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#1a1a1a' }}>
                        PATIENT'S NAME
                      </Typography>
                      <Typography sx={{ fontSize: '1.1rem', color: '#2f7d6d', fontWeight: 600 }}>
                        : {userData.fullName?.toUpperCase() || 'N/A'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#1a1a1a' }}>
                        PATIENT ID
                      </Typography>
                      <Typography sx={{ fontSize: '1.1rem', color: '#2f7d6d', fontWeight: 600 }}>
                        : {userData.id || userData.phone || 'N/A'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#1a1a1a' }}>
                        D.O.B
                      </Typography>
                      <Typography sx={{ fontSize: '1.1rem', color: '#2f7d6d', fontWeight: 600 }}>
                        : {userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString('en-GB', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        }).split('/').reverse().join('/') : 'N/A'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#1a1a1a' }}>
                        BLOOD GROUP
                      </Typography>
                      <Typography sx={{ fontSize: '1.1rem', color: '#2f7d6d', fontWeight: 600 }}>
                        : {userData.bloodGroup || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Right: QR Code */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ bgcolor: 'white', p: 1.5, borderRadius: 2, boxShadow: 1 }}>
                      <QRCodeSVG
                        value={JSON.stringify({
                          id: userData.id || userData.phone,
                          name: userData.fullName,
                          dob: userData.dateOfBirth,
                          bloodGroup: userData.bloodGroup,
                          emergencyContact: userData.emergencyContact?.phone,
                          issuer: "MediPal Healthcare"
                        })}
                        size={140}
                        level="H"
                        fgColor="#2f7d6d"
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Download Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                <Button
                  onClick={handleDownloadCard}
                  variant="contained"
                  startIcon={downloading ? <CircularProgress size={16} color="inherit" /> : <Download className="h-4 w-4" />}
                  disabled={downloading}
                  sx={{
                    bgcolor: '#2A7F62',
                    '&:hover': { bgcolor: '#1E6D54' },
                    px: 4,
                    py: 1.5
                  }}
                >
                  {downloading ? 'Generating...' : 'Download Card'}
                </Button>
                <Button
                  onClick={() => setCardOpen(false)}
                  variant="outlined"
                  sx={{
                    color: '#2A7F62',
                    borderColor: '#2A7F62',
                    '&:hover': {
                      borderColor: '#1E6D54',
                      backgroundColor: '#E8F5E9'
                    },
                    px: 4,
                    py: 1.5
                  }}
                >
                  Close
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}

      {/* Snackbar for validation messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="warning"
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfileView;

