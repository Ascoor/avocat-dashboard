import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  Briefcase, 
  Calendar, 
  AlertTriangle, 
  Users,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function Dashboard() {
  const { t, language } = useLanguage();

  const stats = [
    {
      icon: Briefcase,
      label: t('activeCases'),
      value: '47',
      trend: '+12%',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Calendar,
      label: t('todaySessions'),
      value: '8',
      trend: '2 ' + (language === 'ar' ? 'قادمة' : 'upcoming'),
      color: 'from-accent to-gold-500',
    },
    {
      icon: AlertTriangle,
      label: t('overdueCases'),
      value: '3',
      trend: (language === 'ar' ? 'تحتاج انتباه' : 'needs attention'),
      color: 'from-red-500 to-red-600',
    },
    {
      icon: Users,
      label: t('activeClients'),
      value: '124',
      trend: '+8%',
      color: 'from-green-500 to-green-600',
    },
  ];

  const upcomingSessions = [
    {
      id: 1,
      caseNumber: 'C-2024-0145',
      caseTitle: language === 'ar' ? 'قضية عقد تجاري' : 'Commercial Contract Case',
      court: language === 'ar' ? 'المحكمة التجارية' : 'Commercial Court',
      date: '2024-01-15',
      time: '10:00 AM',
      lawyer: language === 'ar' ? 'أحمد محمود' : 'Ahmed Mahmoud',
      status: language === 'ar' ? 'مجدولة' : 'Scheduled',
    },
    {
      id: 2,
      caseNumber: 'C-2024-0098',
      caseTitle: language === 'ar' ? 'قضية عمالية' : 'Labor Dispute',
      court: language === 'ar' ? 'محكمة العمل' : 'Labor Court',
      date: '2024-01-15',
      time: '02:30 PM',
      lawyer: language === 'ar' ? 'سارة علي' : 'Sarah Ali',
      status: language === 'ar' ? 'مجدولة' : 'Scheduled',
    },
    {
      id: 3,
      caseNumber: 'C-2024-0234',
      caseTitle: language === 'ar' ? 'قضية استئناف' : 'Appeal Case',
      court: language === 'ar' ? 'محكمة الاستئناف' : 'Court of Appeal',
      date: '2024-01-16',
      time: '11:00 AM',
      lawyer: language === 'ar' ? 'محمد حسن' : 'Mohamed Hassan',
      status: language === 'ar' ? 'مجدولة' : 'Scheduled',
    },
  ];

  const casesByStatus = [
    { status: language === 'ar' ? 'جديدة' : 'New', count: 12, color: 'bg-blue-500' },
    { status: language === 'ar' ? 'قيد الإجراء' : 'In Progress', count: 28, color: 'bg-accent' },
    { status: language === 'ar' ? 'معلقة' : 'Pending', count: 7, color: 'bg-orange-500' },
    { status: language === 'ar' ? 'مغلقة' : 'Closed', count: 15, color: 'bg-green-500' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'نظرة عامة على أداء مكتبك' : 'Overview of your office performance'}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 transition-all hover:shadow-custom-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      <span>{stat.trend}</span>
                    </div>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color} shadow-md`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upcoming Sessions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">{t('upcomingSessions')}</h2>
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-start gap-4 rounded-lg border border-border/50 p-4 transition-all hover:border-accent/50 hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                      <Clock className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">{session.caseTitle}</p>
                          <p className="text-sm text-muted-foreground">{session.caseNumber}</p>
                        </div>
                        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                          {session.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span>{session.court}</span>
                        <span>•</span>
                        <span>{session.date} - {session.time}</span>
                        <span>•</span>
                        <span>{session.lawyer}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Cases by Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">{t('casesByStatus')}</h2>
                <Briefcase className="h-5 w-5 text-accent" />
              </div>
              <div className="space-y-4">
                {casesByStatus.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.status}</span>
                      <span className="text-muted-foreground">{item.count}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.count / 62) * 100}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className={`h-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-lg bg-muted/50 p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">62</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'إجمالي القضايا' : 'Total Cases'}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
