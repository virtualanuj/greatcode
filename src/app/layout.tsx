// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/navigation/Navbar';

export const metadata: Metadata = {
  title: 'AlgoLens | Python Data Structures & Algorithms Visual Studio',
  description: 'Master 45 high-frequency Python DSA interview patterns through interactive time-travel visual execution and client-side code practice.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
