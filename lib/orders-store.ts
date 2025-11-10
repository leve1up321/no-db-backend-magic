/**
 * 🗄️ مخزن الطلبات باستخدام Upstash Redis
 * 
 * يستخدم Redis بدلاً من memory لضمان بقاء البيانات
 * في بيئة serverless functions
 * 
 * يتصل تلقائياً باستخدام متغيرات البيئة:
 * - KV_REST_API_URL
 * - KV_REST_API_TOKEN
 */

import { Redis } from '@upstash/redis';

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

// 🔧 helper: التحقق من توفر Redis
const isRedisAvailable = () => {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
};

// 🔧 إنشاء اتصال Redis (lazy initialization)
let redis: Redis | null = null;
const getRedis = () => {
  if (!redis && isRedisAvailable()) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
  }
  return redis;
};

/**
 * 💾 حفظ طلب جديد في Redis
 * 
 * يُستخدم عند إنشاء payment intent قبل الدفع
 * لحفظ معلومات الطلب مؤقتاً
 */
export async function saveOrder(order: Order): Promise<Order> {
  if (isRedisAvailable()) {
    try {
      // حفظ في Redis
      await getRedis()?.set(`order:${order.id}`, JSON.stringify(order));
      
      // إضافة index بالـ sessionId إذا كان موجود
      if (order.sessionId) {
        await getRedis()?.set(`session:${order.sessionId}`, order.id);
      }
      
      // إضافة index بالـ paymentId إذا كان موجود
      if (order.paymentId) {
        await getRedis()?.set(`payment:${order.paymentId}`, order.id);
      }
      
      // Set expiry: 7 days for orders
      await getRedis()?.expire(`order:${order.id}`, 60 * 60 * 24 * 7);
      
      console.log(`💾 Order saved to Redis: ${order.id}`);
      console.log(`📧 Customer: ${order.customerEmail}`);
      console.log(`📦 Items: ${order.items?.length || 0} product(s)`);
      return order;
    } catch (error) {
      console.error('❌ Redis Error, falling back to memory:', error);
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
  
  console.log(`💾 Order saved to memory: ${order.id}`);
  return order;
}

/**
 * إنشاء طلب جديد (alias for saveOrder)
 */
export async function createOrder(order: Order): Promise<Order> {
  return saveOrder(order);
}

/**
 * 🔍 البحث عن طلب بالـ ID
 */
export async function findOrderById(orderId: string): Promise<Order | null> {
  if (isRedisAvailable()) {
    try {
      const orderJson = await getRedis()?.get<string>(`order:${orderId}`);
      
      if (!orderJson) {
        console.log(`🔍 No order found in Redis for ID: ${orderId}`);
        return null;
      }
      
      const order = typeof orderJson === 'string' ? JSON.parse(orderJson) : orderJson;
      console.log(`✅ Order found in Redis by ID: ${order.id}`);
      return order;
    } catch (error) {
      console.error('❌ Redis Error during findById, falling back to memory:', error);
      // Fallback to memory
    }
  }
  
  // Fallback: البحث في memory
  return ordersStore.get(orderId) || null;
}

/**
 * 🔍 البحث عن طلب بالـ sessionId
 * 
 * يُستخدم في webhook للبحث عن الطلب بعد الدفع
 */
export async function findOrderBySessionId(sessionId: string): Promise<Order | null> {
  console.log(`🔍 Searching for order with session: ${sessionId}`);
  
  if (isRedisAvailable()) {
    try {
      // البحث في Redis
      const orderId = await getRedis()?.get<string>(`session:${sessionId}`);
      
      if (!orderId) {
        console.log(`❌ No order ID found for session: ${sessionId}`);
        return null;
      }
      
      const orderJson = await getRedis()?.get<string>(`order:${orderId}`);
      
      if (!orderJson) {
        console.log(`❌ No order data found for ID: ${orderId}`);
        return null;
      }
      
      const order = typeof orderJson === 'string' ? JSON.parse(orderJson) : orderJson;
      console.log(`✅ Order found in Redis: ${order.id}`);
      console.log(`📧 Customer: ${order.customerEmail}`);
      return order;
    } catch (error) {
      console.error('❌ Redis Error during lookup, falling back to memory:', error);
      // Fallback to memory
    }
  }
  
  // Fallback: البحث في memory
  const order = ordersStore.get(`session:${sessionId}`);
  console.log(`🔍 Memory lookup for session: ${sessionId}, found:`, !!order);
  return order || null;
}

/**
 * 🔍 البحث عن طلب بالـ paymentId
 * 
 * يُستخدم في webhook للبحث عن الطلب بعد الدفع من Ziina
 */
export async function findOrderByPaymentId(paymentId: string): Promise<Order | null> {
  console.log(`🔍 Searching for order with payment ID: ${paymentId}`);
  
  if (isRedisAvailable()) {
    try {
      const orderId = await getRedis()?.get<string>(`payment:${paymentId}`);
      
      if (!orderId) {
        console.log(`ℹ️ No order found for payment ID: ${paymentId}`);
        return null;
      }
      
      const orderJson = await getRedis()?.get<string>(`order:${orderId}`);
      if (!orderJson) return null;
      
      const order = typeof orderJson === 'string' ? JSON.parse(orderJson) : orderJson;
      console.log(`✅ Order found by payment ID in Redis: ${order.id}`);
      return order;
    } catch (error) {
      console.error('❌ Redis Error during payment lookup, falling back to memory:', error);
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
 * 🟢 تحديث طلب موجود بالـ ID
 * 
 * يُستخدم في webhook لتحديث حالة الطلب بعد الدفع
 */
export async function updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
  if (isRedisAvailable()) {
    try {
      // جلب الطلب من Redis
      const orderJson = await getRedis()?.get<string>(`order:${orderId}`);
      
      if (!orderJson) {
        console.error(`❌ Order not found in Redis: ${orderId}`);
        return null;
      }
      
      const order = typeof orderJson === 'string' ? JSON.parse(orderJson) : orderJson;
      const updatedOrder = { ...order, ...updates };
      
      // تحديث في Redis
      await getRedis()?.set(`order:${orderId}`, JSON.stringify(updatedOrder));
      
      // تحديث الـ indexes إذا تغيرت
      if (updatedOrder.sessionId) {
        await getRedis()?.set(`session:${updatedOrder.sessionId}`, orderId);
      }
      
      if (updatedOrder.paymentId) {
        await getRedis()?.set(`payment:${updatedOrder.paymentId}`, orderId);
      }
      
      console.log(`🟢 Order updated: ${orderId}`);
      console.log(`📊 Status: ${order.status} → ${updatedOrder.status}`);
      return updatedOrder;
    } catch (error) {
      console.error('❌ Redis Error during update, falling back to memory:', error);
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
  
  console.log(`🟢 Order updated in memory: ${orderId}`);
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
