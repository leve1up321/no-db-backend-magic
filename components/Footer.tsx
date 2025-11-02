'use client';

import { Facebook, Twitter, Instagram, Mail, Phone, MessageCircle } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-gray-900 dark:bg-black text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">LU</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                LevelUp
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              متجرك الموثوق للمنتجات الرقمية والاشتراكات المميزة بأفضل الأسعار
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition"
              >
                <FaTiktok className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/#products" className="text-gray-400 hover:text-white transition">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-gray-400 hover:text-white transition">
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition">
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-lg font-semibold mb-4">السياسات</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition">
                  شروط الاستخدام
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-400 hover:text-white transition">
                  سياسة الاستبدال والاسترجاع
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@levelup.com"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition"
                >
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">support@levelup.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/966501234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition"
                >
                  <MessageCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm" dir="ltr">+966 50 123 4567</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+966501234567"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition"
                >
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm" dir="ltr">+966 50 123 4567</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} جميع الحقوق محفوظة لمتجر Level Up
          </p>
        </div>
      </div>
    </footer>
  );
}

