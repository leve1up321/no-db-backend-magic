'use client';

import { Users, ShoppingBag, Star, Zap } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: '5000+',
      label: 'عميل سعيد',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: ShoppingBag,
      value: '10,000+',
      label: 'طلب مكتمل',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: Star,
      value: '4.9/5',
      label: 'تقييم العملاء',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      icon: Zap,
      value: '< 5 دقائق',
      label: 'وقت التسليم',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            إحصائيات تتحدث عن نفسها
          </h2>
          <p className="text-lg text-gray-600">
            أرقام تثبت جودة خدماتنا وثقة عملائنا
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${stat.bgColor} mb-4`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {stat.value}
              </p>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

