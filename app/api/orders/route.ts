import { NextRequest, NextResponse } from "next/server";
import { 
  getOrdersByEmail, 
  findOrderById, 
  findOrderByPaymentId 
} from "@/lib/database";

/**
 * 🔍 API للبحث عن الطلبات
 * 
 * الاستخدام:
 * GET /api/orders?email=customer@example.com
 * GET /api/orders?orderId=order_123
 * GET /api/orders?paymentId=pi_xxx
 */

// ✅ إجبار Next.js على معاملة هذا الـ route كـ dynamic
// لأنه يستخدم search params
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // استخدام req.nextUrl بدلاً من req.url لتجنب مشكلة Dynamic server usage
    const searchParams = req.nextUrl.searchParams;
    
    const email = searchParams.get("email");
    const orderId = searchParams.get("orderId");
    const paymentId = searchParams.get("paymentId");

    // البحث بالبريد الإلكتروني
    if (email) {
      const orders = getOrdersByEmail(email);
      
      if (orders.length === 0) {
        return NextResponse.json({
          success: false,
          message: "لا توجد طلبات لهذا البريد الإلكتروني",
          orders: []
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `تم العثور على ${orders.length} طلب`,
        orders: orders
      });
    }

    // البحث برقم الطلب
    if (orderId) {
      const order = await findOrderById(orderId);
      
      if (!order) {
        return NextResponse.json({
          success: false,
          message: "الطلب غير موجود"
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: "تم العثور على الطلب",
        order: order
      });
    }

    // البحث برقم الدفعة
    if (paymentId) {
      const order = await findOrderByPaymentId(paymentId);
      
      if (!order) {
        return NextResponse.json({
          success: false,
          message: "الطلب غير موجود"
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: "تم العثور على الطلب",
        order: order
      });
    }

    // إذا لم يتم تقديم أي معامل بحث
    return NextResponse.json({
      success: false,
      message: "الرجاء تقديم email أو orderId أو paymentId للبحث"
    }, { status: 400 });

  } catch (error: any) {
    console.error("❌ Error searching orders:", error);
    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء البحث",
      error: error.message
    }, { status: 500 });
  }
}
