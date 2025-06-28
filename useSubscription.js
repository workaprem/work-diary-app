import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { isAfter } from 'date-fns';

const useSubscription = (user) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

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
      }
    } catch (error) {
      console.error('خطأ في تحميل الاشتراك:', error);
    } finally {
      setLoading(false);
    }
  };

  const isSubscriptionActive = () => {
    if (!subscription) return false;
    
    if (subscription.status === 'active') return true;
    
    if (subscription.status === 'trial' && subscription.trialEndDate) {
      const endDate = new Date(subscription.trialEndDate.seconds * 1000);
      return !isAfter(new Date(), endDate);
    }
    
    return false;
  };

  return {
    subscription,
    loading,
    isActive: isSubscriptionActive(),
    refresh: loadSubscription
  };
};

export default useSubscription;

