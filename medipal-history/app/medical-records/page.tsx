"use client";
import { useState, useEffect } from "react";
import { 
  Description as FileTextIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Person as UserIcon,
  Favorite as HeartIcon,
  ShowChart as ActivityIcon,
  Image as ImageIcon,
  Medication as PillIcon,
  MedicalServices as ShieldIcon,
  Warning as AlertIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Archive as ArchiveIcon,
  Folder as DocumentsIcon,
  Add as AddIcon,
  FilterAlt as FilterIcon,
  CheckCircle as CheckIcon,
  AccessTime as ClockIcon,
  QrCode as QrCodeIcon,
  TrendingUp as TrendIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { v4 as uuidv4 } from 'uuid';

// Color theme with Cadmium Green (#2A7F62) as primary
const COLORS = {
  primary: '#2A7F62', // Cadmium Green
  primaryDark: '#1F6B53',
  primaryLight: '#E8F5E9',
  secondary: '#2196F3',
  warning: '#FF9800',
  warningLight: '#FFF8E1',
  error: '#F44336',
  errorLight: '#FFEBEE',
  success: '#4CAF50',
  successLight: '#E8F5E9',
  info: '#2196F3',
  infoLight: '#E3F2FD',
  textPrimary: '#212121',
  textSecondary: '#757575',
  background: '#F5F9F8',
  white: '#FFFFFF',
  divider: '#E0E0E0'
};

// Styled components with Cadmium Green buttons
const PrimaryButton = styled(Button)({
  backgroundColor: COLORS.primary,
  color: COLORS.white,
  '&:hover': {
    backgroundColor: COLORS.primaryDark
  }
});

const SecondaryButton = styled(Button)({
  backgroundColor: COLORS.white,
  color: COLORS.primary,
  border: `1px solid ${COLORS.primary}`,
  '&:hover': {
    backgroundColor: '#F5F5F5'
  }
});

const StyledCard = styled(Card)({
  backgroundColor: COLORS.white,
  border: `1px solid ${COLORS.divider}`,
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: '16px'
});

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  photo: string;
  lastVisit: string;
  lastDoctor: string;
  allergies: string[];
}

interface Visit {
  id: string;
  date: string;
  type: string;
  doctor: string;
  complaint: string;
  assessment: string;
  plan: string[];
}

interface LabResult {
  id: string;
  test: string;
  value: string;
  date: string;
  normalRange: string;
  status: 'normal' | 'abnormal' | 'critical';
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  status: 'active' | 'discontinued' | 'completed';
}

interface Image {
  id: string;
  name: string;
  type: 'X-Ray' | 'MRI' | 'CT' | 'Ultrasound' | 'Other';
  date: string;
  previewUrl: string;
}

interface Document {
  id: string;
  name: string;
  type: 'Report' | 'Prescription' | 'Referral' | 'Other';
  date: string;
  size: string;
}

const MedicalRecords = () => {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [visits, setVisits] = useState<Visit[]>([]);
  const [labs, setLabs] = useState<LabResult[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  
  // Form dialog states
  const [openVisitDialog, setOpenVisitDialog] = useState(false);
  const [openLabDialog, setOpenLabDialog] = useState(false);
  const [openMedDialog, setOpenMedDialog] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [openDocDialog, setOpenDocDialog] = useState(false);
  const [openPatientDialog, setOpenPatientDialog] = useState(false);
  const [currentVisit, setCurrentVisit] = useState<Visit | null>(null);
  const [currentLab, setCurrentLab] = useState<LabResult | null>(null);
  const [currentMed, setCurrentMed] = useState<Medication | null>(null);
  const [currentImage, setCurrentImage] = useState<Image | null>(null);
  const [currentDoc, setCurrentDoc] = useState<Document | null>(null);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newAllergy, setNewAllergy] = useState('');
  
  // Notification
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Initialize with sample data
  useEffect(() => {
    const samplePatients: Patient[] = [
      {
        id: '12345',
        name: 'padam bk',
        age: 45,
        gender: 'Male',
        bloodType: 'A+',
        photo: 'JD',
        lastVisit: '2023-10-15',
        lastDoctor: 'Dr. kreshna',
        allergies: ['Penicillin (Severe)', 'Shellfish (Mild)']
      },
      {
        id: '67890',
        name: 'hari devkota',
        age: 32,
        gender: 'Female',
        bloodType: 'O-',
        photo: 'JS',
        lastVisit: '2023-10-10',
        lastDoctor: 'Dr. Josheb',
        allergies: ['Latex']
      }
    ];

    const sampleVisits: Visit[] = [
      {
        id: uuidv4(),
        date: '2023-10-15',
        type: 'Follow Up',
        doctor: 'Dr. Bikash',
        complaint: 'Chest discomfort',
        assessment: 'Stable angina',
        plan: ['Increase statin dosage', 'Stress test ordered', 'Follow up in 2 weeks']
      },
      {
        id: uuidv4(),
        date: '2023-09-20',
        type: 'Annual shresth',
        doctor: 'Dr. Smith',
        complaint: 'Routine physical',
        assessment: 'Healthy',
        plan: ['Continue current regimen', 'Annual labs ordered']
      }
    ];

    const sampleLabs: LabResult[] = [
      {
        id: uuidv4(),
        test: 'HbA1c',
        value: '6.1%',
        date: '2023-10-10',
        normalRange: '< 5.7%',
        status: 'abnormal'
      },
      {
        id: uuidv4(),
        test: 'Cholesterol',
        value: '180 mg/dL',
        date: '2023-10-10',
        normalRange: '< 200 mg/dL',
        status: 'normal'
      }
    ];

    const sampleMeds: Medication[] = [
      {
        id: uuidv4(),
        name: 'Mahesh',
        dosage: '500 mg',
        frequency: 'Twice daily',
        status: 'active'
      },
      {
        id: uuidv4(),
        name: 'Atorvastatin',
        dosage: '20 mg',
        frequency: 'Once daily',
        status: 'active'
      }
    ];

    const sampleImages: Image[] = [
      {
        id: uuidv4(),
        name: 'Chest X-Ray',
        type: 'X-Ray',
        date: '2023-10-15',
        previewUrl: '/sample-xray.jpg'
      },
      {
        id: uuidv4(),
        name: 'Abdominal Ultrasound',
        type: 'Ultrasound',
        date: '2023-09-20',
        previewUrl: '/sample-ultrasound.jpg'
      }
    ];

    const sampleDocuments: Document[] = [
      {
        id: uuidv4(),
        name: 'Discharge Summary',
        type: 'Report',
        date: '2023-10-15',
        size: '2.4 MB'
      },
      {
        id: uuidv4(),
        name: 'Prescription - Oct 2023',
        type: 'Prescription',
        date: '2023-10-15',
        size: '1.1 MB'
      }
    ];

    setPatients(samplePatients);
    setSelectedPatient(samplePatients[0].id);
    setVisits(sampleVisits);
    setLabs(sampleLabs);
    setMedications(sampleMeds);
    setImages(sampleImages);
    setDocuments(sampleDocuments);
  }, []);

  // Filter data based on search and filters
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(globalSearchTerm.toLowerCase())
  );

  const filteredVisits = visits.filter(visit => 
    (visit.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
    visit.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.complaint.toLowerCase().includes(searchTerm.toLowerCase())) &&
    visit.date.includes(selectedPatient) // Simplified filter for demo
  );

  const filteredLabs = labs.filter(lab => 
    lab.test.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'all' || lab.status === filterType)
  );

  const filteredMeds = medications.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'all' || med.status === filterType)
  );

  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current patient data
  const currentPatientData = patients.find(p => p.id === selectedPatient) || patients[0];

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
      case 'active':
        return { bg: COLORS.successLight, text: COLORS.success, border: COLORS.primaryLight };
      case 'abnormal':
        return { bg: COLORS.warningLight, text: COLORS.warning, border: '#ffecb3' };
      case 'critical':
      case 'discontinued':
        return { bg: COLORS.errorLight, text: COLORS.error, border: '#ffcdd2' };
      default:
        return { bg: '#f5f5f5', text: COLORS.textPrimary, border: COLORS.divider };
    }
  };

  // Notification handler
  const showNotification = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Patient CRUD
  const handleAddPatient = () => {
    setCurrentPatient({
      id: uuidv4().substring(0, 5),
      name: '',
      age: 0,
      gender: 'Male',
      bloodType: 'A+',
      photo: '',
      lastVisit: new Date().toISOString().split('T')[0],
      lastDoctor: '',
      allergies: []
    });
    setIsEditing(false);
    setOpenPatientDialog(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setCurrentPatient(patient);
    setIsEditing(true);
    setOpenPatientDialog(true);
  };

  const handleSavePatient = () => {
    if (!currentPatient) return;

    if (isEditing) {
      setPatients(patients.map(p => p.id === currentPatient.id ? currentPatient : p));
    } else {
      setPatients([...patients, currentPatient]);
      setSelectedPatient(currentPatient.id);
    }

    showNotification(`Patient ${isEditing ? 'updated' : 'added'} successfully`, 'success');
    setOpenPatientDialog(false);
  };

  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter(p => p.id !== id));
    if (selectedPatient === id) {
      setSelectedPatient(patients[0]?.id || '');
    }
    showNotification('Patient deleted successfully', 'success');
  };

  const handleAddAllergy = () => {
    if (!newAllergy.trim() || !currentPatient) return;
    setCurrentPatient({
      ...currentPatient,
      allergies: [...currentPatient.allergies, newAllergy]
    });
    setNewAllergy('');
  };

  const handleRemoveAllergy = (allergy: string) => {
    if (!currentPatient) return;
    setCurrentPatient({
      ...currentPatient,
      allergies: currentPatient.allergies.filter(a => a !== allergy)
    });
  };

  // Visit CRUD
  const handleAddVisit = () => {
    setCurrentVisit({
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      type: '',
      doctor: '',
      complaint: '',
      assessment: '',
      plan: []
    });
    setIsEditing(false);
    setOpenVisitDialog(true);
  };

  const handleEditVisit = (visit: Visit) => {
    setCurrentVisit(visit);
    setIsEditing(true);
    setOpenVisitDialog(true);
  };

  const handleSaveVisit = () => {
    if (!currentVisit) return;

    if (isEditing) {
      setVisits(visits.map(v => v.id === currentVisit.id ? currentVisit : v));
    } else {
      setVisits([...visits, currentVisit]);
    }

    showNotification(`Visit ${isEditing ? 'updated' : 'added'} successfully`, 'success');
    setOpenVisitDialog(false);
  };

  const handleDeleteVisit = (id: string) => {
    setVisits(visits.filter(v => v.id !== id));
    showNotification('Visit deleted successfully', 'success');
  };

  // Lab CRUD
  const handleAddLab = () => {
    setCurrentLab({
      id: uuidv4(),
      test: '',
      value: '',
      date: new Date().toISOString().split('T')[0],
      normalRange: '',
      status: 'normal'
    });
    setIsEditing(false);
    setOpenLabDialog(true);
  };

  const handleEditLab = (lab: LabResult) => {
    setCurrentLab(lab);
    setIsEditing(true);
    setOpenLabDialog(true);
  };

  const handleSaveLab = () => {
    if (!currentLab) return;

    if (isEditing) {
      setLabs(labs.map(l => l.id === currentLab.id ? currentLab : l));
    } else {
      setLabs([...labs, currentLab]);
    }

    showNotification(`Lab result ${isEditing ? 'updated' : 'added'} successfully`, 'success');
    setOpenLabDialog(false);
  };

  const handleDeleteLab = (id: string) => {
    setLabs(labs.filter(l => l.id !== id));
    showNotification('Lab result deleted successfully', 'success');
  };

  // Medication CRUD
  const handleAddMed = () => {
    setCurrentMed({
      id: uuidv4(),
      name: '',
      dosage: '',
      frequency: '',
      status: 'active'
    });
    setIsEditing(false);
    setOpenMedDialog(true);
  };

  const handleEditMed = (med: Medication) => {
    setCurrentMed(med);
    setIsEditing(true);
    setOpenMedDialog(true);
  };

  const handleSaveMed = () => {
    if (!currentMed) return;

    if (isEditing) {
      setMedications(medications.map(m => m.id === currentMed.id ? currentMed : m));
    } else {
      setMedications([...medications, currentMed]);
    }

    showNotification(`Medication ${isEditing ? 'updated' : 'added'} successfully`, 'success');
    setOpenMedDialog(false);
  };

  const handleDeleteMed = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
    showNotification('Medication deleted successfully', 'success');
  };

  // Image CRUD
  const handleAddImage = () => {
    setCurrentImage({
      id: uuidv4(),
      name: '',
      type: 'X-Ray',
      date: new Date().toISOString().split('T')[0],
      previewUrl: ''
    });
    setIsEditing(false);
    setOpenImageDialog(true);
  };

  const handleEditImage = (image: Image) => {
    setCurrentImage(image);
    setIsEditing(true);
    setOpenImageDialog(true);
  };

  const handleSaveImage = () => {
    if (!currentImage) return;

    if (isEditing) {
      setImages(images.map(i => i.id === currentImage.id ? currentImage : i));
    } else {
      setImages([...images, currentImage]);
    }

    showNotification(`Image ${isEditing ? 'updated' : 'added'} successfully`, 'success');
    setOpenImageDialog(false);
  };

  const handleDeleteImage = (id: string) => {
    setImages(images.filter(i => i.id !== id));
    showNotification('Image deleted successfully', 'success');
  };

  // Document CRUD
  const handleAddDoc = () => {
    setCurrentDoc({
      id: uuidv4(),
      name: '',
      type: 'Report',
      date: new Date().toISOString().split('T')[0],
      size: '1 MB'
    });
    setIsEditing(false);
    setOpenDocDialog(true);
  };

  const handleEditDoc = (doc: Document) => {
    setCurrentDoc(doc);
    setIsEditing(true);
    setOpenDocDialog(true);
  };

  const handleSaveDoc = () => {
    if (!currentDoc) return;

    if (isEditing) {
      setDocuments(documents.map(d => d.id === currentDoc.id ? currentDoc : d));
    } else {
      setDocuments([...documents, currentDoc]);
    }

    showNotification(`Document ${isEditing ? 'updated' : 'added'} successfully`, 'success');
    setOpenDocDialog(false);
  };

  const handleDeleteDoc = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
    showNotification('Document deleted successfully', 'success');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: COLORS.background,
      color: COLORS.textPrimary
    }}>
      {/* Header */}
      <Box sx={{ 
        backgroundColor: COLORS.white,
        color: COLORS.textPrimary,
        padding: '16px 24px',
        boxShadow: 2,
        borderBottom: `1px solid ${COLORS.divider}`
      }}>
        <Box sx={{ 
          maxWidth: 'xl', 
          mx: 'auto',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FileTextIcon sx={{ fontSize: '32px', color: COLORS.primary }} />
            <Typography variant="h4" fontWeight="bold" color={COLORS.primary}>
              Medical Records
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              placeholder="Search..."
              variant="outlined"
              size="small"
              value={globalSearchTerm}
              onChange={(e) => setGlobalSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              sx={{ width: 300 }}
            />
            {/* <PrimaryButton startIcon={<AddIcon />} onClick={handleAddPatient}>
              New Patient
            </PrimaryButton> */}
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        maxWidth: 'xl', 
        mx: 'auto',
        padding: '24px',
        display: 'flex',
        gap: '24px'
      }}>
        {/* Patient Sidebar */}
        <Box sx={{ width: '300px', position: 'sticky', top: '24px', alignSelf: 'flex-start' }}>
          <Box sx={{ mb: 2 }}>
            <Select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value as string)}
              fullWidth
              size="small"
            >
              {filteredPatients.map(patient => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.name} (ID: {patient.id})
                </MenuItem>
              ))}
            </Select>
          </Box>

          <StyledCard>
            <CardHeader
              title={
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: COLORS.primary,
                      color: COLORS.white,
                      fontSize: '32px',
                      mb: 2,
                      mx: 'auto'
                    }}
                  >
                    {currentPatientData?.photo || 'JD'}
                  </Avatar>
                  <Typography variant="h6">{currentPatientData?.name || 'John Doe'}</Typography>
                  <Typography sx={{ color: COLORS.textSecondary }}>
                    {currentPatientData?.gender}, {currentPatientData?.age}yo | ID: {currentPatientData?.id}
                  </Typography>
                </Box>
              }
            />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>
                    Blood Type
                  </Typography>
                  <Typography sx={{ fontWeight: 'bold', color: COLORS.error }}>
                    {currentPatientData?.bloodType || 'A+'}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>
                    Last Visit
                  </Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {currentPatientData?.lastVisit || '2023-10-15'}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" fontWeight="medium" mb={1}>
                  Allergies
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {currentPatientData?.allergies.map(allergy => (
                    <Chip 
                      key={allergy}
                      label={allergy} 
                      size="small"
                      icon={<AlertIcon fontSize="small" />}
                      sx={{ 
                        backgroundColor: allergy.includes('Severe') ? `${COLORS.error}20` : `${COLORS.warning}20`,
                        color: allergy.includes('Severe') ? COLORS.error : COLORS.warning
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" fontWeight="medium" mb={1}>
                  Current Medications
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {medications.filter(m => m.status === 'active').slice(0, 3).map(med => (
                    <Box 
                      key={med.id}
                      sx={{ 
                        p: 1,
                        backgroundColor: `${COLORS.divider}30`,
                        borderRadius: '4px'
                      }}
                    >
                      <Typography variant="body2">{med.name} {med.dosage}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box sx={{ 
                pt: 2,
                mt: 1,
                borderTop: `1px solid ${COLORS.divider}`,
                fontSize: '0.875rem',
                color: COLORS.textSecondary
              }}>
                Last seen by {currentPatientData?.lastDoctor || 'Dr. Smith'} on {currentPatientData?.lastVisit || '2023-10-15'}
              </Box>
            </CardContent>
          </StyledCard>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ flex: 1 }}>
          {/* Tabs */}
          <Tabs 
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 3 }}
          >
            <Tab label="Overview" value="overview" />
            <Tab label="Visits" value="visits" />
            <Tab label="Labs" value="labs" />
            <Tab label="Medications" value="medications" />
            <Tab label="Imaging" value="imaging" />
            <Tab label="Documents" value="documents" />
          </Tabs>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Stats Cards */}
              <Box sx={{ display: 'flex', gap: 3 }}>
                <StyledCard sx={{ flex: 1 }}>
                  <CardHeader
                    title="Blood Pressure"
                    avatar={<HeartIcon sx={{ color: COLORS.primary }} />}
                  />
                  <CardContent>
                    <Typography variant="h4" fontWeight="bold">125/80</Typography>
                    <Typography variant="body2" color={COLORS.textSecondary}>
                      Last checked: Today
                    </Typography>
                  </CardContent>
                </StyledCard>

                <StyledCard sx={{ flex: 1 }}>
                  <CardHeader
                    title="HbA1c"
                    avatar={<ActivityIcon sx={{ color: COLORS.primary }} />}
                  />
                  <CardContent>
                    <Typography variant="h4" fontWeight="bold">6.1%</Typography>
                    <Typography variant="body2" color={COLORS.textSecondary}>
                      Last test: 10/10/2023
                    </Typography>
                  </CardContent>
                </StyledCard>

                <StyledCard sx={{ flex: 1 }}>
                  <CardHeader
                    title="BMI"
                    avatar={<UserIcon sx={{ color: COLORS.primary }} />}
                  />
                  <CardContent>
                    <Typography variant="h4" fontWeight="bold">24.5</Typography>
                    <Typography variant="body2" color={COLORS.textSecondary}>
                      Normal weight
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Box>

              {/* Recent Activity */}
              <StyledCard>
                <CardHeader 
                  title="Recent Activity"
                  action={
                    <PrimaryButton 
                      size="small" 
                      startIcon={<AddIcon />}
                      onClick={handleAddVisit}
                    >
                      Add Visit
                    </PrimaryButton>
                  }
                />
                <CardContent>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: COLORS.primaryLight }}>
                        <TableCell>Date</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Doctor</TableCell>
                        <TableCell>Complaint</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {visits.slice(0, 3).map(visit => (
                        <TableRow key={visit.id} hover>
                          <TableCell>{visit.date}</TableCell>
                          <TableCell>{visit.type}</TableCell>
                          <TableCell>{visit.doctor}</TableCell>
                          <TableCell sx={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {visit.complaint}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton size="small" onClick={() => handleEditVisit(visit)}>
                                <EditIcon fontSize="small" sx={{ color: COLORS.secondary }} />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDeleteVisit(visit.id)}>
                                <DeleteIcon fontSize="small" sx={{ color: COLORS.error }} />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </StyledCard>
            </Box>
          )}

          {activeTab === 'visits' && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <TextField
                  placeholder="Search visits..."
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                  sx={{ width: 300 }}
                />
                <PrimaryButton startIcon={<AddIcon />} onClick={handleAddVisit}>
                  Add Visit
                </PrimaryButton>
              </Box>

              <StyledCard>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: COLORS.primaryLight }}>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Doctor</TableCell>
                      <TableCell>Complaint</TableCell>
                      <TableCell>Assessment</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredVisits.map(visit => (
                      <TableRow key={visit.id} hover>
                        <TableCell>{visit.date}</TableCell>
                        <TableCell>{visit.type}</TableCell>
                        <TableCell>{visit.doctor}</TableCell>
                        <TableCell sx={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {visit.complaint}
                        </TableCell>
                        <TableCell sx={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {visit.assessment}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small" onClick={() => handleEditVisit(visit)}>
                              <EditIcon fontSize="small" sx={{ color: COLORS.secondary }} />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteVisit(visit.id)}>
                              <DeleteIcon fontSize="small" sx={{ color: COLORS.error }} />
                            </IconButton>
                            <IconButton size="small">
                              <PrintIcon fontSize="small" sx={{ color: COLORS.textSecondary }} />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledCard>
            </Box>
          )}

          {activeTab === 'labs' && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    placeholder="Search labs..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      )
                    }}
                    sx={{ width: 300 }}
                  />
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    size="small"
                    sx={{ width: 150 }}
                  >
                    <MenuItem value="all">All Results</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="abnormal">Abnormal</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                  </Select>
                </Box>
                <PrimaryButton startIcon={<AddIcon />} onClick={handleAddLab}>
                  Add Lab Result
                </PrimaryButton>
              </Box>

              <StyledCard>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: COLORS.primaryLight }}>
                      <TableCell>Test</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Normal Range</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLabs.map(lab => {
                      const statusColor = getStatusColor(lab.status);
                      return (
                        <TableRow key={lab.id} hover>
                          <TableCell>{lab.test}</TableCell>
                          <TableCell>{lab.value}</TableCell>
                          <TableCell>{lab.date}</TableCell>
                          <TableCell>{lab.normalRange}</TableCell>
                          <TableCell>
                            <Box sx={{ 
                              display: 'inline-flex',
                              alignItems: 'center',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              backgroundColor: statusColor.bg,
                              color: statusColor.text,
                              border: `1px solid ${statusColor.border}`
                            }}>
                              {lab.status.charAt(0).toUpperCase() + lab.status.slice(1)}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton size="small" onClick={() => handleEditLab(lab)}>
                                <EditIcon fontSize="small" sx={{ color: COLORS.secondary }} />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDeleteLab(lab.id)}>
                                <DeleteIcon fontSize="small" sx={{ color: COLORS.error }} />
                              </IconButton>
                              <IconButton size="small">
                                <PrintIcon fontSize="small" sx={{ color: COLORS.textSecondary }} />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </StyledCard>
            </Box>
          )}

          {activeTab === 'medications' && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    placeholder="Search medications..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      )
                    }}
                    sx={{ width: 300 }}
                  />
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    size="small"
                    sx={{ width: 150 }}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="discontinued">Discontinued</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </Box>
                <PrimaryButton startIcon={<AddIcon />} onClick={handleAddMed}>
                  Add Medication
                </PrimaryButton>
              </Box>

              <StyledCard>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: COLORS.primaryLight }}>
                      <TableCell>Medication</TableCell>
                      <TableCell>Dosage</TableCell>
                      <TableCell>Frequency</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredMeds.map(med => {
                      const statusColor = getStatusColor(med.status);
                      return (
                        <TableRow key={med.id} hover>
                          <TableCell>{med.name}</TableCell>
                          <TableCell>{med.dosage}</TableCell>
                          <TableCell>{med.frequency}</TableCell>
                          <TableCell>
                            <Box sx={{ 
                              display: 'inline-flex',
                              alignItems: 'center',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              backgroundColor: statusColor.bg,
                              color: statusColor.text,
                              border: `1px solid ${statusColor.border}`
                            }}>
                              {med.status.charAt(0).toUpperCase() + med.status.slice(1)}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton size="small" onClick={() => handleEditMed(med)}>
                                <EditIcon fontSize="small" sx={{ color: COLORS.secondary }} />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDeleteMed(med.id)}>
                                <DeleteIcon fontSize="small" sx={{ color: COLORS.error }} />
                              </IconButton>
                              <IconButton size="small">
                                <PrintIcon fontSize="small" sx={{ color: COLORS.textSecondary }} />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </StyledCard>
            </Box>
          )}

          {activeTab === 'imaging' && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <TextField
                  placeholder="Search images..."
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                  sx={{ width: 300 }}
                />
                <PrimaryButton startIcon={<AddIcon />} onClick={handleAddImage}>
                  Upload Image
                </PrimaryButton>
              </Box>

              <StyledCard>
                <List>
                  {filteredImages.map((image, index) => (
                    <Box key={image.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <ImageIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={image.name}
                          secondary={`${image.type} - ${image.date}`}
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" onClick={() => handleEditImage(image)}>
                            <EditIcon fontSize="small" sx={{ color: COLORS.secondary }} />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteImage(image.id)}>
                            <DeleteIcon fontSize="small" sx={{ color: COLORS.error }} />
                          </IconButton>
                          <IconButton size="small">
                            <PrintIcon fontSize="small" sx={{ color: COLORS.textSecondary }} />
                          </IconButton>
                        </Box>
                      </ListItem>
                      {index < filteredImages.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              </StyledCard>
            </Box>
          )}

          {activeTab === 'documents' && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <TextField
                  placeholder="Search documents..."
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                  sx={{ width: 300 }}
                />
                <PrimaryButton startIcon={<AddIcon />} onClick={handleAddDoc}>
                  Upload Document
                </PrimaryButton>
              </Box>

              <StyledCard>
                <List>
                  {filteredDocuments.map((doc, index) => (
                    <Box key={doc.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <DocumentsIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={doc.name}
                          secondary={`${doc.type} - ${doc.date} - ${doc.size}`}
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" onClick={() => handleEditDoc(doc)}>
                            <EditIcon fontSize="small" sx={{ color: COLORS.secondary }} />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteDoc(doc.id)}>
                            <DeleteIcon fontSize="small" sx={{ color: COLORS.error }} />
                          </IconButton>
                          <IconButton size="small">
                            <PrintIcon fontSize="small" sx={{ color: COLORS.textSecondary }} />
                          </IconButton>
                        </Box>
                      </ListItem>
                      {index < filteredDocuments.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              </StyledCard>
            </Box>
          )}
        </Box>
      </Box>

      {/* Patient Dialog */}
      <Dialog open={openPatientDialog} onClose={() => setOpenPatientDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
        <DialogContent>
          {currentPatient && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <TextField
                  label="Patient ID"
                  value={currentPatient.id}
                  onChange={(e) => setCurrentPatient({...currentPatient, id: e.target.value})}
                  fullWidth
                  disabled={isEditing}
                />
                <TextField
                  label="Name"
                  value={currentPatient.name}
                  onChange={(e) => setCurrentPatient({...currentPatient, name: e.target.value})}
                  fullWidth
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 3 }}>
                <TextField
                  label="Age"
                  type="number"
                  value={currentPatient.age}
                  onChange={(e) => setCurrentPatient({...currentPatient, age: parseInt(e.target.value) || 0})}
                  fullWidth
                />
                <TextField
                  label="Gender"
                  select
                  value={currentPatient.gender}
                  onChange={(e) => setCurrentPatient({...currentPatient, gender: e.target.value})}
                  fullWidth
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 3 }}>
                <TextField
                  label="Blood Type"
                  select
                  value={currentPatient.bloodType}
                  onChange={(e) => setCurrentPatient({...currentPatient, bloodType: e.target.value})}
                  fullWidth
                >
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                </TextField>
                <TextField
                  label="Last Visit"
                  type="date"
                  value={currentPatient.lastVisit}
                  onChange={(e) => setCurrentPatient({...currentPatient, lastVisit: e.target.value})}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              
              <TextField
                label="Last Doctor"
                value={currentPatient.lastDoctor}
                onChange={(e) => setCurrentPatient({...currentPatient, lastDoctor: e.target.value})}
                fullWidth
              />
              
              <Box>
                <Typography variant="body2" mb={1}>Allergies</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {currentPatient.allergies.map((allergy, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        value={allergy}
                        onChange={(e) => {
                          const newAllergies = [...currentPatient.allergies];
                          newAllergies[index] = e.target.value;
                          setCurrentPatient({...currentPatient, allergies: newAllergies});
                        }}
                        fullWidth
                        size="small"
                      />
                      <IconButton
                        onClick={() => handleRemoveAllergy(allergy)}
                      >
                        <DeleteIcon fontSize="small" sx={{ color: COLORS.error }} />
                      </IconButton>
                    </Box>
                  ))}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      fullWidth
                      size="small"
                      placeholder="New allergy"
                    />
                    <Button 
                      variant="outlined" 
                      onClick={handleAddAllergy}
                      disabled={!newAllergy.trim()}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenPatientDialog(false)}
            startIcon={<CancelIcon />}
            sx={{ color: COLORS.error }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSavePatient}
            startIcon={<SaveIcon />}
            sx={{ color: COLORS.primary }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Visit Dialog */}
      <Dialog open={openVisitDialog} onClose={() => setOpenVisitDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Visit' : 'Add New Visit'}</DialogTitle>
        <DialogContent>
          {currentVisit && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <TextField
                  label="Date"
                  type="date"
                  value={currentVisit.date}
                  onChange={(e) => setCurrentVisit({...currentVisit, date: e.target.value})}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Visit Type"
                  value={currentVisit.type}
                  onChange={(e) => setCurrentVisit({...currentVisit, type: e.target.value})}
                  fullWidth
                />
              </Box>
              
              <TextField
                label="Doctor"
                value={currentVisit.doctor}
                onChange={(e) => setCurrentVisit({...currentVisit, doctor: e.target.value})}
                fullWidth
              />
              
              <TextField
                label="Chief Complaint"
                value={currentVisit.complaint}
                onChange={(e) => setCurrentVisit({...currentVisit, complaint: e.target.value})}
                fullWidth
                multiline
                rows={2}
              />
              
              <TextField
                label="Assessment"
                value={currentVisit.assessment}
                onChange={(e) => setCurrentVisit({...currentVisit, assessment: e.target.value})}
                fullWidth
                multiline
                rows={3}
              />
              
              <Box>
                <Typography variant="body2" mb={1}>Plan</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {currentVisit.plan.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        value={item}
                        onChange={(e) => {
                          const newPlan = [...currentVisit.plan];
                          newPlan[index] = e.target.value;
                          setCurrentVisit({...currentVisit, plan: newPlan});
                        }}
                        fullWidth
                        size="small"
                      />
                      <IconButton
                        onClick={() => {
                          const newPlan = [...currentVisit.plan];
                          newPlan.splice(index, 1);
                          setCurrentVisit({...currentVisit, plan: newPlan});
                        }}
                      >
                        <DeleteIcon fontSize="small" sx={{ color: COLORS.error }} />
                      </IconButton>
                    </Box>
                  ))}
                  <Button 
                    variant="outlined" 
                    startIcon={<AddIcon />}
                    onClick={() => setCurrentVisit({...currentVisit, plan: [...currentVisit.plan, '']})}
                  >
                    Add Plan Item
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenVisitDialog(false)}
            startIcon={<CancelIcon />}
            sx={{ color: COLORS.error }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveVisit}
            startIcon={<SaveIcon />}
            sx={{ color: COLORS.primary }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lab Dialog */}
      <Dialog open={openLabDialog} onClose={() => setOpenLabDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Lab Result' : 'Add New Lab Result'}</DialogTitle>
        <DialogContent>
          {currentLab && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <TextField
                  label="Test Name"
                  value={currentLab.test}
                  onChange={(e) => setCurrentLab({...currentLab, test: e.target.value})}
                  fullWidth
                />
                <TextField
                  label="Date"
                  type="date"
                  value={currentLab.date}
                  onChange={(e) => setCurrentLab({...currentLab, date: e.target.value})}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 3 }}>
                <TextField
                  label="Value"
                  value={currentLab.value}
                  onChange={(e) => setCurrentLab({...currentLab, value: e.target.value})}
                  fullWidth
                />
                <TextField
                  label="Normal Range"
                  value={currentLab.normalRange}
                  onChange={(e) => setCurrentLab({...currentLab, normalRange: e.target.value})}
                  fullWidth
                />
              </Box>
              
              <TextField
                label="Status"
                select
                value={currentLab.status}
                onChange={(e) => setCurrentLab({...currentLab, status: e.target.value as any})}
                fullWidth
              >
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="abnormal">Abnormal</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </TextField>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenLabDialog(false)}
            startIcon={<CancelIcon />}
            sx={{ color: COLORS.error }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveLab}
            startIcon={<SaveIcon />}
            sx={{ color: COLORS.primary }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Medication Dialog */}
      <Dialog open={openMedDialog} onClose={() => setOpenMedDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Medication' : 'Add New Medication'}</DialogTitle>
        <DialogContent>
          {currentMed && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
              <TextField
                label="Medication Name"
                value={currentMed.name}
                onChange={(e) => setCurrentMed({...currentMed, name: e.target.value})}
                fullWidth
              />
              
              <Box sx={{ display: 'flex', gap: 3 }}>
                <TextField
                  label="Dosage"
                  value={currentMed.dosage}
                  onChange={(e) => setCurrentMed({...currentMed, dosage: e.target.value})}
                  fullWidth
                />
                <TextField
                  label="Frequency"
                  value={currentMed.frequency}
                  onChange={(e) => setCurrentMed({...currentMed, frequency: e.target.value})}
                  fullWidth
                />
              </Box>
              
              <TextField
                label="Status"
                select
                value={currentMed.status}
                onChange={(e) => setCurrentMed({...currentMed, status: e.target.value as any})}
                fullWidth
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="discontinued">Discontinued</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenMedDialog(false)}
            startIcon={<CancelIcon />}
            sx={{ color: COLORS.error }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveMed}
            startIcon={<SaveIcon />}
            sx={{ color: COLORS.primary }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Image' : 'Add New Image'}</DialogTitle>
        <DialogContent>
          {currentImage && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
              <TextField
                label="Image Name"
                value={currentImage.name}
                onChange={(e) => setCurrentImage({...currentImage, name: e.target.value})}
                fullWidth
              />
              
              <Box sx={{ display: 'flex', gap: 3 }}>
                <TextField
                  label="Type"
                  select
                  value={currentImage.type}
                  onChange={(e) => setCurrentImage({...currentImage, type: e.target.value as any})}
                  fullWidth
                >
                  <MenuItem value="X-Ray">X-Ray</MenuItem>
                  <MenuItem value="MRI">MRI</MenuItem>
                  <MenuItem value="CT">CT</MenuItem>
                  <MenuItem value="Ultrasound">Ultrasound</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
                <TextField
                  label="Date"
                  type="date"
                  value={currentImage.date}
                  onChange={(e) => setCurrentImage({...currentImage, date: e.target.value})}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              
              <TextField
                label="Preview URL"
                value={currentImage.previewUrl}
                onChange={(e) => setCurrentImage({...currentImage, previewUrl: e.target.value})}
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenImageDialog(false)}
            startIcon={<CancelIcon />}
            sx={{ color: COLORS.error }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveImage}
            startIcon={<SaveIcon />}
            sx={{ color: COLORS.primary }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Document Dialog */}
      <Dialog open={openDocDialog} onClose={() => setOpenDocDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Document' : 'Add New Document'}</DialogTitle>
        <DialogContent>
          {currentDoc && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
              <TextField
                label="Document Name"
                value={currentDoc.name}
                onChange={(e) => setCurrentDoc({...currentDoc, name: e.target.value})}
                fullWidth
              />
              
              <Box sx={{ display: 'flex', gap: 3 }}>
                <TextField
                  label="Type"
                  select
                  value={currentDoc.type}
                  onChange={(e) => setCurrentDoc({...currentDoc, type: e.target.value as any})}
                  fullWidth
                >
                  <MenuItem value="Report">Report</MenuItem>
                  <MenuItem value="Prescription">Prescription</MenuItem>
                  <MenuItem value="Referral">Referral</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
                <TextField
                  label="Date"
                  type="date"
                  value={currentDoc.date}
                  onChange={(e) => setCurrentDoc({...currentDoc, date: e.target.value})}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              
              <TextField
                label="Size"
                value={currentDoc.size}
                onChange={(e) => setCurrentDoc({...currentDoc, size: e.target.value})}
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDocDialog(false)}
            startIcon={<CancelIcon />}
            sx={{ color: COLORS.error }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveDoc}
            startIcon={<SaveIcon />}
            sx={{ color: COLORS.primary }}
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
    </Box>
  );
};

export default MedicalRecords;