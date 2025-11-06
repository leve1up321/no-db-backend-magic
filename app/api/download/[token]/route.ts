import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (same as in create-free-order)
const orders = new Map<string, {
  orderId: string;
  email: string;
  phone?: string;
  productId: number;
  productName: string;
  downloadUrl: string;
  expiresAt: number;
}>();

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;

    // Check if order exists
    const order = orders.get(token);
    
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

    // Check if token has expired
    if (Date.now() > order.expiresAt) {
      // Remove expired token
      orders.delete(token);
      
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

    // Fetch the file from Vercel Blob or original URL
    const fileResponse = await fetch(order.downloadUrl);
    
    if (!fileResponse.ok) {
      throw new Error('Failed to fetch file');
    }

    // Get the file as blob
    const fileBlob = await fileResponse.blob();
    
    // Create filename from product name (sanitize it)
    const filename = `${order.productName.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '')}.pdf`;

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

// Share the orders Map
export { orders };

