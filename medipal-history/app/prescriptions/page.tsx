"use client";

import { useState, useEffect } from "react";
import { 
  MedicalInformation as PillIcon,
  Add as PlusIcon,
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  CalendarToday as CalendarIcon,
  Person as UserIcon,
  Warning as AlertIcon,
  CheckCircle as CheckIcon,
  AccessTime as ClockIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  QrCode as QrCodeIcon,
  TrendingUp as StatsIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Mic as MicIcon,
  Refresh as RenewIcon,
  Share as ShareIcon,
  AttachMoney as DollarIcon
} from "@mui/icons-material";
import { 
  Button, 
  Card, 
  CardHeader, 
  CardContent, 
  Select, 
  MenuItem, 
  SelectChangeEvent,
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
  CircularProgress
} from "@mui/material";
import { v4 as uuidv4 } from 'uuid';

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  form: string;
  frequency: string;
  startDate: string;
  endDate: string;
  prescribedBy: string;
  pharmacy: string;
  refillsLeft: number;
  nextRefill: string;
  status: "active" | "pending" | "completed" | "discontinued";
  interactions: string[];
  cost: string;
  instructions: string;
}

interface PrescriptionHistory {
  id: string;
  medication: string;
  dosage: string;
  period: string;
  reason: string;
  status: "completed" | "discontinued";
}

interface DrugInteraction {
  id: string;
  drug1: string;
  drug2: string;
  severity: "low" | "medium" | "high";
  description: string;
}

const Prescriptions = () => {
  // State for prescriptions data
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [prescriptionHistory, setPrescriptionHistory] = useState<PrescriptionHistory[]>([]);
  const [drugInteractions, setDrugInteractions] = useState<DrugInteraction[]>([]);

  // State for filters and search
  const [selectedPatient, setSelectedPatient] = useState<string>("john-doe");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // State for form dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPrescription, setCurrentPrescription] = useState<Prescription | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // State for voice prescribing
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // State for notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info">("success");

  // Current patient data
  const currentPatient = {
    name: "John Doe",
    id: "#12345",
    age: 45,
    lastPrescription: "2 days ago",
    compliance: 92,
    pharmacy: "CVS Main St"
  };

  // Initialize with sample data
  useEffect(() => {
    const initialPrescriptions: Prescription[] = [
      {
        id: uuidv4(),
        medication: "Metformin",
        dosage: "500mg",
        form: "tablet",
        frequency: "Twice daily",
        startDate: "2024-05-01",
        endDate: "2024-11-01",
        prescribedBy: "Dr. Smith",
        pharmacy: "CVS Main St",
        refillsLeft: 3,
        nextRefill: "2024-11-15",
        status: "active",
        interactions: [],
        cost: "$15",
        instructions: "Take with meals"
      },
      {
        id: uuidv4(),
        medication: "Lisinopril",
        dosage: "10mg",
        form: "capsule",
        frequency: "Once daily",
        startDate: "2024-03-15",
        endDate: "2024-09-15",
        prescribedBy: "Dr. Johnson",
        pharmacy: "Walgreens #4251",
        refillsLeft: 5,
        nextRefill: "2024-12-01",
        status: "active",
        interactions: [],
        cost: "$8",
        instructions: "Take in the morning"
      },
      {
        id: uuidv4(),
        medication: "Amoxicillin",
        dosage: "500mg",
        form: "capsule",
        frequency: "Three times daily",
        startDate: "2024-10-15",
        endDate: "2024-10-22",
        prescribedBy: "Dr. Patel",
        pharmacy: "Not selected",
        refillsLeft: 0,
        nextRefill: "N/A",
        status: "pending",
        interactions: ["Penicillin allergy"],
        cost: "Pending",
        instructions: "Take until finished"
      }
    ];

    const initialHistory: PrescriptionHistory[] = [
      {
        id: uuidv4(),
        medication: "Atorvastatin",
        dosage: "20mg",
        period: "Jan 2024 - Sep 2024",
        reason: "Completed course",
        status: "completed"
      },
      {
        id: uuidv4(),
        medication: "Ibuprofen",
        dosage: "400mg",
        period: "Aug 2024 - Aug 2024",
        reason: "Short-term use",
        status: "completed"
      }
    ];

    const initialInteractions: DrugInteraction[] = [
      {
        id: uuidv4(),
        drug1: "Warfarin",
        drug2: "Aspirin",
        severity: "high",
        description: "Increased bleeding risk"
      }
    ];

    setPrescriptions(initialPrescriptions);
    setPrescriptionHistory(initialHistory);
    setDrugInteractions(initialInteractions);
  }, []);

  // Filter prescriptions based on selected filters and search term
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesStatus = filterStatus === "all" || prescription.status === filterStatus;
    const matchesSearch = searchTerm === "" || 
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.dosage.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const stats = {
    active: prescriptions.filter(p => p.status === "active").length,
    pending: prescriptions.filter(p => p.status === "pending").length,
    history: prescriptionHistory.length,
    compliance: currentPatient.compliance
  };

  // Status color mapping with medical-appropriate colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return { bg: "#e8f5e9", text: "#2e7d32", border: "#c8e6c9" }; // Light green
      case "pending":
        return { bg: "#e3f2fd", text: "#1565c0", border: "#bbdefb" }; // Light blue
      case "completed":
        return { bg: "#f3e5f5", text: "#7b1fa2", border: "#e1bee7" }; // Light purple
      case "discontinued":
        return { bg: "#e0e0e0", text: "#424242", border: "#bdbdbd" }; // Light gray
      default:
        return { bg: "#f5f5f5", text: "#424242", border: "#e0e0e0" };
    }
  };

  // CRUD Operations
  const handleAddPrescription = () => {
    setCurrentPrescription({
      id: uuidv4(),
      medication: "",
      dosage: "",
      form: "tablet",
      frequency: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
      prescribedBy: "",
      pharmacy: "",
      refillsLeft: 0,
      nextRefill: "",
      status: "active",
      interactions: [],
      cost: "",
      instructions: ""
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEditPrescription = (prescription: Prescription) => {
    setCurrentPrescription(prescription);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDeletePrescription = (id: string) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
    showNotification("Prescription deleted successfully", "success");
  };

  const handleSavePrescription = () => {
    if (!currentPrescription) return;

    if (isEditing) {
      setPrescriptions(prescriptions.map(p => 
        p.id === currentPrescription.id ? currentPrescription : p
      ));
      showNotification("Prescription updated successfully", "success");
    } else {
      setPrescriptions([...prescriptions, currentPrescription]);
      showNotification("Prescription added successfully", "success");
    }

    setOpenDialog(false);
  };

  const handleVoicePrescribing = () => {
    setIsVoiceMode(!isVoiceMode);
    if (!isVoiceMode) {
      showNotification("Voice prescribing activated. Say your prescription...", "info");
      setIsListening(true);
      // Simulate voice recognition after 3 seconds
      setTimeout(() => {
        setIsListening(false);
        setCurrentPrescription({
          id: uuidv4(),
          medication: "Amoxicillin",
          dosage: "500mg",
          form: "capsule",
          frequency: "Three times daily",
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          prescribedBy: "Dr. Smith",
          pharmacy: "CVS Main St",
          refillsLeft: 0,
          nextRefill: "N/A",
          status: "active",
          interactions: [],
          cost: "$10",
          instructions: "Take until finished"
        });
        showNotification("Voice prescription captured", "success");
        setOpenDialog(true);
      }, 3000);
    }
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
  const handlePatientChange = (event: SelectChangeEvent) => {
    setSelectedPatient(event.target.value as string);
  };

  const handleFilterStatusChange = (event: SelectChangeEvent) => {
    setFilterStatus(event.target.value as string);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5faf7' }}>
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
              <PillIcon sx={{ color: '#2A7F62', fontSize: 32 }} />
              <Typography variant="h4" component="h1" fontWeight="bold" color="#2A7F62">
                Prescription Management
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
             
              
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: '7xl', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 4 }}>
        <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { lg: '3fr 1fr' } }}>
          {/* Main Content */}
          <Box>
            {/* Patient Selector & Filters */}
            <Card sx={{ mb: 3, boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">Patient:</Typography>
                    <Select
                      value={selectedPatient}
                      onChange={handlePatientChange}
                      size="small"
                      sx={{ minWidth: 180 }}
                    >
                      <MenuItem value="john-doe">John Doe (#12345)</MenuItem>
                      <MenuItem value="jane-roe">Jane Roe (#67890)</MenuItem>
                    </Select>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FilterIcon fontSize="small" color="action" />
                    <Select
                      value={filterStatus}
                      onChange={handleFilterStatusChange}
                      size="small"
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="discontinued">Discontinued</MenuItem>
                    </Select>
                  </Box>

                  <TextField
                    placeholder="Search medications..."
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
                    sx={{ flex: 1, maxWidth: 500 }}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Patient Summary */}
            <Card sx={{ mb: 3, boxShadow: 2 }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 48, 
                          height: 48, 
                          bgcolor: '#2A7F62',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '1rem'
                        }}
                      >
                        {currentPatient.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="medium">
                          {currentPatient.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {currentPatient.id} • Age: {currentPatient.age}
                        </Typography>
                      </Box>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="body2" color="text.secondary">
                        Medication Compliance
                      </Typography>
                      <Typography variant="h6" color="#2A7F62" fontWeight="medium">
                        {stats.compliance}%
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <CardContent>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Typography variant="body2">
                    <Box component="span" color="text.secondary">Last prescription:</Box>
                    <Box component="span" ml={1} fontWeight="medium">{currentPatient.lastPrescription}</Box>
                  </Typography>
                  <Typography variant="body2">
                    <Box component="span" color="text.secondary">Preferred pharmacy:</Box>
                    <Box component="span" ml={1} fontWeight="medium">{currentPatient.pharmacy}</Box>
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Prescriptions Table */}
            <Card sx={{ boxShadow: 2 }}>
              <CardHeader 
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PillIcon sx={{ color: '#2A7F62' }} />
                    <Typography variant="h6">Active Prescriptions</Typography>
                    <Box sx={{ flex: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {filteredPrescriptions.length} records found
                    </Typography>
                  </Box>
                }
              />
              <CardContent sx={{ p: 0 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#e8f5e9' }}>
                      <TableCell sx={{ fontWeight: 'medium' }}>Medication</TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>Dosage</TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>Frequency</TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPrescriptions.map((prescription) => {
                      const statusColor = getStatusColor(prescription.status);
                      return (
                        <TableRow 
                          key={prescription.id} 
                          hover
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell>
                            <Box>
                              <Typography fontWeight="medium">{prescription.medication}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {prescription.form} • {prescription.dosage}
                              </Typography>
                              {prescription.interactions.length > 0 && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                  <AlertIcon fontSize="small" color="error" />
                                  <Typography variant="caption" color="error">
                                    {prescription.interactions.join(", ")}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="medium">{prescription.dosage}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {prescription.form}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{prescription.frequency}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {prescription.instructions}
                            </Typography>
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
                              {prescription.status === "active" && <CheckIcon fontSize="small" sx={{ mr: 0.5 }} />}
                              {prescription.status === "pending" && <ClockIcon fontSize="small" sx={{ mr: 0.5 }} />}
                              {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                              {prescription.status === "active" && (
                                <Typography variant="caption" sx={{ ml: 1 }}>
                                  Refills: {prescription.refillsLeft}
                                </Typography>
                              )}
                            </Box>
                            {prescription.status === "active" && (
                              <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                                Next refill: {prescription.nextRefill}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton
                                onClick={() => handleEditPrescription(prescription)}
                                size="small"
                                sx={{ color: '#2196f3' }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDeletePrescription(prescription.id)}
                                size="small"
                                sx={{ color: '#f44336' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                              {prescription.status === "active" && (
                                <IconButton
                                  onClick={() => showNotification(`Renewed ${prescription.medication}`, "success")}
                                  size="small"
                                  sx={{ color: '#2A7F62' }}
                                >
                                  <RenewIcon fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                onClick={() => showNotification(`Sent ${prescription.medication} to pharmacy`, "success")}
                                size="small"
                                sx={{ color: '#2A7F62' }}
                              >
                                <ShareIcon fontSize="small" />
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

            {/* Prescription History */}
            <Card sx={{ mt: 3, boxShadow: 2 }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckIcon sx={{ color: '#2A7F62' }} />
                    <Typography variant="h6">Prescription History</Typography>
                  </Box>
                }
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {prescriptionHistory.map((item) => (
                    <Box 
                      key={item.id}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        p: 2, 
                        bgcolor: '#f3e5f5', 
                        borderRadius: 1,
                        border: '1px solid #e1bee7'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: '#7b1fa2', 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <CheckIcon sx={{ color: 'white', fontSize: 16 }} />
                        </Box>
                        <Box>
                          <Typography fontWeight="medium">{item.medication} {item.dosage}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.period} • {item.reason}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        label={item.status.charAt(0).toUpperCase() + item.status.slice(1)} 
                        sx={{ 
                          bgcolor: '#e1bee7', 
                          color: '#7b1fa2',
                          border: '1px solid #ce93d8'
                        }}
                        size="small"
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Sidebar */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Prescription Stats */}
            <Card sx={{ boxShadow: 2 }}>
              <CardHeader 
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <StatsIcon sx={{ color: '#2A7F62' }} />
                    <Typography variant="h6">Prescription Summary</Typography>
                  </Box>
                }
              />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box textAlign="center">
                  <Typography variant="h3" color="#2A7F62" fontWeight="bold">
                    {stats.active}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Active Prescriptions
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: '#e3f2fd', 
                    borderRadius: 1,
                    border: '1px solid #bbdefb',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h5" color="#1565c0" fontWeight="bold">
                      {stats.pending}
                    </Typography>
                    <Typography variant="caption" color="#1565c0">
                      Pending
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: '#f3e5f5', 
                    borderRadius: 1,
                    border: '1px solid #e1bee7',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h5" color="#7b1fa2" fontWeight="bold">
                      {stats.history}
                    </Typography>
                    <Typography variant="caption" color="#7b1fa2">
                      Past Medications
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Drug Interactions */}
            <Card sx={{ boxShadow: 2 }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AlertIcon color="warning" />
                    <Typography variant="h6" color="#ff9800">
                      Safety Alerts
                    </Typography>
                  </Box>
                }
              />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {drugInteractions.length > 0 ? (
                  drugInteractions.map((interaction) => {
                    const severityColor = interaction.severity === "high" ? 
                      { bg: "#ffebee", text: "#c62828", border: "#ffcdd2" } :
                      interaction.severity === "medium" ? 
                      { bg: "#fff8e1", text: "#ff8f00", border: "#ffecb3" } :
                      { bg: "#e8f5e9", text: "#2e7d32", border: "#c8e6c9" };

                    return (
                      <Box 
                        key={interaction.id}
                        sx={{ 
                          p: 2, 
                          bgcolor: severityColor.bg, 
                          borderRadius: 1,
                          border: `1px solid ${severityColor.border}`
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography fontWeight="medium" color={severityColor.text}>
                            {interaction.drug1} + {interaction.drug2}
                          </Typography>
                          <Box sx={{ 
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: severityColor.bg,
                            color: severityColor.text,
                            border: `1px solid ${severityColor.border}`,
                            fontSize: '0.75rem'
                          }}>
                            {interaction.severity.toUpperCase()}
                          </Box>
                        </Box>
                        <Typography variant="body2" color={severityColor.text}>
                          {interaction.description}
                        </Typography>
                      </Box>
                    );
                  })
                ) : (
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: '#e8f5e9', 
                    borderRadius: 1,
                    border: '1px solid #c8e6c9',
                    textAlign: 'center'
                  }}>
                    <Typography variant="body2" color="#2e7d32">
                      No significant drug interactions detected
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card sx={{ boxShadow: 2 }}>
              <CardHeader title="Quick Actions" />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={() => window.print()}
                  startIcon={<PrintIcon />}
                  sx={{ 
                    color: '#2A7F62', 
                    borderColor: '#2A7F62',
                    '&:hover': {
                      borderColor: '#1e6b50',
                      backgroundColor: '#2A7F6210'
                    }
                  }}
                >
                  Print Medication List
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={() => showNotification("QR code generated for medication list", "success")}
                  startIcon={<QrCodeIcon />}
                  sx={{ 
                    color: '#2A7F62', 
                    borderColor: '#2A7F62',
                    '&:hover': {
                      borderColor: '#1e6b50',
                      backgroundColor: '#2A7F6210'
                    }
                  }}
                >
                  Share QR Code
                </Button>
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={handleAddPrescription}
                  startIcon={<PlusIcon />}
                  sx={{ 
                    bgcolor: '#2A7F62', 
                    '&:hover': { bgcolor: '#1e6b50' }
                  }}
                >
                  New Prescription
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* Add/Edit Prescription Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? "Edit Prescription" : "Add New Prescription"}</DialogTitle>
        <DialogContent>
          {currentPrescription && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                label="Medication Name"
                value={currentPrescription.medication}
                onChange={(e) => setCurrentPrescription({...currentPrescription, medication: e.target.value})}
                fullWidth
                margin="normal"
                required
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Dosage"
                  value={currentPrescription.dosage}
                  onChange={(e) => setCurrentPrescription({...currentPrescription, dosage: e.target.value})}
                  fullWidth
                  margin="normal"
                  required
                />
                <Select
                  value={currentPrescription.form}
                  onChange={(e) => setCurrentPrescription({...currentPrescription, form: e.target.value as string})}
                  fullWidth
                  margin="dense"
                >
                  <MenuItem value="tablet">Tablet</MenuItem>
                  <MenuItem value="capsule">Capsule</MenuItem>
                  <MenuItem value="liquid">Liquid</MenuItem>
                  <MenuItem value="injection">Injection</MenuItem>
                  <MenuItem value="cream">Cream</MenuItem>
                </Select>
              </Box>
              <TextField
                label="Frequency"
                value={currentPrescription.frequency}
                onChange={(e) => setCurrentPrescription({...currentPrescription, frequency: e.target.value})}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Instructions"
                value={currentPrescription.instructions}
                onChange={(e) => setCurrentPrescription({...currentPrescription, instructions: e.target.value})}
                fullWidth
                margin="normal"
                multiline
                rows={2}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={currentPrescription.startDate}
                  onChange={(e) => setCurrentPrescription({...currentPrescription, startDate: e.target.value})}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={currentPrescription.endDate}
                  onChange={(e) => setCurrentPrescription({...currentPrescription, endDate: e.target.value})}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Prescribed By"
                  value={currentPrescription.prescribedBy}
                  onChange={(e) => setCurrentPrescription({...currentPrescription, prescribedBy: e.target.value})}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Pharmacy"
                  value={currentPrescription.pharmacy}
                  onChange={(e) => setCurrentPrescription({...currentPrescription, pharmacy: e.target.value})}
                  fullWidth
                  margin="normal"
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Refills Left"
                  type="number"
                  value={currentPrescription.refillsLeft}
                  onChange={(e) => setCurrentPrescription({...currentPrescription, refillsLeft: parseInt(e.target.value) || 0})}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Next Refill Date"
                  type="date"
                  value={currentPrescription.nextRefill}
                  onChange={(e) => setCurrentPrescription({...currentPrescription, nextRefill: e.target.value})}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Select
                  value={currentPrescription.status}
                  onChange={(e) => setCurrentPrescription({...currentPrescription, status: e.target.value as any})}
                  fullWidth
                  margin="dense"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="discontinued">Discontinued</MenuItem>
                </Select>
                <TextField
                  label="Cost"
                  value={currentPrescription.cost}
                  onChange={(e) => setCurrentPrescription({...currentPrescription, cost: e.target.value})}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Box>
            </Box>
          )}
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
            onClick={handleSavePrescription}
            startIcon={<SaveIcon />}
            sx={{ 
              color: '#2A7F62',
              '&:hover': {
                backgroundColor: '#2A7F6210'
              }
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

export default Prescriptions;