"use client";
import { useState, useEffect } from "react";
import { 
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Divider
} from "@mui/material";
import {
  Visibility,
  Search,
  LocalHospital,
  Person,
  CalendarToday,
  Description,
  Assignment
} from "@mui/icons-material";
import { format } from "date-fns";

interface Consultation {
  id: string;
  date: string;
  hospitalName: string;
  doctorName: string;
  doctorSpecialization: string;
  chiefComplaint: string;
  diagnosis: string;
  prescription: string[];
  notes: string;
  status: 'Completed' | 'Follow-up Required';
}

export default function MedicalHistoryPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState("");

  // Fetch patient profile and consultations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch patient profile
        const profileResponse = await fetch('http://localhost:5000/api/patients/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profileData = await profileResponse.json();
        
        if (profileData?.success && profileData?.user?.fullName) {
          setPatientName(profileData.user.fullName);
        }

        // Sample consultations data (in production, fetch from backend)
        const sampleConsultations: Consultation[] = [
          {
            id: "1",
            date: "2024-12-15",
            hospitalName: "City General Hospital",
            doctorName: "Dr. Ramesh Sharma",
            doctorSpecialization: "Cardiologist",
            chiefComplaint: "Chest pain and shortness of breath",
            diagnosis: "Mild angina, requires lifestyle modification",
            prescription: [
              "Aspirin 75mg - Once daily after breakfast",
              "Atorvastatin 20mg - Once daily at bedtime",
              "Nitroglycerin spray - As needed for chest pain"
            ],
            notes: "Advised to follow low-fat diet, regular exercise. Follow-up in 2 weeks.",
            status: "Follow-up Required"
          },
          {
            id: "2",
            date: "2024-11-28",
            hospitalName: "Kathmandu Medical Center",
            doctorName: "Dr. Sita Thapa",
            doctorSpecialization: "General Physician",
            chiefComplaint: "High fever and body ache",
            diagnosis: "Viral fever with mild dehydration",
            prescription: [
              "Paracetamol 500mg - Three times daily after meals",
              "ORS solution - 200ml every 2 hours",
              "Complete bed rest for 3 days"
            ],
            notes: "Stay hydrated, avoid cold foods. Recovery expected in 5-7 days.",
            status: "Completed"
          },
          {
            id: "3",
            date: "2024-11-10",
            hospitalName: "Patan Hospital",
            doctorName: "Dr. Krishna Bhattarai",
            doctorSpecialization: "Orthopedic",
            chiefComplaint: "Knee pain and swelling",
            diagnosis: "Osteoarthritis - Grade 2",
            prescription: [
              "Ibuprofen 400mg - Twice daily after meals",
              "Calcium + Vitamin D3 - Once daily",
              "Hot compress - 15 minutes twice daily"
            ],
            notes: "Avoid climbing stairs. Physical therapy recommended.",
            status: "Completed"
          },
          {
            id: "4",
            date: "2024-10-22",
            hospitalName: "Manipal Teaching Hospital",
            doctorName: "Dr. Binod Kafle",
            doctorSpecialization: "ENT Specialist",
            chiefComplaint: "Throat pain and difficulty swallowing",
            diagnosis: "Acute tonsillitis",
            prescription: [
              "Amoxicillin 500mg - Three times daily for 7 days",
              "Betadine gargle - Three times daily",
              "Avoid spicy and cold foods"
            ],
            notes: "Complete the full course of antibiotics. Return if fever persists.",
            status: "Completed"
          },
          {
            id: "5",
            date: "2024-10-05",
            hospitalName: "Grande International Hospital",
            doctorName: "Dr. Anita Shrestha",
            doctorSpecialization: "Dermatologist",
            chiefComplaint: "Skin rash and itching",
            diagnosis: "Allergic dermatitis",
            prescription: [
              "Cetirizine 10mg - Once daily at night",
              "Hydrocortisone cream - Apply twice daily",
              "Avoid synthetic fabrics"
            ],
            notes: "Use cotton clothing. Avoid known allergens. Follow-up if rash persists.",
            status: "Completed"
          }
        ];

        setConsultations(sampleConsultations);
        setFilteredConsultations(sampleConsultations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter consultations based on search
  useEffect(() => {
    const filtered = consultations.filter(consultation =>
      consultation.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredConsultations(filtered);
  }, [searchTerm, consultations]);

  const handleViewDetails = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedConsultation(null);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <CircularProgress sx={{ color: '#2A7F62' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: '#F5F9F8', 
      minHeight: '100vh',
      py: 4,
      px: { xs: 2, md: 4 }
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          color: '#2D3748', 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 1
        }}>
          <Assignment sx={{ fontSize: 32, color: '#2A7F62' }} />
          Medical History
        </Typography>
        {patientName && (
          <Typography variant="body1" sx={{ color: '#64748B' }}>
            Patient: <strong>{patientName}</strong>
          </Typography>
        )}
        <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
          View your past consultations and treatment history
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3,
        mb: 4
      }}>
        <Card sx={{ 
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                bgcolor: '#E8F5E9', 
                p: 1.5, 
                borderRadius: 2,
                display: 'flex'
              }}>
                <Assignment sx={{ color: '#2A7F62', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2D3748' }}>
                  {consultations.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Total Consultations
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                bgcolor: '#E3F2FD', 
                p: 1.5, 
                borderRadius: 2,
                display: 'flex'
              }}>
                <LocalHospital sx={{ color: '#1976D2', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2D3748' }}>
                  {new Set(consultations.map(c => c.hospitalName)).size}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Hospitals Visited
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                bgcolor: '#FFF3E0', 
                p: 1.5, 
                borderRadius: 2,
                display: 'flex'
              }}>
                <Person sx={{ color: '#F57C00', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2D3748' }}>
                  {new Set(consultations.map(c => c.doctorName)).size}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Doctors Consulted
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by hospital, doctor, complaint, or diagnosis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#64748B' }} />
              </InputAdornment>
            )
          }}
          sx={{
            bgcolor: 'white',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#2A7F62'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#2A7F62'
              }
            }
          }}
        />
      </Box>

      {/* Consultations Table */}
      <Card sx={{ 
        bgcolor: 'white',
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 0 }}>
          {filteredConsultations.length === 0 ? (
            <Box sx={{ p: 8, textAlign: 'center' }}>
              <Assignment sx={{ fontSize: 64, color: '#E0E0E0', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#64748B', mb: 1 }}>
                No consultations found
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                {searchTerm ? 'Try a different search term' : 'Your consultation history will appear here'}
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F5F9F8' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Hospital</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Doctor</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Chief Complaint</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2D3748' }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredConsultations.map((consultation) => (
                    <TableRow 
                      key={consultation.id}
                      sx={{ 
                        '&:hover': { bgcolor: '#F5F9F8' },
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday sx={{ fontSize: 16, color: '#64748B' }} />
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#2D3748' }}>
                            {format(new Date(consultation.date), 'MMM dd, yyyy')}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocalHospital sx={{ fontSize: 16, color: '#1976D2' }} />
                          <Typography variant="body2" sx={{ color: '#2D3748' }}>
                            {consultation.hospitalName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#2D3748' }}>
                            {consultation.doctorName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748B' }}>
                            {consultation.doctorSpecialization}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ 
                          color: '#2D3748',
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {consultation.chiefComplaint}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={consultation.status}
                          size="small"
                          sx={{
                            bgcolor: consultation.status === 'Completed' ? '#E8F5E9' : '#FFF3E0',
                            color: consultation.status === 'Completed' ? '#2A7F62' : '#F57C00',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(consultation)}
                          sx={{ 
                            color: '#2A7F62',
                            '&:hover': { bgcolor: '#E8F5E9' }
                          }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Consultation Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: '#F5F9F8',
          color: '#2D3748',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Description sx={{ color: '#2A7F62' }} />
          Consultation Details
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedConsultation && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Basic Info */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
                p: 2,
                bgcolor: '#F5F9F8',
                borderRadius: 2
              }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Date</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {format(new Date(selectedConsultation.date), 'MMMM dd, yyyy')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Hospital</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedConsultation.hospitalName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Doctor</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedConsultation.doctorName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Specialization</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedConsultation.doctorSpecialization}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {/* Chief Complaint */}
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#2A7F62', fontWeight: 'bold', mb: 1 }}>
                  Chief Complaint
                </Typography>
                <Typography variant="body2" sx={{ color: '#2D3748' }}>
                  {selectedConsultation.chiefComplaint}
                </Typography>
              </Box>

              <Divider />

              {/* Diagnosis */}
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#2A7F62', fontWeight: 'bold', mb: 1 }}>
                  Diagnosis
                </Typography>
                <Typography variant="body2" sx={{ color: '#2D3748' }}>
                  {selectedConsultation.diagnosis}
                </Typography>
              </Box>

              <Divider />

              {/* Prescription */}
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#2A7F62', fontWeight: 'bold', mb: 1 }}>
                  Prescription
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {selectedConsultation.prescription.map((item, index) => (
                    <Box component="li" key={index} sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#2D3748' }}>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Divider />

              {/* Notes */}
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#2A7F62', fontWeight: 'bold', mb: 1 }}>
                  Additional Notes
                </Typography>
                <Typography variant="body2" sx={{ color: '#2D3748' }}>
                  {selectedConsultation.notes}
                </Typography>
              </Box>

              {/* Status Badge */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Chip 
                  label={selectedConsultation.status}
                  sx={{
                    bgcolor: selectedConsultation.status === 'Completed' ? '#E8F5E9' : '#FFF3E0',
                    color: selectedConsultation.status === 'Completed' ? '#2A7F62' : '#F57C00',
                    fontWeight: 600
                  }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="contained"
            sx={{
              bgcolor: '#2A7F62',
              '&:hover': { bgcolor: '#1E6D54' }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
