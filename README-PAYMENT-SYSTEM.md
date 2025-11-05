# 💳 نظام الدفع والتحميل الآمن - دليل شامل

## 📋 نظرة عامة

نظام متكامل لإدارة المدفوعات والتحميل الآمن للمنتجات الرقمية باستخدام **Next.js 14 App Router** مع **Vercel Blob Storage** و **Ziina Payment Gateway**.

### ✨ المميزات الرئيسية

- 🔐 **Token-based Authentication**: توكنات آمنة مؤقتة لكل عملية تحميل
- ⏰ **Time-Limited Access**: صلاحية 10 دقائق للتوكنات
- 🔒 **Secure Downloads**: التحميل عبر السيرفر بدون كشف روابط التخزين
- 📊 **Comprehensive Logging**: تسجيل شامل لكل العمليات
- 🎨 **Beautiful Invoice Page**: صفحة فاتورة احترافية ومتجاوبة
- 🔄 **Auto-Retry Logic**: محاولات تلقائية عند تأخر Webhook
- 📱 **WhatsApp Support**: زر دعم مباشر عبر واتساب
- 🌐 **RTL Support**: دعم كامل للغة العربية

---

## 🏗️ البنية التقنية

### الملفات الأساسية

```
app/
├── api/
│   ├── webhook/
│   │   └── route.ts          # معالج Webhook من Ziina
│   ├── record/
│   │   └── route.ts          # API لجلب بيانات الطلب
│   └── download/
│       └── [token]/
│           └── route.ts      # API التحميل الآمن
└── order-success/
    └── page.tsx              # صفحة الفاتورة الرقمية

data/
└── products-store.json       # قاعدة بيانات المنتجات
```

### التدفق الكامل

```
┌─────────────────────────────────────────────┐
│ 1. عميل يدفع على Ziina                     │
│    - يختار منتج                            │
│    - يدخل بيانات الدفع                     │
│    - يُكمل الدفع                           │
└─────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│ 2. Ziina ترسل Webhook                      │
│    POST /api/webhook                        │
│    {                                        │
│      "data": {                              │
│        "id": "payment_id",                  │
│        "status": "completed",               │
│        "amount": 5550,                      │
│        "customer_email": "user@example.com" │
│      }                                      │
│    }                                        │
└─────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│ 3. Webhook ينشئ Token آمن                  │
│    - يُنشئ: tok_<32 hex chars>             │
│    - يحدد: صلاحية 10 دقائق                │
│    - يطابق: المنتج حسب message/product_id  │
└─────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│ 4. حفظ مزدوج في Vercel Blob                │
│    - payments/{payment_id}.json            │
│    - tokens/{token}.json                   │
└─────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│ 5. Ziina تُحوّل العميل                     │
│    → /order-success?payment_id=xxx         │
└─────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│ 6. صفحة تجلب السجل                         │
│    GET /api/record?payment_id=xxx          │
│    - Retry: 20 × 2s (40 ثانية)            │
└─────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│ 7. عرض فاتورة + زر تحميل                   │
│    - صورة المنتج                           │
│    - تفاصيل الطلب                          │
│    - زر: /api/download/{token}             │
└─────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│ 8. عميل يضغط "تحميل"                       │
│    GET /api/download/tok_xxx               │
└─────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│ 9. Download API يتحقق                      │
│    ✓ Token موجود                           │
│    ✓ لم ينتهي                             │
│    ✓ لم يُستخدم (اختياري)                 │
└─────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│ 10. تحميل الملف بأمان                      │
│     - جلب من Blob URL                      │
│     - Stream عبر السيرفر                   │
│     - Headers آمنة                         │
│     - Mark as used                         │
└─────────────────────────────────────────────┘
```

---

## 🔧 الإعداد والتثبيت

### 1. Environment Variables

أنشئ ملف `.env.local` في جذر المشروع:

```env
# ═══════════════════════════════════════════════════════════
# Vercel Blob Storage
# ═══════════════════════════════════════════════════════════
# للحصول عليه: https://vercel.com/dashboard → Storage → Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXX

# ═══════════════════════════════════════════════════════════
# WhatsApp Support (اختياري)
# ═══════════════════════════════════════════════════════════
# رقم الواتساب للدعم (بدون +)
NEXT_PUBLIC_WHATSAPP_NUMBER=966500000000

# ═══════════════════════════════════════════════════════════
# Ziina Settings (للمرجع فقط - تُضبط في لوحة Ziina)
# ═══════════════════════════════════════════════════════════
# Webhook URL: https://leve1up.vercel.app/api/webhook
# Success URL: https://leve1up.vercel.app/order-success?payment_id={PAYMENT_ID}
```

### 2. إعدادات Ziina Dashboard

في لوحة تحكم Ziina:

#### Webhook Settings
```
URL: https://leve1up.vercel.app/api/webhook
Events: payment.completed
Method: POST
```

#### Redirect URLs
```
Success URL: https://leve1up.vercel.app/order-success?payment_id={PAYMENT_ID}
Cancel URL: https://leve1up.vercel.app/checkout?cancelled=true
```

**ملاحظة مهمة:** 
- Ziina قد لا تستبدل `{PAYMENT_ID}` تلقائياً
- الكود يعتمد على Webhook لإنشاء access token
- صفحة order-success تحتوي على retry logic للانتظار

### 3. رفع المنتجات إلى Vercel Blob

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# رفع ملف منتج
vercel blob upload /path/to/product.pdf --token $BLOB_READ_WRITE_TOKEN
```

أو باستخدام واجهة Vercel:
```
Dashboard → Storage → Blob → Upload
```

### 4. تحديث products-store.json

```json
{
  "product_id": 1,
  "product_name": "15 فكرة مشروع رقمي مربح",
  "download_url": "https://YOUR_BLOB_URL.public.blob.vercel-storage.com/file.pdf",
  "price_aed": 55.50,
  ...
}
```

---

## 📘 دليل الاستخدام

### 1. Webhook Handler (`/api/webhook/route.ts`)

**الوظيفة:** استقبال إشعارات الدفع من Ziina

**الاستقبال:**
```typescript
POST /api/webhook
Content-Type: application/json

{
  "data": {
    "id": "24d7813b-2af7-4c89-b9be-040ec8e626a6",
    "status": "completed",
    "amount": 5550,  // بالفلسات
    "currency_code": "AED",
    "customer_email": "user@example.com",
    "customer_name": "أحمد محمد",
    "message": "دفع مقابل 15 فكرة مشروع",
    "metadata": {
      "product_id": 1
    }
  }
}
```

**المعالجة:**
1. قراءة من `body.data`
2. التحقق من `status === "completed"`
3. إنشاء `access_token` فريد: `tok_<32 hex>`
4. تحديد `expires_at`: `now + 10 minutes`
5. مطابقة المنتج من `products-store.json`
6. حفظ السجل في Blob:
   - `payments/{payment_id}.json`
   - `tokens/{token}.json`

**Response:**
```json
{
  "success": true,
  "payment_id": "24d7813b-...",
  "order_number": "ORD-1730790000-ABC12",
  "access_token": "tok_a3f8c9d2e7b4f1a6...",
  "expires_at": "2024-11-05T07:35:00.000Z",
  "redirect_url": "https://leve1up.vercel.app/order-success?payment_id=xxx&access=tok_xxx"
}
```

**Console Output:**
```
═══════════════════════════════════════════════════════════════════
🔔 WEBHOOK RECEIVED
⏰ Timestamp: 2024-11-05T07:25:00.000Z
═══════════════════════════════════════════════════════════════════
📊 PAYMENT DETAILS:
  💳 Payment ID: 24d7813b-2af7-4c89-b9be-040ec8e626a6
  📊 Status: completed
  💰 Amount: 5550 fils = 55.50 AED
───────────────────────────────────────────────────────────────────
📦 PRODUCT MATCHED:
  🆔 Product ID: 1
  📝 Name: 15 فكرة مشروع رقمي مربح
───────────────────────────────────────────────────────────────────
🔐 SECURITY TOKEN GENERATED:
  🎫 Token: tok_a3f8c9d2e7b4f1a6c8e5d2a9b7f4c1e8
  ⏰ Expires: 2024-11-05T07:35:00.000Z
───────────────────────────────────────────────────────────────────
✅ PAYMENT SAVED SUCCESSFULLY!
✅ Payment saved and token: tok_a3f8c9d2e7b4f1a6...
💳 Payment ID: 24d7813b-2af7-4c89-b9be-040ec8e626a6
📦 Order Number: ORD-1730790000-ABC12
💰 Amount: 55.50 AED
⏱️ Processing time: 245ms
═══════════════════════════════════════════════════════════════════
```

---

### 2. Record API (`/api/record/route.ts`)

**الوظيفة:** جلب بيانات الطلب للعرض في الفاتورة

**الاستعلام:**
```typescript
// بـ payment_id
GET /api/record?payment_id=24d7813b-2af7-4c89-b9be-040ec8e626a6

// أو بـ token
GET /api/record?token=tok_a3f8c9d2e7b4f1a6c8e5d2a9b7f4c1e8
```

**Response:**
```json
{
  "success": true,
  "record": {
    "payment_id": "24d7813b-...",
    "order_number": "ORD-1730790000-ABC12",
    "product_name": "15 فكرة مشروع رقمي مربح",
    "product_image": "/images/products/15-project-ideas.png",
    "amount": 55.50,
    "currency": "AED",
    "filename": "15-افكار-مشروع-رقمي.pdf",
    "access_token": "tok_a3f8c9d2...",
    "expires_at": "2024-11-05T07:35:00.000Z",
    "created_at": "2024-11-05T07:25:00.000Z",
    "used": false,
    "download_count": 0,
    "customer_email": "user@example.com",
    "customer_name": "أحمد محمد"
    // لا يُرجع download_url الحقيقي
  },
  "is_expired": false,
  "time_remaining_minutes": 8,
  "metadata": {
    "fetched_at": "2024-11-05T07:27:00.000Z",
    "fetched_by": "payment_id",
    "processing_time_ms": 145
  }
}
```

**رموز الأخطاء:**
- `400`: Missing query parameters
- `404`: Record not found
- `500`: Server error

---

### 3. Download API (`/api/download/[token]/route.ts`)

**الوظيفة:** تحميل الملفات بأمان عبر السيرفر

**الاستعلام:**
```typescript
// Stream mode (افتراضي - آمن)
GET /api/download/tok_a3f8c9d2e7b4f1a6c8e5d2a9b7f4c1e8

// Redirect mode (يوفر bandwidth لكن يكشف الرابط)
GET /api/download/tok_a3f8c9d2e7b4f1a6c8e5d2a9b7f4c1e8?redirect=true
```

**التحققات:**
1. ✅ Token موجود في Blob
2. ✅ لم ينتهِ (`expires_at > now`)
3. ✅ لم يُستخدم (اختياري للـ single-use)

**Response Headers:**
```
Content-Disposition: attachment; filename="15-افكار-مشروع-رقمي.pdf"
Content-Type: application/pdf
Content-Length: 2516582
Cache-Control: no-store, no-cache, must-revalidate, private
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

**رموز الأخطاء:**
- `404`: Token not found
- `410`: Token expired or already used (Gone)
- `502`: Failed to fetch file from storage
- `500`: Server error

---

### 4. Invoice Page (`/app/order-success/page.tsx`)

**الوظيفة:** عرض فاتورة رقمية شاملة

**URL:**
```
/order-success?payment_id=24d7813b-2af7-4c89-b9be-040ec8e626a6
```

**الميزات:**
- ✅ Retry logic: 20 محاولة × 2 ثانية
- ✅ Loading state مع progress bar
- ✅ عرض تفاصيل كاملة
- ✅ زر تحميل آمن
- ✅ تحذير انتهاء الصلاحية
- ✅ زر واتساب للدعم
- ✅ Dark mode support
- ✅ Fully responsive

---

## 🔐 الأمان والحماية

### Token Security

```typescript
// إنشاء token آمن
function generateAccessToken(): string {
  const randomPart = randomBytes(16).toString('hex'); // 32 chars
  return `tok_${randomPart}`;
}

// مثال: tok_a3f8c9d2e7b4f1a6c8e5d2a9b7f4c1e8
```

### Time-Limited Access

```typescript
// صلاحية 10 دقائق
function getExpiryTimestamp(minutes: number = 10): string {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

// التحقق من الصلاحية
function isTokenExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}
```

### Single-Use Tokens (اختياري)

```typescript
// في download API - لتفعيل single-use:
if (record.used) {
  return NextResponse.json({
    error: "Token already used",
    code: "TOKEN_ALREADY_USED"
  }, { status: 410 });
}

// بعد التحميل الناجح
await markTokenAsUsed(token, record);
```

### Secure HTTP Headers

```typescript
{
  'Cache-Control': 'no-store, no-cache, must-revalidate, private',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'no-referrer'
}
```

### Audit Logging

كل عملية تحميل تُسجّل:
```typescript
console.log("🚨 SECURITY LOG:");
console.log(`  Token: ${token}`);
console.log(`  IP: ${ipAddress}`);
console.log(`  User-Agent: ${userAgent}`);
console.log(`  Timestamp: ${new Date().toISOString()}`);
```

---

## 🧪 الاختبار

### 1. اختبار Webhook يدوياً

```bash
curl -X POST https://leve1up.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "id": "test-payment-12345",
      "status": "completed",
      "amount": 5550,
      "currency_code": "AED",
      "customer_email": "test@example.com",
      "customer_name": "Test User",
      "message": "اختبار دفع",
      "metadata": {
        "product_id": 1
      }
    }
  }'
```

### 2. اختبار Record API

```bash
curl "https://leve1up.vercel.app/api/record?payment_id=test-payment-12345"
```

### 3. اختبار Download API

```bash
# Stream mode
curl "https://leve1up.vercel.app/api/download/tok_xxx" -o test-file.pdf

# Redirect mode
curl -L "https://leve1up.vercel.app/api/download/tok_xxx?redirect=true" -o test-file.pdf
```

### 4. اختبار الفاتورة

افتح في المتصفح:
```
https://leve1up.vercel.app/order-success?payment_id=test-payment-12345
```

---

## 📊 المراقبة والتتبع

### Vercel Logs

```bash
# عرض logs حية
vercel logs --follow

# تصفية حسب function
vercel logs --filter=api/webhook
vercel logs --filter=api/download
```

### Console Logging

كل API endpoint يطبع:
- ✅ Request info (timestamp, params, headers)
- ✅ Processing steps
- ✅ Success/Error details
- ✅ Performance metrics (duration)

مثال:
```
═══════════════════════════════════════════════════════════════════
🔒 SECURE DOWNLOAD API CALLED
⏰ Timestamp: 2024-11-05T07:30:00.000Z
═══════════════════════════════════════════════════════════════════
📋 Request Info:
  🎫 Token: tok_a3f8c9d2e7b...
  🌐 IP: 192.168.1.1
  🖥️ User-Agent: Mozilla/5.0...
───────────────────────────────────────────────────────────────────
✅ RECORD FOUND:
  💳 Payment ID: 24d7813b-2af7-4c89-b9be-040ec8e626a6
  📦 Product: 15 فكرة مشروع رقمي مربح
───────────────────────────────────────────────────────────────────
✅ DOWNLOAD SUCCESS
⏱️ Processing time: 187ms
═══════════════════════════════════════════════════════════════════
```

---

## 🚀 التحسينات المستقبلية

### 1. استبدال Blob بقاعدة بيانات

```typescript
// بدلاً من Vercel Blob، استخدم PostgreSQL/MongoDB
import { prisma } from '@/lib/prisma';

async function saveOrderRecord(data: OrderRecord) {
  return await prisma.order.create({
    data: {
      paymentId: data.payment_id,
      accessToken: data.access_token,
      expiresAt: new Date(data.expires_at),
      // ...
    }
  });
}
```

### 2. Signed URLs (توفير Bandwidth)

```typescript
// توليد signed URL مؤقت
import { generateSignedUrl } from '@vercel/blob';

const signedUrl = await generateSignedUrl(downloadUrl, {
  expiresIn: 300 // 5 دقائق
});

return NextResponse.redirect(signedUrl);
```

### 3. Watermarking (ردع التسريب)

```typescript
import { PDFDocument } from 'pdf-lib';

async function addWatermark(pdfBuffer: Buffer, text: string) {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  // إضافة watermark على كل صفحة
  // text = email أو payment_id
}
```

### 4. Email Notifications

```typescript
import { Resend } from 'resend';

async function sendOrderConfirmation(email: string, data: any) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  await resend.emails.send({
    from: 'orders@leve1up.com',
    to: email,
    subject: 'تم استلام طلبك!',
    html: `...`
  });
}
```

### 5. Rate Limiting

```typescript
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 m')
});

const { success } = await ratelimit.limit(ipAddress);
if (!success) {
  return new Response('Too many requests', { status: 429 });
}
```

---

## 🐛 استكشاف الأخطاء

### Webhook لا يصل

**المشكلة:** لا تصل إشعارات Webhook

**الحلول:**
1. تحقق من URL في لوحة Ziina
2. تحقق من أن الـ endpoint متاح: `GET /api/webhook`
3. راجع Vercel logs: `vercel logs --filter=api/webhook`

### السجل غير موجود

**المشكلة:** `/api/record` يرجع 404

**الحلول:**
1. انتظر 30-60 ثانية (تأخر Webhook طبيعي)
2. تحقق من Vercel Blob: `https://vercel.com/dashboard`
3. تحقق من payment_id صحيح

### Token منتهي

**المشكلة:** Download يرجع 410 Gone

**الحلول:**
1. التوكنات صالحة لـ 10 دقائق فقط
2. تواصل عبر واتساب لطلب رابط جديد
3. يمكن زيادة المدة في `getExpiryTimestamp(minutes)`

### ملف لا يُحمّل

**المشكلة:** Download يفشل أو يرجع 502

**الحلول:**
1. تحقق من `download_url` صحيح في `products-store.json`
2. تحقق من أن الملف موجود في Vercel Blob
3. جرّب `?redirect=true` للاختبار

---

## 📞 الدعم

**للأسئلة والمساعدة:**
- 📧 Email: support@leve1up.com
- 💬 WhatsApp: +966500000000
- 🌐 Website: https://leve1up.vercel.app

---

## 📄 الترخيص

هذا المشروع ملك لـ **Level Up Digital Store**. جميع الحقوق محفوظة © 2024

---

**Made with ❤️ in Saudi Arabia 🇸🇦**

