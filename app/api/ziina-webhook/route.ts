import { NextResponse } from "next/server";
import { getCurrencySymbol, subunitMap, type Currency } from "@/lib/currency";
import { findOrderBySessionId, findOrderByPaymentId, updateOrder } from "@/lib/orders-store";

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
    const order = await findOrderByPaymentId(paymentId);
    
    if (!order) {
      console.error("❌ No order found for payment ID:", paymentId);
      console.error("📝 Payment details - Amount:", amount, currencySymbol);
      console.error("📝 Message:", message);
      
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
    
    console.log("💰 Amount:", amount, currencySymbol);
    console.log("📦 Items count:", orderItems.length);
    console.log("✅ Payment processed successfully - Customer will download from success page");
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
