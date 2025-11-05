/**
 * 🎯 Ziina Webhook Handler with Secure Token-Based Authentication
 * 
 * الوظائف:
 * 1. استقبال webhook من Ziina
 * 2. قراءة البيانات من payload.data
 * 3. إنشاء token آمن مع صلاحية محدودة (10 دقائق)
 * 4. حفظ السجل في Vercel Blob Storage
 * 5. Logging شامل لكل خطوة
 * 
 * البيانات المحفوظة:
 * - payment_id: معرف الدفع من Ziina
 * - message: رسالة الدفع
 * - amount: المبلغ (بالدراهم)
 * - currency: العملة (AED)
 * - downloadUrl: رابط التحميل من Blob
 * - filename: اسم الملف
 * - token: token فريد للتحميل الآمن
 * - expiresAt: وقت انتهاء الصلاحية
 * - used: هل تم استخدام التوكن (للـ single-use)
 * - createdAt: تاريخ الإنشاء
 */

import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomBytes } from "crypto";
import productsData from "@/data/products.json";

/**
 * إنشاء token آمن وفريد
 * @returns token string (32 bytes hex = 64 chars)
 */
function generateSecureToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * حساب وقت انتهاء الصلاحية
 * @param minutes عدد الدقائق
 * @returns ISO timestamp
 */
function getExpiryTime(minutes: number = 10): string {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

export async function POST(req: NextRequest) {
  try {
    console.log("=".repeat(70));
    console.log("🔔 Webhook received at:", new Date().toISOString());
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📥 الخطوة 1: قراءة البيانات من Ziina
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    const body = await req.json();
    console.log("📦 Full Webhook payload:", JSON.stringify(body, null, 2));
    
    // ⚠️ CRITICAL: Ziina ترسل البيانات في body.data
    const data = body.data || body;
    console.log("📦 Extracted data from payload.data:", JSON.stringify(data, null, 2));
    
    // استخراج البيانات الأساسية
    const paymentId = data.id || body.id;
    const paymentStatus = data.status || body.status;
    const amount = data.amount || body.amount || 0;
    const currency = data.currency_code || data.currency || body.currency_code || "AED";
    const customerEmail = data.customer_email || data.email || body.customer_email;
    const customerName = data.customer_name || data.name || body.customer_name;
    const message = data.message || body.message || "";
    
    console.log("=".repeat(70));
    console.log("📊 Extracted Payment Info:");
    console.log(`💳 Payment ID: ${paymentId}`);
    console.log(`📊 Status: ${paymentStatus}`);
    console.log(`💰 Amount: ${amount} fils (${amount / 100} ${currency})`);
    console.log(`📧 Customer Email: ${customerEmail}`);
    console.log(`👤 Customer Name: ${customerName}`);
    console.log(`💬 Message: ${message}`);
    console.log("=".repeat(70));
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ✅ الخطوة 2: معالجة الدفع الناجح
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    if (paymentStatus === "succeeded" || paymentStatus === "completed" || paymentStatus === "paid") {
      console.log("✅ Payment succeeded! Processing order...");
      
      // استخراج معلومات السلة من metadata
      const metadata = data.metadata || body.metadata || {};
      const cartItems = metadata.cartItems 
        ? (typeof metadata.cartItems === 'string' ? JSON.parse(metadata.cartItems) : metadata.cartItems)
        : [];
      
      console.log("📦 Cart items from metadata:", cartItems);
      
      // Default product إذا لم تكن هناك cart items
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
      
      // الحصول على أول منتج (أو يمكن معالجة عدة منتجات)
      const firstItem = cartItems[0];
      const product = productsData.find((p: any) => p.id === firstItem.id);
      
      // استخراج بيانات المنتج
      const productName = firstItem.name || product?.name || "منتج رقمي";
      const downloadUrl = product?.downloadUrl || "";
      // توليد اسم الملف من اسم المنتج أو من URL
      let filename = `${productName}.pdf`;
      if (downloadUrl) {
        const urlParts = downloadUrl.split("/");
        const lastPart = urlParts[urlParts.length - 1];
        if (lastPart && lastPart.includes(".")) {
          filename = decodeURIComponent(lastPart);
        }
      }
      
      console.log("📦 Product Info:");
      console.log(`  - Name: ${productName}`);
      console.log(`  - Download URL: ${downloadUrl}`);
      console.log(`  - Filename: ${filename}`);
      
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 🔐 الخطوة 3: إنشاء Token آمن
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      const token = generateSecureToken();
      const expiresAt = getExpiryTime(10); // 10 دقائق
      const createdAt = new Date().toISOString();
      
      console.log("=".repeat(70));
      console.log("🔐 Security Token Generated:");
      console.log(`🎫 Token: ${token}`);
      console.log(`⏰ Expires At: ${expiresAt}`);
      console.log(`📅 Created At: ${createdAt}`);
      console.log("=".repeat(70));
      
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 💾 الخطوة 4: إعداد بيانات السجل
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      const recordData = {
        // معلومات الدفع
        payment_id: paymentId,
        message: message || `دفع مقابل ${productName}`,
        amount: amount / 100, // تحويل من فلسات إلى دراهم
        currency: currency,
        
        // معلومات العميل
        customer_email: customerEmail,
        customer_name: customerName,
        
        // معلومات المنتج
        product_name: productName,
        download_url: downloadUrl,
        filename: filename,
        
        // معلومات الأمان
        token: token,
        expires_at: expiresAt,
        used: false, // للـ single-use token
        
        // معلومات إضافية
        created_at: createdAt,
        cart_items: cartItems,
        
        // البيانات الأصلية (للتدقيق)
        webhook_data: data
      };
      
      console.log("💾 Record data prepared:");
      console.log(JSON.stringify(recordData, null, 2));
      
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 📤 الخطوة 5: حفظ في Vercel Blob Storage
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      try {
        // حفظ بـ payment_id كمفتاح رئيسي
        const paymentBlob = await put(
          `payments/${paymentId}.json`,
          JSON.stringify(recordData, null, 2),
          {
            access: 'public',
            contentType: 'application/json',
          }
        );
        
        // حفظ نسخة ثانية بـ token للبحث السريع
        const tokenBlob = await put(
          `tokens/${token}.json`,
          JSON.stringify(recordData, null, 2),
          {
            access: 'public',
            contentType: 'application/json',
          }
        );
        
        console.log("=".repeat(70));
        console.log("✅ Record saved to Blob Storage successfully!");
        console.log(`📁 Payment Blob URL: ${paymentBlob.url}`);
        console.log(`📁 Token Blob URL: ${tokenBlob.url}`);
        console.log(`✅ Payment saved and token: ${token}`);
        console.log(`💳 Payment ID: ${paymentId}`);
        console.log(`💰 Amount: ${recordData.amount} ${recordData.currency}`);
        console.log(`📥 Download URL: ${downloadUrl}`);
        console.log("=".repeat(70));
        
        return NextResponse.json({
          success: true,
          message: "Payment processed and record saved successfully",
          payment_id: paymentId,
          token: token,
          expires_at: expiresAt,
          amount: recordData.amount,
          currency: recordData.currency,
          blob_urls: {
            payment: paymentBlob.url,
            token: tokenBlob.url
          },
          received: true
        });
        
      } catch (blobError: any) {
        console.error("❌ Blob Storage error:", blobError);
        console.error("Stack trace:", blobError.stack);
        
        // حتى لو فشل الحفظ، نرد بنجاح للـ webhook
        return NextResponse.json({
          success: true,
          message: "Payment processed but storage failed",
          error: blobError.message,
          payment_id: paymentId,
          received: true
        });
      }
    }
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ❌ معالجة حالات الفشل
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    if (paymentStatus === "failed" || paymentStatus === "cancelled") {
      console.log("❌ Payment failed or cancelled");
      console.log(`Payment ID: ${paymentId}`);
      console.log(`Status: ${paymentStatus}`);
    }
    
    // رد عام للحالات الأخرى
    console.log(`⚠️ Unhandled payment status: ${paymentStatus}`);
    return NextResponse.json({
      received: true,
      status: paymentStatus,
      message: "Webhook received but not processed"
    });
    
  } catch (error: any) {
    console.error("=".repeat(70));
    console.error("💥 Webhook Error:");
    console.error("Error message:", error.message);
    console.error("Stack trace:", error.stack);
    console.error("=".repeat(70));
    
    return NextResponse.json({
      error: "Webhook processing failed",
      message: error.message,
      received: true
    }, { status: 500 });
  }
}

/**
 * GET endpoint للاختبار
 */
export async function GET() {
  return NextResponse.json({
    message: "Ziina Webhook Endpoint with Secure Token System",
    status: "active",
    timestamp: new Date().toISOString(),
    info: {
      description: "This endpoint receives payment notifications from Ziina",
      features: [
        "Secure token generation (32 bytes)",
        "10-minute token expiry",
        "Single-use token support",
        "Dual storage (payment_id + token)",
        "Comprehensive logging"
      ]
    }
  });
}

