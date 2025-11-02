'use client';

import { Star, Quote, CheckCircle, ShoppingBag, MessageCircle } from 'lucide-react';
import testimonials from '@/data/testimonials.json';
import Image from 'next/image';

export default function TestimonialsSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-dark-400 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent-600/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary-300/5 rounded-full filter blur-3xl"></div>
      
      <div className="container-mobile relative z-10">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-300/20 to-accent-600/20 backdrop-blur-sm text-primary-300 px-4 py-2 rounded-full mb-4 border border-primary-300/30">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-bold">تقييمات حقيقية</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 sm:mb-4">
            آراء{' '}
            <span className="bg-gradient-to-r from-primary-300 to-accent-600 bg-clip-text text-transparent">
              عملائنا
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto px-4 sm:px-0">
            ماذا يقول عملاؤنا عن خدماتنا وجودة منتجاتنا
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-primary-300/10 hover:border-primary-300/30 hover:shadow-xl hover:shadow-primary-300/10 transition-all duration-300 transform hover:-translate-y-2 animate-slide-up group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <div className="flex justify-between items-start mb-4">
                <Quote className="w-8 h-8 text-primary-300/30 group-hover:text-primary-300/50 transition-colors" />
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                        i < Math.floor(testimonial.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Testimonial Text */}
              <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-5 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-primary-300/10">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden ring-2 ring-primary-300/30 group-hover:ring-primary-300/50 transition-all flex-shrink-0">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm sm:text-base text-white flex items-center gap-2 truncate">
                    {testimonial.name}
                    {testimonial.verified && (
                      <CheckCircle className="w-4 h-4 text-green-400 fill-green-400 flex-shrink-0" />
                    )}
                  </p>
                  {testimonial.verified && (
                    <p className="text-xs text-green-400 flex items-center gap-1 mt-0.5">
                      <ShoppingBag className="w-3 h-3" />
                      قام بالشراء
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{testimonial.timeAgo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

