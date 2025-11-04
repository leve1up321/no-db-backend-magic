import { NextResponse } from "next/server";

// دالة تحويل الدراهم إلى فلسات
function convertAEDtoFils(amountInAED) {
  return Math.round(amountInAED * 100);
}

export async function POST(req) {
  try {
    const body = await req.json();
    
    // 🔍 التحقق من المتغيرات البيئية
    const apiKey = process.env.ZIINA_SECRET_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    
    console.log("🔑 Ziina API Key exists:", !!apiKey);
    console.log("🔑 API Key prefix:", apiKey?.substring(0, 10) + "...");
    console.log("🌐 App URL:", appUrl);
    
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
    
    // 🔢 التحقق من المبلغ وتحويله
    const originalAmount = body.amount;
    const amountInFils = convertAEDtoFils(originalAmount);
    
    console.log("💰 Original amount (AED):", originalAmount);
    console.log("💰 Converted amount (fils):", amountInFils);
    
    // 📦 بناء الطلب
    // احسب expiry بالميلي ثانية (ساعة واحدة من الآن)
    // Ziina تتوقع timestamp بالميلي ثانية كـ number
    const expiryInMilliseconds = Date.now() + (3600 * 1000); // + ساعة واحدة
    console.log("⏰ Expiry timestamp (milliseconds):", expiryInMilliseconds);
    console.log("⏰ Expiry date:", new Date(expiryInMilliseconds).toISOString());
    
    const paymentData = {
      amount: amountInFils,
      currency_code: "AED",
      message: body.message || `دفع مقابل ${body.productName || 'المنتج'}`,
      success_url: `${appUrl}/success`,
      cancel_url: `${appUrl}/cancel`,
      failure_url: `${appUrl}/cancel`,
      test: true,
      expiry: expiryInMilliseconds,
      allow_tips: false,
    };
    
    console.log("📤 Sending payment data:", JSON.stringify(paymentData, null, 2));

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

    console.log("✅ Payment intent created successfully!");
    console.log("✅ Redirect URL:", data.redirect_url);

    return NextResponse.json({
      success: true,
      redirect_url: data.redirect_url,
      payment_intent_id: data.id || data.payment_intent_id,
    });
  } catch (error) {
    console.error("💥 Payment Intent Error:");
    console.error("💥 Error name:", error.name);
    console.error("💥 Error message:", error.message);
    console.error("💥 Error stack:", error.stack);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
