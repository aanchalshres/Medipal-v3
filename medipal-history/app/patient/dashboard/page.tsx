"use client";
import PatientDashboard from '../../ui/components/PatientDashboard';
import RequireAuth from '../../ui/components/RequireAuth';

export default function Home() {
  return (
    <RequireAuth allowedRoles={["patient"]}>
      <PatientDashboard />
    </RequireAuth>
  );
}
