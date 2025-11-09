/**
 * 🗄️ مخزن الطلبات باستخدام Vercel KV (Redis)
 * 
 * يستخدم Redis بدلاً من memory لضمان بقاء البيانات
 * في بيئة serverless functions
 */

import { kv } from '@vercel/kv';

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  downloadUrl?: string; // ✨ رابط التحميل الخاص بالمنتج
}

export interface Order {
  id: string;
  sessionId?: string; // معرف الجلسة المؤقت الذي ننشئه نحن
  paymentId?: string; // معرف الدفع من Ziina بعد نجاح الدفع
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'completed';
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

// 🗂️ fallback: تخزين مؤقت في الذاكرة للتطوير المحلي
const ordersStore = new Map<string, Order>();

// 🔧 helper: التحقق من توفر KV
const isKVAvailable = () => {
  return process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
};

/**
 * إنشاء طلب جديد
 */
export async function createOrder(order: Order): Promise<Order> {
  if (isKVAvailable()) {
    try {
      // حفظ في Redis
      await kv.set(`order:${order.id}`, JSON.stringify(order));
      
      // إضافة index بالـ sessionId إذا كان موجود
      if (order.sessionId) {
        await kv.set(`session:${order.sessionId}`, order.id);
        console.log(`📝 Redis index created: session:${order.sessionId} -> ${order.id}`);
      }
      
      // إضافة index بالـ paymentId إذا كان موجود
      if (order.paymentId) {
        await kv.set(`payment:${order.paymentId}`, order.id);
      }
      
      // Set expiry: 7 days for orders
      await kv.expire(`order:${order.id}`, 60 * 60 * 24 * 7);
      
      console.log(`📝 Order created in Redis: ${order.id} (session: ${order.sessionId})`);
      return order;
    } catch (error) {
      console.error('❌ KV Error, falling back to memory:', error);
      // Fallback to memory
    }
  }
  
  // Fallback: حفظ في memory (للتطوير المحلي)
  ordersStore.set(order.id, order);
  
  if (order.sessionId) {
    ordersStore.set(`session:${order.sessionId}`, order);
  }
  
  if (order.paymentId) {
    ordersStore.set(`payment:${order.paymentId}`, order);
  }
  
  console.log(`📝 Order created in memory: ${order.id} (session: ${order.sessionId})`);
  return order;
}

/**
 * البحث عن طلب بالـ ID
 */
export async function findOrderById(orderId: string): Promise<Order | null> {
  if (isKVAvailable()) {
    try {
      const orderJson = await kv.get<string>(`order:${orderId}`);
      
      if (!orderJson) {
        console.log(`🔍 No order found in Redis for ID: ${orderId}`);
        return null;
      }
      
      const order = JSON.parse(orderJson);
      console.log(`✅ Order found in Redis by ID: ${order.id}`);
      return order;
    } catch (error) {
      console.error('❌ KV Error during findById, falling back to memory:', error);
      // Fallback to memory
    }
  }
  
  // Fallback: البحث في memory
  return ordersStore.get(orderId) || null;
}

/**
 * البحث عن طلب بالـ sessionId
 */
export async function findOrderBySessionId(sessionId: string): Promise<Order | null> {
  if (isKVAvailable()) {
    try {
      // البحث في Redis
      const orderId = await kv.get<string>(`session:${sessionId}`);
      console.log(`🔍 Redis lookup for session: ${sessionId}, found orderId:`, orderId);
      
      if (!orderId) {
        console.log(`❌ No order ID found for session: ${sessionId}`);
        return null;
      }
      
      const orderJson = await kv.get<string>(`order:${orderId}`);
      
      if (!orderJson) {
        console.log(`❌ No order data found for ID: ${orderId}`);
        return null;
      }
      
      const order = JSON.parse(orderJson);
      console.log(`✅ Order found in Redis: ${order.id}, email: ${order.customerEmail}`);
      return order;
    } catch (error) {
      console.error('❌ KV Error during lookup, falling back to memory:', error);
      // Fallback to memory
    }
  }
  
  // Fallback: البحث في memory
  const order = ordersStore.get(`session:${sessionId}`);
  console.log(`🔍 Memory lookup for session: ${sessionId}, found:`, !!order);
  return order || null;
}

/**
 * البحث عن طلب بالـ paymentId
 */
export async function findOrderByPaymentId(paymentId: string): Promise<Order | null> {
  if (isKVAvailable()) {
    try {
      const orderId = await kv.get<string>(`payment:${paymentId}`);
      console.log(`🔍 Redis lookup for payment: ${paymentId}, found orderId:`, orderId);
      
      if (!orderId) {
        return null;
      }
      
      const orderJson = await kv.get<string>(`order:${orderId}`);
      if (!orderJson) return null;
      
      const order = JSON.parse(orderJson);
      console.log(`✅ Order found by payment ID in Redis: ${order.id}`);
      return order;
    } catch (error) {
      console.error('❌ KV Error during payment lookup, falling back to memory:', error);
    }
  }
  
  // Fallback: البحث في memory
  const order = ordersStore.get(`payment:${paymentId}`);
  console.log(`🔍 Memory lookup for payment: ${paymentId}, found:`, !!order);
  return order || null;
}

/**
 * تحديث طلب موجود بالـ sessionId
 */
export async function updateOrderBySessionId(sessionId: string, updates: Partial<Order>): Promise<Order | null> {
  const order = await findOrderBySessionId(sessionId);
  
  if (!order) {
    console.error(`❌ Order not found for session: ${sessionId}`);
    return null;
  }
  
  // استخدام updateOrder بدلاً من التحديث المباشر
  return await updateOrder(order.id, updates);
}

/**
 * تحديث طلب موجود بالـ ID
 */
export async function updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
  if (isKVAvailable()) {
    try {
      // جلب الطلب من Redis
      const orderJson = await kv.get<string>(`order:${orderId}`);
      
      if (!orderJson) {
        console.error(`❌ Order not found in Redis: ${orderId}`);
        return null;
      }
      
      const order = JSON.parse(orderJson);
      const updatedOrder = { ...order, ...updates };
      
      // تحديث في Redis
      await kv.set(`order:${orderId}`, JSON.stringify(updatedOrder));
      
      // تحديث الـ indexes إذا تغيرت
      if (updatedOrder.sessionId) {
        await kv.set(`session:${updatedOrder.sessionId}`, orderId);
      }
      
      if (updatedOrder.paymentId) {
        await kv.set(`payment:${updatedOrder.paymentId}`, orderId);
      }
      
      console.log(`✏️ Order updated in Redis: ${orderId}, status: ${updatedOrder.status}`);
      return updatedOrder;
    } catch (error) {
      console.error('❌ KV Error during update, falling back to memory:', error);
      // Fallback to memory
    }
  }
  
  // Fallback: تحديث في memory
  const order = ordersStore.get(orderId);
  
  if (!order) {
    console.error(`❌ Order not found in memory: ${orderId}`);
    return null;
  }
  
  const updatedOrder = { ...order, ...updates };
  ordersStore.set(orderId, updatedOrder);
  
  if (updatedOrder.sessionId) {
    ordersStore.set(`session:${updatedOrder.sessionId}`, updatedOrder);
  }
  
  if (updatedOrder.paymentId) {
    ordersStore.set(`payment:${updatedOrder.paymentId}`, updatedOrder);
  }
  
  console.log(`✏️ Order updated in memory: ${orderId}`);
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
