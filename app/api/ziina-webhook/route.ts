import { NextResponse } from "next/server";
import { getCurrencySymbol, subunitMap, type Currency } from "@/lib/currency";
import { findOrderBySessionId, findOrderByPaymentId, updateOrder } from "@/lib/orders-store";
import { Resend } from "resend";

// 📧 دالة للحصول على Resend client (lazy initialization)
const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

// دالة تحويل من الوحدة الصغرى إلى المبلغ الأساسي
function convertFromSubunit(amount: number, currency: string): number {
  const divisor = subunitMap[currency as Currency] || 100;
  return amount / divisor;
}

/**
 * ✉️ إرسال إيميل تأكيد الدفع مع روابط التحميل
 */
async function sendOrderEmail(order: any, amount: number, currency: string): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY not configured, skipping email');
    return false;
  }

  try {
    const currencySymbol = getCurrencySymbol(currency as Currency);
    const items = order.items || [];
    
    // بناء قائمة المنتجات مع روابط التحميل
    const productsHtml = items.map((item: any) => `
      <div style="background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 8px;">
        <h3 style="margin: 0 0 10px 0; color: #333;">${item.name}</h3>
        <p style="margin: 5px 0; color: #666;">السعر: ${item.price} ${currencySymbol}</p>
        ${item.downloadUrl ? `
          <a href="${item.downloadUrl}" 
             style="display: inline-block; margin-top: 10px; padding: 10px 20px; background: #10b981; color: white; text-decoration: none; border-radius: 6px;">
            📥 تحميل المنتج
          </a>
        ` : ''}
      </div>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>تأكيد الدفع</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background: #f5f5f5; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">✅ تم الدفع بنجاح!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">شكراً لثقتك في Leve1Up</p>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              مرحباً،
            </p>
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              تم استلام دفعتك بنجاح! يمكنك الآن تحميل منتجاتك من الروابط أدناه:
            </p>

            <!-- Products -->
            <div style="margin: 20px 0;">
              ${productsHtml}
            </div>

            <!-- Total -->
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 18px; color: #333; font-weight: bold;">المجموع الكلي:</span>
                <span style="font-size: 24px; color: #10b981; font-weight: bold;">${amount} ${currencySymbol}</span>
              </div>
            </div>

            <!-- Support Info -->
            <div style="background: #fef3c7; border-right: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 8px;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">💡 هل تحتاج مساعدة؟</p>
              <p style="margin: 5px 0 0 0; color: #78350f;">
                تواصل معنا على: <a href="mailto:support@leve1up.store" style="color: #f59e0b;">support@leve1up.store</a>
              </p>
            </div>

            <p style="font-size: 14px; color: #666; line-height: 1.6; margin-top: 30px;">
              مع أطيب التحيات،<br/>
              <strong>فريق Leve1Up</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
              © ${new Date().getFullYear()} Leve1Up. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const resend = getResend();
    if (!resend) {
      console.warn('⚠️ Resend client not available');
      return false;
    }
    
    const result = await resend.emails.send({
      from: 'Leve1Up <onboarding@resend.dev>', // استبدلها بدومينك المُحقق
      to: [order.customerEmail],
      subject: `✅ تأكيد الدفع - Leve1Up`,
      html: emailHtml,
    });

    console.log('✉️ Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
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

    // 🔍 البحث عن الطلب في orders store باستخدام payment_intent ID
    const order = await findOrderByPaymentId(paymentId);
    
    if (!order) {
      // ℹ️ لا يوجد طلب في Redis - هذا طبيعي مع localStorage
      console.info("ℹ️ No order found for payment ID:", paymentId);
      console.info("📝 Payment details - Amount:", amount, currencySymbol);
      console.info("💡 Order delivered via client-side (localStorage)");
      
      return NextResponse.json({ 
        received: true, 
        note: "Order delivered via client-side localStorage" 
      }, { status: 200 });
    }

    console.log("✅ Order found:", order.id);
    console.log("📧 Customer email:", order.customerEmail);
    console.log("📦 Order items:", order.items?.length || 0);
    
    // 🟢 تحديث حالة الطلب إلى paid
    const updatedOrder = await updateOrder(order.id, { 
      status: 'paid',
      paidAt: new Date().toISOString() 
    });
    
    if (!updatedOrder) {
      console.error("❌ Failed to update order status");
      return NextResponse.json({ received: true, error: "Update failed" }, { status: 200 });
    }
    
    console.log("🟢 Order updated: paid");
    
    // ✉️ إرسال إيميل تأكيد
    const emailSent = await sendOrderEmail(updatedOrder, amount, currencyCode);
    
    if (emailSent) {
      console.log("✉️ Email sent successfully to:", updatedOrder.customerEmail);
    } else {
      console.warn("⚠️ Email not sent (customer can still download from success page)");
    }
    
    console.log("✅ Payment processed successfully!");
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
