import { NextResponse } from "next/server";

// دالة تحويل الدراهم إلى فلسات
function convertAEDtoFils(amountInAED) {
  return Math.round(amountInAED * 100);
}

export async function POST(req) {
  try {
    const body = await req.json();

    const response = await fetch("https://api-v2.ziina.com/api/payment_intent", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.ZIINA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: convertAEDtoFils(body.amount),
        currency_code: "AED",
        message: body.message || `دفع مقابل ${body.productName || 'المنتج'}`,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
        failure_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
        test: true,
        expiry: Date.now() + 3600000, // انتهاء الصلاحية بعد ساعة
        allow_tips: false,
      }),
    });

    const text = await response.text(); // 🟡 استخدم text بدلاً من json مباشرة

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("❌ الرد ليس JSON:", text.slice(0, 300));
      return NextResponse.json({ error: "Ziina returned invalid response" }, { status: 502 });
    }

    if (!response.ok) {
      console.error("❌ Ziina API Error:", data);
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json({ success: true, redirect_url: data.redirect_url });
  } catch (error) {
    console.error("💥 Payment Intent Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
