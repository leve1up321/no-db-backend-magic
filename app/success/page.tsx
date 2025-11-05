"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Download, Package, Receipt, Home, ShoppingBag, Loader2 } from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderData {
  id: string;
  paymentId: string;
  status: string;
  amount: number;
  currency: string;
  customerEmail?: string;
  customerName?: string;
  downloadUrl?: string;
  items: OrderItem[];
  createdAt: string;
  paidAt?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const paymentIntent = searchParams.get("payment_intent");

  useEffect(() => {
    if (!paymentIntent) {
      setError("معلومات الدفع غير متوفرة");
      setLoading(false);
      return;
    }

    // تحقق إذا كان payment_intent هو template variable (لم يتم استبداله)
    if (paymentIntent === "{CHECKOUT_SESSION_ID}") {
      setError("معلومات الدفع غير صحيحة. يرجى الانتظار قليلاً ثم تحديث الصفحة.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        console.log(`🔍 Fetching order for payment_intent: ${paymentIntent}`);
        
        const res = await fetch(`/api/orders/${paymentIntent}`);
        const data = await res.json();

        console.log("📥 Response:", data);

        if (data.success && data.order) {
          setOrderData(data.order);
          setLoading(false);
        } else {
          // إذا لم يُعثر على الطلب، نحاول مرة أخرى (webhook قد يتأخر)
          if (retryCount < 15) {
            console.log(`⏳ Order not found yet, retry ${retryCount + 1}/15...`);
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 2000); // محاولة كل ثانيتين
          } else {
            setError(data.message || "لم يتم العثور على الطلب. يرجى تحديث الصفحة أو التواصل مع الدعم.");
            setLoading(false);
          }
        }
      } catch (err: any) {
        console.error("Error fetching order:", err);
        
        // محاولة أخرى في حالة الخطأ
        if (retryCount < 15) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
        } else {
          setError("حدث خطأ أثناء جلب بيانات الطلب");
          setLoading(false);
        }
      }
    };

    fetchOrder();
  }, [paymentIntent, retryCount]);

  // 🔄 حالة التحميل
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="flex justify-center mb-6">
                  <Loader2 className="w-16 h-16 text-green-500 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  جاري التحقق من الدفع...
                </h2>
                <p className="text-gray-600 mb-4">
                  يرجى الانتظار بينما نقوم بتأكيد عملية الدفع
                </p>
                {retryCount > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(retryCount / 15) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500">
                      محاولة {retryCount} من 15...
                    </p>
                  </div>
                )}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    💡 تتم معالجة عملية الدفع. قد يستغرق الأمر بضع ثوانٍ...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ❌ حالة الخطأ
  if (error || !orderData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-white pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">❌</span>
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  عذراً، حدث خطأ
                </h1>
                
                <p className="text-gray-600 mb-8">
                  {error || "معلومات الطلب غير متوفرة"}
                </p>

                <div className="flex gap-4 justify-center flex-wrap">
                  <Link 
                    href="/"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    <Home size={20} />
                    العودة للرئيسية
                  </Link>
                  
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    تحديث الصفحة
                  </button>
                </div>

                <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    💡 <strong>نصيحة:</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    إذا كنت قد أتممت عملية الدفع بنجاح، يرجى الانتظار 30 ثانية ثم اضغط على "تحديث الصفحة" أعلاه.
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    إذا استمرت المشكلة، يرجى التواصل معنا مع إرفاق رقم الدفع.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ✅ حالة النجاح
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* رسالة النجاح */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                🎉 تم الدفع بنجاح!
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                شكراً لك! تمت عملية الشراء بنجاح
              </p>

              {orderData.customerEmail && (
                <p className="text-gray-500">
                  تم إرسال تفاصيل الطلب إلى:{" "}
                  <span className="font-semibold text-gray-700">
                    {orderData.customerEmail}
                  </span>
                </p>
              )}
            </div>

            {/* تفاصيل الطلب */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <Receipt className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-800">
                  تفاصيل الطلب
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">رقم الطلب:</span>
                  <span className="font-mono text-sm text-gray-800">
                    {orderData.id}
                  </span>
                </div>

                {orderData.paymentId && (
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">معرف الدفع:</span>
                    <span className="font-mono text-sm text-gray-800">
                      {orderData.paymentId}
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">المبلغ المدفوع:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {orderData.amount.toFixed(2)} {orderData.currency}
                  </span>
                </div>

                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">الحالة:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                    ✅ مدفوع
                  </span>
                </div>

                <div className="flex justify-between py-3">
                  <span className="text-gray-600">تاريخ الدفع:</span>
                  <span className="text-gray-800">
                    {new Date(orderData.paidAt || orderData.createdAt).toLocaleString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* المنتجات */}
            {orderData.items && orderData.items.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                  <Package className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    المنتجات المشتراة
                  </h2>
                </div>

                <div className="space-y-4">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          الكمية: {item.quantity}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-gray-800">
                        {item.price} {orderData.currency}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* زر التحميل */}
            {orderData.downloadUrl && (
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-xl p-8 text-white text-center mb-8">
                <Download className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">
                  منتجك جاهز للتحميل!
                </h3>
                <p className="mb-6 text-green-50">
                  انقر على الزر أدناه لتحميل منتجك مباشرة
                </p>
                <a
                  href={orderData.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Download size={24} />
                  تحميل المنتج الآن
                </a>
                <p className="mt-4 text-sm text-green-100">
                  💾 الملف متاح للتحميل الفوري من Vercel Blob Storage
                </p>
              </div>
            )}

            {/* أزرار الإجراءات */}
            <div className="flex gap-4 justify-center flex-wrap">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <Home size={20} />
                العودة للرئيسية
              </Link>
              
              <Link 
                href="/products"
                className="inline-flex items-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                <ShoppingBag size={20} />
                تصفح المزيد من المنتجات
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

