import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Mock authentication
    return NextResponse.json({
      success: true,
      user: {
        id: 'demo-user-123',
        name: 'مستخدم تجريبي',
        email: email || 'demo@levelup.com',
        token: 'mock-jwt-token-' + Date.now(),
      },
      message: 'تم تسجيل الدخول بنجاح',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في تسجيل الدخول' },
      { status: 500 }
    );
  }
}

