import { NextRequest, NextResponse } from "next/server";
import {
  getAllReviews,
  getApprovedReviews,
  getProductReviews,
  addReview,
  hasCustomerPurchasedProduct,
  hasCustomerReviewedProduct,
} from "@/lib/reviews";

/**
 * 💬 API لإدارة التقييمات
 * 
 * GET /api/reviews - جلب جميع التقييمات المعتمدة
 * GET /api/reviews?productId=1 - جلب تقييمات منتج معين
 * POST /api/reviews - إضافة تقييم جديد
 */

// ✅ إجبار dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * GET - جلب التقييمات
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const productId = searchParams.get("productId");

    if (productId) {
      // جلب تقييمات منتج معين
      const reviews = getProductReviews(parseInt(productId));
      
      return NextResponse.json({
        success: true,
        reviews,
        count: reviews.length,
      });
    }

    // جلب جميع التقييمات المعتمدة
    const reviews = getApprovedReviews();
    
    return NextResponse.json({
      success: true,
      reviews,
      count: reviews.length,
    });

  } catch (error: any) {
    console.error("❌ Error fetching reviews:", error);
    
    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء جلب التقييمات",
      error: error.message,
    }, { status: 500 });
  }
}

/**
 * POST - إضافة تقييم جديد
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId,
      productId,
      productName,
      customerName,
      customerEmail,
      rating,
      comment,
    } = body;

    // 1️⃣ التحقق من البيانات المطلوبة
    if (!orderId || !productId || !productName || !customerName || !customerEmail || !rating || !comment) {
      return NextResponse.json({
        success: false,
        message: "جميع الحقول مطلوبة",
      }, { status: 400 });
    }

    // 2️⃣ التحقق من صحة التقييم (1-5)
    if (rating < 1 || rating > 5) {
      return NextResponse.json({
        success: false,
        message: "التقييم يجب أن يكون بين 1 و 5",
      }, { status: 400 });
    }

    // 3️⃣ التحقق من صحة البريد الإلكتروني
    if (!customerEmail.includes('@')) {
      return NextResponse.json({
        success: false,
        message: "البريد الإلكتروني غير صحيح",
      }, { status: 400 });
    }

    // 4️⃣ التحقق من أن العميل اشترى المنتج
    const hasPurchased = hasCustomerPurchasedProduct(customerEmail, productId);
    
    if (!hasPurchased) {
      return NextResponse.json({
        success: false,
        message: "يجب شراء المنتج أولاً قبل التقييم",
      }, { status: 403 });
    }

    // 5️⃣ التحقق من أن العميل لم يقيّم المنتج من قبل
    const hasReviewed = hasCustomerReviewedProduct(customerEmail, productId);
    
    if (hasReviewed) {
      return NextResponse.json({
        success: false,
        message: "لقد قمت بتقييم هذا المنتج من قبل",
      }, { status: 409 });
    }

    // 6️⃣ إضافة التقييم
    const newReview = addReview({
      orderId,
      productId,
      productName,
      customerName,
      customerEmail,
      rating,
      comment,
    });

    return NextResponse.json({
      success: true,
      message: "شكراً لك! تم إرسال تقييمك بنجاح وسيظهر بعد المراجعة",
      review: newReview,
    }, { status: 201 });

  } catch (error: any) {
    console.error("❌ Error adding review:", error);
    
    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء إضافة التقييم",
      error: error.message,
    }, { status: 500 });
  }
}

