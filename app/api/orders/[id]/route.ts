import { NextRequest, NextResponse } from "next/server";
import { 
  findOrderById, 
  findOrderBySessionId, 
  findOrderByPaymentId 
} from "@/lib/orders-store";

/**
 * 🔍 API للبحث عن طلب معين
 * 
 * يدعم البحث بـ:
 * - Order ID: /api/orders/order_xxx
 * - Session ID: /api/orders/session_xxx
 * - Payment ID: /api/orders/pi_xxx
 */

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log(`🔍 Looking for order: ${id}`);
    
    let order = null;
    
    // تحديد نوع المعرف والبحث المناسب
    if (id.startsWith('session_')) {
      order = await findOrderBySessionId(id);
    } else if (id.startsWith('pi_') || id.startsWith('payment_')) {
      order = await findOrderByPaymentId(id);
    } else if (id.startsWith('order_')) {
      order = await findOrderById(id);
    } else {
      // محاولة البحث بجميع الطرق
      order = await findOrderById(id) || 
              await findOrderBySessionId(id) || 
              await findOrderByPaymentId(id);
    }
    
    if (!order) {
      console.log(`❌ Order not found: ${id}`);
      return NextResponse.json({
        success: false,
        message: "الطلب غير موجود",
        error: "ORDER_NOT_FOUND"
      }, { status: 404 });
    }
    
    console.log(`✅ Order found: ${order.id}`);
    
    return NextResponse.json({
      success: true,
      order: order
    });
    
  } catch (error: any) {
    console.error("❌ Error fetching order:", error);
    
    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء جلب الطلب",
      error: error.message
    }, { status: 500 });
  }
}
