# 🚀 دليل Webhook المتقدم - النظام الكامل

هذا الدليل يشرح كيفية تفعيل نظام Webhook متكامل مع جميع المميزات:
- 🔐 التحقق من التوقيع (Signature Verification)
- 🔔 إشعارات Discord التلقائية
- 💾 حفظ الطلبات في قاعدة بيانات
- 📦 رفع الملفات على Vercel Blob
- 🔗 توليد روابط تحميل مؤقتة

---

## 📋 المتطلبات الأساسية

1. ✅ حساب Vercel
2. ✅ حساب Ziina
3. ✅ سيرفر Discord (اختياري)
4. ✅ Node.js 22+ مثبت محلياً

---

## 🎯 الخطوة 1: تثبيت المكتبات

```bash
npm install @vercel/blob
```

أو إذا كنت تستخدم yarn:

```bash
yarn add @vercel/blob
```

---

## 🔐 الخطوة 2: إعداد التحقق من التوقيع

### 2.1 الحصول على Webhook Secret من Ziina

1. اذهب إلى [Ziina Dashboard](https://dashboard.ziina.com)
2. **Settings** → **Developers** → **Webhooks**
3. اضغط **Add Webhook**
4. أدخل URL (سنحصل عليه في الخطوة التالية):
   ```
   https://your-domain.vercel.app/api/ziina-webhook
   ```
5. اختر الأحداث:
   - ✅ `payment.succeeded`
   - ✅ `payment.failed`
   - ✅ `payment.refunded`
   - ✅ `payment.updated`
6. احفظ الـ **Webhook Secret** الذي يظهر لك

### 2.2 إضافة Secret في Vercel

1. اذهب إلى **Vercel Dashboard**
2. اختر مشروعك
3. **Settings** → **Environment Variables**
4. أضف المتغير:
   - **Name:** `ZIINA_WEBHOOK_SECRET`
   - **Value:** الـ secret من Ziina (مثل: `whsec_xxxxxxxxxxxx`)
   - **Environment:** Production, Preview, Development
5. احفظ

### 2.3 كيف يعمل التحقق؟

```typescript
// في كل webhook request، نتحقق من التوقيع:
const signature = req.headers.get("x-ziina-signature");
const isValid = verifyZiinaSignature(rawBody, signature, webhookSecret);

if (!isValid) {
  return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
}
```

✅ **الفائدة:** يمنع أي شخص من إرسال webhooks مزيفة لموقعك

---

## 🔔 الخطوة 3: إعداد إشعارات Discord

### 3.1 إنشاء Webhook في Discord

1. افتح سيرفر Discord الخاص بك
2. اذهب إلى **Server Settings** (⚙️)
3. **Integrations** → **Webhooks**
4. اضغط **New Webhook**
5. اختر:
   - **Name:** مثل "LEVEL UP Payments"
   - **Channel:** القناة التي تريد الإشعارات فيها
6. اضغط **Copy Webhook URL**

### 3.2 إضافة Webhook URL في Vercel

1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. أضف:
   - **Name:** `DISCORD_WEBHOOK_URL`
   - **Value:** الرابط الذي نسخته من Discord
   - **Environment:** Production, Preview, Development
3. احفظ

### 3.3 شكل الإشعارات

عند كل دفعة، سيرسل Discord إشعار مثل:

```
✅ دفعة جديدة ناجحة!

💰 المبلغ: 299.00 AED
🆔 رقم الدفعة: pi_xxxxxxxxx
📊 الحالة: succeeded
👤 العميل: أحمد محمد
    ahmed@example.com
🛍️ المنتجات:
  • منتج رقمي (x2) - 149.50 AED
  • كتاب إلكتروني (x1) - 149.50 AED

🕐 2025-11-04 15:30:00
LEVEL UP Store
```

---

## 💾 الخطوة 4: قاعدة البيانات المحلية

### 4.1 كيف تعمل؟

نظام قاعدة البيانات يحفظ الطلبات في ملف `data/orders.json`:

```json
[
  {
    "id": "order_1699123456_abc123",
    "paymentId": "pi_xxxxxxxxx",
    "status": "paid",
    "amount": 299.00,
    "currency": "AED",
    "customerEmail": "customer@example.com",
    "customerName": "أحمد محمد",
    "items": [
      {
        "id": 1,
        "name": "منتج رقمي",
        "price": 149.50,
        "quantity": 2
      }
    ],
    "downloadUrl": "https://blob.vercel-storage.com/receipts/pi_xxx_receipt.txt",
    "downloadExpiry": 1701715456000,
    "createdAt": "2025-11-04T15:30:00.000Z",
    "paidAt": "2025-11-04T15:30:30.000Z"
  }
]
```

### 4.2 الوظائف المتاحة

```typescript
import { 
  createOrder, 
  findOrderByPaymentId, 
  updateOrderByPaymentId,
  getAllOrders,
  getOrdersByStatus 
} from "@/lib/database";

// إنشاء طلب جديد
const order = createOrder({
  id: "order_123",
  paymentId: "pi_xxx",
  status: "paid",
  amount: 299,
  currency: "AED",
  // ...
});

// البحث عن طلب
const order = findOrderByPaymentId("pi_xxx");

// تحديث طلب
updateOrderByPaymentId("pi_xxx", {
  status: "paid",
  paidAt: new Date().toISOString()
});

// الحصول على كل الطلبات المدفوعة
const paidOrders = getOrdersByStatus("paid");
```

### 4.3 ملاحظات مهمة

⚠️ **للمشاريع الكبيرة:**
- استخدم قاعدة بيانات حقيقية (PostgreSQL, MongoDB)
- يمكنك استخدام Vercel Postgres أو Supabase

⚠️ **في Production:**
- تأكد من backup للملف `data/orders.json`
- يمكن نقله لـ Vercel Blob للنسخ الاحتياطي التلقائي

---

## 📦 الخطوة 5: Vercel Blob Storage

### 5.1 تفعيل Blob Storage

1. اذهب إلى **Vercel Dashboard**
2. **Storage** → **Create Database**
3. اختر **Blob**
4. اضغط **Connect**
5. سيتم إضافة `BLOB_READ_WRITE_TOKEN` تلقائياً للمتغيرات البيئية

### 5.2 كيفية الاستخدام

```typescript
import { uploadTextFile, uploadFileFromBuffer } from "@/lib/blob-storage";

// رفع ملف نصي
const result = await uploadTextFile(
  "receipts/payment_123.txt",
  "محتوى الإيصال"
);

console.log("Download URL:", result.downloadUrl);
// https://xxxxx.public.blob.vercel-storage.com/receipts/payment_123.txt

// رفع ملف ثنائي (PDF, ZIP, etc.)
const pdfBuffer = Buffer.from(pdfData);
const result = await uploadFileFromBuffer(
  "products/ebook.pdf",
  pdfBuffer,
  "application/pdf"
);
```

### 5.3 ما الذي يتم رفعه؟

حالياً، عند كل دفعة ناجحة، نرفع:
1. ✅ **إيصال نصي** بتفاصيل الدفعة
2. 🔜 يمكن إضافة ملفات المنتجات

### 5.4 الملفات الخاصة (Private Files)

إذا أردت ملفات خاصة تحتاج signed URL:

```typescript
import { uploadPrivateFile } from "@/lib/blob-storage";

// رفع ملف خاص
const result = await uploadPrivateFile(
  "private/customer_file.pdf",
  fileBuffer,
  "application/pdf"
);

// توليد رابط مؤقت (صالح ساعة واحدة)
const signedUrl = await generateSignedUrl(result.pathname, 3600);

// إرسال الرابط للعميل
await sendEmailWithDownloadLink(customerEmail, signedUrl);
```

---

## 🔗 الخطوة 6: توليد روابط تحميل مؤقتة

### 6.1 لماذا روابط مؤقتة؟

✅ **الأمان:** الرابط يعمل لفترة محددة فقط
✅ **الحماية:** لا يمكن مشاركة الرابط للأبد
✅ **التحكم:** يمكن إلغاء الوصول بعد فترة

### 6.2 مثال عملي

```typescript
// في webhook handler عند نجاح الدفع:

// 1. رفع ملف المنتج
const productFile = await uploadPrivateFile(
  `products/${paymentId}/ebook.pdf`,
  pdfBuffer,
  "application/pdf"
);

// 2. توليد رابط مؤقت (صالح 24 ساعة)
const downloadUrl = await generateSignedUrl(
  productFile.pathname,
  24 * 60 * 60 // 24 hours in seconds
);

// 3. حفظ الرابط في قاعدة البيانات
updateOrderByPaymentId(paymentId, {
  downloadUrl: downloadUrl,
  downloadExpiry: Date.now() + (24 * 60 * 60 * 1000)
});

// 4. إرسال الرابط للعميل
await sendDownloadEmail({
  email: customerEmail,
  downloadUrl: downloadUrl,
  expiryHours: 24
});
```

---

## 📧 الخطوة 7: إرسال بريد إلكتروني (اختياري)

### 7.1 اختيار خدمة البريد

خيارات شائعة:
- **Resend** (سهل وحديث) ✅ مستحسن
- **SendGrid** (قوي ومتقدم)
- **Mailgun**
- **Amazon SES**

### 7.2 مثال باستخدام Resend

```bash
npm install resend
```

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendDownloadEmail({
  email,
  orderId,
  downloadUrl,
  expiryHours
}: {
  email: string;
  orderId: string;
  downloadUrl: string;
  expiryHours: number;
}) {
  await resend.emails.send({
    from: 'LEVEL UP <noreply@yourdomain.com>',
    to: email,
    subject: '✅ تم تأكيد طلبك - رابط التحميل جاهز!',
    html: `
      <div dir="rtl">
        <h2>🎉 شكراً على طلبك!</h2>
        <p>تم تأكيد دفعتك بنجاح.</p>
        <p><strong>رقم الطلب:</strong> ${orderId}</p>
        
        <p>يمكنك تحميل ملفاتك من الرابط التالي:</p>
        <a href="${downloadUrl}" 
           style="display: inline-block; padding: 12px 24px; 
                  background: #4CAF50; color: white; 
                  text-decoration: none; border-radius: 4px;">
          📥 تحميل الملفات
        </a>
        
        <p>⏰ <strong>ملاحظة:</strong> هذا الرابط صالح لمدة ${expiryHours} ساعة فقط.</p>
        
        <hr/>
        <p>إذا واجهت أي مشكلة، تواصل معنا.</p>
        <p>LEVEL UP Store</p>
      </div>
    `
  });
}
```

### 7.3 دمجها في Webhook

```typescript
// في app/api/ziina-webhook/route.ts

if (paymentStatus === "succeeded") {
  // ... (بعد رفع الملف وتوليد الرابط)
  
  await sendDownloadEmail({
    email: customerEmail,
    orderId: order.id,
    downloadUrl: order.downloadUrl,
    expiryHours: 24
  });
  
  console.log("📧 Download email sent to:", customerEmail);
}
```

---

## 🧪 الخطوة 8: الاختبار

### 8.1 اختبار محلي

```bash
# تشغيل المشروع محلياً
npm run dev
```

ثم استخدم أداة مثل **ngrok** لفتح نفق للـ localhost:

```bash
ngrok http 3000
```

استخدم الرابط الذي يعطيك ngrok في Ziina webhook settings:
```
https://abc123.ngrok.io/api/ziina-webhook
```

### 8.2 اختبار التوقيع

```typescript
import { generateTestSignature } from "@/lib/signature";

const testPayload = {
  id: "pi_test_123",
  status: "succeeded",
  amount: 299
};

const signature = generateTestSignature(
  testPayload,
  process.env.ZIINA_WEBHOOK_SECRET!
);

console.log("Test signature:", signature);

// استخدم هذا التوقيع في header عند إرسال test request
```

### 8.3 اختبار من Ziina Dashboard

1. اذهب إلى **Webhooks** في Ziina Dashboard
2. اختر الـ webhook الخاص بك
3. اضغط **Send Test Event**
4. اختر `payment.succeeded`
5. تحقق من:
   - ✅ Vercel Logs يعرض "✅ Payment succeeded"
   - ✅ Discord يستلم الإشعار
   - ✅ الطلب يُحفظ في `data/orders.json`
   - ✅ الإيصال يُرفع على Vercel Blob

---

## 📊 الخطوة 9: المراقبة والصيانة

### 9.1 مراقبة Vercel Logs

```bash
vercel logs --follow
```

أو من Dashboard:
- **Vercel Dashboard** → **Logs**

### 9.2 مراقبة Webhooks في Ziina

- **Ziina Dashboard** → **Webhooks** → **Logs**
- ستجد:
  - ✅ Successful webhooks (200)
  - ❌ Failed webhooks
  - 🔄 Retries

### 9.3 نسخ احتياطي لقاعدة البيانات

يمكنك إعداد cron job يرفع `data/orders.json` على Vercel Blob يومياً:

```typescript
// app/api/backup-db/route.ts
import { uploadJsonFile } from "@/lib/blob-storage";
import { getAllOrders } from "@/lib/database";

export async function GET() {
  const orders = getAllOrders();
  const timestamp = new Date().toISOString().split('T')[0];
  
  await uploadJsonFile(
    `backups/orders_${timestamp}.json`,
    orders
  );
  
  return NextResponse.json({ message: "Backup created" });
}
```

---

## 🎯 الخطوة 10: التوسعات المستقبلية

### 10.1 إضافة Telegram Bot

```typescript
async function sendTelegramNotification(message: string) {
  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    }
  );
}
```

### 10.2 إضافة Analytics

```typescript
// تتبع عدد الدفعات، المبالغ، إلخ
import { track } from "@vercel/analytics";

track("payment_succeeded", {
  amount: amount,
  currency: currency,
  payment_id: paymentId
});
```

### 10.3 نظام Refund تلقائي

```typescript
if (shouldRefund(order)) {
  await processRefund(order.paymentId);
  await sendRefundEmail(order.customerEmail);
}
```

---

## ✅ Checklist النهائي

قبل الإطلاق، تأكد من:

- [ ] ✅ تم رفع المشروع على Vercel
- [ ] ✅ webhook URL مضاف في Ziina Dashboard
- [ ] ✅ `ZIINA_SECRET_KEY` موجود في Environment Variables
- [ ] ✅ `ZIINA_WEBHOOK_SECRET` موجود في Environment Variables
- [ ] ✅ `DISCORD_WEBHOOK_URL` موجود (اختياري)
- [ ] ✅ `BLOB_READ_WRITE_TOKEN` موجود (تلقائي من Vercel)
- [ ] ✅ تم اختبار webhook من Ziina Dashboard
- [ ] ✅ Discord يستلم الإشعارات بنجاح
- [ ] ✅ الطلبات تُحفظ في `data/orders.json`
- [ ] ✅ الإيصالات تُرفع على Vercel Blob
- [ ] ✅ Vercel Logs يعرض رسائل واضحة

---

## 🆘 المساعدة والدعم

إذا واجهت مشاكل:

1. 📝 **تحقق من Logs:**
   - Vercel: `vercel logs`
   - Ziina: Dashboard → Webhooks → Logs

2. 🔍 **رسائل الأخطاء الشائعة:**
   - `Invalid signature`: تحقق من `ZIINA_WEBHOOK_SECRET`
   - `Discord notification failed`: تحقق من `DISCORD_WEBHOOK_URL`
   - `Blob upload failed`: تحقق من `BLOB_READ_WRITE_TOKEN`

3. 🧪 **اختبر كل جزء بشكل منفصل:**
   ```bash
   # اختبر Discord فقط
   curl -X POST ${DISCORD_WEBHOOK_URL} \
     -H "Content-Type: application/json" \
     -d '{"content": "Test message"}'
   
   # اختبر Blob فقط
   # (استخدم الكود في المشروع)
   ```

---

## 📚 موارد إضافية

- [Ziina API Docs](https://docs.ziina.com)
- [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)
- [Discord Webhooks Guide](https://discord.com/developers/docs/resources/webhook)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

🎉 **تهانينا! لديك الآن نظام webhook احترافي ومتكامل!**

