"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SuccessPage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(localStorage.getItem("leve1up_email"));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white px-4">
      <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center max-w-xl">
        <h1 className="text-4xl font-bold mb-4 text-green-400">✅ تم الدفع بنجاح!</h1>

        <p className="text-gray-300 mb-6">
          {email
            ? `تم إرسال رابط المنتج إلى بريدك الإلكتروني: ${email}`
            : "تم إرسال رابط المنتج إلى بريدك الإلكتروني"}
        </p>

        <div className="bg-gray-700/40 p-4 rounded-lg mb-6">
          <p className="text-lg">💼 المنتج: <strong>الربح من المنتجات الرقمية</strong></p>
          <p className="text-lg">💰 السعر: <strong>39 درهم</strong></p>
        </div>

        <a
          href="https://cix55jnodh8jj42w.public.blob.vercel-storage.com/%D9%83%D8%AA%D8%A7%D8%A8%20%D9%81%D9%87%D9%85%20%D9%88%D8%A7%D8%B6%D8%AD%20%D9%84%D9%84%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA%20%D8%A7%D9%84%D8%B1%D9%82%D9%85%D9%8A%D8%A9.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg mb-4 transition"
        >
          📦 تحميل المنتج الآن
        </a>

        <Link
          href="/"
          className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg"
        >
          العودة للرئيسية
        </Link>

        <p className="text-sm text-gray-400 mt-6">
          إذا لم يصلك المنتج على بريدك، تواصل معنا عبر{" "}
          <a href="mailto:leve1up999q@gmail.com" className="text-green-400 hover:underline">
            leve1up999q@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}

