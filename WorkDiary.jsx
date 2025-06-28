import { useState, useEffect } from 'react';
import { collection, doc, setDoc, getDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Coffee, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import Statistics from './Statistics';

const WorkDiary = ({ user }) => {
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [monthlyStats, setMonthlyStats] = useState({ workDays: 0, holidays: 0 });

  const today = new Date();
  const todayString = format(today, 'yyyy-MM-dd');
  const currentMonth = format(today, 'yyyy-MM');

  useEffect(() => {
    if (user) {
      loadTodayStatus();
      loadMonthlyStats();
    }
  }, [user]);

  const loadTodayStatus = async () => {
    try {
      const docRef = doc(db, 'workDiary', `${user.uid}_${todayString}`);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setTodayStatus(docSnap.data().status);
      }
    } catch (error) {
      console.error('خطأ في تحميل حالة اليوم:', error);
    }
  };

  const loadMonthlyStats = async () => {
    try {
      const q = query(
        collection(db, 'workDiary'),
        where('userId', '==', user.uid),
        where('month', '==', currentMonth),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      let workDays = 0;
      let holidays = 0;
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'work') {
          workDays++;
        } else if (data.status === 'holiday') {
          holidays++;
        }
      });
      
      setMonthlyStats({ workDays, holidays });
    } catch (error) {
      console.error('خطأ في تحميل الإحصائيات:', error);
    }
  };

  const setDayStatus = async (status) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'workDiary', `${user.uid}_${todayString}`);
      await setDoc(docRef, {
        userId: user.uid,
        date: todayString,
        month: currentMonth,
        status: status,
        timestamp: new Date()
      });
      
      setTodayStatus(status);
      await loadMonthlyStats(); // إعادة تحميل الإحصائيات
    } catch (error) {
      console.error('خطأ في حفظ الحالة:', error);
      alert('حدث خطأ في حفظ الحالة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'work') {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <Briefcase className="w-3 h-3 mr-1" />
          يوم عمل
        </Badge>
      );
    } else if (status === 'holiday') {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
          <Coffee className="w-3 h-3 mr-1" />
          عطلة
        </Badge>
      );
    }
    return null;
  };

  const totalDays = monthlyStats.workDays + monthlyStats.holidays;
  const workPercentage = totalDays > 0 ? Math.round((monthlyStats.workDays / totalDays) * 100) : 0;

  if (showStatistics) {
    return <Statistics user={user} onBack={() => setShowStatistics(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* بطاقة التاريخ الحالي */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl">
              {format(today, 'EEEE، d MMMM yyyy', { locale: ar })}
            </CardTitle>
          </div>
          <CardDescription>
            {todayStatus ? 'تم تسجيل حالة اليوم' : 'يرجى تسجيل حالة اليوم'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {todayStatus && (
            <div className="flex justify-center">
              {getStatusBadge(todayStatus)}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setDayStatus('work')}
              disabled={loading}
              variant={todayStatus === 'work' ? 'default' : 'outline'}
              className="h-16 text-lg gap-2"
            >
              <Briefcase className="w-5 h-5" />
              عمل
            </Button>
            <Button
              onClick={() => setDayStatus('holiday')}
              disabled={loading}
              variant={todayStatus === 'holiday' ? 'default' : 'outline'}
              className="h-16 text-lg gap-2"
            >
              <Coffee className="w-5 h-5" />
              عطلة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* بطاقة الإحصائيات الشهرية */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <CardTitle>إحصائيات الشهر الحالي</CardTitle>
          </div>
          <CardDescription>
            {format(today, 'MMMM yyyy', { locale: ar })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">{monthlyStats.workDays}</div>
              <div className="text-sm text-green-600">أيام عمل</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{monthlyStats.holidays}</div>
              <div className="text-sm text-blue-600">أيام عطلة</div>
            </div>
          </div>
          
          {totalDays > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>نسبة أيام العمل</span>
                <span className="font-medium">{workPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${workPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {totalDays === 0 && (
            <div className="text-center text-muted-foreground py-4">
              لا توجد بيانات للشهر الحالي بعد
            </div>
          )}
          
          <Button
            onClick={() => setShowStatistics(true)}
            variant="outline"
            className="w-full gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            عرض الإحصائيات التفصيلية
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkDiary;

