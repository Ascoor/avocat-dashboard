import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Calendar, Plus, Clock, MapPin, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Sessions() {
  const { t, language } = useLanguage();

  const sessions = [
    {
      id: 1,
      caseNumber: 'C-2024-0145',
      caseTitle: language === 'ar' ? 'نزاع عقد تجاري' : 'Commercial Contract Dispute',
      court: language === 'ar' ? 'المحكمة التجارية - الدائرة الأولى' : 'Commercial Court - First Circuit',
      date: '2024-01-20',
      time: '10:00 AM',
      lawyer: language === 'ar' ? 'أحمد محمود' : 'Ahmed Mahmoud',
      status: language === 'ar' ? 'مجدولة' : 'Scheduled',
      type: language === 'ar' ? 'مرافعة' : 'Pleading',
    },
    {
      id: 2,
      caseNumber: 'C-2024-0098',
      caseTitle: language === 'ar' ? 'قضية عمالية' : 'Labor Dispute',
      court: language === 'ar' ? 'محكمة العمل' : 'Labor Court',
      date: '2024-01-18',
      time: '02:30 PM',
      lawyer: language === 'ar' ? 'سارة علي' : 'Sarah Ali',
      status: language === 'ar' ? 'مجدولة' : 'Scheduled',
      type: language === 'ar' ? 'تحقيق' : 'Investigation',
    },
    {
      id: 3,
      caseNumber: 'C-2024-0234',
      caseTitle: language === 'ar' ? 'استئناف حكم مدني' : 'Civil Judgment Appeal',
      court: language === 'ar' ? 'محكمة الاستئناف' : 'Court of Appeal',
      date: '2024-02-05',
      time: '11:00 AM',
      lawyer: language === 'ar' ? 'محمد حسن' : 'Mohamed Hassan',
      status: language === 'ar' ? 'مجدولة' : 'Scheduled',
      type: language === 'ar' ? 'استماع' : 'Hearing',
    },
    {
      id: 4,
      caseNumber: 'C-2024-0067',
      caseTitle: language === 'ar' ? 'قضية إيجارات' : 'Rental Dispute',
      court: language === 'ar' ? 'المحكمة الجزئية' : 'Partial Court',
      date: '2024-01-12',
      time: '09:30 AM',
      lawyer: language === 'ar' ? 'أحمد محمود' : 'Ahmed Mahmoud',
      status: language === 'ar' ? 'تمت' : 'Completed',
      type: language === 'ar' ? 'حكم' : 'Judgment',
    },
    {
      id: 5,
      caseNumber: 'C-2024-0189',
      caseTitle: language === 'ar' ? 'قضية تجارية' : 'Commercial Case',
      court: language === 'ar' ? 'المحكمة التجارية' : 'Commercial Court',
      date: '2024-01-15',
      time: '01:00 PM',
      lawyer: language === 'ar' ? 'سارة علي' : 'Sarah Ali',
      status: language === 'ar' ? 'مؤجلة' : 'Postponed',
      type: language === 'ar' ? 'مرافعة' : 'Pleading',
    },
  ];

  const getStatusColor = (status: string) => {
    const map: { [key: string]: string } = {
      'مجدولة': 'bg-blue-500/10 text-blue-500',
      'Scheduled': 'bg-blue-500/10 text-blue-500',
      'تمت': 'bg-green-500/10 text-green-500',
      'Completed': 'bg-green-500/10 text-green-500',
      'مؤجلة': 'bg-orange-500/10 text-orange-500',
      'Postponed': 'bg-orange-500/10 text-orange-500',
      'ملغاة': 'bg-red-500/10 text-red-500',
      'Cancelled': 'bg-red-500/10 text-red-500',
    };
    return map[status] || 'bg-gray-500/10 text-gray-500';
  };

  const groupedSessions = sessions.reduce((acc, session) => {
    const date = session.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {} as Record<string, typeof sessions>);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">{t('sessions')}</h1>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'جدول الجلسات القادمة والسابقة' : 'Schedule of upcoming and past sessions'}
            </p>
          </div>
          <Button className="bg-accent text-accent-foreground shadow-gold hover:shadow-xl">
            <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {language === 'ar' ? 'جلسة جديدة' : 'New Session'}
          </Button>
        </motion.div>

        {/* Calendar View - Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {language === 'ar' ? 'يناير 2024' : 'January 2024'}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  {language === 'ar' ? 'اليوم' : 'Today'}
                </Button>
                <Button variant="outline" size="sm">
                  {language === 'ar' ? 'أسبوع' : 'Week'}
                </Button>
                <Button variant="outline" size="sm">
                  {language === 'ar' ? 'شهر' : 'Month'}
                </Button>
              </div>
            </div>
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{language === 'ar' ? 'عرض التقويم' : 'Calendar View'}</p>
            </div>
          </Card>
        </motion.div>

        {/* Sessions List by Date */}
        <div className="space-y-6">
          {Object.entries(groupedSessions).map(([date, dateSessions], dateIndex) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + dateIndex * 0.1 }}
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-accent/10">
                  <span className="text-xs font-medium text-accent">
                    {new Date(date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'short' })}
                  </span>
                  <span className="text-lg font-bold text-accent">
                    {new Date(date).getDate()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">
                    {new Date(date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {dateSessions.length} {language === 'ar' ? 'جلسة' : 'sessions'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {dateSessions.map((session, sessionIndex) => (
                  <Card 
                    key={session.id} 
                    className="p-6 transition-all hover:shadow-custom-lg hover:shadow-gold/10"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="mb-1 flex items-center gap-2">
                              <span className="text-sm font-mono text-muted-foreground">
                                {session.caseNumber}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {session.type}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-semibold">{session.caseTitle}</h3>
                          </div>
                          <Badge className={getStatusColor(session.status)}>
                            {session.status}
                          </Badge>
                        </div>

                        <div className="grid gap-2 text-sm sm:grid-cols-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span dir="ltr">{session.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{session.court}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
                            <User className="h-4 w-4" />
                            <span>{t('lawyer')}: {session.lawyer}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 md:flex-col">
                        <Button variant="outline" size="sm" className="flex-1">
                          {t('view')}
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          {t('edit')}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
