"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Download, Package, Receipt, Home, ShoppingBag, Loader2, AlertCircle } from "lucide-react";

/**
 * 🎯 صفحة Success - تعرض آخر دفع مكتمل من Blob Storage
 * 
 * لا تعتمد على tokens أو معرفات في URL
 * تجلب آخر دفع مكتمل مباشرة من Blob
 */

interface PaymentData {
  payment_id: string;
  message: string;
  amount: number;
  currency: string;
  status: string;
  download_url: string;
  customer_email?: string;
  customer_name?: string;
  created_at: string;
  cart_items?: any[];
}

function SuccessContent() {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        // أولاً: تحقق من وجود payment_intent في الرابط
        const urlParams = new URLSearchParams(window.location.search);
        const paymentIntent = urlParams.get("payment_intent");

        if (paymentIntent) {
          // ✅ إذا وُجد payment_intent: استخدم /api/payment_status
          console.log(`🔍 Found payment_intent in URL: ${paymentIntent}`);
          
          const res = await fetch('/api/payment_status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payment_intent: paymentIntent }),
          });

          const data = await res.json();

          if (data.error) {
            setError('حدث خطأ أثناء جلب تفاصيل الدفع.');
            setLoading(false);
          } else {
            // تحويل البيانات للصيغة المتوقعة
            setPaymentData({
              payment_id: data.paymentId,
              message: data.message || 'عملية شراء ناجحة',
              amount: data.amount,
              currency: 'AED',
              status: data.status,
              download_url: data.fileUrl,
              created_at: new Date().toISOString(),
            });
            setLoading(false);
            console.log("✅ Payment data loaded successfully from payment_intent!");
          }
        } else {
          // ❌ إذا لم يوجد payment_intent: استخدم /api/payments/latest
          console.log(`🔍 No payment_intent in URL, fetching latest payment (attempt ${retryCount + 1}/20)...`);
          
          const res = await fetch('/api/payments/latest');
          const data = await res.json();

          console.log("📥 Response:", data);

          if (data.success && data.payment) {
            setPaymentData(data.payment);
            setLoading(false);
            console.log("✅ Payment data loaded successfully from latest!");
          } else {
            // إذا لم يُعثر على دفع، نحاول مرة أخرى (webhook قد يتأخر)
            if (retryCount < 20) {
              console.log(`⏳ No payment found yet, retry ${retryCount + 1}/20...`);
              setTimeout(() => {
                setRetryCount(prev => prev + 1);
              }, 2000); // محاولة كل ثانيتين
            } else {
              setError(data.message || "لم يتم العثور على عملية دفع مكتملة. يرجى تحديث الصفحة أو التواصل مع الدعم.");
              setLoading(false);
            }
          }
        }
      } catch (err: any) {
        console.error("Error fetching payment:", err);
        
        // محاولة أخرى في حالة الخطأ (فقط إذا لم يكن هناك payment_intent)
        const urlParams = new URLSearchParams(window.location.search);
        const paymentIntent = urlParams.get("payment_intent");
        
        if (!paymentIntent && retryCount < 20) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
        } else {
          setError("حدث خطأ أثناء جلب بيانات الدفع");
          setLoading(false);
        }
      }
    };

    fetchPayment();
  }, [retryCount]);

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
                        style={{ width: `${(retryCount / 20) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500">
                      محاولة {retryCount} من 20...
                    </p>
                  </div>
                )}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    💡 تتم معالجة عملية الدفع. قد يستغرق الأمر حتى 40 ثانية...
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
  if (error || !paymentData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-white pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-red-600" />
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  عذراً، حدث خطأ
                </h1>
                
                <p className="text-gray-600 mb-8">
                  {error || "معلومات الدفع غير متوفرة"}
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
                    إذا كنت قد أتممت عملية الدفع بنجاح، يرجى الانتظار 30-40 ثانية ثم اضغط على "تحديث الصفحة".
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    إذا استمرت المشكلة، يرجى التواصل معنا عبر الواتساب.
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
                ✅ تم الدفع بنجاح! 🎉
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                شكراً لك! تمت عملية الشراء بنجاح
              </p>

              {paymentData.customer_email && (
                <p className="text-gray-500">
                  تم إرسال تفاصيل الطلب إلى:{" "}
                  <span className="font-semibold text-gray-700">
                    {paymentData.customer_email}
                  </span>
                </p>
              )}
            </div>

            {/* تفاصيل الدفع */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <Receipt className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-800">
                  تفاصيل الدفع
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">معرف الدفع:</span>
                  <span className="font-mono text-sm text-gray-800">
                    {paymentData.payment_id}
                  </span>
                </div>

                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">المبلغ المدفوع:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {paymentData.amount.toFixed(2)} {paymentData.currency}
                  </span>
                </div>

                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">الحالة:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                    ✅ مكتمل
                  </span>
                </div>

                {paymentData.message && (
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">الوصف:</span>
                    <span className="text-gray-800 text-right">
                      {paymentData.message}
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-3">
                  <span className="text-gray-600">تاريخ الدفع:</span>
                  <span className="text-gray-800">
                    {new Date(paymentData.created_at).toLocaleString('ar-SA', {
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
            {paymentData.cart_items && paymentData.cart_items.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                  <Package className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    المنتجات المشتراة
                  </h2>
                </div>

                <div className="space-y-4">
                  {paymentData.cart_items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
                      <div>
                        <p className="font-semibold text-gray-800">{item.name || item.productName}</p>
                        <p className="text-sm text-gray-500">
                          الكمية: {item.quantity || 1}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-gray-800">
                        {item.price} {paymentData.currency}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* زر التحميل */}
            {paymentData.download_url && (
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-xl p-8 text-white text-center mb-8">
                <Download className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">
                  منتجك جاهز للتحميل!
                </h3>
                <p className="mb-6 text-green-50">
                  انقر على الزر أدناه لتحميل منتجك مباشرة
                </p>
                <a
                  href={paymentData.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
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
