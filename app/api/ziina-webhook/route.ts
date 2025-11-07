import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();

  console.log("📦 Webhook received from Ziina:", new Date().toISOString());
  console.log("📦 Payload:", JSON.stringify(body, null, 2));

  const event = body?.event;
  const data = body?.data;

  // فقط نهتم بحدث الدفع الناجح
  if (event === "payment_intent.status.updated" || data?.status === "completed") {
    const status = data?.status;
    const amount = data?.amount ? data.amount / 100 : null;
    const paymentId = data?.id;
    const message = data?.message || "عملية شراء من Leve1Up";

    // نحاول التقاط البريد من بيانات الدفع أو metadata
    const meta = data?.metadata || {};
    const customerEmail =
      meta.customerEmail ||
      data?.customer_email ||
      "leve1upbackup@gmail.com"; // بريد احتياطي في حال لم يُرسل Ziina الإيميل

    const productName = meta.productName || "الربح من المنتجات الرقمية";
    const productFile =
      meta.productFile || "https://leve1up.store/files/digital-products-guide.pdf";

    console.log("🎯 Ready to send email to:", customerEmail);

    if (status === "completed") {
      try {
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

        console.log(`📨 Email sent successfully to: ${customerEmail}`);
      } catch (error) {
        console.error("❌ Error sending email:", error);

        // لو فشل الإرسال، نحاول إرسال نسخة إلى بريدك الاحتياطي
        try {
          await resend.emails.send({
            from: "Leve1Up System <support@leve1up.store>",
            to: "leve1upbackup@gmail.com",
            subject: "⚠️ فشل إرسال الإيميل للعميل - إعادة توجيه النسخة",
            html: `
              <div style="font-family:Arial;padding:20px">
                <h3>⚠️ فشل إرسال البريد للعميل</h3>
                <p>البريد الأصلي: ${customerEmail}</p>
                <p>رقم العملية: ${paymentId}</p>
                <p>المبلغ: ${amount} درهم</p>
              </div>
            `,
          });

          console.log("📨 Backup email sent successfully!");
        } catch (backupError) {
          console.error("🚨 Failed to send backup email as well:", backupError);
        }
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
