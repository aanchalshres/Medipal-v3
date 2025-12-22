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
    doctorId: "",
    hospitalName: "",
    doctorName: "",
    doctorSpecialization: "",
    appointmentType: "General Consultation",
    date: "",
    time: "",
    reason: "",
    notes: ""
  });
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  // Fetch patient profile and appointments
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

        // Fetch appointments from API
        const appointmentsResponse = await fetch('http://localhost:5000/api/appointments/patient/list', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const appointmentsData = await appointmentsResponse.json();

        if (appointmentsData?.success && appointmentsData?.data) {
          // Transform data to match interface
          const transformedAppointments = appointmentsData.data.map((apt: any) => ({
            id: apt._id,
            date: new Date(apt.date).toISOString().split('T')[0],
            time: apt.time,
            hospitalName: apt.hospitalName,
            doctorName: apt.doctorName,
            doctorSpecialization: apt.doctorSpecialization,
            appointmentType: apt.appointmentType,
            status: apt.status,
            reason: apt.reason,
            notes: apt.notes
          }));
          setAppointments(transformedAppointments);
          setFilteredAppointments(transformedAppointments);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load appointments',
          severity: 'error'
        });
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch doctors when dialog opens
  useEffect(() => {
    if (dialogOpen) {
      fetchDoctors();
    }
  }, [dialogOpen]);

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const response = await fetch('http://localhost:5000/api/doctors/search');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data?.success && data?.data) {
        setDoctors(data.data);
      } else {
        console.error('No doctors found or invalid response:', data);
        setSnackbar({
          open: true,
          message: 'No doctors available at the moment',
          severity: 'info'
        });
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load doctors. Please check if the server is running.',
        severity: 'error'
      });
    }
    setLoadingDoctors(false);
  };

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
      doctorId: "",
      hospitalName: "",
      doctorName: "",
      doctorSpecialization: "",
      appointmentType: "General Consultation",
      date: "",
      time: "",
      reason: "",
      notes: ""
    });
  };

  const handleDoctorChange = (doctorId: string) => {
    const selectedDoctor = doctors.find(d => d._id === doctorId);
    if (selectedDoctor) {
      setNewAppointment({
        ...newAppointment,
        doctorId: selectedDoctor._id,
        doctorName: selectedDoctor.fullName,
        doctorSpecialization: Array.isArray(selectedDoctor.specialization) ? selectedDoctor.specialization.join(', ') : selectedDoctor.specialization,
        hospitalName: selectedDoctor.hospital
      });
    }
  };

  const handleSubmitAppointment = async () => {
    if (!newAppointment.doctorId || !newAppointment.date || !newAppointment.time || !newAppointment.reason) {
      setSnackbar({
        open: true,
        message: "Please fill all required fields",
        severity: "error"
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbar({
          open: true,
          message: "Please login to book an appointment",
          severity: "error"
        });
        return;
      }

      const response = await fetch('http://localhost:5000/api/appointments/patient/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctorId: newAppointment.doctorId,
          appointmentType: newAppointment.appointmentType,
          date: newAppointment.date,
          time: newAppointment.time,
          reason: newAppointment.reason,
          notes: newAppointment.notes
        })
      });

      const data = await response.json();

      if (data.success) {
        // Refresh appointments list
        const appointmentsResponse = await fetch('http://localhost:5000/api/appointments/patient/list', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const appointmentsData = await appointmentsResponse.json();

        if (appointmentsData?.success && appointmentsData?.data) {
          const transformedAppointments = appointmentsData.data.map((apt: any) => ({
            id: apt._id,
            date: new Date(apt.date).toISOString().split('T')[0],
            time: apt.time,
            hospitalName: apt.hospitalName,
            doctorName: apt.doctorName,
            doctorSpecialization: apt.doctorSpecialization,
            appointmentType: apt.appointmentType,
            status: apt.status,
            reason: apt.reason,
            notes: apt.notes
          }));
          setAppointments(transformedAppointments);
          setFilteredAppointments(transformedAppointments);
        }

        handleCloseDialog();
        setSnackbar({
          open: true,
          message: "Appointment requested successfully! You will be notified once approved.",
          severity: "success"
        });
      } else {
        setSnackbar({
          open: true,
          message: data.message || "Failed to create appointment",
          severity: "error"
        });
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      setSnackbar({
        open: true,
        message: "Failed to create appointment. Please try again.",
        severity: "error"
      });
    }
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
            <FormControl fullWidth>
              <InputLabel>Select Doctor *</InputLabel>
              <Select
                value={newAppointment.doctorId}
                onChange={(e) => handleDoctorChange(e.target.value)}
                label="Select Doctor *"
                disabled={loadingDoctors}
              >
                {loadingDoctors ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 2 }} />
                    Loading doctors...
                  </MenuItem>
                ) : doctors.length === 0 ? (
                  <MenuItem disabled>No doctors available</MenuItem>
                ) : (
                  doctors.map((doctor) => (
                    <MenuItem key={doctor._id} value={doctor._id}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {doctor.fullName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                          {Array.isArray(doctor.specialization) ? doctor.specialization.join(', ') : doctor.specialization} • {doctor.hospital}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            {newAppointment.doctorId && (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>Hospital: {newAppointment.hospitalName}</Typography>
                <Typography variant="caption">Specialization: {newAppointment.doctorSpecialization}</Typography>
              </Alert>
            )}

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

            <TextField
              fullWidth
              label="Additional Notes (Optional)"
              multiline
              rows={2}
              value={newAppointment.notes}
              onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
              placeholder="Any additional information for the doctor"
            />

            {!newAppointment.doctorId && (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                Please select a doctor to continue
              </Alert>
            )}
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
