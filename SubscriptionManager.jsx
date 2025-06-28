import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Calendar, CheckCircle, AlertCircle, ExternalLink, Copy } from 'lucide-react';
import { format, addDays, isAfter } from 'date-fns';
import { ar } from 'date-fns/locale';

const SubscriptionManager = ({ user }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    if (user) {
      loadSubscription();
    }
  }, [user]);

  const loadSubscription = async () => {
    try {
      const docRef = doc(db, 'subscriptions', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setSubscription(docSnap.data());
      } else {
        // إنشاء اشتراك تجريبي جديد
        const trialEndDate = addDays(new Date(), 7); // فترة تجريبية 7 أيام
        const newSubscription = {
          userId: user.uid,
          status: 'trial',
          trialEndDate: trialEndDate,
          createdAt: new Date(),
          isActive: true
        };
        
        await setDoc(docRef, newSubscription);
        setSubscription(newSubscription);
      }
    } catch (error) {
      console.error('خطأ في تحميل الاشتراك:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('فشل في النسخ:', err);
    }
  };

  const isTrialExpired = () => {
    if (!subscription || !subscription.trialEndDate) return false;
    return isAfter(new Date(), new Date(subscription.trialEndDate.seconds * 1000));
  };

  const getTrialDaysLeft = () => {
    if (!subscription || !subscription.trialEndDate) return 0;
    const endDate = new Date(subscription.trialEndDate.seconds * 1000);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getStatusBadge = () => {
    if (!subscription) return null;
    
    if (subscription.status === 'active') {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          نشط
        </Badge>
      );
    } else if (subscription.status === 'trial') {
      const daysLeft = getTrialDaysLeft();
      if (daysLeft > 0) {
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
            <Calendar className="w-3 h-3 mr-1" />
            تجريبي ({daysLeft} أيام متبقية)
          </Badge>
        );
      } else {
        return (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            انتهت الفترة التجريبية
          </Badge>
        );
      }
    } else {
      return (
        <Badge variant="destructive">
          <AlertCircle className="w-3 h-3 mr-1" />
          غير نشط
        </Badge>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const needsSubscription = subscription?.status === 'trial' && isTrialExpired();

  return (
    <div className="space-y-6">
      {/* بطاقة حالة الاشتراك */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                حالة الاشتراك
              </CardTitle>
              <CardDescription>
                إدارة اشتراكك في يوميات العمل
              </CardDescription>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscription?.status === 'trial' && !isTrialExpired() && (
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                تستمتع حالياً بالفترة التجريبية المجانية. متبقي {getTrialDaysLeft()} أيام.
              </AlertDescription>
            </Alert>
          )}

          {needsSubscription && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                انتهت فترتك التجريبية. يرجى الاشتراك للمتابعة في استخدام التطبيق.
              </AlertDescription>
            </Alert>
          )}

          {subscription?.status === 'active' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                اشتراكك نشط ويمكنك الاستمتاع بجميع ميزات التطبيق.
              </AlertDescription>
            </Alert>
          )}

          {(needsSubscription || subscription?.status === 'trial') && (
            <div className="space-y-3">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">خطة الاشتراك الشهري</h3>
                <div className="text-3xl font-bold text-primary mb-1">20 ليرة تركية</div>
                <div className="text-sm text-muted-foreground">أو ما يعادل 2 دولار أمريكي شهرياً</div>
              </div>
              
              <Button
                onClick={() => setShowPaymentInfo(!showPaymentInfo)}
                className="w-full"
                size="lg"
              >
                {showPaymentInfo ? 'إخفاء معلومات الدفع' : 'عرض طرق الدفع'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* معلومات الدفع */}
      {showPaymentInfo && (
        <div className="space-y-4">
          {/* PayPal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">الدفع عبر PayPal</CardTitle>
              <CardDescription>
                الطريقة الأسرع والأكثر أماناً للدفع
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-mono">paypal.me/ahmedmuhajir</span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => copyToClipboard('paypal.me/ahmedmuhajir', 'paypal')}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="w-4 h-4" />
                    {copySuccess === 'paypal' ? 'تم النسخ!' : 'نسخ'}
                  </Button>
                  <Button
                    onClick={() => window.open('https://paypal.me/ahmedmuhajir', '_blank')}
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    فتح
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* التحويل البنكي */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">التحويل البنكي المباشر</CardTitle>
              <CardDescription>
                للعملاء في تركيا أو الذين يفضلون التحويل البنكي
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="font-medium">اسم الحساب:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">AHMED MÜHACER</span>
                    <Button
                      onClick={() => copyToClipboard('AHMED MÜHACER', 'name')}
                      variant="ghost"
                      size="sm"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="font-medium">رقم الآيبان:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">TR55 0001 0004 2486 7092 6450 05</span>
                    <Button
                      onClick={() => copyToClipboard('TR55 0001 0004 2486 7092 6450 05', 'iban')}
                      variant="ghost"
                      size="sm"
                    >
                      <Copy className="w-3 h-3" />
                      {copySuccess === 'iban' ? 'تم!' : ''}
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="font-medium">البنك:</span>
                  <span>Ziraat Bankası – تركيا</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* تعليمات ما بعد الدفع */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">بعد إتمام الدفع</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>• احتفظ بإثبات الدفع (لقطة شاشة أو إيصال)</p>
                <p>• أرسل إثبات الدفع مع عنوان بريدك الإلكتروني المسجل في التطبيق</p>
                <p>• سيتم تفعيل اشتراكك خلال 24 ساعة من استلام إثبات الدفع</p>
                <p>• في حالة وجود أي استفسار، يرجى التواصل معنا</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;

