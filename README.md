# يوميات العمل - Work Diary App

تطبيق ويب بسيط لتتبع أيام العمل والعطل مع نظام اشتراك شهري.

## الميزات

### ✅ الميزات المكتملة:
- **تسجيل الدخول عبر Google**: تسجيل دخول آمن باستخدام حساب Google
- **تسجيل الحالة اليومية**: إمكانية تسجيل يوم عمل أو عطلة للتاريخ الحالي
- **الإحصائيات الشهرية**: عرض عدد أيام العمل والعطل والنسب المئوية
- **الإحصائيات التفصيلية**: رسوم بيانية وتحليل شامل لآخر 6 أشهر
- **نظام الاشتراك**: فترة تجريبية 7 أيام مع خيارات دفع متعددة
- **واجهة عربية**: التطبيق باللغة العربية بالكامل
- **تصميم متجاوب**: يعمل بشكل ممتاز على الهواتف والأجهزة اللوحية

### 💰 نظام الدفع:
- **PayPal**: paypal.me/ahmedmuhajir
- **التحويل البنكي**: 
  - اسم الحساب: AHMED MÜHACER
  - IBAN: TR55 0001 0004 2486 7092 6450 05
  - البنك: Ziraat Bankası – تركيا

## التقنيات المستخدمة

- **Frontend**: React 19 + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Backend**: Firebase (Authentication + Firestore)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## التثبيت والتشغيل

### المتطلبات:
- Node.js 20+
- pnpm

### خطوات التشغيل:

1. **استنساخ المشروع**:
   \`\`\`bash
   git clone <repository-url>
   cd work-diary-app
   \`\`\`

2. **تثبيت التبعيات**:
   \`\`\`bash
   pnpm install
   \`\`\`

3. **تكوين Firebase**:
   - أنشئ مشروع Firebase جديد
   - فعّل Authentication (Google Provider)
   - فعّل Firestore Database
   - انسخ معلومات التكوين إلى \`src/firebase.js\`

4. **تشغيل التطبيق**:
   \`\`\`bash
   pnpm run dev
   \`\`\`

5. **البناء للإنتاج**:
   \`\`\`bash
   pnpm run build
   \`\`\`

## هيكل قاعدة البيانات

### مجموعة \`workDiary\`:
\`\`\`javascript
{
  id: "userId_yyyy-mm-dd",
  userId: "user-id",
  date: "yyyy-mm-dd",
  month: "yyyy-mm",
  status: "work" | "holiday",
  timestamp: Date
}
\`\`\`

### مجموعة \`subscriptions\`:
\`\`\`javascript
{
  id: "user-id",
  userId: "user-id",
  status: "trial" | "active" | "inactive",
  trialEndDate: Date,
  subscriptionEndDate: Date,
  createdAt: Date,
  isActive: boolean
}
\`\`\`

## تحويل إلى APK

يمكن تحويل التطبيق إلى APK باستخدام:

### الطريقة 1: Codemagic + WebView
1. ارفع الكود على GitHub
2. أنشئ مشروع Flutter بسيط مع WebView
3. استخدم Codemagic لبناء APK

### الطريقة 2: Capacitor
\`\`\`bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap run android
\`\`\`

## الأمان

- جميع البيانات محمية بقواعد Firestore Security Rules
- تسجيل الدخول آمن عبر Firebase Authentication
- البيانات مرتبطة بحساب المستخدم فقط

## الدعم

للدعم الفني أو الاستفسارات، يرجى التواصل عبر:
- البريد الإلكتروني المرتبط بحساب PayPal
- إرفاق إثبات الدفع عند طلب تفعيل الاشتراك

## الترخيص

هذا المشروع مملوك لـ Ahmed Muhajir ومخصص للاستخدام التجاري.

