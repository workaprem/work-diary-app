# تعليمات النشر والتحويل إلى APK

## 1. النشر على الويب

### استخدام Firebase Hosting:
\`\`\`bash
# تثبيت Firebase CLI
npm install -g firebase-tools

# تسجيل الدخول
firebase login

# تهيئة المشروع
firebase init hosting

# بناء التطبيق
pnpm run build

# النشر
firebase deploy
\`\`\`

### استخدام Netlify:
1. ارفع المشروع على GitHub
2. اربط المستودع بـ Netlify
3. اضبط أمر البناء: \`pnpm run build\`
4. اضبط مجلد النشر: \`dist\`

### استخدام Vercel:
\`\`\`bash
# تثبيت Vercel CLI
npm install -g vercel

# النشر
vercel --prod
\`\`\`

## 2. تحويل إلى APK

### الطريقة الأولى: Capacitor (الأسهل)

1. **تثبيت Capacitor**:
   \`\`\`bash
   npm install @capacitor/core @capacitor/cli
   npm install @capacitor/android
   \`\`\`

2. **تهيئة Capacitor**:
   \`\`\`bash
   npx cap init "يوميات العمل" "com.yawmiyati.app"
   \`\`\`

3. **بناء التطبيق**:
   \`\`\`bash
   pnpm run build
   npx cap add android
   npx cap copy
   \`\`\`

4. **فتح في Android Studio**:
   \`\`\`bash
   npx cap open android
   \`\`\`

5. **بناء APK من Android Studio**

### الطريقة الثانية: Codemagic + WebView

1. **إنشاء تطبيق Flutter بسيط**:
   \`\`\`dart
   import 'package:flutter/material.dart';
   import 'package:webview_flutter/webview_flutter.dart';

   void main() {
     runApp(MyApp());
   }

   class MyApp extends StatelessWidget {
     @override
     Widget build(BuildContext context) {
       return MaterialApp(
         title: 'يوميات العمل',
         home: WebView(
           initialUrl: 'https://your-deployed-url.com',
           javascriptMode: JavascriptMode.unrestricted,
         ),
       );
     }
   }
   \`\`\`

2. **رفع على GitHub**

3. **ربط مع Codemagic**:
   - اذهب إلى codemagic.io
   - اربط مستودع GitHub
   - اضبط إعدادات البناء لـ Android
   - احصل على APK

### الطريقة الثالثة: PWA (Progressive Web App)

1. **إضافة Service Worker**:
   \`\`\`javascript
   // في public/sw.js
   self.addEventListener('install', (event) => {
     // تخزين مؤقت للملفات
   });
   \`\`\`

2. **إضافة Web App Manifest**:
   \`\`\`json
   {
     "name": "يوميات العمل",
     "short_name": "يوميات العمل",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#ffffff",
     "theme_color": "#000000",
     "icons": [
       {
         "src": "/icon-192.png",
         "sizes": "192x192",
         "type": "image/png"
       }
     ]
   }
   \`\`\`

3. **المستخدمون يمكنهم "تثبيت" التطبيق من المتصفح**

## 3. إعدادات Firebase للإنتاج

### قواعد الأمان:
انسخ محتوى \`firestore.rules\` إلى Firebase Console

### فهرسة قاعدة البيانات:
\`\`\`
Collection: workDiary
Fields: userId (Ascending), month (Ascending), date (Descending)
\`\`\`

### إعدادات Authentication:
- فعّل Google Sign-in
- أضف النطاقات المصرح بها
- اضبط إعادة التوجيه URLs

## 4. اختبار التطبيق

### اختبار محلي:
\`\`\`bash
pnpm run dev
\`\`\`

### اختبار البناء:
\`\`\`bash
pnpm run build
pnpm run preview
\`\`\`

### اختبار على الهاتف:
- استخدم ngrok أو similar لعرض التطبيق المحلي
- اختبر جميع الوظائف على أجهزة مختلفة

## 5. صيانة وتحديثات

### تحديث التبعيات:
\`\`\`bash
pnpm update
\`\`\`

### مراقبة الأخطاء:
- استخدم Firebase Analytics
- راقب Firebase Console للأخطاء

### النسخ الاحتياطي:
- صدّر بيانات Firestore بانتظام
- احتفظ بنسخة من قواعد الأمان

