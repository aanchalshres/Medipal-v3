"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Typography, TextField, MenuItem, Button, CircularProgress, Alert, Avatar, IconButton, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { Camera, ArrowLeft } from 'lucide-react';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  maxWidth: 1000,
  margin: 'auto',
}));

type PatientForm = {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  bloodGroup?: string;
  height?: string;
  weight?: string;
  allergies?: string;
  medications?: string;
  chronicConditions?: string;
  emergencyContact?: { name?: string; phone?: string; relation?: string };
};

type DoctorForm = {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  specialization?: string;
  yearsOfExperience?: string;
  hospital?: string;
  qualifications?: string;
  availableDays?: string;
  consultationFee?: string;
  paymentMethods?: string;
};

const EditProfilePage = () => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [patientForm, setPatientForm] = useState<PatientForm | null>(null);
  const [doctorForm, setDoctorForm] = useState<DoctorForm | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('role');
        setRole(userRole);
        if (!token || !userRole) {
          setError('Please login to edit your profile');
          setLoading(false);
          return;
        }
        const endpoint = userRole === 'doctor' 
          ? 'http://localhost:5000/api/doctors/profile'
          : 'http://localhost:5000/api/patients/profile';

        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed to load');

        setProfilePhoto(data.user.profilePhoto || '');

        if (userRole === 'doctor') {
          const u = data.user;
          setDoctorForm({
            fullName: u.fullName || '',
            email: u.email || '',
            phone: u.phone || '',
            gender: u.gender || '',
            dateOfBirth: u.dateOfBirth ? new Date(u.dateOfBirth).toISOString().substring(0,10) : '',
            address: u.address || '',
            city: u.city || '',
            country: u.country || '',
            postalCode: u.postalCode || '',
            specialization: Array.isArray(u.specialization) ? u.specialization.join(', ') : (u.specialization || ''),
            yearsOfExperience: u.yearsOfExperience?.toString() || '',
            hospital: u.hospital || '',
            qualifications: u.qualifications || '',
            availableDays: Array.isArray(u.availableDays) ? u.availableDays.join(', ') : (u.availableDays || ''),
            consultationFee: u.consultationFee?.toString() || '',
            paymentMethods: Array.isArray(u.paymentMethods) ? u.paymentMethods.join(', ') : (u.paymentMethods || ''),
          });
        } else {
          const u = data.user;
          setPatientForm({
            fullName: u.fullName || '',
            email: u.email || '',
            phone: u.phone || '',
            gender: u.gender || '',
            dateOfBirth: u.dateOfBirth ? new Date(u.dateOfBirth).toISOString().substring(0,10) : '',
            address: u.address || '',
            city: u.city || '',
            country: u.country || '',
            postalCode: u.postalCode || '',
            bloodGroup: u.bloodGroup || '',
            height: u.height?.toString() || '',
            weight: u.weight?.toString() || '',
            allergies: Array.isArray(u.allergies) ? u.allergies.join(', ') : (u.allergies || ''),
            medications: Array.isArray(u.medications) ? u.medications.join(', ') : (u.medications || ''),
            chronicConditions: Array.isArray(u.chronicConditions) ? u.chronicConditions.join(', ') : (u.chronicConditions || ''),
            emergencyContact: {
              name: u.emergencyContact?.name || '',
              phone: u.emergencyContact?.phone || '',
              relation: u.emergencyContact?.relation || '',
            }
          });
        }
      } catch (e:any) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSave = async () => {
    try {
      setSaving(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token || !role) throw new Error('Not authenticated');

      const isDoctor = role === 'doctor';
      const endpoint = isDoctor ? 'http://localhost:5000/api/doctors/profile' : 'http://localhost:5000/api/patients/profile';
      
      const formData = new FormData();
      const body = isDoctor ? doctorForm : patientForm;
      if (!body) return;

      // Add all fields to formData
      Object.entries(body).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Add profile photo if changed
      if (photoFile) {
        formData.append('profilePhoto', photoFile);
      }

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to save');
      router.push('/profile-account');
    } catch (e:any) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
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

  const isDoctor = role === 'doctor';

  return (
    <Box sx={{ backgroundColor: '#F5F9F8', minHeight: '100vh', py: 5 }}>
      <StyledPaper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => router.push('/profile-account')} sx={{ color: '#2A7F62' }}>
              <ArrowLeft />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2D3748' }}>
              Edit Profile
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Profile Photo */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 3 }}>
          <Avatar
            src={profilePhoto}
            sx={{
              width: 100,
              height: 100,
              bgcolor: '#2A7F62',
              fontSize: '2rem'
            }}
          >
            {(isDoctor ? doctorForm?.fullName : patientForm?.fullName)?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ color: '#2D3748', mb: 1 }}>
              Profile Photo
            </Typography>
            <Button
              component="label"
              variant="outlined"
              startIcon={<Camera style={{ width: 16, height: 16 }} />}
              sx={{
                color: '#2A7F62',
                borderColor: '#2A7F62',
                '&:hover': {
                  borderColor: '#1E6D54',
                  backgroundColor: '#E8F5E9'
                }
              }}
            >
              Upload Photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </Button>
            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#64748B' }}>
              JPG, PNG or GIF. Max size 5MB
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <Box>
            <TextField fullWidth label="Full Name" value={(isDoctor ? doctorForm?.fullName : patientForm?.fullName) || ''}
              onChange={(e) => isDoctor ? setDoctorForm({ ...(doctorForm as DoctorForm), fullName: e.target.value }) : setPatientForm({ ...(patientForm as PatientForm), fullName: e.target.value })}
            />
          </Box>
          <Box>
            <TextField fullWidth label="Email" type="email" value={(isDoctor ? doctorForm?.email : patientForm?.email) || ''}
              onChange={(e) => isDoctor ? setDoctorForm({ ...(doctorForm as DoctorForm), email: e.target.value }) : setPatientForm({ ...(patientForm as PatientForm), email: e.target.value })}
            />
          </Box>
          <Box>
            <TextField fullWidth label="Phone" value={(isDoctor ? doctorForm?.phone : patientForm?.phone) || ''}
              onChange={(e) => isDoctor ? setDoctorForm({ ...(doctorForm as DoctorForm), phone: e.target.value }) : setPatientForm({ ...(patientForm as PatientForm), phone: e.target.value })}
            />
          </Box>
          <Box>
            <TextField select fullWidth label="Gender" value={(isDoctor ? doctorForm?.gender : patientForm?.gender) || ''}
              onChange={(e) => isDoctor ? setDoctorForm({ ...(doctorForm as DoctorForm), gender: e.target.value }) : setPatientForm({ ...(patientForm as PatientForm), gender: e.target.value })}
            >
              {['Male','Female','Other','Prefer not to say'].map(g => (
                <MenuItem key={g} value={g}>{g}</MenuItem>
              ))}
            </TextField>
          </Box>
          <Box>
            <TextField fullWidth label="Date of Birth" type="date" InputLabelProps={{ shrink: true }}
              value={(isDoctor ? doctorForm?.dateOfBirth : patientForm?.dateOfBirth) || ''}
              onChange={(e) => isDoctor ? setDoctorForm({ ...(doctorForm as DoctorForm), dateOfBirth: e.target.value }) : setPatientForm({ ...(patientForm as PatientForm), dateOfBirth: e.target.value })}
            />
          </Box>
          <Box>
            <TextField fullWidth label="Address" value={(isDoctor ? doctorForm?.address : patientForm?.address) || ''}
              onChange={(e) => isDoctor ? setDoctorForm({ ...(doctorForm as DoctorForm), address: e.target.value }) : setPatientForm({ ...(patientForm as PatientForm), address: e.target.value })}
            />
          </Box>
          <Box>
            <TextField fullWidth label="City" value={(isDoctor ? doctorForm?.city : patientForm?.city) || ''}
              onChange={(e) => isDoctor ? setDoctorForm({ ...(doctorForm as DoctorForm), city: e.target.value }) : setPatientForm({ ...(patientForm as PatientForm), city: e.target.value })}
            />
          </Box>
          <Box>
            <TextField fullWidth label="Country" value={(isDoctor ? doctorForm?.country : patientForm?.country) || ''}
              onChange={(e) => isDoctor ? setDoctorForm({ ...(doctorForm as DoctorForm), country: e.target.value }) : setPatientForm({ ...(patientForm as PatientForm), country: e.target.value })}
            />
          </Box>
          <Box>
            <TextField fullWidth label="Postal Code" value={(isDoctor ? doctorForm?.postalCode : patientForm?.postalCode) || ''}
              onChange={(e) => isDoctor ? setDoctorForm({ ...(doctorForm as DoctorForm), postalCode: e.target.value }) : setPatientForm({ ...(patientForm as PatientForm), postalCode: e.target.value })}
            />
          </Box>

          {!isDoctor && (
            <>
              <Box>
                <TextField fullWidth label="Blood Group" value={patientForm?.bloodGroup || ''}
                  onChange={(e) => setPatientForm({ ...(patientForm as PatientForm), bloodGroup: e.target.value })}
                />
              </Box>
              <Box>
                <TextField fullWidth label="Height (cm)" value={patientForm?.height || ''}
                  onChange={(e) => setPatientForm({ ...(patientForm as PatientForm), height: e.target.value })}
                />
              </Box>
              <Box>
                <TextField fullWidth label="Weight (kg)" value={patientForm?.weight || ''}
                  onChange={(e) => setPatientForm({ ...(patientForm as PatientForm), weight: e.target.value })}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                <TextField fullWidth multiline minRows={2} label="Allergies (comma separated)" value={patientForm?.allergies || ''}
                  onChange={(e) => setPatientForm({ ...(patientForm as PatientForm), allergies: e.target.value })}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                <TextField fullWidth multiline minRows={2} label="Medications (comma separated)" value={patientForm?.medications || ''}
                  onChange={(e) => setPatientForm({ ...(patientForm as PatientForm), medications: e.target.value })}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                <TextField fullWidth multiline minRows={2} label="Chronic Conditions (comma separated)" value={patientForm?.chronicConditions || ''}
                  onChange={(e) => setPatientForm({ ...(patientForm as PatientForm), chronicConditions: e.target.value })}
                />
              </Box>
              <Box>
                <TextField fullWidth label="Emergency Name" value={patientForm?.emergencyContact?.name || ''}
                  onChange={(e) => setPatientForm({ ...(patientForm as PatientForm), emergencyContact: { ...(patientForm?.emergencyContact || {}), name: e.target.value } })}
                />
              </Box>
              <Box>
                <TextField fullWidth label="Emergency Phone" value={patientForm?.emergencyContact?.phone || ''}
                  onChange={(e) => setPatientForm({ ...(patientForm as PatientForm), emergencyContact: { ...(patientForm?.emergencyContact || {}), phone: e.target.value } })}
                />
              </Box>
              <Box>
                <TextField fullWidth label="Emergency Relation" value={patientForm?.emergencyContact?.relation || ''}
                  onChange={(e) => setPatientForm({ ...(patientForm as PatientForm), emergencyContact: { ...(patientForm?.emergencyContact || {}), relation: e.target.value } })}
                />
              </Box>
            </>
          )}

          {isDoctor && (
            <>
              <Box>
                <TextField fullWidth label="Specializations (comma separated)" value={doctorForm?.specialization || ''}
                  onChange={(e) => setDoctorForm({ ...(doctorForm as DoctorForm), specialization: e.target.value })}
                />
              </Box>
              <Box>
                <TextField fullWidth label="Experience (years)" value={doctorForm?.yearsOfExperience || ''}
                  onChange={(e) => setDoctorForm({ ...(doctorForm as DoctorForm), yearsOfExperience: e.target.value })}
                />
              </Box>
              <Box>
                <TextField fullWidth label="Consultation Fee" value={doctorForm?.consultationFee || ''}
                  onChange={(e) => setDoctorForm({ ...(doctorForm as DoctorForm), consultationFee: e.target.value })}
                />
              </Box>
              <Box>
                <TextField fullWidth label="Hospital" value={doctorForm?.hospital || ''}
                  onChange={(e) => setDoctorForm({ ...(doctorForm as DoctorForm), hospital: e.target.value })}
                />
              </Box>
              <Box>
                <TextField fullWidth label="Qualifications" value={doctorForm?.qualifications || ''}
                  onChange={(e) => setDoctorForm({ ...(doctorForm as DoctorForm), qualifications: e.target.value })}
                />
              </Box>
              <Box>
                <TextField fullWidth label="Available Days (comma separated)" value={doctorForm?.availableDays || ''}
                  onChange={(e) => setDoctorForm({ ...(doctorForm as DoctorForm), availableDays: e.target.value })}
                />
              </Box>
              <Box>
                <TextField fullWidth label="Payment Methods (comma separated)" value={doctorForm?.paymentMethods || ''}
                  onChange={(e) => setDoctorForm({ ...(doctorForm as DoctorForm), paymentMethods: e.target.value })}
                />
              </Box>
            </>
          )}

          <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' }, display: 'flex', gap: 2, mt: 1 }}>
            <Button variant="outlined" onClick={() => router.push('/profile-account')} sx={{ color: '#2A7F62', borderColor: '#2A7F62' }}>Cancel</Button>
            <Button variant="contained" onClick={onSave} disabled={saving} sx={{ bgcolor: '#2A7F62', '&:hover': { bgcolor: '#1E6D54' } }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default EditProfilePage;
