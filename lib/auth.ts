import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

/**
 * 🔐 نظام Authentication بسيط للعملاء
 * يستخدم JWT tokens و cookies
 */

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production-min-32-chars-long'
);

export interface UserSession {
  email: string;
  name?: string;
  isAuthenticated: boolean;
}

/**
 * إنشاء JWT token للمستخدم
 */
export async function createToken(email: string, name?: string): Promise<string> {
  const token = await new SignJWT({ email, name })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // صالح لمدة أسبوع
    .sign(SECRET_KEY);

  return token;
}

/**
 * التحقق من صحة JWT token
 */
export async function verifyToken(token: string): Promise<UserSession | null> {
  try {
    const verified = await jwtVerify(token, SECRET_KEY);
    const payload = verified.payload as { email: string; name?: string };

    return {
      email: payload.email,
      name: payload.name,
      isAuthenticated: true,
    };
  } catch (error) {
    return null;
  }
}

/**
 * الحصول على session من cookies
 */
export async function getSession(): Promise<UserSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return null;
  }

  return await verifyToken(token);
}

/**
 * الحصول على session من request
 */
export async function getSessionFromRequest(req: NextRequest): Promise<UserSession | null> {
  const token = req.cookies.get('auth_token')?.value;

  if (!token) {
    return null;
  }

  return await verifyToken(token);
}

/**
 * حفظ session في cookies
 */
export async function setSession(email: string, name?: string) {
  const token = await createToken(email, name);
  const cookieStore = cookies();

  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

/**
 * حذف session (logout)
 */
export function clearSession() {
  const cookieStore = cookies();
  cookieStore.delete('auth_token');
}

/**
 * التحقق من أن المستخدم مسجل دخول
 */
export async function requireAuth(): Promise<UserSession> {
  const session = await getSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  return session;
}

