"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SecureDownloadButton from "@/components/SecureDownloadButton";
import { CheckCircle, Package, Receipt, Home, ShoppingBag } from "lucide-react";

interface OrderData {
  id: string;
  paymentId: string;
  status: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName?: string;
  downloadUrl?: string;
  downloadExpiry?: number;
  items?: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get("orderId");
  const paymentId = searchParams.get("paymentId");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId && !paymentId) {
        setError("معلومات الطلب غير متوفرة");
        setLoading(false);
        return;
      }

      try {
        // جلب بيانات الطلب من API
        const queryParam = orderId ? `orderId=${orderId}` : `paymentId=${paymentId}`;
        const res = await fetch(`/api/orders?${queryParam}`);
        const data = await res.json();

        if (data.success && data.order) {
          setOrderData(data.order);
        } else {
          setError(data.message || "لم يتم العثور على الطلب");
        }
      } catch (err: any) {
        console.error("Error fetching order:", err);
        setError("حدث خطأ أثناء جلب بيانات الطلب");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, paymentId]);

  // 🔄 حالة التحميل
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">جاري تحميل معلومات الطلب...</p>
        </div>
      </div>
    );
  }

  // ❌ حالة الخطأ
  if (error || !orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            عذراً، حدث خطأ
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error || "لم نتمكن من العثور على معلومات الطلب"}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <Home className="w-5 h-5" />
            <span>العودة للصفحة الرئيسية</span>
          </Link>
        </div>
      </div>
    );
  }

  // ✅ حالة النجاح
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* رسالة النجاح */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6 shadow-2xl animate-bounce-once">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
              تم الدفع بنجاح! 🎉
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              شكراً لك على شرائك من متجرنا
            </p>
          </div>

          {/* بطاقة معلومات الطلب */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
            {/* عنوان القسم */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <Package className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                تفاصيل الطلب
              </h2>
            </div>

            {/* المعلومات الأساسية */}
            <div className="grid gap-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-gray-600 dark:text-gray-300">رقم الطلب:</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">
                  {orderData.id}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-gray-600 dark:text-gray-300">رقم الدفعة:</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">
                  {orderData.paymentId}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl">
                <span className="text-gray-600 dark:text-gray-300">المبلغ المدفوع:</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {orderData.amount} {orderData.currency}
                </span>
              </div>

              {orderData.customerEmail && (
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <span className="text-gray-600 dark:text-gray-300">البريد الإلكتروني:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {orderData.customerEmail}
                  </span>
                </div>
              )}
            </div>

            {/* المنتجات المشتراة */}
            {orderData.items && orderData.items.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  المنتجات المشتراة:
                </h3>
                <div className="space-y-3">
                  {orderData.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          الكمية: {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {item.price} {orderData.currency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* زر التحميل الآمن */}
            <SecureDownloadButton
              orderId={orderData.id}
              paymentId={orderData.paymentId}
              orderStatus={orderData.status}
              downloadUrl={orderData.downloadUrl}
              expiresAt={orderData.downloadExpiry}
            />
          </div>

          {/* روابط إضافية */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium"
            >
              <Home className="w-5 h-5" />
              <span>العودة للصفحة الرئيسية</span>
            </Link>

            <Link
              href="/account"
              className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium"
            >
              <Receipt className="w-5 h-5" />
              <span>عرض جميع طلباتي</span>
            </Link>
          </div>

          {/* ملاحظة هامة */}
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
              📧 تم إرسال رسالة تأكيد
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              تحقق من بريدك الإلكتروني <strong>{orderData.customerEmail}</strong> للحصول على
              نسخة من فاتورتك ورابط التحميل. إذا لم تجد الرسالة، تحقق من مجلد الرسائل غير المرغوب فيها.
            </p>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-once {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-bounce-once {
          animation: bounce-once 1s ease-in-out;
        }
      `}</style>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

