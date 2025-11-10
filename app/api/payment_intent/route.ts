import { NextResponse } from "next/server";
import { saveOrder } from "@/lib/orders-store";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { amount, currency_code, productName, productFile, customerEmail } = await req.json();

    const finalCurrency = currency_code || "AED";

    console.log("💰 Received amount:", amount, finalCurrency);
    console.log("📦 Product:", productName);
    console.log("📧 Customer email:", customerEmail);

    /**
     * 🧮 خريطة تحويل العملات إلى الوحدة الأدق (subunit)
     * Ziina تتطلب أن يُرسل المبلغ بالوحدة الأدق:
     * - AED, SAR, USD, EUR, GBP, INR, QAR = ×100
     * - BHD, KWD, OMR = ×1000
     */
    const subunitMap: Record<string, number> = {
      AED: 100,
      SAR: 100,
      BHD: 1000,
      KWD: 1000,
      OMR: 1000,
      QAR: 100,
      USD: 100,
      EUR: 100,
      GBP: 100,
      INR: 100,
    };

    const multiplier = subunitMap[finalCurrency] || 100;

    // 🔢 تحويل المبلغ إلى الوحدة الأدق
    const amountInSubunit = Math.round(amount * multiplier);

    // 🚨 تحقق من الحد الأدنى (2 AED أو ما يعادله)
    const minSubunit = finalCurrency === "BHD" || finalCurrency === "KWD" || finalCurrency === "OMR" ? 210 : 200;

    if (amountInSubunit < minSubunit) {
      console.error(`❌ الحد الأدنى للدفع هو ${minSubunit / multiplier} ${finalCurrency}`);
      return NextResponse.json(
        { error: `الحد الأدنى للدفع هو ${minSubunit / multiplier} ${finalCurrency}` },
        { status: 400 }
      );
    }

    const payload = {
      amount: amountInSubunit,
      currency_code: finalCurrency,
      message: `دفع مقابل ${productName}`,
      metadata: {
        productName,
        productFile,
        customerEmail,
      },
      success_url: "https://leve1up.store/success?payment_intent={CHECKOUT_SESSION_ID}",
      cancel_url: "https://leve1up.store/cancel",
      failure_url: "https://leve1up.store/cancel",
      test: true,
      allow_tips: false,
    };

    console.log("📤 Sending payload to Ziina:", JSON.stringify(payload, null, 2));

    const res = await fetch("https://api-v2.ziina.com/api/payment_intent", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.ZIINA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("❌ Error from Ziina:", err);
      return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 });
    }

    const data = await res.json();
    const paymentIntentId = data.id;
    console.log("✅ Payment intent created:", paymentIntentId);
    
    // 💾 حفظ الطلب في Redis قبل إرجاع الرابط للعميل
    const orderId = `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    
    try {
      await saveOrder({
        id: orderId,
        paymentId: paymentIntentId,
        status: 'pending',
        amount: amount,
        currency: currency_code || 'AED',
        customerEmail: customerEmail || '',
        items: [{
          id: 0,
          name: productName || 'منتج رقمي',
          quantity: 1,
          price: amount,
          downloadUrl: productFile || ''
        }],
        createdAt: new Date().toISOString(),
        metadata: {
          productName,
          productFile,
          paymentIntentId
        }
      });
      
      console.log("💾 Order saved successfully:", orderId);
    } catch (saveError) {
      console.error("⚠️ Failed to save order (payment will still proceed):", saveError);
    }
    
    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Error creating payment intent:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
