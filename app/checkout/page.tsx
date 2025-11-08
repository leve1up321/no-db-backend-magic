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
    AED: "AED", SAR: "SAR", BHD: "BHD", KWD: "KWD",
    OMR: "OMR", QAR: "QAR", USD: "USD", EUR: "EUR", GBP: "GBP", INR: "INR",
  };

  const getCurrencySymbol = (curr: string) => {
    const map: Record<string, string> = {
      AED: "د.إ", SAR: "ر.س", BHD: "د.ب", KWD: "د.ك",
      OMR: "ر.ع", QAR: "ر.ق", USD: "$", EUR: "€", GBP: "£", INR: "₹",
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
      // تحديد رابط المنتج بناءً على معرف المنتج
      let productFile = "";
      if (productId === "1" || productName.includes("15 فكرة") || productName.includes("15")) {
        // المنتج الأول: 15 فكرة مشروع رقمي
        productFile = "https://cix55jnodh8jj42w.public.blob.vercel-storage.com/15%D9%81%D9%83%D8%B1%D8%A9%20%D9%85%D8%B4%D8%B1%D9%88%D8%B9%20%D8%B1%D9%82%D9%85%D9%8A%20%D9%85%D8%B1%D8%A8%D8%AD%20%D9%8A%D9%85%D9%83%D9%86%D9%83%20%D8%A7%D9%84%D8%A8%D8%AF%D8%A1%20%D8%A8%D9%87%D8%A7%20%D9%85%D9%86%20%D8%A7%D9%84%D8%B5%D9%81%D8%B1.pdf";
      } else if (productId === "2" || productName.includes("كيف تربح") || productName.includes("دليل")) {
        // المنتج الثاني: كيف تربح المال من المنتجات الرقمية
        productFile = "https://cix55jnodh8jj42w.public.blob.vercel-storage.com/%D9%83%D9%8A%D9%81%20%D8%AA%D8%B1%D8%A8%D8%AD%20%D8%A7%D9%84%D9%85%D8%A7%D9%84%20%D9%85%D9%86%20%D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA%20%D8%A7%D9%84%D8%B1%D9%82%D9%85%D9%8A%D8%A9%20%D8%AF%D9%84%D9%8A%D9%84%D9%83%20%D8%A7%D9%84%D9%83%D8%A7%D9%85%D9%84%20%281%29.pdf";
      } else {
        // افتراضي: المنتج الثاني
        productFile = "https://cix55jnodh8jj42w.public.blob.vercel-storage.com/%D9%83%D9%8A%D9%81%20%D8%AA%D8%B1%D8%A8%D8%AD%20%D8%A7%D9%84%D9%85%D8%A7%D9%84%20%D9%85%D9%86%20%D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA%20%D8%A7%D9%84%D8%B1%D9%82%D9%85%D9%8A%D8%A9%20%D8%AF%D9%84%D9%8A%D9%84%D9%83%20%D8%A7%D9%84%D9%83%D8%A7%D9%85%D9%84%20%281%29.pdf";
      }
      
      localStorage.setItem("leve1up_email", email);
      localStorage.setItem("leve1up_product_name", productName);
      localStorage.setItem("leve1up_price", price);
      localStorage.setItem("leve1up_currency", currency);
      localStorage.setItem("leve1up_product_file", productFile);
      
      const currencyCode = currencyCodeMap[currency] || "AED";

      const res = await fetch("/api/payment_intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(price),
          currency_code: currencyCode,
          productName,
          productFile,
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
