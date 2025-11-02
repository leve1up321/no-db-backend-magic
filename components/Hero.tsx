'use client';

import { ArrowLeft, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section id="home" className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 md:py-32 overflow-hidden transition-colors duration-300">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-accent-500/20 animate-gradient-slow"></div>
      </div>
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-300 dark:bg-primary-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-bounce-slow"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-accent-300 dark:bg-accent-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-bounce-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center md:text-right animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900/20 dark:to-accent-900/20 text-primary-700 dark:text-primary-400 px-4 py-2 rounded-full mb-6 animate-scale-in">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">أفضل العروض الرقمية</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight animate-slide-up">
              متجرك الموثوق للمنتجات{' '}
              <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
                الرقمية
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              احصل على أفضل الاشتراكات والبطاقات الرقمية بأسعار تنافسية وتسليم فوري
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link
                href="#products"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                تصفح المنتجات
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-400 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-gray-700 transition-all duration-300"
              >
                تواصل معنا
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  5000+
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">عميل سعيد</p>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  99%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">رضا العملاء</p>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  24/7
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">دعم فني</p>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative animate-slide-up hidden md:block" style={{ animationDelay: '0.4s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-accent-600 rounded-3xl rotate-6 opacity-20 dark:opacity-10"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
