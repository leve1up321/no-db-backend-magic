import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getCurrencySymbol, subunitMap, type Currency } from "@/lib/currency";
import { findOrderBySessionId, updateOrder } from "@/lib/orders-store";

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

    console.log("🔍 Searching for order with payment ID:", paymentId);
    
    // 🆕 البحث عن الطلب في orders store باستخدام payment_intent ID
    const order = await findOrderBySessionId(paymentId);
    
    if (!order) {
      console.error("❌ No order found for payment ID:", paymentId);
      
      // إرسال تنبيه للإدارة
      try {
        await resend.emails.send({
          from: "Leve1Up System <support@leve1up.store>",
          to: "leve1upbackup@gmail.com",
          subject: "⚠️ دفع ناجح لكن لم يتم العثور على الطلب",
          html: `
            <div style="font-family:Arial;padding:20px">
              <h3>⚠️ تم استلام دفع ناجح لكن لم يتم العثور على الطلب المرتبط</h3>
              <p><strong>Payment ID:</strong> ${paymentId}</p>
              <p><strong>المبلغ:</strong> ${amount} ${currencySymbol}</p>
              <p><strong>الرسالة:</strong> ${message}</p>
            </div>
          `,
        });
      } catch (alertError) {
        console.error("🚨 Failed to send admin alert:", alertError);
      }
      
      return NextResponse.json({ received: true, error: "Order not found" }, { status: 200 });
    }

    console.log("✅ Order found:", order.id);
    console.log("📧 Customer email:", order.customerEmail);
    console.log("📦 Order items:", order.items?.length || 0);
    
    const customerEmail = order.customerEmail;
    const orderItems = order.items || [];
    
    // تحديث حالة الطلب
    await updateOrder(order.id, { status: 'completed', paidAt: new Date().toISOString() });
    console.log("✅ Order status updated to completed");
    
    // استخدام بيانات الطلب
    const productName = orderItems.length === 1 
      ? orderItems[0].name 
      : `${orderItems.length} منتجات`;

    console.log("🎯 Ready to send email to:", customerEmail);
    console.log("💰 Amount:", amount, currencySymbol);
    console.log("📦 Items count:", orderItems.length);

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
        
        // بناء قائمة المنتجات لعرضها في الإيميل
        const productsListHtml = orderItems.map(item => `
          <div style="background:#fff;padding:15px;border-radius:6px;margin:10px 0;border:1px solid #e5e7eb">
            <p style="margin:5px 0;font-size:16px"><strong>📦 ${item.name}</strong></p>
            <p style="margin:5px 0;color:#666">الكمية: ${item.quantity || 1}</p>
          </div>
        `).join('');
        
        const downloadUrl = order.downloadUrl || "https://leve1up.store/files/default.pdf";
        
        const emailResponse = await resend.emails.send({
          from: "Leve1Up Store <support@leve1up.store>",
          to: customerEmail as string,
          subject: `تم استلام دفعتك بنجاح - ${productName}`,
          html: `
            <div style="font-family:Arial;padding:20px;background:#f9f9f9">
              <div style="max-width:600px;margin:0 auto;background:white;padding:30px;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1)">
                <h2 style="color:#16a34a">🎉 شكراً لشرائك من Leve1Up!</h2>
                <p style="font-size:16px;color:#333">تم استلام دفعتك بنجاح.</p>
                
                <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin:20px 0">
                  <h3 style="margin-top:0;color:#333">📦 المنتجات المشتراة:</h3>
                  ${productsListHtml}
                  
                  <div style="border-top:2px solid #16a34a;margin-top:15px;padding-top:15px">
                    <p style="margin:10px 0;font-size:18px"><strong>💰 المجموع الكلي:</strong> ${amount} ${currencySymbol}</p>
                    <p style="margin:10px 0;color:#666"><strong>🔢 رقم العملية:</strong> ${paymentId}</p>
                  </div>
                </div>
                
                <p style="background:#fef3c7;padding:15px;border-radius:6px;border-left:4px solid #f59e0b">
                  <strong>📧 روابط التحميل:</strong><br/>
                  سيتم إرسال روابط تحميل المنتجات إلى بريدك الإلكتروني خلال دقائق. 
                  إذا لم تستلم الروابط، تواصل معنا.
                </p>
                
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
          const itemsList = orderItems.map(item => `- ${item.name} (الكمية: ${item.quantity || 1})`).join('\n');
          
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
                <p><strong>المنتجات:</strong></p>
                <pre>${itemsList}</pre>
                <hr/>
                <p style="color:#666">يُرجى إرسال البريد يدوياً للعميل على: ${customerEmail}</p>
                <p style="color:#999;font-size:12px">السبب: ${error instanceof Error ? error.message : 'خطأ غير معروف'}</p>
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
