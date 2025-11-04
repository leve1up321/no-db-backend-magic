"use client";

import { useState } from "react";
import { Download, Lock, AlertCircle, Clock, CheckCircle } from "lucide-react";

interface SecureDownloadButtonProps {
  orderId: string;
  paymentId: string;
  orderStatus: string;
  downloadUrl?: string;
  expiresAt?: number;
  className?: string;
}

/**
 * 🔒 زر تحميل آمن ومحمي
 * 
 * المميزات:
 * - ✅ حماية بـ JWT tokens
 * - ✅ تحميل مرة واحدة فقط
 * - ✅ انتهاء صلاحية تلقائي
 * - ✅ رسائل واضحة بالعربية
 */
export default function SecureDownloadButton({
  orderId,
  paymentId,
  orderStatus,
  downloadUrl,
  expiresAt,
  className = ""
}: SecureDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadAttempted, setDownloadAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // التحقق من انتهاء الصلاحية
  const isExpired = expiresAt ? Date.now() > expiresAt : false;

  // التحقق من حالة الطلب
  const isPaid = orderStatus === 'paid' || orderStatus === 'completed';

  const handleDownload = async () => {
    if (!downloadUrl || !isPaid || isExpired) return;

    setIsDownloading(true);
    setError(null);

    try {
      // فتح الرابط في نافذة جديدة
      window.open(downloadUrl, '_blank');

      // تسجيل أن التحميل تم
      setDownloadAttempted(true);

      console.log("✅ Download initiated:", {
        orderId,
        paymentId,
        timestamp: new Date().toISOString()
      });

    } catch (err: any) {
      console.error("❌ Download error:", err);
      setError("حدث خطأ أثناء التحميل. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsDownloading(false);
    }
  };

  // 🟡 حالة: قيد الانتظار
  if (!isPaid) {
    return (
      <div className="w-full p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-100">
            في انتظار تأكيد الدفع...
          </h3>
        </div>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          سيتم إرسال رابط التحميل بعد اكتمال عملية الدفع بنجاح
        </p>
      </div>
    );
  }

  // 🔴 حالة: فشل الدفع
  if (orderStatus === 'failed') {
    return (
      <div className="w-full p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          <h3 className="text-lg font-bold text-red-900 dark:text-red-100">
            فشلت عملية الدفع
          </h3>
        </div>
        <p className="text-sm text-red-700 dark:text-red-300 mb-4">
          عذراً، لم تكتمل عملية الدفع بنجاح
        </p>
        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
          إعادة المحاولة
        </button>
      </div>
    );
  }

  // ⏰ حالة: انتهت الصلاحية
  if (isExpired) {
    return (
      <div className="w-full p-6 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <Clock className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            انتهت صلاحية الرابط
          </h3>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          رابط التحميل صالح لمدة 30 دقيقة فقط. يرجى التواصل مع الدعم للحصول على رابط جديد.
        </p>
        <button className="px-4 py-2 bg-gray-400 text-white rounded-lg text-sm font-medium cursor-not-allowed" disabled>
          انتهت الصلاحية
        </button>
      </div>
    );
  }

  // ✅ حالة: جاهز للتحميل
  return (
    <div className={`w-full ${className}`}>
      {/* الزر الرئيسي */}
      <button
        onClick={handleDownload}
        disabled={isDownloading || !downloadUrl}
        className={`
          w-full flex items-center justify-center gap-3 
          px-6 py-4 rounded-xl font-bold text-lg
          transition-all duration-300 transform
          ${isDownloading 
            ? 'bg-gray-400 cursor-wait' 
            : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-[1.02] active:scale-[0.98]'
          }
          text-white shadow-lg hover:shadow-xl
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {isDownloading ? (
          <>
            <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>جاري التحميل...</span>
          </>
        ) : (
          <>
            <Download className="w-6 h-6" />
            <span>تحميل الملفات الآن</span>
            <Lock className="w-5 h-5" />
          </>
        )}
      </button>

      {/* معلومات الحماية */}
      <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
              رابط تحميل آمن ومحمي
            </p>
            <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
              <li>• صالح لمرة واحدة فقط</li>
              <li>• محمي بتشفير JWT</li>
              <li>• ينتهي بعد 30 دقيقة</li>
              <li>• مرتبط بحسابك فقط</li>
            </ul>
          </div>
        </div>
      </div>

      {/* رسالة بعد التحميل */}
      {downloadAttempted && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">تنبيه هام:</p>
              <p>
                إذا لم يبدأ التحميل تلقائياً، يرجى التحقق من إعدادات المتصفح أو السماح بالنوافذ المنبثقة.
                لا يمكن استخدام نفس الرابط مرة أخرى.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* رسالة الخطأ */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* معلومات الطلب */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          رقم الطلب: <span className="font-mono">{orderId}</span>
        </p>
        {expiresAt && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            ينتهي في: {new Date(expiresAt).toLocaleString('ar-SA')}
          </p>
        )}
      </div>
    </div>
  );
}

