import { NextResponse } from "next/server";
import { createOrder } from "@/lib/orders-store";
import { subunitMap } from "@/lib/currency";

// دالة تحويل المبلغ إلى الوحدة الصغرى (fils, cents, etc)
function convertToSubunit(amount, currency) {
  const multiplier = subunitMap[currency] || 100;
  return Math.round(amount * multiplier);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { cartItems, totalAmount, currency, customerEmail } = body;
    
    // 🔍 التحقق من المتغيرات البيئية
    const apiKey = process.env.ZIINA_SECRET_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    
    console.log("🛒 Cart Payment - API Key exists:", !!apiKey);
    console.log("🛒 Cart Payment - API Key prefix:", apiKey?.substring(0, 10) + "...");
    console.log("🛒 Cart Payment - App URL:", appUrl);
    
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
    
    // 🛒 حساب المبلغ الكلي للسلة
    const items = cartItems || [];
    const finalCurrency = currency || 'AED';
    const email = customerEmail || '';
    
    console.log("🛒 Cart items count:", items.length);
    console.log("🛒 Total amount:", totalAmount, finalCurrency);
    console.log("📧 Customer email:", email);
    
    // 🔴 تحذير حرج إذا لم يكن هناك email
    if (!email || email === '') {
      console.error("🚨 CRITICAL: No customer email provided!");
      console.error("🚨 Request body:", JSON.stringify(body, null, 2));
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
    
    // 🔢 تحويل المبلغ إلى الوحدة الصغرى حسب العملة
    const amountInSubunit = convertToSubunit(totalAmount, finalCurrency);
    console.log(`💰 Converted amount (${finalCurrency} subunit):`, amountInSubunit);
    
    // 📦 بناء الطلب
    // احسب expiry بالميلي ثانية (10 دقائق من الآن)
    // Ziina تتوقع timestamp بالميلي ثانية كـ string
    const expiry = (Date.now() + 10 * 60 * 1000).toString(); // بعد 10 دقائق من الآن
    console.log("⏰ Expiry timestamp (milliseconds, string):", expiry);
    console.log("⏰ Expiry date:", new Date(parseInt(expiry)).toISOString());
    
    // إنشاء رسالة قصيرة (Ziina لها حد أقصى لطول الرسالة)
    const itemCount = items.length;
    const message = itemCount === 1 
      ? `دفع لمنتج واحد` 
      : `دفع لـ ${itemCount} منتجات`;
    
    console.log("📝 Payment message:", message);
    
    const paymentData = {
      amount: amountInSubunit,
      currency_code: finalCurrency,
      message: message,
      success_url: `${appUrl}/success?payment_intent={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,
      failure_url: `${appUrl}/cancel`,
      test: true,
      expiry: expiry, // string بالميلي ثانية
      allow_tips: false
    };
    
    console.log("📤 Sending cart payment data:", JSON.stringify(paymentData, null, 2));

    const response = await fetch("https://api-v2.ziina.com/api/payment_intent", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    console.log("📥 Response status:", response.status);
    console.log("📥 Response headers:", Object.fromEntries(response.headers));
    
    const text = await response.text();
    console.log("📥 Response text (first 500 chars):", text.slice(0, 500));

    let data;
    try {
      data = JSON.parse(text);
      console.log("✅ Parsed response data:", JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("❌ Failed to parse JSON response");
      console.error("❌ Raw response:", text.slice(0, 500));
      return NextResponse.json(
        { error: "Ziina returned invalid response", details: text.slice(0, 300) },
        { status: 502 }
      );
    }

    if (!response.ok) {
      console.error("❌ Ziina API Error - Status:", response.status);
      console.error("❌ Error details:", JSON.stringify(data, null, 2));
      return NextResponse.json(
        { error: "Payment creation failed", details: data },
        { status: response.status }
      );
    }

    // ✅ التحقق من وجود redirect_url
    if (!data.redirect_url) {
      console.error("❌ No redirect_url in response!");
      console.error("❌ Response data:", JSON.stringify(data, null, 2));
      return NextResponse.json(
        { error: "No redirect URL received from Ziina", details: data },
        { status: 500 }
      );
    }

    const paymentIntentId = data.id || data.payment_intent_id;
    
    console.log("✅ Cart payment intent created successfully!");
    console.log("✅ Payment Intent ID:", paymentIntentId);
    console.log("✅ Redirect URL:", data.redirect_url);
    
    // 🆕 تحديث الطلب مع payment_intent_id الفعلي
    const updatedOrder = createOrder({
      id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      sessionId: paymentIntentId, // ✨ نستخدم payment_intent_id الفعلي للربط
      status: 'pending',
      amount: totalAmount,
      currency: finalCurrency,
      customerEmail: email,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity || 1,
        price: item.price,
        image: item.image
      })),
      createdAt: new Date().toISOString(),
      metadata: {
        paymentIntentId: paymentIntentId,
        customerEmail: email
      }
    });
    
    console.log("📝 Order updated with payment intent ID:", paymentIntentId);

    return NextResponse.json({
      success: true,
      redirect_url: data.redirect_url,
      payment_intent_id: paymentIntentId,
      total_amount: totalAmount,
      items_count: items.length,
    });
  } catch (error) {
    console.error("💥 Cart Payment Intent Error:");
    console.error("💥 Error name:", error.name);
    console.error("💥 Error message:", error.message);
    console.error("💥 Error stack:", error.stack);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
