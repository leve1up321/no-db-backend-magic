# 🔐 إعداد نظام الدفع عبر Ziina Payment Gateway

## 📋 الخطوات المطلوبة:

### 1️⃣ الحصول على مفاتيح API من Ziina

1. سجّل دخول إلى لوحة تحكم Ziina: https://dashboard.ziina.com/
2. انتقل إلى قسم **API Keys**
3. انسخ **Secret Key** (يبدأ بـ `sk_test_` للتجربة أو `sk_live_` للإنتاج)

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

### 5️⃣ صفحات النجاح والإلغاء

تم إنشاء صفحتين جاهزتين:

- ✅ **صفحة النجاح:** `/payment/success`
  - تظهر عند إكمال الدفع بنجاح
  - تعرض رسالة تأكيد وتوجيهات للمستخدم

- ❌ **صفحة الإلغاء:** `/payment/cancel`
  - تظهر عند إلغاء المستخدم للدفع
  - تعرض خيارات للمحاولة مرة أخرى

---

## 🔧 الملفات التي تم إنشاؤها:

```
📁 المشروع
├── 📄 app/api/payment_intent/route.ts        # API route للدفع
├── 📄 app/payment/success/page.tsx           # صفحة النجاح
├── 📄 app/payment/cancel/page.tsx            # صفحة الإلغاء
├── 📄 components/ProductDetail.tsx           # تم إضافة زر الدفع
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
