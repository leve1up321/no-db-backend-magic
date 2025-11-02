'use client';

import { useState, useEffect } from 'react';
import { Users, ShoppingBag, Star, Zap } from 'lucide-react';

interface Stat {
  icon: any;
  value: number;
  suffix: string;
  label: string;
  color: string;
  bgColor: string;
  increment: number;
}

export default function StatsSection() {
  const [stats, setStats] = useState<Stat[]>([
    {
      icon: ShoppingBag,
      value: 950,
      suffix: '+',
      label: 'عدد المبيعات',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      increment: 0.5,
    },
    {
      icon: Users,
      value: 450,
      suffix: '+',
      label: 'عميل سعيد',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      increment: 0.2,
    },
    {
      icon: Star,
      value: 4.6,
      suffix: '/5',
      label: 'تقييم العملاء',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      increment: 0.001,
    },
    {
      icon: Zap,
      value: 2,
      suffix: ' دقيقة',
      label: 'وقت التسليم',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      increment: 0,
    },
  ]);

  useEffect(() => {
    // تحديث الإحصائيات كل 24 ساعة
    const interval = setInterval(() => {
      setStats(prevStats =>
        prevStats.map(stat => ({
          ...stat,
          value: stat.value + stat.increment,
        }))
      );
    }, 24 * 60 * 60 * 1000); // كل 24 ساعة

    // حفظ واسترجاع من localStorage
    const savedStats = localStorage.getItem('stats');
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      setStats(prevStats =>
        prevStats.map((stat, index) => ({
          ...stat,
          value: parsed[index]?.value || stat.value,
        }))
      );
    }

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('stats', JSON.stringify(stats));
  }, [stats]);

  const formatValue = (value: number, suffix: string) => {
    if (suffix === '/5') {
      return value.toFixed(1);
    }
    return Math.floor(value);
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            إحصائيات تتحدث عن نفسها
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            أرقام تثبت جودة خدماتنا وثقة عملائنا
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${stat.bgColor} mb-4`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {formatValue(stat.value, stat.suffix)}
                {stat.suffix}
              </p>
              <p className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
