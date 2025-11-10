# 🚀 دليل نشر متجر الملفات الرقمية

## 📋 المحتويات
1. [نظرة عامة](#نظرة-عامة)
2. [المتطلبات](#المتطلبات)
3. [إعداد المشروع](#إعداد-المشروع)
4. [متغيرات البيئة](#متغيرات-البيئة)
5. [النشر على Vercel](#النشر-على-vercel)
6. [اختبار النظام](#اختبار-النظام)
7. [الصيانة](#الصيانة)

---

## 🌟 نظرة عامة

### الميزات الرئيسية:
- ✅ **متجر ملفات رقمية كامل** مع سلة تسوق
- ✅ **بوابة دفع Ziina** متكاملة
- ✅ **Webhook handler** آمن ومتطور
- ✅ **قاعدة بيانات JSON** بدون الحاجة لـ database تقليدية
- ✅ **Vercel Blob Storage** للملفات
- ✅ **صفحة طلبات محمية** مع Authentication
- ✅ **روابط تحميل مؤقتة** آمنة
- ✅ **تصميم متجاوب** 100% Mobile-first
- ✅ **إشعارات Discord** تلقائية
- ✅ **نظام تسجيل متقدم** للأخطاء

### البنية التقنية:
- **Framework:** Next.js 14.2+ (App Router)
- **Styling:** Tailwind CSS
- **Storage:** Vercel Blob
- **Payment:** Ziina Payment Gateway
- **Hosting:** Vercel
- **Database:** JSON files (no-database approach)

---

## 🔧 المتطلبات

### 1. حساب Vercel
- اذهب إلى [vercel.com](https://vercel.com)
- أنشئ حساب مجاني
- اربط حسابك مع GitHub

### 2. حساب Ziina
- اذهب إلى [dashboard.ziina.com](https://dashboard.ziina.com)
- أنشئ حساب تاجر
- احصل على API Keys (Sandbox للتطوير، Live للإنتاج)

### 3. حساب Discord (اختياري)
- أنشئ Discord server
- أنشئ webhook URL لإشعارات الطلبات

### 4. أدوات محلية
```bash
Node.js 18+ (الأفضل v20 أو أحدث)
npm أو yarn أو pnpm
Git
```

---

## 📦 إعداد المشروع

### 1. استنساخ المشروع
```bash
git clone <your-repo-url>
cd no-db-backend-magic
```

### 2. تثبيت المكتبات
```bash
npm install
# أو
yarn install
# أو
pnpm install
```

### 3. إنشاء ملف المتغيرات المحلية
```bash
cp .env.example .env.local
```

---

## 🔐 متغيرات البيئة

### ملف `.env.local`:

```bash
# ================================
# Ziina Payment Gateway
# ================================
ZIINA_API_KEY=your_ziina_api_key_here
ZIINA_MERCHANT_ID=your_merchant_id_here
ZIINA_WEBHOOK_SECRET=your_webhook_secret_here

# ================================
# Vercel Blob Storage
# ================================
BLOB_READ_WRITE_TOKEN=vercel_blob_token_here

# ================================
# Discord Notifications (اختياري)
# ================================
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# ================================
# JWT Authentication
# ================================
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# ================================
# Email Service (اختياري - للمستقبل)
# ================================
# RESEND_API_KEY=re_xxxxx
# SENDGRID_API_KEY=SG.xxxxx

# ================================
# Base URL
# ================================
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# في الإنتاج: https://yourdomain.vercel.app
```

### الحصول على API Keys:

#### 🔹 Ziina API Keys:
1. اذهب إلى [Ziina Dashboard](https://dashboard.ziina.com)
2. **Settings** → **API Keys**
3. انسخ:
   - API Key
   - Merchant ID
   - Webhook Secret

#### 🔹 Vercel Blob Token:
1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروعك
3. **Storage** → **Create Database** → **Blob**
4. انسخ `BLOB_READ_WRITE_TOKEN`

#### 🔹 Discord Webhook (اختياري):
1. افتح Discord Server
2. **Server Settings** → **Integrations** → **Webhooks**
3. **New Webhook** → انسخ URL

---

## 🚀 النشر على Vercel

### الطريقة 1: من GitHub (الأفضل)

1. **رفع الكود على GitHub:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **ربط مع Vercel:**
   - اذهب إلى [vercel.com/new](https://vercel.com/new)
   - اختر مستودع GitHub
   - اضغط **Import**

3. **إعداد متغيرات البيئة:**
   - في صفحة المشروع: **Settings** → **Environment Variables**
   - أضف جميع المتغيرات من `.env.local`

4. **نشر:**
   - Vercel ينشر تلقائياً
   - انتظر حتى ينتهي البناء
   - احصل على رابط المشروع

### الطريقة 2: Vercel CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# النشر
vercel

# للإنتاج
vercel --prod
```

---

## 🧪 اختبار النظام

### 1. اختبار محلي:
```bash
npm run dev
# افتح: http://localhost:3000
```

### 2. اختبار Webhook محلياً:

**الطريقة 1: استخدام ngrok**
```bash
# تثبيت ngrok
npm install -g ngrok

# تشغيل
ngrok http 3000

# انسخ URL وأضفه في Ziina Dashboard
https://xxxx.ngrok.io/api/ziina-webhook
```

**الطريقة 2: استخدام Vercel tunnel**
```bash
vercel dev --listen 3000
```

### 3. اختبار Webhook في Ziina:
1. اذهب إلى [Ziina Dashboard](https://dashboard.ziina.com)
2. **Settings** → **Webhooks**
3. أضف Webhook URL:
   ```
   https://yourdomain.vercel.app/api/ziina-webhook
   ```
4. اختر Events:
   - `payment_intent.succeeded`
   - `payment_intent.failed`
   - `payment_intent.refunded`
5. احفظ

### 4. اختبار دفعة:
```bash
# استخدم test cards من Ziina:
Card: 4242 4242 4242 4242
Expiry: أي تاريخ مستقبلي
CVV: أي 3 أرقام
```

---

## 📁 هيكل المشروع

```
no-db-backend-magic/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts       # تسجيل الدخول
│   │   │   ├── logout/route.ts      # تسجيل الخروج
│   │   │   └── session/route.ts     # معلومات المستخدم
│   │   ├── download/route.ts        # روابط التحميل
│   │   ├── orders/route.ts          # البحث عن الطلبات
│   │   ├── send-email/route.ts      # إرسال الإيميلات
│   │   └── ziina-webhook/route.ts   # استقبال إشعارات Ziina
│   ├── account/page.tsx             # صفحة الطلبات المحمية
│   ├── cart/page.tsx                # سلة التسوق
│   ├── orders/page.tsx              # البحث عن الطلبات (عامة)
│   ├── success/page.tsx             # صفحة النجاح
│   └── layout.tsx                   # Layout رئيسي
├── components/
│   ├── Navbar.tsx                   # الهيدر الثابت
│   └── Footer.tsx                   # الفوتر
├── lib/
│   ├── auth.ts                      # نظام Authentication
│   ├── blob-storage.ts              # Vercel Blob integration
│   ├── database.ts                  # قاعدة بيانات JSON
│   └── discord.ts                   # إشعارات Discord
├── data/
│   └── orders.json                  # قاعدة البيانات
├── public/
│   └── products/                    # صور المنتجات
└── README.md
```

---

## 🔐 الأمان

### 1. حماية Webhook:
```typescript
// التحقق من التوقيع في ziina-webhook/route.ts
const signature = req.headers.get('ziina-signature');
if (!verifySignature(body, signature)) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
}
```

### 2. حماية صفحة /account:
```typescript
// التحقق من تسجيل الدخول
const session = await getSession();
if (!session) {
  router.push('/orders');
}
```

### 3. متغيرات البيئة:
- ❌ **لا تضع** API keys في الكود
- ✅ **استخدم** Environment Variables
- ✅ **أضف** `.env.local` في `.gitignore`

---

## 🎨 التخصيص

### تغيير الألوان:
افتح `tailwind.config.ts`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        300: '#5AC8FA',  // اللون الأساسي
        400: '#4AB8EA',
        600: '#3AA8DA',
      },
    },
  },
}
```

### إضافة منتجات:
افتح `data/products.json`:
```json
{
  "id": "product_new",
  "name": "منتج جديد",
  "description": "وصف المنتج",
  "price": 99.99,
  "currency": "AED",
  "image": "/products/new-product.jpg",
  "category": "digital",
  "inStock": true
}
```

---

## 📧 إعداد الإيميل (اختياري)

### استخدام Resend:

1. **إنشاء حساب:**
   - اذهب إلى [resend.com](https://resend.com)
   - سجل مجاناً (100 إيميل/يوم)

2. **الحصول على API Key:**
   - **Settings** → **API Keys**
   - أنشئ key جديد

3. **تفعيل Domain:**
   - **Domains** → **Add Domain**
   - اتبع التعليمات لإضافة DNS records

4. **تثبيت المكتبة:**
```bash
npm install resend
```

5. **إلغاء التعليق في الكود:**
افتح `app/api/send-email/route.ts` وألغِ التعليق:
```typescript
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'orders@yourdomain.com',
  to: to,
  subject: subject,
  html: html,
});
```

---

## 📊 المراقبة والتحليل

### Vercel Analytics:
```bash
npm install @vercel/analytics
```

في `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Discord Notifications:
- جميع الطلبات الجديدة ترسل إشعار لـ Discord
- يمكنك مراقبة المبيعات في الوقت الفعلي

---

## 🐛 حل المشاكل

### المشكلة: Webhook لا يعمل
**الحل:**
1. تحقق من Webhook URL في Ziina Dashboard
2. تأكد من `ZIINA_WEBHOOK_SECRET` صحيح
3. تحقق من Vercel Logs: `vercel logs`

### المشكلة: الملفات لا ترفع لـ Blob
**الحل:**
1. تحقق من `BLOB_READ_WRITE_TOKEN`
2. تأكد من تفعيل Vercel Blob في المشروع
3. تحقق من الحجم (max 500MB)

### المشكلة: Authentication لا يعمل
**الحل:**
1. تحقق من `JWT_SECRET` (يجب أن يكون 32 حرف على الأقل)
2. احذف cookies وحاول مرة أخرى
3. تأكد من تفعيل cookies في المتصفح

---

## 📞 الدعم

### مصادر مفيدة:
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Ziina API Docs](https://docs.ziina.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### لمزيد من المساعدة:
- 📧 البريد: support@yourstore.com
- 💬 Discord: [discord.gg/yourserver](https://discord.gg)
- 📱 WhatsApp: +971 50 xxx xxxx

---

## ✅ Checklist قبل الإطلاق

- [ ] جميع متغيرات البيئة مضافة في Vercel
- [ ] Webhook URL مضاف في Ziina Dashboard
- [ ] Blob Storage مفعّل ويعمل
- [ ] اختبار دفعة ناجحة
- [ ] اختبار Webhook يعمل
- [ ] Discord notifications تعمل
- [ ] صفحة /account محمية
- [ ] روابط التحميل تعمل
- [ ] التصميم متجاوب على الموبايل
- [ ] جميع الصفحات تفتح بدون أخطاء
- [ ] SSL Certificate فعّال (https)
- [ ] Custom domain (اختياري)

---

## 🎉 تهانينا!

متجرك الآن جاهز للإطلاق! 🚀

### الخطوات التالية:
1. ✅ أضف منتجاتك
2. ✅ اختبر الدفع
3. ✅ راقب الطلبات
4. ✅ احتفل بأول عملية بيع! 🎊

---

**صنع بـ ❤️ في الإمارات**

