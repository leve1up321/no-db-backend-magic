"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight, Mail } from "lucide-react";
import { useEffect } from "react";
import { useApp } from "@/contexts/AppContext";

export default function SuccessPage() {
  const { clearCart } = useApp();

  useEffect(() => {
    // 🎉 تفريغ السلة عند نجاح الدفع
    console.log("Payment successful! Clearing cart...");
    clearCart();
    
    // يمكنك إضافة تتبع للتحليلات هنا
    console.log("Cart cleared successfully!");
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-400 via-dark-300 to-dark-400 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-dark-300/80 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-primary-300/30 p-8 sm:p-12 text-center animate-scale-in">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-500/20 rounded-full p-6 border-2 border-green-500/50 animate-bounce">
              <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            ✅ تم الدفع بنجاح!
          </h1>

          {/* Description */}
          <p className="text-gray-300 text-lg sm:text-xl mb-8 leading-relaxed">
            شكراً لشرائك من <span className="text-primary-300 font-bold">LevelUp</span>! 🎉
            <br />
            سيتم إرسال رابط التحميل إلى بريدك الإلكتروني قريباً.
          </p>

          {/* Info Box */}
          <div className="bg-dark-400/50 rounded-2xl p-6 mb-8 border border-primary-300/20">
            <div className="flex items-start gap-3 text-right">
              <Mail className="w-6 h-6 text-primary-300 flex-shrink-0 mt-1" />
              <div>
                <p className="text-gray-300 text-sm sm:text-base">
                  تحقق من بريدك الإلكتروني (بما في ذلك مجلد الرسائل غير المرغوب فيها) للحصول على رابط التحميل.
                </p>
                <p className="text-gray-400 text-xs sm:text-sm mt-2">
                  إذا لم يصلك البريد خلال 10 دقائق، يرجى التواصل معنا على WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="group bg-primary-300 hover:bg-primary-400 text-dark-400 font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary-300/20"
            >
              <span>العودة للصفحة الرئيسية</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rotate-180" />
            </Link>

            <a
              href="https://wa.me/971503492848"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-green-500/20"
            >
              تواصل معنا على WhatsApp 💬
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            هل تحتاج المساعدة؟{" "}
            <a
              href="/contact"
              className="text-primary-300 hover:text-primary-400 underline"
            >
              اتصل بنا
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

