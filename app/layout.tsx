import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/site-header';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'World Cup 2026 Match Center · Live Countdown',
    template: '%s · World Cup 2026',
  },
  description:
    'Follow every FIFA World Cup 2026 match with live countdown timers, stadium details, fixtures and results across the USA, Canada and Mexico.',
  keywords: [
    'FIFA World Cup 2026',
    'World Cup matches',
    'World Cup countdown',
    'World Cup fixtures',
    'World Cup stadiums',
  ],
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'World Cup 2026 Match Center',
    description:
      'Live countdown timers and stadium details for every FIFA World Cup 2026 match.',
    url: siteUrl,
    siteName: 'World Cup 2026 Match Center',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Cup 2026 Match Center',
    description: 'Live countdown timers for every FIFA World Cup 2026 match.',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#070b18',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <SiteHeader />
        <main>{children}</main>
        <footer className="border-t border-white/10 py-8 text-center text-sm text-muted-foreground">
          <div className="container">
            <p>World Cup 2026 Match Center — built for football fans.</p>
            <p className="mt-1 text-xs">
              Fixtures shown are illustrative. Not affiliated with FIFA.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
