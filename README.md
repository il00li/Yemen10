# متجر المنتجات الرقمية

موقع ويب لعرض المنتجات مع تكامل WhatsApp ونظام إدارة مخفي بتصميم أنيق وأزرار زجاجية.

## المميزات

- 🛍️ عرض المنتجات بتصميم أنيق مع خلفية زجاجية
- 📱 تكامل مباشر مع WhatsApp لتلقي الطلبات
- 🔧 لوحة إدارة مخفية (ثلاث نقرات على اسم الموقع + كلمة مرور)
- 📂 نظام تصنيفات قابل للتخصيص
- 🚚 إدارة مناطق التوصيل ورسومها
- 📱 تصميم متجاوب مع جميع الأجهزة
- 🌐 دعم كامل للغة العربية مع اتجاه RTL
- 🔗 روابط وسائل التواصل الاجتماعي

## تشغيل المشروع محلياً

```bash
# تثبيت التبعيات
npm install

# تشغيل المشروع
npm run dev
```

## رفع المشروع على Render

### 1. تحضير المشروع

تأكد من وجود الملفات التالية في المشروع:
- `package.json` مع scripts التشغيل
- `package-lock.json` أو `yarn.lock`
- كود المشروع كامل

### 2. رفع الكود على GitHub

```bash
# إنشاء repository جديد على GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/repository-name.git
git push -u origin main
```

### 3. إعداد Render

1. اذهب إلى [render.com](https://render.com) وسجل دخول
2. انقر على "New +"
3. اختر "Web Service"
4. اربط حساب GitHub واختر المستودع
5. املأ الإعدادات:

```
Name: اسم تطبيقك
Environment: Node
Region: اختر المنطقة الأقرب
Branch: main
Build Command: npm install
Start Command: npm start
```

### 4. متغيرات البيئة (اختياري)

في قسم Environment Variables أضف:
```
NODE_ENV=production
```

### 5. النشر

- انقر على "Create Web Service"
- سيبدأ Render بناء ونشر تطبيقك
- ستحصل على رابط مثل: `https://your-app-name.onrender.com`

## إعدادات لوحة الإدارة

للوصول للوحة الإدارة:
1. انقر على اسم الموقع في الأعلى 3 مرات متتالية
2. أدخل كلمة المرور الافتراضية: `admin123`
3. يمكنك تغيير كلمة المرور من تبويب الإعدادات

### إدارة المحتوى

- **المنتجات**: إضافة، تعديل، وحذف المنتجات
- **التصنيفات**: إنشاء تصنيفات مخصصة للمنتجات
- **مناطق التوصيل**: تحديد المناطق ورسوم التوصيل
- **الإعدادات**: تخصيص معلومات الموقع والتواصل

## التقنيات المستخدمة

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **التخزين**: In-Memory Storage (قابل للترقية لقاعدة بيانات)
- **UI**: shadcn/ui components مع تأثيرات زجاجية
- **التوجيه**: Wouter
- **إدارة الحالة**: TanStack Query

## البنية المعمارية

```
├── client/          # Frontend React
│   ├── src/
│   │   ├── components/    # مكونات React
│   │   ├── pages/         # صفحات التطبيق
│   │   ├── hooks/         # React hooks
│   │   └── lib/          # مكتبات مساعدة
├── server/          # Backend Express
│   ├── index.ts          # خادم Express
│   ├── routes.ts         # API routes
│   └── storage.ts        # نظام التخزين
├── shared/          # أنواع البيانات المشتركة
└── package.json     # تبعيات المشروع
```

## استكشاف الأخطاء

### مشاكل شائعة في Render

1. **خطأ في البناء**: تأكد من وجود `package-lock.json`
2. **فشل التشغيل**: تحقق من `start` script في `package.json`
3. **مشاكل المنفذ**: Render يستخدم متغير `PORT` تلقائياً

### دعم إضافي

- تحقق من logs في Render Dashboard
- تأكد من عمل المشروع محلياً قبل النشر
- راجع [دليل Render الرسمي](https://render.com/docs)

## الترخيص

هذا المشروع مفتوح المصدر ومتاح للاستخدام والتطوير.