"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaWhatsapp, FaCheckCircle, FaDownload, FaHome } from "react-icons/fa";

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
  orderId?: string;
  paymentId?: string;
  createdAt?: string;
  downloadLinks?: { productId: number; productName: string; downloadUrl: string }[];
}

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  // رقم الواتساب (يمكن تخصيصه)
  const WHATSAPP_NUMBER = "971503492848"; // ضع رقم الواتساب الخاص بك هنا
  const WHATSAPP_MESSAGE = "مرحباً، لدي استفسار بخصوص طلبي";

  useEffect(() => {
    const session = searchParams.get("session"); // ✅ استخدام session بدلاً من payment_intent
    const payment_intent = searchParams.get("payment_intent"); // للتوافق مع الطلبات القديمة
    const token = searchParams.get("token");
    
    const fetchOrderData = async () => {
      try {
        // ✨ أولاً: إذا كان هناك session ID، نجلب من API
        const searchId = session || payment_intent;
        
        if (searchId) {
          console.log("🔍 Fetching order by ID:", searchId);
          
          try {
            const response = await fetch(`/api/orders/${searchId}`);
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
                orderId: order.id,
                paymentId: order.paymentId || searchId,
                createdAt: order.createdAt,
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
          }
        }
        
        // ثانياً: نحاول جلب من localStorage (للسلة) - Fallback
        const savedCartItems = localStorage.getItem("cart");
        const savedEmail = localStorage.getItem("leve1up_email");
        const savedCurrency = localStorage.getItem("currency") || "SAR";
        const savedTotalAmount = localStorage.getItem("leve1up_total_amount");

        console.log('📦 localStorage data:', {
          cart: savedCartItems,
          email: savedEmail,
          currency: savedCurrency,
          total: savedTotalAmount
        });

        if (savedCartItems && savedEmail) {
          const items: CartItem[] = JSON.parse(savedCartItems);
          console.log('🛒 Cart items parsed:', items);
          
          // جلب روابط التحميل من products.json
          try {
            const productsResponse = await fetch('/data/products.json');
            const products = await productsResponse.json();
            
            const downloadLinks = items.map(item => {
              // البحث بكل الطرق الممكنة
              const product = products.find((p: any) => 
                p.product_id === item.id || 
                p.id === item.id ||
                p.product_id === parseInt(String(item.id)) ||
                p.id === parseInt(String(item.id))
              );
              
              console.log('🔍 Looking for product ID:', item.id, 'Found:', !!product);
              if (product) {
                console.log('✅ Product found:', product.product_name, '- URL:', product.download_url);
              }
              
              return {
                productId: item.id,
                productName: item.name,
                downloadUrl: product?.download_url || ''
              };
            }).filter(link => link.downloadUrl); // إزالة المنتجات التي لا تحتوي على رابط تحميل
            
            setOrderData({
              email: savedEmail,
              items,
              totalAmount: savedTotalAmount ? parseFloat(savedTotalAmount) : 0,
              currency: savedCurrency,
              downloadLinks
            });
          } catch (e) {
            console.error("Error fetching products:", e);
            setOrderData({
              email: savedEmail,
              items,
              totalAmount: savedTotalAmount ? parseFloat(savedTotalAmount) : 0,
              currency: savedCurrency,
            });
          }

          // تنظيف localStorage بعد عرض النجاح
          localStorage.removeItem("cart");
          localStorage.removeItem("leve1up_email");
          localStorage.removeItem("leve1up_total_amount");
          localStorage.removeItem("leve1up_product_name");
          localStorage.removeItem("leve1up_price");
          localStorage.removeItem("leve1up_currency");
          localStorage.removeItem("leve1up_product_file");
        } else if (token) {
          console.log("🔍 Fetching order by token:", token);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-xl border border-gray-100">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">لم يتم العثور على بيانات الطلب</h1>
          <p className="text-gray-600 mb-6">
            يرجى التحقق من بريدك الإلكتروني للحصول على تفاصيل الطلب.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition shadow-lg hover:shadow-xl"
          >
            <FaHome /> العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const { email, items, totalAmount, currency, orderId, paymentId, createdAt, downloadLinks } = orderData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        
        {/* 🎉 رسالة النجاح الرئيسية */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl shadow-2xl p-8 text-center mb-8 text-white">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <FaCheckCircle className="text-6xl" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">تم الدفع بنجاح! 🎉</h1>
          <p className="text-xl md:text-2xl font-medium opacity-95">شكراً لثقتك في Leve1Up</p>
        </div>

        {/* 📧 معلومات البريد الإلكتروني */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">بريدك الإلكتروني</p>
              <p className="text-lg font-semibold text-emerald-600">{email}</p>
            </div>
            {orderId && (
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">رقم الطلب</p>
                <p className="text-sm font-mono text-gray-700">{orderId.slice(0, 12)}...</p>
              </div>
            )}
          </div>
          {createdAt && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                <span className="font-medium">التاريخ:</span> {formatDate(createdAt)}
              </p>
            </div>
          )}
        </div>

        {/* 🎁 روابط التحميل المباشرة */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl shadow-lg p-8 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-emerald-700 mb-2">🎁 روابط التحميل</h2>
            <p className="text-gray-600">يمكنك تحميل منتجاتك مباشرة من الروابط التالية</p>
          </div>
          
          {downloadLinks && downloadLinks.length > 0 ? (
            <>
              <div className="space-y-4">
                {downloadLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.downloadUrl}
                    className="flex items-center justify-between bg-white hover:bg-emerald-50 border-2 border-emerald-300 hover:border-emerald-400 text-emerald-700 font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="flex items-center gap-3">
                      <FaDownload className="text-2xl group-hover:animate-bounce" />
                      <span className="text-right">{link.productName}</span>
                    </span>
                    <span className="text-sm text-emerald-600">تحميل →</span>
                  </a>
                ))}
              </div>

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  <span className="font-bold">💡 نصيحة مهمة:</span> احفظ هذه الصفحة أو الروابط في مكان آمن للرجوع إليها لاحقاً
                </p>
              </div>
            </>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
              <p className="text-yellow-800 mb-4">
                <span className="text-3xl mb-2 block">⚠️</span>
                <span className="font-bold">لم نتمكن من جلب روابط التحميل تلقائياً</span>
              </p>
              <p className="text-sm text-yellow-700 mb-4">
                سيتم إرسال روابط التحميل إلى بريدك الإلكتروني قريباً، أو يمكنك التواصل معنا مباشرة.
              </p>
              <div className="text-xs text-gray-600 bg-white p-3 rounded">
                معلومات للدعم: <br/>
                البريد: {email} <br/>
                {orderId && `رقم الطلب: ${orderId}`}
              </div>
            </div>
          )}
        </div>

        {/* 📦 تفاصيل المنتجات المشتراة */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <span>📦</span> المنتجات المشتراة
          </h2>
          
          <div className="space-y-4 mb-6">
            {items.map((item, index) => (
              <div key={index} className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-800 mb-1">{item.name}</p>
                    <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold text-emerald-600">
                      {(item.price * item.quantity).toFixed(2)} {getCurrencySymbol(currency)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* المجموع الكلي */}
          <div className="border-t-2 border-gray-200 pt-5">
            <div className="flex justify-between items-center bg-emerald-50 p-5 rounded-xl">
              <p className="text-xl font-bold text-gray-800">💰 المجموع الكلي</p>
              <p className="text-3xl font-bold text-emerald-600">
                {totalAmount.toFixed(2)} {getCurrencySymbol(currency)}
              </p>
            </div>
          </div>
        </div>

        {/* 💬 التواصل عبر الواتساب */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">💬 لديك استفسار؟</h3>
            <p className="text-gray-600">تواصل معنا مباشرة عبر الواتساب</p>
          </div>
          
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <FaWhatsapp className="text-3xl" />
            <span className="text-lg">تواصل معنا على الواتساب</span>
          </a>
        </div>

        {/* 🏠 زر العودة للرئيسية */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            <FaHome /> العودة للرئيسية
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            شكراً لاختيارك Leve1Up 💚 نتمنى لك تجربة ممتعة ومفيدة
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-medium">جاري التحميل...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
