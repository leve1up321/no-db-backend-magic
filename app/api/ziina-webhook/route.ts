import { NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend only when API key is available
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ RESEND_API_KEY not configured");
    return null;
  }
  return new Resend(apiKey);
};

/**
 * 🎯 Ziina Webhook Handler - احترافي ومخصص لـ Leve1Up Store
 * 
 * المميزات:
 * ✅ معالجة حدث payment_intent.status.updated الحقيقي من Ziina
 * ✅ إرسال البريد الإلكتروني تلقائيًا عبر ReSend
 * ✅ استخراج البيانات من metadata
 * ✅ تسجيل كامل في Console Logs للمتابعة من Vercel
 * ✅ يرجع دائمًا 200 OK لتفادي إعادة الإرسال
 * 
 * الاستخدام:
 * 1. ارفع المشروع على Vercel
 * 2. أضف webhook URL في Ziina Dashboard: https://leve1up.store/api/ziina-webhook
 * 3. أضف المتغيرات البيئية:
 *    - RESEND_API_KEY
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("📦 Webhook received from Ziina:", new Date().toISOString());
    console.log("📦 Webhook payload:", JSON.stringify(body, null, 2));

    const event = body?.event;
    const data = body?.data;

    // ✅ التعامل مع الحدث الصحيح من Ziina
    if (event === "payment_intent.status.updated") {
      const status = data?.status;
      const amount = data?.amount ? data.amount / 100 : null;
      const paymentId = data?.id;
      const message = data?.message || "عملية شراء من Leve1Up";

      console.log(`🎯 Event: ${event}, Status: ${status}, Payment ID: ${paymentId}`);

      // ✅ عند اكتمال الدفع
      if (status === "completed") {
        // نحاول استخراج metadata لو كانت موجودة
        const meta = data?.metadata || {};
        const customerEmail = meta.customerEmail || "leve1up.store@gmail.com";
        const productName = meta.productName || "الربح من المنتجات الرقمية";
        const productFile = meta.productFile || "https://leve1up.store/files/digital-products-guide.pdf";

        try {
          const resend = getResend();
          if (!resend) {
            console.error("❌ Cannot send email: RESEND_API_KEY not configured");
            return NextResponse.json({ received: true }, { status: 200 });
          }

          await resend.emails.send({
            from: "Leve1Up Store <support@leve1up.store>",
            to: customerEmail,
            subject: `تم استلام دفعتك بنجاح - ${productName}`,
            html: `
              <div style="font-family:Arial;padding:20px">
                <h2>🎉 شكرًا لشرائك من Leve1Up!</h2>
                <p>تم استلام دفعتك بنجاح.</p>
                <p><strong>المنتج:</strong> ${productName}</p>
                <p><strong>المبلغ:</strong> ${amount} درهم</p>
                <p><strong>رقم العملية:</strong> ${paymentId}</p>
                <a href="${productFile}" target="_blank"
                   style="background:#111;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;display:inline-block;margin:10px 0">
                   📦 تحميل المنتج
                </a>
                <p style="color:#666;font-size:13px;margin-top:20px">
                  إذا واجهت أي مشكلة، راسلنا على support@leve1up.store
                </p>
              </div>
            `,
          });
          console.log("📨 Email sent successfully via Resend to:", customerEmail);
        } catch (emailError) {
          console.error("❌ Error sending email:", emailError);
        }
      }
    } else {
      console.log("⚠️ Unknown or unsupported event:", event);
    }

    // ✅ نرجع OK دائمًا حتى لا تكرر Ziina الطلب
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (err) {
    console.error("❌ Webhook Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
