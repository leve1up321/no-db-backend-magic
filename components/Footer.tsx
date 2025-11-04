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
        {/* Desktop: Horizontal Layout (4 columns) | Mobile: Vertical Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Company Logo with Email Link */}
          <div className="text-center sm:text-right">
            <a 
              href="mailto:leve1up999q@gmail.com"
              className="inline-flex flex-col items-center sm:items-start gap-3 mb-4 group"
            >
              <div className="relative w-16 h-16 transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
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
            </a>
            <p className="text-gray-400 leading-relaxed mb-6 text-sm sm:text-base">
              متجرك الموثوق للكتب والمنتجات الرقمية بأفضل الأسعار وتسليم فوري ⚡
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3 justify-center sm:justify-start">
              <a
                href="https://wa.me/971503492848"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366]/90 hover:bg-[#25D366] rounded-xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 touch-manipulation shadow-lg shadow-green-500/20"
                aria-label="واتساب"
              >
                <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href="https://www.instagram.com/lvlup3211/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F56040] hover:from-[#9B5DE5] hover:via-[#F15A8A] hover:to-[#FF7858] rounded-xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 touch-manipulation shadow-lg shadow-pink-500/20"
                aria-label="إنستغرام"
              >
                <FaInstagram className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href="https://www.tiktok.com/@lvlup321"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-14 sm:h-14 bg-black hover:bg-gray-900 border-2 border-[#25F4EE] rounded-xl flex items-center justify-center text-[#25F4EE] hover:text-white hover:bg-[#25F4EE] hover:scale-110 active:scale-95 transition-all duration-300 touch-manipulation shadow-lg shadow-cyan-400/20"
                aria-label="تيك توك"
              >
                <FaTiktok className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-center sm:text-right">
            <h4 className="text-base sm:text-lg font-bold mb-4 text-primary-300">روابط سريعة</h4>
            <ul className="space-y-2.5">
              <li>
                <Link 
                  href="/" 
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-300 transition-colors text-sm sm:text-base touch-manipulation group"
                >
                  <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link 
                  href="/#products" 
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-300 transition-colors text-sm sm:text-base touch-manipulation group"
                >
                  <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  المنتجات
                </Link>
              </li>
              <li>
                <Link 
                  href="/#faq" 
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-300 transition-colors text-sm sm:text-base touch-manipulation group"
                >
                  <HelpCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-300 transition-colors text-sm sm:text-base touch-manipulation group"
                >
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Policies */}
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

          {/* Column 4: Newsletter or Additional Info */}
          <div className="text-center sm:text-right">
            <h4 className="text-base sm:text-lg font-bold mb-4 text-primary-300">ابق على تواصل</h4>
            <p className="text-gray-400 text-sm sm:text-base mb-4 leading-relaxed">
              تابعنا على وسائل التواصل الاجتماعي لمعرفة آخر العروض والمنتجات الجديدة
            </p>
            <a
              href="mailto:leve1up999q@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary-300 to-accent-600 text-white rounded-xl hover:shadow-lg hover:shadow-primary-300/30 transition-all duration-300 font-semibold text-sm sm:text-base touch-manipulation group"
            >
              <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
              راسلنا
            </a>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-primary-300/10 pt-8 pb-4">
          <div className="text-center">
            <h4 className="text-base sm:text-lg font-bold mb-4 text-primary-300">طرق الدفع المتاحة</h4>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <div className="bg-white rounded-lg p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg"
                  alt="Google Pay"
                  width={60}
                  height={25}
                  className="h-5 sm:h-6 w-auto"
                />
              </div>
              <div className="bg-white rounded-lg p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg"
                  alt="Apple Pay"
                  width={60}
                  height={25}
                  className="h-5 sm:h-6 w-auto"
                />
              </div>
              <div className="bg-white rounded-lg p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  alt="Visa"
                  width={60}
                  height={20}
                  className="h-4 sm:h-5 w-auto"
                />
              </div>
              <div className="bg-white rounded-lg p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  alt="Mastercard"
                  width={50}
                  height={30}
                  className="h-5 sm:h-6 w-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-300/10 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-right">
              © {currentYear} جميع الحقوق محفوظة لمتجر{' '}
              <span className="text-primary-300 font-bold">Level Up</span>
            </p>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <span>صُنع بـ</span>
              <span className="text-accent-600 text-base">❤️</span>
              <span>في الإمارات</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
