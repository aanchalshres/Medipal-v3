"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Button,
  Divider,
  Paper,
} from "@mui/material";
import { 
  Calendar,
  Users,
  FileText,
  Clock,
  TrendingUp,
  Activity
} from "lucide-react";
import { format } from "date-fns";

const colors = {
  primary: "#2f7d6d",
  lightPrimary: "#8ec3b0",
  lighterPrimary: "#c5dbc7",
  background: "#f5f7fa",
  cardBg: "#ffffff",
  text: "#333333",
  secondaryText: "#666666",
  success: "#388e3c"
};

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

const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subtitle 
}: { 
  icon: any; 
  title: string; 
  value: string | number; 
  subtitle?: string;
}) => (
  <Paper className="p-4 rounded-xl" sx={{ backgroundColor: colors.cardBg }}>
    <Box className="flex items-center gap-3">
      <Box 
        sx={{ 
          width: 48, 
          height: 48, 
          borderRadius: 2, 
          bgcolor: colors.lightPrimary + '40',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Icon size={24} color={colors.primary} />
      </Box>
      <Box className="flex-1">
        <Typography variant="body2" sx={{ color: colors.secondaryText, fontSize: '0.875rem' }}>
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.text }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: colors.secondaryText }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  </Paper>
);

interface Appointment {
  patientName: string;
  time: string;
  type: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export default function DoctorDashboard() {
  const [doctorName, setDoctorName] = useState<string>("");
  const today = format(new Date(), "EEEE, MMMM dd, yyyy");

  // Fetch logged-in doctor profile
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    if (!token || role !== 'doctor') return;
    fetch('http://localhost:5000/api/doctors/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => {
      if (data?.success && data?.user?.fullName) {
        const full: string = data.user.fullName as string;
        const first = full.trim().split(/\s+/)[0];
        setDoctorName(first || 'Doctor');
      }
    })
    .catch(() => {});
  }, []);

  // Sample data - replace with real API calls
  const todaysAppointments: Appointment[] = [
    { patientName: "John Doe", time: "09:00 AM", type: "Consultation", status: 'upcoming' },
    { patientName: "Jane Smith", time: "10:30 AM", type: "Follow-up", status: 'upcoming' },
    { patientName: "Mike Johnson", time: "02:00 PM", type: "Check-up", status: 'upcoming' },
  ];

  const stats = {
    todayPatients: 8,
    pendingAppointments: 3,
    completedToday: 5,
    totalPatients: 156
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return '#2196f3';
      case 'completed': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return colors.secondaryText;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background, padding: '16px' }}>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <Typography variant="body1" sx={{ color: colors.secondaryText }}>
          {today}
        </Typography>
      </div>

      {/* Welcome Message */}
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4, color: colors.primary }}>
        Hello Dr. {doctorName}, ready for today's consultations?
      </Typography>

      {/* Stats Grid */}
      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          icon={Calendar}
          title="Today's Patients"
          value={stats.todayPatients}
          subtitle="Scheduled appointments"
        />
        <StatCard 
          icon={Clock}
          title="Pending"
          value={stats.pendingAppointments}
          subtitle="Awaiting consultation"
        />
        <StatCard 
          icon={Activity}
          title="Completed Today"
          value={stats.completedToday}
          subtitle="Consultations done"
        />
        <StatCard 
          icon={Users}
          title="Total Patients"
          value={stats.totalPatients}
          subtitle="All time"
        />
      </Box>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2">
          <SectionCard title="Today's Appointments">
            {todaysAppointments.length === 0 ? (
              <Typography sx={{ color: colors.secondaryText, textAlign: 'center', py: 4 }}>
                No appointments scheduled for today
              </Typography>
            ) : (
              <Box className="space-y-3">
                {todaysAppointments.map((apt, index) => (
                  <Paper 
                    key={index} 
                    className="p-4"
                    sx={{ 
                      borderLeft: `4px solid ${getStatusColor(apt.status)}`,
                      '&:hover': { boxShadow: 2 }
                    }}
                  >
                    <Box className="flex items-center justify-between">
                      <Box className="flex items-center gap-3">
                        <Avatar sx={{ bgcolor: colors.lightPrimary }}>
                          {apt.patientName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {apt.patientName}
                          </Typography>
                          <Typography variant="body2" sx={{ color: colors.secondaryText }}>
                            {apt.time} • {apt.type}
                          </Typography>
                        </Box>
                      </Box>
                      <Box className="flex gap-2">
                        <Chip 
                          label={apt.status}
                          size="small"
                          sx={{ 
                            bgcolor: getStatusColor(apt.status) + '20',
                            color: getStatusColor(apt.status),
                            fontWeight: 600,
                            textTransform: 'capitalize'
                          }}
                        />
                        <Button 
                          variant="outlined" 
                          size="small"
                          sx={{ 
                            color: colors.primary,
                            borderColor: colors.primary
                          }}
                        >
                          View
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </SectionCard>
        </div>

        {/* Quick Actions & Info */}
        <div>
          <SectionCard title="Quick Actions">
            <Box className="space-y-2">
              <Button 
                fullWidth 
                variant="contained"
                startIcon={<Calendar />}
                sx={{ 
                  bgcolor: colors.primary,
                  '&:hover': { bgcolor: '#1e6d54' },
                  mb: 1
                }}
              >
                View Schedule
              </Button>
              <Button 
                fullWidth 
                variant="outlined"
                startIcon={<Users />}
                sx={{ 
                  color: colors.primary,
                  borderColor: colors.primary,
                  mb: 1
                }}
              >
                Patient Records
              </Button>
              <Button 
                fullWidth 
                variant="outlined"
                startIcon={<FileText />}
                sx={{ 
                  color: colors.primary,
                  borderColor: colors.primary
                }}
              >
                Prescriptions
              </Button>
            </Box>
          </SectionCard>

          <SectionCard title="Recent Activity">
            <Box className="space-y-3">
              <Box className="flex items-start gap-2">
                <Activity size={16} color={colors.primary} className="mt-1" />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    New patient registered
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.secondaryText }}>
                    2 hours ago
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <Box className="flex items-start gap-2">
                <FileText size={16} color={colors.primary} className="mt-1" />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Lab results uploaded
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.secondaryText }}>
                    5 hours ago
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <Box className="flex items-start gap-2">
                <TrendingUp size={16} color={colors.primary} className="mt-1" />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Monthly report ready
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.secondaryText }}>
                    1 day ago
                  </Typography>
                </Box>
              </Box>
            </Box>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
