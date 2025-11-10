import { NextRequest, NextResponse } from 'next/server';
import { findOrderById, findOrderBySessionId, findOrderByPaymentId } from '@/lib/orders-store';

/**
 * 🔍 GET /api/orders/[id]
 * 
 * البحث عن طلب باستخدام:
 * - orderId (معرف الطلب الداخلي)
 * - sessionId (المعرف المُنشأ محلياً للـ success URL)
 * - paymentId (معرف الدفع من Ziina)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log('🔍 Looking for order with ID:', id);

    // 1️⃣ محاولة البحث بالـ orderId مباشرة
    let order = await findOrderById(id);
    
    // 2️⃣ إذا لم نجد، نحاول البحث بالـ sessionId
    if (!order) {
      console.log('🔄 Trying to find by sessionId...');
      order = await findOrderBySessionId(id);
    }
    
    // 3️⃣ إذا لم نجد، نحاول البحث بالـ paymentId
    if (!order) {
      console.log('🔄 Trying to find by paymentId...');
      order = await findOrderByPaymentId(id);
    }

    if (!order) {
      console.log('❌ No order found for:', id);
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('✅ Order found:', order.id);
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

