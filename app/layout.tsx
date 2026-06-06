import type { Metadata, Viewport } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import CustomCursor from '@/components/cursor/CustomCursor';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Hamza Loubani – Full-Stack Engineer',
  description:
    'Full-stack engineer from Tripoli, Lebanon. Building fast, accessible web experiences with React, Next.js, Node.js, and modern DevOps practices.',
  keywords: ['Full-Stack Developer', 'React', 'Next.js', 'Node.js', 'TypeScript', 'Lebanon'],
  authors: [{ name: 'Hamza Loubani', url: 'https://hamzaloubani.dev' }],
  openGraph: {
    title: 'Hamza Loubani – Full-Stack Engineer',
    description: 'Building fast, accessible web experiences with clean architecture.',
    type: 'website',
    locale: 'en_US',
    url: 'https://hamzaloubani.dev',
    siteName: 'Hamza Loubani Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hamza Loubani – Full-Stack Engineer',
    description: 'Building fast, accessible web experiences with clean architecture.',
    creator: '@hamzaloubani',
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover' as const,   // enables env(safe-area-inset-*) on notched phones
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <body>
        <CustomCursor />
        <div className="gradient-mesh" aria-hidden="true" />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
