"use client";

import Link from "next/link";
import { XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-400 via-dark-300 to-dark-400 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Cancel Card */}
        <div className="bg-dark-300/80 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-orange-500/30 p-8 sm:p-12 text-center">
          {/* Cancel Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-orange-500/20 rounded-full p-6 border-2 border-orange-500/50">
              <XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-orange-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            ❌ تم إلغاء العملية
          </h1>

          {/* Description */}
          <p className="text-gray-300 text-lg sm:text-xl mb-8 leading-relaxed">
            لا تقلق! لم يتم خصم أي مبلغ من حسابك.
            <br />
            يمكنك المحاولة مرة أخرى في أي وقت. 😊
          </p>

          {/* Info Box */}
          <div className="bg-dark-400/50 rounded-2xl p-6 mb-8 border border-orange-500/20">
            <p className="text-gray-300 text-sm sm:text-base text-right">
              💡 <span className="font-bold">نصيحة:</span> تأكد من أن لديك رصيد كافٍ في حسابك وأن بطاقتك صالحة للمعاملات الإلكترونية.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="group bg-primary-300 hover:bg-primary-400 text-dark-400 font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary-300/20"
            >
              <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span>حاول مرة أخرى</span>
            </button>

            <Link
              href="/"
              className="bg-dark-400 hover:bg-dark-200 text-gray-300 hover:text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 border border-gray-600 hover:border-primary-300/50"
            >
              العودة للصفحة الرئيسية
              <ArrowRight className="inline-block w-5 h-5 mr-2 rotate-180" />
            </Link>
          </div>

          {/* Contact Support */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm mb-4">هل تواجه مشكلة؟</p>
            <a
              href="https://wa.me/971503492848"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-green-500/20"
            >
              تواصل معنا على WhatsApp 💬
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            جميع معلوماتك آمنة ومحمية 🔒
          </p>
        </div>
      </div>
    </div>
  );
}

