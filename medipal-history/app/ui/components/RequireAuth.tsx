"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';

type Role = 'doctor' | 'patient';

interface RequireAuthProps {
  allowedRoles?: Role[];
  children: React.ReactNode;
}

export default function RequireAuth({ allowedRoles, children }: RequireAuthProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const role = typeof window !== 'undefined' ? localStorage.getItem('role') as Role | null : null;

      if (!token) {
        router.replace('/auth/login');
        return;
      }

      if (allowedRoles && allowedRoles.length > 0) {
        if (!role || !allowedRoles.includes(role)) {
          router.replace('/auth/login');
          return;
        }
      }
    } finally {
      setChecking(false);
    }
  }, [router, allowedRoles]);

  if (checking) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
