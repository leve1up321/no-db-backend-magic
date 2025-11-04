import crypto from 'crypto';

/**
 * 🔐 التحقق من توقيع Ziina Webhook
 * 
 * يستخدم لضمان أن الـ webhook قادم فعلاً من Ziina وليس من مصدر مزيف
 */

/**
 * التحقق من توقيع Ziina
 * 
 * @param payload - البيانات المستلمة من webhook
 * @param signature - التوقيع من header x-ziina-signature
 * @param secret - الـ webhook secret من Ziina
 * @returns true إذا كان التوقيع صحيح
 */
export function verifyZiinaSignature(
  payload: string | object,
  signature: string,
  secret: string
): boolean {
  try {
    // تحويل payload إلى string إذا كان object
    const payloadString = typeof payload === 'string' 
      ? payload 
      : JSON.stringify(payload);

    // حساب التوقيع المتوقع باستخدام HMAC SHA-256
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex');

    // مقارنة التوقيع بطريقة آمنة ضد timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error: any) {
    console.error('❌ Error verifying signature:', error.message);
    return false;
  }
}

/**
 * التحقق من توقيع Ziina مع دعم عدة صيغ للتوقيع
 * 
 * بعض APIs ترسل التوقيع بصيغة مختلفة (مثل sha256=signature)
 */
export function verifyZiinaSignatureAdvanced(
  payload: string | object,
  signature: string,
  secret: string
): boolean {
  try {
    // إزالة البادئة sha256= إذا كانت موجودة
    const cleanSignature = signature.replace(/^sha256=/, '');

    return verifyZiinaSignature(payload, cleanSignature, secret);
  } catch (error: any) {
    console.error('❌ Error verifying advanced signature:', error.message);
    return false;
  }
}

/**
 * توليد توقيع لاختبار الـ webhook محلياً
 */
export function generateTestSignature(payload: string | object, secret: string): string {
  const payloadString = typeof payload === 'string' 
    ? payload 
    : JSON.stringify(payload);

  return crypto
    .createHmac('sha256', secret)
    .update(payloadString)
    .digest('hex');
}

