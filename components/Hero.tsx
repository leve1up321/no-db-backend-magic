'use client';

import { ArrowLeft, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative bg-gradient-to-br from-primary-50 via-white to-blue-50 py-20 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center md:text-right animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">أفضل العروض الرقمية</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              متجرك الموثوق للمنتجات{' '}
              <span className="text-primary-600">الرقمية</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              احصل على أفضل الاشتراكات والبطاقات الرقمية بأسعار تنافسية وتسليم فوري
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="#products"
                className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                تصفح المنتجات
                <ArrowLeft className="w-5 h-5" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 border-2 border-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition"
              >
                تواصل معنا
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary-600">5000+</p>
                <p className="text-sm text-gray-600 mt-1">عميل سعيد</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary-600">99%</p>
                <p className="text-sm text-gray-600 mt-1">رضا العملاء</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary-600">24/7</p>
                <p className="text-sm text-gray-600 mt-1">دعم فني</p>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative animate-slide-up hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-blue-600 rounded-3xl rotate-6 opacity-20"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-8">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
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

