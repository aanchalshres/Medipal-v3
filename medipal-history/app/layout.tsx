// app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppThemeProvider } from './ui/components/ThemeContext';
import { Toaster } from 'sonner';
import  AppShell  from './ui/components/AppShell'; // 👈 Client wrapper for navbar/footer

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Patient Care Portal',
  description: 'Medical History System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`} suppressHydrationWarning>
        <AppThemeProvider>
          <AppShell>
            {children}
          </AppShell>

          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              style: {
                fontFamily: inter.style.fontFamily,
              },
            }}
          />
        </AppThemeProvider>
      </body>
    </html>
  );
}
