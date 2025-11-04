import fs from 'fs';
import path from 'path';

/**
 * 💾 نظام قاعدة بيانات بسيطة باستخدام JSON
 * 
 * يحفظ الطلبات في ملف orders.json
 * مناسب للمشاريع الصغيرة والمتوسطة
 */

export interface Order {
  id: string;
  paymentId: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  amount: number;
  currency: string;
  customerEmail?: string;
  customerName?: string;
  items: Array<{
    id: string | number;
    name: string;
    price: number;
    quantity: number;
  }>;
  downloadUrl?: string;
  downloadExpiry?: number;
  createdAt: string;
  paidAt?: string;
  metadata?: Record<string, any>;
}

const DB_PATH = path.join(process.cwd(), 'data', 'orders.json');

/**
 * قراءة جميع الطلبات من قاعدة البيانات
 */
export function getAllOrders(): Order[] {
  try {
    if (!fs.existsSync(DB_PATH)) {
      // إنشاء الملف إذا لم يكن موجودًا
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
      return [];
    }
    
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data) as Order[];
  } catch (error) {
    console.error('❌ Error reading orders:', error);
    return [];
  }
}

/**
 * حفظ جميع الطلبات إلى قاعدة البيانات
 */
function saveAllOrders(orders: Order[]): void {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error('❌ Error saving orders:', error);
    throw error;
  }
}

/**
 * إنشاء طلب جديد
 */
export function createOrder(order: Order): Order {
  const orders = getAllOrders();
  orders.push(order);
  saveAllOrders(orders);
  console.log('✅ Order created:', order.id);
  return order;
}

/**
 * البحث عن طلب بواسطة payment ID
 */
export function findOrderByPaymentId(paymentId: string): Order | undefined {
  const orders = getAllOrders();
  return orders.find(order => order.paymentId === paymentId);
}

/**
 * البحث عن طلب بواسطة ID
 */
export function findOrderById(id: string): Order | undefined {
  const orders = getAllOrders();
  return orders.find(order => order.id === id);
}

/**
 * تحديث طلب موجود
 */
export function updateOrder(orderId: string, updates: Partial<Order>): Order | null {
  const orders = getAllOrders();
  const index = orders.findIndex(order => order.id === orderId);
  
  if (index === -1) {
    console.error('❌ Order not found:', orderId);
    return null;
  }
  
  orders[index] = { ...orders[index], ...updates };
  saveAllOrders(orders);
  console.log('✅ Order updated:', orderId);
  return orders[index];
}

/**
 * تحديث طلب بواسطة payment ID
 */
export function updateOrderByPaymentId(paymentId: string, updates: Partial<Order>): Order | null {
  const orders = getAllOrders();
  const index = orders.findIndex(order => order.paymentId === paymentId);
  
  if (index === -1) {
    console.error('❌ Order not found with payment ID:', paymentId);
    return null;
  }
  
  orders[index] = { ...orders[index], ...updates };
  saveAllOrders(orders);
  console.log('✅ Order updated by payment ID:', paymentId);
  return orders[index];
}

/**
 * حذف طلب
 */
export function deleteOrder(orderId: string): boolean {
  const orders = getAllOrders();
  const filtered = orders.filter(order => order.id !== orderId);
  
  if (filtered.length === orders.length) {
    console.error('❌ Order not found:', orderId);
    return false;
  }
  
  saveAllOrders(filtered);
  console.log('✅ Order deleted:', orderId);
  return true;
}

/**
 * الحصول على الطلبات حسب الحالة
 */
export function getOrdersByStatus(status: Order['status']): Order[] {
  const orders = getAllOrders();
  return orders.filter(order => order.status === status);
}

/**
 * الحصول على الطلبات حسب البريد الإلكتروني
 */
export function getOrdersByEmail(email: string): Order[] {
  const orders = getAllOrders();
  return orders.filter(order => order.customerEmail === email);
}

