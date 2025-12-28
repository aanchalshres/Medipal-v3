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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  LocalHospital as HospitalIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  MedicalServices as MedicalIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import RequireAuth from "../../ui/components/RequireAuth";

interface Consultation {
  id: string;
  date: string;
  patientId: string;
  patientName: string;
  hospitalName: string;
  chiefComplaint: string;
  diagnosis: string;
  prescription: string[];
  notes: string;
  followUpRequired?: boolean;
}

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newConsultation, setNewConsultation] = useState({
    patientId: "",
    hospitalName: "",
    chiefComplaint: "",
    diagnosis: "",
    prescription: "",
    notes: "",
    followUpRequired: false,
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

        // Fetch consultations for this doctor
        const resp = await fetch("http://localhost:5000/api/doctors/consultations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json();
        if (resp.ok && data?.success) {
          const items: Consultation[] = (data.data || []).map((d: any) => ({
            id: d.id,
            date: d.date,
            patientId: d.patientId,
            patientName: d.patientName,
            hospitalName: d.hospitalName,
            chiefComplaint: d.chiefComplaint || "",
            diagnosis: d.diagnosis || "",
            prescription: d.prescription || [],
            notes: d.notes || "",
            followUpRequired: !!d.followUpRequired,
          }));
          setConsultations(items);
          setFilteredConsultations(items);
        } else {
          setConsultations([]);
          setFilteredConsultations([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter consultations
  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = consultations.filter(
        (c) =>
          c.patientName.toLowerCase().includes(term) ||
          c.patientId.toLowerCase().includes(term) ||
          c.hospitalName.toLowerCase().includes(term) ||
          c.diagnosis.toLowerCase().includes(term)
      );
      setFilteredConsultations(filtered);
    } else {
      setFilteredConsultations(consultations);
    }
  }, [searchTerm, consultations]);

  const handleViewConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setViewDialogOpen(true);
  };

  const handleAddConsultation = async () => {
    if (
      !newConsultation.patientId ||
      !newConsultation.chiefComplaint ||
      !newConsultation.diagnosis
    ) {
      alert("Please fill all required fields");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication required");
        return;
      }

      const resp = await fetch("http://localhost:5000/api/doctors/consultations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: newConsultation.patientId,
          date: new Date().toISOString(),
          diagnosis: newConsultation.diagnosis,
          notes: newConsultation.notes,
          chiefComplaint: newConsultation.chiefComplaint,
          prescriptions: newConsultation.prescription.split("\n").filter((p) => p.trim()),
          hospital: newConsultation.hospitalName,
          followUpRequired: newConsultation.followUpRequired,
        }),
      });
      const data = await resp.json();
      if (!resp.ok || !data?.success) {
        throw new Error(data?.message || "Failed to add consultation");
      }

      const saved = data.data;
      const consultation: Consultation = {
        id: saved._id,
        date: saved.date,
        patientId: newConsultation.patientId,
        patientName: saved.patientName || "",
        hospitalName: newConsultation.hospitalName,
        chiefComplaint: newConsultation.chiefComplaint,
        diagnosis: newConsultation.diagnosis,
        prescription: newConsultation.prescription.split("\n").filter((p) => p.trim()),
        notes: newConsultation.notes,
        followUpRequired: !!newConsultation.followUpRequired,
      };
      setConsultations([consultation, ...consultations]);
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Failed to add consultation");
      return;
    }
    setAddDialogOpen(false);
    setNewConsultation({
      patientId: "",
      hospitalName: "",
      chiefComplaint: "",
      diagnosis: "",
      prescription: "",
      notes: "",
      followUpRequired: false,
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress sx={{ color: "#2A7F62" }} />
      </Box>
    );
  }

  return (
    <RequireAuth allowedRoles={["doctor"]}>
    <Box sx={{ backgroundColor: "#F5F9F8", minHeight: "100vh", py: 4, px: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography
            variant="h4"
            sx={{ color: "#2D3748", fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, mb: 1 }}
          >
            <MedicalIcon sx={{ fontSize: 32, color: "#2A7F62" }} />
            My Consultations
          </Typography>
          {doctorName && (
            <Typography variant="body1" sx={{ color: "#64748B" }}>
              Doctor: <strong>{doctorName}</strong>
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
            Record and manage patient consultations
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          sx={{
            bgcolor: "#2A7F62",
            "&:hover": { bgcolor: "#1E6D54" },
            px: 3,
            py: 1.5,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Add Consultation
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 3, mb: 4 }}>
        <Card sx={{ bgcolor: "white", borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ bgcolor: "#E3F2FD", p: 1.5, borderRadius: 2, display: "flex" }}>
                <MedicalIcon sx={{ color: "#1976D2", fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2D3748" }}>
                  {consultations.length}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  Total Consultations
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: "white", borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ bgcolor: "#E8F5E9", p: 1.5, borderRadius: 2, display: "flex" }}>
                <CalendarIcon sx={{ color: "#2A7F62", fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2D3748" }}>
                  {consultations.filter((c) => c.date === new Date().toISOString().split("T")[0]).length}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  Today
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: "white", borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ bgcolor: "#FFF3E0", p: 1.5, borderRadius: 2, display: "flex" }}>
                <PersonIcon sx={{ color: "#F57C00", fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2D3748" }}>
                  {new Set(consultations.map((c) => c.patientId)).size}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  Unique Patients
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search by patient name, ID, hospital, or diagnosis..."
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
            minWidth: 300,
            maxWidth: 600,
            bgcolor: "white",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": { borderColor: "#2A7F62" },
              "&.Mui-focused fieldset": { borderColor: "#2A7F62" },
            },
          }}
        />
      </Box>

      {/* Consultations Table */}
      <Card sx={{ bgcolor: "white", borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <CardContent sx={{ p: 0 }}>
          {filteredConsultations.length === 0 ? (
            <Box sx={{ p: 8, textAlign: "center" }}>
              <MedicalIcon sx={{ fontSize: 64, color: "#E0E0E0", mb: 2 }} />
              <Typography variant="h6" sx={{ color: "#64748B", mb: 1 }}>
                No consultations found
              </Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8", mb: 3 }}>
                {searchTerm ? "Try adjusting your search" : "Start by adding a new consultation"}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddDialogOpen(true)}
                sx={{ bgcolor: "#2A7F62", "&:hover": { bgcolor: "#1E6D54" } }}
              >
                Add Consultation
              </Button>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#F5F9F8" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>Patient</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>Hospital</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>Chief Complaint</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>Diagnosis</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredConsultations.map((consultation) => (
                  <TableRow key={consultation.id} sx={{ "&:hover": { bgcolor: "#F5F9F8" }, transition: "background-color 0.2s" }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: "#2D3748" }}>
                        {format(new Date(consultation.date), "MMM dd, yyyy")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: "#2D3748" }}>
                        {consultation.patientName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748B" }}>
                        ID: {consultation.patientId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <HospitalIcon sx={{ fontSize: 16, color: "#1976D2" }} />
                        <Typography variant="body2" sx={{ color: "#2D3748" }}>
                          {consultation.hospitalName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#2D3748", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {consultation.chiefComplaint}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={consultation.diagnosis}
                        size="small"
                        sx={{
                          bgcolor: "#E8F5E9",
                          color: "#2A7F62",
                          fontWeight: 500,
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={() => handleViewConsultation(consultation)}
                        sx={{ color: "#2A7F62", textTransform: "none" }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Consultation Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: "#F5F9F8", color: "#2D3748", fontWeight: "bold" }}>
          Consultation Details
        </DialogTitle>
        {selectedConsultation && (
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 3 }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Date
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#2D3748" }}>
                  {format(new Date(selectedConsultation.date), "MMMM dd, yyyy")}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Patient ID
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#2D3748" }}>
                  {selectedConsultation.patientId}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Patient Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#2D3748" }}>
                  {selectedConsultation.patientName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Hospital
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#2D3748" }}>
                  {selectedConsultation.hospitalName}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                Chief Complaint
              </Typography>
              <Typography variant="body1" sx={{ color: "#2D3748" }}>
                {selectedConsultation.chiefComplaint}
              </Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                Diagnosis
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, color: "#2A7F62" }}>
                {selectedConsultation.diagnosis}
              </Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{ color: "#64748B", mb: 1, display: "block" }}>
                Prescription
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {selectedConsultation.prescription.map((item, index) => (
                  <Typography component="li" key={index} variant="body2" sx={{ color: "#2D3748", mb: 0.5 }}>
                    {item}
                  </Typography>
                ))}
              </Box>
            </Box>
            {selectedConsultation.notes && (
              <Box>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Notes
                </Typography>
                <Typography variant="body2" sx={{ color: "#2D3748" }}>
                  {selectedConsultation.notes}
                </Typography>
              </Box>
            )}
          </DialogContent>
        )}
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setViewDialogOpen(false)} sx={{ color: "#64748B" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Consultation Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#F5F9F8", color: "#2D3748", fontWeight: "bold" }}>
          Add New Consultation
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              fullWidth
              label="Patient ID *"
              value={newConsultation.patientId}
              onChange={(e) => setNewConsultation({ ...newConsultation, patientId: e.target.value })}
              placeholder="e.g., MP-<patientNo>YYYYMMDD"
            />
            {/* Patient name is resolved automatically; doctor inputs only Patient ID */}
            <TextField
              fullWidth
              label="Hospital Name"
              value={newConsultation.hospitalName}
              onChange={(e) => setNewConsultation({ ...newConsultation, hospitalName: e.target.value })}
              placeholder="e.g., City General Hospital"
            />
            <FormControl fullWidth>
              <InputLabel id="followup-label">Follow-up Required?</InputLabel>
              <Select
                labelId="followup-label"
                value={newConsultation.followUpRequired ? 'yes' : 'no'}
                label="Follow-up Required?"
                onChange={(e) => setNewConsultation({ ...newConsultation, followUpRequired: e.target.value === 'yes' })}
              >
                <MenuItem value="no">No</MenuItem>
                <MenuItem value="yes">Yes</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Chief Complaint *"
              multiline
              rows={2}
              value={newConsultation.chiefComplaint}
              onChange={(e) => setNewConsultation({ ...newConsultation, chiefComplaint: e.target.value })}
              placeholder="Patient's main complaint"
            />
            <TextField
              fullWidth
              label="Diagnosis *"
              value={newConsultation.diagnosis}
              onChange={(e) => setNewConsultation({ ...newConsultation, diagnosis: e.target.value })}
              placeholder="Medical diagnosis"
            />
            <TextField
              fullWidth
              label="Prescription"
              multiline
              rows={3}
              value={newConsultation.prescription}
              onChange={(e) => setNewConsultation({ ...newConsultation, prescription: e.target.value })}
              placeholder="Enter each medication on a new line"
            />
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={2}
              value={newConsultation.notes}
              onChange={(e) => setNewConsultation({ ...newConsultation, notes: e.target.value })}
              placeholder="Additional notes or instructions"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setAddDialogOpen(false)} sx={{ color: "#64748B" }}>
            Cancel
          </Button>
          <Button onClick={handleAddConsultation} variant="contained" sx={{ bgcolor: "#2A7F62", "&:hover": { bgcolor: "#1E6D54" } }}>
            Add Consultation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </RequireAuth>
  );
}
