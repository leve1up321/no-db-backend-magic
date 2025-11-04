import { NextRequest, NextResponse } from "next/server";

/**
 * 📧 API لإرسال الإيميلات للعملاء
 * 
 * POST /api/send-email
 * Body: {
 *   to: string,
 *   subject: string,
 *   html: string,
 *   orderId?: string,
 *   downloadUrl?: string
 * }
 * 
 * يرسل إيميل باستخدام خدمة البريد (Resend, SendGrid, etc.)
 */

// ✅ إجبار dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html, orderId, downloadUrl } = await req.json();

    if (!to || !subject || !html) {
      return NextResponse.json({
        success: false,
        message: "جميع الحقول مطلوبة (to, subject, html)"
      }, { status: 400 });
    }

    // التحقق من صحة البريد الإلكتروني
    if (!to.includes('@')) {
      return NextResponse.json({
        success: false,
        message: "البريد الإلكتروني غير صالح"
      }, { status: 400 });
    }

    // 🚨 TODO: دمج مع خدمة البريد الإلكتروني
    // 
    // الخيارات:
    // 1. Resend (الأفضل - سهل ومجاني للبداية)
    // 2. SendGrid
    // 3. AWS SES
    // 4. Mailgun
    // 5. Postmark
    //
    // مثال باستخدام Resend:
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'orders@yourdomain.com',
      to: to,
      subject: subject,
      html: html,
    });
    */

    console.log("📧 Email to send:", {
      to,
      subject,
      orderId,
      downloadUrl,
      preview: html.substring(0, 100) + "..."
    });

    // للتطوير: نرجع success
    // في الإنتاج: يجب إرسال إيميل حقيقي
    return NextResponse.json({
      success: true,
      message: "تم إرسال الإيميل بنجاح (وضع التطوير)",
      emailInfo: {
        to,
        subject,
        orderId,
        hasDownloadUrl: !!downloadUrl
      },
      warning: "في وضع التطوير - لم يتم إرسال إيميل حقيقي. قم بإضافة RESEND_API_KEY للإنتاج"
    });

  } catch (error: any) {
    console.error("❌ Send email error:", error);
    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء إرسال الإيميل",
      error: error.message
    }, { status: 500 });
  }
}

/**
 * 📧 GET endpoint لاختبار إرسال إيميل تجريبي
 */
export async function GET(req: NextRequest) {
  // استخدام req.nextUrl بدلاً من req.url
  const searchParams = req.nextUrl.searchParams;
  const testEmail = searchParams.get("test");

  if (!testEmail) {
    return NextResponse.json({
      success: false,
      message: "أضف ?test=your@email.com لاختبار إرسال إيميل"
    }, { status: 400 });
  }

  // إيميل تجريبي
  const testHTML = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; }
        .header { text-align: center; margin-bottom: 30px; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 شكراً لشرائك من متجرنا!</h1>
        </div>
        <p>مرحباً،</p>
        <p>تم تأكيد طلبك بنجاح! يمكنك الآن تحميل ملفاتك من الرابط أدناه:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="https://example.com/download" class="button">📥 تحميل الملفات</a>
        </p>
        <p><strong>ملاحظة:</strong> رابط التحميل صالح لمدة 7 أيام.</p>
        <div class="footer">
          <p>إذا كان لديك أي أسئلة، لا تتردد في التواصل معنا.</p>
          <p>© 2025 LevelUp Digital Store</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return NextResponse.json({
    success: true,
    message: "معاينة إيميل تجريبي",
    preview: {
      to: testEmail,
      subject: "تأكيد الطلب - LevelUp Store",
      html: testHTML
    },
    instructions: {
      step1: "قم بإضافة RESEND_API_KEY في متغيرات البيئة",
      step2: "قم بتثبيت: npm install resend",
      step3: "قم بإلغاء التعليق على كود Resend في ملف route.ts",
      step4: "تأكد من تفعيل domain في Resend dashboard"
    }
  });
}
