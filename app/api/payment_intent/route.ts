import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency = "AED", test = false } = body;

    if (!amount) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 });
    }

    const ZIINA_SECRET_KEY = process.env.ZIINA_SECRET_KEY;
    if (!ZIINA_SECRET_KEY) {
      return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    }

    // ⚙️ بناء الطلب إلى Ziina API
    const resp = await fetch("https://api-v2.ziina.com/payment_intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ZIINA_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Ziina تستخدم الفلسات (100 AED = 10000)
        currency,
        test, // true لتجربة الدفع بدون خصم فعلي
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
      }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      console.error("Ziina error:", data);
      return NextResponse.json({ error: "Payment failed", details: data }, { status: 500 });
    }

    // ✅ هذا الرابط هو اللي المستخدم يفتح منه صفحة الدفع
    return NextResponse.json({ success: true, redirect_url: data.redirect_url });
  } catch (error: any) {
    console.error("Payment Intent Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

