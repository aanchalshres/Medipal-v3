"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  Typography, 
  Avatar,
  Box,
  Fade,
  Button
} from "@mui/material";
import { 
  ArrowForward as ArrowForwardIcon,
  Visibility as ViewIcon
} from "@mui/icons-material";
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

// Reusable section card with optional link
const SectionCard = ({ 
  title, 
  children, 
  linkHref, 
  linkText 
}: { 
  title: string; 
  children: React.ReactNode;
  linkHref?: string;
  linkText?: string;
}) => (
  <Card className="rounded-xl shadow-sm mb-4" sx={{ backgroundColor: colors.cardBg }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: colors.primary }}>
          {title}
        </Typography>
        {linkHref && linkText && (
          <Button
            component={Link}
            href={linkHref}
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              color: colors.primary,
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(47, 125, 109, 0.08)'
              }
            }}
          >
            {linkText}
          </Button>
        )}
      </Box>
      {children}
    </CardContent>
  </Card>
);





export default function PatientDashboard() {
  const [displayName, setDisplayName] = useState<string>("");
  const [patientId, setPatientId] = useState<string>("");
  const [totalVisits] = useState<number>(12); // Will fetch from backend in production
  const [lastVisitDate] = useState<string>("December 15, 2024"); // Will fetch from backend
  const [latestReport] = useState<string>("Blood Test - Dec 18, 2024"); // Will fetch from backend
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
        // Set patient ID (using the new patientId format from backend)
        setPatientId(data.user.patientId || data.user.phone || data.user._id || 'N/A');
      }
    })
    .catch(() => {});
  }, []);

  const upcomingAppointments = [
    { doctor: "Dr. Ramesh Sharma", date: "Dec 28, 2024", link: "/appointments" },
    { doctor: "Dr. Krishna Bhattarai", date: "Dec 30, 2024", link: "/appointments" }
  ];

  const recentReports = [
    { test: "Blood Test Results", date: "Dec 15, 2024", link: "/reports" },
    { test: "X-Ray Chest", date: "Dec 10, 2024", link: "/reports" }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background, padding: '16px' }}>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <Typography variant="body1" sx={{ color: colors.secondaryText }}>
          {today}
        </Typography>
      </div>

      {/* Welcome Message with Patient Info */}
      <Card className="rounded-xl shadow-sm mb-4" sx={{ backgroundColor: colors.cardBg }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: colors.primary }}>
            Hey {displayName || 'Patient'}, how are you feeling today?
          </Typography>
          
          {/* Quick Overview Stats */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
            mt: 2
          }}>
            <Box sx={{ bgcolor: '#E8F5E9', p: 2, borderRadius: 2 }}>
              <Typography variant="body2" sx={{ color: colors.secondaryText, mb: 0.5 }}>
                Patient ID
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.primary }}>
                {patientId || 'Loading...'}
              </Typography>
            </Box>
            
            <Box 
              component={Link}
              href="/medical-records"
              sx={{ 
                bgcolor: '#E3F2FD', 
                p: 2, 
                borderRadius: 2,
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Typography variant="body2" sx={{ color: colors.secondaryText, mb: 0.5 }}>
                Total Visits
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976D2' }}>
                {totalVisits}
              </Typography>
            </Box>
            
            <Box 
              component={Link}
              href="/medical-records"
              sx={{ 
                bgcolor: '#FFF3E0', 
                p: 2, 
                borderRadius: 2,
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Typography variant="body2" sx={{ color: colors.secondaryText, mb: 0.5 }}>
                Last Visit
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#F57C00' }}>
                {lastVisitDate}
              </Typography>
            </Box>
            
            <Box 
              component={Link}
              href="/reports"
              sx={{ 
                bgcolor: '#FCE4EC', 
                p: 2, 
                borderRadius: 2,
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Typography variant="body2" sx={{ color: colors.secondaryText, mb: 0.5 }}>
                Latest Report
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#C2185B' }}>
                {latestReport}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

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
      <SectionCard title="My Reports (Recent)" linkHref="/reports" linkText="View All">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {recentReports.map((report, index) => (
            <Box 
              key={index}
              component={Link}
              href={report.link}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1.5,
                borderRadius: 1,
                textDecoration: 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(47, 125, 109, 0.05)',
                  transform: 'translateX(4px)'
                }
              }}
            >
              <Typography variant="body2" sx={{ color: colors.text }}>
                {report.test} - {report.date}
              </Typography>
              <ViewIcon sx={{ fontSize: 18, color: colors.primary }} />
            </Box>
          ))}
        </Box>
      </SectionCard>

      {/* Recent Appointments */}
      <SectionCard title="My Appointments (Recent)" linkHref="/appointments" linkText="View All">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {upcomingAppointments.map((appt, index) => (
            <Box 
              key={index}
              component={Link}
              href={appt.link}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1.5,
                borderRadius: 1,
                textDecoration: 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(47, 125, 109, 0.05)',
                  transform: 'translateX(4px)'
                }
              }}
            >
              <Typography variant="body2" sx={{ color: colors.text }}>
                {appt.doctor} - {appt.date}
              </Typography>
              <ViewIcon sx={{ fontSize: 18, color: colors.primary }} />
            </Box>
          ))}
        </Box>
      </SectionCard>
    </div>
  );
}