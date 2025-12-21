"use client";
import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Cake as CakeIcon,
  LocationOn as LocationIcon,
  MedicalServices as MedicalIcon,
  Fingerprint as FingerprintIcon,
} from "@mui/icons-material";
import Link from "next/link";

interface PatientInfo {
  patientId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  bloodGroup?: string;
  emergencyContact?: string;
}

export default function SearchPatientPage() {
  const [patientId, setPatientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);

  const handleSearch = async () => {
    if (!patientId.trim()) {
      setError("Please enter a Patient ID");
      return;
    }

    setLoading(true);
    setError("");
    setPatientInfo(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      // TODO: Replace with actual API call
      // const response = await fetch(`http://localhost:5000/api/doctors/search-patient/${patientId}`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // const data = await response.json();
      
      // Sample data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (patientId.toLowerCase().includes("p")) {
        setPatientInfo({
          patientId: patientId.toUpperCase(),
          fullName: "Rajesh Kumar Sharma",
          dateOfBirth: "1985-05-15",
          gender: "Male",
          phoneNumber: "+977-9841234567",
          email: "rajesh.sharma@email.com",
          address: "Kathmandu-10, Baneshwor",
          bloodGroup: "O+",
          emergencyContact: "+977-9841234568"
        });
      } else {
        setError("Patient not found. Please check the Patient ID and try again.");
      }
    } catch (err) {
      setError("Failed to fetch patient information. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const colors = {
    primary: "#2A7F62",
    background: "#F5F9F8",
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.background,
        minHeight: "100vh",
        py: 4,
        px: { xs: 2, md: 4 },
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            color: "#2D3748",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
          }}
        >
          <SearchIcon sx={{ fontSize: 32, color: colors.primary }} />
          Search Patient
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748B" }}>
          Access patient medical history across all hospitals
        </Typography>
      </Box>

      {/* Search Section */}
      <Card
        sx={{
          maxWidth: 800,
          mx: "auto",
          mb: 4,
          borderRadius: 3,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#2D3748", mb: 3 }}
          >
            Enter Patient ID
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              placeholder="e.g., P12345, P98765"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              InputProps={{
                startAdornment: <FingerprintIcon sx={{ mr: 1, color: "#64748B" }} />,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: colors.primary },
                  "&.Mui-focused fieldset": { borderColor: colors.primary },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              sx={{
                bgcolor: colors.primary,
                "&:hover": { bgcolor: "#1E6D54" },
                px: 4,
                minWidth: 120,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Search"}
            </Button>
          </Box>
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            <strong>Cross-Hospital Access:</strong> This feature allows you to view
            patient medical history from any hospital in the MediPal network.
          </Alert>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{ maxWidth: 800, mx: "auto", mb: 4, borderRadius: 2 }}
        >
          {error}
        </Alert>
      )}

      {/* Patient Information */}
      {patientInfo && (
        <Card
          sx={{
            maxWidth: 800,
            mx: "auto",
            borderRadius: 3,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Patient Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: colors.primary,
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              >
                {patientInfo.fullName.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#2D3748" }}>
                  {patientInfo.fullName}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                  <Chip
                    label={`ID: ${patientInfo.patientId}`}
                    size="small"
                    sx={{
                      bgcolor: "#E8F5E9",
                      color: "#2A7F62",
                      fontWeight: 600,
                    }}
                  />
                  {patientInfo.bloodGroup && (
                    <Chip
                      label={`Blood: ${patientInfo.bloodGroup}`}
                      size="small"
                      sx={{
                        bgcolor: "#FFEBEE",
                        color: "#C62828",
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Patient Details Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <CakeIcon sx={{ color: colors.primary, mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>
                    Date of Birth
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: "#2D3748" }}>
                    {new Date(patientInfo.dateOfBirth).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>
                    {patientInfo.gender}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <PhoneIcon sx={{ color: colors.primary, mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>
                    Phone Number
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: "#2D3748" }}>
                    {patientInfo.phoneNumber}
                  </Typography>
                  {patientInfo.emergencyContact && (
                    <Typography variant="caption" sx={{ color: "#64748B" }}>
                      Emergency: {patientInfo.emergencyContact}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <EmailIcon sx={{ color: colors.primary, mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>
                    Email Address
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: "#2D3748" }}>
                    {patientInfo.email}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <LocationIcon sx={{ color: colors.primary, mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>
                    Address
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: "#2D3748" }}>
                    {patientInfo.address}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Action Button */}
            <Button
              fullWidth
              variant="contained"
              component={Link}
              href={`/doctor/patient-history/${patientInfo.patientId}`}
              startIcon={<MedicalIcon />}
              sx={{
                bgcolor: colors.primary,
                "&:hover": { bgcolor: "#1E6D54" },
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              View Complete Medical History
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
