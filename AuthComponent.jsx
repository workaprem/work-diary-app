import { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, LogOut, User } from 'lucide-react';

const AuthComponent = ({ user, setUser }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      alert('حدث خطأ في تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
    }
  };

  if (user) {
    return (
      <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName} 
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <User className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <p className="font-medium text-sm">{user.displayName}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">مرحباً بك</CardTitle>
        <CardDescription>
          يرجى تسجيل الدخول للوصول إلى يوميات العمل
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full gap-2"
          size="lg"
        >
          <LogIn className="w-5 h-5" />
          {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول بـ Google'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuthComponent;

