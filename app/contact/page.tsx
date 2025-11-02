import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MessageCircle, Instagram } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              تواصل معنا
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              نحن هنا لمساعدتك! تواصل معنا عبر أي من القنوات التالية
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl hover:shadow-xl transition-all duration-300 animate-scale-in">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/20 dark:to-accent-900/20 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                البريد الإلكتروني
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                راسلنا على البريد الإلكتروني
              </p>
              <a
                href="mailto:support@levelup.com"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold inline-flex items-center gap-2"
              >
                support@levelup.com
              </a>
            </div>

            {/* WhatsApp */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl hover:shadow-xl transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                واتساب
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                تواصل معنا مباشرة على الواتساب
              </p>
              <a
                href="https://wa.me/966501234567"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold inline-flex items-center gap-2"
              >
                +966 50 123 4567
              </a>
            </div>

            {/* Phone */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl hover:shadow-xl transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                الهاتف
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                اتصل بنا على الرقم التالي
              </p>
              <a
                href="tel:+966501234567"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold inline-flex items-center gap-2"
                dir="ltr"
              >
                +966 50 123 4567
              </a>
            </div>

            {/* TikTok */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl hover:shadow-xl transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mb-4">
                <FaTiktok className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                تيك توك
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                تابعنا على تيك توك
              </p>
              <a
                href="https://tiktok.com/@levelup"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-semibold inline-flex items-center gap-2"
              >
                @levelup
              </a>
            </div>

            {/* Instagram */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl hover:shadow-xl transition-all duration-300 animate-scale-in md:col-span-2" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mb-4">
                <Instagram className="w-8 h-8 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                إنستغرام
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                تابعنا على إنستغرام لآخر العروض والتحديثات
              </p>
              <a
                href="https://instagram.com/levelup"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-semibold inline-flex items-center gap-2"
              >
                @levelup
              </a>
            </div>
          </div>

          <div className="mt-12 p-8 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl text-center animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              ساعات العمل
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              متاحون للرد على استفساراتكم على مدار الساعة (24/7)
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

