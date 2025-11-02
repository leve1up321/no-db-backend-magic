import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, MessageCircle, Instagram } from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaEnvelope } from 'react-icons/fa';

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              اتصل بنا
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
              نحب أن نسمع منك!
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              لا تتردد في التواصل معنا عبر أي من الطرق التالية. فريق الدعم جاهز لمساعدتك في كل خطوة من رحلتك الرقمية
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Email */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl hover:shadow-xl transition-all duration-300 animate-scale-in border-2 border-transparent hover:border-primary-500">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaEnvelope className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                البريد الإلكتروني
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
                راسلنا عبر البريد
              </p>
              <a
                href="mailto:leve1up999q@gmail.com"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold flex items-center justify-center gap-2"
              >
                leve1up999q@gmail.com
              </a>
            </div>

            {/* WhatsApp */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl hover:shadow-xl transition-all duration-300 animate-scale-in border-2 border-transparent hover:border-primary-500" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaWhatsapp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                واتساب
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
                تواصل معنا مباشرة
              </p>
              <a
                href="https://wa.me/971503492848"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold flex items-center justify-center gap-2"
                dir="ltr"
              >
                +971503492848
              </a>
            </div>

            {/* Instagram */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl hover:shadow-xl transition-all duration-300 animate-scale-in border-2 border-transparent hover:border-primary-500" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaInstagram className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                إنستغرام
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
                تابعنا على إنستغرام
              </p>
              <a
                href="https://instagram.com/lvlup3211"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold flex items-center justify-center gap-2"
              >
                @lvlup3211
              </a>
            </div>
          </div>

          {/* دعوة للعمل */}
          <div className="mt-12 p-8 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl text-center animate-fade-in">
            <h3 className="text-3xl font-bold text-white mb-4">
              🎯 جاهز للبدء؟
            </h3>
            <p className="text-xl text-white/90 mb-6">
              كل يوم تأجّله هو فرصة ضائعة! ابدأ مشروعك الرقمي اليوم واحصل على دخلك الأول
            </p>
            <a
              href="/#products"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
            >
              ابدأ الآن
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
