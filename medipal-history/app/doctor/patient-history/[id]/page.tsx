"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Assignment, LocalHospital } from "@mui/icons-material";
import RequireAuth from "../../../ui/components/RequireAuth";

interface PatientInfo {
  patientId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  bloodGroup?: string;
}

interface ConsultationItem {
  id: string;
  date: string;
  hospitalName: string;
  diagnosis: string;
  prescription: string[];
  notes: string;
  followUpRequired: boolean;
}

export default function DoctorPatientHistoryPage() {
  const params = useParams();
  const patientIdParam = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        // Fetch patient profile via doctor search endpoint
        const pResp = await fetch(`http://localhost:5000/api/doctors/search-patient/${encodeURIComponent(patientIdParam)}` , {
          headers: { Authorization: `Bearer ${token}` }
        });
        const pData = await pResp.json();
        if (!pResp.ok || !pData?.success) {
          throw new Error(pData?.message || "Failed to fetch patient info");
        }
        setPatientInfo({
          patientId: pData.data.patientId,
          fullName: pData.data.fullName,
          dateOfBirth: pData.data.dateOfBirth,
          gender: pData.data.gender,
          phoneNumber: pData.data.phoneNumber,
          email: pData.data.email,
          address: pData.data.address,
          bloodGroup: pData.data.bloodGroup,
        });

        // Fetch consultations by this doctor for the patient
        const cResp = await fetch(`http://localhost:5000/api/doctors/consultations?patientId=${encodeURIComponent(patientIdParam)}` , {
          headers: { Authorization: `Bearer ${token}` }
        });
        const cData = await cResp.json();
        if (cResp.ok && cData?.success) {
          const items: ConsultationItem[] = (cData.data || []).map((d: any) => ({
            id: d.id,
            date: new Date(d.date).toISOString().split("T")[0],
            hospitalName: d.hospitalName || "",
            diagnosis: d.diagnosis || "",
            prescription: Array.isArray(d.prescription) ? d.prescription : [],
            notes: d.notes || "",
            followUpRequired: !!d.followUpRequired,
          }));
          setConsultations(items);
        } else {
          setConsultations([]);
        }
      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : "Failed to load patient history");
      } finally {
        setLoading(false);
      }
    };
    if (patientIdParam) run();
  }, [patientIdParam]);

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
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: "#2D3748", fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Assignment sx={{ fontSize: 32, color: "#2A7F62" }} />
            Patient History
          </Typography>
          {patientInfo ? (
            <Typography variant="body1" sx={{ color: "#64748B" }}>
              Patient: <strong>{patientInfo.fullName}</strong> • ID: {patientInfo.patientId}
            </Typography>
          ) : (
            <Alert severity="error">{error || "Patient not found"}</Alert>
          )}
        </Box>

        {/* Patient profile card */}
        {patientInfo && (
          <Card sx={{ bgcolor: "white", borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 3 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>Basic Info</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{patientInfo.fullName} — {patientInfo.gender}</Typography>
                  <Typography variant="body2">DOB: {new Date(patientInfo.dateOfBirth).toLocaleDateString()}</Typography>
                  {patientInfo.bloodGroup && <Chip label={`Blood: ${patientInfo.bloodGroup}`} size="small" sx={{ mt: 1 }} />}
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>Contact</Typography>
                  <Typography variant="body2">Phone: {patientInfo.phoneNumber}</Typography>
                  <Typography variant="body2">Email: {patientInfo.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>Address</Typography>
                  <Typography variant="body2">{patientInfo.address}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Consultations table (doctor-only entries) */}
        <Card sx={{ bgcolor: "white", borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#2D3748", mb: 1 }}>Consultations by You</Typography>
              <Typography variant="body2" sx={{ color: "#64748B" }}>
                This list shows consultations recorded by you for this patient.
              </Typography>
            </Box>
            {consultations.length === 0 ? (
              <Box sx={{ p: 8, textAlign: "center" }}>
                <LocalHospital sx={{ fontSize: 64, color: "#E0E0E0", mb: 2 }} />
                <Typography variant="h6" sx={{ color: "#64748B", mb: 1 }}>No consultations found</Typography>
                <Typography variant="body2" sx={{ color: "#94A3B8" }}>Add a consultation to see it here</Typography>
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#F5F9F8" }}>
                    <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>Hospital</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>Diagnosis</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>Follow-up</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {consultations.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.date}</TableCell>
                      <TableCell>{c.hospitalName || "—"}</TableCell>
                      <TableCell>{c.diagnosis || "—"}</TableCell>
                      <TableCell>{c.followUpRequired ? "Required" : "No"}</TableCell>
                      <TableCell>{c.notes || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Box>
    </RequireAuth>
  );
}
