import { NextRequest, NextResponse } from "next/server";
import { verifyDownloadToken } from "@/lib/download-tokens";
import { findOrderById } from "@/lib/database";

/**
 * 🔒 API محمي للتحميل الآمن
 * 
 * GET /api/secure-download?token=xxx
 * 
 * - يتحقق من صحة الـ token
 * - يتأكد من أن الطلب مدفوع
 * - يسمح بالتحميل مرة واحدة فقط
 * - Token ينتهي بعد 30 دقيقة
 */

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get("token");

    // 1️⃣ التحقق من وجود token
    if (!token) {
      return NextResponse.json({
        success: false,
        message: "رمز التحميل مطلوب"
      }, { status: 400 });
    }

    // 2️⃣ التحقق من صحة الـ token
    const payload = await verifyDownloadToken(token);

    if (!payload) {
      return NextResponse.json({
        success: false,
        message: "رمز التحميل غير صالح أو منتهي الصلاحية",
        error: "INVALID_TOKEN"
      }, { status: 401 });
    }

    // 3️⃣ التحقق من حالة الطلب
    const order = findOrderById(payload.orderId);

    if (!order) {
      return NextResponse.json({
        success: false,
        message: "الطلب غير موجود"
      }, { status: 404 });
    }

    // 4️⃣ التحقق من أن الطلب مدفوع
    if (order.status !== 'paid') {
      return NextResponse.json({
        success: false,
        message: "الطلب غير مدفوع. يرجى إكمال عملية الدفع أولاً",
        orderStatus: order.status
      }, { status: 403 });
    }

    // 5️⃣ التحقق من مطابقة البريد الإلكتروني
    if (order.customerEmail !== payload.customerEmail) {
      console.warn('⚠️ Email mismatch attempt:', {
        orderEmail: order.customerEmail,
        tokenEmail: payload.customerEmail
      });

      return NextResponse.json({
        success: false,
        message: "غير مصرح لك بتحميل هذا الملف"
      }, { status: 403 });
    }

    // 6️⃣ تسجيل محاولة التحميل
    console.log('✅ Download authorized:', {
      orderId: payload.orderId,
      paymentId: payload.paymentId,
      email: payload.customerEmail,
      timestamp: new Date().toISOString()
    });

    // 7️⃣ إعادة التوجيه للملف
    // Vercel Blob URLs آمنة ومؤقتة بطبيعتها
    return NextResponse.redirect(payload.blobUrl);

  } catch (error: any) {
    console.error("❌ Secure download error:", error);
    
    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء التحميل",
      error: error.message
    }, { status: 500 });
  }
}

/**
 * 📊 POST - توليد token تحميل جديد (للاستخدام الداخلي)
 * 
 * يُستخدم من webhook أو صفحة النجاح
 */
export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentId } = await req.json();

    if (!orderId || !paymentId) {
      return NextResponse.json({
        success: false,
        message: "رقم الطلب ورقم الدفعة مطلوبان"
      }, { status: 400 });
    }

    // التحقق من الطلب
    const order = findOrderById(orderId);

    if (!order) {
      return NextResponse.json({
        success: false,
        message: "الطلب غير موجود"
      }, { status: 404 });
    }

    if (order.status !== 'paid') {
      return NextResponse.json({
        success: false,
        message: "الطلب غير مدفوع"
      }, { status: 403 });
    }

    // توليد رابط تحميل جديد
    const { generateSecureDownloadUrl } = await import("@/lib/download-tokens");
    
    const downloadUrl = await generateSecureDownloadUrl(
      orderId,
      paymentId,
      order.downloadUrl || '', // يجب أن يكون موجود في الطلب
      order.customerEmail || ''
    );

    return NextResponse.json({
      success: true,
      message: "تم توليد رابط التحميل بنجاح",
      downloadUrl,
      expiresIn: '30 minutes'
    });

  } catch (error: any) {
    console.error("❌ Generate download token error:", error);
    
    return NextResponse.json({
      success: false,
      message: "حدث خطأ",
      error: error.message
    }, { status: 500 });
  }
}
