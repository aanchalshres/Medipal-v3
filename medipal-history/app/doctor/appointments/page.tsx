"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  Check as CheckIcon,
  HourglassEmpty,
  EventAvailable,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  LocalHospital,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import { format } from "date-fns";

interface Appointment {
  id: string;
  date: string;
  time: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  appointmentType: string;
  status: "Pending" | "Approved" | "Completed" | "Cancelled";
  reason: string;
  notes?: string;
}

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch doctor profile
        const profileResponse = await fetch("http://localhost:5000/api/doctors/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await profileResponse.json();

        if (profileData?.success && profileData?.user?.fullName) {
          setDoctorName(profileData.user.fullName);
        }

        // Fetch appointments from API
        const appointmentsResponse = await fetch('http://localhost:5000/api/appointments/doctor/list', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const appointmentsData = await appointmentsResponse.json();

        if (appointmentsData?.success && appointmentsData?.data) {
          // Transform data to match interface
          const transformedAppointments = appointmentsData.data.map((apt: any) => ({
            id: apt._id,
            date: new Date(apt.date).toISOString().split('T')[0],
            time: apt.time,
            patientId: apt.patientId,
            patientName: apt.patientName,
            patientPhone: apt.patientPhone,
            appointmentType: apt.appointmentType,
            status: apt.status,
            reason: apt.reason,
            notes: apt.notes
          }));
          setAppointments(transformedAppointments);
          setFilteredAppointments(transformedAppointments);
        }

        setLoading(false);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSnackbar({
          open: true,
          message: "Failed to load appointments",
          severity: "error",
        });
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter appointments
  useEffect(() => {
    let filtered = appointments;

    if (filterStatus !== "All") {
      filtered = filtered.filter((apt) => apt.status === filterStatus);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.patientName.toLowerCase().includes(term) ||
          apt.patientId.toLowerCase().includes(term) ||
          apt.reason.toLowerCase().includes(term)
      );
    }

    setFilteredAppointments(filtered);
  }, [searchTerm, filterStatus, appointments]);

  const updateAppointmentStatus = async (id: string, status: string, successMessage: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSnackbar({
          open: true,
          message: "Please login to update appointments",
          severity: "error",
        });
        return;
      }

      const response = await fetch(`http://localhost:5000/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setAppointments(
          appointments.map((apt) => (apt.id === id ? { ...apt, status: status as any } : apt))
        );
        setSnackbar({
          open: true,
          message: successMessage,
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: data.message || "Failed to update appointment",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      setSnackbar({
        open: true,
        message: "Failed to update appointment. Please try again.",
        severity: "error",
      });
    }
  };

  const handleApprove = (id: string) => {
    updateAppointmentStatus(id, "Approved", "Appointment approved successfully!");
  };

  const handleMarkCompleted = (id: string) => {
    updateAppointmentStatus(id, "Completed", "Appointment marked as completed!");
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setViewDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return { bg: "#E8F5E9", color: "#2A7F62" };
      case "Pending":
        return { bg: "#FFF3E0", color: "#F57C00" };
      case "Completed":
        return { bg: "#E3F2FD", color: "#1976D2" };
      case "Cancelled":
        return { bg: "#FFEBEE", color: "#D32F2F" };
      default:
        return { bg: "#F5F5F5", color: "#757575" };
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
        return <HourglassEmpty fontSize="small" />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress sx={{ color: "#2A7F62" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#F5F9F8", minHeight: "100vh", py: 4, px: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ color: "#2D3748", fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, mb: 1 }}
        >
          <CalendarIcon sx={{ fontSize: 32, color: "#2A7F62" }} />
          Appointment Requests
        </Typography>
        {doctorName && (
          <Typography variant="body1" sx={{ color: "#64748B" }}>
            Doctor: <strong>{doctorName}</strong>
          </Typography>
        )}
        <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
          Manage patient appointment requests
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" }, gap: 3, mb: 4 }}>
        <Card sx={{ bgcolor: "white", borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ bgcolor: "#E3F2FD", p: 1.5, borderRadius: 2, display: "flex" }}>
                <CalendarIcon sx={{ color: "#1976D2", fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2D3748" }}>
                  {appointments.length}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  Total
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: "white", borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ bgcolor: "#FFF3E0", p: 1.5, borderRadius: 2, display: "flex" }}>
                <HourglassEmpty sx={{ color: "#F57C00", fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2D3748" }}>
                  {appointments.filter((a) => a.status === "Pending").length}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  Pending
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: "white", borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ bgcolor: "#E8F5E9", p: 1.5, borderRadius: 2, display: "flex" }}>
                <CheckIcon sx={{ color: "#2A7F62", fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2D3748" }}>
                  {appointments.filter((a) => a.status === "Approved").length}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  Approved
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: "white", borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ bgcolor: "#E3F2FD", p: 1.5, borderRadius: 2, display: "flex" }}>
                <EventAvailable sx={{ color: "#1976D2", fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2D3748" }}>
                  {appointments.filter((a) => a.status === "Completed").length}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  Completed
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          placeholder="Search by patient name, ID, or reason..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#64748B" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            minWidth: 300,
            bgcolor: "white",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": { borderColor: "#2A7F62" },
              "&.Mui-focused fieldset": { borderColor: "#2A7F62" },
            },
          }}
        />
        <FormControl sx={{ minWidth: 150, bgcolor: "white", borderRadius: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} label="Status">
            <MenuItem value="All">All Status</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Appointments Table */}
      <Card sx={{ bgcolor: "white", borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <CardContent sx={{ p: 0 }}>
          {filteredAppointments.length === 0 ? (
            <Box sx={{ p: 8, textAlign: "center" }}>
              <CalendarIcon sx={{ fontSize: 64, color: "#E0E0E0", mb: 2 }} />
              <Typography variant="h6" sx={{ color: "#64748B", mb: 1 }}>
                No appointments found
              </Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                {searchTerm || filterStatus !== "All"
                  ? "Try adjusting your filters"
                  : "No appointment requests at the moment"}
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#F5F9F8" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>Patient</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>Reason</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAppointments.map((appointment) => {
                  const statusColor = getStatusColor(appointment.status);
                  return (
                    <TableRow key={appointment.id} sx={{ "&:hover": { bgcolor: "#F5F9F8" }, transition: "background-color 0.2s" }}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CalendarIcon sx={{ fontSize: 16, color: "#64748B" }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: "#2D3748" }}>
                              {format(new Date(appointment.date), "MMM dd, yyyy")}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#64748B" }}>
                              {appointment.time}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: "#2D3748" }}>
                            {appointment.patientName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#64748B" }}>
                            ID: {appointment.patientId}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "#2D3748" }}>
                          {appointment.appointmentType}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ color: "#2D3748", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        >
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
                            "& .MuiChip-icon": {
                              color: statusColor.color,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton size="small" onClick={() => handleViewAppointment(appointment)} sx={{ color: "#2A7F62" }}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                          {appointment.status === "Pending" && (
                            <IconButton size="small" onClick={() => handleApprove(appointment.id)} sx={{ color: "#2A7F62" }}>
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          )}
                          {appointment.status === "Approved" && (
                            <IconButton size="small" onClick={() => handleMarkCompleted(appointment.id)} sx={{ color: "#1976D2" }}>
                              <EventAvailable fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Appointment Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#F5F9F8", color: "#2D3748", fontWeight: "bold" }}>
          Appointment Details
        </DialogTitle>
        {selectedAppointment && (
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 3 }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Date
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#2D3748" }}>
                  {format(new Date(selectedAppointment.date), "MMMM dd, yyyy")}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Time
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#2D3748" }}>
                  {selectedAppointment.time}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Patient Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#2D3748" }}>
                  {selectedAppointment.patientName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Patient ID
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#2D3748" }}>
                  {selectedAppointment.patientId}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Phone Number
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#2D3748" }}>
                  {selectedAppointment.patientPhone}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Appointment Type
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#2D3748" }}>
                  {selectedAppointment.appointmentType}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                Reason for Visit
              </Typography>
              <Typography variant="body1" sx={{ color: "#2D3748" }}>
                {selectedAppointment.reason}
              </Typography>
            </Box>
            {selectedAppointment.notes && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Notes
                </Typography>
                <Typography variant="body2" sx={{ color: "#2D3748" }}>
                  {selectedAppointment.notes}
                </Typography>
              </Box>
            )}
            <Box>
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                Status
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  icon={getStatusIcon(selectedAppointment.status)}
                  label={selectedAppointment.status}
                  sx={{
                    bgcolor: getStatusColor(selectedAppointment.status).bg,
                    color: getStatusColor(selectedAppointment.status).color,
                    fontWeight: 500,
                    "& .MuiChip-icon": {
                      color: getStatusColor(selectedAppointment.status).color,
                    },
                  }}
                />
              </Box>
            </Box>
          </DialogContent>
        )}
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setViewDialogOpen(false)} sx={{ color: "#64748B" }}>
            Close
          </Button>
          {selectedAppointment?.status === "Pending" && (
            <Button
              onClick={() => {
                handleApprove(selectedAppointment.id);
                setViewDialogOpen(false);
              }}
              variant="contained"
              sx={{ bgcolor: "#2A7F62", "&:hover": { bgcolor: "#1E6D54" } }}
            >
              Approve
            </Button>
          )}
          {selectedAppointment?.status === "Approved" && (
            <Button
              onClick={() => {
                handleMarkCompleted(selectedAppointment.id);
                setViewDialogOpen(false);
              }}
              variant="contained"
              sx={{ bgcolor: "#1976D2", "&:hover": { bgcolor: "#1565C0" } }}
            >
              Mark Completed
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
