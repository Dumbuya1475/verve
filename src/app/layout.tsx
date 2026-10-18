import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
import { InstallPrompt } from '@/components/InstallPrompt';
import { OfflineBanner } from '@/components/OfflineBanner';
import { FirebaseAnalytics } from '@/components/FirebaseAnalytics';
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/site';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Assignment Cover Page Maker for Sierra Leone Students',
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  metadataBase: SITE_URL,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_SL',
    title: 'Assignment Cover Page Maker for Sierra Leone Students',
    description: SITE_TAGLINE,
    url: SITE_URL,
  },
  twitter: {
    card: 'summary',
    title: 'Assignment Cover Page Maker for Sierra Leone Students',
    description: SITE_TAGLINE,
  },
  appleWebApp: {
    capable: true,
    title: 'Verve',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#FAFAF9',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <FirebaseAnalytics />
        <AuthProvider>
          <ServiceWorkerRegister />
          <OfflineBanner />
          {children}
          <InstallPrompt />
        </AuthProvider>
      </body>
    </html>
  );
}
