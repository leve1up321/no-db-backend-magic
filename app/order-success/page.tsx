/**
 * ════════════════════════════════════════════════════════════════════════════
 * 🎉 ORDER SUCCESS PAGE - صفحة الفاتورة الرقمية
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * الوظيفة:
 * عرض فاتورة رقمية شاملة مع زر تحميل آمن للمنتج
 * 
 * Query Parameters المقبولة:
 * - payment_id: معرف الدفع (أساسي)
 * - access: access token (اختياري - يُجلب من السجل)
 * 
 * مثال:
 * /order-success?payment_id=24d7813b-2af7-4c89-b9be-040ec8e626a6
 * /order-success?payment_id=xxx&access=tok_xxx
 * 
 * التدفق:
 * 1. قراءة payment_id من URL
 * 2. جلب بيانات السجل من /api/record
 * 3. Retry logic: 20 محاولة × 2 ثانية (40 ثانية)
 * 4. عرض الفاتورة مع:
 *    - صورة المنتج
 *    - اسم المنتج
 *    - رقم الطلب
 *    - المبلغ والعملة
 *    - تاريخ الطلب
 *    - زر تحميل آمن
 * 5. تحذير إذا انتهت صلاحية Token
 * 6. زر واتساب للدعم
 * 
 * الحالات المختلفة:
 * - Loading: جاري التحميل...
 * - Success: الفاتورة كاملة
 * - Expired: انتهت الصلاحية
 * - Error: حدث خطأ
 * - Not Found: السجل غير موجود
 * 
 * ════════════════════════════════════════════════════════════════════════════
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  CheckCircle2, 
  Download, 
  Clock, 
  Shield, 
  MessageCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Package,
  CreditCard,
  Calendar,
  FileText
} from 'lucide-react';

// ────────────────────────────────────────────────────────────────────────────
// 🎨 Types
// ────────────────────────────────────────────────────────────────────────────

interface OrderRecord {
  payment_id: string;
  order_number: string;
  status: string;
  product_id: number;
  product_name: string;
  product_image: string;
  amount: number;
  currency: string;
  message: string;
  filename: string;
  file_size_mb: number;
  access_token: string;
  expires_at: string;
  created_at: string;
  used: boolean;
  download_count: number;
  customer_email: string;
  customer_name: string;
}

interface RecordResponse {
  success: boolean;
  record?: OrderRecord;
  is_expired?: boolean;
  time_remaining_minutes?: number;
  error?: string;
  message?: string;
}

// ────────────────────────────────────────────────────────────────────────────
// 🎯 المكون الرئيسي
// ────────────────────────────────────────────────────────────────────────────

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const accessToken = searchParams.get('access');
  
  const [loading, setLoading] = useState(true);
  const [recordData, setRecordData] = useState<OrderRecord | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [manualRetry, setManualRetry] = useState(false);
  
  // رقم الواتساب للدعم (من Environment Variables)
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '966500000000';
  
  // ──────────────────────────────────────────────────────────────────────────
  // جلب بيانات السجل
  // ──────────────────────────────────────────────────────────────────────────
  
  useEffect(() => {
    if (!paymentId && !accessToken) {
      setError('لم يتم توفير معلومات الدفع في الرابط');
      setLoading(false);
      return;
    }
    
    const fetchRecord = async () => {
      try {
        setLoading(true);
        
        // بناء query parameters
        const params = new URLSearchParams();
        if (paymentId) params.append('payment_id', paymentId);
        if (accessToken) params.append('token', accessToken);
        
        console.log(`🔍 Fetching record (attempt ${retryCount + 1}/20)...`);
        console.log(`📋 Query params: ${params.toString()}`);
        
        const response = await fetch(`/api/record?${params.toString()}`);
        const data: RecordResponse = await response.json();
        
        console.log(`📊 Response:`, data);
        
        if (data.success && data.record) {
          setRecordData(data.record);
          setIsExpired(data.is_expired || false);
          setTimeRemaining(data.time_remaining_minutes || 0);
          setError(null);
          setLoading(false);
          
          console.log('✅ Record loaded successfully');
        } else {
          // إذا فشل، نحاول مرة أخرى (Webhook قد يتأخر)
          if (retryCount < 20) {
            console.log(`⏳ Record not found yet, retrying in 2 seconds...`);
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 2000);
          } else {
            setError(data.message || 'لم يتم العثور على بيانات الطلب');
            setLoading(false);
          }
        }
        
      } catch (err: any) {
        console.error('❌ Fetch error:', err);
        
        if (retryCount < 20) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
        } else {
          setError('حدث خطأ في جلب بيانات الطلب');
          setLoading(false);
        }
      }
    };
    
    fetchRecord();
  }, [paymentId, accessToken, retryCount]);
  
  // ──────────────────────────────────────────────────────────────────────────
  // إعادة المحاولة يدوياً
  // ──────────────────────────────────────────────────────────────────────────
  
  const handleManualRetry = () => {
    setManualRetry(true);
    setRetryCount(0);
    setError(null);
    setTimeout(() => setManualRetry(false), 1000);
  };
  
  // ──────────────────────────────────────────────────────────────────────────
  // تنسيق التاريخ
  // ──────────────────────────────────────────────────────────────────────────
  
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('ar-SA', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Asia/Riyadh'
    }).format(date);
  };
  
  // ──────────────────────────────────────────────────────────────────────────
  // رابط الواتساب
  // ──────────────────────────────────────────────────────────────────────────
  
  const getWhatsAppLink = () => {
    const message = recordData 
      ? `مرحباً، لدي استفسار بخصوص الطلب: ${recordData.order_number}`
      : `مرحباً، لدي استفسار بخصوص طلبي`;
    
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };
  
  // ──────────────────────────────────────────────────────────────────────────
  // 🎨 UI: Loading State
  // ──────────────────────────────────────────────────────────────────────────
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            جاري تحميل بيانات الطلب...
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            يرجى الانتظار بينما نجلب معلومات طلبك
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${(retryCount / 20) * 100}%` }}
            />
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            محاولة {retryCount} من 20
          </p>
          
          {retryCount > 5 && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>نصيحة:</strong> إذا دفعت للتو، انتظر 30-60 ثانية حتى يصل الإشعار من بوابة الدفع
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // ──────────────────────────────────────────────────────────────────────────
  // 🎨 UI: Error State
  // ──────────────────────────────────────────────────────────────────────────
  
  if (error || !recordData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            لم يتم العثور على الطلب
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'لم نتمكن من إيجاد بيانات طلبك'}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleManualRetry}
              disabled={manualRetry}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${manualRetry ? 'animate-spin' : ''}`} />
              إعادة المحاولة
            </button>
            
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              تواصل عبر واتساب
            </a>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              💡 <strong>نصيحة:</strong> إذا دفعت للتو، انتظر 30-60 ثانية ثم اضغط "إعادة المحاولة"
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // ──────────────────────────────────────────────────────────────────────────
  // 🎨 UI: Success State (الفاتورة الكاملة)
  // ──────────────────────────────────────────────────────────────────────────
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* ────────────────────────────────────────────────────────────────── */}
        {/* رأس الصفحة */}
        {/* ────────────────────────────────────────────────────────────────── */}
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-3 animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              تم الدفع بنجاح! 🎉
            </h1>
            <p className="text-green-100">
              شكراً لشرائك من متجرنا
            </p>
          </div>
          
          {/* ────────────────────────────────────────────────────────────── */}
          {/* تحذير انتهاء الصلاحية */}
          {/* ────────────────────────────────────────────────────────────── */}
          
          {isExpired && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 m-6">
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                    ⚠️ انتهت صلاحية رابط التحميل
                  </h3>
                  <p className="text-red-700 dark:text-red-300 mb-4">
                    انتهت صلاحية رابط التحميل الآمن ({timeRemaining} دقائق متبقية عند آخر تحديث).
                    للحصول على رابط جديد، تواصل معنا عبر واتساب.
                  </p>
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    طلب رابط جديد عبر واتساب
                  </a>
                </div>
              </div>
            </div>
          )}
          
          {/* ────────────────────────────────────────────────────────────── */}
          {/* معلومات الطلب */}
          {/* ────────────────────────────────────────────────────────────── */}
          
          <div className="p-6 md:p-8">
            {/* Product Image & Info */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <div className="relative w-full md:w-48 h-64 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                  {recordData.product_image ? (
                    <Image
                      src={recordData.product_image}
                      alt={recordData.product_name}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Product Details */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {recordData.product_name}
                </h2>
                
                <div className="space-y-3">
                  {/* Order Number */}
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">رقم الطلب</p>
                      <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                        {recordData.order_number}
                      </p>
                    </div>
                  </div>
                  
                  {/* Payment ID */}
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">معرف الدفع</p>
                      <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                        {recordData.payment_id}
                      </p>
                    </div>
                  </div>
                  
                  {/* Date */}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">تاريخ الطلب</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatDate(recordData.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Amount */}
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">المبلغ المدفوع</p>
                      <p className="text-2xl font-bold text-green-600">
                        {recordData.amount.toFixed(2)} {recordData.currency}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>
            
            {/* ──────────────────────────────────────────────────────────── */}
            {/* قسم التحميل */}
            {/* ──────────────────────────────────────────────────────────── */}
            
            {!isExpired ? (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                      <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      منتجك جاهز للتحميل! 📥
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      رابط التحميل الآمن صالح لمدة <strong>10 دقائق</strong> من وقت الدفع.
                      المتبقي: <strong className="text-blue-600">{timeRemaining} دقيقة</strong>
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={`/api/download/${recordData.access_token}`}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <Download className="w-6 h-6" />
                        تحميل {recordData.filename}
                      </a>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Shield className="w-4 h-4" />
                      <span>🔒 تحميل آمن ومشفر • حجم الملف: {recordData.file_size_mb} MB</span>
                    </div>
                    
                    {recordData.download_count > 0 && (
                      <div className="mt-2 text-sm text-gray-500">
                        📊 عدد مرات التحميل: {recordData.download_count}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  انتهت صلاحية رابط التحميل. تواصل معنا للحصول على رابط جديد.
                </p>
              </div>
            )}
            
            {/* ──────────────────────────────────────────────────────────── */}
            {/* معلومات إضافية */}
            {/* ──────────────────────────────────────────────────────────── */}
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Info */}
              {recordData.customer_name && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">العميل</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {recordData.customer_name}
                  </p>
                  {recordData.customer_email && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {recordData.customer_email}
                    </p>
                  )}
                </div>
              )}
              
              {/* Status */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">حالة الطلب</p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <p className="font-semibold text-green-600">مكتمل</p>
                </div>
              </div>
            </div>
            
            {/* ──────────────────────────────────────────────────────────── */}
            {/* زر الدعم */}
            {/* ──────────────────────────────────────────────────────────── */}
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                هل تواجه مشكلة في التحميل؟
              </p>
              
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                تواصل عبر واتساب
              </a>
            </div>
            
          </div>
        </div>
        
        {/* ────────────────────────────────────────────────────────────────── */}
        {/* Footer */}
        {/* ────────────────────────────────────────────────────────────────── */}
        
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>شكراً لثقتك بنا ❤️</p>
          <p className="mt-2">لأي استفسار، نحن هنا لمساعدتك على مدار الساعة</p>
        </div>
        
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Wrapper مع Suspense
// ────────────────────────────────────────────────────────────────────────────

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}

