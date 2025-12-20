"use client";
import { useState, useEffect } from "react";
import { 
  Shield as ShieldIcon, 
  Add as PlusIcon, 
  Search as SearchIcon, 
  FilterAlt as FilterIcon,
  CalendarToday as CalendarDaysIcon,
  Person as UserIcon,
  Warning as AlertTriangleIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as ClockIcon,
  Edit as EditIcon,
  Print as PrinterIcon,
  QrCode as QrCodeIcon,
  TrendingUp as TrendingUpIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Menu as MenuIcon
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
  useMediaQuery,
  Theme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from "@mui/material";
import { v4 as uuidv4 } from 'uuid';

interface Vaccination {
  id: string;
  vaccine: string;
  manufacturer: string;
  lotNumber: string;
  dateGiven: string;
  nextDue: string;
  administeredBy: string;
  location: string;
  status: "completed" | "due" | "overdue" | "scheduled";
  reactions: string;
  certificate: boolean;
}

interface VaccinationHistory {
  id: string;
  vaccine: string;
  series: string;
  lastDate: string;
  status: string;
}

interface UpcomingVaccination {
  id: string;
  vaccine: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  reason: string;
}

const Vaccinations = () => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // State for vaccinations data
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [vaccinationHistory, setVaccinationHistory] = useState<VaccinationHistory[]>([]);
  const [upcomingVaccinations, setUpcomingVaccinations] = useState<UpcomingVaccination[]>([]);

  // State for filters and search
  const [selectedPatient, setSelectedPatient] = useState<string>("john-doe");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // State for form dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [currentVaccination, setCurrentVaccination] = useState<Vaccination | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // State for notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  // Current patient data
  const currentPatient = {
    name: "John Doe",
    id: "#12345",
    age: 45,
    lastVaccination: "6 months ago",
    upcomingDue: "Annual Flu Shot",
    compliance: 95
  };

  // Initialize with sample data
  useEffect(() => {
    const initialVaccinations: Vaccination[] = [
      {
        id: uuidv4(),
        vaccine: "COVID-19 Booster",
        manufacturer: "Pfizer-BioNTech",
        lotNumber: "FF2589",
        dateGiven: "2024-10-15",
        nextDue: "2025-04-15",
        administeredBy: "Dr. Smith",
        location: "Main Clinic",
        status: "completed",
        reactions: "None reported",
        certificate: true
      },
      {
        id: uuidv4(),
        vaccine: "Influenza (Flu)",
        manufacturer: "Sanofi Pasteur",
        lotNumber: "FLU2024-A",
        dateGiven: "2024-09-20",
        nextDue: "2025-09-20",
        administeredBy: "Nurse Johnson",
        location: "Main Clinic",
        status: "completed",
        reactions: "Mild soreness at injection site",
        certificate: true
      },
      {
        id: uuidv4(),
        vaccine: "Tetanus-Diphtheria",
        manufacturer: "GlaxoSmithKline",
        lotNumber: "TD2024-B",
        dateGiven: "2023-08-10",
        nextDue: "2033-08-10",
        administeredBy: "Dr. Patel",
        location: "Main Clinic",
        status: "completed",
        reactions: "None reported",
        certificate: true
      },
      {
        id: uuidv4(),
        vaccine: "Hepatitis B",
        manufacturer: "Merck",
        lotNumber: "HEP2024-C",
        dateGiven: "N/A",
        nextDue: "2024-12-01",
        administeredBy: "N/A",
        location: "N/A",
        status: "due",
        reactions: "N/A",
        certificate: false
      }
    ];

    const initialHistory: VaccinationHistory[] = [
      {
        id: uuidv4(),
        vaccine: "MMR (Measles, Mumps, Rubella)",
        series: "Complete (2 doses)",
        lastDate: "1995-06-15",
        status: "protected"
      },
      {
        id: uuidv4(),
        vaccine: "Polio",
        series: "Complete (4 doses)",
        lastDate: "1985-04-20",
        status: "protected"
      },
      {
        id: uuidv4(),
        vaccine: "Varicella (Chickenpox)",
        series: "Complete (2 doses)",
        lastDate: "2010-03-12",
        status: "protected"
      }
    ];

    const initialUpcoming: UpcomingVaccination[] = [
      {
        id: uuidv4(),
        vaccine: "Hepatitis B",
        dueDate: "2024-12-01",
        priority: "high",
        reason: "Travel requirement"
      },
      {
        id: uuidv4(),
        vaccine: "Pneumococcal",
        dueDate: "2025-01-15",
        priority: "medium",
        reason: "Age-based recommendation"
      }
    ];

    setVaccinations(initialVaccinations);
    setVaccinationHistory(initialHistory);
    setUpcomingVaccinations(initialUpcoming);
  }, []);

  // Filter vaccinations based on selected filters and search term
  const filteredVaccinations = vaccinations.filter(vaccination => {
    const matchesType = filterType === "all" || 
      (filterType === "covid" && vaccination.vaccine.includes("COVID")) ||
      (filterType === "flu" && vaccination.vaccine.includes("Influenza")) ||
      (filterType === "routine" && !vaccination.vaccine.includes("COVID") && !vaccination.vaccine.includes("Influenza"));

    const matchesStatus = filterStatus === "all" || vaccination.status === filterStatus;

    const matchesSearch = searchTerm === "" || 
      vaccination.vaccine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaccination.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaccination.dateGiven.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });

  const stats = {
    total: vaccinations.filter(v => v.status === "completed").length,
    due: vaccinations.filter(v => v.status === "due").length,
    protected: vaccinationHistory.length,
    compliance: currentPatient.compliance
  };

  // Status color mapping with light green variations
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return { bg: "#e8f5e9", text: "#2e7d32", border: "#c8e6c9" }; // Light green
      case "due":
        return { bg: "#fff8e1", text: "#ff8f00", border: "#ffecb3" }; // Light amber
      case "overdue":
        return { bg: "#ffebee", text: "#c62828", border: "#ffcdd2" }; // Light red
      case "scheduled":
        return { bg: "#e3f2fd", text: "#1565c0", border: "#bbdefb" }; // Light blue
      default:
        return { bg: "#f5f5f5", text: "#424242", border: "#e0e0e0" };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return { bg: "#ffebee", text: "#c62828", border: "#ffcdd2" };
      case "medium":
        return { bg: "#fff8e1", text: "#ff8f00", border: "#ffecb3" };
      case "low":
        return { bg: "#e8f5e9", text: "#2e7d32", border: "#c8e6c9" };
      default:
        return { bg: "#f5f5f5", text: "#424242", border: "#e0e0e0" };
    }
  };

  // CRUD Operations
  const handleAddVaccination = () => {
    setCurrentVaccination({
      id: uuidv4(),
      vaccine: "",
      manufacturer: "",
      lotNumber: "",
      dateGiven: "",
      nextDue: "",
      administeredBy: "",
      location: "",
      status: "scheduled",
      reactions: "None reported",
      certificate: false
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEditVaccination = (vaccination: Vaccination) => {
    setCurrentVaccination(vaccination);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDeleteVaccination = (id: string) => {
    setVaccinations(vaccinations.filter(v => v.id !== id));
    showNotification("Vaccination deleted successfully", "success");
  };

  const handleSaveVaccination = () => {
    if (!currentVaccination) return;

    if (isEditing) {
      setVaccinations(vaccinations.map(v => 
        v.id === currentVaccination.id ? currentVaccination : v
      ));
      showNotification("Vaccination updated successfully", "success");
    } else {
      setVaccinations([...vaccinations, currentVaccination]);
      showNotification("Vaccination added successfully", "success");
    }

    setOpenDialog(false);
  };

  const showNotification = (message: string, severity: "success" | "error") => {
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

  const handleFilterTypeChange = (event: SelectChangeEvent) => {
    setFilterType(event.target.value as string);
  };

  const handleFilterStatusChange = (event: SelectChangeEvent) => {
    setFilterStatus(event.target.value as string);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Mobile sidebar content
  const mobileSidebar = (
    <Box>
      <VaccinationStats stats={stats} />
      <UpcomingVaccinations upcoming={upcomingVaccinations} getPriorityColor={getPriorityColor} />
      <QuickActions onAddVaccination={handleAddVaccination} />
    </Box>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5faf5' }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: 'white', 
        borderBottom: 1, 
        borderColor: 'divider',
        boxShadow: 1,
        position: 'sticky',
        top: 0,
        zIndex: 1100
      }}>
        <Box sx={{ maxWidth: '7xl', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isMobile && (
                <IconButton onClick={handleDrawerToggle} sx={{ color: '#2A7F62' }}>
                  <MenuIcon />
                </IconButton>
              )}
              <ShieldIcon sx={{ color: '#2A7F62', fontSize: 32 }} />
              <Typography variant="h6" component="h1" fontWeight="bold" color="#2A7F62">
                Vaccination Management
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<PlusIcon />}
              onClick={handleAddVaccination}
              sx={{
                bgcolor: '#2A7F62',
                '&:hover': { bgcolor: '#1e6b50' },
                color: 'white',
                whiteSpace: 'nowrap'
              }}
            >
              {isMobile ? 'Add' : 'Add Vaccination'}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            p: 2,
            bgcolor: '#f5faf5'
          },
        }}
      >
        {mobileSidebar}
      </Drawer>

      <Box sx={{ 
        maxWidth: '7xl', 
        mx: 'auto', 
        px: { xs: 2, sm: 3, lg: 4 }, 
        py: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}>
        {/* Filters Card */}
        <Card sx={{ boxShadow: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: '1 1 100%' }}>
                <Typography variant="body2">Patient:</Typography>
                <Select
                  value={selectedPatient}
                  onChange={handlePatientChange}
                  size="small"
                  sx={{ flex: 1 }}
                >
                  <MenuItem value="john-doe">John Doe (#12345)</MenuItem>
                  <MenuItem value="jane-roe">Jane Roe (#67890)</MenuItem>
                </Select>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: '1 1 45%' }}>
                <FilterIcon fontSize="small" color="action" />
                <Select
                  value={filterType}
                  onChange={handleFilterTypeChange}
                  size="small"
                  sx={{ flex: 1 }}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="covid">COVID-19</MenuItem>
                  <MenuItem value="flu">Influenza</MenuItem>
                  <MenuItem value="routine">Routine</MenuItem>
                </Select>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: '1 1 45%' }}>
                <Select
                  value={filterStatus}
                  onChange={handleFilterStatusChange}
                  size="small"
                  sx={{ flex: 1 }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="due">Due</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                </Select>
              </Box>

              <Box sx={{ flex: '1 1 100%' }}>
                <TextField
                  placeholder="Search vaccines..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Patient Summary */}
        <Card sx={{ boxShadow: 2 }}>
          <CardHeader
            title={
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 2
              }}>
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
                <Box textAlign={isMobile ? 'left' : 'right'} mt={isMobile ? 1 : 0}>
                  <Typography variant="body2" color="text.secondary">
                    Vaccination Compliance
                  </Typography>
                  <Typography variant="h6" color="#2A7F62" fontWeight="medium">
                    {stats.compliance}%
                  </Typography>
                </Box>
              </Box>
            }
          />
          <CardContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Typography variant="body2">
                <Box component="span" color="text.secondary">Last vaccination:</Box>
                <Box component="span" ml={1} fontWeight="medium">{currentPatient.lastVaccination}</Box>
              </Typography>
              <Typography variant="body2">
                <Box component="span" color="text.secondary">Next due:</Box>
                <Box component="span" ml={1} fontWeight="medium" color="#ff9800">
                  {currentPatient.upcomingDue}
                </Box>
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <Box sx={{ 
          display: 'grid', 
          gap: 4, 
          gridTemplateColumns: { xs: '1fr', md: '3fr 1fr' } 
        }}>
          {/* Main Content */}
          <Box>
            {/* Vaccinations Table */}
            <Card sx={{ boxShadow: 2 }}>
              <CardHeader 
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ShieldIcon sx={{ color: '#2A7F62' }} />
                    <Typography variant="h6">Vaccination Records</Typography>
                    <Box sx={{ flex: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {filteredVaccinations.length} records found
                    </Typography>
                  </Box>
                }
              />
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#e8f5e9' }}>
                        <TableCell sx={{ fontWeight: 'medium' }}>Vaccine</TableCell>
                        <TableCell sx={{ fontWeight: 'medium' }}>Date Given</TableCell>
                        <TableCell sx={{ fontWeight: 'medium' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 'medium' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredVaccinations.map((vaccination) => {
                        const statusColor = getStatusColor(vaccination.status);
                        return (
                          <TableRow 
                            key={vaccination.id} 
                            hover
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell>
                              <Box>
                                <Typography fontWeight="medium">{vaccination.vaccine}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {vaccination.manufacturer} • Lot: {vaccination.lotNumber}
                                </Typography>
                                {vaccination.reactions !== "None reported" && vaccination.reactions !== "N/A" && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                    <AlertTriangleIcon fontSize="small" color="error" />
                                    <Typography variant="caption" color="error">
                                      {vaccination.reactions}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarDaysIcon fontSize="small" sx={{ color: '#2A7F62' }} />
                                <Box>
                                  <Typography fontWeight="medium">
                                    {vaccination.dateGiven !== "N/A" ? vaccination.dateGiven : "Not given"}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {vaccination.location}
                                  </Typography>
                                </Box>
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
                                {vaccination.status === "completed" && <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />}
                                {vaccination.status === "due" && <ClockIcon fontSize="small" sx={{ mr: 0.5 }} />}
                                {vaccination.status.charAt(0).toUpperCase() + vaccination.status.slice(1)}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <IconButton
                                  onClick={() => handleEditVaccination(vaccination)}
                                  size="small"
                                  sx={{ color: '#2196f3' }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleDeleteVaccination(vaccination.id)}
                                  size="small"
                                  sx={{ color: '#f44336' }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                                {vaccination.certificate && (
                                  <IconButton
                                    onClick={() => window.print()}
                                    size="small"
                                    sx={{ color: '#2A7F62' }}
                                  >
                                    <PrinterIcon fontSize="small" />
                                  </IconButton>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
              </CardContent>
            </Card>

            {/* Vaccination History */}
            <Card sx={{ mt: 3, boxShadow: 2 }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckCircleIcon sx={{ color: '#2A7F62' }} />
                    <Typography variant="h6">Lifetime Protection History</Typography>
                  </Box>
                }
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {vaccinationHistory.map((item) => (
                    <Box 
                      key={item.id}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        p: 2, 
                        bgcolor: '#e8f5e9', 
                        borderRadius: 1,
                        border: '1px solid #c8e6c9'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: '#2A7F62', 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <CheckCircleIcon sx={{ color: 'white', fontSize: 16 }} />
                        </Box>
                        <Box>
                          <Typography fontWeight="medium">{item.vaccine}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.series} • Last: {item.lastDate}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        label="Protected" 
                        sx={{ 
                          bgcolor: '#c8e6c9', 
                          color: '#2e7d32',
                          border: '1px solid #a5d6a7'
                        }}
                        size="small"
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Sidebar - Hidden on mobile, shown in drawer */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 3 }}>
            <VaccinationStats stats={stats} />
            <UpcomingVaccinations upcoming={upcomingVaccinations} getPriorityColor={getPriorityColor} />
            <QuickActions onAddVaccination={handleAddVaccination} />
          </Box>
        </Box>
      </Box>

      {/* Add/Edit Vaccination Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullScreen={isMobile}>
        <DialogTitle>{isEditing ? "Edit Vaccination" : "Add New Vaccination"}</DialogTitle>
        <DialogContent>
          {currentVaccination && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                label="Vaccine Name"
                value={currentVaccination.vaccine}
                onChange={(e) => setCurrentVaccination({...currentVaccination, vaccine: e.target.value})}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Manufacturer"
                value={currentVaccination.manufacturer}
                onChange={(e) => setCurrentVaccination({...currentVaccination, manufacturer: e.target.value})}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Lot Number"
                value={currentVaccination.lotNumber}
                onChange={(e) => setCurrentVaccination({...currentVaccination, lotNumber: e.target.value})}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Date Given"
                type="date"
                value={currentVaccination.dateGiven}
                onChange={(e) => setCurrentVaccination({...currentVaccination, dateGiven: e.target.value})}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Next Due Date"
                type="date"
                value={currentVaccination.nextDue}
                onChange={(e) => setCurrentVaccination({...currentVaccination, nextDue: e.target.value})}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Administered By"
                value={currentVaccination.administeredBy}
                onChange={(e) => setCurrentVaccination({...currentVaccination, administeredBy: e.target.value})}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Location"
                value={currentVaccination.location}
                onChange={(e) => setCurrentVaccination({...currentVaccination, location: e.target.value})}
                fullWidth
                margin="normal"
              />
              <Select
                value={currentVaccination.status}
                onChange={(e) => setCurrentVaccination({...currentVaccination, status: e.target.value as any})}
                fullWidth
                margin="dense"
              >
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="due">Due</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
                <MenuItem value="scheduled">Scheduled</MenuItem>
              </Select>
              <TextField
                label="Reactions"
                value={currentVaccination.reactions}
                onChange={(e) => setCurrentVaccination({...currentVaccination, reactions: e.target.value})}
                fullWidth
                margin="normal"
              />
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
            onClick={handleSaveVaccination}
            startIcon={<SaveIcon />}
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

// Reusable components for sidebar sections
const VaccinationStats = ({ stats }: { stats: any }) => (
  <Card sx={{ boxShadow: 2 }}>
    <CardHeader 
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TrendingUpIcon sx={{ color: '#2A7F62' }} />
          <Typography variant="h6">Vaccination Summary</Typography>
        </Box>
      }
    />
    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box textAlign="center">
        <Typography variant="h3" color="#2A7F62" fontWeight="bold">
          {stats.total}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Completed Vaccines
        </Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Box sx={{ 
          p: 2, 
          bgcolor: '#fff8e1', 
          borderRadius: 1,
          border: '1px solid #ffecb3',
          textAlign: 'center'
        }}>
          <Typography variant="h5" color="#ff9800" fontWeight="bold">
            {stats.due}
          </Typography>
          <Typography variant="caption" color="#ff9800">
            Due Soon
          </Typography>
        </Box>
        <Box sx={{ 
          p: 2, 
          bgcolor: '#e8f5e9', 
          borderRadius: 1,
          border: '1px solid #c8e6c9',
          textAlign: 'center'
        }}>
          <Typography variant="h5" color="#2A7F62" fontWeight="bold">
            {stats.protected}
          </Typography>
          <Typography variant="caption" color="#2A7F62">
            Protected
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const UpcomingVaccinations = ({ 
  upcoming, 
  getPriorityColor 
}: { 
  upcoming: UpcomingVaccination[], 
  getPriorityColor: (priority: string) => any 
}) => (
  <Card sx={{ boxShadow: 2 }}>
    <CardHeader
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ClockIcon sx={{ color: '#2A7F62' }} />
          <Typography variant="h6" color="#2A7F62">
            Upcoming Due
          </Typography>
        </Box>
      }
    />
    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {upcoming.map((item) => {
        const priorityColor = getPriorityColor(item.priority);
        return (
          <Box 
            key={item.id}
            sx={{ 
              p: 2, 
              bgcolor: priorityColor.bg, 
              borderRadius: 1,
              border: `1px solid ${priorityColor.border}`
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography fontWeight="medium" color={priorityColor.text}>
                {item.vaccine}
              </Typography>
              <Box sx={{ 
                px: 1,
                py: 0.5,
                borderRadius: 1,
                bgcolor: priorityColor.bg,
                color: priorityColor.text,
                border: `1px solid ${priorityColor.border}`,
                fontSize: '0.75rem'
              }}>
                {item.priority.toUpperCase()}
              </Box>
            </Box>
            <Typography variant="body2" color={priorityColor.text}>
              Due: {item.dueDate}
            </Typography>
            <Typography variant="caption" color={priorityColor.text} mt={0.5}>
              {item.reason}
            </Typography>
          </Box>
        );
      })}
    </CardContent>
  </Card>
);

const QuickActions = ({ onAddVaccination }: { onAddVaccination: () => void }) => (
  <Card sx={{ boxShadow: 2 }}>
    <CardHeader title="Quick Actions" />
    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Button 
        variant="outlined" 
        fullWidth 
        onClick={() => window.print()}
        startIcon={<PrinterIcon />}
        sx={{ color: '#2A7F62', borderColor: '#2A7F62' }}
      >
        Print Vaccination Card
      </Button>
      <Button 
        variant="outlined" 
        fullWidth 
        onClick={() => alert("Generating QR code...")}
        startIcon={<QrCodeIcon />}
        sx={{ color: '#2A7F62', borderColor: '#2A7F62' }}
      >
        Digital Certificate
      </Button>
      <Button 
        variant="contained" 
        fullWidth 
        onClick={onAddVaccination}
        startIcon={<PlusIcon />}
        sx={{ bgcolor: '#2A7F62', '&:hover': { bgcolor: '#1e6b50' } }}
      >
        Schedule New Vaccine
      </Button>
    </CardContent>
  </Card>
);

export default Vaccinations;