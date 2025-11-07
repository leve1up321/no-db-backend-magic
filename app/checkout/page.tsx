"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // قراءة المنتج من query string
  const productId = searchParams.get("product") || "1";
  const productName = searchParams.get("name") || "الربح من المنتجات الرقمية";
  const price = searchParams.get("price") || "39";
  const currency = searchParams.get("currency") || "AED";

  const currencyCodeMap: Record<string, string> = {
    SAR: "SAR", AED: "AED", KWD: "KWD", QAR: "QAR", BHD: "BHD",
    OMR: "OMR", JOD: "JOD", EGP: "EGP", LBP: "LBP", SYP: "SYP",
    IQD: "IQD", TND: "TND", MAD: "MAD", DZD: "DZD", USD: "USD", EUR: "EUR",
  };

  const getCurrencySymbol = (curr: string) => {
    const map: Record<string, string> = {
      SAR: "ر.س", AED: "د.إ", KWD: "د.ك", QAR: "ر.ق", BHD: "د.ب",
      OMR: "ر.ع", JOD: "د.أ", EGP: "ج.م", LBP: "ل.ل", SYP: "ل.س",
      IQD: "ع.د", TND: "د.ت", MAD: "د.م", DZD: "د.ج", USD: "$", EUR: "€",
    };
    return map[curr] || "";
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem("leve1up_email");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handlePay = async () => {
    if (!email || !email.includes("@")) {
      setError("يرجى إدخال بريد إلكتروني صالح.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      localStorage.setItem("leve1up_email", email);
      const currencyCode = currencyCodeMap[currency] || "AED";

      const res = await fetch("/api/payment_intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(price),
          currency_code: currencyCode,
          productName,
          productFile:
            "https://cix55jnodh8jj42w.public.blob.vercel-storage.com/%D9%83%D8%AA%D8%A7%D8%A8%20%D9%81%D9%87%D9%85%20%D9%88%D8%A7%D8%B6%D8%AD%20%D9%84%D9%84%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA%20%D8%A7%D9%84%D8%B1%D9%82%D9%85%D9%8A%D8%A9.pdf",
          customerEmail: email,
        }),
      });

      const data = await res.json();

      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        setError(data.error || "حدث خطأ أثناء إنشاء الدفع. يرجى المحاولة مرة أخرى.");
      }
    } catch (err) {
      console.error(err);
      setError("فشل الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-900 to-black px-4">
      <div className="max-w-md w-full bg-gray-800/60 backdrop-blur-md shadow-2xl rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-white">🛒 تابع عملية الدفع</h1>

        {/* معلومات المنتج */}
        <div className="bg-gray-700/40 p-4 rounded-lg mb-6">
          <p className="text-gray-300 mb-2">
            <strong className="text-white">المنتج:</strong> {productName}
          </p>
          <p className="text-gray-300">
            <strong className="text-white">السعر:</strong> {price} {getCurrencySymbol(currency)}
          </p>
        </div>

        <p className="text-gray-300 mb-6">
          أدخل بريدك الإلكتروني لتصلك فاتورة ورابط تحميل المنتج بعد الدفع
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@gmail.com"
          className="border border-gray-600 bg-gray-700 text-white p-3 rounded-lg w-full text-center mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          disabled={!email || loading}
          onClick={handlePay}
          className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "جارٍ إنشاء الدفع..." : "متابعة للدفع"}
        </button>

        <p className="text-sm text-gray-400 mt-4">الدفع آمن ومشفر عبر Ziina 🔒</p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={<div className="text-center text-white mt-10">⏳ جاري تحميل صفحة الدفع...</div>}
    >
      <CheckoutContent />
    </Suspense>
  );
}
