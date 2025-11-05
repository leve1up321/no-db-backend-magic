/**
 * 🗄️ مخزن الطلبات المؤقت في الذاكرة
 * 
 * ملاحظة: هذا المخزن مؤقت ويُفقد عند إعادة تشغيل السيرفر
 * للإنتاج، استخدم قاعدة بيانات فعلية
 */

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  sessionId?: string; // معرف الجلسة المؤقت الذي ننشئه نحن
  paymentId?: string; // معرف الدفع من Ziina بعد نجاح الدفع
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  amount: number;
  currency: string;
  customerEmail?: string;
  customerName?: string;
  items: OrderItem[];
  downloadUrl?: string; // رابط التحميل المباشر من Blob
  createdAt: string;
  paidAt?: string;
  metadata?: any;
}

// 🗂️ تخزين الطلبات في الذاكرة
const ordersStore = new Map<string, Order>();

/**
 * إنشاء طلب جديد
 */
export function createOrder(order: Order): Order {
  ordersStore.set(order.id, order);
  
  // إضافة index بالـ sessionId إذا كان موجود
  if (order.sessionId) {
    ordersStore.set(`session:${order.sessionId}`, order);
  }
  
  // إضافة index بالـ paymentId إذا كان موجود
  if (order.paymentId) {
    ordersStore.set(`payment:${order.paymentId}`, order);
  }
  
  console.log(`📝 Order created: ${order.id} (session: ${order.sessionId}, payment: ${order.paymentId})`);
  return order;
}

/**
 * البحث عن طلب بالـ ID
 */
export function findOrderById(orderId: string): Order | null {
  return ordersStore.get(orderId) || null;
}

/**
 * البحث عن طلب بالـ sessionId
 */
export function findOrderBySessionId(sessionId: string): Order | null {
  const order = ordersStore.get(`session:${sessionId}`);
  console.log(`🔍 Looking for session: ${sessionId}, found:`, !!order);
  return order || null;
}

/**
 * البحث عن طلب بالـ paymentId
 */
export function findOrderByPaymentId(paymentId: string): Order | null {
  const order = ordersStore.get(`payment:${paymentId}`);
  console.log(`🔍 Looking for payment: ${paymentId}, found:`, !!order);
  return order || null;
}

/**
 * تحديث طلب موجود بالـ sessionId
 */
export function updateOrderBySessionId(sessionId: string, updates: Partial<Order>): Order | null {
  const order = findOrderBySessionId(sessionId);
  
  if (!order) {
    console.error(`❌ Order not found for session: ${sessionId}`);
    return null;
  }
  
  const updatedOrder = { ...order, ...updates };
  
  // تحديث في المخزن الرئيسي
  ordersStore.set(order.id, updatedOrder);
  
  // تحديث الـ indexes
  if (updatedOrder.sessionId) {
    ordersStore.set(`session:${updatedOrder.sessionId}`, updatedOrder);
  }
  
  if (updatedOrder.paymentId) {
    ordersStore.set(`payment:${updatedOrder.paymentId}`, updatedOrder);
  }
  
  console.log(`✏️ Order updated for session ${sessionId}: ${order.id}`);
  return updatedOrder;
}

/**
 * تحديث طلب موجود بالـ ID
 */
export function updateOrder(orderId: string, updates: Partial<Order>): Order | null {
  const order = ordersStore.get(orderId);
  
  if (!order) {
    console.error(`❌ Order not found: ${orderId}`);
    return null;
  }
  
  const updatedOrder = { ...order, ...updates };
  ordersStore.set(orderId, updatedOrder);
  
  // تحديث الـ indexes
  if (updatedOrder.sessionId) {
    ordersStore.set(`session:${updatedOrder.sessionId}`, updatedOrder);
  }
  
  if (updatedOrder.paymentId) {
    ordersStore.set(`payment:${updatedOrder.paymentId}`, updatedOrder);
  }
  
  console.log(`✏️ Order updated: ${orderId}`);
  return updatedOrder;
}

/**
 * الحصول على جميع الطلبات
 */
export function getAllOrders(): Order[] {
  const orders: Order[] = [];
  
  for (const [key, value] of ordersStore.entries()) {
    // تجاهل الـ indexes (session: و payment:)
    if (!key.includes(':')) {
      orders.push(value);
    }
  }
  
  return orders.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * الحصول على طلبات عميل معين
 */
export function getOrdersByEmail(email: string): Order[] {
  const allOrders = getAllOrders();
  return allOrders.filter(order => 
    order.customerEmail?.toLowerCase() === email.toLowerCase()
  );
}

/**
 * مسح جميع الطلبات (للتطوير فقط)
 */
export function clearAllOrders(): void {
  ordersStore.clear();
  console.log('🗑️ All orders cleared');
}

