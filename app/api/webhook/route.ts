import { NextRequest, NextResponse } from "next/server";
import { 
  createOrder,
  findOrderByPaymentId 
} from "@/lib/orders-store";
import productsData from "@/data/products.json";

/**
 * 🎯 Ziina Webhook Handler
 * 
 * يستقبل إشعارات الدفع من Ziina ويحفظ الطلب في الذاكرة
 */

export async function POST(req: NextRequest) {
  try {
    console.log("=".repeat(60));
    console.log("🔔 Webhook received at:", new Date().toISOString());
    
    // قراءة البيانات
    const body = await req.json();
    console.log("📦 Webhook payload:", JSON.stringify(body, null, 2));
    
    // استخراج البيانات الأساسية من Ziina
    const paymentId = body.id || body.payment_intent_id;
    const paymentStatus = body.status;
    const amount = body.amount || 0;
    const currency = body.currency_code || body.currency || "AED";
    const customerEmail = body.customer_email || body.email;
    const customerName = body.customer_name || body.name;
    
    console.log(`💳 Payment ID: ${paymentId}`);
    console.log(`📊 Status: ${paymentStatus}`);
    console.log(`💰 Amount: ${amount} ${currency}`);
    console.log(`📧 Email: ${customerEmail}`);
    
    // معالجة حالة نجاح الدفع
    if (paymentStatus === "succeeded" || paymentStatus === "completed" || paymentStatus === "paid") {
      console.log("✅ Payment succeeded!");
      
      // تحقق إذا كان الطلب موجود مسبقاً
      let existingOrder = findOrderByPaymentId(paymentId);
      
      if (existingOrder) {
        console.log("⚠️ Order already exists:", existingOrder.id);
        return NextResponse.json({
          success: true,
          message: "Order already processed",
          orderId: existingOrder.id,
          received: true
        });
      }
      
      // استخراج معلومات السلة من metadata
      let cartItems: any[] = [];
      if (body.metadata?.cartItems) {
        try {
          cartItems = typeof body.metadata.cartItems === 'string' 
            ? JSON.parse(body.metadata.cartItems)
            : body.metadata.cartItems;
          console.log("📦 Cart items:", cartItems);
        } catch (e) {
          console.warn("⚠️ Could not parse cart items from metadata");
        }
      }
      
      // الحصول على رابط التحميل من المنتج الأول
      let downloadUrl = '';
      
      if (cartItems && cartItems.length > 0) {
        const productId = cartItems[0].id;
        const product = productsData.find((p: any) => p.id === productId);
        
        if (product && product.downloadUrl) {
          downloadUrl = product.downloadUrl;
          console.log(`📥 Download URL found: ${downloadUrl}`);
        } else {
          console.warn(`⚠️ No download URL for product: ${productId}`);
        }
      }
      
      // إنشاء الطلب الجديد
      const order = createOrder({
        id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        paymentId: paymentId,
        status: 'paid',
        amount: amount / 100, // تحويل من فلسات إلى دراهم
        currency: currency,
        customerEmail: customerEmail,
        customerName: customerName,
        downloadUrl: downloadUrl,
        items: cartItems.map((item: any) => ({
          id: item.id,
          name: item.name || item.productName,
          quantity: item.quantity || 1,
          price: item.price,
          image: item.image
        })),
        createdAt: new Date().toISOString(),
        paidAt: new Date().toISOString(),
        metadata: {
          webhookData: body
        }
      });
      
      console.log("✅ Order created successfully!");
      console.log(`📝 Order ID: ${order.id}`);
      console.log(`💳 Payment ID: ${order.paymentId}`);
      console.log(`📧 Customer: ${order.customerEmail}`);
      console.log(`📥 Download URL: ${order.downloadUrl}`);
      
      return NextResponse.json({
        success: true,
        message: "Payment processed successfully",
        orderId: order.id,
        received: true
      });
    }
    
    // معالجة حالات الفشل
    if (paymentStatus === "failed" || paymentStatus === "cancelled") {
      console.log("❌ Payment failed or cancelled");
      
      // يمكن إنشاء طلب بحالة failed
      const order = createOrder({
        id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        paymentId: paymentId,
        status: 'failed',
        amount: amount / 100,
        currency: currency,
        customerEmail: customerEmail,
        items: [],
        createdAt: new Date().toISOString()
      });
      
      console.log(`📝 Failed order created: ${order.id}`);
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

