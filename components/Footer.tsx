'use client';

import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">🚀 LevelUp</h3>
            <p className="text-gray-400 leading-relaxed">
              متجرك الموثوق للمنتجات الرقمية والاشتراكات المميزة بأفضل الأسعار
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-white transition">الرئيسية</a></li>
              <li><a href="#products" className="text-gray-400 hover:text-white transition">المنتجات</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white transition">من نحن</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition">تواصل معنا</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">الفئات</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">اشتراكات البث</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">بطاقات الهدايا</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">ألعاب</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">برامج</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5" />
                <span>support@levelup.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5" />
                <span dir="ltr">+966 50 123 4567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5" />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 LevelUp Digital Store. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}

