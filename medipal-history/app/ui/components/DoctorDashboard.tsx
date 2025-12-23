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
import Link from "next/link";
import { 
  Calendar,
  Users,
  FileText,
  Clock,
  Search,
  Activity,
  Building2
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

interface AppointmentItem {
  patientName: string;
  time: string;
  appointmentType: string;
  status: 'Pending' | 'Approved' | 'Completed' | 'Cancelled';
  date: string;
}

interface ConsultationItem {
  patientId: string;
  patientName: string;
  date: string;
  diagnosis: string;
}

export default function DoctorDashboard() {
  const [doctorName, setDoctorName] = useState<string>("");
  const [hospitalName, setHospitalName] = useState<string>("");
  const [todaysAppointments, setTodaysAppointments] = useState<AppointmentItem[]>([]);
  const [recentConsultations, setRecentConsultations] = useState<ConsultationItem[]>([]);
  const [stats, setStats] = useState({
    todayPatients: 0,
    pendingAppointments: 0,
    completedToday: 0,
    totalPatients: 0,
  });
  const today = format(new Date(), "EEEE, MMMM dd, yyyy");

  // Fetch logged-in doctor profile + appointments + consultations
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    if (!token || role !== 'doctor') return;
    // Profile
    fetch('http://localhost:5000/api/doctors/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => {
      if (data?.success && data?.user) {
        if (data.user.fullName) {
          setDoctorName(data.user.fullName);
        }
        if (data.user.hospital) {
          setHospitalName(data.user.hospital);
        }
      }
    })
    .catch(() => {});

    // Appointments for doctor
    fetch('http://localhost:5000/api/appointments/doctor/list', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(res => {
        if (res?.success && Array.isArray(res.data)) {
          const todayStr = format(new Date(), 'yyyy-MM-dd');
          const items: AppointmentItem[] = res.data
            .filter((a: any) => a?.date && format(new Date(a.date), 'yyyy-MM-dd') === todayStr)
            .map((a: any) => ({
              patientName: a.patientName,
              time: a.time,
              appointmentType: a.appointmentType,
              status: a.status,
              date: a.date,
            }));
          setTodaysAppointments(items);
          const pending = res.data.filter((a: any) => a.status === 'Pending').length;
          const completedToday = res.data.filter((a: any) => a.status === 'Completed' && format(new Date(a.date), 'yyyy-MM-dd') === todayStr).length;
          const totalPatients = new Set(res.data.map((a: any) => a.patientId)).size;
          setStats(s => ({
            ...s,
            todayPatients: items.length,
            pendingAppointments: pending,
            completedToday,
            totalPatients,
          }));
        }
      })
      .catch(() => {});

    // Recent consultations by doctor
    fetch('http://localhost:5000/api/doctors/consultations', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(res => {
        if (res?.success && Array.isArray(res.data)) {
          const items: ConsultationItem[] = res.data.slice(0, 5).map((c: any) => ({
            patientId: c.patientId,
            patientName: c.patientName,
            date: format(new Date(c.date), 'MMM dd, yyyy'),
            diagnosis: c.diagnosis || '',
          }));
          setRecentConsultations(items);
        }
      })
      .catch(() => {});
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#2196f3';
      case 'Approved': return '#1976D2';
      case 'Completed': return '#4caf50';
      case 'Cancelled': return '#f44336';
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: colors.primary, mb: 1 }}>
          Welcome, Dr. {doctorName}
        </Typography>
        {hospitalName && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Building2 size={18} color={colors.secondaryText} />
            <Typography variant="body1" sx={{ color: colors.secondaryText }}>
              {hospitalName}
            </Typography>
          </Box>
        )}
        <Typography variant="body1" sx={{ color: colors.secondaryText }}>
          You have <strong>{stats.todayPatients}</strong> appointments scheduled for today
        </Typography>
      </Box>

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
                            {apt.time} • {apt.appointmentType}
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
  

          <SectionCard title="Recent Consultations">
            <Box className="space-y-3">
              {recentConsultations.map((consultation, index) => (
                <React.Fragment key={index}>
                  <Box className="flex items-start gap-2">
                    <Users size={16} color={colors.primary} className="mt-1" />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {consultation.patientName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.secondaryText, display: 'block' }}>
                        ID: {consultation.patientId}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.secondaryText }}>
                        {consultation.date} • {consultation.diagnosis}
                      </Typography>
                    </Box>
                  </Box>
                  {index < recentConsultations.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Box>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
