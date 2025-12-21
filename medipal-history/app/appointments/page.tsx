"use client";
import { useState, useEffect } from "react";
import { 
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  LocalHospital,
  Add as AddIcon,
  Search as SearchIcon,
  Check as CheckIcon,
  HourglassEmpty,
  Cancel as CancelIcon,
  EventAvailable
} from "@mui/icons-material";
import { 
  Button, 
  Card, 
  CardContent, 
  Select, 
  MenuItem, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Typography, 
  Box, 
  Chip, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel
} from "@mui/material";
import { format } from "date-fns";

interface Appointment {
  id: string;
  date: string;
  time: string;
  hospitalName: string;
  doctorName: string;
  doctorSpecialization: string;
  appointmentType: string;
  status: "Pending" | "Approved" | "Completed" | "Cancelled";
  reason: string;
  notes?: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info"
  });

  // Form state for new appointment
  const [newAppointment, setNewAppointment] = useState({
    hospitalName: "",
    doctorName: "",
    doctorSpecialization: "",
    appointmentType: "General Consultation",
    date: "",
    time: "",
    reason: ""
  });

  // Fetch patient profile
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

        // Sample appointments data (in production, fetch from backend)
        const sampleAppointments: Appointment[] = [
          {
            id: "1",
            date: "2024-12-28",
            time: "10:00 AM",
            hospitalName: "City General Hospital",
            doctorName: "Dr. Ramesh Sharma",
            doctorSpecialization: "Cardiologist",
            appointmentType: "Follow-up",
            status: "Approved",
            reason: "Regular heart checkup",
            notes: "Bring previous reports"
          },
          {
            id: "2",
            date: "2024-12-25",
            time: "2:30 PM",
            hospitalName: "Kathmandu Medical Center",
            doctorName: "Dr. Sita Thapa",
            doctorSpecialization: "General Physician",
            appointmentType: "General Consultation",
            status: "Completed",
            reason: "Fever and body ache",
            notes: "Prescribed medication for 5 days"
          },
          {
            id: "3",
            date: "2024-12-30",
            time: "11:00 AM",
            hospitalName: "Patan Hospital",
            doctorName: "Dr. Krishna Bhattarai",
            doctorSpecialization: "Orthopedic",
            appointmentType: "Consultation",
            status: "Pending",
            reason: "Knee pain evaluation"
          },
          {
            id: "4",
            date: "2024-12-20",
            time: "3:00 PM",
            hospitalName: "Grande International Hospital",
            doctorName: "Dr. Anita Shrestha",
            doctorSpecialization: "Dermatologist",
            appointmentType: "Follow-up",
            status: "Completed",
            reason: "Skin rash follow-up"
          },
          {
            id: "5",
            date: "2025-01-05",
            time: "9:30 AM",
            hospitalName: "Manipal Teaching Hospital",
            doctorName: "Dr. Binod Kafle",
            doctorSpecialization: "ENT Specialist",
            appointmentType: "General Consultation",
            status: "Pending",
            reason: "Throat examination"
          }
        ];

        setAppointments(sampleAppointments);
        setFilteredAppointments(sampleAppointments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter appointments
  useEffect(() => {
    let filtered = appointments;

    // Filter by status
    if (filterStatus !== "All") {
      filtered = filtered.filter(apt => apt.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(apt =>
        apt.hospitalName.toLowerCase().includes(term) ||
        apt.doctorName.toLowerCase().includes(term) ||
        apt.doctorSpecialization.toLowerCase().includes(term) ||
        apt.reason.toLowerCase().includes(term)
      );
    }

    setFilteredAppointments(filtered);
  }, [searchTerm, filterStatus, appointments]);

  const handleRequestAppointment = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNewAppointment({
      hospitalName: "",
      doctorName: "",
      doctorSpecialization: "",
      appointmentType: "General Consultation",
      date: "",
      time: "",
      reason: ""
    });
  };

  const handleSubmitAppointment = () => {
    if (!newAppointment.hospitalName || !newAppointment.doctorName || !newAppointment.date || !newAppointment.time || !newAppointment.reason) {
      setSnackbar({
        open: true,
        message: "Please fill all required fields",
        severity: "error"
      });
      return;
    }

    const appointment: Appointment = {
      id: Date.now().toString(),
      date: newAppointment.date,
      time: newAppointment.time,
      hospitalName: newAppointment.hospitalName,
      doctorName: newAppointment.doctorName,
      doctorSpecialization: newAppointment.doctorSpecialization,
      appointmentType: newAppointment.appointmentType,
      status: "Pending",
      reason: newAppointment.reason
    };

    setAppointments([appointment, ...appointments]);
    handleCloseDialog();
    setSnackbar({
      open: true,
      message: "Appointment requested successfully! You will be notified once approved.",
      severity: "success"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return { bg: '#E8F5E9', color: '#2A7F62' };
      case "Pending":
        return { bg: '#FFF3E0', color: '#F57C00' };
      case "Completed":
        return { bg: '#E3F2FD', color: '#1976D2' };
      case "Cancelled":
        return { bg: '#FFEBEE', color: '#D32F2F' };
      default:
        return { bg: '#F5F5F5', color: '#757575' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckIcon fontSize="small" />;
      case "Pending":
        return <HourglassEmpty fontSize="small" />;
      case "Completed":
        return <EventAvailable fontSize="small" />;
      case "Cancelled":
        return <CancelIcon fontSize="small" />;
      default:
        return null;
    }
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
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" sx={{ 
            color: '#2D3748', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 1
          }}>
            <CalendarIcon sx={{ fontSize: 32, color: '#2A7F62' }} />
            My Appointments
          </Typography>
          {patientName && (
            <Typography variant="body1" sx={{ color: '#64748B' }}>
              Patient: <strong>{patientName}</strong>
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
            Manage your appointments and book new consultations
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleRequestAppointment}
          sx={{
            bgcolor: '#2A7F62',
            '&:hover': { bgcolor: '#1E6D54' },
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Request Appointment
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 4
      }}>
        <Card sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ bgcolor: '#E3F2FD', p: 1.5, borderRadius: 2, display: 'flex' }}>
                <CalendarIcon sx={{ color: '#1976D2', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2D3748' }}>
                  {appointments.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Total
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ bgcolor: '#E8F5E9', p: 1.5, borderRadius: 2, display: 'flex' }}>
                <CheckIcon sx={{ color: '#2A7F62', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2D3748' }}>
                  {appointments.filter(a => a.status === 'Approved').length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Approved
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ bgcolor: '#FFF3E0', p: 1.5, borderRadius: 2, display: 'flex' }}>
                <HourglassEmpty sx={{ color: '#F57C00', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2D3748' }}>
                  {appointments.filter(a => a.status === 'Pending').length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Pending
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ bgcolor: '#E3F2FD', p: 1.5, borderRadius: 2, display: 'flex' }}>
                <EventAvailable sx={{ color: '#1976D2', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2D3748' }}>
                  {appointments.filter(a => a.status === 'Completed').length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Completed
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 3,
        flexWrap: 'wrap'
      }}>
        <TextField
          placeholder="Search by hospital, doctor, or reason..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#64748B' }} />
              </InputAdornment>
            )
          }}
          sx={{
            flex: 1,
            minWidth: 300,
            bgcolor: 'white',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': { borderColor: '#2A7F62' },
              '&.Mui-focused fieldset': { borderColor: '#2A7F62' }
            }
          }}
        />
        <FormControl sx={{ minWidth: 150, bgcolor: 'white', borderRadius: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="All">All Status</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Appointments Table */}
      <Card sx={{ 
        bgcolor: 'white',
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 0 }}>
          {filteredAppointments.length === 0 ? (
            <Box sx={{ p: 8, textAlign: 'center' }}>
              <CalendarIcon sx={{ fontSize: 64, color: '#E0E0E0', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#64748B', mb: 1 }}>
                No appointments found
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>
                {searchTerm || filterStatus !== "All" ? 'Try adjusting your filters' : 'Start by requesting a new appointment'}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleRequestAppointment}
                sx={{
                  bgcolor: '#2A7F62',
                  '&:hover': { bgcolor: '#1E6D54' }
                }}
              >
                Request Appointment
              </Button>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F5F9F8' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Hospital</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Doctor</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Reason</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAppointments.map((appointment) => {
                  const statusColor = getStatusColor(appointment.status);
                  return (
                    <TableRow 
                      key={appointment.id}
                      sx={{ 
                        '&:hover': { bgcolor: '#F5F9F8' },
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarIcon sx={{ fontSize: 16, color: '#64748B' }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#2D3748' }}>
                              {format(new Date(appointment.date), 'MMM dd, yyyy')}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                              {appointment.time}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocalHospital sx={{ fontSize: 16, color: '#1976D2' }} />
                          <Typography variant="body2" sx={{ color: '#2D3748' }}>
                            {appointment.hospitalName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#2D3748' }}>
                            {appointment.doctorName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748B' }}>
                            {appointment.doctorSpecialization}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#2D3748' }}>
                          {appointment.appointmentType}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ 
                          color: '#2D3748',
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {appointment.reason}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(appointment.status)}
                          label={appointment.status}
                          size="small"
                          sx={{
                            bgcolor: statusColor.bg,
                            color: statusColor.color,
                            fontWeight: 500,
                            '& .MuiChip-icon': {
                              color: statusColor.color
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Request Appointment Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
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
          <AddIcon sx={{ color: '#2A7F62' }} />
          Request New Appointment
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              fullWidth
              label="Hospital Name *"
              value={newAppointment.hospitalName}
              onChange={(e) => setNewAppointment({...newAppointment, hospitalName: e.target.value})}
              placeholder="e.g., City General Hospital"
            />
            
            <TextField
              fullWidth
              label="Doctor Name *"
              value={newAppointment.doctorName}
              onChange={(e) => setNewAppointment({...newAppointment, doctorName: e.target.value})}
              placeholder="e.g., Dr. Ramesh Sharma"
            />

            <TextField
              fullWidth
              label="Doctor Specialization"
              value={newAppointment.doctorSpecialization}
              onChange={(e) => setNewAppointment({...newAppointment, doctorSpecialization: e.target.value})}
              placeholder="e.g., Cardiologist"
            />

            <FormControl fullWidth>
              <InputLabel>Appointment Type</InputLabel>
              <Select
                value={newAppointment.appointmentType}
                onChange={(e) => setNewAppointment({...newAppointment, appointmentType: e.target.value})}
                label="Appointment Type"
              >
                <MenuItem value="General Consultation">General Consultation</MenuItem>
                <MenuItem value="Follow-up">Follow-up</MenuItem>
                <MenuItem value="Emergency">Emergency</MenuItem>
                <MenuItem value="Checkup">Checkup</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                fullWidth
                label="Preferred Date *"
                type="date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
              />

              <TextField
                fullWidth
                label="Preferred Time *"
                type="time"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <TextField
              fullWidth
              label="Reason for Visit *"
              multiline
              rows={3}
              value={newAppointment.reason}
              onChange={(e) => setNewAppointment({...newAppointment, reason: e.target.value})}
              placeholder="Briefly describe your symptoms or reason for appointment"
            />

            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Your appointment request will be sent to the hospital. You will be notified once it's approved.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ color: '#64748B' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitAppointment}
            variant="contained"
            sx={{
              bgcolor: '#2A7F62',
              '&:hover': { bgcolor: '#1E6D54' }
            }}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
  // State for appointments data
