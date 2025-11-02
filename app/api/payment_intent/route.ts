import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency, productId } = body;

    // Mock payment intent creation
    return NextResponse.json({
      success: true,
      paymentIntent: {
        id: 'pi_mock_' + Math.random().toString(36).substr(2, 9),
        amount: amount || 0,
        currency: currency || 'SAR',
        status: 'requires_payment_method',
        clientSecret: 'mock_secret_' + Date.now(),
      },
      message: 'تم إنشاء نية الدفع بنجاح',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في إنشاء نية الدفع' },
      { status: 500 }
    );
  }
}

