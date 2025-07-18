# دليل رفع المشروع على Render

## متطلبات النشر

### 1. إعداد قاعدة البيانات
- يجب ربط مشروعك بقاعدة بيانات PostgreSQL
- يجب وضع رابط قاعدة البيانات في متغير البيئة `DATABASE_URL`

### 2. متغيرات البيئة المطلوبة
```
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
```

### 3. ملفات التكوين المطلوبة

#### package.json - scripts
```json
{
  "scripts": {
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build",
    "build:server": "esbuild server/index.ts --bundle --platform=node --target=node18 --outfile=dist/index.js --external:pg-native",
    "start": "node dist/index.js",
    "dev": "NODE_ENV=development tsx server/index.ts"
  }
}
```

## خطوات النشر على Render

### 1. إنشاء Web Service جديد
- اذهب إلى [Render.com](https://render.com)
- اضغط على "New +" ثم "Web Service"
- اربط حساب GitHub الخاص بك

### 2. إعداد المشروع
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Environment**: `Node`
- **Node Version**: `18` أو أحدث

### 3. إعداد قاعدة البيانات
- في Render، أنشئ PostgreSQL database جديد
- انسخ رابط قاعدة البيانات الداخلي (Internal URL)

### 4. إعداد متغيرات البيئة
في إعدادات Web Service، أضف:
```
DATABASE_URL=<رابط قاعدة البيانات من Render>
NODE_ENV=production
```

### 5. رفع التغييرات
```bash
git add .
git commit -m "إعداد المشروع للنشر على Render"
git push origin main
```

### 6. إعداد قاعدة البيانات
بعد النشر الأول، ادخل إلى Web Shell في Render وشغل:
```bash
npm run db:push
```

## ملاحظات مهمة

### 1. رفع الملفات
- الملفات المرفوعة تحفظ في مجلد `uploads/`
- Render يوفر storage مؤقت، ننصح باستخدام خدمة تخزين خارجية للملفات في الإنتاج

### 2. الأمان
- تأكد من تغيير كلمة مرور لوحة الإدارة الافتراضية
- استخدم HTTPS في الإنتاج

### 3. الأداء
- Render يوفر 512 MB RAM في الخطة المجانية
- قد تحتاج لترقية الخطة للمشاريع الكبيرة

## استكشاف الأخطاء

### خطأ قاعدة البيانات
```
Error: DATABASE_URL must be set
```
**الحل**: تأكد من إعداد متغير `DATABASE_URL` في إعدادات البيئة

### خطأ البناء
```
Build failed
```
**الحل**: تأكد من وجود جميع dependencies في package.json

### مشاكل الخطوط العربية
إذا لم تظهر الخطوط العربية بشكل صحيح:
- تأكد من اتصال الإنترنت لتحميل خطوط Google Fonts
- أضف fallback fonts في CSS

## دعم إضافي

للمساعدة في مشاكل النشر:
1. راجع logs في Render Dashboard
2. تأكد من إعدادات قاعدة البيانات
3. تحقق من متغيرات البيئة

---

**تم إنشاء هذا المشروع بواسطة Replit AI**