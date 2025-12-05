import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Calendar, Plus, Clock, MapPin, User, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SessionDetailCard } from '@/components/details';

export default function Sessions() {
  const { t, language } = useLanguage();
  const [selectedSession, setSelectedSession] = useState<any>(null);

  const sessions = [
    {
      id: '1',
      caseNumber: 'C-2024-0145',
      caseTitle: language === 'ar' ? 'نزاع عقد تجاري' : 'Commercial Contract Dispute',
      court: language === 'ar' ? 'المحكمة التجارية - الدائرة الأولى' : 'Commercial Court - First Circuit',
      courtRoom: language === 'ar' ? 'القاعة 5' : 'Room 5',
      date: '2024-01-20',
      time: '10:00 AM',
      lawyer: language === 'ar' ? 'أحمد محمود' : 'Ahmed Mahmoud',
      status: 'scheduled' as const,
      type: language === 'ar' ? 'مرافعة' : 'Pleading',
      notes: language === 'ar' ? 'تقديم مذكرة الدفاع والمستندات الداعمة' : 'Submit defense memo and supporting documents',
    },
    {
      id: '2',
      caseNumber: 'C-2024-0098',
      caseTitle: language === 'ar' ? 'قضية عمالية' : 'Labor Dispute',
      court: language === 'ar' ? 'محكمة العمل' : 'Labor Court',
      courtRoom: language === 'ar' ? 'القاعة 3' : 'Room 3',
      date: '2024-01-18',
      time: '02:30 PM',
      lawyer: language === 'ar' ? 'سارة علي' : 'Sarah Ali',
      status: 'scheduled' as const,
      type: language === 'ar' ? 'تحقيق' : 'Investigation',
    },
    {
      id: '3',
      caseNumber: 'C-2024-0234',
      caseTitle: language === 'ar' ? 'استئناف حكم مدني' : 'Civil Judgment Appeal',
      court: language === 'ar' ? 'محكمة الاستئناف' : 'Court of Appeal',
      courtRoom: language === 'ar' ? 'القاعة 1' : 'Room 1',
      date: '2024-02-05',
      time: '11:00 AM',
      lawyer: language === 'ar' ? 'محمد حسن' : 'Mohamed Hassan',
      status: 'scheduled' as const,
      type: language === 'ar' ? 'استماع' : 'Hearing',
    },
    {
      id: '4',
      caseNumber: 'C-2024-0067',
      caseTitle: language === 'ar' ? 'قضية إيجارات' : 'Rental Dispute',
      court: language === 'ar' ? 'المحكمة الجزئية' : 'Partial Court',
      courtRoom: language === 'ar' ? 'القاعة 7' : 'Room 7',
      date: '2024-01-12',
      time: '09:30 AM',
      lawyer: language === 'ar' ? 'أحمد محمود' : 'Ahmed Mahmoud',
      status: 'completed' as const,
      type: language === 'ar' ? 'حكم' : 'Judgment',
      result: language === 'ar' ? 'تم الحكم لصالح الموكل بإخلاء العقار' : 'Judgment in favor of client for property eviction',
    },
    {
      id: '5',
      caseNumber: 'C-2024-0189',
      caseTitle: language === 'ar' ? 'قضية تجارية' : 'Commercial Case',
      court: language === 'ar' ? 'المحكمة التجارية' : 'Commercial Court',
      date: '2024-01-15',
      time: '01:00 PM',
      lawyer: language === 'ar' ? 'سارة علي' : 'Sarah Ali',
      status: 'adjourned' as const,
      type: language === 'ar' ? 'مرافعة' : 'Pleading',
      nextDate: '2024-02-10',
    },
  ];

  const getStatusColor = (status: string) => {
    const map: { [key: string]: string } = {
      'scheduled': 'bg-brand-primary/20 text-brand-primary',
      'completed': 'bg-legal-success-500/20 text-legal-success-500',
      'adjourned': 'bg-gold/20 text-gold',
      'cancelled': 'bg-legal-danger-500/20 text-legal-danger-500',
    };
    return map[status] || 'bg-muted text-muted-foreground';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: { ar: string; en: string } } = {
      'scheduled': { ar: 'مجدولة', en: 'Scheduled' },
      'completed': { ar: 'تمت', en: 'Completed' },
      'adjourned': { ar: 'مؤجلة', en: 'Adjourned' },
      'cancelled': { ar: 'ملغاة', en: 'Cancelled' },
    };
    return labels[status] ? labels[status][language === 'ar' ? 'ar' : 'en'] : status;
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
          <Button className="bg-gradient-to-r from-gold to-brand-primary text-white shadow-lg hover:opacity-90">
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
          <Card className="p-6 bg-gradient-to-br from-card to-surface/50 border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {language === 'ar' ? 'يناير 2024' : 'January 2024'}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="hover:bg-brand-primary/10 hover:text-brand-primary">
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
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50 text-gold" />
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
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-gold/20 to-brand-primary/10 border border-gold/20">
                  <span className="text-xs font-medium text-gold">
                    {new Date(date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'short' })}
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    {new Date(date).getDate()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
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
                {dateSessions.map((session) => (
                  <Card 
                    key={session.id} 
                    className="p-6 transition-all hover:shadow-custom-lg hover:shadow-gold/10 bg-gradient-to-br from-card to-surface/50 border-border/50"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="mb-1 flex items-center gap-2">
                              <span className="text-sm font-mono text-muted-foreground">
                                {session.caseNumber}
                              </span>
                              <Badge variant="secondary" className="text-xs bg-exclusive/10 text-exclusive">
                                {session.type}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">{session.caseTitle}</h3>
                          </div>
                          <Badge className={getStatusColor(session.status)}>
                            {getStatusLabel(session.status)}
                          </Badge>
                        </div>

                        <div className="grid gap-2 text-sm sm:grid-cols-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4 text-gold" />
                            <span dir="ltr">{session.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 text-brand-primary" />
                            <span className="truncate">{session.court}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
                            <User className="h-4 w-4 text-exclusive" />
                            <span>{t('lawyer')}: {session.lawyer}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 md:flex-col">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 hover:bg-brand-primary/10 hover:text-brand-primary hover:border-brand-primary/30"
                          onClick={() => setSelectedSession(session)}
                        >
                          <Eye className="h-4 w-4 ltr:mr-1 rtl:ml-1" />
                          {t('view')}
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 hover:bg-gold/10 hover:text-gold hover:border-gold/30">
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

      {/* Session Detail Modal */}
      {selectedSession && (
        <SessionDetailCard
          session={selectedSession}
          open={!!selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </DashboardLayout>
  );
}
