/**
 * ✅ ORDER SUCCESS PAGE - صفحة الفاتورة الرقمية
 * 
 * الاستخدام:
 * /order-success?payment_id=315c4e0d-399b-4953-9d3e-6b3433aea458
 * 
 * يعرض الفاتورة مباشرة مع زر التحميل الآمن
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Download, Shield, Loader2, Package, CreditCard } from 'lucide-react';

interface OrderRecord {
  payment_id: string;
  order_number: string;
  product_name: string;
  product_image: string;
  amount: number;
  currency: string;
  filename: string;
  file_size_mb: number;
  access_token: string;
  customer_name?: string;
  customer_email?: string;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  
  const [loading, setLoading] = useState(true);
  const [recordData, setRecordData] = useState<OrderRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!paymentId) {
      setError('Missing payment_id in URL');
      setLoading(false);
      return;
    }
    
    const fetchRecord = async () => {
      try {
        console.log(`🔍 Fetching order: ${paymentId}`);
        
        const response = await fetch(`/api/record?payment_id=${paymentId}`);
        const data = await response.json();
        
        console.log('📊 Response:', data);
        
        if (data.success && data.record) {
          setRecordData(data.record);
          setError(null);
          console.log('✅ Order loaded successfully');
        } else {
          setError(data.message || 'Order not found');
          console.error('❌ Order not found');
        }
      } catch (err: any) {
        console.error('❌ Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecord();
  }, [paymentId]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-900 font-semibold text-lg">جاري التحميل...</p>
          <p className="text-gray-500 text-sm mt-2">يتم جلب بيانات طلبك</p>
        </div>
      </div>
    );
  }
  
  if (error || !recordData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">خطأ في تحميل الطلب</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-right">
            <p className="text-sm text-blue-800">
              <strong>💡 نصيحة:</strong> تأكد من صحة payment_id في الرابط
            </p>
          </div>
          
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            العودة للرئيسية
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              تم الدفع بنجاح! 🎉
            </h1>
            <p className="text-green-100">شكراً لشرائك من متجرنا</p>
          </div>
          
          {/* Order Details */}
          <div className="p-8">
            
            {/* Product Name */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {recordData.product_name}
              </h2>
              <div className="flex items-center gap-2 text-gray-500">
                <Package className="w-4 h-4" />
                <span className="text-sm">منتج رقمي</span>
              </div>
            </div>
            
            {/* Order Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">رقم الطلب</p>
                <p className="font-mono text-sm font-semibold text-gray-900">
                  {recordData.order_number}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-500">المبلغ المدفوع</p>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {recordData.amount.toFixed(2)} {recordData.currency}
                </p>
              </div>
            </div>
            
            {/* Payment ID */}
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-500 mb-1">معرف الدفع</p>
              <p className="font-mono text-xs break-all text-gray-700">
                {recordData.payment_id}
              </p>
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>
            
            {/* Download Section */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    منتجك جاهز للتحميل! 📥
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    اضغط الزر أدناه لتحميل منتجك بأمان
                  </p>
                  
                  <a
                    href={`/api/download/${recordData.access_token}`}
                    className="inline-flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Download className="w-6 h-6" />
                    تحميل {recordData.filename}
                  </a>
                  
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>🔒 تحميل آمن ومشفر • حجم الملف: {recordData.file_size_mb} MB</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Customer Info */}
            {recordData.customer_name && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">معلومات العميل</p>
                <p className="font-semibold text-gray-900">
                  {recordData.customer_name}
                </p>
                {recordData.customer_email && (
                  <p className="text-sm text-gray-600 mt-1">{recordData.customer_email}</p>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>شكراً لثقتك بنا ❤️</p>
          <p className="mt-2">لأي استفسار، نحن هنا لمساعدتك على مدار الساعة</p>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
