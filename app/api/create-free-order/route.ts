import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { createOrder } from '@/lib/orders-store';

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

    // Create order using shared store
    const order = createOrder({
      id: orderId,
      sessionId: token,
      status: 'paid', // Free products are automatically "paid"
      amount: 0,
      currency: 'AED',
      customerEmail: email,
      items: [{
        id: productId,
        name: productName,
        quantity: 1,
        price: 0,
      }],
      downloadUrl,
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      metadata: {
        isFree: true,
        expiresAt,
        phone,
      }
    });

    // Return order details
    return NextResponse.json({
      success: true,
      orderId: order.id,
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
