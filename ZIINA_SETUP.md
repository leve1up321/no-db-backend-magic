# 🔐 إعداد نظام الدفع عبر Ziina Payment Gateway (API v2)

## 📋 الخطوات المطلوبة:

### 1️⃣ الحصول على مفاتيح API من Ziina

1. سجّل دخول إلى لوحة تحكم Ziina: https://dashboard.ziina.com/
2. انتقل إلى قسم **API Keys**
3. انسخ **Secret Key** (يبدأ بـ `sk_test_` للتجربة أو `sk_live_` للإنتاج)

**ملاحظة:** نحن نستخدم Ziina API v2 (`https://api-v2.ziina.com/api/payment_intent`)

---

### 2️⃣ إعداد المتغيرات البيئية (Environment Variables)

#### أ) للتطوير المحلي (Local Development):

1. أنشئ ملف `.env.local` في جذر المشروع:
```bash
cp .env.example .env.local
```

2. افتح `.env.local` وأضف المفاتيح:
```env
ZIINA_SECRET_KEY=sk_test_your_actual_secret_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### ب) للإنتاج على Vercel:

1. اذهب إلى مشروعك في Vercel Dashboard
2. انتقل إلى **Settings** → **Environment Variables**
3. أضف المتغيرات التالية:

| Key | Value | Environment |
|-----|-------|------------|
| `ZIINA_SECRET_KEY` | `sk_live_your_key` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | Production |

⚠️ **مهم:** لا تشارك مفتاح Ziina السري مع أي شخص!

---

### 3️⃣ اختبار نظام الدفع

#### وضع التجربة (Test Mode):
- استخدم `test: true` في دالة `handlePayment` (موجودة في `ProductDetail.tsx`)
- لن يتم خصم أي مبلغ فعلي
- يمكنك استخدام بطاقات اختبار من Ziina

#### وضع الإنتاج (Production Mode):
- غيّر `test: true` إلى `test: false` في دالة `handlePayment`
- سيتم الدفع الفعلي

---

### 4️⃣ التحقق من عمل النظام

#### التشخيص والتصحيح:

نظام الدفع يتضمن **تسجيل شامل (Console Logging)** لمساعدتك في التشخيص:

**سترى في Console الخاص بـ Vercel أو Terminal:**

```
🔑 Ziina API Key exists: true
🔑 API Key prefix: sk_test_ab...
🌐 App URL: https://yoursite.com
💰 Original amount (AED): 105
💰 Converted amount (fils): 10500
📤 Sending payment data: { ... }
📥 Response status: 200
📥 Response headers: { ... }
📥 Response text (first 500 chars): ...
✅ Parsed response data: { ... }
✅ Payment intent created successfully!
✅ Redirect URL: https://pay.ziina.com/...
```

**للتأكد من صحة الإعداد:**

| # | الخطوة | كيفية التحقق |
|---|--------|---------------|
| 1 | المتغيرات البيئية موجودة | تحقق من رسالة `🔑 Ziina API Key exists: true` |
| 2 | المفتاح صحيح | تحقق من `🔑 API Key prefix:` يبدأ بـ `sk_test_` أو `sk_live_` |
| 3 | رابط الموقع صحيح | تحقق من `🌐 App URL:` يطابق موقعك |
| 4 | تحويل المبلغ صحيح | قارن `💰 Original` و `💰 Converted` (×100) |
| 5 | الرد يحتوي redirect_url | تحقق من وجود `✅ Redirect URL:` |
| 6 | وضع التجربة نشط | تحقق من `"test": true` في البيانات المرسلة |

**اختبار سريع:**

1. شغّل المشروع محلياً:
```bash
npm run dev
```

2. افتح أي صفحة منتج
3. اضغط على زر **"ادفع الآن ⚡"**
4. افتح Developer Console (`F12`) وتابع الرسائل
5. يجب أن يتم توجيهك إلى صفحة الدفع في Ziina

⚠️ **ملاحظة:** يمكنك حذف رسائل console.log بعد التأكد من عمل النظام

---

### 5️⃣ بارامترات Payment Intent (API v2)

نظام الدفع يرسل البارامترات التالية إلى Ziina API v2:

| البارامتر | الوصف | مثال |
|----------|-------|------|
| `amount` | المبلغ بالفلسات (يتم التحويل تلقائياً) | `10500` (يعني 105 درهم) |
| `currency_code` | رمز العملة (3 أحرف) | `AED` |
| `message` | رسالة الدفع | `دفع مقابل اسم المنتج` |
| `success_url` | رابط النجاح | `https://yoursite.com/success` |
| `cancel_url` | رابط الإلغاء | `https://yoursite.com/cancel` |
| `failure_url` | رابط الفشل | `https://yoursite.com/cancel` |
| `test` | وضع التجربة | `true` أو `false` |
| `expiry` | انتهاء الصلاحية (string بالثواني) | `(Math.floor(Date.now() / 1000) + 3600).toString()` |
| `allow_tips` | السماح بالإكراميات | `false` |

**ملاحظات مهمة:** 
- نحن نستخدم دالة `convertAEDtoFils()` لتحويل المبلغ تلقائياً
- 1 درهم = 100 فلس
- Ziina تتطلب المبلغ بالفلسات دائماً
- `expiry` يجب أن يكون **string** بالثواني (seconds)، ليس بالميلي ثانية
- الحساب الصحيح: `(Math.floor(Date.now() / 1000) + 3600).toString()`
- نقسّم Date.now() على 1000 أولاً، ثم نضيف 3600 ثانية (ساعة واحدة)

---

### 6️⃣ صفحات النجاح والإلغاء

تم إنشاء صفحتين جاهزتين:

- ✅ **صفحة النجاح:** `/success`
  - تظهر عند إكمال الدفع بنجاح
  - تعرض رسالة تأكيد وتوجيهات للمستخدم

- ❌ **صفحة الإلغاء/الفشل:** `/cancel`
  - تظهر عند إلغاء المستخدم للدفع أو فشله
  - تعرض خيارات للمحاولة مرة أخرى

---

## 🔧 الملفات التي تم إنشاؤها/تحديثها:

```
📁 المشروع
├── 📄 app/api/payment_intent/route.js        # API route للدفع (JavaScript + API v2)
├── 📄 app/success/page.tsx                   # صفحة النجاح
├── 📄 app/cancel/page.tsx                    # صفحة الإلغاء/الفشل
├── 📄 components/ProductDetail.tsx           # تم إضافة زر الدفع + اسم المنتج
├── 📄 .env.example                           # مثال للمتغيرات البيئية
└── 📄 ZIINA_SETUP.md                         # هذا الملف
```

---

## 💡 نصائح إضافية:

### تخصيص المبلغ:
يتم حساب المبلغ تلقائياً بناءً على:
- السعر الحالي للمنتج
- العملة المختارة من قبل المستخدم

### دعم العملات:
Ziina تدعم:
- درهم إماراتي (AED) ✅
- ريال سعودي (SAR) ✅
- دينار كويتي (KWD) ✅
- وغيرها...

### الأمان:
- ✅ مفتاح API محفوظ في Backend فقط
- ✅ لا يتم عرض المفتاح في Front-End
- ✅ جميع الطلبات مشفرة عبر HTTPS

---

## 🔧 استكشاف الأخطاء (Troubleshooting)

### المشكلة: "ZIINA_SECRET_KEY is not configured"

**الحل:**
1. تأكد من وجود ملف `.env.local` في جذر المشروع
2. تأكد من أن الملف يحتوي على: `ZIINA_SECRET_KEY=sk_test_...`
3. أعد تشغيل خادم التطوير: `npm run dev`

### المشكلة: "No redirect URL received from Ziina"

**الحل:**
1. تحقق من صحة مفتاح API
2. تحقق من أن المبلغ صحيح (أكثر من 0)
3. راجع رسائل الخطأ في Console
4. تأكد من صحة البارامترات المرسلة

### المشكلة: "Payment creation failed"

**الأسباب المحتملة:**
- مفتاح API خاطئ أو منتهي
- المبلغ أقل من الحد الأدنى
- currency_code غير مدعوم
- البارامترات المطلوبة ناقصة

**الحل:**
- راجع رسالة الخطأ المفصلة في Console
- تحقق من `❌ Error details:` للحصول على المزيد من المعلومات

### المشكلة: المبلغ غير صحيح في صفحة الدفع

**الحل:**
1. تحقق من المبلغ الأصلي: `💰 Original amount`
2. تحقق من المبلغ المحول: `💰 Converted amount`
3. تأكد من أن التحويل صحيح: `المبلغ × 100`
4. مثال: 105 AED = 10,500 fils

### المشكلة: redirect_url لا يعمل

**الحل:**
1. تحقق من وجود `redirect_url` في الرد: `✅ Redirect URL:`
2. تحقق من كود JavaScript في ProductDetail.tsx:
```javascript
if (data.redirect_url) {
  window.location.href = data.redirect_url;
}
```
3. افتح Browser Console وابحث عن أخطاء JavaScript

---

## 🆘 المساعدة والدعم:

إذا واجهت أي مشكلة:
1. تحقق من Console للأخطاء
2. تأكد من صحة مفاتيح API
3. تحقق من إعدادات Vercel Environment Variables
4. راجع توثيق Ziina: https://docs.ziina.com/

---

## ✅ قائمة المراجعة النهائية:

- [ ] تم الحصول على مفاتيح API من Ziina
- [ ] تم إضافة المتغيرات البيئية في `.env.local`
- [ ] تم إضافة المتغيرات البيئية في Vercel
- [ ] تم اختبار الدفع في وضع التجربة
- [ ] تم تفعيل الدفع الحقيقي (عند الاستعداد)

---

**🎉 مبروك! نظام الدفع جاهز للاستخدام!**
