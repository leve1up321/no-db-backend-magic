"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Package, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  LogOut,
  User,
  Mail,
  Loader2
} from "lucide-react";

interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  paymentId: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  amount: number;
  currency: string;
  customerEmail?: string;
  customerName?: string;
  items: OrderItem[];
  downloadUrl?: string;
  downloadExpiry?: number;
  createdAt: string;
  paidAt?: string;
}

interface UserSession {
  email: string;
  name?: string;
  isAuthenticated: boolean;
}

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserSession | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (!data.isAuthenticated) {
        router.push('/orders'); // إعادة توجيه لصفحة الطلبات العامة
        return;
      }

      setUser(data.user);
      await loadOrders(data.user.email);

    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async (email: string) => {
    try {
      const response = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (data.success && data.orders) {
        setOrders(data.orders);
      } else {
        setError(data.message || 'فشل تحميل الطلبات');
      }

    } catch (error) {
      console.error('Load orders failed:', error);
      setError('فشل الاتصال بالخادم');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'paid':
        return {
          label: 'مدفوع',
          icon: <CheckCircle className="w-5 h-5" />,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
        };
      case 'pending':
        return {
          label: 'قيد الانتظار',
          icon: <Clock className="w-5 h-5" />,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
        };
      case 'failed':
        return {
          label: 'فاشل',
          icon: <XCircle className="w-5 h-5" />,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
        };
      case 'refunded':
        return {
          label: 'مسترجع',
          icon: <RefreshCw className="w-5 h-5" />,
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isDownloadExpired = (expiry?: number) => {
    if (!expiry) return false;
    return Date.now() > expiry;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header with User Info */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user?.name || 'حسابي'}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <Mail className="w-4 h-4" />
                    <p className="text-sm">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-md border border-gray-200"
          >
            <ArrowRight className="w-5 h-5" />
            <span>العودة للخلف</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>العودة للقائمة الرئيسية</span>
          </Link>
        </div>

        {/* Orders Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 text-right mb-4">
            طلباتي ({orders.length})
          </h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-right">
            {error}
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 && !error ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">لا توجد طلبات حتى الآن</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const downloadExpired = isDownloadExpired(order.downloadExpiry);
              const canDownload = order.status === 'paid' && order.downloadUrl && !downloadExpired;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${statusInfo.bgColor}`}>
                          <div className={statusInfo.color}>
                            {statusInfo.icon}
                          </div>
                        </div>
                        <div className="text-right">
                          <h3 className="font-bold text-gray-900">
                            طلب #{order.id.substring(order.id.length - 8)}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-full ${statusInfo.bgColor}`}>
                        <span className={`font-bold ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {/* Payment Info */}
                      <div className="text-right">
                        <h4 className="text-sm font-semibold text-gray-500 mb-2">
                          معلومات الدفع
                        </h4>
                        <p className="text-2xl font-bold text-purple-600">
                          {order.amount.toFixed(2)} {order.currency}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          Payment ID: {order.paymentId}
                        </p>
                      </div>

                      {/* Customer Info */}
                      <div className="text-right">
                        <h4 className="text-sm font-semibold text-gray-500 mb-2">
                          معلومات العميل
                        </h4>
                        <p className="text-gray-900 font-medium">
                          {order.customerName || 'غير محدد'}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {order.customerEmail || 'غير محدد'}
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    {order.items && order.items.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-500 mb-3 text-right">
                          المنتجات
                        </h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="text-right flex-1">
                                <p className="font-medium text-gray-900">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  الكمية: {item.quantity}
                                </p>
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-purple-600">
                                  {item.price.toFixed(2)} {order.currency}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Download Button */}
                    <div className="pt-4 border-t border-gray-100">
                      {canDownload ? (
                        <a
                          href={order.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                        >
                          <Download className="w-5 h-5" />
                          تحميل الملفات
                        </a>
                      ) : downloadExpired ? (
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                          <p className="text-red-600 font-medium">
                            ⚠️ انتهت صلاحية رابط التحميل
                          </p>
                          <p className="text-sm text-red-500 mt-1">
                            الرجاء التواصل مع الدعم للحصول على رابط جديد
                          </p>
                        </div>
                      ) : order.status !== 'paid' ? (
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <p className="text-yellow-600 font-medium">
                            ⏳ في انتظار تأكيد الدفع
                          </p>
                        </div>
                      ) : (
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-600 font-medium">
                            رابط التحميل غير متوفر
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

