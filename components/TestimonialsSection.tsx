'use client';

import { Star, Quote, CheckCircle } from 'lucide-react';
import testimonials from '@/data/testimonials.json';

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            آراء عملائنا
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            ماذا يقول عملاؤنا عن خدماتنا
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4">
                <Quote className="w-10 h-10 text-primary-300 dark:text-primary-600" />
              </div>

              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-700 dark:text-gray-200 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    {testimonial.name}
                    {testimonial.verified && (
                      <CheckCircle className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    )}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(testimonial.date).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

