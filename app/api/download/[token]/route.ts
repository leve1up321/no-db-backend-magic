import { NextRequest, NextResponse } from 'next/server';
import { findOrderBySessionId } from '@/lib/orders-store';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;

    // Check if order exists using shared store
    const order = findOrderBySessionId(token);
    
    if (!order) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'رابط التحميل غير صحيح أو انتهت صلاحيته' 
        }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }
      );
    }

    // Check if token has expired (if metadata.expiresAt exists)
    const expiresAt = order.metadata?.expiresAt;
    if (expiresAt && Date.now() > expiresAt) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'انتهت صلاحية الرابط. يمكنك طلب رابط جديد من صفحة المنتج.' 
        }),
        { 
          status: 410,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }
      );
    }

    // Get download URL
    if (!order.downloadUrl) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'رابط التحميل غير متوفر' 
        }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }
      );
    }

    // Fetch the file from Vercel Blob or original URL
    const fileResponse = await fetch(order.downloadUrl);
    
    if (!fileResponse.ok) {
      throw new Error('Failed to fetch file');
    }

    // Get the file as blob
    const fileBlob = await fileResponse.blob();
    
    // Create filename from product name (sanitize it)
    const productName = order.items[0]?.name || 'product';
    const filename = `${productName.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '')}.pdf`;

    // Return the file with secure headers
    return new NextResponse(fileBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'X-Robots-Tag': 'noindex, nofollow',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error('Error downloading file:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'حدث خطأ أثناء التحميل. يرجى المحاولة مرة أخرى.' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      }
    );
  }
}
