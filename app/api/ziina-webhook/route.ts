import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getCurrencySymbol, subunitMap, type Currency } from "@/lib/currency";

const resend = new Resend(process.env.RESEND_API_KEY);

// دالة تحويل من الوحدة الصغرى إلى المبلغ الأساسي
function convertFromSubunit(amount: number, currency: string): number {
  const divisor = subunitMap[currency as Currency] || 100;
  return amount / divisor;
}

export async function POST(req: Request) {
  const body = await req.json();

  console.log("📦 Webhook received from Ziina:", new Date().toISOString());
  console.log("📦 Payload:", JSON.stringify(body, null, 2));

  const event = body?.event;
  const data = body?.data;

  // فقط نهتم بحدث الدفع الناجح
  if (event === "payment_intent.status.updated" || data?.status === "completed") {
    const status = data?.status;
    const currencyCode = data?.currency_code || data?.currency || "SAR";
    const amountInSubunit = data?.amount || 0;
    // تحويل من الوحدة الصغرى إلى المبلغ الأساسي
    const amount = convertFromSubunit(amountInSubunit, currencyCode);
    const currencySymbol = getCurrencySymbol(currencyCode as Currency);
    const paymentId = data?.id;
    const message = data?.message || "عملية شراء من Leve1Up";

    // نحاول التقاط البريد من بيانات الدفع أو metadata
    const meta = data?.metadata || {};
    const customerEmail = meta.customerEmail || data?.customer_email;

    // إذا لم يكن هناك بريد إلكتروني، نرسل تنبيه فقط
    if (!customerEmail) {
      console.error("❌ No customer email found in webhook data!");
      console.log("📦 Metadata:", JSON.stringify(meta, null, 2));
      
      // إرسال تنبيه للإدارة فقط
      try {
        await resend.emails.send({
          from: "Leve1Up System <support@leve1up.store>",
          to: "leve1upbackup@gmail.com",
          subject: "⚠️ دفع ناجح بدون بريد إلكتروني",
          html: `
            <div style="font-family:Arial;padding:20px">
              <h3>⚠️ تم استلام دفع ناجح لكن لا يوجد بريد إلكتروني للعميل</h3>
              <p><strong>رقم العملية:</strong> ${paymentId}</p>
              <p><strong>المبلغ:</strong> ${amount} ${currencySymbol}</p>
              <p><strong>Metadata:</strong></p>
              <pre>${JSON.stringify(meta, null, 2)}</pre>
            </div>
          `,
        });
      } catch (alertError) {
        console.error("🚨 Failed to send admin alert:", alertError);
      }
      
      return NextResponse.json({ received: true, error: "No customer email" }, { status: 200 });
    }

    const productName = meta.productName || "الربح من المنتجات الرقمية";
    const productFile =
      meta.productFile || "https://leve1up.store/files/digital-products-guide.pdf";

    console.log("🎯 Ready to send email to:", customerEmail);
    console.log("💰 Amount:", amount, currencySymbol);
    console.log("📦 Product:", productName);
    console.log("📧 Full metadata:", JSON.stringify(meta, null, 2));

    if (status === "completed") {
      try {
        console.log("📤 Attempting to send email via Resend...");
        console.log("📤 To:", customerEmail);
        console.log("📤 From:", "Leve1Up Store <support@leve1up.store>");
        
        // التأكد المطلق من البريد
        if (customerEmail === "leve1upbackup@gmail.com") {
          console.warn("⚠️ WARNING: Attempting to send to backup email!");
          console.warn("⚠️ This should NOT happen unless no customer email was provided!");
        }
        
        const emailResponse = await resend.emails.send({
          from: "Leve1Up Store <support@leve1up.store>",
          to: customerEmail,
          subject: `تم استلام دفعتك بنجاح - ${productName}`,
          html: `
            <div style="font-family:Arial;padding:20px;background:#f9f9f9">
              <div style="max-width:600px;margin:0 auto;background:white;padding:30px;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1)">
                <h2 style="color:#16a34a">🎉 شكراً لشرائك من Leve1Up!</h2>
                <p style="font-size:16px;color:#333">تم استلام دفعتك بنجاح.</p>
                
                <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin:20px 0">
                  <p style="margin:10px 0"><strong>💼 المنتج:</strong> ${productName}</p>
                  <p style="margin:10px 0"><strong>💰 المبلغ:</strong> ${amount} ${currencySymbol}</p>
                  <p style="margin:10px 0"><strong>🔢 رقم العملية:</strong> ${paymentId}</p>
                </div>
                
                <a href="${productFile}" target="_blank"
                   style="background:#16a34a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin:20px 0;font-weight:bold">
                   📦 تحميل المنتج الآن
                </a>
                
                <p style="color:#666;font-size:14px;margin-top:30px;padding-top:20px;border-top:1px solid #e5e7eb">
                  إذا واجهت أي مشكلة، راسلنا على <a href="mailto:leve1up999q@gmail.com" style="color:#16a34a">leve1up999q@gmail.com</a>
                </p>
                
                <p style="color:#999;font-size:12px;margin-top:10px">
                  هذا البريد تم إرساله تلقائياً من نظام Leve1Up
                </p>
              </div>
            </div>
          `,
        });

        console.log(`✅ Resend API Response:`, JSON.stringify(emailResponse, null, 2));
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
                <p><strong>البريد الأصلي:</strong> ${customerEmail}</p>
                <p><strong>رقم العملية:</strong> ${paymentId}</p>
                <p><strong>المبلغ:</strong> ${amount} ${currencySymbol}</p>
                <p><strong>المنتج:</strong> ${productName}</p>
                <p><strong>رابط التحميل:</strong> <a href="${productFile}">${productFile}</a></p>
                <hr/>
                <p style="color:#666">يُرجى إرسال البريد يدوياً للعميل على: ${customerEmail}</p>
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
