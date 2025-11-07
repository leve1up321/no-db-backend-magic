import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();

  // نطبع نوع الحدث (لو موجود)
  const event = body?.event;
  const type = body?.type;
  const isResend = type && type.startsWith("email.");

  console.log("📦 Webhook received from:", isResend ? "Resend" : "Ziina");
  console.log("📦 Webhook payload:", JSON.stringify(body, null, 2));

  // ✅ الحالة 1: Webhook من Ziina
  if (event === "payment_intent.status.updated") {
    const data = body.data || {};
    const status = data.status;
    const amount = data.amount ? data.amount / 100 : null;
    const paymentId = data.id;
    const message = data.message || "عملية شراء من Leve1Up";

    console.log(`🎯 Event: ${event}, Status: ${status}, Payment ID: ${paymentId}`);

    if (status === "completed") {
      try {
        await resend.emails.send({
          from: "Leve1Up Store <support@leve1up.store>",
          to: "leve1up.store@gmail.com",
          subject: `تم استلام دفعتك بنجاح - ${message}`,
          html: `
            <div style="font-family:Arial;padding:20px">
              <h2>🎉 تم الدفع بنجاح!</h2>
              <p>تم استلام دفعتك بقيمة <strong>${amount} درهم</strong></p>
              <p>رابط المنتج:</p>
              <a href="https://leve1up.store/files/digital-products-guide.pdf" target="_blank">📦 تحميل المنتج</a>
            </div>
          `,
        });

        console.log("📨 Email sent successfully via Resend");
      } catch (error) {
        console.error("❌ Error sending email:", error);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  }

  // ✅ الحالة 2: Webhook من Resend
  if (isResend) {
    console.log(`📧 Email event received from Resend: ${type}`);
    const emailInfo = body.data;
    console.log("📨 Email details:", emailInfo);

    // مجرد تسجيل الحدث — لا نحتاج رد فعل هنا
    return NextResponse.json({ source: "resend", received: true }, { status: 200 });
  }

  // ⚠️ غير معروف
  console.log("⚠️ Unknown or unsupported event:", event || type);
  return NextResponse.json({ received: true }, { status: 200 });
}
