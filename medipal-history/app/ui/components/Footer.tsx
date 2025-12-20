"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  useTheme
} from "@mui/material";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";
import { motion } from "framer-motion";

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Find a Doctor", href: "/doctors" },
  { name: "Contact", href: "/contact" },
];

const services = [
  { name: "Medical Records", href: "/medical-records" },
  { name: "Appointment Booking", href: "/appointments" },
  { name: "E-Prescriptions", href: "/prescriptions" },
  { name: "Lab Reports", href: "/lab-reports" },
  { name: "Vaccination Tracker", href: "/vaccination" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Cookie Policy", href: "/cookies" },
];

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
];

const hoverColor = "#5D8BA3"; // A lighter shade of the primary color for hover effects
const textHoverColor = "#FFFFFF"; // White for text hover
const socialHoverColor = "#2C4B5A"; // A darker shade for social buttons

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#3A5E6D',
        color: 'white',
        py: 8,
        px: { xs: 2, md: 4 },
        fontFamily: 'inherit'
      }}
    >
      <Box sx={{ 
        maxWidth: 'xl', 
        mx: 'auto',
        px: { xs: 2, md: 4 }
      }}>
        {/* Main Footer Content */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              lg: 'repeat(4, 1fr)' 
            },
            gap: 6,
            mb: 6
          }}
        >
          {/* Brand Section */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 3,
            pr: 2
          }}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  fontSize: { xs: '1.8rem', md: '2.2rem' },
                  lineHeight: 1.2,
                  mb: 1
                }}
              >
                Medipal
              </Typography>
            </motion.div>

            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: 1.7,
                fontSize: '1.05rem'
              }}
            >
              Revolutionizing healthcare through innovative digital solutions for seamless patient experiences and improved outcomes.
            </Typography>

            {/* Contact Info */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2.5,
              mt: 2
            }}>
              {[
                { icon: Phone, text: "+977-1-4210106" },
                { icon: Mail, text: "support@medipal.com" },
                { icon: MapPin, text: "Kathmandu, Nepal" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <item.icon color="white" size={22} />
                    <Typography variant="body1" sx={{ 
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontSize: '1.05rem'
                    }}>
                      {item.text}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Box>

          {/* Quick Links */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 3 
          }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: 'white',
                fontSize: '1.3rem',
                mb: 1
              }}
            >
              Quick Links
            </Typography>
            <List sx={{ p: 0 }}>
              {quickLinks.map((link) => (
                <motion.div
                  key={link.name}
                  whileHover={{ x: 5 }}
                  whileTap={{ x: 0 }}
                >
                  <ListItem sx={{ 
                    p: 0, 
                    mb: 1.5,
                  }}>
                    <Link
                      href={link.href}
                      style={{ textDecoration: 'none', width: '100%' }}
                    >
                      <ListItemText
                        primary={
                          <motion.span
                            whileHover={{ color: textHoverColor }}
                            style={{
                              color: 'rgba(255, 255, 255, 0.85)',
                              fontSize: '1.05rem',
                              fontWeight: 500,
                              display: 'inline-block'
                            }}
                          >
                            {link.name}
                          </motion.span>
                        }
                      />
                    </Link>
                  </ListItem>
                </motion.div>
              ))}
            </List>
          </Box>

          {/* Our Services */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 3 
          }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: 'white',
                fontSize: '1.3rem',
                mb: 1
              }}
            >
              Our Services
            </Typography>
            <List sx={{ p: 0 }}>
              {services.map((service) => (
                <motion.div
                  key={service.name}
                  whileHover={{ x: 5 }}
                  whileTap={{ x: 0 }}
                >
                  <ListItem sx={{ 
                    p: 0, 
                    mb: 1.5,
                  }}>
                    <Link
                      href={service.href}
                      style={{ textDecoration: 'none', width: '100%' }}
                    >
                      <ListItemText
                        primary={
                          <motion.span
                            whileHover={{ color: textHoverColor }}
                            style={{
                              color: 'rgba(255, 255, 255, 0.85)',
                              fontSize: '1.05rem',
                              fontWeight: 500,
                              display: 'inline-block'
                            }}
                          >
                            {service.name}
                          </motion.span>
                        }
                      />
                    </Link>
                  </ListItem>
                </motion.div>
              ))}
            </List>
          </Box>

          {/* Legal & Social */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 4 
          }}>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: 'white',
                  fontSize: '1.3rem',
                  mb: 1
                }}
              >
                Legal
              </Typography>
              <List sx={{ p: 0 }}>
                {legalLinks.map((link) => (
                  <motion.div
                    key={link.name}
                    whileHover={{ x: 5 }}
                    whileTap={{ x: 0 }}
                  >
                    <ListItem sx={{ 
                      p: 0, 
                      mb: 1.5,
                    }}>
                      <Link
                        href={link.href}
                        style={{ textDecoration: 'none', width: '100%' }}
                      >
                        <ListItemText
                          primary={
                            <motion.span
                              whileHover={{ color: textHoverColor }}
                              style={{
                                color: 'rgba(255, 255, 255, 0.85)',
                                fontSize: '1.05rem',
                                fontWeight: 500,
                                display: 'inline-block'
                              }}
                            >
                              {link.name}
                            </motion.span>
                          }
                        />
                      </Link>
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </Box>

            {/* Social Links */}
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: 'white',
                  fontSize: '1.3rem',
                  mb: 2
                }}
              >
                Follow Us
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: 2,
                flexWrap: 'wrap'
              }}>
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.div
                      key={social.name}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IconButton
                        href={social.href}
                        aria-label={social.name}
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          p: 1.5,
                          '&:hover': {
                            backgroundColor: socialHoverColor,
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Icon size={22} />
                      </IconButton>
                    </motion.div>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Bottom Bar */}
        <Divider sx={{
          borderColor: 'rgba(255, 255, 255, 0.15)',
          my: 4
        }} />
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 3,
          pt: 2
        }}>
          <motion.div
            whileHover={{ scale: 1.02 }}
          >
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '1rem',
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              © {new Date().getFullYear()} Medipal. All rights reserved.
            </Typography>
          </motion.div>
          
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            {[
              { icon: '🔒', text: 'HIMS Compliant' },
              { icon: '🛡️', text: 'SSL Secured' },
              { icon: '📱', text: 'Mobile Ready' }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Box component="span" sx={{ fontSize: '1.1rem' }}>{item.icon}</Box>
                <Typography variant="body1">{item.text}</Typography>
                {index < 2 && (
                  <Divider orientation="vertical" flexItem sx={{ 
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    height: '1.2rem',
                    mx: 1
                  }} />
                )}
              </motion.div>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}