import { SignJWT, jwtVerify } from 'jose';

/**
 * 🔐 نظام Token للتحميل الآمن
 * 
 * يولد tokens مؤقتة لتحميل الملفات بعد نجاح الدفع
 * كل token صالح لمرة واحدة فقط ولمدة محدودة
 */

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production-min-32-chars-long'
);

// تخزين مؤقت للـ tokens المستخدمة (في الإنتاج استخدم Redis)
const usedTokens = new Set<string>();

export interface DownloadTokenPayload {
  orderId: string;
  paymentId: string;
  blobUrl: string;
  customerEmail: string;
  expiresAt: number;
}

/**
 * إنشاء token للتحميل
 * @param orderId - رقم الطلب
 * @param paymentId - رقم الدفعة من Ziina
 * @param blobUrl - رابط الملف في Blob Storage
 * @param customerEmail - بريد العميل
 * @param expiryMinutes - مدة صلاحية الـ token (افتراضياً 30 دقيقة)
 */
export async function createDownloadToken(
  orderId: string,
  paymentId: string,
  blobUrl: string,
  customerEmail: string,
  expiryMinutes: number = 30
): Promise<string> {
  const expiresAt = Date.now() + (expiryMinutes * 60 * 1000);

  const token = await new SignJWT({
    orderId,
    paymentId,
    blobUrl,
    customerEmail,
    expiresAt,
    type: 'download'
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${expiryMinutes}m`)
    .sign(SECRET_KEY);

  return token;
}

/**
 * التحقق من صحة token التحميل
 * @param token - Token للتحقق منه
 */
export async function verifyDownloadToken(token: string): Promise<DownloadTokenPayload | null> {
  try {
    // التحقق من أن الـ token لم يُستخدم من قبل
    if (usedTokens.has(token)) {
      console.log('⚠️ Token already used:', token.substring(0, 20) + '...');
      return null;
    }

    // التحقق من صحة التوقيع
    const verified = await jwtVerify(token, SECRET_KEY);
    const payload = verified.payload as unknown as DownloadTokenPayload;

    // التحقق من نوع الـ token
    if ((payload as any).type !== 'download') {
      console.log('⚠️ Invalid token type');
      return null;
    }

    // التحقق من انتهاء الصلاحية
    if (Date.now() > payload.expiresAt) {
      console.log('⚠️ Token expired');
      return null;
    }

    // تسجيل الـ token كمستخدم
    usedTokens.add(token);

    // تنظيف الـ tokens القديمة (في الإنتاج استخدم cron job)
    setTimeout(() => {
      usedTokens.delete(token);
    }, 60 * 60 * 1000); // حذف بعد ساعة

    return payload;

  } catch (error) {
    console.error('❌ Token verification failed:', error);
    return null;
  }
}

/**
 * إنشاء رابط تحميل كامل مع token
 * @param orderId - رقم الطلب
 * @param paymentId - رقم الدفعة
 * @param blobUrl - رابط الملف
 * @param customerEmail - بريد العميل
 * @param baseUrl - رابط الموقع الأساسي
 */
export async function generateSecureDownloadUrl(
  orderId: string,
  paymentId: string,
  blobUrl: string,
  customerEmail: string,
  baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
): Promise<string> {
  const token = await createDownloadToken(orderId, paymentId, blobUrl, customerEmail);
  return `${baseUrl}/api/secure-download?token=${token}`;
}

/**
 * التحقق من أن الطلب مدفوع ويحق له التحميل
 */
export function canDownload(orderStatus: string, paymentStatus: string): boolean {
  return orderStatus === 'completed' || paymentStatus === 'paid';
}

/**
 * الحصول على وقت انتهاء صلاحية الـ token
 */
export function getTokenExpiry(minutes: number = 30): Date {
  return new Date(Date.now() + (minutes * 60 * 1000));
}

