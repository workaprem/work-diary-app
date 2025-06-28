import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, ArrowLeft, Briefcase, Coffee } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths } from 'date-fns';
import { ar } from 'date-fns/locale';

const Statistics = ({ user, onBack }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [currentMonthDetails, setCurrentMonthDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStatistics();
    }
  }, [user]);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      // تحميل بيانات آخر 6 أشهر
      const monthsData = [];
      for (let i = 0; i < 6; i++) {
        const monthDate = subMonths(new Date(), i);
        const monthString = format(monthDate, 'yyyy-MM');
        
        const q = query(
          collection(db, 'workDiary'),
          where('userId', '==', user.uid),
          where('month', '==', monthString)
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
        
        monthsData.unshift({
          month: format(monthDate, 'MMM yyyy', { locale: ar }),
          workDays,
          holidays,
          total: workDays + holidays
        });
      }
      
      setMonthlyData(monthsData);
      
      // تحميل تفاصيل الشهر الحالي
      await loadCurrentMonthDetails();
      
    } catch (error) {
      console.error('خطأ في تحميل الإحصائيات:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentMonthDetails = async () => {
    try {
      const currentMonth = format(new Date(), 'yyyy-MM');
      const q = query(
        collection(db, 'workDiary'),
        where('userId', '==', user.uid),
        where('month', '==', currentMonth),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const details = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        details.push({
          date: data.date,
          status: data.status,
          timestamp: data.timestamp
        });
      });
      
      setCurrentMonthDetails(details);
    } catch (error) {
      console.error('خطأ في تحميل تفاصيل الشهر:', error);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'work') {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <Briefcase className="w-3 h-3 mr-1" />
          عمل
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
          <Coffee className="w-3 h-3 mr-1" />
          عطلة
        </Badge>
      );
    }
  };

  const currentMonthStats = monthlyData.length > 0 ? monthlyData[monthlyData.length - 1] : { workDays: 0, holidays: 0, total: 0 };
  
  const pieData = [
    { name: 'أيام العمل', value: currentMonthStats.workDays, color: '#10b981' },
    { name: 'أيام العطل', value: currentMonthStats.holidays, color: '#3b82f6' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل الإحصائيات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4" />
          العودة
        </Button>
        <div>
          <h2 className="text-2xl font-bold">الإحصائيات التفصيلية</h2>
          <p className="text-muted-foreground">تحليل شامل لأيام العمل والعطل</p>
        </div>
      </div>

      {/* الرسم البياني الشريطي */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            إحصائيات آخر 6 أشهر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => `الشهر: ${label}`}
                  formatter={(value, name) => [value, name === 'workDays' ? 'أيام العمل' : 'أيام العطل']}
                />
                <Bar dataKey="workDays" fill="#10b981" name="أيام العمل" />
                <Bar dataKey="holidays" fill="#3b82f6" name="أيام العطل" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* الرسم البياني الدائري */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع الشهر الحالي</CardTitle>
          </CardHeader>
          <CardContent>
            {currentMonthStats.total > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                لا توجد بيانات للشهر الحالي
              </div>
            )}
          </CardContent>
        </Card>

        {/* تفاصيل الشهر الحالي */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              سجل الشهر الحالي
            </CardTitle>
            <CardDescription>
              {format(new Date(), 'MMMM yyyy', { locale: ar })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {currentMonthDetails.length > 0 ? (
                currentMonthDetails.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">
                        {format(new Date(entry.date), 'EEEE، d MMMM', { locale: ar })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(entry.date), 'yyyy-MM-dd')}
                      </p>
                    </div>
                    {getStatusBadge(entry.status)}
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  لا توجد بيانات مسجلة للشهر الحالي
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;

