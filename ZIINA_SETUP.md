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

1. شغّل المشروع محلياً:
```bash
npm run dev
```

2. افتح أي صفحة منتج
3. اضغط على زر **"ادفع الآن ⚡"**
4. يجب أن يتم توجيهك إلى صفحة الدفع في Ziina

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
| `expiry` | انتهاء الصلاحية | `Date.now() + 3600000` (ساعة) |
| `allow_tips` | السماح بالإكراميات | `false` |

**ملاحظة مهمة:** 
- نحن نستخدم دالة `convertAEDtoFils()` لتحويل المبلغ تلقائياً
- 1 درهم = 100 فلس
- Ziina تتطلب المبلغ بالفلسات دائماً

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
