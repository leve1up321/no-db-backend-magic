"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderData {
  email: string;
  items: CartItem[];
  totalAmount: number;
  currency: string;
  downloadLinks?: { productId: number; productName: string; downloadUrl: string }[];
}

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const payment_intent = searchParams.get("payment_intent");
    const token = searchParams.get("token");
    
    // محاولة جلب بيانات الطلب من localStorage أو API
    const fetchOrderData = async () => {
      try {
        // ✨ أولاً: إذا كان هناك payment_intent من Ziina، نجلب من API
        if (payment_intent) {
          console.log("🔍 Fetching order by payment_intent:", payment_intent);
          
          try {
            const response = await fetch(`/api/orders/${payment_intent}`);
            const result = await response.json();
            
            if (result.success && result.order) {
              const order = result.order;
              console.log("✅ Order found from API:", order);
              
              // إنشاء روابط التحميل لكل منتج
              const downloadLinks = order.items.map((item: CartItem) => ({
                productId: item.id,
                productName: item.name,
                downloadUrl: `/api/download/${order.sessionId}?product=${item.id}`
              }));
              
              setOrderData({
                email: order.customerEmail,
                items: order.items,
                totalAmount: order.amount,
                currency: order.currency,
                downloadLinks
              });
              
              // تنظيف localStorage بعد النجاح
              localStorage.removeItem("cart");
              localStorage.removeItem("leve1up_email");
              localStorage.removeItem("leve1up_total_amount");
              localStorage.removeItem("leve1up_product_name");
              localStorage.removeItem("leve1up_price");
              localStorage.removeItem("leve1up_currency");
              localStorage.removeItem("leve1up_product_file");
              
              setLoading(false);
              return;
            }
          } catch (apiError) {
            console.error("❌ Error fetching from API:", apiError);
            // نتابع للـ fallback
          }
        }
        
        // ثانياً: نحاول جلب من localStorage (للسلة) - Fallback
        const savedCartItems = localStorage.getItem("cart");
        const savedEmail = localStorage.getItem("leve1up_email");
        const savedCurrency = localStorage.getItem("currency") || "SAR";
        const savedTotalAmount = localStorage.getItem("leve1up_total_amount");

        if (savedCartItems && savedEmail) {
          const items: CartItem[] = JSON.parse(savedCartItems);
          
          setOrderData({
            email: savedEmail,
            items,
            totalAmount: savedTotalAmount ? parseFloat(savedTotalAmount) : 0,
            currency: savedCurrency,
          });

          // تنظيف localStorage بعد عرض النجاح
          localStorage.removeItem("cart");
          localStorage.removeItem("leve1up_email");
          localStorage.removeItem("leve1up_total_amount");
          localStorage.removeItem("leve1up_product_name");
          localStorage.removeItem("leve1up_price");
          localStorage.removeItem("leve1up_currency");
          localStorage.removeItem("leve1up_product_file");
        } else if (token) {
          // ثالثاً: إذا كان هناك token، نحاول جلب من API
          console.log("🔍 Fetching order by token:", token);
          // يمكن تطوير هذا لاحقاً لجلب من /api/orders?token=...
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-xl">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white px-4">
        <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center max-w-xl">
          <h1 className="text-4xl font-bold mb-4 text-yellow-400">⚠️ لم يتم العثور على بيانات الطلب</h1>
          <p className="text-gray-300 mb-6">
            يرجى التحقق من بريدك الإلكتروني للحصول على روابط التحميل.
          </p>
          <Link
            href="/"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const { email, items, totalAmount, currency, downloadLinks } = orderData;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white px-4 py-12">
      <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-4 text-green-400">✅ تم الدفع بنجاح!</h1>

        <p className="text-gray-300 mb-6">
          شكراً لك! بريدك الإلكتروني: <strong className="text-green-400">{email}</strong>
        </p>

        {/* 🎁 روابط التحميل المباشرة */}
        {downloadLinks && downloadLinks.length > 0 && (
          <div className="bg-green-900/30 border border-green-500/50 p-6 rounded-lg mb-6">
            <h3 className="text-2xl font-bold mb-4 text-green-400">🎁 روابط التحميل</h3>
            <p className="text-sm text-gray-300 mb-4">يمكنك تحميل منتجاتك مباشرة من الروابط التالية:</p>
            
            <div className="space-y-3">
              {downloadLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.downloadUrl}
                  className="block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📥 تحميل: {link.productName}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* عرض المنتجات المشتراة */}
        <div className="bg-gray-700/40 p-6 rounded-lg mb-6 space-y-4">
          <h2 className="text-2xl font-bold mb-4">📦 المنتجات المشتراة</h2>
          
          {items.map((item, index) => (
            <div key={index} className="bg-gray-800/50 p-4 rounded-lg flex items-center justify-between">
              <div className="text-right">
                <p className="text-lg font-semibold text-white">{item.name}</p>
                <p className="text-sm text-gray-400">الكمية: {item.quantity}</p>
              </div>
              <div className="text-left">
                <p className="text-lg font-bold text-green-400">
                  {(item.price * item.quantity).toFixed(2)} {getCurrencySymbol(currency)}
                </p>
              </div>
            </div>
          ))}

          {/* المجموع الكلي */}
          <div className="border-t border-gray-600 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <p className="text-xl font-bold">المجموع الكلي:</p>
              <p className="text-2xl font-bold text-green-400">
                {totalAmount.toFixed(2)} {getCurrencySymbol(currency)}
              </p>
            </div>
          </div>
        </div>

        {!downloadLinks || downloadLinks.length === 0 ? (
          <div className="bg-blue-900/30 border border-blue-500/50 p-4 rounded-lg mb-6">
            <p className="text-blue-200">
              📧 سيتم إرسال روابط التحميل لجميع المنتجات إلى بريدك الإلكتروني قريباً.
              <br />
              يرجى التحقق من صندوق الوارد (أو البريد المزعج).
            </p>
          </div>
        ) : (
          <div className="bg-yellow-900/30 border border-yellow-500/50 p-4 rounded-lg mb-6">
            <p className="text-yellow-200 text-sm">
              💡 <strong>نصيحة:</strong> احفظ هذه الصفحة أو الروابط في مكان آمن.
              <br />
              كما سيتم إرسال نسخة احتياطية إلى بريدك الإلكتروني.
            </p>
          </div>
        )}

        <Link
          href="/"
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition"
        >
          العودة للرئيسية 🏠
        </Link>

        <p className="text-sm text-gray-400 mt-6">
          إذا لم تصلك المنتجات على بريدك، تواصل معنا عبر{" "}
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
