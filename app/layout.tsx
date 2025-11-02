import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/Toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LevelUp Digital Store | منتجات رقمية عالية الجودة',
  description: 'متجرك الموثوق للمنتجات الرقمية والاشتراكات المميزة بأفضل الأسعار',
  keywords: ['متجر رقمي', 'منتجات رقمية', 'لفل اب', 'خدمات إلكترونية', 'اشتراكات', 'بطاقات هدايا'],
  authors: [{ name: 'LevelUp Team' }],
  openGraph: {
    title: 'LevelUp Digital Store',
    description: 'متجرك الموثوق للمنتجات الرقمية والاشتراكات المميزة',
    type: 'website',
    locale: 'ar_SA',
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
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

