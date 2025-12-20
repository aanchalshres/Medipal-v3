"use client";
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Typography, 
  Button, 
  Chip, 
  TextField, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl,
  Tab,
  Tabs,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Badge,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  InputAdornment 
} from '@mui/material';
import { 
  LocalHospital as HospitalIcon,
  Phone as PhoneIcon,
  Place as PlaceIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  Favorite as FavoriteIcon,
  Navigation as NavigationIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Timer as TimerIcon,
  DirectionsCar as AmbulanceIcon,
  Map as MapIcon,
  Healing as HealingIcon,
  Group as GroupIcon,
  LocalPharmacy as PharmacyIcon,
  Add as PlusIcon,
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrinterIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

// Define types for our data structures
type EmergencyRequest = {
  id: string;
  patient: string;
  location: string;
  priority: string;
  time: string;
  status: string;
  ambulanceId: string | null;
  condition: string;
};

type Ambulance = {
  id: string;
  status: string;
  location: string;
  eta: string | null;
  paramedic: string | null;
  patient: string | null;
  equipment: string[];
};

// Emergency Call Component
const EmergencyCall = () => {
  const [isCalling, setIsCalling] = useState(false);

  const handleEmergencyCall = () => {
    setIsCalling(true);
    // Simulate call initiation
    setTimeout(() => setIsCalling(false), 3000);
  };

  return (
    <Button 
      variant="contained" 
      color="error"
      size="large"
      startIcon={<PhoneIcon />}
      onClick={handleEmergencyCall}
      sx={{
        fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        '&:hover': {
          boxShadow: '0 6px 8px rgba(0,0,0,0.15)'
        }
      }}
      disabled={isCalling}
    >
      {isCalling ? 'Connecting to Emergency...' : 'Emergency Call (102)'}
    </Button>
  );
};

// Main Component
const AmbulanceDispatchSystem = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [emergencySearch, setEmergencySearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [newRequest, setNewRequest] = useState({
    patientName: '',
    location: '',
    condition: '',
    priority: 'medium'
  });

  // Mock data for ambulance requests with proper typing
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([
    {
      id: "REQ001",
      patient: "John Smith",
      location: "123 Main St, Downtown",
      priority: "Critical",
      time: "2 mins ago",
      status: "Dispatched",
      ambulanceId: "AMB-101",
      condition: "Chest Pain"
    },
    {
      id: "REQ002", 
      patient: "Sarah Johnson",
      location: "456 Oak Ave, Suburbs",
      priority: "High",
      time: "8 mins ago",
      status: "En Route",
      ambulanceId: "AMB-102",
      condition: "Severe Bleeding"
    },
    {
      id: "REQ003",
      patient: "Mike Davis",
      location: "789 Pine St, City Center",
      priority: "Medium",
      time: "15 mins ago",
      status: "Pending",
      ambulanceId: null,
      condition: "Broken Leg"
    }
  ]);

  const [ambulanceFleet, setAmbulanceFleet] = useState<Ambulance[]>([
    {
      id: "AMB-101",
      status: "En Route",
      location: "Downtown Area",
      eta: "3 mins",
      paramedic: "Dr. Emma Wilson",
      patient: "John Smith",
      equipment: ["Defibrillator", "Oxygen", "IV Kit"]
    },
    {
      id: "AMB-102",
      status: "Available",
      location: "Station 2",
      eta: null,
      paramedic: "Dr. Mark Johnson",
      patient: null,
      equipment: ["Defibrillator", "Ventilator", "Trauma Kit"]
    },
    {
      id: "AMB-103",
      status: "Maintenance",
      location: "Service Center",
      eta: null,
      paramedic: null,
      patient: null,
      equipment: ["Under Repair"]
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return { bg: '#ffebee', text: '#c62828', border: '#ffcdd2' };
      case "High": return { bg: '#fff8e1', text: '#ff8f00', border: '#ffecb3' };
      case "Medium": return { bg: '#e3f2fd', text: '#1565c0', border: '#bbdefb' };
      default: return { bg: '#e8f5e9', text: '#2e7d32', border: '#c8e6c9' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Dispatched": return { bg: '#e3f2fd', text: '#1565c0', border: '#bbdefb' };
      case "En Route": return { bg: '#fff8e1', text: '#ff8f00', border: '#ffecb3' };
      case "Pending": return { bg: '#f5f5f5', text: '#424242', border: '#e0e0e0' };
      case "Available": return { bg: '#e8f5e9', text: '#2e7d32', border: '#c8e6c9' };
      case "Maintenance": return { bg: '#fff8e1', text: '#ff8f00', border: '#ffecb3' };
      default: return { bg: '#f5f5f5', text: '#424242', border: '#e0e0e0' };
    }
  };

  const filteredRequests = emergencyRequests.filter(request => {
    const matchesSearch = request.patient.toLowerCase().includes(emergencySearch.toLowerCase()) || 
                         request.location.toLowerCase().includes(emergencySearch.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || request.priority.toLowerCase() === priorityFilter.toLowerCase();
    return matchesSearch && matchesPriority;
  });

  const stats = {
    activeRequests: emergencyRequests.length,
    availableUnits: ambulanceFleet.filter(a => a.status === "Available").length,
    totalUnits: ambulanceFleet.length,
    avgResponse: "4.2m",
    successRate: "98.7%"
  };

  const showNotification = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleAddRequest = () => {
    setOpenDialog(true);
  };

  const handleSaveRequest = () => {
    const newEmergencyRequest: EmergencyRequest = {
      id: `REQ00${emergencyRequests.length + 1}`,
      patient: newRequest.patientName,
      location: newRequest.location,
      priority: newRequest.priority.charAt(0).toUpperCase() + newRequest.priority.slice(1),
      time: "Just now",
      status: "Pending",
      ambulanceId: null,
      condition: newRequest.condition
    };
    
    setEmergencyRequests([...emergencyRequests, newEmergencyRequest]);
    setOpenDialog(false);
    setNewRequest({
      patientName: '',
      location: '',
      condition: '',
      priority: 'medium'
    });
    showNotification("Emergency request added successfully", "success");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriorityChange = (e: any) => {
    setNewRequest(prev => ({
      ...prev,
      priority: e.target.value
    }));
  };

  const handleAssignAmbulance = (ambulanceId: string) => {
    // Find the first pending request
    const pendingRequest = emergencyRequests.find(req => req.status === "Pending");
    
    if (pendingRequest) {
      // Update the request status and ambulance ID
      const updatedRequests = emergencyRequests.map(req => 
        req.id === pendingRequest.id ? { ...req, status: "Dispatched", ambulanceId } : req
      );
      
      // Update the ambulance status
      const updatedFleet = ambulanceFleet.map(ambulance => 
        ambulance.id === ambulanceId ? { 
          ...ambulance, 
          status: "En Route", 
          patient: pendingRequest.patient,
          eta: "5 mins" // Set a default ETA when assigned
        } : ambulance
      );
      
      setEmergencyRequests(updatedRequests);
      setAmbulanceFleet(updatedFleet);
      showNotification(`Ambulance ${ambulanceId} assigned to ${pendingRequest.patient}`, "success");
    } else {
      showNotification("No pending requests available", "error");
    }
  };

  const handleEditRequest = (requestId: string) => {
    const requestToEdit = emergencyRequests.find(req => req.id === requestId);
    if (requestToEdit) {
      setNewRequest({
        patientName: requestToEdit.patient,
        location: requestToEdit.location,
        condition: requestToEdit.condition,
        priority: requestToEdit.priority.toLowerCase()
      });
      setOpenDialog(true);
    }
  };

  const handleDeleteRequest = (requestId: string) => {
    setEmergencyRequests(emergencyRequests.filter(req => req.id !== requestId));
    showNotification("Request deleted successfully", "success");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5faf5' }}>
      {/* White Navbar */}
      <Box sx={{ 
        bgcolor: 'white', 
        borderBottom: 1, 
        borderColor: 'divider',
        boxShadow: 1
      }}>
        <Box sx={{ maxWidth: '7xl', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AmbulanceIcon sx={{ color: '#2A7F62', fontSize: 32 }} />
              <Typography variant="h4" component="h1" fontWeight="bold" color="#2A7F62">
                Emergency Ambulance Dispatch
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <EmergencyCall />
              <Button 
                variant="contained" 
                startIcon={<PlusIcon />}
                onClick={handleAddRequest}
                sx={{
                  bgcolor: '#2A7F62',
                  '&:hover': { bgcolor: '#1e6b50' },
                  color: 'white'
                }}
              >
                New Request
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: '7xl', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 4 }}>
        {/* Stats Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <WarningIcon sx={{ color: '#ff9800', fontSize: 32 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">{stats.activeRequests}</Typography>
                  <Typography variant="body2" color="text.secondary">Active Requests</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AmbulanceIcon sx={{ color: '#2A7F62', fontSize: 32 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {stats.availableUnits}/{stats.totalUnits}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Available Units</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TimerIcon sx={{ color: '#2196f3', fontSize: 32 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">{stats.avgResponse}</Typography>
                  <Typography variant="body2" color="text.secondary">Avg Response Time</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SecurityIcon sx={{ color: '#4caf50', fontSize: 32 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">{stats.successRate}</Typography>
                  <Typography variant="body2" color="text.secondary">Success Rate</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Main Content */}
        <Card sx={{ boxShadow: 2 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{
              '& .MuiTabs-indicator': {
                height: 4,
                backgroundColor: '#2A7F62'
              }
            }}
          >
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningIcon fontSize="small" />
                  Emergency Requests
                </Box>
              } 
              sx={{ fontWeight: 'bold' }}
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AmbulanceIcon fontSize="small" />
                  Fleet Status
                </Box>
              } 
              sx={{ fontWeight: 'bold' }}
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NavigationIcon fontSize="small" />
                  Live Tracking
                </Box>
              } 
              sx={{ fontWeight: 'bold' }}
            />
          </Tabs>

          <Divider />

          {/* Emergency Requests Tab */}
          {activeTab === 0 && (
            <Box>
              <CardHeader
                title="Emergency Requests"
                subheader="Manage and prioritize emergency ambulance calls"
                action={
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                      placeholder="Search by patient or location"
                      variant="outlined"
                      size="small"
                      value={emergencySearch}
                      onChange={(e) => setEmergencySearch(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ width: 300 }}
                    />
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Priority</InputLabel>
                      <Select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        label="Priority"
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="critical">Critical</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                }
              />
              <CardContent sx={{ p: 0 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#e8f5e9' }}>
                      <TableCell sx={{ fontWeight: 'medium' }}>Request ID</TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>Patient</TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>Location</TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>Condition</TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>Priority</TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRequests.map((request) => {
                      const priorityColor = getPriorityColor(request.priority);
                      const statusColor = getStatusColor(request.status);
                      return (
                        <TableRow 
                          key={request.id} 
                          hover
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell>{request.id}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PersonIcon color="action" fontSize="small" />
                              {request.patient}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PlaceIcon color="action" fontSize="small" />
                              {request.location}
                            </Box>
                          </TableCell>
                          <TableCell>{request.condition}</TableCell>
                          <TableCell>
                            <Box sx={{ 
                              display: 'inline-flex', 
                              alignItems: 'center',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: priorityColor.bg,
                              color: priorityColor.text,
                              border: `1px solid ${priorityColor.border}`
                            }}>
                              {request.priority}
                            </Box>
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
                              {request.status}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton
                                size="small"
                                sx={{ color: '#2196f3' }}
                                onClick={() => handleEditRequest(request.id)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                sx={{ color: '#f44336' }}
                                onClick={() => handleDeleteRequest(request.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Box>
          )}

          {/* Fleet Status Tab */}
          {activeTab === 1 && (
            <Box>
              <CardHeader
                title="Ambulance Fleet Status"
                subheader="Monitor ambulance availability and assignments"
              />
              <CardContent>
                <Box sx={{ display: 'grid', gap: 3 }}>
                  {ambulanceFleet.map((ambulance) => {
                    const statusColor = getStatusColor(ambulance.status);
                    return (
                      <Card key={ambulance.id} variant="outlined" sx={{ p: 2 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 2
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: '#2A7F62' }}>
                              <AmbulanceIcon />
                            </Avatar>
                            <Box>
                              <Typography fontWeight="bold">{ambulance.id}</Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PlaceIcon fontSize="small" />
                                {ambulance.location}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
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
                              {ambulance.status}
                            </Box>
                            {ambulance.eta && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                ETA: {ambulance.eta}
                              </Typography>
                            )}
                          </Box>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                          <Box>
                            {ambulance.paramedic && (
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <PersonIcon fontSize="small" color="action" />
                                <span>Paramedic: <strong>{ambulance.paramedic}</strong></span>
                              </Typography>
                            )}
                            {ambulance.patient && (
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FavoriteIcon fontSize="small" color="error" />
                                <span>Patient: <strong>{ambulance.patient}</strong></span>
                              </Typography>
                            )}
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PharmacyIcon fontSize="small" color="action" />
                              <span>Equipment: <strong>{ambulance.equipment.join(", ")}</strong></span>
                            </Typography>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            startIcon={<MapIcon fontSize="small" />}
                            sx={{ color: '#2A7F62', borderColor: '#2A7F62' }}
                          >
                            Track
                          </Button>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            startIcon={<PhoneIcon fontSize="small" />}
                            sx={{ color: '#2A7F62', borderColor: '#2A7F62' }}
                          >
                            Contact
                          </Button>
                          {ambulance.status === "Available" && (
                            <Button 
                              variant="contained" 
                              size="small" 
                              startIcon={<NavigationIcon fontSize="small" />}
                              sx={{ 
                                backgroundColor: '#2A7F62', 
                                '&:hover': { backgroundColor: '#1e6b50' },
                                ml: 'auto'
                              }}
                              onClick={() => handleAssignAmbulance(ambulance.id)}
                            >
                              Assign
                            </Button>
                          )}
                        </Box>
                      </Card>
                    );
                  })}
                </Box>
              </CardContent>
            </Box>
          )}

          {/* Live Tracking Tab */}
          {activeTab === 2 && (
            <Box>
              <CardHeader
                title="Live Tracking & Dispatch"
                subheader="Real-time ambulance locations and emergency coordination"
              />
              <CardContent>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                  {/* Map Placeholder */}
                  <Card variant="outlined" sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <MapIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                      <Typography color="text.disabled">Live Map Integration</Typography>
                      <Typography variant="body2" color="text.disabled">
                        Real-time ambulance tracking would display here
                      </Typography>
                    </Box>
                  </Card>

                  {/* Quick Actions */}
                  <Box>
                    <Typography variant="h6" gutterBottom>Emergency Actions</Typography>
                    
                    <Box sx={{ display: 'grid', gap: 1, mb: 2 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        sx={{
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          py: 1.5
                        }}
                        startIcon={<PhoneIcon />}
                      >
                        Emergency Hotline (102)
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          py: 1.5,
                          backgroundColor: '#2A7F62',
                          '&:hover': { backgroundColor: '#1e6b50' }
                        }}
                        startIcon={<AmbulanceIcon />}
                      >
                        Dispatch Nearest Unit
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          py: 1.5,
                          backgroundColor: '#2A7F62',
                          '&:hover': { backgroundColor: '#1e6b50' }
                        }}
                        startIcon={<GroupIcon />}
                      >
                        Mass Casualty Protocol
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          py: 1.5,
                          backgroundColor: '#2A7F62',
                          '&:hover': { backgroundColor: '#1e6b50' }
                        }}
                        startIcon={<HospitalIcon />}
                      >
                        Hospital Coordination
                      </Button>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                 
                    
                  </Box>
                </Box>
              </CardContent>
            </Box>
          )}
        </Card>
      </Box>

      {/* Add Request Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>New Emergency Request</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Patient Name"
              fullWidth
              margin="normal"
              name="patientName"
              value={newRequest.patientName}
              onChange={handleInputChange}
            />
            <TextField
              label="Location"
              fullWidth
              margin="normal"
              name="location"
              value={newRequest.location}
              onChange={handleInputChange}
            />
            <TextField
              label="Condition"
              fullWidth
              margin="normal"
              name="condition"
              value={newRequest.condition}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Priority</InputLabel>
              <Select
                label="Priority"
                value={newRequest.priority}
                onChange={handlePriorityChange}
              >
                <MenuItem value="critical">Critical</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)}
            startIcon={<CancelIcon />}
            sx={{ color: '#f44336' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveRequest}
            startIcon={<SaveIcon />}
            sx={{ 
              backgroundColor: '#2A7F62',
              color: 'white',
              '&:hover': { backgroundColor: '#1e6b50' }
            }}
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

export default AmbulanceDispatchSystem;