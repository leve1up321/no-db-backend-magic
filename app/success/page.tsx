"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);
  const [productName, setProductName] = useState<string>("المنتج");
  const [price, setPrice] = useState<string>("0");
  const [currency, setCurrency] = useState<string>("AED");
  const [productFile, setProductFile] = useState<string>("");

  useEffect(() => {
    // قراءة البيانات من LocalStorage
    const savedEmail = localStorage.getItem("leve1up_email");
    const savedProductName = localStorage.getItem("leve1up_product_name");
    const savedPrice = localStorage.getItem("leve1up_price");
    const savedCurrency = localStorage.getItem("leve1up_currency");
    const savedProductFile = localStorage.getItem("leve1up_product_file");

    if (savedEmail) setEmail(savedEmail);
    if (savedProductName) setProductName(savedProductName);
    if (savedPrice) setPrice(savedPrice);
    if (savedCurrency) setCurrency(savedCurrency);
    if (savedProductFile) setProductFile(savedProductFile);

    // يمكن أيضاً قراءة payment_intent من query string لاحقاً
    const paymentIntentId = searchParams.get("payment_intent");
    if (paymentIntentId) {
      console.log("Payment Intent ID:", paymentIntentId);
      // يمكن استخدام هذا لاحقاً للتحقق من الدفع
    }
  }, [searchParams]);

  const getCurrencySymbol = (curr: string) => {
    switch (curr) {
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
      default: return '';
    }
  };

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
          <p className="text-lg">💼 المنتج: <strong>{productName}</strong></p>
          <p className="text-lg">💰 السعر: <strong>{price} {getCurrencySymbol(currency)}</strong></p>
        </div>

        {productFile && (
          <a
            href={productFile}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg mb-4 transition"
          >
            📦 تحميل المنتج الآن
          </a>
        )}

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

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-xl">جاري التحميل...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
