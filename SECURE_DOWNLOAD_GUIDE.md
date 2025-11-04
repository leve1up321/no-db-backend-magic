# 🔒 دليل نظام التحميل الآمن

## 📋 نظرة عامة

نظام تحميل محمي ومؤمن بالكامل يعمل بعد نجاح عملية الدفع من بوابة Ziina.

### ✨ الميزات الرئيسية:
- 🔐 **JWT Tokens** - توكنات مشفرة للأمان
- ⏰ **صلاحية مؤقتة** - كل رابط صالح لمدة 30 دقيقة فقط
- 🎯 **استخدام واحد** - كل token يعمل مرة واحدة فقط
- 🛡️ **حماية متعددة المستويات** - التحقق من الدفع، البريد الإلكتروني، والطلب
- 📧 **ربط بالعميل** - كل رابط مرتبط ببريد العميل فقط
- 🚫 **منع المشاركة** - لا يمكن مشاركة الروابط مع الآخرين

---

## 🏗️ المكونات الجديدة

### 1️⃣ مكتبة Token Management
**📄 الملف:** `lib/download-tokens.ts`

```typescript
// إنشاء token للتحميل
const token = await createDownloadToken(
  orderId,
  paymentId,
  blobUrl,
  customerEmail,
  30 // دقيقة
);

// التحقق من Token
const payload = await verifyDownloadToken(token);

// توليد رابط كامل
const url = await generateSecureDownloadUrl(
  orderId,
  paymentId,
  blobUrl,
  customerEmail
);
```

### 2️⃣ API Endpoint المحمي
**📄 الملف:** `app/api/secure-download/route.ts`

```bash
# التحميل باستخدام token
GET /api/secure-download?token=xxx

# توليد token جديد (داخلياً)
POST /api/secure-download
Body: { orderId, paymentId }
```

### 3️⃣ مكون React للزر
**📄 الملف:** `components/SecureDownloadButton.tsx`

```tsx
<SecureDownloadButton
  orderId="order_123"
  paymentId="pi_xxx"
  orderStatus="paid"
  downloadUrl="https://..."
  expiresAt={1234567890}
/>
```

---

## 🔄 كيفية العمل (Flow)

```
1. العميل يدفع عبر Ziina
   ↓
2. Webhook يستقبل تأكيد الدفع
   ↓
3. يتم حفظ الطلب مع حالة "paid"
   ↓
4. يتم توليد Blob URL للملف
   ↓
5. يتم توليد JWT token مشفر
   ↓
6. يظهر زر التحميل للعميل
   ↓
7. العميل يضغط على الزر
   ↓
8. يتم التحقق من:
   - صحة الـ token ✓
   - حالة الطلب (paid) ✓
   - بريد العميل ✓
   - صلاحية الوقت ✓
   - لم يُستخدم من قبل ✓
   ↓
9. إعادة التوجيه للملف
   ↓
10. تسجيل الـ token كمستخدم
```

---

## 💻 أمثلة الاستخدام

### 📦 في صفحة Success بعد الدفع

```tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SecureDownloadButton from "@/components/SecureDownloadButton";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState(null);

  const orderId = searchParams.get("orderId");
  const paymentId = searchParams.get("paymentId");

  useEffect(() => {
    // جلب بيانات الطلب
    const fetchOrder = async () => {
      const res = await fetch(`/api/orders?orderId=${orderId}`);
      const data = await res.json();
      
      if (data.success) {
        setOrderData(data.order);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (!orderData) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* عنوان النجاح */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            تم الدفع بنجاح!
          </h1>
          <p className="text-gray-600">
            شكراً لشرائك من متجرنا 🎉
          </p>
        </div>

        {/* معلومات الطلب */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-2">تفاصيل الطلب</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>رقم الطلب: <span className="font-mono">{orderId}</span></p>
            <p>رقم الدفعة: <span className="font-mono">{paymentId}</span></p>
            <p>المبلغ: {orderData.amount} {orderData.currency}</p>
          </div>
        </div>

        {/* زر التحميل الآمن */}
        <SecureDownloadButton
          orderId={orderId}
          paymentId={paymentId}
          orderStatus={orderData.status}
          downloadUrl={orderData.downloadUrl}
          expiresAt={orderData.downloadExpiry}
        />

        {/* روابط إضافية */}
        <div className="mt-6 flex flex-col gap-3">
          <a
            href="/orders"
            className="text-center text-purple-600 hover:text-purple-700 font-medium"
          >
            عرض جميع طلباتي
          </a>
          <a
            href="/"
            className="text-center text-gray-600 hover:text-gray-700"
          >
            العودة للصفحة الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}
```

### 📋 في صفحة الطلبات (Orders)

```tsx
"use client";

import { useState } from "react";
import SecureDownloadButton from "@/components/SecureDownloadButton";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  // ... كود البحث عن الطلبات

  return (
    <div>
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg p-6 mb-4">
          <h3 className="font-bold mb-2">طلب #{order.id}</h3>
          <p className="text-gray-600 mb-4">
            المبلغ: {order.amount} {order.currency}
          </p>
          
          {/* زر التحميل لكل طلب */}
          <SecureDownloadButton
            orderId={order.id}
            paymentId={order.paymentId}
            orderStatus={order.status}
            downloadUrl={order.downloadUrl}
            expiresAt={order.downloadExpiry}
          />
        </div>
      ))}
    </div>
  );
}
```

### 🔗 في صفحة Account المحمية

```tsx
import SecureDownloadButton from "@/components/SecureDownloadButton";

// المكون موجود بالفعل في app/account/page.tsx
// فقط استبدل زر التحميل القديم بـ:

<SecureDownloadButton
  orderId={order.id}
  paymentId={order.paymentId}
  orderStatus={order.status}
  downloadUrl={order.downloadUrl}
  expiresAt={order.downloadExpiry}
/>
```

---

## 🔧 التكامل مع Webhook

عند استقبال webhook من Ziina بعد نجاح الدفع، قم بتوليد رابط التحميل:

```typescript
// في app/api/ziina-webhook/route.ts

import { generateSecureDownloadUrl } from "@/lib/download-tokens";
import { saveOrder } from "@/lib/database";

export async function POST(req: Request) {
  // ... التحقق من الـ webhook

  if (event.type === 'payment_intent.succeeded') {
    const { payment_intent } = event.data;

    // توليد رابط تحميل آمن
    const downloadUrl = await generateSecureDownloadUrl(
      orderId,
      payment_intent.id,
      blobUrl, // رابط الملف في Vercel Blob
      customerEmail
    );

    // حفظ الطلب مع رابط التحميل
    await saveOrder({
      id: orderId,
      paymentId: payment_intent.id,
      status: 'paid',
      downloadUrl,
      downloadExpiry: Date.now() + (30 * 60 * 1000), // 30 دقيقة
      customerEmail,
      // ... بيانات أخرى
    });

    // إرسال إيميل للعميل
    await sendEmail({
      to: customerEmail,
      subject: 'تأكيد طلبك - رابط التحميل',
      html: `
        <h1>شكراً لشرائك! 🎉</h1>
        <p>رابط التحميل:</p>
        <a href="${downloadUrl}">تحميل الملفات</a>
        <p><small>الرابط صالح لمدة 30 دقيقة</small></p>
      `
    });
  }

  return new Response('OK');
}
```

---

## 🔐 مستويات الحماية

### 1️⃣ حماية Token
- ✅ JWT مع توقيع HMAC
- ✅ Secret key من environment variables
- ✅ انتهاء صلاحية بعد 30 دقيقة
- ✅ استخدام واحد فقط

### 2️⃣ حماية API
- ✅ التحقق من صحة Token
- ✅ التحقق من حالة الطلب
- ✅ التحقق من البريد الإلكتروني
- ✅ منع إعادة الاستخدام

### 3️⃣ حماية الملف
- ✅ Vercel Blob URLs مؤقتة
- ✅ لا يمكن الوصول مباشرة
- ✅ يجب المرور عبر API

### 4️⃣ حماية المستخدم
- ✅ ربط بحساب العميل
- ✅ التحقق من الدفع
- ✅ تسجيل محاولات الوصول

---

## 📊 رسائل الحالة

### ✅ مدفوع (Paid)
```
🔒 زر أخضر: "تحميل الملفات"
رسالة: "رابط تحميل آمن ومحمي • صالح لمرة واحدة"
```

### ⏳ قيد الانتظار (Pending)
```
🟡 صندوق أصفر: "في انتظار تأكيد الدفع..."
رسالة: "سيتم إرسال رابط التحميل بعد اكتمال الدفع"
```

### ❌ فشل (Failed)
```
🔴 صندوق أحمر: "فشلت عملية الدفع"
رسالة: "يرجى إعادة المحاولة أو التواصل مع الدعم"
```

### ⏰ انتهت الصلاحية (Expired)
```
⚪ زر رمادي معطل: "انتهت صلاحية الرابط"
رسالة: "يرجى التواصل مع الدعم للحصول على رابط جديد"
```

---

## 🎨 تخصيص التصميم

### تغيير ألوان الزر

```tsx
<SecureDownloadButton
  // ... props
  className="bg-blue-600 hover:bg-blue-700" // ألوان مخصصة
/>
```

### تخصيص الرسائل

يمكنك تعديل النصوص في `components/SecureDownloadButton.tsx`:

```typescript
// السطر 88
<span>تحميل الملفات الآن</span> // غيّر هنا

// السطر 111
<p>إذا لم يبدأ التحميل...</p> // غيّر هنا
```

---

## 🧪 الاختبار

### 1️⃣ اختبار محلي

```bash
# تشغيل المشروع
npm run dev

# افتح في المتصفح
http://localhost:3000
```

### 2️⃣ اختبار Token

```bash
# في console المتصفح
const token = "eyJhbGc..."; // نسخ من response

fetch(`/api/secure-download?token=${token}`)
  .then(r => r.json())
  .then(console.log);
```

### 3️⃣ اختبار الحماية

```bash
# محاولة استخدام token مرتين (يجب أن يفشل)
# محاولة token منتهي الصلاحية (يجب أن يفشل)
# محاولة token مع بريد مختلف (يجب أن يفشل)
```

---

## ⚠️ ملاحظات هامة

### 🔴 في الإنتاج:
1. **استخدم Redis** لتخزين الـ tokens المستخدمة بدلاً من `Set` في الذاكرة
2. **فعّل HTTPS** - ضروري للأمان
3. **راقب الـ logs** - سجل محاولات الوصول غير المصرح
4. **حدد Rate Limiting** - منع الـ brute force
5. **أضف Monitoring** - Sentry أو أي خدمة مراقبة

### ✅ أفضل الممارسات:
- ✓ لا تشارك الـ tokens في URLs عامة
- ✓ استخدم HTTPS دائماً
- ✓ سجّل جميع محاولات التحميل
- ✓ راقب الـ tokens منتهية الصلاحية
- ✓ نظّف الـ tokens القديمة بانتظام

---

## 🔗 روابط مفيدة

- [JWT.io](https://jwt.io) - فحص الـ tokens
- [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

## 🆘 حل المشاكل

### المشكلة: Token غير صالح
```
✓ تحقق من JWT_SECRET في .env
✓ تأكد من أن الـ token لم ينته
✓ تحقق من أنه لم يُستخدم من قبل
```

### المشكلة: لا يمكن التحميل
```
✓ تحقق من حالة الطلب (paid)
✓ تأكد من صحة البريد الإلكتروني
✓ تحقق من Blob URL صالح
```

### المشكلة: الزر لا يظهر
```
✓ تحقق من orderStatus props
✓ تأكد من استيراد المكون صحيح
✓ راجع console للأخطاء
```

---

## 📞 الدعم

لأي استفسارات:
- 📧 البريد: support@yourstore.com
- 💬 Discord: [انضم إلينا](https://discord.gg/yourserver)

---

**صنع بـ ❤️ مع أقصى معايير الأمان**

