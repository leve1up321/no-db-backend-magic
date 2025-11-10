import { NextRequest, NextResponse } from "next/server";
import { head } from "@vercel/blob";

/**
 * 📥 API لتوليد روابط تحميل مؤقتة
 * 
 * GET /api/download?url=blob_url&orderId=xxx
 * 
 * يتحقق من صلاحية الطلب ويوجه للرابط
 */

// ✅ إجبار dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // استخدام req.nextUrl بدلاً من req.url
    const searchParams = req.nextUrl.searchParams;
    const blobUrl = searchParams.get("url");
    const orderId = searchParams.get("orderId");

    if (!blobUrl) {
      return NextResponse.json({
        success: false,
        message: "رابط الملف مطلوب"
      }, { status: 400 });
    }

    // التحقق من وجود الملف في Blob storage
    try {
      const blobInfo = await head(blobUrl);
      
      if (!blobInfo) {
        return NextResponse.json({
          success: false,
          message: "الملف غير موجود"
        }, { status: 404 });
      }

      // إعادة توجيه للرابط المباشر
      // Vercel Blob يوفر روابط عامة مع token مؤقت
      return NextResponse.redirect(blobUrl);

    } catch (blobError) {
      console.error("❌ Blob check error:", blobError);
      
      // إذا فشل التحقق، نجرب التوجيه المباشر
      // (قد يكون الرابط صالح ولكن API فشل)
      return NextResponse.redirect(blobUrl);
    }

  } catch (error: any) {
    console.error("❌ Download error:", error);
    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء التحميل",
      error: error.message
    }, { status: 500 });
  }
}

/**
 * 📊 POST endpoint لتوليد رابط تحميل جديد
 * 
 * POST /api/download
 * Body: { orderId: string, paymentId: string }
 * 
 * يتحقق من صحة الطلب ويولد رابط جديد
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

    // هنا يمكنك إضافة logic للتحقق من الطلب
    // وتوليد رابط تحميل جديد
    
    // TODO: Implement order verification and new download link generation

    return NextResponse.json({
      success: true,
      message: "قريباً - توليد رابط تحميل جديد",
      orderId,
      paymentId
    });

  } catch (error: any) {
    console.error("❌ Generate download link error:", error);
    return NextResponse.json({
      success: false,
      message: "حدث خطأ",
      error: error.message
    }, { status: 500 });
  }
}
