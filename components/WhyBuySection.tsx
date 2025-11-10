'use client';

import { Zap, CreditCard, Clock, Shield } from 'lucide-react';

interface Feature {
  icon: any;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

interface WhyBuySectionProps {
  compact?: boolean;
}

export default function WhyBuySection({ compact = false }: WhyBuySectionProps) {
  const features: Feature[] = [
    {
      icon: Zap,
      title: 'استلام فوري بعد الدفع',
      description: 'المنتج يصلك مباشرة بعد إتمام عملية الشراء.',
      color: 'text-primary-300',
      bgColor: 'bg-primary-300/10',
    },
    {
      icon: CreditCard,
      title: 'خيارات دفع متعددة',
      description: 'تقبل كل وسائل الدفع المعروفة محليًا وعالميًا.',
      color: 'text-accent-600',
      bgColor: 'bg-accent-600/10',
    },
    {
      icon: Clock,
      title: 'خدمة عملاء سريعة',
      description: 'دعم فني جاهز لمساعدتك وقت الحاجة.',
      color: 'text-primary-300',
      bgColor: 'bg-primary-300/10',
    },
    {
      icon: Shield,
      title: 'ضمان جودة وموثوقية',
      description: 'كل منتج يتم فحصه قبل عرضه في المتجر.',
      color: 'text-accent-600',
      bgColor: 'bg-accent-600/10',
    },
  ];

  if (compact) {
    // نسخة مختصرة لصفحة المنتج
    return (
      <div className="py-8 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          ليش تشتري من{' '}
          <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            لفل اب؟
          </span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-300/50 transition-all duration-300"
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${feature.bgColor} flex items-center justify-center`}>
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                  {feature.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // النسخة الكاملة للصفحة الرئيسية
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-dark-400 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-300/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-600/5 rounded-full filter blur-3xl"></div>
      
      <div className="container-mobile relative z-10">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 sm:mb-4">
            ليش تشتري من{' '}
            <span className="bg-gradient-to-r from-primary-300 to-accent-600 bg-clip-text text-transparent">
              لفل اب؟
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto px-4 sm:px-0">
            نوفر لك تجربة شراء مميزة وآمنة
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm border border-primary-300/10 hover:border-primary-300/30 hover:shadow-xl hover:shadow-primary-300/10 transition-all duration-300 transform hover:-translate-y-2 animate-scale-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

