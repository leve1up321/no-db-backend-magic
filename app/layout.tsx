import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/Toaster';
import { AppProvider } from '@/contexts/AppContext';
import ToastContainer from '@/components/ToastContainer';

const ibmPlexArabic = IBM_Plex_Sans_Arabic({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['arabic'],
  display: 'swap',
});

// ✅ في Next.js 14+، viewport و themeColor يجب أن يكونوا في export منفصل
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#5AC8FA' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
  ],
};

export const metadata: Metadata = {
  title: 'LevelUp Digital Store | متجر لفل اب الرقمي',
  description: 'متجرك الموثوق للمنتجات الرقمية والاشتراكات المميزة بأفضل الأسعار. اشتراكات نتفليكس، سبوتيفاي، بطاقات iTunes والمزيد',
  keywords: ['متجر رقمي', 'منتجات رقمية', 'لفل اب', 'Level Up', 'خدمات إلكترونية', 'اشتراكات', 'بطاقات هدايا', 'نتفليكس', 'سبوتيفاي'],
  authors: [{ name: 'Level Up Team' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LevelUp Store',
  },
  openGraph: {
    title: 'LevelUp Digital Store | متجر لفل اب الرقمي',
    description: 'متجرك الموثوق للمنتجات الرقمية والاشتراكات المميزة',
    type: 'website',
    locale: 'ar_SA',
    siteName: 'LevelUp Digital Store',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LevelUp Digital Store',
    description: 'متجرك الموثوق للمنتجات الرقمية',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${ibmPlexArabic.className} antialiased`}>
        <AppProvider>
          {children}
          <Toaster />
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
