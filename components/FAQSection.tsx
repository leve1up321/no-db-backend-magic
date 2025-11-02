'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import faq from '@/data/faq.json';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/20 dark:to-accent-900/20 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            الأسئلة الشائعة
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            إجابات على أكثر الأسئلة شيوعاً حول خدماتنا
          </p>
        </div>

        <div className="space-y-4">
          {faq.map((item, index) => (
            <div
              key={item.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-right hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                  {item.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 animate-slide-down">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            لم تجد إجابة لسؤالك؟
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition transform hover:-translate-y-1"
          >
            تواصل معنا
          </a>
        </div>
      </div>
    </section>
  );
}

