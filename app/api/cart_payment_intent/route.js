import { NextResponse } from "next/server";
import { createOrder } from "@/lib/orders-store";
import { subunitMap } from "@/lib/currency";
import crypto from "crypto";

// 🧮 تحويل المبلغ إلى الوحدة الصغرى (fils, cents, etc)
function convertToSubunit(amount, currency) {
  const multiplier = subunitMap[currency] || 100;
  return Math.round(amount * multiplier);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { cartItems, totalAmount, currency, customerEmail } = body;

    // 🧾 توليد sessionId فريد محلياً
    const sessionId = crypto.randomUUID();
    console.log("🆕 Generated sessionId:", sessionId);

    // 🧩 متغيرات البيئة
    const apiKey = process.env.ZIINA_SECRET_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!apiKey) {
      console.error("❌ ZIINA_SECRET_KEY is not set!");
      return NextResponse.json(
        { error: "ZIINA_SECRET_KEY is not configured" },
        { status: 500 }
      );
    }

    if (!appUrl) {
      console.error("❌ NEXT_PUBLIC_APP_URL is not set!");
      return NextResponse.json(
        { error: "NEXT_PUBLIC_APP_URL is not configured" },
        { status: 500 }
      );
    }

    // 🛒 التحقق من بيانات السلة
    const items = cartItems || [];
    const finalCurrency = currency || "AED";
    const email = customerEmail || "";

    if (!email) {
      console.error("🚨 CRITICAL: No customer email provided!");
      return NextResponse.json(
        { error: "يرجى إدخال البريد الإلكتروني" },
        { status: 400 }
      );
    }

    if (totalAmount <= 0) {
      console.error("❌ Invalid total amount:", totalAmount);
      return NextResponse.json(
        { error: "Cart total must be greater than 0" },
        { status: 400 }
      );
    }

    // 💰 تحويل المبلغ إلى الوحدة الصغرى (فلس / سنت)
    const amountInSubunit = convertToSubunit(totalAmount, finalCurrency);
    console.log(`💰 Converted amount (${finalCurrency} subunit):`, amountInSubunit);

    // ⏰ إعداد صلاحية الدفع (10 دقائق)
    const expiry = (Date.now() + 10 * 60 * 1000).toString();
    console.log("⏰ Expiry date:", new Date(parseInt(expiry)).toISOString());

    // 📝 الرسالة المختصرة
    const message =
      items.length === 1 ? `دفع لمنتج واحد` : `دفع لـ ${items.length} منتجات`;

    // 📦 بيانات الدفع المرسلة إلى Ziina
    const paymentData = {
      amount: amountInSubunit,
      currency_code: finalCurrency,
      message,
      success_url: `${appUrl}/success?session=${sessionId}`,
      cancel_url: `${appUrl}/cancel?session=${sessionId}`,
      failure_url: `${appUrl}/cancel?session=${sessionId}`,
      test: true,
      expiry,
      allow_tips: false,
      metadata: {
        sessionId,
        customerEmail: email,
        cartItems: items,
      },
    };

    console.log("📤 Sending cart payment data:", JSON.stringify(paymentData, null, 2));

    const response = await fetch("https://api-v2.ziina.com/api/payment_intent", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("❌ Failed to parse JSON response:", text);
      return NextResponse.json(
        { error: "Ziina returned invalid response", details: text },
        { status: 502 }
      );
    }

    if (!response.ok || !data.redirect_url) {
      console.error("❌ Error from Ziina:", JSON.stringify(data, null, 2));
      return NextResponse.json(
        { error: "Failed to create payment intent", details: data },
        { status: response.status }
      );
    }

    const paymentIntentId = data.id;
    console.log("✅ Payment Intent created:", paymentIntentId);
    console.log("✅ Redirect URL:", data.redirect_url);

    // 📝 إنشاء الطلب وتخزينه محلياً
    const orderId = `order_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 8)}`;

    const savedOrder = await createOrder({
      id: orderId,
      sessionId, // 🧩 نستخدم sessionId المحلي
      paymentId: paymentIntentId, // من Ziina
      status: "pending",
      amount: totalAmount,
      currency: finalCurrency,
      customerEmail: email,
      items: items.map((item: any) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity || 1,
        price: item.price,
        image: item.image,
        downloadUrl: item.download_url || item.downloadUrl,
      })),
      createdAt: new Date().toISOString(),
      metadata: {
        paymentIntentId,
        sessionId,
        customerEmail: email,
      },
    });

    console.log("✅ Order saved successfully:", savedOrder.id);

    // 🧪 اختبار سريع لاسترجاع الطلب
    const { findOrderBySessionId } = await import("@/lib/orders-store");
    const testOrder = await findOrderBySessionId(sessionId);
    console.log("🧪 Order retrieval test:", !!testOrder);

    return NextResponse.json({
      success: true,
      redirect_url: data.redirect_url,
      payment_intent_id: paymentIntentId,
      session_id: sessionId,
      total_amount: totalAmount,
      items_count: items.length,
    });
  } catch (error: any) {
    console.error("💥 Cart Payment Intent Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
