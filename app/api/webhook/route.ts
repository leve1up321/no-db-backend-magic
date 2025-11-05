import { NextRequest, NextResponse } from "next/server";
import { 
  findOrderBySessionId,
  updateOrderBySessionId,
  createOrder 
} from "@/lib/orders-store";
import productsData from "@/data/products.json";

/**
 * 🎯 Ziina Webhook Handler
 * 
 * يستقبل إشعارات الدفع من Ziina ويربط tracking token بـ payment_intent
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
    
    // استخراج tracking token من metadata
    const trackingToken = body.metadata?.trackingToken;
    console.log(`🎫 Tracking Token: ${trackingToken}`);
    
    // معالجة حالة نجاح الدفع
    if (paymentStatus === "succeeded" || paymentStatus === "completed" || paymentStatus === "paid") {
      console.log("✅ Payment succeeded!");
      
      if (!trackingToken) {
        console.error("❌ No tracking token in metadata!");
        
        // إنشاء طلب جديد بدون tracking token (fallback)
        const cartItems = body.metadata?.cartItems 
          ? JSON.parse(body.metadata.cartItems) 
          : [];
        
        let downloadUrl = '';
        if (cartItems.length > 0) {
          const product = productsData.find((p: any) => p.id === cartItems[0].id);
          if (product) downloadUrl = product.downloadUrl || '';
        }
        
        const newOrder = createOrder({
          id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          paymentId: paymentId,
          status: 'paid',
          amount: amount / 100,
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
          paidAt: new Date().toISOString()
        });
        
        console.log("⚠️ Created order without tracking token:", newOrder.id);
        
        return NextResponse.json({
          success: true,
          message: "Payment processed (no tracking token)",
          orderId: newOrder.id,
          received: true
        });
      }
      
      // البحث عن الطلب المؤقت بـ tracking token
      let order = findOrderBySessionId(trackingToken);
      
      if (!order) {
        console.error(`❌ Order not found for tracking token: ${trackingToken}`);
        
        // إنشاء طلب جديد كـ fallback
        const cartItems = body.metadata?.cartItems 
          ? JSON.parse(body.metadata.cartItems) 
          : [];
        
        let downloadUrl = '';
        if (cartItems.length > 0) {
          const product = productsData.find((p: any) => p.id === cartItems[0].id);
          if (product) downloadUrl = product.downloadUrl || '';
        }
        
        order = createOrder({
          id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          sessionId: trackingToken,
          paymentId: paymentId,
          status: 'paid',
          amount: amount / 100,
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
          paidAt: new Date().toISOString()
        });
        
        console.log("⚠️ Created new order:", order.id);
      } else {
        console.log(`📦 Found existing order: ${order.id}`);
        
        // الحصول على رابط التحميل من المنتج الأول
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
        
        // تحديث الطلب المؤقت مع بيانات الدفع الفعلية
        const updatedOrder = updateOrderBySessionId(trackingToken, {
          paymentId: paymentId,
          status: 'paid',
          amount: amount / 100, // تحويل من فلسات
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
          order = updatedOrder;
          console.log("✅ Order updated successfully!");
        }
      }
      
      console.log(`📝 Final Order ID: ${order.id}`);
      console.log(`💳 Payment ID: ${order.paymentId}`);
      console.log(`🎫 Tracking Token: ${trackingToken}`);
      console.log(`📧 Customer: ${order.customerEmail}`);
      console.log(`📥 Download URL: ${order.downloadUrl}`);
      
      return NextResponse.json({
        success: true,
        message: "Payment processed successfully",
        orderId: order.id,
        trackingToken: trackingToken,
        received: true
      });
    }
    
    // معالجة حالات الفشل
    if (paymentStatus === "failed" || paymentStatus === "cancelled") {
      console.log("❌ Payment failed or cancelled");
      
      if (trackingToken) {
        const order = findOrderBySessionId(trackingToken);
        if (order) {
          updateOrderBySessionId(trackingToken, {
            status: 'failed',
            paymentId: paymentId
          });
          console.log(`📝 Order marked as failed: ${order.id}`);
        }
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

