"use client";
import DoctorDashboard from '../../ui/components/DoctorDashboard';
import RequireAuth from '../../ui/components/RequireAuth';

export default function Home() {
  return (
    <RequireAuth allowedRoles={["doctor"]}>
      <DoctorDashboard />
    </RequireAuth>
  );
}
