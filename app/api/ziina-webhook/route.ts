import { NextRequest, NextResponse } from "next/server";
import { verifyZiinaSignature } from "@/lib/signature";
import { sendDiscordNotification } from "@/lib/discord";
import { createOrder, updateOrderByPaymentId, findOrderByPaymentId } from "@/lib/database";
import { uploadTextFile } from "@/lib/blob-storage";
import { generateSecureDownloadUrl } from "@/lib/download-tokens";
import productsData from "@/data/products.json";

/**
 * 🎯 Ziina Webhook Handler - نسخة متقدمة ومتكاملة
 * 
 * المميزات:
 * ✅ التحقق من التوقيع (Signature Verification)
 * ✅ إشعارات Discord
 * ✅ حفظ الطلبات في قاعدة بيانات JSON
 * ✅ رفع الملفات على Vercel Blob
 * ✅ توليد روابط تحميل مؤقتة
 * 
 * الاستخدام:
 * 1. ارفع المشروع على Vercel
 * 2. أضف webhook URL في Ziina Dashboard: https://your-domain.vercel.app/api/ziina-webhook
 * 3. أضف المتغيرات البيئية:
 *    - ZIINA_WEBHOOK_SECRET
 *    - DISCORD_WEBHOOK_URL
 *    - BLOB_READ_WRITE_TOKEN (من Vercel)
 */

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    // 📥 قراءة البيانات الخام
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    console.log("📩 Webhook received from Ziina at:", new Date().toISOString());
    console.log("📦 Webhook payload:", JSON.stringify(body, null, 2));

    // 🔐 التحقق من التوقيع
    const signature = req.headers.get("x-ziina-signature");
    const webhookSecret = process.env.ZIINA_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      console.log("🔐 Verifying webhook signature...");
      
      const isValid = verifyZiinaSignature(rawBody, signature, webhookSecret);
      
      if (!isValid) {
        console.error("❌ Invalid webhook signature!");
        return NextResponse.json(
          { error: "Invalid signature" }, 
          { status: 401 }
        );
      }
      
      console.log("✅ Webhook signature verified successfully");
    } else if (webhookSecret) {
      console.warn("⚠️ Webhook secret configured but no signature provided");
    } else {
      console.warn("⚠️ Webhook signature verification disabled (no secret configured)");
    }

    // 📊 استخراج البيانات الأساسية
    const eventType = body.event || body.type;
    const paymentStatus = body.status;
    const paymentId = body.id || body.payment_intent_id || body.paymentId;
    const amount = body.amount || 0;
    const currency = body.currency_code || body.currency || "AED";
    const customerEmail = body.customer_email || body.email;
    const customerName = body.customer_name || body.name;

    console.log(`🎯 Event: ${eventType}, Status: ${paymentStatus}, Payment ID: ${paymentId}`);

    // 📋 استخراج معلومات المنتجات إذا كانت موجودة
    let items: any[] = [];
    if (body.metadata?.cartItems) {
      try {
        items = typeof body.metadata.cartItems === 'string' 
          ? JSON.parse(body.metadata.cartItems)
          : body.metadata.cartItems;
      } catch (e) {
        console.warn("⚠️ Could not parse cart items from metadata");
      }
    }

    // ✅ معالجة حالة نجاح الدفع
    if (paymentStatus === "succeeded" || paymentStatus === "completed") {
      console.log("✅ Payment succeeded!");
      console.log(`💰 Amount: ${amount} ${currency}`);
      
      // 1️⃣ حفظ الطلب في قاعدة البيانات
      let order = findOrderByPaymentId(paymentId);
      
      if (!order) {
        // إنشاء طلب جديد
        order = createOrder({
          id: `order_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          paymentId: paymentId,
          status: 'paid',
          amount: amount,
          currency: currency,
          customerEmail: customerEmail,
          customerName: customerName,
          items: items,
          createdAt: new Date().toISOString(),
          paidAt: new Date().toISOString(),
          metadata: {
            event: eventType,
            rawWebhookData: body
          }
        });
        
        console.log("💾 Order created in database:", order.id);
      } else {
        // تحديث طلب موجود
        updateOrderByPaymentId(paymentId, {
          status: 'paid',
          paidAt: new Date().toISOString()
        });
        
        console.log("💾 Order updated in database:", order.id);
      }

      // 2️⃣ الحصول على رابط الملف من المنتج
      let productDownloadUrl = '';
      
      if (items && items.length > 0) {
        const productId = items[0].id || items[0].productId;
        const product = productsData.find((p: any) => p.id === productId);
        
        if (product && product.downloadUrl) {
          productDownloadUrl = product.downloadUrl;
          console.log("📦 Product download URL found:", productDownloadUrl);
        } else {
          console.warn("⚠️ No download URL found for product:", productId);
        }
      }

      // 3️⃣ توليد رابط تحميل آمن ومحمي
      let secureDownloadUrl = '';
      
      if (productDownloadUrl && order && customerEmail) {
        try {
          secureDownloadUrl = await generateSecureDownloadUrl(
            order.id,
            paymentId,
            productDownloadUrl,
            customerEmail
          );
          
          console.log("🔒 Secure download URL generated");
          
          // حفظ رابط التحميل الآمن في قاعدة البيانات
          updateOrderByPaymentId(paymentId, {
            downloadUrl: secureDownloadUrl,
            productDownloadUrl: productDownloadUrl, // حفظ الرابط الأصلي أيضاً
            downloadExpiry: Date.now() + (30 * 60 * 1000) // 30 دقيقة
          });
          
        } catch (tokenError: any) {
          console.error("❌ Error generating secure download URL:", tokenError.message);
        }
      }

      // 4️⃣ رفع إيصال نصي (اختياري)
      try {
        const receiptContent = `
===========================================
        إيصال دفع - LEVEL UP STORE
===========================================

رقم الدفعة: ${paymentId}
رقم الطلب: ${order?.id}
التاريخ: ${new Date().toISOString()}

العميل:
${customerName || 'غير محدد'}
${customerEmail || 'غير محدد'}

المبلغ المدفوع: ${amount} ${currency}

المنتجات:
${items.map(item => `  • ${item.name} (x${item.quantity}) - ${item.price} ${currency}`).join('\n')}

رابط التحميل:
${secureDownloadUrl || 'لم يتم توليد رابط'}

ملاحظة: الرابط صالح لمدة 30 دقيقة ولاستخدام واحد فقط

===========================================
شكراً لتعاملك معنا! 🎉
===========================================
        `.trim();

        const receiptResult = await uploadTextFile(
          `receipts/${paymentId}_receipt.txt`,
          receiptContent
        );

        console.log("📄 Receipt uploaded to Vercel Blob:", receiptResult.downloadUrl);

      } catch (blobError: any) {
        console.error("❌ Error uploading receipt:", blobError.message);
        // نكمل العملية حتى لو فشل رفع الإيصال
      }

      // 3️⃣ إرسال إشعار Discord
      try {
        await sendDiscordNotification({
          paymentId: paymentId,
          amount: amount,
          currency: currency,
          status: 'succeeded',
          customerEmail: customerEmail,
          customerName: customerName,
          items: items
        });
        
        console.log("🔔 Discord notification sent");
      } catch (discordError: any) {
        console.error("❌ Error sending Discord notification:", discordError.message);
        // نكمل العملية حتى لو فشل إرسال الإشعار
      }

      // 4️⃣ هنا يمكن إضافة:
      // - إرسال بريد إلكتروني للعميل
      // - توليد رابط تحميل للمنتج
      // - إرسال إشعار SMS
      // مثال:
      // await sendDownloadEmail({
      //   email: customerEmail,
      //   orderId: order.id,
      //   downloadUrl: order.downloadUrl
      // });
    }

    // ⏳ معالجة حالة الانتظار
    else if (paymentStatus === "pending") {
      console.log("⏳ Payment is pending...");
      
      // حفظ كطلب معلق
      let order = findOrderByPaymentId(paymentId);
      if (!order) {
        createOrder({
          id: `order_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          paymentId: paymentId,
          status: 'pending',
          amount: amount,
          currency: currency,
          customerEmail: customerEmail,
          customerName: customerName,
          items: items,
          createdAt: new Date().toISOString()
        });
      }

      // إرسال إشعار Discord
      try {
        await sendDiscordNotification({
          paymentId: paymentId,
          amount: amount,
          currency: currency,
          status: 'pending',
          customerEmail: customerEmail,
          customerName: customerName
        });
      } catch (e) {
        console.error("❌ Error sending Discord notification:", e);
      }
    }

    // ❌ معالجة حالة فشل الدفع
    else if (paymentStatus === "failed" || paymentStatus === "cancelled") {
      console.log("❌ Payment failed or cancelled");
      console.log(`📝 Reason: ${body.failure_reason || body.cancellation_reason || "Unknown"}`);
      
      // تحديث الطلب
      updateOrderByPaymentId(paymentId, {
        status: 'failed'
      });

      // إرسال إشعار Discord
      try {
        await sendDiscordNotification({
          paymentId: paymentId,
          amount: amount,
          currency: currency,
          status: 'failed',
          customerEmail: customerEmail,
          customerName: customerName
        });
      } catch (e) {
        console.error("❌ Error sending Discord notification:", e);
      }
    }

    // 🔄 معالجة حالة الاسترجاع
    else if (paymentStatus === "refunded") {
      console.log("🔄 Payment was refunded");
      
      // تحديث الطلب
      updateOrderByPaymentId(paymentId, {
        status: 'refunded'
      });

      // إرسال إشعار Discord
      try {
        await sendDiscordNotification({
          paymentId: paymentId,
          amount: amount,
          currency: currency,
          status: 'refunded',
          customerEmail: customerEmail,
          customerName: customerName
        });
      } catch (e) {
        console.error("❌ Error sending Discord notification:", e);
      }
    }

    const processingTime = Date.now() - startTime;
    console.log(`⏱️ Webhook processed in ${processingTime}ms`);

    // ✅ الرد على Ziina بنجاح استلام الـ webhook
    return NextResponse.json({ 
      received: true,
      message: "Webhook processed successfully",
      event: eventType,
      status: paymentStatus,
      payment_id: paymentId,
      processing_time_ms: processingTime
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Webhook processing error:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // ⚠️ من المهم الرد بـ 200 حتى لو حدث خطأ
    // لتجنب إعادة إرسال الـ webhook من Ziina بشكل متكرر
    return NextResponse.json({ 
      error: "Webhook processing failed",
      message: error.message 
    }, { status: 200 });
  }
}

// 🔍 GET endpoint للتحقق من أن الـ webhook يعمل
export async function GET() {
  const config = {
    signatureVerification: !!process.env.ZIINA_WEBHOOK_SECRET,
    discordNotifications: !!process.env.DISCORD_WEBHOOK_URL,
    blobStorage: !!process.env.BLOB_READ_WRITE_TOKEN,
  };

  return NextResponse.json({ 
    status: "active",
    message: "Ziina webhook endpoint is ready",
    endpoint: "/api/ziina-webhook",
    methods: ["POST", "GET"],
    features: {
      signatureVerification: config.signatureVerification ? "✅ Enabled" : "⚠️ Disabled",
      discordNotifications: config.discordNotifications ? "✅ Enabled" : "⚠️ Disabled",
      blobStorage: config.blobStorage ? "✅ Enabled" : "⚠️ Disabled",
      database: "✅ Enabled (JSON)"
    },
    timestamp: new Date().toISOString()
  });
}
