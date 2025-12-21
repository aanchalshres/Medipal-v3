"use client";
import React, { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  Typography, 
  IconButton,
  Avatar,
  Box,
  Dialog,
  DialogContent,
  Fade
} from "@mui/material";
import { 
  AccountCircle, 
  Close,
  Favorite,
  MonitorHeart,
  MedicalServices
} from "@mui/icons-material";
import HealthAnalytics from './HealthAnalytics';
import { format } from "date-fns";
import { QRCodeSVG } from "qrcode.react"; // Changed to named import

// Color scheme
const colors = {
  primary: "#2f7d6d",
  lightPrimary: "#8ec3b0",
  lighterPrimary: "#c5dbc7",
  background: "#f5f7fa",
  cardBg: "#ffffff",
  text: "#333333",
  secondaryText: "#666666",
  alert: "#d32f2f",
  success: "#388e3c"
};

// Reusable section card
const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card className="rounded-xl shadow-sm mb-4" sx={{ backgroundColor: colors.cardBg }}>
    <CardContent>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: colors.primary, mb: 2 }}>
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

// Barcode component
const Barcode = ({ patientId }: { patientId: string }) => (
  <div className="flex justify-center mt-6">
    <div className="h-16 bg-black flex items-center px-4">
      <div className="flex space-x-1">
        {[2, 5, 1, 3, 7, 2, 4, 6, 1, 3, 5, 2, 4, 6, 3, 5, 2, 4].map((width, i) => (
          <div 
            key={i}
            className="bg-white"
            style={{ width: `${width}px`, height: '40px' }}
          />
        ))}
      </div>
      <span className="ml-4 text-xs font-mono text-white">{patientId}</span>
    </div>
  </div>
);

// Patient type interface
interface Patient {
  name: string;
  id: string;
  dob: string;
  age: number;
  bloodGroup: string;
  gender: string;
  healthScore: number;
  bloodPressure: string;
  bloodSugar: string;
  upcomingAppointments: Array<{ doctor: string; date: string }>;
  recentReports: Array<{ test: string; date: string }>;
}

// Digital Health Card Popup
const DigitalHealthCard = ({ 
  open, 
  onClose,
  patient
}: {
  open: boolean;
  onClose: () => void;
  patient: Patient;
}) => {
  // Create a JSON string with patient data for the QR code
  const patientData = JSON.stringify({
    id: patient.id,
    name: patient.name,
    dob: patient.dob,
    bloodGroup: patient.bloodGroup,
    emergencyContact: "987-654-3210",
    issuer: "MediPal Healthcare",
    issueDate: format(new Date(), "yyyy/MM/dd")
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ style: { borderRadius: '16px', overflow: 'visible' } }}
    >
      <DialogContent className="p-0">
        <Card className="p-6 rounded-xl" sx={{ background: "linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)" }}>
          <IconButton 
            onClick={onClose}
            className="absolute top-2 right-2"
            sx={{ color: colors.secondaryText }}
          >
            <Close />
          </IconButton>

          <CardContent>
            {/* Header */}
            <div className="flex justify-between items-start">
              <Typography variant="h5" sx={{ fontWeight: "bold", color: colors.primary, mb: 2 }}>
                MEDIPAL HEALTH CARD
              </Typography>
              <div className="flex space-x-2">
                <div className="w-4 h-4 bg-[#8ec3b0] rounded-sm"></div>
                <div className="w-4 h-4 bg-[#c5dbc7] rounded-sm"></div>
                <div className="w-4 h-4 bg-[#8ec3b0] rounded-sm"></div>
              </div>
            </div>

            {/* Patient Info and QR Code side by side */}
            <div className="flex flex-col md:flex-row gap-6 mt-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row gap-6">
                  <Avatar
                    sx={{ 
                      width: 120, 
                      height: 120,
                      bgcolor: colors.primary,
                      fontSize: '3rem'
                    }}
                  >
                    <AccountCircle fontSize="inherit" />
                  </Avatar>

                  <div className="text-sm space-y-3">
                    <Typography>
                      <span className="font-bold">PATIENT'S NAME: </span>
                      {patient.name}
                    </Typography>
                    <Typography>
                      <span className="font-bold">PATIENT ID: </span>
                      {patient.id}
                    </Typography>
                    <Typography>
                      <span className="font-bold">D.O.B: </span>
                      {patient.dob} (Age: {patient.age})
                    </Typography>
                    <Typography>
                      <span className="font-bold">BLOOD GROUP: </span>
                      {patient.bloodGroup}
                    </Typography>
                    <Typography>
                      <span className="font-bold">GENDER: </span>
                      {patient.gender}
                    </Typography>
                    <Typography>
                      <span className="font-bold">ISSUED: </span>
                      {format(new Date(), "yyyy/MM/dd")}
                    </Typography>
                    <Typography>
                      <span className="font-bold">EMERGENCY CONTACT: </span>
                      987-654-3210
                    </Typography>
                  </div>
                </div>
              </div>
              
              {/* QR Code Section */}
              <div className="flex flex-col items-center justify-center border-l-0 md:border-l md:border-gray-200 md:pl-6">
                <div className="bg-white p-2 rounded-lg border border-gray-200">
                  <QRCodeSVG 
                    value={patientData} 
                    size={120}
                    level="H" // High error correction
                    includeMargin={true}
                    fgColor={colors.primary}
                  />
                </div>
                <Typography variant="caption" className="mt-2 text-center block" sx={{ color: colors.secondaryText }}>
                  Scan for emergency medical information
                </Typography>
              </div>
            </div>

            {/* Barcode */}
            <Barcode patientId={patient.id} />
            
            {/* Footer text */}
            <Typography variant="caption" className="mt-4 text-center block" sx={{ color: colors.secondaryText }}>
              In case of emergency, present this card to medical personnel
            </Typography>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default function PatientDashboard() {
  const [cardOpen, setCardOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string>("");
  const today = format(new Date(), "EEEE, MMMM dd, yyyy");

  // Rotate 4-5 health tips with simple fade transition
  const tips = [
    "Stay hydrated throughout the day.",
    "Aim for 7–8 hours of sleep.",
    "Take short walks to stay active.",
    "Include fruits and veggies in meals.",
    "Practice deep breathing to reduce stress."
  ];
  const [tipIndex, setTipIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTipIndex((i) => (i + 1) % tips.length), 4000);
    return () => clearInterval(id);
  }, []);

  // Fetch logged-in patient profile for greeting
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    if (!token || role !== 'patient') return;
    fetch('http://localhost:5000/api/patients/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => {
      if (data?.success && data?.user?.fullName) {
        const full: string = data.user.fullName as string;
        const first = full.trim().split(/\s+/)[0];
        setDisplayName(first || 'Patient');
      }
    })
    .catch(() => {});
  }, []);

  const patient: Patient = {
    name: displayName || "Patient",
    id: "123-456-7890",
    dob: "1995/05/15",
    age: 28,
    bloodGroup: "B+",
    gender: "Female",
    healthScore: 82,
    bloodPressure: "120/80 mmHg",
    bloodSugar: "95 mg/dL",
    upcomingAppointments: [
      { doctor: "Dr. Smith", date: "05 Aug 2025" },
      { doctor: "Dr. Lee", date: "20 Jul 2025" }
    ],
    recentReports: [
      { test: "Blood Test", date: "01 Aug 2025" },
      { test: "X-Ray", date: "15 Jul 2025" }
    ]
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background, padding: '16px' }}>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <Typography variant="body1" sx={{ color: colors.secondaryText }}>
          {today}
        </Typography>
        <IconButton onClick={() => setCardOpen(true)}>
          <Avatar sx={{ bgcolor: colors.primary }}>
            <AccountCircle />
          </Avatar>
        </IconButton>
      </div>

      {/* Welcome Message */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3, color: colors.primary }}>
        Hey {patient.name}, how are you feeling today?
      </Typography>

      {/* Health Tips */}
      <SectionCard title="Health Tips">
        <div className="flex items-center min-h-[48px]">
          <div className="w-12 h-12 bg-[#19eac0] rounded flex items-center justify-center text-white mr-4">
            💡
          </div>
          <Fade in key={tipIndex} timeout={500}>
            <Typography variant="body1">
              {tips[tipIndex]}
            </Typography>
          </Fade>
        </div>
      </SectionCard>

      {/* Health Overview */}
     

      {/* Health Analytics */}
      <HealthAnalytics />

      {/* Recent Reports */}
      <SectionCard title="My Reports (Recent)">
        <ul className="list-disc pl-5">
          {patient.recentReports.map((report, index) => (
            <li key={index}>
              <Typography>
                {report.test} - {report.date}
              </Typography>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Recent Appointments */}
      <SectionCard title="My Appointments (Recent)">
        <ul className="list-disc pl-5">
          {patient.upcomingAppointments.map((appt, index) => (
            <li key={index}>
              <Typography>
                {appt.doctor} - {appt.date}
              </Typography>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Digital Health Card Popup */}
      <DigitalHealthCard 
        open={cardOpen} 
        onClose={() => setCardOpen(false)} 
        patient={patient}
      />
    </div>
  );
}