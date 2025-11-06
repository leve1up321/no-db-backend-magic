'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Download, Mail, CheckCircle, Clock, Package, MessageCircle } from 'lucide-react';
import Image from 'next/image';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const orderId = searchParams.get('orderId');
  const token = searchParams.get('token');
  const productId = searchParams.get('productId');
  const productName = searchParams.get('productName') || 'منتجك الرقمي';
  const productImage = searchParams.get('productImage') || '/images/default-product.jpg';
  const price = searchParams.get('price') || '0';
  const email = searchParams.get('email') || '';

  // Calculate expiry time (30 minutes from now)
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = async () => {
    if (!token) return;

    setIsDownloading(true);
    try {
      // Download the file
      window.location.href = `/api/download/${token}`;
    } catch (error) {
      console.error('Download error:', error);
      alert('حدث خطأ أثناء التحميل. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!token || !email) return;

    setIsSendingEmail(true);
    try {
      const response = await fetch('/api/send-download-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          token,
          productName,
          orderId,
        }),
      });

      if (response.ok) {
        setEmailSent(true);
      } else {
        alert('حدث خطأ أثناء إرسال البريد.');
      }
    } catch (error) {
      console.error('Email error:', error);
      alert('حدث خطأ أثناء إرسال البريد.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (!orderId || !token) {
    return (
      <div className="min-h-screen bg-dark-500 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">طلب غير موجود</h1>
          <p className="text-gray-400">رابط غير صحيح أو منتهي الصلاحية</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-500 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            تم إنشاء طلبك بنجاح! 🎉
          </h1>
          <p className="text-gray-400 text-lg">
            شكراً لثقتك بنا. يمكنك الآن تحميل منتجك الرقمي
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-dark-400 rounded-2xl border border-primary-300/20 p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-700">
            <Package className="w-5 h-5 text-primary-300" />
            <h2 className="text-xl font-bold text-white">تفاصيل الطلب</h2>
          </div>

          {/* Product Info */}
          <div className="flex gap-4 mb-6">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={productImage}
                alt={productName}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                {productName}
              </h3>
              <div className="space-y-1 text-sm sm:text-base">
                <p className="text-gray-400">
                  <span className="text-gray-500">رقم الطلب:</span>{' '}
                  <span className="text-primary-300 font-mono">{orderId}</span>
                </p>
                <p className="text-gray-400">
                  <span className="text-gray-500">السعر:</span>{' '}
                  <span className={`font-bold ${price === '0' ? 'text-green-400' : 'text-white'}`}>
                    {price === '0' ? 'مجاني! 🎉' : `${price} ريال`}
                  </span>
                </p>
                {email && (
                  <p className="text-gray-400">
                    <span className="text-gray-500">البريد:</span>{' '}
                    <span className="text-white">{email}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Timer Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-yellow-400 font-semibold mb-1">
                  ⏰ رابط التحميل صالح لمدة محدودة
                </p>
                <p className="text-sm text-gray-400">
                  الوقت المتبقي: <span className="font-mono text-yellow-400 font-bold">{formatTime(timeLeft)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading || timeLeft === 0}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
          >
            <Download className="w-5 h-5" />
            {isDownloading ? 'جاري التحميل...' : timeLeft === 0 ? 'انتهت صلاحية الرابط' : 'تحميل المنتج الآن 📥'}
          </button>

          {/* Send Email Button */}
          {email && !emailSent && (
            <button
              onClick={handleSendEmail}
              disabled={isSendingEmail || timeLeft === 0}
              className="w-full bg-dark-300 border border-primary-300/20 text-white font-bold py-4 rounded-xl hover:border-primary-300/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              {isSendingEmail ? 'جاري الإرسال...' : 'أرسل لي رابط التحميل على الإيميل 📧'}
            </button>
          )}

          {emailSent && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-400 font-semibold">
                تم إرسال رابط التحميل إلى بريدك الإلكتروني ✅
              </p>
            </div>
          )}
        </div>

        {/* Support Section */}
        <div className="bg-dark-400 rounded-2xl border border-primary-300/20 p-6 text-center">
          <MessageCircle className="w-10 h-10 text-primary-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">
            هل واجهت مشكلة في التحميل؟
          </h3>
          <p className="text-gray-400 mb-4">
            تواصل معنا مباشرة عبر واتساب وسنساعدك فوراً
          </p>
          <a
            href="https://wa.me/966XXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            تواصل عبر واتساب
          </a>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="text-primary-300 hover:text-primary-400 font-semibold transition-colors"
          >
            ← العودة إلى الصفحة الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}

