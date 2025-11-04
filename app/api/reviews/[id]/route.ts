import { NextRequest, NextResponse } from "next/server";
import { approveReview, deleteReview } from "@/lib/reviews";

/**
 * 💬 API لإدارة تقييم معين
 * 
 * PATCH /api/reviews/[id] - الموافقة على تقييم
 * DELETE /api/reviews/[id] - حذف تقييم
 */

// ✅ إجبار dynamic rendering
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * PATCH - الموافقة على تقييم
 */
export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "معرّف التقييم مطلوب",
      }, { status: 400 });
    }

    const success = approveReview(id);

    if (!success) {
      return NextResponse.json({
        success: false,
        message: "التقييم غير موجود",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "تم قبول التقييم بنجاح",
    });

  } catch (error: any) {
    console.error("❌ Error approving review:", error);
    
    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء قبول التقييم",
      error: error.message,
    }, { status: 500 });
  }
}

/**
 * DELETE - حذف تقييم
 */
export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "معرّف التقييم مطلوب",
      }, { status: 400 });
    }

    const success = deleteReview(id);

    if (!success) {
      return NextResponse.json({
        success: false,
        message: "التقييم غير موجود",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف التقييم بنجاح",
    });

  } catch (error: any) {
    console.error("❌ Error deleting review:", error);
    
    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء حذف التقييم",
      error: error.message,
    }, { status: 500 });
  }
}
