import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

// In-memory storage (replace with Vercel KV or database in production)
const orders = new Map<string, {
  orderId: string;
  email: string;
  phone?: string;
  productId: number;
  productName: string;
  downloadUrl: string;
  expiresAt: number;
}>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, productId, productName, downloadUrl } = body;

    // Validate required fields
    if (!email || !productId || !productName || !downloadUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique order ID and token
    const orderId = nanoid(16);
    const token = nanoid(32);
    
    // Set expiry time (30 minutes from now)
    const expiresAt = Date.now() + (30 * 60 * 1000);

    // Store order data
    orders.set(token, {
      orderId,
      email,
      phone,
      productId,
      productName,
      downloadUrl,
      expiresAt,
    });

    // Return order details
    return NextResponse.json({
      success: true,
      orderId,
      token,
      expiresAt,
    });

  } catch (error) {
    console.error('Error creating free order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Export orders Map for use in download API
export { orders };

