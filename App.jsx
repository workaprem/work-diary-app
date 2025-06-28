import { useState } from 'react';
import AuthComponent from './components/AuthComponent';
import WorkDiary from './components/WorkDiary';
import SubscriptionManager from './components/SubscriptionManager';
import useSubscription from './hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, CreditCard } from 'lucide-react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const { subscription, loading: subscriptionLoading, isActive } = useSubscription(user);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">يوميات العمل</h1>
          <p className="text-muted-foreground">تتبع أيام العمل والعطل بسهولة</p>
        </div>
        
        {!user ? (
          <AuthComponent user={user} setUser={setUser} />
        ) : (
          <div className="space-y-6">
            <AuthComponent user={user} setUser={setUser} />
            
            {subscriptionLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Tabs defaultValue="home" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="home" className="gap-2">
                    <Home className="w-4 h-4" />
                    الرئيسية
                  </TabsTrigger>
                  <TabsTrigger value="subscription" className="gap-2">
                    <CreditCard className="w-4 h-4" />
                    الاشتراك
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="home" className="mt-6">
                  {isActive ? (
                    <WorkDiary user={user} />
                  ) : (
                    <div className="text-center py-8">
                      <h3 className="text-lg font-semibold mb-2">اشتراك مطلوب</h3>
                      <p className="text-muted-foreground mb-4">
                        يرجى تفعيل اشتراكك للوصول إلى يوميات العمل
                      </p>
                      <Button onClick={() => document.querySelector('[value="subscription"]').click()}>
                        عرض خيارات الاشتراك
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="subscription" className="mt-6">
                  <SubscriptionManager user={user} />
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

