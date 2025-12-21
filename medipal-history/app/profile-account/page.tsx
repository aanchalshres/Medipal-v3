"use client";
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { User, Phone, Mail, Calendar, MapPin, Heart, Activity, FileText, Edit } from 'lucide-react';
import Link from 'next/link';

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
    </Box>
  );
};

export default ProfileView;

