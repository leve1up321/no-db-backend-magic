import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    // Mock download link generation
    return NextResponse.json({
      success: true,
      download: {
        productId: productId || 'unknown',
        fileName: 'digital-product-' + productId + '.zip',
        url: 'https://example.com/downloads/demo.zip',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        code: 'DEMO-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      },
      message: 'تم إنشاء رابط التحميل بنجاح',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في إنشاء رابط التحميل' },
      { status: 500 }
    );
  }
}

