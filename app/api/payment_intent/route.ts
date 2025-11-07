import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, productName, productFile, customerEmail } = await req.json();

    const payload = {
      amount,
      currency_code: "AED",
      message: `دفع مقابل ${productName}`,
      metadata: {
        productName,
        productFile,
        customerEmail,
      },
      success_url: "https://leve1up.store/success?payment_intent={CHECKOUT_SESSION_ID}",
      cancel_url: "https://leve1up.store/cancel",
    };

    const res = await fetch("https://api.ziina.com/v1/payment_intents", {
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
    console.log("✅ Payment intent created:", data.id);
    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Error creating payment intent:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

