'use client';

import { Mail, Home, ShoppingBag, HelpCircle, Phone } from 'lucide-react';
import { FaTiktok, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-dark-400 border-t border-primary-300/10 text-white safe-bottom">
      <div className="container-mobile py-8 sm:py-12">
        {/* Main Footer Content - Mobile First */}
        <div className="space-y-8">
          {/* Company Info */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
              <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
                <Image
                  src="/logo.png"
                  alt="Level Up Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-300 to-accent-600 bg-clip-text text-transparent">
                Level Up
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6 text-base px-4">
              متجرك الموثوق للكتب والمنتجات الرقمية بأفضل الأسعار وتسليم فوري ⚡
            </p>
            
            {/* Social Icons - Mobile Optimized */}
            <div className="flex gap-4 justify-center">
              <a
                href="https://wa.me/971503492848"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-dark-300/80 rounded-xl flex items-center justify-center hover:bg-green-600 active:bg-green-700 hover:scale-110 active:scale-95 transition-all duration-300 touch-manipulation"
                aria-label="واتساب"
              >
                <FaWhatsapp className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/lvlup3211/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-dark-300/80 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 active:scale-95 hover:scale-110 transition-all duration-300 touch-manipulation"
                aria-label="إنستغرام"
              >
                <FaInstagram className="w-6 h-6" />
              </a>
              <a
                href="https://www.tiktok.com/@lvlup321"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-dark-300/80 rounded-xl flex items-center justify-center hover:bg-primary-300 hover:text-gray-900 active:scale-95 hover:scale-110 transition-all duration-300 touch-manipulation"
                aria-label="تيك توك"
              >
                <FaTiktok className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary-300/20 to-transparent" />

          {/* Quick Links - Stacked Vertically for Mobile */}
          <div className="text-center">
            <h4 className="text-lg font-bold mb-4 text-primary-300">روابط سريعة</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="inline-flex items-center justify-center gap-3 w-full px-6 py-4 text-gray-300 hover:text-white bg-dark-300/30 hover:bg-primary-300/10 active:bg-primary-300/20 rounded-xl transition-all duration-200 text-base font-semibold touch-manipulation group"
                >
                  <Home className="w-5 h-5 text-primary-300 group-hover:scale-110 transition-transform" />
                  <span>الرئيسية</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/#products" 
                  className="inline-flex items-center justify-center gap-3 w-full px-6 py-4 text-gray-300 hover:text-white bg-dark-300/30 hover:bg-primary-300/10 active:bg-primary-300/20 rounded-xl transition-all duration-200 text-base font-semibold touch-manipulation group"
                >
                  <ShoppingBag className="w-5 h-5 text-primary-300 group-hover:scale-110 transition-transform" />
                  <span>المنتجات</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/#faq" 
                  className="inline-flex items-center justify-center gap-3 w-full px-6 py-4 text-gray-300 hover:text-white bg-dark-300/30 hover:bg-primary-300/10 active:bg-primary-300/20 rounded-xl transition-all duration-200 text-base font-semibold touch-manipulation group"
                >
                  <HelpCircle className="w-5 h-5 text-primary-300 group-hover:scale-110 transition-transform" />
                  <span>الأسئلة الشائعة</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center gap-3 w-full px-6 py-4 text-gray-300 hover:text-white bg-dark-300/30 hover:bg-primary-300/10 active:bg-primary-300/20 rounded-xl transition-all duration-200 text-base font-semibold touch-manipulation group"
                >
                  <Mail className="w-5 h-5 text-primary-300 group-hover:scale-110 transition-transform" />
                  <span>تواصل معنا</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary-300/20 to-transparent" />

          {/* Policies - Stacked Vertically for Mobile */}
          <div className="text-center">
            <h4 className="text-lg font-bold mb-4 text-accent-600">السياسات</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/privacy" 
                  className="inline-flex items-center justify-center w-full px-6 py-4 text-gray-300 hover:text-white bg-dark-300/30 hover:bg-accent-600/10 active:bg-accent-600/20 rounded-xl transition-all duration-200 text-base font-medium touch-manipulation"
                >
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="inline-flex items-center justify-center w-full px-6 py-4 text-gray-300 hover:text-white bg-dark-300/30 hover:bg-accent-600/10 active:bg-accent-600/20 rounded-xl transition-all duration-200 text-base font-medium touch-manipulation"
                >
                  شروط الاستخدام
                </Link>
              </li>
              <li>
                <Link 
                  href="/refund" 
                  className="inline-flex items-center justify-center w-full px-6 py-4 text-gray-300 hover:text-white bg-dark-300/30 hover:bg-accent-600/10 active:bg-accent-600/20 rounded-xl transition-all duration-200 text-base font-medium touch-manipulation"
                >
                  سياسة الاستبدال
                </Link>
              </li>
            </ul>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary-300/20 to-transparent" />

          {/* Contact Info - Mobile Optimized */}
          <div className="text-center">
            <h4 className="text-lg font-bold mb-4 text-primary-300">تواصل معنا</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:leve1up999q@gmail.com"
                  className="inline-flex items-center justify-center gap-3 w-full px-6 py-4 text-gray-300 hover:text-white bg-dark-300/30 hover:bg-primary-300/10 active:bg-primary-300/20 rounded-xl transition-all duration-200 text-base font-medium touch-manipulation group"
                >
                  <Mail className="w-5 h-5 text-primary-300 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="break-all">leve1up999q@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/971503492848"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 w-full px-6 py-4 text-gray-300 hover:text-white bg-dark-300/30 hover:bg-green-600/20 active:bg-green-600/30 rounded-xl transition-all duration-200 text-base font-medium touch-manipulation group"
                >
                  <FaWhatsapp className="w-5 h-5 text-green-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span dir="ltr">+971 50 349 2848</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-300/10 pt-6 mt-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-gray-400 text-sm leading-relaxed">
              © {currentYear} جميع الحقوق محفوظة لمتجر{' '}
              <span className="text-primary-300 font-bold">Level Up</span>
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>صُنع بـ</span>
              <span className="text-accent-600 text-lg">❤️</span>
              <span>في الإمارات</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

