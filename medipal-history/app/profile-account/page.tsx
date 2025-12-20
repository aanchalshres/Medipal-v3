"use client";
import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  maxWidth: 800,
  margin: 'auto',
}));

const ProfileEdit = () => {
  return (
    <Box sx={{ 
      backgroundColor: '#F5F9F8', 
      minHeight: '100vh', 
      py: 5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <StyledPaper>
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#2D3748', 
            mb: 4,
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          Edit Your Medical Profile
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          <TextField
            label="First Name"
            fullWidth
            defaultValue="Mehrab"
            InputLabelProps={{ style: { color: '#2D3748' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#E2E8F0',
                },
                '&:hover fieldset': {
                  borderColor: '#2A7F62',
                },
              }
            }}
          />
          <TextField
            label="Last Name"
            fullWidth
            defaultValue="Bozorgi"
            InputLabelProps={{ style: { color: '#2D3748' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#E2E8F0',
                },
                '&:hover fieldset': {
                  borderColor: '#2A7F62',
                },
              }
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            defaultValue="Mehrabbozorgi.business@gmail.com"
            InputLabelProps={{ style: { color: '#2D3748' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#E2E8F0',
                },
                '&:hover fieldset': {
                  borderColor: '#2A7F62',
                },
              }
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            label="Medical ID Number"
            fullWidth
            placeholder="Enter your hospital/insurance ID"
            InputLabelProps={{ style: { color: '#2D3748' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#E2E8F0',
                },
                '&:hover fieldset': {
                  borderColor: '#2A7F62',
                },
              }
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            label="Contact Number"
            fullWidth
            defaultValue="+1 (580) 777-7999"
            InputLabelProps={{ style: { color: '#2D3748' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#E2E8F0',
                },
                '&:hover fieldset': {
                  borderColor: '#2A7F62',
                },
              }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          <TextField
            label="Blood Type"
            fullWidth
            select
            defaultValue="A+"
            InputLabelProps={{ style: { color: '#2D3748' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#E2E8F0',
                },
                '&:hover fieldset': {
                  borderColor: '#2A7F62',
                },
              }
            }}
          >
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Primary Care Physician"
            fullWidth
            InputLabelProps={{ style: { color: '#2D3748' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#E2E8F0',
                },
                '&:hover fieldset': {
                  borderColor: '#2A7F62',
                },
              }
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            label="Medical Conditions"
            fullWidth
            multiline
            rows={3}
            placeholder="List any chronic conditions or allergies"
            InputLabelProps={{ style: { color: '#2D3748' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#E2E8F0',
                },
                '&:hover fieldset': {
                  borderColor: '#2A7F62',
                },
              }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button 
            variant="outlined" 
            sx={{ 
              color: '#2A7F62', 
              borderColor: '#2A7F62',
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              '&:hover': {
                borderColor: '#1E6D54',
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            sx={{ 
              backgroundColor: '#2A7F62', 
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              '&:hover': { 
                backgroundColor: '#1E6D54' 
              } 
            }}
          >
            Save Medical Profile
          </Button>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default ProfileEdit;