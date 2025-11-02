# 🚀 LevelUp Digital Store

متجر رقمي احترافي مبني بتقنيات Next.js 14 و TypeScript و Tailwind CSS، جاهز للنشر على Vercel.

## ✨ المميزات

- 🎨 **تصميم عصري** - واجهة مستخدم جذابة وسريعة الاستجابة
- ⚡ **Next.js 14** - استخدام App Router الحديث
- 🔒 **آمن تماماً** - TypeScript كامل للحماية من الأخطاء
- 📱 **موبايل أولاً** - متوافق مع جميع الأجهزة
- 🎯 **محسّن لمحركات البحث** - Metadata و OpenGraph جاهزة
- 🚀 **جاهز لـ Vercel** - بدون أي إعدادات إضافية
- 🌐 **دعم RTL** - مدعوم باللغة العربية بشكل كامل

## 📦 التقنيات المستخدمة

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Deployment:** Vercel
- **Node:** 22.x

## 🏗️ هيكل المشروع

```
/app/                          → صفحات وتخطيطات (App Router)
  /api/                        → API routes (serverless functions)
    /auth/                     → نقطة تسجيل الدخول
    /payment_intent/           → نقطة الدفع الوهمية
    /download/                 → مولد روابط التحميل
  layout.tsx                   → التخطيط الرئيسي مع metadata
  page.tsx                     → الصفحة الرئيسية
  globals.css                  → الأنماط العامة

/components/                   → مكونات React
  Navbar.tsx                   → شريط التنقل
  Hero.tsx                     → قسم البطل
  ProductsSection.tsx          → عرض المنتجات
  ProductGrid.tsx              → شبكة بطاقات المنتجات
  StatsSection.tsx             → عرض الإحصائيات
  TestimonialsSection.tsx      → آراء العملاء
  Footer.tsx                   → التذييل
  /ui/                         → المكونات الأساسية
    Toaster.tsx                → نظام الإشعارات Toast

/data/                         → بيانات وهمية (JSON)
  products.json                → كتالوج المنتجات
  testimonials.json            → تقييمات العملاء

/public/                       → الملفات الثابتة
  /assets/                     → صور، أيقونات، خطوط

package.json                   → التبعيات
next.config.mjs                → إعدادات Next.js
tailwind.config.js             → إعدادات Tailwind CSS
tsconfig.json                  → إعدادات TypeScript
.env.example                   → قالب متغيرات البيئة
```

## 🚀 البداية السريعة

### المتطلبات الأساسية

- Node.js 22.x أو أحدث
- npm أو yarn أو pnpm

### التثبيت

1. استنساخ المستودع:
```bash
git clone https://github.com/leve1up321/no-db-backend-magic.git
cd no-db-backend-magic
```

2. تثبيت التبعيات:
```bash
npm install
# أو
yarn install
# أو
pnpm install
```

3. إنشاء ملف البيئة:
```bash
cp .env.example .env
```

4. تشغيل سيرفر التطوير:
```bash
npm run dev
# أو
yarn dev
# أو
pnpm dev
```

5. افتح [http://localhost:3000](http://localhost:3000) في متصفحك.

## 🌐 النشر على Vercel

### نشر بضغطة واحدة

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. ارفع الكود إلى GitHub/GitLab/Bitbucket
2. استورد المستودع في Vercel
3. Vercel سيكتشف Next.js تلقائياً ويُعد كل شيء
4. اضغط "Deploy"

هذا كل شيء! موقعك سيكون جاهزاً في ثوانٍ.

### متغيرات البيئة

قم بتعيين هذه المتغيرات في إعدادات مشروع Vercel:

```bash
NEXT_PUBLIC_APP_NAME=LevelUp Digital Store
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SUPPORT_EMAIL=support@levelup.com
```

## 📝 نقاط API

جميع نقاط API ترجع بيانات وهمية وهي serverless functions:

- **POST /api/auth** - تسجيل دخول وهمي
  ```json
  { "email": "user@example.com", "password": "password" }
  ```

- **POST /api/payment_intent** - إنشاء نية دفع وهمية
  ```json
  { "amount": 100, "currency": "SAR", "productId": "1" }
  ```

- **GET /api/download?productId=1** - توليد رابط تحميل وهمي

## 🎨 التخصيص

### الألوان

عدّل `tailwind.config.js` لتخصيص نظام الألوان:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // الألوان المخصصة هنا
      }
    }
  }
}
```

### المحتوى

- **المنتجات:** عدّل `/data/products.json`
- **التقييمات:** عدّل `/data/testimonials.json`
- **Metadata:** عدّل `/app/layout.tsx`

## 🔧 الأوامر المتاحة

- `npm run dev` - بدء سيرفر التطوير
- `npm run build` - بناء للإنتاج
- `npm run start` - بدء سيرفر الإنتاج
- `npm run lint` - تشغيل ESLint

## 📄 الترخيص

هذا المشروع مرخص تحت MIT License.

## 🤝 المساهمة

المساهمات مرحب بها! لا تتردد في تقديم Pull Request.

## 📧 الدعم

للدعم، راسلنا على support@levelup.com

---

صُنع بـ ❤️ باستخدام Next.js 14 و Tailwind CSS

