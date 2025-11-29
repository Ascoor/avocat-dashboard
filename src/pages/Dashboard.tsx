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
  Clock,
  BarChart3,
  PieChart,
  Activity,
  TrendingDown
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

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

  // Chart Data
  const monthlySessionsData = [
    { month: language === 'ar' ? 'يناير' : 'Jan', sessions: 45, completed: 40 },
    { month: language === 'ar' ? 'فبراير' : 'Feb', sessions: 52, completed: 48 },
    { month: language === 'ar' ? 'مارس' : 'Mar', sessions: 48, completed: 45 },
    { month: language === 'ar' ? 'أبريل' : 'Apr', sessions: 61, completed: 58 },
    { month: language === 'ar' ? 'مايو' : 'May', sessions: 55, completed: 52 },
    { month: language === 'ar' ? 'يونيو' : 'Jun', sessions: 67, completed: 63 },
  ];

  const caseTypeDistribution = [
    { name: language === 'ar' ? 'تجاري' : 'Commercial', value: 30, color: 'hsl(var(--brand-primary))' },
    { name: language === 'ar' ? 'جنائي' : 'Criminal', value: 25, color: 'hsl(var(--gold))' },
    { name: language === 'ar' ? 'عمالي' : 'Labor', value: 20, color: 'hsl(var(--exclusive))' },
    { name: language === 'ar' ? 'أحوال شخصية' : 'Family', value: 15, color: 'hsl(var(--neon))' },
    { name: language === 'ar' ? 'أخرى' : 'Other', value: 10, color: 'hsl(var(--accent))' },
  ];

  const performanceData = [
    { month: language === 'ar' ? 'يناير' : 'Jan', won: 8, lost: 2, settled: 5 },
    { month: language === 'ar' ? 'فبراير' : 'Feb', won: 10, lost: 1, settled: 6 },
    { month: language === 'ar' ? 'مارس' : 'Mar', won: 9, lost: 3, settled: 4 },
    { month: language === 'ar' ? 'أبريل' : 'Apr', won: 12, lost: 2, settled: 7 },
    { month: language === 'ar' ? 'مايو' : 'May', won: 11, lost: 1, settled: 8 },
    { month: language === 'ar' ? 'يونيو' : 'Jun', won: 13, lost: 2, settled: 6 },
  ];

  const closureRateData = [
    { month: language === 'ar' ? 'يناير' : 'Jan', rate: 85 },
    { month: language === 'ar' ? 'فبراير' : 'Feb', rate: 88 },
    { month: language === 'ar' ? 'مارس' : 'Mar', rate: 82 },
    { month: language === 'ar' ? 'أبريل' : 'Apr', rate: 91 },
    { month: language === 'ar' ? 'مايو' : 'May', rate: 89 },
    { month: language === 'ar' ? 'يونيو' : 'Jun', rate: 94 },
  ];

  const chartColors = {
    primary: 'hsl(var(--brand-primary))',
    gold: 'hsl(var(--gold))',
    exclusive: 'hsl(var(--exclusive))',
    neon: 'hsl(var(--neon))',
    accent: 'hsl(var(--accent))',
    success: 'hsl(var(--legal-success-500))',
    warning: 'hsl(var(--legal-warning-500))',
    danger: 'hsl(var(--legal-danger-500))',
  };

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

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Sessions Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-surface via-card to-surface-raised shadow-legal-icon-shadow-soft border-sidebar-border">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-brand-primary to-gold bg-clip-text text-transparent">
                    {language === 'ar' ? 'الجلسات الشهرية' : 'Monthly Sessions'}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'ar' ? 'مقارنة الجلسات المجدولة والمنجزة' : 'Scheduled vs Completed Sessions'}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-brand-primary to-primary-glow flex items-center justify-center shadow-exclusive-glow">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlySessionsData}>
                  <defs>
                    <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.gold} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={chartColors.gold} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="sessions" 
                    stroke={chartColors.primary}
                    strokeWidth={3}
                    dot={{ fill: chartColors.primary, r: 5 }}
                    activeDot={{ r: 7 }}
                    name={language === 'ar' ? 'مجدولة' : 'Scheduled'}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke={chartColors.gold}
                    strokeWidth={3}
                    dot={{ fill: chartColors.gold, r: 5 }}
                    activeDot={{ r: 7 }}
                    name={language === 'ar' ? 'منجزة' : 'Completed'}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Case Type Distribution */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-surface via-card to-surface-raised shadow-legal-icon-shadow-soft border-sidebar-border">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-exclusive to-neon bg-clip-text text-transparent">
                    {language === 'ar' ? 'توزيع القضايا حسب النوع' : 'Case Type Distribution'}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'ar' ? 'التصنيفات القانونية للقضايا' : 'Legal Case Categories'}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-exclusive to-exclusive-glow flex items-center justify-center shadow-exclusive-glow">
                  <PieChart className="h-6 w-6 text-white" />
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={caseTypeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {caseTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Performance & Closure Rate */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-surface via-card to-surface-raised shadow-legal-icon-shadow-soft border-sidebar-border">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent">
                    {language === 'ar' ? 'الأداء الشهري' : 'Monthly Performance'}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'ar' ? 'نتائج القضايا (مكسوبة / خاسرة / تسوية)' : 'Case Outcomes (Won / Lost / Settled)'}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gold to-gold-light flex items-center justify-center shadow-legal-icon-shadow-soft">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="won" 
                    fill={chartColors.success}
                    radius={[8, 8, 0, 0]}
                    name={language === 'ar' ? 'مكسوبة' : 'Won'}
                  />
                  <Bar 
                    dataKey="lost" 
                    fill={chartColors.danger}
                    radius={[8, 8, 0, 0]}
                    name={language === 'ar' ? 'خاسرة' : 'Lost'}
                  />
                  <Bar 
                    dataKey="settled" 
                    fill={chartColors.warning}
                    radius={[8, 8, 0, 0]}
                    name={language === 'ar' ? 'تسوية' : 'Settled'}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Closure Rate Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-surface via-card to-surface-raised shadow-legal-icon-shadow-soft border-sidebar-border">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-neon to-accent-mint bg-clip-text text-transparent">
                    {language === 'ar' ? 'معدل إغلاق القضايا' : 'Case Closure Rate'}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'ar' ? 'نسبة إنجاز القضايا شهرياً' : 'Monthly Case Completion Rate'}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-neon to-neon-muted flex items-center justify-center shadow-legal-icon-shadow-soft">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={closureRateData}>
                  <defs>
                    <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.neon} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={chartColors.neon} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                    formatter={(value) => [`${value}%`, language === 'ar' ? 'معدل الإغلاق' : 'Closure Rate']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke={chartColors.neon}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#rateGradient)"
                    animationBegin={0}
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upcoming Sessions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-card to-surface shadow-legal-icon-shadow-soft border-sidebar-border">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-brand-primary to-exclusive bg-clip-text text-transparent">
                  {t('upcomingSessions')}
                </h2>
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent to-gold flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="space-y-4">
                {upcomingSessions.map((session, idx) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
                    className="flex items-start gap-4 rounded-lg border border-border/50 p-4 transition-all hover:border-accent/50 hover:shadow-md hover:scale-[1.02] bg-gradient-to-r from-surface to-card"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-gold/20 border border-accent/30">
                      <Clock className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-foreground">{session.caseTitle}</p>
                          <p className="text-sm text-muted-foreground">{session.caseNumber}</p>
                        </div>
                        <span className="rounded-full bg-gradient-to-r from-accent/10 to-gold/10 px-3 py-1 text-xs font-medium text-accent border border-accent/20">
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
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Cases by Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-card to-surface shadow-legal-icon-shadow-soft border-sidebar-border">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-exclusive to-neon bg-clip-text text-transparent">
                  {t('casesByStatus')}
                </h2>
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-exclusive to-neon flex items-center justify-center shadow-exclusive-glow">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="space-y-4">
                {casesByStatus.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="space-y-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{item.status}</span>
                      <span className="text-muted-foreground font-semibold">{item.count}</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-muted/50 border border-border/30">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.count / 62) * 100}%` }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                        className={`h-full ${item.color} shadow-sm`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div 
                className="mt-6 rounded-lg bg-gradient-to-br from-muted/50 to-surface p-4 border border-border/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <div className="text-center">
                  <motion.p 
                    className="text-3xl font-bold bg-gradient-to-r from-brand-primary to-gold bg-clip-text text-transparent"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                  >
                    62
                  </motion.p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'ar' ? 'إجمالي القضايا' : 'Total Cases'}
                  </p>
                </div>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
