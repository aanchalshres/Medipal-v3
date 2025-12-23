"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar
} from "@mui/material";
import {
  CloudUpload,
  Download,
  Visibility,
  Delete,
  PictureAsPdf,
  Image as ImageIcon,
  Description,
  FolderOpen
} from "@mui/icons-material";
import { format } from "date-fns";
import RequireAuth from "../ui/components/RequireAuth";

interface Report {
  id: string;
  name: string;
  type: string;
  category: string;
  uploadDate: string;
  size: string;
  fileUrl: string;
  fileType: 'pdf' | 'image';
}

export default function ReportsPage() {
  const [role, setRole] = useState<string | null>(null);
  const isDoctor = role === 'doctor';
  useEffect(() => {
    const r = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    setRole(r);
  }, []);
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      name: "Blood Test Results",
      type: "Lab Report",
      category: "Laboratory",
      uploadDate: "2024-12-15",
      size: "2.3 MB",
      fileUrl: "#",
      fileType: "pdf"
    },
    {
      id: "2",
      name: "X-Ray Chest",
      type: "Imaging",
      category: "Radiology",
      uploadDate: "2024-12-10",
      size: "5.1 MB",
      fileUrl: "#",
      fileType: "image"
    },
    {
      id: "3",
      name: "ECG Report",
      type: "Cardiac",
      category: "Cardiology",
      uploadDate: "2024-12-05",
      size: "1.8 MB",
      fileUrl: "#",
      fileType: "pdf"
    }
  ]);

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reportName, setReportName] = useState("");
  const [reportCategory, setReportCategory] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info"
  });

  const categories = [
    "Laboratory",
    "Radiology",
    "Cardiology",
    "Pathology",
    "Prescription",
    "Discharge Summary",
    "Other"
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Validate file type (PDF or image) and size (<=5MB)
      const isPdf = file.type === 'application/pdf';
      const isImage = file.type.startsWith('image/');
      const withinSize = file.size <= 5 * 1024 * 1024;
      if (!isPdf && !isImage) {
        setSnackbar({ open: true, message: 'Only PDF or image files are allowed', severity: 'error' });
        return;
      }
      if (!withinSize) {
        setSnackbar({ open: true, message: 'File must be 5MB or smaller', severity: 'error' });
        return;
      }
      setSelectedFile(file);
      // Auto-fill report name with filename (without extension)
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setReportName(nameWithoutExt);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !reportName || !reportCategory) {
      setSnackbar({
        open: true,
        message: "Please fill all fields and select a file",
        severity: "error"
      });
      return;
    }

    // Create new report entry
    const newReport: Report = {
      id: Date.now().toString(),
      name: reportName,
      type: reportCategory,
      category: reportCategory,
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
      fileUrl: URL.createObjectURL(selectedFile),
      fileType: selectedFile.type.includes('pdf') ? 'pdf' : 'image'
    };

    setReports([newReport, ...reports]);
    
    // Reset form
    setUploadDialogOpen(false);
    setSelectedFile(null);
    setReportName("");
    setReportCategory("");
    
    setSnackbar({
      open: true,
      message: "Report uploaded successfully!",
      severity: "success"
    });
  };

  const handleDownload = (report: Report) => {
    // In production, this would download from server
    window.open(report.fileUrl, '_blank');
    setSnackbar({
      open: true,
      message: `Downloading ${report.name}...`,
      severity: "info"
    });
  };

  const handleView = (report: Report) => {
    // In production, this would open a viewer
    window.open(report.fileUrl, '_blank');
  };

  const handleDelete = (reportId: string) => {
    setReports(reports.filter(r => r.id !== reportId));
    setSnackbar({
      open: true,
      message: "Report deleted successfully",
      severity: "success"
    });
  };

  const getFileIcon = (fileType: 'pdf' | 'image') => {
    return fileType === 'pdf' ? (
      <PictureAsPdf sx={{ color: '#D32F2F', fontSize: 40 }} />
    ) : (
      <ImageIcon sx={{ color: '#1976D2', fontSize: 40 }} />
    );
  };

  return (
    <RequireAuth allowedRoles={["doctor", "patient"]}>
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
            gap: 1
          }}>
            <Description sx={{ fontSize: 32, color: '#2A7F62' }} />
            Medical Reports
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
            Upload and manage your diagnostic reports
          </Typography>
        </Box>
        {!isDoctor && (
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => setUploadDialogOpen(true)}
            sx={{
              bgcolor: '#2A7F62',
              '&:hover': { bgcolor: '#1E6D54' },
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Upload New Report
          </Button>
        )}
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
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
                bgcolor: '#E3F2FD', 
                p: 1.5, 
                borderRadius: 2,
                display: 'flex'
              }}>
                <FolderOpen sx={{ color: '#1976D2', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2D3748' }}>
                  {reports.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Total Reports
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
                <PictureAsPdf sx={{ color: '#F57C00', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2D3748' }}>
                  {reports.filter(r => r.fileType === 'pdf').length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  PDF Documents
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
                bgcolor: '#E8F5E9', 
                p: 1.5, 
                borderRadius: 2,
                display: 'flex'
              }}>
                <ImageIcon sx={{ color: '#2A7F62', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2D3748' }}>
                  {reports.filter(r => r.fileType === 'image').length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Images
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Reports Table */}
      <Card sx={{ 
        bgcolor: 'white',
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F5F9F8' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Report Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Upload Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Size</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#2D3748' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <FolderOpen sx={{ fontSize: 64, color: '#E0E0E0', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#64748B', mb: 1 }}>
                        No reports uploaded yet
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                        Click "Upload New Report" to add your first report
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow 
                      key={report.id}
                      sx={{ 
                        '&:hover': { bgcolor: '#F5F9F8' },
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          {getFileIcon(report.fileType)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#2D3748' }}>
                          {report.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={report.category}
                          size="small"
                          sx={{
                            bgcolor: '#E8F5E9',
                            color: '#2A7F62',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#64748B' }}>
                          {format(new Date(report.uploadDate), 'MMM dd, yyyy')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#64748B' }}>
                          {report.size}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleView(report)}
                            sx={{ 
                              color: '#2A7F62',
                              '&:hover': { bgcolor: '#E8F5E9' }
                            }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDownload(report)}
                            sx={{ 
                              color: '#1976D2',
                              '&:hover': { bgcolor: '#E3F2FD' }
                            }}
                          >
                            <Download fontSize="small" />
                          </IconButton>
                          {!isDoctor && (
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(report.id)}
                              sx={{ 
                                color: '#D32F2F',
                                '&:hover': { bgcolor: '#FFEBEE' }
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog 
        open={uploadDialogOpen && !isDoctor} 
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: '#F5F9F8',
          color: '#2D3748',
          fontWeight: 'bold'
        }}>
          Upload New Report
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              fullWidth
              label="Report Name"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="e.g., Blood Test Results"
            />
            
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={reportCategory}
                onChange={(e) => setReportCategory(e.target.value)}
                label="Category"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <input
                accept="image/*,.pdf"
                style={{ display: 'none' }}
                id="file-upload"
                type="file"
                onChange={handleFileSelect}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  startIcon={<CloudUpload />}
                  sx={{
                    py: 2,
                    borderColor: '#2A7F62',
                    color: '#2A7F62',
                    '&:hover': {
                      borderColor: '#1E6D54',
                      bgcolor: '#E8F5E9'
                    }
                  }}
                >
                  {selectedFile ? selectedFile.name : 'Select File (PDF or Image)'}
                </Button>
              </label>
            </Box>

            {selectedFile && (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                File selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setUploadDialogOpen(false)}
            sx={{ color: '#64748B' }}
          >
            Cancel
          </Button>
          {!isDoctor && (
            <Button 
              onClick={handleUpload}
              variant="contained"
            sx={{
              bgcolor: '#2A7F62',
              '&:hover': { bgcolor: '#1E6D54' }
            }}
            >
              Upload
            </Button>
          )}
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
    </RequireAuth>
  );
}
