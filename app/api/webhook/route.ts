/**
 * ════════════════════════════════════════════════════════════════════════════
 * 🎯 ZIINA WEBHOOK HANDLER - نظام دفع آمن ومتكامل
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * الوظيفة الرئيسية:
 * استقبال إشعارات الدفع من Ziina وإنشاء سجلات آمنة مع tokens محدودة الصلاحية
 * 
 * التدفق:
 * 1. استقبال POST من Ziina webhook
 * 2. قراءة البيانات من payload.data (خاص ببنية Ziina)
 * 3. عند status === "completed":
 *    - إنشاء token وصول فريد (tok_xxxxx)
 *    - تحديد صلاحية 10 دقائق
 *    - حفظ السجل في Vercel Blob Storage
 * 4. طباعة console.log للتأكيد والتتبع
 * 5. إرجاع رابط الفاتورة المقترح
 * 
 * البيانات المحفوظة:
 * - payment_id: معرف الدفع الفريد
 * - product_id: معرف المنتج
 * - product_name: اسم المنتج
 * - product_image: صورة المنتج
 * - amount: المبلغ (بالدراهم أو العملة المحددة)
 * - currency: العملة (AED, SAR, USD...)
 * - message: ملاحظات الدفع
 * - download_url: رابط Blob الحقيقي (مخفي عن المستخدم)
 * - filename: اسم الملف للتحميل
 * - access_token: token الوصول المؤقت (tok_xxxxx)
 * - expires_at: وقت انتهاء الصلاحية (timestamp)
 * - created_at: تاريخ الإنشاء
 * - customer_email: بريد العميل
 * - customer_name: اسم العميل
 * - used: هل تم استخدام التوكن (للـ single-use)
 * 
 * إعدادات Ziina المطلوبة:
 * - Webhook URL: https://leve1up.vercel.app/api/webhook
 * - Success URL: https://leve1up.vercel.app/order-success?payment_id={PAYMENT_ID}
 *   (ملاحظة: نحن ننشئ access token في Webhook ونحفظه مع السجل)
 * 
 * Environment Variables المطلوبة:
 * - BLOB_READ_WRITE_TOKEN: للكتابة في Vercel Blob
 * - WHATSAPP_NUMBER: رقم الواتساب للدعم (اختياري)
 * 
 * خيارات مستقبلية:
 * - استبدال Blob بقاعدة بيانات (PostgreSQL, MongoDB)
 * - إضافة watermark ديناميكي على الملفات
 * - نظام إشعارات Email عند كل دفعة
 * 
 * ════════════════════════════════════════════════════════════════════════════
 */

import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomBytes } from "crypto";
import productsData from "@/data/products-store.json";

// ────────────────────────────────────────────────────────────────────────────
// 🔧 دوال مساعدة
// ────────────────────────────────────────────────────────────────────────────

/**
 * إنشاء access token آمن وفريد
 * Format: tok_<32 random hex chars>
 */
function generateAccessToken(): string {
  const randomPart = randomBytes(16).toString('hex');
  return `tok_${randomPart}`;
}

/**
 * حساب وقت انتهاء الصلاحية
 * @param minutes المدة بالدقائق (افتراضي: 10 دقائق)
 * @returns ISO timestamp
 */
function getExpiryTimestamp(minutes: number = 10): string {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

/**
 * البحث عن منتج حسب product_id أو message
 * @param productId معرف المنتج (إن وُجد)
 * @param message رسالة الدفع (للبحث بالاسم)
 * @returns بيانات المنتج أو null
 */
function findProduct(productId?: number, message?: string): any {
  // البحث بـ product_id أولاً
  if (productId) {
    const product = productsData.find(p => p.product_id === productId);
    if (product) return product;
  }
  
  // البحث في الرسالة
  if (message) {
    for (const product of productsData) {
      if (message.includes(product.product_name) || 
          message.includes(product.product_name_en)) {
        return product;
      }
    }
  }
  
  // افتراضي: أول منتج نشط
  return productsData.find(p => p.active) || productsData[0];
}

// ────────────────────────────────────────────────────────────────────────────
// 🎯 معالج Webhook الرئيسي
// ────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log("═".repeat(80));
    console.log("🔔 WEBHOOK RECEIVED");
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    console.log("═".repeat(80));
    
    // ────────────────────────────────────────────────────────────────────────
    // الخطوة 1: قراءة وتحليل البيانات
    // ────────────────────────────────────────────────────────────────────────
    
    const body = await req.json();
    console.log("📦 Raw payload:", JSON.stringify(body, null, 2));
    
    // Ziina ترسل البيانات داخل payload.data
    const data = body.data || body;
    
    const paymentId = data.id || body.id;
    const paymentStatus = data.status || body.status;
    const amountInFils = data.amount || body.amount || 0;
    const currency = data.currency_code || data.currency || body.currency_code || "AED";
    const customerEmail = data.customer_email || data.email || body.customer_email || "";
    const customerName = data.customer_name || data.name || body.customer_name || "";
    const message = data.message || body.message || "";
    
    // تحويل المبلغ من فلسات إلى وحدة العملة
    const amount = amountInFils / 100;
    
    console.log("─".repeat(80));
    console.log("📊 PAYMENT DETAILS:");
    console.log(`  💳 Payment ID: ${paymentId}`);
    console.log(`  📊 Status: ${paymentStatus}`);
    console.log(`  💰 Amount: ${amountInFils} fils = ${amount} ${currency}`);
    console.log(`  📧 Customer Email: ${customerEmail}`);
    console.log(`  👤 Customer Name: ${customerName}`);
    console.log(`  💬 Message: ${message}`);
    console.log("─".repeat(80));
    
    // ────────────────────────────────────────────────────────────────────────
    // الخطوة 2: التحقق من نجاح الدفع
    // ────────────────────────────────────────────────────────────────────────
    
    const successStatuses = ["completed", "succeeded", "paid", "success"];
    
    if (!successStatuses.includes(paymentStatus?.toLowerCase())) {
      console.log(`⚠️ Payment not completed (status: ${paymentStatus})`);
      return NextResponse.json({
        received: true,
        status: paymentStatus,
        message: "Webhook received but payment not completed"
      });
    }
    
    console.log("✅ PAYMENT SUCCESSFUL - Processing order...");
    
    // ────────────────────────────────────────────────────────────────────────
    // الخطوة 3: تحديد المنتج
    // ────────────────────────────────────────────────────────────────────────
    
    // محاولة استخراج product_id من metadata
    const metadata = data.metadata || body.metadata || {};
    const productIdFromMeta = metadata.product_id || metadata.productId;
    
    const product = findProduct(productIdFromMeta, message);
    
    if (!product) {
      console.error("❌ No product found!");
      throw new Error("Product not found");
    }
    
    console.log("─".repeat(80));
    console.log("📦 PRODUCT MATCHED:");
    console.log(`  🆔 Product ID: ${product.product_id}`);
    console.log(`  📝 Name: ${product.product_name}`);
    console.log(`  🖼️ Image: ${product.product_image}`);
    console.log(`  📥 Download URL: ${product.download_url}`);
    console.log(`  📄 Filename: ${product.filename}`);
    console.log("─".repeat(80));
    
    // ────────────────────────────────────────────────────────────────────────
    // الخطوة 4: إنشاء Access Token
    // ────────────────────────────────────────────────────────────────────────
    
    const accessToken = generateAccessToken();
    const expiresAt = getExpiryTimestamp(10); // 10 دقائق
    const createdAt = new Date().toISOString();
    
    console.log("🔐 SECURITY TOKEN GENERATED:");
    console.log(`  🎫 Token: ${accessToken}`);
    console.log(`  ⏰ Expires: ${expiresAt}`);
    console.log(`  📅 Created: ${createdAt}`);
    console.log(`  ⏱️ Validity: 10 minutes`);
    
    // ────────────────────────────────────────────────────────────────────────
    // الخطوة 5: بناء سجل الطلب
    // ────────────────────────────────────────────────────────────────────────
    
    const orderRecord = {
      // معلومات الدفع
      payment_id: paymentId,
      order_number: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      status: "completed",
      
      // معلومات المنتج
      product_id: product.product_id,
      product_name: product.product_name,
      product_image: product.product_image,
      
      // معلومات المبلغ
      amount: amount,
      currency: currency,
      amount_in_fils: amountInFils,
      
      // رسالة/ملاحظات
      message: message || `دفع مقابل ${product.product_name}`,
      
      // معلومات التحميل (مخفية عن المستخدم)
      download_url: product.download_url,
      filename: product.filename,
      file_size_mb: product.file_size_mb,
      
      // معلومات الأمان
      access_token: accessToken,
      expires_at: expiresAt,
      created_at: createdAt,
      used: false,
      download_count: 0,
      
      // معلومات العميل
      customer_email: customerEmail,
      customer_name: customerName,
      
      // بيانات إضافية
      webhook_data: data,
      user_agent: req.headers.get('user-agent') || '',
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    };
    
    console.log("─".repeat(80));
    console.log("💾 ORDER RECORD PREPARED:");
    console.log(JSON.stringify(orderRecord, null, 2));
    console.log("─".repeat(80));
    
    // ────────────────────────────────────────────────────────────────────────
    // الخطوة 6: حفظ في Vercel Blob Storage
    // ────────────────────────────────────────────────────────────────────────
    
    try {
      // حفظ نسخة بـ payment_id (للبحث السريع)
      const paymentBlob = await put(
        `payments/${paymentId}.json`,
        JSON.stringify(orderRecord, null, 2),
        {
          access: 'public',
          contentType: 'application/json',
        }
      );
      
      // حفظ نسخة بـ access_token (للتحميل الآمن)
      const tokenBlob = await put(
        `tokens/${accessToken}.json`,
        JSON.stringify(orderRecord, null, 2),
        {
          access: 'public',
          contentType: 'application/json',
        }
      );
      
      const duration = Date.now() - startTime;
      
      console.log("═".repeat(80));
      console.log("✅ PAYMENT SAVED SUCCESSFULLY!");
      console.log("─".repeat(80));
      console.log(`📁 Payment Blob: ${paymentBlob.url}`);
      console.log(`📁 Token Blob: ${tokenBlob.url}`);
      console.log(`✅ Payment saved and token: ${accessToken}`);
      console.log(`💳 Payment ID: ${paymentId}`);
      console.log(`📦 Order Number: ${orderRecord.order_number}`);
      console.log(`💰 Amount: ${amount} ${currency}`);
      console.log(`⏱️ Processing time: ${duration}ms`);
      console.log("─".repeat(80));
      console.log("🔗 SUGGESTED REDIRECT URL:");
      console.log(`   https://leve1up.vercel.app/order-success?payment_id=${paymentId}&access=${accessToken}`);
      console.log("═".repeat(80));
      
      // ────────────────────────────────────────────────────────────────────
      // اقتراح: إرسال بريد إلكتروني للعميل
      // ────────────────────────────────────────────────────────────────────
      // if (customerEmail) {
      //   await sendOrderConfirmationEmail({
      //     to: customerEmail,
      //     orderNumber: orderRecord.order_number,
      //     productName: product.product_name,
      //     amount: amount,
      //     currency: currency,
      //     downloadLink: `https://leve1up.vercel.app/order-success?payment_id=${paymentId}&access=${accessToken}`
      //   });
      // }
      
      return NextResponse.json({
        success: true,
        message: "Payment processed successfully",
        payment_id: paymentId,
        order_number: orderRecord.order_number,
        access_token: accessToken,
        expires_at: expiresAt,
        redirect_url: `https://leve1up.vercel.app/order-success?payment_id=${paymentId}&access=${accessToken}`,
        blob_urls: {
          payment: paymentBlob.url,
          token: tokenBlob.url
        }
      }, { status: 200 });
      
    } catch (blobError: any) {
      console.error("═".repeat(80));
      console.error("❌ BLOB STORAGE ERROR:");
      console.error(blobError);
      console.error("═".repeat(80));
      
      // حتى لو فشل الحفظ، نرد بنجاح للـ webhook
      return NextResponse.json({
        success: false,
        message: "Payment processed but storage failed",
        error: blobError.message,
        payment_id: paymentId,
        received: true
      }, { status: 200 });
    }
    
  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    console.error("═".repeat(80));
    console.error("💥 WEBHOOK ERROR:");
    console.error(`⏱️ Failed after: ${duration}ms`);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("═".repeat(80));
    
    return NextResponse.json({
      error: "Webhook processing failed",
      message: error.message,
      received: true
    }, { status: 500 });
  }
}

/**
 * GET handler للاختبار
 */
export async function GET() {
  return NextResponse.json({
    service: "Ziina Webhook Handler",
    status: "active",
    version: "2.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      webhook: "POST /api/webhook",
      record: "GET /api/record?payment_id=xxx or ?token=xxx",
      download: "GET /api/download/[token]"
    },
    features: [
      "Secure access tokens (tok_xxxxx)",
      "10-minute token expiry",
      "Dual Blob storage (payment_id + token)",
      "Single-use token support",
      "Comprehensive logging",
      "Product matching by ID or message"
    ],
    setup: {
      ziina_webhook_url: "https://leve1up.vercel.app/api/webhook",
      ziina_success_url: "https://leve1up.vercel.app/order-success?payment_id={PAYMENT_ID}",
      note: "Access token is generated automatically in webhook"
    }
  });
}

