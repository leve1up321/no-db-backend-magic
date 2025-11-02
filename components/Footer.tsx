'use client';

import { Mail, Home, ShoppingBag, HelpCircle } from 'lucide-react';
import { FaTiktok, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-dark-400 border-t border-primary-300/10 text-white safe-bottom">
      <div className="container-mobile py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="text-center sm:text-right">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src="/logo.png"
                  alt="Level Up Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-300 to-accent-600 bg-clip-text text-transparent">
                Level Up
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6 text-sm sm:text-base">
              متجرك الموثوق للكتب والمنتجات الرقمية بأفضل الأسعار وتسليم فوري ⚡
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3 justify-center sm:justify-start">
              <a
                href="https://wa.me/971503492848"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-dark-300/80 rounded-xl flex items-center justify-center hover:bg-green-600 hover:scale-110 transition-all duration-300 touch-manipulation"
                aria-label="واتساب"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/lvlup3211/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-dark-300/80 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:scale-110 transition-all duration-300 touch-manipulation"
                aria-label="إنستغرام"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@lvlup321"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-dark-300/80 rounded-xl flex items-center justify-center hover:bg-primary-300 hover:text-gray-900 hover:scale-110 transition-all duration-300 touch-manipulation"
                aria-label="تيك توك"
              >
                <FaTiktok className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-right">
            <h4 className="text-base sm:text-lg font-bold mb-4 text-primary-300">روابط سريعة</h4>
            <ul className="space-y-2.5">
              <li>
                <Link 
                  href="/" 
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-300 transition-colors text-sm sm:text-base touch-manipulation"
                >
                  <Home className="w-4 h-4" />
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link 
                  href="/#products" 
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-300 transition-colors text-sm sm:text-base touch-manipulation"
                >
                  <ShoppingBag className="w-4 h-4" />
                  المنتجات
                </Link>
              </li>
              <li>
                <Link 
                  href="/#faq" 
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-300 transition-colors text-sm sm:text-base touch-manipulation"
                >
                  <HelpCircle className="w-4 h-4" />
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-300 transition-colors text-sm sm:text-base touch-manipulation"
                >
                  <Mail className="w-4 h-4" />
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="text-center sm:text-right">
            <h4 className="text-base sm:text-lg font-bold mb-4 text-accent-600">السياسات</h4>
            <ul className="space-y-2.5">
              <li>
                <Link 
                  href="/privacy" 
                  className="text-gray-400 hover:text-accent-600 transition-colors text-sm sm:text-base block touch-manipulation"
                >
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-gray-400 hover:text-accent-600 transition-colors text-sm sm:text-base block touch-manipulation"
                >
                  شروط الاستخدام
                </Link>
              </li>
              <li>
                <Link 
                  href="/refund" 
                  className="text-gray-400 hover:text-accent-600 transition-colors text-sm sm:text-base block touch-manipulation"
                >
                  سياسة الاستبدال
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center sm:text-right">
            <h4 className="text-base sm:text-lg font-bold mb-4 text-primary-300">تواصل معنا</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:leve1up999q@gmail.com"
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-300 transition-colors text-sm sm:text-base group touch-manipulation"
                >
                  <Mail className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="break-all">leve1up999q@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/971503492848"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors text-sm sm:text-base group touch-manipulation"
                >
                  <FaWhatsapp className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span dir="ltr">+971 50 349 2848</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-300/10 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-right">
              © {currentYear} جميع الحقوق محفوظة لمتجر{' '}
              <span className="text-primary-300 font-bold">Level Up</span>
            </p>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <span>صُنع بـ</span>
              <span className="text-accent-600">❤️</span>
              <span>في الإمارات</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

