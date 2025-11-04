'use client';

import { ArrowLeft, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section id="home" className="relative bg-dark-400 py-12 sm:py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-300/10 via-transparent to-accent-600/10 animate-gradient-slow"></div>
      </div>
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-5 sm:top-20 sm:right-10 w-40 h-40 sm:w-72 sm:h-72 bg-primary-300/20 rounded-full filter blur-3xl opacity-40 animate-bounce-slow"></div>
        <div className="absolute bottom-10 left-5 sm:bottom-20 sm:left-10 w-40 h-40 sm:w-72 sm:h-72 bg-accent-600/20 rounded-full filter blur-3xl opacity-40 animate-bounce-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container-mobile relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Content */}
          <div className="text-center animate-fade-in">
            {/* Badge - Hidden on Mobile */}
            <div className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-primary-300/20 to-accent-600/20 backdrop-blur-sm text-primary-300 px-4 py-2 sm:px-6 sm:py-3 rounded-full mb-4 sm:mb-6 border border-primary-300/30 animate-scale-in">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-bold">أفضل العروض الرقمية 2025</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 mt-6 sm:mt-0 leading-tight animate-slide-up">
              <span className="bg-gradient-to-r from-primary-300 via-accent-600 to-primary-300 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
                متجرك الموثوق
              </span>
              <br className="sm:hidden" />{' '}
              <span className="block sm:inline mt-2 sm:mt-0 bg-gradient-to-r from-primary-300 via-accent-600 to-primary-300 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
                للمنتجات الرقمية
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4 sm:px-0 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              احصل على أفضل الكتب الإلكترونية والمنتجات الرقمية بأسعار تنافسية مع تسليم فوري ⚡
            </p>

            {/* CTA Buttons - Mobile First */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4 sm:px-0 mb-8 sm:mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link
                href="#products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-300 to-primary-400 text-gray-900 px-6 py-4 sm:px-8 sm:py-4 rounded-2xl font-bold text-base sm:text-lg shadow-lg shadow-primary-300/30 hover:shadow-2xl hover:shadow-primary-300/50 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 touch-manipulation"
              >
                <span>اشترِ الآن</span>
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link
                href="#products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-accent-600 to-accent-700 text-white px-6 py-4 sm:px-8 sm:py-4 rounded-2xl font-bold text-base sm:text-lg shadow-lg shadow-accent-600/30 hover:shadow-2xl hover:shadow-accent-600/50 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 touch-manipulation border border-accent-500/30"
              >
                <span>تصفح المنتجات</span>
              </Link>
            </div>

            {/* Trust Badges - Mobile Optimized */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto px-4 sm:px-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-center p-3 sm:p-4 md:p-6 bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-primary-300/10 hover:border-primary-300/30 transition-all duration-300">
                <div className="flex justify-center mb-2">
                  <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-primary-300" />
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
                  فوري
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">تسليم فوري</p>
              </div>
              
              <div className="text-center p-3 sm:p-4 md:p-6 bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-accent-600/10 hover:border-accent-600/30 transition-all duration-300">
                <div className="flex justify-center mb-2">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-accent-600" />
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-accent-600 to-accent-700 bg-clip-text text-transparent">
                  99%
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">رضا العملاء</p>
              </div>
              
              <div className="text-center p-3 sm:p-4 md:p-6 bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-primary-300/10 hover:border-primary-300/30 transition-all duration-300">
                <div className="flex justify-center mb-2">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-primary-300" />
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
                  5000+
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">عميل سعيد</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-dark-400 to-transparent pointer-events-none"></div>
    </section>
  );
}
