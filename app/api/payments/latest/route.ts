import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";

/**
 * 🎯 API لجلب آخر دفع مكتمل من Vercel Blob
 * 
 * GET /api/payments/latest
 * 
 * يعيد آخر دفع تم حفظه في Blob Storage
 */

export async function GET(req: NextRequest) {
  try {
    console.log("🔍 Fetching latest payment from Blob...");
    
    // جلب جميع الدفعات من Blob مع التصنيف حسب الأحدث
    const { blobs } = await list({
      prefix: 'payments/',
      limit: 1, // فقط آخر دفعة
    });
    
    if (blobs.length === 0) {
      console.log("❌ No payments found in Blob");
      return NextResponse.json({
        success: false,
        message: "لم يتم العثور على عمليات دفع مكتملة",
        error: "NO_PAYMENTS_FOUND"
      }, { status: 404 });
    }
    
    // الحصول على آخر blob
    const latestBlob = blobs[0];
    console.log(`📦 Found latest payment: ${latestBlob.url}`);
    
    // جلب محتوى الملف
    const response = await fetch(latestBlob.url);
    const paymentData = await response.json();
    
    console.log("✅ Payment data retrieved successfully");
    console.log(`💳 Payment ID: ${paymentData.payment_id}`);
    console.log(`💰 Amount: ${paymentData.amount} ${paymentData.currency}`);
    
    return NextResponse.json({
      success: true,
      payment: paymentData,
      blob_url: latestBlob.url,
      uploaded_at: latestBlob.uploadedAt
    });
    
  } catch (error: any) {
    console.error("❌ Error fetching latest payment:", error);
    
    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء جلب بيانات الدفع",
      error: error.message
    }, { status: 500 });
  }
}

