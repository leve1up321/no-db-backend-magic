"use client";

import { useState } from "react";
import { Search, Package, Download, CheckCircle, XCircle, Clock, RefreshCw, Mail, CreditCard, Home } from "lucide-react";
import Link from "next/link";

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

export default function OrdersPage() {
  const [searchType, setSearchType] = useState<'email' | 'orderId' | 'paymentId'>('email');
  const [searchValue, setSearchValue] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchValue.trim()) {
      setError('الرجاء إدخال قيمة البحث');
      return;
    }

    setLoading(true);
    setError('');
    setOrders([]);
    setSearched(true);

    try {
      const params = new URLSearchParams();
      params.set(searchType, searchValue);

      const response = await fetch(`/api/orders?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'حدث خطأ أثناء البحث');
        setOrders([]);
        return;
      }

      // إذا كان البحث برقم الطلب أو الدفعة، نحصل على طلب واحد
      if (data.order) {
        setOrders([data.order]);
      } else if (data.orders) {
        setOrders(data.orders);
      }

    } catch (err: any) {
      setError('فشل الاتصال بالخادم');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
          >
            <Home className="w-5 h-5" />
            <span className="font-semibold">العودة للصفحة الرئيسية</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            طلباتي
          </h1>
          <p className="text-gray-600">
            ابحث عن طلباتك وحمّل الإيصالات
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Search Type Selector */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setSearchType('email')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    searchType === 'email'
                      ? 'bg-white text-purple-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Mail className="w-4 h-4 inline-block mr-2" />
                  البريد الإلكتروني
                </button>
                <button
                  type="button"
                  onClick={() => setSearchType('orderId')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    searchType === 'orderId'
                      ? 'bg-white text-purple-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Package className="w-4 h-4 inline-block mr-2" />
                  رقم الطلب
                </button>
                <button
                  type="button"
                  onClick={() => setSearchType('paymentId')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    searchType === 'paymentId'
                      ? 'bg-white text-purple-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <CreditCard className="w-4 h-4 inline-block mr-2" />
                  رقم الدفعة
                </button>
              </div>

              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={
                    searchType === 'email'
                      ? 'أدخل بريدك الإلكتروني'
                      : searchType === 'orderId'
                      ? 'أدخل رقم الطلب'
                      : 'أدخل رقم الدفعة'
                  }
                  className="w-full px-6 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors text-right"
                  dir="rtl"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    جاري البحث...
                  </span>
                ) : (
                  'بحث عن الطلبات'
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-right">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {searched && !loading && (
          <div className="max-w-4xl mx-auto">
            {orders.length === 0 && !error ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">لم يتم العثور على أي طلبات</p>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 text-right">
                  النتائج ({orders.length})
                </h2>

                {orders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const downloadExpired = isDownloadExpired(order.downloadExpiry);

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

                          {/* Payment Info */}
                          <div className="text-right">
                            <h4 className="text-sm font-semibold text-gray-500 mb-2">
                              معلومات الدفع
                            </h4>
                            <p className="text-2xl font-bold text-purple-600">
                              {order.amount.toFixed(2)} {order.currency}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {order.paymentId}
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
                        {order.downloadUrl && order.status === 'paid' && (
                          <div className="pt-4 border-t border-gray-100">
                            {downloadExpired ? (
                              <div className="text-center p-4 bg-red-50 rounded-lg">
                                <p className="text-red-600 font-medium">
                                  ⚠️ انتهت صلاحية رابط التحميل
                                </p>
                                <p className="text-sm text-red-500 mt-1">
                                  الرجاء التواصل مع الدعم للحصول على رابط جديد
                                </p>
                              </div>
                            ) : (
                              <a
                                href={order.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                              >
                                <Download className="w-5 h-5" />
                                تحميل الإيصال
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        {!searched && (
          <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-right">
              <h3 className="font-bold text-blue-900 mb-2">💡 كيفية البحث</h3>
              <ul className="space-y-2 text-blue-800">
                <li>• استخدم بريدك الإلكتروني الذي استخدمته عند الدفع</li>
                <li>• أو أدخل رقم الطلب الذي حصلت عليه</li>
                <li>• أو أدخل رقم الدفعة من بوابة الدفع</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
