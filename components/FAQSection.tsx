'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircleQuestion } from 'lucide-react';
import faq from '@/data/faq.json';
import Link from 'next/link';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-12 sm:py-16 md:py-20 bg-dark-400 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-primary-300/5 rounded-full filter blur-3xl"></div>
      
      <div className="container-mobile relative z-10">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-300/20 to-accent-600/20 backdrop-blur-sm text-primary-300 px-4 py-2 rounded-full mb-4 border border-primary-300/30">
            <MessageCircleQuestion className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-bold">كل ما تحتاج معرفته</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 sm:mb-4">
            الأسئلة{' '}
            <span className="bg-gradient-to-r from-primary-300 to-accent-600 bg-clip-text text-transparent">
              الشائعة
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto px-4 sm:px-0">
            إجابات على أكثر الأسئلة شيوعاً حول خدماتنا ومنتجاتنا
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
          {faq.map((item, index) => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-primary-300/10 hover:border-primary-300/30 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-4 sm:p-5 md:p-6 text-right hover:bg-primary-300/5 transition-colors touch-manipulation"
                aria-expanded={openIndex === index}
              >
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-white pr-2 sm:pr-4 flex-1 text-right">
                  {item.question}
                </h3>
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-primary-300/10">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary-300" />
                  ) : (
                    <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                  )}
                </div>
              </button>
              {openIndex === index && (
                <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 animate-slide-down">
                  <div className="pt-3 sm:pt-4 border-t border-primary-300/10">
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 text-center animate-fade-in">
          <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
            لم تجد إجابة لسؤالك؟
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-300 to-primary-400 text-gray-900 px-6 py-3 sm:px-8 sm:py-4 rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-primary-300/30 hover:shadow-2xl hover:shadow-primary-300/50 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 touch-manipulation"
          >
            <HelpCircle className="w-5 h-5" />
            تواصل معنا
          </Link>
        </div>
      </div>
    </section>
  );
}

