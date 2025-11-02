import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/Toaster';
import { AppProvider } from '@/contexts/AppContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LevelUp Digital Store | متجر لفل اب الرقمي',
  description: 'متجرك الموثوق للمنتجات الرقمية والاشتراكات المميزة بأفضل الأسعار. اشتراكات نتفليكس، سبوتيفاي، بطاقات iTunes والمزيد',
  keywords: ['متجر رقمي', 'منتجات رقمية', 'لفل اب', 'Level Up', 'خدمات إلكترونية', 'اشتراكات', 'بطاقات هدايا', 'نتفليكس', 'سبوتيفاي'],
  authors: [{ name: 'Level Up Team' }],
  openGraph: {
    title: 'LevelUp Digital Store | متجر لفل اب الرقمي',
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
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900 transition-colors duration-300`}>
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}

