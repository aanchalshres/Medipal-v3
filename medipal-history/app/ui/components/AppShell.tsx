'use client';

import { usePathname } from 'next/navigation';
import { MedicalNavbar } from './MedicalNavbar';
import { Footer } from './Footer';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide navbar on these routes
  const hideNavbarRoutes = ['/', '/patient/dashboard'];
  const shouldHideNavbar = hideNavbarRoutes.includes(pathname || '');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Conditionally render the navbar */}
      {!shouldHideNavbar && <MedicalNavbar />}

      {/* Main content */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 bg-white">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
      

      {/* Always render footer */}
      <Footer />
     
    </div>
  );
}