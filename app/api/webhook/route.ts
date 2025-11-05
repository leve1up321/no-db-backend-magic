import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import productsData from "@/data/products.json";

/**
 * 🎯 Ziina Webhook Handler with Vercel Blob Storage
 * 
 * يستقبل إشعارات الدفع من Ziina ويحفظها في Vercel Blob
 * لا يعتمد على tokens - كل دفع يُحفظ بشكل منفصل
 */

export async function POST(req: NextRequest) {
  try {
    console.log("=".repeat(60));
    console.log("🔔 Webhook received at:", new Date().toISOString());
    
    // قراءة البيانات
    const body = await req.json();
    console.log("📦 Full Webhook payload:", JSON.stringify(body, null, 2));
    
    // ⚠️ CRITICAL: Ziina ترسل البيانات في body.data وليس body مباشرة!
    const data = body.data || body;
    
    console.log("📦 Extracted data:", JSON.stringify(data, null, 2));
    
    // استخراج البيانات الأساسية من Ziina
    const paymentId = data.id || body.id;
    const paymentStatus = data.status || body.status;
    const amount = data.amount || body.amount || 0;
    const currency = data.currency_code || data.currency || body.currency_code || body.currency || "AED";
    const customerEmail = data.customer_email || data.email || body.customer_email || body.email;
    const customerName = data.customer_name || data.name || body.customer_name || body.name;
    const message = data.message || body.message || "";
    
    console.log("=".repeat(60));
    console.log("📊 Extracted Payment Info:");
    console.log(`💳 Payment ID: ${paymentId}`);
    console.log(`📊 Status: ${paymentStatus}`);
    console.log(`💰 Amount: ${amount} fils (${amount / 100} ${currency})`);
    console.log(`📧 Email: ${customerEmail}`);
    console.log(`👤 Name: ${customerName}`);
    console.log(`💬 Message: ${message}`);
    console.log("=".repeat(60));
    
    // معالجة حالة نجاح الدفع
    if (paymentStatus === "succeeded" || paymentStatus === "completed" || paymentStatus === "paid") {
      console.log("✅ Payment succeeded! Processing...");
      
      // استخراج معلومات السلة من metadata
      const metadata = data.metadata || body.metadata || {};
      const cartItems = metadata.cartItems 
        ? (typeof metadata.cartItems === 'string' ? JSON.parse(metadata.cartItems) : metadata.cartItems)
        : [];
      
      console.log("📦 Cart items:", cartItems);
      
      // الحصول على رابط التحميل من المنتج الأول
      let downloadUrl = '';
      let productName = '';
      
      if (cartItems.length > 0) {
        const productId = cartItems[0].id;
        const product = productsData.find((p: any) => p.id === productId);
        
        if (product && product.downloadUrl) {
          downloadUrl = product.downloadUrl;
          productName = product.name;
          console.log(`📥 Download URL found: ${downloadUrl}`);
          console.log(`📦 Product: ${productName}`);
        } else {
          console.warn(`⚠️ No download URL for product: ${productId}`);
          // استخدام رابط افتراضي
          downloadUrl = "https://cix55jnodh8jj42w.public.blob.vercel-storage.com/15%D9%81%D9%83%D8%B1%D8%A9%20%D9%85%D8%B4%D8%B1%D9%88%D8%B9%20%D8%B1%D9%82%D9%85%D9%8A%20%D9%85%D8%B1%D8%A8%D8%AD%20%D9%8A%D9%85%D9%83%D9%86%D9%83%20%D8%A7%D9%84%D8%A8%D8%AF%D8%A1%20%D8%A8%D9%87%D8%A7%20%D9%85%D9%86%20%D8%A7%D9%84%D8%B5%D9%81%D8%B1.pdf";
        }
      } else {
        console.warn("⚠️ No cart items found, using default download URL");
        downloadUrl = "https://cix55jnodh8jj42w.public.blob.vercel-storage.com/15%D9%81%D9%83%D8%B1%D8%A9%20%D9%85%D8%B4%D8%B1%D9%88%D8%B9%20%D8%B1%D9%82%D9%85%D9%8A%20%D9%85%D8%B1%D8%A8%D8%AD%20%D9%8A%D9%85%D9%83%D9%86%D9%83%20%D8%A7%D9%84%D8%A8%D8%AF%D8%A1%20%D8%A8%D9%87%D8%A7%20%D9%85%D9%86%20%D8%A7%D9%84%D8%B5%D9%81%D8%B1.pdf";
        productName = "15 فكرة مشروع رقمي مربح";
      }
      
      // إعداد بيانات الدفع للحفظ
      const paymentData = {
        payment_id: paymentId,
        message: message || `دفع مقابل ${productName}`,
        amount: amount / 100, // تحويل من فلسات إلى دراهم
        currency: currency,
        status: paymentStatus,
        download_url: downloadUrl,
        customer_email: customerEmail,
        customer_name: customerName,
        created_at: new Date().toISOString(),
        cart_items: cartItems
      };
      
      console.log("💾 Saving to Vercel Blob...");
      console.log("📄 Payment data:", JSON.stringify(paymentData, null, 2));
      
      try {
        // حفظ في Vercel Blob Storage
        // اسم الملف: payments/{payment_id}.json
        const blobFilename = `payments/${paymentId}.json`;
        
        const blob = await put(blobFilename, JSON.stringify(paymentData, null, 2), {
          access: 'public',
          contentType: 'application/json',
        });
        
        console.log("=".repeat(60));
        console.log("✅ Payment saved to Blob Storage!");
        console.log(`📁 Blob URL: ${blob.url}`);
        console.log(`✅ Payment saved: ${paymentId}`);
        console.log("=".repeat(60));
        
        return NextResponse.json({
          success: true,
          message: "Payment processed and saved successfully",
          payment_id: paymentId,
          blob_url: blob.url,
          amount: paymentData.amount,
          currency: paymentData.currency,
          download_url: downloadUrl,
          received: true
        });
        
      } catch (blobError: any) {
        console.error("❌ Error saving to Blob:", blobError);
        
        // حتى لو فشل الحفظ في Blob، نرد بنجاح للـ webhook
        return NextResponse.json({
          success: true,
          message: "Payment processed but Blob save failed",
          error: blobError.message,
          payment_id: paymentId,
          received: true
        });
      }
    }
    
    // معالجة حالات الفشل
    if (paymentStatus === "failed" || paymentStatus === "cancelled") {
      console.log("❌ Payment failed or cancelled");
      
      return NextResponse.json({
        received: true,
        status: paymentStatus,
        message: "Payment failed or cancelled"
      });
    }
    
    // رد عام لجميع الحالات الأخرى
    console.log(`⚠️ Unhandled payment status: ${paymentStatus}`);
    return NextResponse.json({
      received: true,
      status: paymentStatus,
      message: "Webhook received but not processed"
    });
    
  } catch (error: any) {
    console.error("💥 Webhook error:");
    console.error(error);
    console.error("Stack trace:", error.stack);
    
    return NextResponse.json({
      error: "Webhook processing failed",
      message: error.message,
      received: true
    }, { status: 500 });
  }
}

// دعم GET للاختبار
export async function GET() {
  try {
    // جلب آخر 5 دفعات من Blob
    const { blobs } = await list({
      prefix: 'payments/',
      limit: 5
    });
    
    return NextResponse.json({
      message: "Ziina Webhook Endpoint",
      status: "active",
      timestamp: new Date().toISOString(),
      info: "This endpoint receives payment notifications from Ziina",
      recent_payments: blobs.length,
      payments: blobs.map(b => ({
        url: b.url,
        uploadedAt: b.uploadedAt
      }))
    });
  } catch (error: any) {
    return NextResponse.json({
      message: "Ziina Webhook Endpoint",
      status: "active",
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
}

