"use client";

import { useState } from "react";
import { Download, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

interface SecureDownloadButtonProps {
  orderId: string;
  paymentId: string;
  orderStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  downloadUrl?: string;
  expiresAt?: number;
  className?: string;
}

/**
 * 🔒 زر تحميل آمن محمي
 * 
 * يظهر فقط للطلبات المدفوعة
 * يولد token مؤقت عند الضغط
 * يحمي من الاستخدام غير المصرح
 */
export default function SecureDownloadButton({
  orderId,
  paymentId,
  orderStatus,
  downloadUrl,
  expiresAt,
  className = ""
}: SecureDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadStarted, setDownloadStarted] = useState(false);

  // التحقق من حالة الطلب
  const isPaid = orderStatus === 'paid';
  const isPending = orderStatus === 'pending';
  const isFailed = orderStatus === 'failed';
  const isExpired = expiresAt ? Date.now() > expiresAt : false;

  /**
   * معالجة التحميل الآمن
   */
  const handleSecureDownload = async () => {
    setIsLoading(true);
    setError("");
    setDownloadStarted(false);

    try {
      // إذا كان هناك رابط مباشر وصالح، استخدمه
      if (downloadUrl && !isExpired) {
        window.open(downloadUrl, '_blank');
        setDownloadStarted(true);
        setIsLoading(false);
        return;
      }

      // وإلا، نولد token جديد
      const response = await fetch('/api/secure-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          paymentId
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'فشل توليد رابط التحميل');
      }

      // فتح رابط التحميل في نافذة جديدة
      window.open(data.downloadUrl, '_blank');
      setDownloadStarted(true);

    } catch (err: any) {
      console.error('Download error:', err);
      setError(err.message || 'حدث خطأ أثناء التحميل');
    } finally {
      setIsLoading(false);
    }
  };

  // الزر للطلبات المدفوعة
  if (isPaid) {
    return (
      <div className="space-y-3">
        <button
          onClick={handleSecureDownload}
          disabled={isLoading || isExpired}
          className={`
            w-full flex items-center justify-center gap-2 
            px-6 py-3 rounded-lg font-bold
            transition-all duration-300
            ${isExpired
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>جاري التحضير...</span>
            </>
          ) : downloadStarted ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>تم بدء التحميل</span>
            </>
          ) : isExpired ? (
            <>
              <Clock className="w-5 h-5" />
              <span>انتهت صلاحية الرابط</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>تحميل الملفات</span>
            </>
          )}
        </button>

        {/* رسالة الخطأ */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center flex items-center justify-center gap-2">
              <XCircle className="w-4 h-4" />
              {error}
            </p>
          </div>
        )}

        {/* رسالة النجاح */}
        {downloadStarted && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm text-center">
              ✅ إذا لم يبدأ التحميل تلقائياً، يرجى السماح بالنوافذ المنبثقة
            </p>
          </div>
        )}

        {/* تحذير انتهاء الصلاحية */}
        {isExpired && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-sm text-center">
              ⚠️ انتهت صلاحية رابط التحميل. يرجى التواصل مع الدعم للحصول على رابط جديد.
            </p>
          </div>
        )}

        {/* معلومات إضافية */}
        {!isExpired && (
          <p className="text-xs text-gray-500 text-center">
            🔒 رابط تحميل آمن ومحمي • صالح لمرة واحدة • ينتهي بعد 30 دقيقة
          </p>
        )}
      </div>
    );
  }

  // حالة الانتظار
  if (isPending) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center justify-center gap-2 text-yellow-700">
          <Clock className="w-5 h-5" />
          <span className="font-medium">في انتظار تأكيد الدفع...</span>
        </div>
        <p className="text-sm text-yellow-600 text-center mt-2">
          سيتم إرسال رابط التحميل بعد اكتمال الدفع
        </p>
      </div>
    );
  }

  // حالة الفشل
  if (isFailed) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center justify-center gap-2 text-red-700">
          <XCircle className="w-5 h-5" />
          <span className="font-medium">فشلت عملية الدفع</span>
        </div>
        <p className="text-sm text-red-600 text-center mt-2">
          يرجى إعادة المحاولة أو التواصل مع الدعم
        </p>
      </div>
    );
  }

  // حالة افتراضية
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <p className="text-gray-600 text-center">
        التحميل غير متاح لهذا الطلب
      </p>
    </div>
  );
}

