"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  CheckCircle, Download, Package, Receipt, Home, 
  ShoppingBag, Loader2, AlertCircle, MessageCircle 
} from "lucide-react";

/**
 * 🎯 صفحة فاتورة الطلب - ديناميكية لجميع المنتجات
 * 
 * تقرأ payment_id من URL وتعرض فاتورة كاملة
 */

interface OrderItem {
  product_id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  download_url: string;
  notes: string;
}

interface OrderData {
  payment_id: string;
  order_number: string;
  status: string;
  customer: {
    name: string;
    email: string;
  };
  payment: {
    amount: number;
    currency: string;
    method: string;
    message: string;
    paid_at: string;
  };
  items: OrderItem[];
  totals: {
    subtotal: number;
    tax: number;
    total: number;
  };
  created_at: string;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!paymentId) {
      setError("لم يتم تحديد معرف الدفع");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        console.log(`🔍 Fetching order for payment_id: ${paymentId} (attempt ${retryCount + 1}/20)`);
        
        const res = await fetch(`/api/orders/${paymentId}`, {
          cache: 'no-store'
        });
        
        const data = await res.json();

        if (data.success && data.order) {
          setOrderData(data.order);
          setLoading(false);
          console.log("✅ Order loaded successfully!");
        } else {
          // Retry logic - webhook قد يتأخر
          if (retryCount < 20) {
            console.log(`⏳ Order not found yet, retry ${retryCount + 1}/20...`);
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 2000);
          } else {
            setError("لم يتم العثور على الطلب. يرجى التواصل مع الدعم.");
            setLoading(false);
          }
        }
      } catch (err: any) {
        console.error("Error:", err);
        
        if (retryCount < 20) {
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
  }, [paymentId, retryCount]);

  // 🔄 حالة التحميل
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                <div className="flex justify-center mb-6">
                  <Loader2 className="w-16 h-16 text-green-500 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  جاري تحميل بيانات الطلب...
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  يرجى الانتظار بينما نقوم بتحميل تفاصيل طلبك
                </p>
                {retryCount > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(retryCount / 20) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      محاولة {retryCount} من 20...
                    </p>
                  </div>
                )}
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
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-800 pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                  عذراً، حدث خطأ
                </h1>
                
                <p className="text-gray-600 dark:text-gray-400 mb-8">
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
                  
                  <a
                    href="https://wa.me/966XXXXXXXXX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#20bd5a] transition-colors"
                  >
                    <MessageCircle size={20} />
                    تواصل عبر واتساب
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ✅ حالة النجاح - عرض الفاتورة
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* رأس الفاتورة */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                ✅ تم الدفع بنجاح! 🎉
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                شكراً لك على شرائك من لفل أب
              </p>

              <div className="inline-block bg-green-100 dark:bg-green-900 px-6 py-3 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  رقم الطلب
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 font-mono">
                  {orderData.order_number}
                </p>
              </div>
            </div>

            {/* تفاصيل العميل والدفع */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* معلومات العميل */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Receipt className="w-6 h-6 text-green-600" />
                  معلومات العميل
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">الاسم</p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {orderData.customer.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">البريد الإلكتروني</p>
                    <p className="font-semibold text-gray-800 dark:text-white break-all">
                      {orderData.customer.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* معلومات الدفع */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6 text-green-600" />
                  تفاصيل الدفع
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">طريقة الدفع</p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {orderData.payment.method}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">تاريخ الدفع</p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {new Date(orderData.payment.paid_at).toLocaleString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">معرف الدفع</p>
                    <p className="font-mono text-xs text-gray-600 dark:text-gray-400 break-all">
                      {orderData.payment_id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* المنتجات */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <Package className="w-7 h-7 text-green-600" />
                المنتجات المشتراة
              </h2>

              <div className="space-y-6">
                {orderData.items.map((item, index) => (
                  <div key={index} className="border-b dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                    <div className="flex gap-6 items-start">
                      {/* صورة المنتج */}
                      <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      </div>

                      {/* تفاصيل المنتج */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                          {item.product_name}
                        </h3>
                        
                        {item.notes && (
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {item.notes}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">السعر</p>
                            <p className="text-lg font-bold text-gray-800 dark:text-white">
                              {item.price.toFixed(2)} {orderData.payment.currency}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">الكمية</p>
                            <p className="text-lg font-bold text-gray-800 dark:text-white">
                              {item.quantity}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">الإجمالي</p>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                              {(item.price * item.quantity).toFixed(2)} {orderData.payment.currency}
                            </p>
                          </div>
                        </div>

                        {/* زر التحميل */}
                        {item.download_url && (
                          <a
                            href={item.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105"
                          >
                            <Download size={20} />
                            تحميل المنتج
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* المجاميع */}
              <div className="mt-8 pt-6 border-t dark:border-gray-700">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>الإجمالي الفرعي:</span>
                    <span className="font-semibold">
                      {orderData.totals.subtotal.toFixed(2)} {orderData.payment.currency}
                    </span>
                  </div>
                  
                  {orderData.totals.tax > 0 && (
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>الضريبة:</span>
                      <span className="font-semibold">
                        {orderData.totals.tax.toFixed(2)} {orderData.payment.currency}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-xl font-bold text-gray-800 dark:text-white pt-3 border-t dark:border-gray-700">
                    <span>المجموع الكلي:</span>
                    <span className="text-green-600 dark:text-green-400">
                      {orderData.totals.total.toFixed(2)} {orderData.payment.currency}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* رسالة الدعم */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-xl p-8 text-white text-center mb-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">
                هل واجهت أي مشكلة؟
              </h3>
              <p className="mb-6 text-blue-50">
                نحن هنا لمساعدتك! تواصل معنا عبر واتساب وسنرد عليك في أقرب وقت ممكن
              </p>
              <a
                href="https://wa.me/966XXXXXXXXX?text=مرحباً، لدي استفسار بخصوص الطلب رقم: "
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
              >
                <MessageCircle size={24} />
                تواصل عبر واتساب
              </a>
            </div>

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
                className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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

export default function OrderSuccessPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}

