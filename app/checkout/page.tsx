"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function CheckoutContent() {
  const params = useSearchParams();
  const productName = decodeURIComponent(
    params.get("product") || "الربح من المنتجات الرقمية"
  );

  const prices: Record<string, number> = {
    "الربح من المنتجات الرقمية": 39,
    "15 فكرة مشروع رقمي مربح": 29,
  };

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    if (!email || !email.includes("@")) {
      setError("يرجى إدخال بريد إلكتروني صالح.");
      return;
    }

    setError(null);
    setLoading(true);
    localStorage.setItem("leve1up_email", email);
    localStorage.setItem("leve1up_product", productName);

    try {
      const res = await fetch("/api/payment_intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, customerEmail: email }),
      });

      const data = await res.json();
      if (data.redirect_url) window.location.href = data.redirect_url;
      else setError("حدث خطأ أثناء إنشاء الدفع.");
    } catch (err) {
      setError("فشل الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white px-4">
      <div className="max-w-md w-full bg-gray-800/70 p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-400">💳 متابعة الدفع</h1>
        <p className="text-gray-300 mb-2">المنتج:</p>
        <h2 className="text-xl font-semibold text-white mb-4">{productName}</h2>
        <p className="text-green-400 text-2xl mb-6">
          السعر: {prices[productName] || 39} درهم
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@gmail.com"
          className="border border-gray-600 bg-gray-900 text-white p-3 rounded-lg w-full text-center mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {error && <p className="text-red-400 mb-3 text-sm">{error}</p>}

        <button
          disabled={!email || loading}
          onClick={handlePay}
          className="bg-green-500 hover:bg-green-600 text-white w-full py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
        >
          {loading ? "جارٍ التحويل..." : "متابعة إلى الدفع"}
        </button>

        <p className="text-gray-400 text-sm mt-4">
          سيتم تحويلك إلى صفحة الدفع الآمنة في Ziina 💳
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <S
