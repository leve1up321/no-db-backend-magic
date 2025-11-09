'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CreditCard } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, currency, clearCart } = useApp();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const getCurrencySymbol = () => {
    switch (currency) {
      case 'AED': return 'د.إ';
      case 'SAR': return 'ر.س';
      case 'BHD': return 'د.ب';
      case 'KWD': return 'د.ك';
      case 'OMR': return 'ر.ع';
      case 'QAR': return 'ر.ق';
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'INR': return '₹';
      default: return 'ر.س';
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setError('');

    try {
      // 🛒 تجهيز بيانات السلة
      const cartItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));

      console.log('🛒 Sending cart data:', { cartItems, totalAmount: cartTotal });

      // التحقق من البريد الإلكتروني
      if (!customerEmail || !customerEmail.includes('@')) {
        throw new Error('يرجى إدخال بريد إلكتروني صحيح');
      }

      // 📤 إرسال الطلب إلى API
      const response = await fetch('/api/cart_payment_intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: cartItems,
          totalAmount: cartTotal,
          currency: currency,
          customerEmail: customerEmail
        }),
      });

      const data = await response.json();
      console.log('📥 API Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'فشل في إنشاء عملية الدفع');
      }

      if (data.success && data.redirect_url) {
        console.log('✅ Redirecting to:', data.redirect_url);
        
        // 💾 حفظ بيانات السلة في localStorage لعرضها في صفحة النجاح
        localStorage.setItem('leve1up_email', customerEmail);
        localStorage.setItem('leve1up_total_amount', cartTotal.toString());
        // السلة محفوظة بالفعل في AppContext
        
        // 🔄 التوجيه إلى صفحة الدفع
        window.location.href = data.redirect_url;
      } else {
        throw new Error('لم يتم استلام رابط الدفع');
      }
    } catch (err: any) {
      console.error('❌ Checkout Error:', err);
      setError(err.message || 'حدث خطأ أثناء معالجة الطلب');
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center animate-fade-in">
              <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                سلة التسوق فارغة
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                لم تقم بإضافة أي منتجات إلى سلة التسوق بعد
              </p>
              <Link
                href="/#products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <ArrowRight className="w-5 h-5" />
                تصفح المنتجات
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      {/* padding-top للتأكد من عدم تداخل الهيدر */}
      <section className="pt-24 pb-12 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              سلة التسوق
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              لديك {cart.length} {cart.length === 1 ? 'منتج' : 'منتجات'} في السلة
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-shake">
              <p className="text-red-800 dark:text-red-200 text-center font-semibold">
                ⚠️ {error}
              </p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 md:p-6 flex flex-col md:flex-row gap-4 animate-scale-in hover:shadow-lg transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {item.name}
                    </h3>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                      {item.price.toFixed(2)} {getCurrencySymbol()}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg p-1">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition"
                        >
                          <Minus className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                        </button>
                        <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition"
                        >
                          <Plus className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-left md:text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">المجموع</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {(item.price * item.quantity).toFixed(2)} {getCurrencySymbol()}
                    </p>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                إفراغ السلة
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 sticky top-24 animate-slide-up">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  ملخص الطلب
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>المجموع الفرعي</span>
                    <span className="font-semibold">{cartTotal.toFixed(2)} {getCurrencySymbol()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>التوصيل</span>
                    <span className="font-semibold text-green-600">مجاني</span>
                  </div>
                  <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                      <span>الإجمالي</span>
                      <span>{cartTotal.toFixed(2)} {getCurrencySymbol()}</span>
                    </div>
                  </div>
                </div>

                {/* Email Input */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    سيتم إرسال المنتجات إلى هذا البريد الإلكتروني
                  </p>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut || !customerEmail}
                  className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-4 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      إتمام الدفع الآن
                    </>
                  )}
                </button>

                <Link
                  href="/#products"
                  className="block text-center mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold"
                >
                  متابعة التسوق
                </Link>

                <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-600">
                  <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <ShoppingBag className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>
                      ستتلقى المنتجات الرقمية فوراً عبر البريد الإلكتروني بعد إتمام الطلب
                    </p>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-semibold">دفع آمن ومشفر</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
