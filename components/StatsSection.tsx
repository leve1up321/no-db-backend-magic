'use client';

import { useState, useEffect } from 'react';
import { Users, ShoppingBag, Star, Zap, TrendingUp } from 'lucide-react';

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
      color: 'text-primary-300',
      bgColor: 'bg-primary-300/10',
      increment: 0.5,
    },
    {
      icon: Users,
      value: 5000,
      suffix: '+',
      label: 'عميل سعيد',
      color: 'text-accent-600',
      bgColor: 'bg-accent-600/10',
      increment: 0.2,
    },
    {
      icon: Star,
      value: 99,
      suffix: '%',
      label: 'رضا العملاء',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      increment: 0.001,
    },
    {
      icon: Zap,
      value: 0,
      suffix: '',
      label: 'تسليم فوري',
      color: 'text-primary-300',
      bgColor: 'bg-primary-300/10',
      increment: 0,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats =>
        prevStats.map(stat => ({
          ...stat,
          value: stat.value + stat.increment,
        }))
      );
    }, 24 * 60 * 60 * 1000);

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
    if (suffix === '%') {
      return Math.floor(value);
    }
    if (suffix === '') {
      return 'فوري';
    }
    return Math.floor(value);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-dark-400 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-300/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-600/5 rounded-full filter blur-3xl"></div>
      
      <div className="container-mobile relative z-10">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-300/20 to-accent-600/20 backdrop-blur-sm text-primary-300 px-4 py-2 rounded-full mb-4 border border-primary-300/30">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-bold">أرقام حقيقية</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 sm:mb-4">
            إحصائيات{' '}
            <span className="bg-gradient-to-r from-primary-300 to-accent-600 bg-clip-text text-transparent">
              تتحدث عن نفسها
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto px-4 sm:px-0">
            أرقام تثبت جودة خدماتنا وثقة عملائنا
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 sm:p-6 md:p-8 rounded-2xl bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm border border-primary-300/10 hover:border-primary-300/30 hover:shadow-xl hover:shadow-primary-300/10 transition-all duration-300 transform hover:-translate-y-2 animate-scale-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${stat.bgColor} mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`} />
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-2">
                {formatValue(stat.value, stat.suffix)}
                {stat.suffix}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

