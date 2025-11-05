import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import productsData from "@/data/products.json";

/**
 * 🎯 Ziina Webhook Handler - Dynamic Product Support
 * 
 * يحفظ بيانات الدفع مع معلومات المنتج الكاملة في Blob
 */

export async function POST(req: NextRequest) {
  try {
    console.log("=".repeat(60));
    console.log("🔔 Webhook received at:", new Date().toISOString());
    
    const body = await req.json();
    console.log("📦 Full Webhook payload:", JSON.stringify(body, null, 2));
    
    // استخراج البيانات من body.data
    const data = body.data || body;
    
    const paymentId = data.id || body.id;
    const paymentStatus = data.status || body.status;
    const amount = data.amount || body.amount || 0;
    const currency = data.currency_code || data.currency || body.currency_code || "AED";
    const customerEmail = data.customer_email || data.email || body.customer_email;
    const customerName = data.customer_name || data.name || body.customer_name;
    const message = data.message || body.message || "";
    
    console.log("=".repeat(60));
    console.log("📊 Payment Info:");
    console.log(`💳 Payment ID: ${paymentId}`);
    console.log(`📊 Status: ${paymentStatus}`);
    console.log(`💰 Amount: ${amount} fils (${amount / 100} ${currency})`);
    console.log(`📧 Customer: ${customerEmail}`);
    console.log("=".repeat(60));
    
    // معالجة الدفع الناجح
    if (paymentStatus === "succeeded" || paymentStatus === "completed" || paymentStatus === "paid") {
      console.log("✅ Payment succeeded! Processing order...");
      
      const metadata = data.metadata || body.metadata || {};
      const cartItems = metadata.cartItems 
        ? (typeof metadata.cartItems === 'string' ? JSON.parse(metadata.cartItems) : metadata.cartItems)
        : [];
      
      console.log("📦 Cart items:", cartItems);
      
      if (cartItems.length === 0) {
        console.warn("⚠️ No cart items found, using default product");
        cartItems.push({
          id: 1,
          name: "15 فكرة مشروع رقمي مربح",
          price: 55.50,
          quantity: 1,
          image: "/images/products/15-project-ideas.png"
        });
      }
      
      // معالجة كل منتج في السلة
      const orderItems = cartItems.map((item: any) => {
        const product = productsData.find((p: any) => p.id === item.id);
        
        return {
          product_id: item.id,
          product_name: item.name || item.productName || product?.name || "منتج رقمي",
          product_image: item.image || product?.image || "/images/products/default.png",
          quantity: item.quantity || 1,
          price: item.price || product?.priceAED || 0,
          download_url: product?.downloadUrl || "",
          notes: product?.shortDescription || ""
        };
      });
      
      console.log("📦 Processed order items:", orderItems);
      
      // إعداد بيانات الطلب الكاملة
      const orderData = {
        payment_id: paymentId,
        order_number: `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        status: "completed",
        
        // بيانات العميل
        customer: {
          name: customerName || "عميل",
          email: customerEmail || "",
        },
        
        // بيانات الدفع
        payment: {
          amount: amount / 100,
          currency: currency,
          method: "Ziina",
          message: message,
          paid_at: new Date().toISOString(),
        },
        
        // المنتجات
        items: orderItems,
        
        // المجاميع
        totals: {
          subtotal: orderItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0),
          tax: 0,
          total: amount / 100,
        },
        
        // بيانات إضافية
        created_at: new Date().toISOString(),
        webhook_data: data,
      };
      
      console.log("💾 Saving order to Blob Storage...");
      console.log("📄 Order data:", JSON.stringify(orderData, null, 2));
      
      try {
        // حفظ في Blob
        const blobFilename = `orders/${paymentId}.json`;
        
        const blob = await put(blobFilename, JSON.stringify(orderData, null, 2), {
          access: 'public',
          contentType: 'application/json',
        });
        
        console.log("=".repeat(60));
        console.log("✅ Order saved successfully!");
        console.log(`📁 Blob URL: ${blob.url}`);
        console.log(`✅ Payment saved: ${paymentId}`);
        console.log(`📦 Order Number: ${orderData.order_number}`);
        console.log(`🛍️ Products: ${orderData.items.length}`);
        console.log("=".repeat(60));
        
        return NextResponse.json({
          success: true,
          message: "Order processed successfully",
          payment_id: paymentId,
          order_number: orderData.order_number,
          blob_url: blob.url,
          items_count: orderData.items.length,
          total: orderData.totals.total,
          currency: orderData.payment.currency,
          received: true
        });
        
      } catch (blobError: any) {
        console.error("❌ Blob Storage error:", blobError);
        
        return NextResponse.json({
          success: true,
          message: "Payment processed but storage failed",
          error: blobError.message,
          payment_id: paymentId,
          received: true
        });
      }
    }
    
    // حالات أخرى
    if (paymentStatus === "failed" || paymentStatus === "cancelled") {
      console.log("❌ Payment failed or cancelled");
    }
    
    return NextResponse.json({
      received: true,
      status: paymentStatus,
      message: "Webhook received"
    });
    
  } catch (error: any) {
    console.error("💥 Webhook error:", error);
    console.error("Stack:", error.stack);
    
    return NextResponse.json({
      error: "Webhook processing failed",
      message: error.message,
      received: true
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Ziina Webhook Endpoint",
    status: "active",
    timestamp: new Date().toISOString()
  });
}

