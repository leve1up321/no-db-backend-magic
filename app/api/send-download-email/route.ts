import { NextRequest, NextResponse } from 'next/server';

// Import SendGrid (install with: npm install @sendgrid/mail)
// import sgMail from '@sendgrid/mail';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, token, productName, orderId } = body;

    // Validate
    if (!email || !token || !productName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate download link
    const downloadLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-site.com'}/api/download/${token}`;
    const whatsappLink = `https://wa.me/966XXXXXXXXX`; // Replace with your WhatsApp number

    // Email template
    const emailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #6A0DAD 0%, #FF6B9D 100%); padding: 40px 20px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { padding: 40px 30px; }
          .success-icon { width: 80px; height: 80px; margin: 0 auto 20px; background: #10B981; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px; }
          .download-btn { display: inline-block; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; font-size: 16px; }
          .info-box { background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .whatsapp-link { color: #25D366; text-decoration: none; font-weight: bold; }
          .footer { background: #F9FAFB; padding: 20px; text-align: center; color: #6B7280; font-size: 14px; }
          .note { background: #FEF3C7; border-right: 4px solid #F59E0B; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 شكراً لك!</h1>
          </div>
          
          <div class="content">
            <div class="success-icon">✓</div>
            
            <h2 style="text-align: center; color: #1F2937;">تم إنشاء طلبك بنجاح</h2>
            
            <div class="info-box">
              <p style="margin: 5px 0;"><strong>المنتج:</strong> ${productName}</p>
              <p style="margin: 5px 0;"><strong>رقم الطلب:</strong> ${orderId}</p>
              <p style="margin: 5px 0;"><strong>البريد الإلكتروني:</strong> ${email}</p>
            </div>

            <p style="text-align: center; font-size: 16px; color: #4B5563;">
              يمكنك الآن تحميل منتجك الرقمي مباشرة من خلال الضغط على الزر أدناه:
            </p>

            <div style="text-align: center;">
              <a href="${downloadLink}" class="download-btn">
                📥 تحميل المنتج الآن
              </a>
            </div>

            <div class="note">
              <p style="margin: 0; color: #92400E;">
                <strong>⏰ ملاحظة هامة:</strong> رابط التحميل صالح لمدة 30 دقيقة فقط للحفاظ على أمان المنتج.
              </p>
            </div>

            <p style="color: #6B7280; font-size: 14px; text-align: center;">
              إذا واجهت أي مشكلة في التحميل، يمكنك التواصل معنا مباشرة عبر 
              <a href="${whatsappLink}" class="whatsapp-link">واتساب</a>
            </p>
          </div>

          <div class="footer">
            <p>© 2025 LEVEL UP. جميع الحقوق محفوظة.</p>
            <p>هذا البريد الإلكتروني تم إرساله إلى ${email}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // TODO: Configure SendGrid
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    // 
    // await sgMail.send({
    //   to: email,
    //   from: 'noreply@your-site.com', // Your verified sender
    //   subject: `تحميل منتجك: ${productName}`,
    //   html: emailHtml,
    // });

    // For now, just log (remove in production)
    console.log('Email would be sent to:', email);
    console.log('Download link:', downloadLink);

    return NextResponse.json({
      success: true,
      message: 'تم إرسال البريد الإلكتروني بنجاح',
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

