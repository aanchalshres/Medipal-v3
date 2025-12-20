"use client";
import { useState, useEffect } from "react";
import { 
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Notifications as NotifyIcon
  
} from "@mui/icons-material";
import { 
  Button, 
  Card, 
  CardHeader, 
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
  Avatar, 
  Chip, 
  IconButton, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  InputAdornment,
  Snackbar,
  Alert,
  Badge,
  CircularProgress,
  SelectChangeEvent 
} from "@mui/material";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  time: string;
  date: string;
  patient: string;
  patientId: string;
  doctor: string;
  type: string;
  status: "confirmed" | "pending" | "urgent" | "cancelled";
  phone: string;
  email: string;
  notes: string;
}

interface AppointmentStats {
  total: number;
  confirmed: number;
  pending: number;
  urgent: number;
  cancelled: number;
}

const Appointments = () => {
  // State for appointments data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  
  // State for filters
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("today");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // State for form dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // State for notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info">("success");

  // Current doctor data
  const currentDoctor = {
    name: "Ram Kumar",
    specialization: "Cardiology ",
    todayAppointments: 8,
    upcoming: "3:00 PM - Emergency Slot"
  };

  // Initialize with sample data
  useEffect(() => {
    const initialAppointments: Appointment[] = [
      {
        id: uuidv4(),
        time: "10:00 AM",
        date: new Date().toISOString().split('T')[0],
        patient: "John Doe",
        patientId: "#123",
        doctor: "Dr. Smith",
        type: "Follow-Up",
        status: "confirmed",
        phone: "+91-9876543210",
        email: "john@example.com",
        notes: "Post-operative checkup"
      },
      {
        id: uuidv4(),
        time: "11:30 AM",
        date: new Date().toISOString().split('T')[0],
        patient: "Jane Roe",
        patientId: "#456",
        doctor: "Dr. Smith",
        type: "New Patient",
        status: "pending",
        phone: "+91-9876543211",
        email: "jane@example.com",
        notes: "Initial consultation"
      },
      {
        id: uuidv4(),
        time: "2:00 PM",
        date: new Date().toISOString().split('T')[0],
        patient: "Mike Johnson",
        patientId: "#789",
        doctor: "Dr. Smith",
        type: "Consultation",
        status: "confirmed",
        phone: "+91-9876543212",
        email: "mike@example.com",
        notes: "Annual checkup"
      },
      {
        id: uuidv4(),
        time: "3:30 PM",
        date: new Date().toISOString().split('T')[0],
        patient: "Sarah Wilson",
        patientId: "#101",
        doctor: "Dr. Smith",
        type: "Emergency",
        status: "urgent",
        phone: "+91-9876543213",
        email: "sarah@example.com",
        notes: "Chest pain evaluation"
      },
      {
        id: uuidv4(),
        time: "9:00 AM",
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        patient: "Robert Brown",
        patientId: "#102",
        doctor: "Ram Kumar",
        type: "Follow-Up",
        status: "confirmed",
        phone: "+91-9876543214",
        email: "robert@example.com",
        notes: "Medication review"
      }
    ];

    setAppointments(initialAppointments);
    setFilteredAppointments(initialAppointments.filter(appt => 
      new Date(appt.date).toDateString() === new Date().toDateString()
    ));
  }, []);

  // Calculate stats
  const calculateStats = (): AppointmentStats => {
    const todayAppointments = appointments.filter(appt => 
      new Date(appt.date).toDateString() === new Date().toDateString()
    );

    return {
      total: todayAppointments.length,
      confirmed: todayAppointments.filter(a => a.status === "confirmed").length,
      pending: todayAppointments.filter(a => a.status === "pending").length,
      urgent: todayAppointments.filter(a => a.status === "urgent").length,
      cancelled: todayAppointments.filter(a => a.status === "cancelled").length
    };
  };

  const stats = calculateStats();

  // Filter appointments based on selected filters and search term
  useEffect(() => {
    let filtered = [...appointments];

    // Filter by date
    if (filterDate === "today") {
      filtered = filtered.filter(appt => 
        new Date(appt.date).toDateString() === new Date().toDateString()
      );
    } else if (filterDate === "tomorrow") {
      filtered = filtered.filter(appt => 
        new Date(appt.date).toDateString() === new Date(Date.now() + 86400000).toDateString()
      );
    } else if (filterDate === "week") {
      const endOfWeek = new Date();
      endOfWeek.setDate(endOfWeek.getDate() + 7);
      filtered = filtered.filter(appt => 
        new Date(appt.date) <= endOfWeek
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(appt => appt.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(appt => 
        appt.patient.toLowerCase().includes(term) ||
        appt.patientId.toLowerCase().includes(term) ||
        appt.type.toLowerCase().includes(term) ||
        appt.notes.toLowerCase().includes(term)
      );
    }

    setFilteredAppointments(filtered);
  }, [appointments, filterStatus, filterDate, searchTerm]);

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return { bg: "#e8f5e9", text: "#2e7d32", border: "#c8e6c9" }; // Light green
      case "pending":
        return { bg: "#fff8e1", text: "#ff8f00", border: "#ffecb3" }; // Light amber
      case "urgent":
        return { bg: "#ffebee", text: "#c62828", border: "#ffcdd2" }; // Light red
      case "cancelled":
        return { bg: "#e0e0e0", text: "#424242", border: "#bdbdbd" }; // Light gray
      default:
        return { bg: "#f5f5f5", text: "#424242", border: "#e0e0e0" };
    }
  };

  // CRUD Operations
  const handleAddAppointment = () => {
    setCurrentAppointment({
      id: uuidv4(),
      time: "10:00 AM",
      date: new Date().toISOString().split('T')[0],
      patient: "",
      patientId: "",
      doctor: currentDoctor.name,
      type: "Consultation",
      status: "pending",
      phone: "",
      email: "",
      notes: ""
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
    showNotification("Appointment deleted successfully", "success");
  };

  const handleSaveAppointment = () => {
    if (!currentAppointment) return;

    if (isEditing) {
      setAppointments(appointments.map(a => 
        a.id === currentAppointment.id ? currentAppointment : a
      ));
      showNotification("Appointment updated successfully", "success");
    } else {
      setAppointments([...appointments, currentAppointment]);
      showNotification("Appointment added successfully", "success");
    }

    setOpenDialog(false);
  };

  const handleStatusChange = (id: string, newStatus: "confirmed" | "pending" | "urgent" | "cancelled") => {
    setAppointments(appointments.map(appt => 
      appt.id === id ? { ...appt, status: newStatus } : appt
    ));
    showNotification(`Appointment marked as ${newStatus}`, "success");
  };

  const showNotification = (message: string, severity: "success" | "error" | "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Filter handlers
  const handleFilterStatusChange = (event: SelectChangeEvent) => {
    setFilterStatus(event.target.value as string);
  };

  const handleFilterDateChange = (event: SelectChangeEvent) => {
    setFilterDate(event.target.value as string);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f9f8' }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: 'white', 
        borderBottom: 1, 
        borderColor: 'divider',
        boxShadow: 1
      }}>
        <Box sx={{ maxWidth: '7xl', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CalendarIcon sx={{ color: '#2A7F62', fontSize: 32 }} />
              <Typography variant="h4" component="h1" fontWeight="bold" color="#2A7F62">
                Appointments
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleAddAppointment}
              sx={{
                bgcolor: '#2A7F62',
                '&:hover': { bgcolor: '#237A56' },
                color: 'white'
              }}
            >
              New Appointment
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: '7xl', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 4 }}>
        <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { lg: '3fr 1fr' } }}>
          {/* Main Content */}
          <Box>
            {/* Filters */}
            <Card sx={{ mb: 3, boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FilterIcon sx={{ color: '#2D3748', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#2D3748', fontWeight: 'medium' }}>
                      Filters:
                    </Typography>
                  </Box>
                  
                  <Select
                    value={filterDate}
                    onChange={handleFilterDateChange}
                    sx={{ minWidth: 160 }}
                  >
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="tomorrow">Tomorrow</MenuItem>
                    <MenuItem value="week">This Week</MenuItem>
                  </Select>

                  <Select
                    value={filterStatus}
                    onChange={handleFilterStatusChange}
                    sx={{ minWidth: 160 }}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>

                  <TextField
                    placeholder="Search patients..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ flex: 1, maxWidth: 400 }}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Appointments Table */}
            <Card sx={{ boxShadow: 2 }}>
              <CardHeader 
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CalendarIcon color="primary" />
                    <Typography variant="h6">Appointments</Typography>
                    <Box sx={{ flex: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {filteredAppointments.length} records found
                    </Typography>
                  </Box>
                }
              />
              <CardContent sx={{ p: 0 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#e8f5e9' }}>
                      <TableCell sx={{ fontWeight: 'medium' }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>Patient</TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAppointments.map((appointment) => {
                      const statusColor = getStatusColor(appointment.status);
                      return (
                        <TableRow 
                          key={appointment.id} 
                          hover
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <TimeIcon fontSize="small" color="primary" />
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {appointment.time}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {appointment.patient}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                ID: {appointment.patientId}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {appointment.type}
                            </Typography>
                            {appointment.notes && (
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                {appointment.notes}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ 
                              display: 'inline-flex', 
                              alignItems: 'center',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: statusColor.bg,
                              color: statusColor.text,
                              border: `1px solid ${statusColor.border}`
                            }}>
                              {appointment.status === "confirmed" && <CheckIcon fontSize="small" sx={{ mr: 0.5 }} />}
                              {appointment.status === "pending" && <TimeIcon fontSize="small" sx={{ mr: 0.5 }} />}
                              {appointment.status === "urgent" && <WarningIcon fontSize="small" sx={{ mr: 0.5 }} />}
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton
                                onClick={() => handleEditAppointment(appointment)}
                                size="small"
                                sx={{ color: '#2196f3' }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              {appointment.status === "pending" && (
                                <IconButton
                                  onClick={() => handleStatusChange(appointment.id, "confirmed")}
                                  size="small"
                                  sx={{ color: '#4caf50' }}
                                >
                                  <CheckIcon fontSize="small" />
                                </IconButton>
                              )}
                              {appointment.status !== "cancelled" && (
                                <IconButton
                                  onClick={() => handleStatusChange(appointment.id, "cancelled")}
                                  size="small"
                                  sx={{ color: '#f44336' }}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                onClick={() => toast.success(`Sent reminder to ${appointment.patient}`)}
                                size="small"
                                sx={{ color: '#2A7F62' }}
                              >
                                <NotifyIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Box>

          {/* Sidebar */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Today's Stats */}
            <Card sx={{ boxShadow: 2 }}>
              <CardHeader 
                title={
                  <Typography variant="h6">
                    Today's Summary
                  </Typography>
                }
              />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2A7F62' }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Total Appointments
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: '#e8f5e9', 
                    borderRadius: 1,
                    border: '1px solid #c8e6c9',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 'medium' }}>
                      {stats.confirmed}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Confirmed
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: '#fff8e1', 
                    borderRadius: 1,
                    border: '1px solid #ffecb3',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h6" sx={{ color: '#ff8f00', fontWeight: 'medium' }}>
                      {stats.pending}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Pending
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: '#ffebee', 
                    borderRadius: 1,
                    border: '1px solid #ffcdd2',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h6" sx={{ color: '#c62828', fontWeight: 'medium' }}>
                      {stats.urgent}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Urgent
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: '#e0e0e0', 
                    borderRadius: 1,
                    border: '1px solid #bdbdbd',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h6" sx={{ color: '#424242', fontWeight: 'medium' }}>
                      {stats.cancelled}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Cancelled
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Doctor Info */}
            <Card sx={{ boxShadow: 2 }}>
              <CardHeader 
                title={
                  <Typography variant="h6">
                    Doctor Information
                  </Typography>
                }
              />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 56, 
                      height: 56, 
                      bgcolor: '#2A7F62',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.25rem'
                    }}
                  >
                    {currentDoctor.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      {currentDoctor.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {currentDoctor.specialization}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: '#e8f5e9', 
                  borderRadius: 1,
                  border: '1px solid #c8e6c9'
                }}>
                  <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 'medium' }}>
                    🕒 Upcoming Availability
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                    {currentDoctor.upcoming}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card sx={{ boxShadow: 2 }}>
              <CardHeader 
                title={
                  <Typography variant="h6">
                    Quick Actions
                  </Typography>
                }
              />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={() => window.print()}
                  startIcon={<PrintIcon />}
                  sx={{ color: '#2A7F62', borderColor: '#2A7F62' }}
                >
                  Print Schedule
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={() => toast.success("Shared today's schedule")}
                  startIcon={<ShareIcon />}
                  sx={{ color: '#2A7F62', borderColor: '#2A7F62' }}
                >
                  Share Schedule
                </Button>
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={handleAddAppointment}
                  startIcon={<AddIcon />}
                  sx={{ bgcolor: '#2A7F62', '&:hover': { bgcolor: '#237A56' } }}
                >
                  New Appointment
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* Add/Edit Appointment Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? "Edit Appointment" : "Add New Appointment"}</DialogTitle>
        <DialogContent>
          {currentAppointment && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Date"
                  type="date"
                  value={currentAppointment.date}
                  onChange={(e) => setCurrentAppointment({...currentAppointment, date: e.target.value})}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Time"
                  value={currentAppointment.time}
                  onChange={(e) => setCurrentAppointment({...currentAppointment, time: e.target.value})}
                  fullWidth
                  margin="normal"
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Patient Name"
                  value={currentAppointment.patient}
                  onChange={(e) => setCurrentAppointment({...currentAppointment, patient: e.target.value})}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Patient ID"
                  value={currentAppointment.patientId}
                  onChange={(e) => setCurrentAppointment({...currentAppointment, patientId: e.target.value})}
                  fullWidth
                  margin="normal"
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Select
                  value={currentAppointment.type}
                  onChange={(e) => setCurrentAppointment({...currentAppointment, type: e.target.value as string})}
                  fullWidth
                  margin="dense"
                >
                  <MenuItem value="Consultation">Consultation</MenuItem>
                  <MenuItem value="Follow-Up">Follow-Up</MenuItem>
                  <MenuItem value="New Patient">New Patient</MenuItem>
                  <MenuItem value="Emergency">Emergency</MenuItem>
                  <MenuItem value="Procedure">Procedure</MenuItem>
                </Select>
                <Select
                  value={currentAppointment.status}
                  onChange={(e) => setCurrentAppointment({...currentAppointment, status: e.target.value as any})}
                  fullWidth
                  margin="dense"
                >
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Phone"
                  value={currentAppointment.phone}
                  onChange={(e) => setCurrentAppointment({...currentAppointment, phone: e.target.value})}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Email"
                  value={currentAppointment.email}
                  onChange={(e) => setCurrentAppointment({...currentAppointment, email: e.target.value})}
                  fullWidth
                  margin="normal"
                />
              </Box>
              <TextField
                label="Notes"
                value={currentAppointment.notes}
                onChange={(e) => setCurrentAppointment({...currentAppointment, notes: e.target.value})}
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)}
            startIcon={<CloseIcon />}
            sx={{ color: '#f44336' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveAppointment}
            startIcon={<CheckIcon />}
            sx={{ color: '#2A7F62' }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Appointments;