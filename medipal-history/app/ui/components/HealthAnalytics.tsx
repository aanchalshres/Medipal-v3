"use client";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Divider, 
  Tabs, 
  Tab,
  Paper,
  Avatar,
  IconButton,
  Button,
  ButtonGroup
} from '@mui/material';
import { 
  Activity,
  HeartPulse,
  TrendingUp,
  Calendar,
  Pill,
  Stethoscope,
  FileText,
  Download,
  Share2,
  Filter,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HealthAnalyticsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('3m');

  // Sample health data
  const healthMetrics = [
    { name: 'Jan', value: 120 },
    { name: 'Feb', value: 118 },
    { name: 'Mar', value: 115 },
    { name: 'Apr', value: 117 },
    { name: 'May', value: 119 },
    { name: 'Jun', value: 116 },
  ];

  const bloodPressureData = [
    { date: '01/01', systolic: 120, diastolic: 80 },
    { date: '01/15', systolic: 122, diastolic: 82 },
    { date: '02/01', systolic: 118, diastolic: 78 },
    { date: '02/15', systolic: 119, diastolic: 79 },
    { date: '03/01', systolic: 117, diastolic: 77 },
    { date: '03/15', systolic: 115, diastolic: 75 },
  ];

  const medications = [
    { name: 'Atorvastatin', dosage: '20mg', frequency: 'Daily', lastTaken: 'Today' },
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', lastTaken: 'Today' },
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Daily', lastTaken: 'Yesterday' },
  ];

  const recentActivities = [
    { type: 'Lab Test', name: 'Complete Blood Count', date: '2 days ago', icon: <FileText size={20} /> },
    { type: 'Appointment', name: 'Dr. Smith - Cardiology', date: '1 week ago', icon: <Stethoscope size={20} /> },
    { type: 'Medication', name: 'Atorvastatin Refill', date: '2 weeks ago', icon: <Pill size={20} /> },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box className="min-h-screen bg-[#F5F9F8] p-4 md:p-8">
      {/* Header */}
      <Box className="mb-6">
        <Typography variant="h4" className="font-bold text-[#2D3748] flex items-center gap-2">
          <HeartPulse className="text-[#2A7F62]" />
          Health Analytics Dashboard
        </Typography>
        <Typography variant="body1" className="text-[#5A677D]">
          Comprehensive analysis of your medical history and health trends
        </Typography>
      </Box>

      {/* Time Range Selector */}
      <Box className="flex justify-end mb-6">
        <ButtonGroup variant="outlined" aria-label="Time range selector">
          {['1w', '1m', '3m', '6m', '1y'].map((range) => (
            <Button
              key={range}
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? 'bg-[#2A7F62] text-white' : 'text-[#2D3748]'}
            >
              {range}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Overview Cards */}
        <div className="w-full md:w-1/3">
          <Card className="h-full bg-white rounded-xl shadow-sm">
            <CardContent>
              <Typography variant="h6" className="font-semibold text-[#2D3748] mb-4">
                Health Summary
              </Typography>
              
              <Box className="space-y-4">
                <Paper className="p-3 flex items-center gap-3">
                  <Avatar className="bg-[#E6F2ED] text-[#2A7F62]">
                    <Activity size={20} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" className="text-[#5A677D]">
                      Average Heart Rate
                    </Typography>
                    <Typography variant="h6" className="font-bold">
                      72 <span className="text-sm font-normal text-[#5A677D]">bpm</span>
                    </Typography>
                  </Box>
                </Paper>

                <Paper className="p-3 flex items-center gap-3">
                  <Avatar className="bg-[#E6F2ED] text-[#2A7F62]">
                    <TrendingUp size={20} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" className="text-[#5A677D]">
                      Blood Pressure
                    </Typography>
                    <Typography variant="h6" className="font-bold">
                      118/76 <span className="text-sm font-normal text-[#5A677D]">mmHg</span>
                    </Typography>
                  </Box>
                </Paper>

                <Paper className="p-3 flex items-center gap-3">
                  <Avatar className="bg-[#E6F2ED] text-[#2A7F62]">
                    <Calendar size={20} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" className="text-[#5A677D]">
                      Last Checkup
                    </Typography>
                    <Typography variant="h6" className="font-bold">
                      May 15, 2023
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </div>

        {/* Health Trends Chart */}
        <div className="w-full md:w-2/3">
          <Card className="h-full bg-white rounded-xl shadow-sm">
            <CardContent>
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-semibold text-[#2D3748]">
                  Health Trends
                </Typography>
                <Box className="flex gap-2">
                  <IconButton size="small" className="text-[#5A677D]">
                    <Download size={18} />
                  </IconButton>
                  <IconButton size="small" className="text-[#5A677D]">
                    <Share2 size={18} />
                  </IconButton>
                  <IconButton size="small" className="text-[#5A677D]">
                    <Filter size={18} />
                  </IconButton>
                </Box>
              </Box>

              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                className="mb-4"
              >
                <Tab label="Blood Pressure" icon={<Activity size={16} />} />
                <Tab label="Heart Rate" icon={<HeartPulse size={16} />} />
                <Tab label="Medication" icon={<Pill size={16} />} />
              </Tabs>

              <Box className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tabValue === 0 ? bloodPressureData : healthMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey={tabValue === 0 ? "date" : "name"} stroke="#5A677D" />
                    <YAxis stroke="#5A677D" />
                    <Tooltip />
                    {tabValue === 0 ? (
                      <>
                        <Line 
                          type="monotone" 
                          dataKey="systolic" 
                          stroke="#D32F2F" 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="diastolic" 
                          stroke="#2A7F62" 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </>
                    ) : (
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3A5E6D" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Current Medications */}
        <div className="w-full md:w-1/2">
          <Card className="h-full bg-white rounded-xl shadow-sm">
            <CardContent>
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-semibold text-[#2D3748]">
                  Current Medications
                </Typography>
                <Button 
                  variant="text" 
                  className="text-[#2A7F62] flex items-center gap-1"
                  endIcon={<ArrowRight size={16} />}
                >
                  View All
                </Button>
              </Box>

              <Box className="space-y-3">
                {medications.map((med, index) => (
                  <Paper key={index} className="p-3">
                    <Box className="flex items-start gap-3">
                      <Avatar className="bg-[#E6F2ED] text-[#2A7F62] mt-1">
                        <Pill size={18} />
                      </Avatar>
                      <Box className="flex-1">
                        <Typography variant="subtitle1" className="font-medium">
                          {med.name}
                        </Typography>
                        <Typography variant="body2" className="text-[#5A677D]">
                          {med.dosage} • {med.frequency}
                        </Typography>
                      </Box>
                      <Typography variant="caption" className="text-[#5A677D]">
                        {med.lastTaken}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="w-full md:w-1/2">
          <Card className="h-full bg-white rounded-xl shadow-sm">
            <CardContent>
              <Typography variant="h6" className="font-semibold text-[#2D3748] mb-4">
                Recent Health Activities
              </Typography>

              <Box className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <Box key={index} className="flex items-start gap-3">
                    <Avatar className="bg-[#E6F2ED] text-[#2A7F62]">
                      {activity.icon}
                    </Avatar>
                    <Box className="flex-1">
                      <Typography variant="subtitle1" className="font-medium">
                        {activity.name}
                      </Typography>
                      <Typography variant="body2" className="text-[#5A677D]">
                        {activity.type} • {activity.date}
                      </Typography>
                    </Box>
                    <Button 
                      variant="outlined" 
                      size="small"
                      className="text-[#2A7F62] border-[#2A7F62]"
                    >
                      Details
                    </Button>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </div>
      </div>
    </Box>
  );
};

export default HealthAnalyticsPage;