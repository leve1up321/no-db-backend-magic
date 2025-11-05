import { NextRequest, NextResponse } from "next/server";
import { 
  findOrderBySessionId, 
  updateOrderBySessionId 
} from "@/lib/orders-store";
import productsData from "@/data/products.json";

/**
 * 🎯 Ziina Webhook Handler
 * 
 * يستقبل إشعارات الدفع من Ziina ويحدّث حالة الطلب
 */

export async function POST(req: NextRequest) {
  try {
    console.log("=".repeat(60));
    console.log("🔔 Webhook received at:", new Date().toISOString());
    
    // قراءة البيانات
    const body = await req.json();
    console.log("📦 Webhook payload:", JSON.stringify(body, null, 2));
    
    // استخراج البيانات الأساسية
    const paymentId = body.id || body.payment_intent_id;
    const paymentStatus = body.status;
    const amount = body.amount || 0;
    const currency = body.currency_code || body.currency || "AED";
    const customerEmail = body.customer_email || body.email;
    const customerName = body.customer_name || body.name;
    
    console.log(`💳 Payment ID: ${paymentId}`);
    console.log(`📊 Status: ${paymentStatus}`);
    console.log(`💰 Amount: ${amount} ${currency}`);
    
    // استخراج sessionId من metadata
    const sessionId = body.metadata?.sessionId;
    console.log(`🆔 Session ID from metadata: ${sessionId}`);
    
    // معالجة حالة نجاح الدفع
    if (paymentStatus === "succeeded" || paymentStatus === "completed" || paymentStatus === "paid") {
      console.log("✅ Payment succeeded!");
      
      if (!sessionId) {
        console.error("❌ No session ID in metadata!");
        return NextResponse.json({
          error: "No session ID provided",
          received: true
        }, { status: 400 });
      }
      
      // البحث عن الطلب بالـ session ID
      let order = findOrderBySessionId(sessionId);
      
      if (!order) {
        console.error(`❌ Order not found for session: ${sessionId}`);
        return NextResponse.json({
          error: "Order not found",
          sessionId: sessionId,
          received: true
        }, { status: 404 });
      }
      
      console.log(`📦 Found order: ${order.id}`);
      
      // الحصول على رابط التحميل من المنتج
      let downloadUrl = '';
      
      if (order.items && order.items.length > 0) {
        const productId = order.items[0].id;
        const product = productsData.find((p: any) => p.id === productId);
        
        if (product && product.downloadUrl) {
          downloadUrl = product.downloadUrl;
          console.log(`📥 Download URL found: ${downloadUrl}`);
        } else {
          console.warn(`⚠️ No download URL for product: ${productId}`);
        }
      }
      
      // تحديث الطلب
      const updatedOrder = updateOrderBySessionId(sessionId, {
        paymentId: paymentId,
        status: 'paid',
        customerEmail: customerEmail,
        customerName: customerName,
        downloadUrl: downloadUrl,
        paidAt: new Date().toISOString(),
        metadata: {
          ...order.metadata,
          webhookData: body
        }
      });
      
      if (updatedOrder) {
        console.log("✅ Order updated successfully!");
        console.log(`📝 Order ID: ${updatedOrder.id}`);
        console.log(`💳 Payment ID: ${updatedOrder.paymentId}`);
        console.log(`📧 Customer: ${updatedOrder.customerEmail}`);
        console.log(`📥 Download URL: ${updatedOrder.downloadUrl}`);
      }
      
      return NextResponse.json({
        success: true,
        message: "Payment processed successfully",
        orderId: updatedOrder?.id,
        received: true
      });
    }
    
    // معالجة حالات الفشل
    if (paymentStatus === "failed" || paymentStatus === "cancelled") {
      console.log("❌ Payment failed or cancelled");
      
      if (sessionId) {
        updateOrderBySessionId(sessionId, {
          status: 'failed',
          paymentId: paymentId
        });
      }
    }
    
    // رد عام لجميع الحالات الأخرى
    return NextResponse.json({
      received: true,
      status: paymentStatus
    });
    
  } catch (error: any) {
    console.error("💥 Webhook error:");
    console.error(error);
    
    return NextResponse.json({
      error: "Webhook processing failed",
      message: error.message,
      received: true
    }, { status: 500 });
  }
}

// دعم GET للاختبار
export async function GET() {
  return NextResponse.json({
    message: "Ziina Webhook Endpoint",
    status: "active",
    timestamp: new Date().toISOString()
  });
}

