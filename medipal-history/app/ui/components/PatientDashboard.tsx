"use client";
import React, { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  Typography, 
  Avatar,
  Box,
  Fade
} from "@mui/material";
import HealthAnalytics from './HealthAnalytics';
import { format } from "date-fns";

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





export default function PatientDashboard() {
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

  const upcomingAppointments = [
    { doctor: "Dr. Smith", date: "05 Aug 2025" },
    { doctor: "Dr. Lee", date: "20 Jul 2025" }
  ];

  const recentReports = [
    { test: "Blood Test", date: "01 Aug 2025" },
    { test: "X-Ray", date: "15 Jul 2025" }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background, padding: '16px' }}>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <Typography variant="body1" sx={{ color: colors.secondaryText }}>
          {today}
        </Typography>
      </div>

      {/* Welcome Message */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3, color: colors.primary }}>
        Hey {displayName || 'Patient'}, how are you feeling today?
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
          {recentReports.map((report, index) => (
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
          {upcomingAppointments.map((appt, index) => (
            <li key={index}>
              <Typography>
                {appt.doctor} - {appt.date}
              </Typography>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}