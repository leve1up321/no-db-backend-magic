# 🔔 إعداد Webhook لـ Ziina

هذا الدليل يشرح كيفية تفعيل نظام الـ Webhooks لاستقبال إشعارات من Ziina عند إتمام أو فشل عمليات الدفع.

---

## 📋 ما هو الـ Webhook؟

الـ Webhook هو نقطة نهاية (API endpoint) في موقعك يرسل لها Ziina إشعارات تلقائياً عند حدوث أحداث معينة مثل:
- ✅ نجاح عملية الدفع
- ❌ فشل عملية الدفع
- 🔄 استرجاع المبلغ
- ⏳ تحديث حالة الدفع

---

## 🚀 الخطوات

### الخطوة 1: رفع المشروع على Vercel

1. ارفع مشروعك على Vercel (أو أي hosting آخر)
2. احصل على رابط الموقع، مثل: `https://your-site.vercel.app`

### الخطوة 2: تكوين الـ Webhook في Ziina Dashboard

1. اذهب إلى [Ziina Dashboard](https://dashboard.ziina.com)
2. انتقل إلى **Settings** → **Webhooks** (أو Developer Settings)
3. اضغط على **Add Webhook** أو **New Webhook**
4. أدخل URL الـ webhook الخاص بك:
   ```
   https://your-site.vercel.app/api/ziina-webhook
   ```
5. اختر الأحداث التي تريد استقبالها:
   - ✅ `payment.succeeded` - عند نجاح الدفع
   - ❌ `payment.failed` - عند فشل الدفع
   - 🔄 `payment.refunded` - عند استرجاع المبلغ
   - ⏳ `payment.updated` - عند تحديث حالة الدفع
6. احفظ الـ **Webhook Secret** الذي سيظهر لك

### الخطوة 3: إضافة Webhook Secret إلى متغيرات البيئة

في Vercel (أو hosting الخاص بك):

1. اذهب إلى **Settings** → **Environment Variables**
2. أضف متغير جديد:
   - **Name:** `ZIINA_WEBHOOK_SECRET`
   - **Value:** الـ secret الذي حصلت عليه من Ziina
3. احفظ التغييرات
4. أعد نشر المشروع (Redeploy)

### الخطوة 4: اختبار الـ Webhook

#### الطريقة الأولى: من Ziina Dashboard
1. في صفحة Webhooks في Ziina Dashboard
2. اضغط على **Test Webhook** أو **Send Test Event**
3. تحقق من Logs في Vercel لتأكد أن الإشعار وصل

#### الطريقة الثانية: اختبار حقيقي
1. أضف منتج للسلة في موقعك
2. اضغط "إتمام الدفع"
3. أكمل عملية الدفع في Ziina
4. تحقق من Logs في Vercel - يجب أن ترى:
   ```
   📩 Webhook received from Ziina
   ✅ Payment succeeded!
   💰 Amount: 2999 AED
   ```

---

## 🔍 التحقق من أن الـ Webhook يعمل

يمكنك زيارة هذا الرابط للتحقق:
```
https://your-site.vercel.app/api/ziina-webhook
```

يجب أن ترى رسالة JSON مثل:
```json
{
  "status": "active",
  "message": "Ziina webhook endpoint is ready",
  "endpoint": "/api/ziina-webhook",
  "methods": ["POST"],
  "timestamp": "2025-11-04T15:30:00.000Z"
}
```

---

## 📊 مراقبة الـ Webhooks

### في Vercel:
1. اذهب إلى **Logs** في dashboard
2. ابحث عن رسائل تبدأ بـ `📩 Webhook received`
3. تحقق من تفاصيل كل webhook

### في Ziina Dashboard:
1. اذهب إلى **Webhooks** → **Logs**
2. ستجد سجل بكل الـ webhooks المرسلة
3. يمكنك رؤية:
   - ✅ Webhooks نجحت (Status 200)
   - ❌ Webhooks فشلت
   - 🔄 Webhooks أعيد إرسالها

---

## 💡 ماذا يمكنك أن تفعل في الـ Webhook Handler؟

حالياً الـ webhook فقط يسجل البيانات في الـ logs، لكن يمكنك إضافة:

### 1️⃣ إرسال بريد إلكتروني للعميل
```typescript
if (paymentStatus === "succeeded") {
  await sendDownloadEmail({
    email: body.customer_email,
    orderId: paymentId,
    downloadLink: "https://example.com/download/xyz"
  });
}
```

### 2️⃣ حفظ الطلب في قاعدة بيانات
```typescript
if (paymentStatus === "succeeded") {
  await db.orders.create({
    data: {
      paymentId: paymentId,
      status: "paid",
      amount: amount,
      customerEmail: body.customer_email,
      paidAt: new Date()
    }
  });
}
```

### 3️⃣ إرسال إشعار على Slack أو Discord
```typescript
if (paymentStatus === "succeeded") {
  await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    body: JSON.stringify({
      text: `🎉 دفع جديد بقيمة ${amount} ${currency}!`
    })
  });
}
```

### 4️⃣ تفريغ السلة (تم تنفيذه بالفعل في صفحة `/success`)
السلة يتم تفريغها تلقائياً عندما يصل المستخدم لصفحة النجاح.

---

## 🔐 الأمان

### التحقق من التوقيع (Signature Verification)

لحماية الـ webhook من الطلبات المزيفة، يمكنك تفعيل التحقق من التوقيع:

```typescript
import crypto from 'crypto';

const signature = req.headers.get("x-ziina-signature");
const webhookSecret = process.env.ZIINA_WEBHOOK_SECRET;

const expectedSignature = crypto
  .createHmac('sha256', webhookSecret)
  .update(JSON.stringify(body))
  .digest('hex');

if (signature !== expectedSignature) {
  return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
}
```

**ملاحظة:** تحقق من توثيق Ziina لمعرفة الطريقة الصحيحة للتحقق من التوقيع.

---

## 🐛 استكشاف الأخطاء

### المشكلة: لا تصل الـ webhooks
- ✅ تأكد أن URL صحيح
- ✅ تأكد أن المشروع مرفوع على Vercel
- ✅ تحقق من Logs في Ziina Dashboard
- ✅ جرب إرسال test webhook

### المشكلة: الـ webhook يصل لكن يرجع 500 error
- ✅ تحقق من Logs في Vercel
- ✅ تأكد أن الكود لا يوجد به أخطاء
- ✅ تأكد من أن جميع المتغيرات البيئية موجودة

### المشكلة: Ziina يعيد إرسال الـ webhook باستمرار
- ✅ تأكد أن الـ endpoint يرجع status 200
- ✅ حتى لو حدث خطأ، يجب أن ترجع 200 لتجنب إعادة الإرسال

---

## 📚 موارد إضافية

- [Ziina API Documentation](https://docs.ziina.com)
- [Ziina Webhooks Guide](https://docs.ziina.com/webhooks)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

---

## ✅ Checklist

- [ ] رفع المشروع على Vercel
- [ ] إضافة webhook URL في Ziina Dashboard
- [ ] حفظ webhook secret في متغيرات البيئة
- [ ] اختبار الـ webhook
- [ ] التحقق من Logs
- [ ] إضافة المنطق المطلوب (إرسال بريد، حفظ في DB، إلخ)

---

🎉 **تم! الآن لديك نظام webhook كامل لاستقبال إشعارات Ziina!**

