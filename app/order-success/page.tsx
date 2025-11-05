"use client";

/**
 * 🎯 صفحة فاتورة الطلب مع Token-Based Authentication
 * 
 * الوظائف:
 * 1. قراءة payment_id أو token من URL query params
 * 2. جلب السجل من /api/record
 * 3. التحقق من صلاحية التوكن
 * 4. عرض فاتورة كاملة مع:
 *    - صورة المنتج
 *    - اسم المنتج
 *    - رقم الطلب
 *    - المبلغ المدفوع
 *    - زر تحميل آمن عبر /api/download/[token]
 * 5. معالجة الأخطاء (توكن منتهي، غير موجود، إلخ)
 * 6. رسالة WhatsApp للدعم
 * 
 * الاستخدام:
 * - /order-success?payment_id=xxx
 * - /order-success?token=xxx
 */

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  CheckCircle, Download, Package, Receipt, Home, 
  ShoppingBag, Loader2, AlertCircle, MessageCircle,
  Clock, Shield
} from "lucide-react";

interface RecordData {
  payment_id: string;
  message: string;
  amount: number;
  currency: string;
  customer_email: string;
  customer_name: string;
  product_name: string;
  download_url: string;
  filename: string;
  token: string;
  expires_at: string;
  used: boolean;
  created_at: string;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const accessToken = searchParams.get('token');
  
  const [recordData, setRecordData] = useState<RecordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // التحقق من وجود معرف
    if (!paymentId && !accessToken) {
      setError("لم يتم تحديد معرف الطلب");
      setLoading(false);
      return;
    }

    const fetchRecord = async () => {
      try {
        console.log(`🔍 Fetching record (attempt ${retryCount + 1}/20)...`);
        
        // بناء URL
        const identifier = accessToken ? `token=${accessToken}` : `payment_id=${paymentId}`;
        const apiUrl = `/api/record?${identifier}`;
        
        console.log(`📡 API URL: ${apiUrl}`);
        
        const res = await fetch(apiUrl, {
          cache: 'no-store'
        });
        
        const data = await res.json();
        
        console.log("📥 API Response:", data);

        if (data.success && data.record) {
          setRecordData(data.record);
          setIsExpired(data.is_expired);
          setLoading(false);
          console.log("✅ Record loaded successfully!");
          console.log(`🎫 Token: ${data.record.token}`);
          console.log(`⏰ Expires: ${data.record.expires_at}`);
          console.log(`🔓 Expired: ${data.is_expired ? 'Yes' : 'No'}`);
        } else {
          // Retry logic - قد يتأخر webhook
          if (retryCount < 20) {
            console.log(`⏳ Record not found yet, retry ${retryCount + 1}/20...`);
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 2000);
          } else {
            setError(data.message || "لم يتم العثور على السجل");
            setLoading(false);
          }
        }
      } catch (err: any) {
        console.error("❌ Fetch error:", err);
        
        if (retryCount < 20) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
        } else {
          setError("حدث خطأ أثناء جلب البيانات");
          setLoading(false);
        }
      }
    };

    fetchRecord();
  }, [paymentId, accessToken, retryCount]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔄 حالة التحميل
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
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

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ❌ حالة الخطأ
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  if (error || !recordData) {
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

                <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    💡 <strong>نصيحة:</strong>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    إذا كنت قد أتممت عملية الدفع، يرجى الانتظار 30-40 ثانية ثم تحديث الصفحة.
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

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ✅ حالة النجاح - عرض الفاتورة
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  // رابط التحميل الآمن
  const downloadLink = `/api/download/${recordData.token}`;
  
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
                  معرف الدفع
                </p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400 font-mono">
                  {recordData.payment_id}
                </p>
              </div>
            </div>

            {/* تحذير انتهاء الصلاحية */}
            {isExpired && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-2">
                      ⚠️ انتهت صلاحية رابط التحميل
                    </h3>
                    <p className="text-red-700 dark:text-red-400 mb-3">
                      انتهت صلاحية رابط التحميل الآمن. للحصول على رابط جديد، يرجى التواصل معنا عبر واتساب.
                    </p>
                    <a
                      href={`https://wa.me/966XXXXXXXXX?text=مرحباً، أحتاج رابط تحميل جديد للطلب: ${recordData.payment_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#20bd5a] transition-colors text-sm"
                    >
                      <MessageCircle size={18} />
                      طلب رابط جديد عبر واتساب
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* معلومات الدفع */}
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
                      {recordData.customer_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">البريد الإلكتروني</p>
                    <p className="font-semibold text-gray-800 dark:text-white break-all">
                      {recordData.customer_email}
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">المبلغ</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {recordData.amount.toFixed(2)} {recordData.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">تاريخ الدفع</p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {new Date(recordData.created_at).toLocaleString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* المنتج وزر التحميل */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <Package className="w-7 h-7 text-green-600" />
                المنتج المشترى
              </h2>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  {recordData.product_name}
                </h3>
                
                {recordData.message && (
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {recordData.message}
                  </p>
                )}

                {/* زر التحميل الآمن */}
                {!isExpired && (
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white mb-6">
                    <Shield className="w-12 h-12 mx-auto mb-4" />
                    <h4 className="text-2xl font-bold mb-4">
                      منتجك جاهز للتحميل!
                    </h4>
                    <p className="mb-6 text-green-50">
                      رابط التحميل الآمن صالح لمدة 10 دقائق
                    </p>
                    <a
                      href={downloadLink}
                      className="inline-flex items-center gap-3 bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg"
                    >
                      <Download size={24} />
                      تحميل {recordData.filename}
                    </a>
                    <p className="mt-4 text-sm text-green-100">
                      🔒 تحميل آمن ومشفر
                    </p>
                  </div>
                )}
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
                href={`https://wa.me/966XXXXXXXXX?text=مرحباً، لدي استفسار بخصوص الطلب: ${recordData.payment_id}`}
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

