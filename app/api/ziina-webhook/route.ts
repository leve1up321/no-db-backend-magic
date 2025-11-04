import { NextRequest, NextResponse } from "next/server";

/**
 * 🎯 Ziina Webhook Handler
 * 
 * يستقبل إشعارات من Ziina عند تحديث حالة الدفع
 * 
 * الاستخدام:
 * 1. ارفع المشروع على Vercel
 * 2. اذهب لـ Ziina Dashboard
 * 3. أضف webhook URL: https://your-domain.vercel.app/api/ziina-webhook
 * 4. احفظ الـ webhook secret في متغيرات البيئة ZIINA_WEBHOOK_SECRET
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 📝 تسجيل البيانات المستلمة
    console.log("📩 Webhook received from Ziina at:", new Date().toISOString());
    console.log("📦 Webhook payload:", JSON.stringify(body, null, 2));

    // 🔐 التحقق من التوقيع (إذا كان لديك webhook secret)
    const signature = req.headers.get("x-ziina-signature");
    const webhookSecret = process.env.ZIINA_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      // TODO: يمكنك إضافة التحقق من التوقيع هنا
      console.log("🔐 Webhook signature:", signature);
      
      // مثال على التحقق (حسب توثيق Ziina):
      // const crypto = require('crypto');
      // const expectedSignature = crypto
      //   .createHmac('sha256', webhookSecret)
      //   .update(JSON.stringify(body))
      //   .digest('hex');
      // 
      // if (signature !== expectedSignature) {
      //   console.error("❌ Invalid webhook signature");
      //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      // }
    }

    // 📊 معالجة أنواع الأحداث المختلفة
    const eventType = body.event || body.type;
    const paymentStatus = body.status;
    const paymentId = body.id || body.payment_intent_id;
    const amount = body.amount;
    const currency = body.currency_code;

    console.log(`🎯 Event: ${eventType}, Status: ${paymentStatus}, Payment ID: ${paymentId}`);

    // ✅ معالجة حالة نجاح الدفع
    if (paymentStatus === "succeeded" || paymentStatus === "completed") {
      console.log("✅ Payment succeeded!");
      console.log(`💰 Amount: ${amount} ${currency}`);
      
      // 📧 هنا يمكنك:
      // 1. إرسال بريد إلكتروني للعميل برابط التحميل
      // 2. تحديث حالة الطلب في قاعدة البيانات
      // 3. إرسال إشعار للإدمن
      
      // مثال: إرسال بريد إلكتروني
      // await sendDownloadEmail({
      //   email: body.customer_email,
      //   orderId: paymentId,
      //   amount: amount,
      //   currency: currency
      // });

      // مثال: حفظ في قاعدة بيانات
      // await db.orders.create({
      //   data: {
      //     paymentId: paymentId,
      //     status: "paid",
      //     amount: amount,
      //     currency: currency,
      //     paidAt: new Date(),
      //   }
      // });
    }

    // ⏳ معالجة حالة الانتظار
    else if (paymentStatus === "pending") {
      console.log("⏳ Payment is pending...");
      // يمكنك إرسال إشعار بأن الدفع قيد المعالجة
    }

    // ❌ معالجة حالة فشل الدفع
    else if (paymentStatus === "failed" || paymentStatus === "cancelled") {
      console.log("❌ Payment failed or cancelled");
      console.log(`📝 Reason: ${body.failure_reason || body.cancellation_reason || "Unknown"}`);
      
      // يمكنك إرسال إشعار للعميل بفشل الدفع
      // await sendFailureEmail({
      //   email: body.customer_email,
      //   reason: body.failure_reason
      // });
    }

    // 🔄 معالجة حالة الاسترجاع
    else if (paymentStatus === "refunded") {
      console.log("🔄 Payment was refunded");
      
      // يمكنك:
      // 1. تحديث حالة الطلب
      // 2. إرسال بريد تأكيد الاسترجاع
    }

    // ✅ الرد على Ziina بنجاح استلام الـ webhook
    return NextResponse.json({ 
      received: true,
      message: "Webhook processed successfully",
      event: eventType,
      status: paymentStatus,
      payment_id: paymentId
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
  return NextResponse.json({ 
    status: "active",
    message: "Ziina webhook endpoint is ready",
    endpoint: "/api/ziina-webhook",
    methods: ["POST"],
    timestamp: new Date().toISOString()
  });
}

