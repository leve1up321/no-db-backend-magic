/**
 * ════════════════════════════════════════════════════════════════════════════
 * 🔔 WEBHOOK API - استقبال إشعارات الدفع من Ziina
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * الوظيفة:
 * - استقبال POST من بوابة الدفع (Ziina)
 * - التحقق من status = "completed"
 * - مطابقة المنتج الصحيح حسب product_id أو message
 * - إنشاء token فريد (صالح 10 دقائق)
 * - حفظ السجل في Vercel Blob
 * - إرجاع redirect URL للعميل
 * 
 * ════════════════════════════════════════════════════════════════════════════
 */

import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomBytes } from "crypto";
import products from "@/data/products.json";

// ────────────────────────────────────────────────────────────────────────────
// 🔧 دوال مساعدة
// ────────────────────────────────────────────────────────────────────────────

/**
 * إنشاء token آمن فريد
 */
function generateSecureToken(): string {
  const randomPart = randomBytes(16).toString('hex'); // 32 chars
  return `tok_${randomPart}`;
}

/**
 * توليد رقم طلب فريد
 */
function generateOrderNumber(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

/**
 * حساب وقت انتهاء الصلاحية (بالدقائق)
 */
function getExpiryTimestamp(minutes: number = 10): string {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

/**
 * مطابقة المنتج حسب product_id أو message
 */
function matchProduct(productId?: number, message?: string) {
  // محاولة المطابقة بـ product_id أولاً
  if (productId) {
    const product = products.find(p => p.product_id === productId && p.active);
    if (product) return product;
  }
  
  // محاولة المطابقة بـ message
  if (message) {
    const messageLower = message.toLowerCase();
    const product = products.find(p => {
      const nameLower = p.product_name.toLowerCase();
      const nameEnLower = p.product_name_en.toLowerCase();
      return (nameLower.includes(messageLower) || 
              messageLower.includes(nameLower) ||
              nameEnLower.includes(messageLower) ||
              messageLower.includes(nameEnLower)) && 
             p.active;
    });
    if (product) return product;
  }
  
  // إذا لم يتم العثور، إرجاع المنتج الافتراضي (الأول)
  return products.find(p => p.active) || products[0];
}

// ────────────────────────────────────────────────────────────────────────────
// 🎯 معالج POST الرئيسي
// ────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log("═".repeat(80));
    console.log("🔔 WEBHOOK RECEIVED");
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    console.log("═".repeat(80));
    
    // ────────────────────────────────────────────────────────────────────────
    // الخطوة 1: قراءة البيانات من Ziina
    // ────────────────────────────────────────────────────────────────────────
    
    const body = await req.json();
    const paymentData = body.data; // Ziina ترسل البيانات في body.data
    
    console.log("📋 Raw Webhook Data:");
    console.log(JSON.stringify(body, null, 2));
    
    if (!paymentData) {
      console.error("❌ Missing payment data in webhook");
      return NextResponse.json({
        success: false,
        error: "Missing payment data"
      }, { status: 400 });
    }
    
    // ────────────────────────────────────────────────────────────────────────
    // الخطوة 2: التحقق من حالة الدفع
    // ────────────────────────────────────────────────────────────────────────
    
    const {
      id: paymentId,
      status,
      amount: amountInFils,
      currency_code: currencyCode,
      customer_email: customerEmail,
      customer_name: customerName,
      message,
      metadata
    } = paymentData;
    
    console.log("─".repeat(80));
    console.log("📊 PAYMENT DETAILS:");
    console.log(`  💳 Payment ID: ${paymentId}`);
    console.log(`  📊 Status: ${status}`);
    console.log(`  💰 Amount: ${amountInFils} fils`);
    console.log(`  💵 Currency: ${currencyCode}`);
    console.log(`  📧 Customer Email: ${customerEmail}`);
    console.log(`  👤 Customer Name: ${customerName}`);
    console.log(`  💬 Message: ${message}`);
    console.log(`  🏷️ Metadata:`, metadata);
    
    if (status !== "completed") {
      console.log(`⚠️ Payment status is not completed: ${status}`);
      return NextResponse.json({
        success: false,
        message: "Payment not completed yet"
      }, { status: 200 });
    }
    
    // ────────────────────────────────────────────────────────────────────────
    // الخطوة 3: مطابقة المنتج
    // ────────────────────────────────────────────────────────────────────────
    
    const productId = metadata?.product_id ? parseInt(metadata.product_id) : undefined;
    const matchedProduct = matchProduct(productId, message);
    
    console.log("─".repeat(80));
    console.log("📦 PRODUCT MATCHED:");
    console.log(`  🆔 Product ID: ${matchedProduct.product_id}`);
    console.log(`  📝 Name: ${matchedProduct.product_name}`);
    console.log(`  📥 Download URL: ${matchedProduct.download_url}`);
    console.log(`  📄 Filename: ${matchedProduct.filename}`);
    console.log(`  💰 Price: ${matchedProduct.price} ${matchedProduct.currency}`);
    
    // ────────────────────────────────────────────────────────────────────────
    // الخطوة 4: توليد Token ورقم الطلب
    // ────────────────────────────────────────────────────────────────────────
    
    const accessToken = generateSecureToken();
    const orderNumber = generateOrderNumber();
    const expiresAt = getExpiryTimestamp(10); // 10 دقائق
    const createdAt = new Date().toISOString();
    
    // تحويل المبلغ من fils إلى العملة الأساسية
    const amount = amountInFils / 100;
    
    console.log("─".repeat(80));
    console.log("🔐 SECURITY TOKEN GENERATED:");
    console.log(`  🎫 Token: ${accessToken}`);
    console.log(`  ⏰ Expires: ${expiresAt}`);
    console.log(`  📅 Created: ${createdAt}`);
    console.log(`  ⏱️ Validity: 10 minutes`);
    console.log(`  📦 Order Number: ${orderNumber}`);
    
    // ────────────────────────────────────────────────────────────────────────
    // الخطوة 5: إنشاء سجل الدفع
    // ────────────────────────────────────────────────────────────────────────
    
    const paymentRecord = {
      // معلومات الدفع
      payment_id: paymentId,
      order_number: orderNumber,
      status: status,
      
      // معلومات المنتج
      product_id: matchedProduct.product_id,
      product_name: matchedProduct.product_name,
      product_image: matchedProduct.product_image,
      
      // معلومات المبلغ
      amount: amount,
      currency: currencyCode || matchedProduct.currency,
      amount_in_fils: amountInFils,
      
      // معلومات التحميل (محفوظة للسيرفر فقط)
      download_url: matchedProduct.download_url,
      filename: matchedProduct.filename,
      file_size_mb: matchedProduct.file_size_mb,
      
      // معلومات الأمان
      access_token: accessToken,
      expires_at: expiresAt,
      created_at: createdAt,
      used: false,
      download_count: 0,
      
      // معلومات العميل
      customer_email: customerEmail,
      customer_name: customerName,
      message: message,
      
      // بيانات إضافية
      webhook_data: paymentData,
      ip_address: req.headers.get('x-forwarded-for') || 
                  req.headers.get('x-real-ip') || 
                  'unknown',
      user_agent: req.headers.get('user-agent') || 'unknown'
    };
    
    // ────────────────────────────────────────────────────────────────────────
    // الخطوة 6: حفظ السجل في Vercel Blob (مزدوج)
    // ────────────────────────────────────────────────────────────────────────
    
    console.log("─".repeat(80));
    console.log("💾 SAVING TO VERCEL BLOB...");
    
    // حفظ حسب payment_id (للبحث بـ payment_id)
    const paymentBlob = await put(
      `payments/${paymentId}.json`,
      JSON.stringify(paymentRecord, null, 2),
      {
        access: 'public',
        contentType: 'application/json',
      }
    );
    
    console.log(`  ✅ Payment Blob saved: ${paymentBlob.url}`);
    
    // حفظ حسب token (للبحث بـ token)
    const tokenBlob = await put(
      `tokens/${accessToken}.json`,
      JSON.stringify(paymentRecord, null, 2),
      {
        access: 'public',
        contentType: 'application/json',
      }
    );
    
    console.log(`  ✅ Token Blob saved: ${tokenBlob.url}`);
    
    const duration = Date.now() - startTime;
    
    console.log("═".repeat(80));
    console.log("✅ PAYMENT SAVED SUCCESSFULLY!");
    console.log(`📁 Payment Blob: ${paymentBlob.url}`);
    console.log(`📁 Token Blob: ${tokenBlob.url}`);
    console.log(`✅ Payment saved and token: ${accessToken}`);
    console.log(`💳 Payment ID: ${paymentId}`);
    console.log(`📦 Order Number: ${orderNumber}`);
    console.log(`💰 Amount: ${amount} ${currencyCode || matchedProduct.currency}`);
    console.log(`⏱️ Processing time: ${duration}ms`);
    console.log("─".repeat(80));
    
    // ────────────────────────────────────────────────────────────────────────
    // الخطوة 7: إنشاء redirect URL
    // ────────────────────────────────────────────────────────────────────────
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://leve1up.vercel.app';
    const redirectUrl = `${baseUrl}/order-success?payment_id=${paymentId}&access=${accessToken}`;
    
    console.log("🔗 SUGGESTED REDIRECT URL:");
    console.log(`   ${redirectUrl}`);
    console.log("═".repeat(80));
    
    // ────────────────────────────────────────────────────────────────────────
    // الخطوة 8: إرجاع الاستجابة
    // ────────────────────────────────────────────────────────────────────────
    
    return NextResponse.json({
      success: true,
      payment_id: paymentId,
      order_number: orderNumber,
      access_token: accessToken,
      expires_at: expiresAt,
      redirect_url: redirectUrl,
      product_name: matchedProduct.product_name,
      amount: amount,
      currency: currencyCode || matchedProduct.currency
    }, { status: 200 });
    
  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    console.error("═".repeat(80));
    console.error("💥 WEBHOOK ERROR:");
    console.error(`⏱️ Failed after: ${duration}ms`);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("═".repeat(80));
    
    return NextResponse.json({
      success: false,
      error: "Failed to process payment",
      details: error.message
    }, { status: 500 });
  }
}

/**
 * معالج GET للاختبار
 */
export async function GET() {
  return NextResponse.json({
    message: "Webhook endpoint is active",
    timestamp: new Date().toISOString(),
    products_count: products.length
  });
}

