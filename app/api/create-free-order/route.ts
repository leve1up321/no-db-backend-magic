import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { createOrder } from '@/lib/orders-store';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, productId, productName, downloadUrl } = body;

    // Validate required fields
    if (!email || !productId || !productName || !downloadUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique order ID and token
    const orderId = nanoid(16);
    const token = nanoid(32);
    
    // Set expiry time (7 days from now for download link)
    const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000);

    // Create order using shared store
    const order = createOrder({
      id: orderId,
      sessionId: token,
      status: 'paid', // Free products are automatically "paid"
      amount: 0,
      currency: 'SAR',
      customerEmail: email,
      items: [{
        id: productId,
        name: productName,
        quantity: 1,
        price: 0,
      }],
      downloadUrl,
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      metadata: {
        isFree: true,
        expiresAt,
        phone,
      }
    });

    console.log('🎁 Free product order created:', orderId);
    console.log('📧 Sending email to:', email);
    console.log('📧 Product:', productName);
    console.log('📧 Download URL:', downloadUrl);

    // إرسال البريد الإلكتروني
    try {
      console.log('📤 Attempting to send free product email via Resend...');
      console.log('📤 To:', email);
      console.log('📤 From:', 'Leve1Up Store <support@leve1up.store>');
      
      const emailResponse = await resend.emails.send({
        from: 'Leve1Up Store <support@leve1up.store>',
        to: email,
        subject: `🎁 منتجك المجاني جاهز - ${productName}`,
        html: `
          <div style="font-family:Arial;padding:20px;background:#f9f9f9">
            <div style="max-width:600px;margin:0 auto;background:white;padding:30px;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1)">
              <h2 style="color:#16a34a">🎉 مبروك! منتجك المجاني جاهز</h2>
              <p style="font-size:16px;color:#333">شكراً لاختيارك Leve1Up!</p>
              
              <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin:20px 0">
                <p style="margin:10px 0"><strong>💼 المنتج:</strong> ${productName}</p>
                <p style="margin:10px 0"><strong>🔢 رقم الطلب:</strong> ${orderId}</p>
                <p style="margin:10px 0"><strong>⏰ صالح حتى:</strong> ${new Date(expiresAt).toLocaleDateString('ar-SA')}</p>
              </div>
              
              <a href="${downloadUrl}" target="_blank"
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

      console.log('✅ Resend API Response:', JSON.stringify(emailResponse, null, 2));
      console.log('✅ Email sent successfully to:', email);
    } catch (emailError) {
      console.error('❌ Error sending email to customer:', emailError);

      // إرسال نسخة احتياطية في حال فشل الإرسال للعميل
      try {
        await resend.emails.send({
          from: 'Leve1Up System <support@leve1up.store>',
          to: 'leve1upbackup@gmail.com',
          subject: '⚠️ فشل إرسال إيميل منتج مجاني - إعادة توجيه',
          html: `
            <div style="font-family:Arial;padding:20px">
              <h3>⚠️ فشل إرسال البريد للعميل</h3>
              <p><strong>البريد الأصلي:</strong> ${email}</p>
              <p><strong>رقم الطلب:</strong> ${orderId}</p>
              <p><strong>المنتج:</strong> ${productName}</p>
              <p><strong>رابط التحميل:</strong> <a href="${downloadUrl}">${downloadUrl}</a></p>
              <hr/>
              <p style="color:#666">يُرجى إرسال البريد يدوياً للعميل على: ${email}</p>
            </div>
          `,
        });
        console.log('📨 Backup email sent to leve1upbackup@gmail.com');
      } catch (backupError) {
        console.error('🚨 Failed to send backup email:', backupError);
      }
    }

    // Return order details
    return NextResponse.json({
      success: true,
      orderId: order.id,
      token,
      expiresAt,
    });

  } catch (error) {
    console.error('Error creating free order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
