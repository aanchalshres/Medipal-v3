"use client";
import { ArrowRight, Shield, Users, Clock, Heart, Activity, Stethoscope, Pill } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const HeroSection = () => {
  const router = useRouter();
  const theme = useTheme();

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const stats = [
    { value: "10K+", label: "Patients", icon: <Users className="h-5 w-5" /> },
    { value: "500+", label: "Doctors", icon: <Stethoscope className="h-5 w-5" /> },
    { value: "99.9%", label: "Uptime", icon: <Activity className="h-5 w-5" /> }
  ];

  const features = [
    {
      path: "/",
      icon: <Users className="h-8 w-8 text-[#2A7F62]" />,
      title: "Patient Management",
      description: "Comprehensive patient records with secure access and real-time updates."
    },
    {
      path: "/",
      icon: <Clock className="h-8 w-8 text-[#2A7F62]" />,
      title: "Smart Scheduling",
      description: "Automated appointment scheduling with reminders and conflict detection."
    },
    {
      path: "/",
      icon: <Heart className="h-8 w-8 text-[#2A7F62]" />,
      title: "Health Analytics",
      description: "AI-powered insights and trends from patient data and medical history."
    },
    {
      path: "/",
      icon: <Pill className="h-8 w-8 text-[#2A7F62]" />,
      title: "Vaccine Tracking",
      description: "Complete immunization records with automated reminders for boosters."
    }
  ];

  const handleFeatureClick = (path: string) => {
    router.push(path);
  };

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        color: "#2D3748",
        py: 8,
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233A5E6D' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "16px 16px"
        }}
      />

      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: "1400px",
          mx: "auto",
          px: { xs: 4, sm: 6, md: 8 },
          py: { xs: 6, md: 10 }
        }}
      >
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Content */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial="hidden"
              animate="show"
              variants={container}
            >
              <motion.div variants={item}>
                <div className="flex justify-center lg:justify-start mb-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#3A5E6D] text-white backdrop-blur-md border border-[#3A5E6D]"
                  >
                    <Shield className="h-5 w-5" />
                    <span className="text-sm">HIMS Compliant</span>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div variants={item}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-center lg:text-left text-[#1E3A4D]">
                  Your Complete
                  <span className="block text-[#3A5E6D]">Medical History</span>
                  <span className="block bg-gradient-to-r from-[#2A7F62] to-[#388E3C] bg-clip-text text-transparent">
                    In One Place
                  </span>
                </h1>
              </motion.div>

              <motion.div variants={item}>
                <p className="text-xl text-[#2D3748] mb-8 max-w-[600px] mx-auto lg:mx-0 text-center lg:text-left">
                  Securely manage patient records, schedule appointments, and track medical history
                  with our comprehensive healthcare management system.
                </p>
              </motion.div>

              <motion.div
                variants={item}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
              >
                <Link href="/auth/login">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-[#2A7F62] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#388E3C] transition-all font-medium"
                  >
                    Get Started
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 1.5
                      }}
                      className="inline-flex items-center ml-2"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.span>
                  </motion.button>
                </Link>

                <Link href="/demo">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="text-[#3A5E6D] border border-[#3A5E6D] px-6 py-3 rounded-lg hover:bg-[#F5F9F8] transition-all font-medium"
                  >
                    View Demo
                  </motion.button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={container}
                className="grid grid-cols-3 gap-6 mt-12 pt-6 border-t border-[#E2E8F0]"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={item}
                    className="text-center"
                  >
                    <div className="flex justify-center items-center gap-2 text-[#3A5E6D]">
                      {stat.icon}
                      <h3 className="text-3xl font-bold">{stat.value}</h3>
                    </div>
                    <p className="text-sm text-[#2D3748] opacity-80">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial="hidden"
              animate="show"
              variants={container}
              className="grid gap-6 grid-cols-1 md:grid-cols-2"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                  className="p-6 rounded-xl bg-[#F5F9F8] border border-[#E2E8F0] hover:border-[#3A5E6D]/30 transition-all shadow-sm cursor-pointer"
                  onClick={() => handleFeatureClick(feature.path)}
                >
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#1E3A4D]">
                    {feature.title}
                  </h3>
                  <p className="text-[#2D3748]">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default HeroSection;