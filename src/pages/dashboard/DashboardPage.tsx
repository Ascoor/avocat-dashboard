'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Briefcase, 
  Calendar, 
  AlertTriangle,
  Users,
  TrendingUp,
  Clock,
  PieChart as PieChartIcon,
  Activity,
  BarChart3,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
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
import type { TooltipProps } from 'recharts';

type StatCard = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  trend: string;
  color: string;
};

type Session = {
  id: number;
  caseNumber: string;
  caseTitle: string;
  court: string;
  date: string;
  time: string;
  lawyer: string;
  status: string;
};

type CaseStatus = {
  status: string;
  count: number;
  color: string;
};

type MonthlySessionDatum = {
  month: string;
  sessions: number;
  completed: number;
};

type CaseTypeDatum = {
  name: string;
  value: number;
  color: string;
};

type PerformanceDatum = {
  month: string;
  won: number;
  lost: number;
  settled: number;
};

type ClosureRateDatum = {
  month: string;
  rate: number;
};

const chartColors: Record<string, string> = {
  primary: 'hsl(var(--brand-primary))',
  gold: 'hsl(var(--gold))',
  exclusive: 'hsl(var(--exclusive))',
  neon: 'hsl(var(--neon))',
  accent: 'hsl(var(--accent))',
  success: 'hsl(var(--legal-success-500))',
  warning: 'hsl(var(--legal-warning-500))',
  danger: 'hsl(var(--legal-danger-500))',
};

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const isArabic = language?.startsWith('ar');

  const renderChartTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="rounded-lg border border-border bg-card/95 p-3 shadow-lg backdrop-blur-sm">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="mt-2 space-y-1">
          {payload.map((item) => (
            <div key={item.dataKey as string} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color || chartColors.primary }}
                />
                {item.name}
              </span>
              <span className="text-sm text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // -------------------------
  // Top Stats Cards
  // -------------------------
  const stats: StatCard[] = [
    {
      icon: Briefcase,
      label: t('dashboard.kpis.openCases'),
      value: '47',
      trend: '+12%',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Calendar,
      label: t('dashboard.upcoming_sessions'),
      value: '8',
      trend: isArabic ? '2 قادمة' : '2 upcoming',
      color: 'from-accent to-gold-500',
    },
    {
      icon: AlertTriangle,
      label: t('dashboard.active_clients'),
      value: '3',
      trend: isArabic ? 'تحتاج انتباه' : 'needs attention',
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: Users,
      label: t('dashboard.kpis.activeClients'),
      value: '124',
      trend: isArabic ? 'هذا الأسبوع' : 'this week',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  // -------------------------
  // Upcoming Sessions
  // -------------------------
  const upcomingSessions: Session[] = [
    {
      id: 1,
      caseNumber: 'C-2024-0145',
      caseTitle: isArabic ? 'قضية عقد تجاري' : 'Commercial Contract Case',
      court: isArabic ? 'المحكمة التجارية' : 'Commercial Court',
      date: '2024-01-15',
      time: '10:00 AM',
      lawyer: isArabic ? 'أحمد محمود' : 'Ahmed Mahmoud',
      status: isArabic ? 'مجدولة' : 'Scheduled',
    },
    {
      id: 2,
      caseNumber: 'C-2024-0098',
      caseTitle: isArabic ? 'قضية عمالية' : 'Labor Dispute',
      court: isArabic ? 'محكمة العمل' : 'Labor Court',
      date: '2024-01-15',
      time: '02:30 PM',
      lawyer: isArabic ? 'سارة علي' : 'Sarah Ali',
      status: isArabic ? 'مجدولة' : 'Scheduled',
    },
    {
      id: 3,
      caseNumber: 'C-2024-0234',
      caseTitle: isArabic ? 'قضية استئناف' : 'Appeal Case',
      court: isArabic ? 'محكمة الاستئناف' : 'Court of Appeal',
      date: '2024-01-16',
      time: '11:00 AM',
      lawyer: isArabic ? 'محمد حسن' : 'Mohamed Hassan',
      status: isArabic ? 'مجدولة' : 'Scheduled',
    },
  ];

  // -------------------------
  // Cases by Status
  // -------------------------
  const casesByStatus: CaseStatus[] = [
    { status: isArabic ? 'جديدة' : 'New', count: 12, color: 'bg-blue-500' },
    { status: isArabic ? 'قيد الإجراء' : 'In Progress', count: 28, color: 'bg-accent' },
    { status: isArabic ? 'معلقة' : 'Pending', count: 7, color: 'bg-orange-500' },
    { status: isArabic ? 'مغلقة' : 'Closed', count: 15, color: 'bg-green-500' },
  ];

  const totalCases = casesByStatus.reduce((sum, item) => sum + item.count, 0) || 1;

  // -------------------------
  // Chart Data
  // -------------------------
  const monthlySessionsData: MonthlySessionDatum[] = [
    { month: isArabic ? 'يناير' : 'Jan', sessions: 45, completed: 40 },
    { month: isArabic ? 'فبراير' : 'Feb', sessions: 52, completed: 48 },
    { month: isArabic ? 'مارس' : 'Mar', sessions: 48, completed: 45 },
    { month: isArabic ? 'أبريل' : 'Apr', sessions: 61, completed: 58 },
    { month: isArabic ? 'مايو' : 'May', sessions: 55, completed: 52 },
    { month: isArabic ? 'يونيو' : 'Jun', sessions: 67, completed: 63 },
  ];

  const caseTypeDistribution: CaseTypeDatum[] = [
    { name: isArabic ? 'تجاري' : 'Commercial', value: 30, color: 'hsl(var(--brand-primary))' },
    { name: isArabic ? 'جنائي' : 'Criminal', value: 25, color: 'hsl(var(--gold))' },
    { name: isArabic ? 'عمالي' : 'Labor', value: 20, color: 'hsl(var(--exclusive))' },
    { name: isArabic ? 'أحوال شخصية' : 'Family', value: 15, color: 'hsl(var(--neon))' },
    { name: isArabic ? 'أخرى' : 'Other', value: 10, color: 'hsl(var(--accent))' },
  ];

  const performanceData: PerformanceDatum[] = [
    { month: isArabic ? 'يناير' : 'Jan', won: 8, lost: 2, settled: 5 },
    { month: isArabic ? 'فبراير' : 'Feb', won: 10, lost: 1, settled: 6 },
    { month: isArabic ? 'مارس' : 'Mar', won: 9, lost: 3, settled: 4 },
    { month: isArabic ? 'أبريل' : 'Apr', won: 12, lost: 2, settled: 7 },
    { month: isArabic ? 'مايو' : 'May', won: 11, lost: 1, settled: 8 },
    { month: isArabic ? 'يونيو' : 'Jun', won: 13, lost: 2, settled: 6 },
  ];

  const closureRateData: ClosureRateDatum[] = [
    { month: isArabic ? 'يناير' : 'Jan', rate: 85 },
    { month: isArabic ? 'فبراير' : 'Feb', rate: 88 },
    { month: isArabic ? 'مارس' : 'Mar', rate: 82 },
    { month: isArabic ? 'أبريل' : 'Apr', rate: 91 },
    { month: isArabic ? 'مايو' : 'May', rate: 89 },
    { month: isArabic ? 'يونيو' : 'Jun', rate: 94 },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground">
          {isArabic ? 'نظرة عامة على أداء مكتبك' : 'Overview of your office performance'}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
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
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color} shadow-md`}
                >
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
                  {isArabic ? 'الجلسات الشهرية' : 'Monthly Sessions'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {isArabic
                    ? 'مقارنة الجلسات المجدولة والمنجزة'
                    : 'Scheduled vs Completed Sessions'}
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
                    <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.gold} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={chartColors.gold} stopOpacity={0} />
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
                <Tooltip content={renderChartTooltip} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke={chartColors.primary}
                  strokeWidth={3}
                  fill="url(#sessionsGradient)"
                  dot={{ fill: chartColors.primary, r: 5 }}
                  activeDot={{ r: 8 }}
                  name={isArabic ? 'مجدولة' : 'Scheduled'}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke={chartColors.gold}
                  strokeWidth={3}
                  fill="url(#completedGradient)"
                  dot={{ fill: chartColors.gold, r: 5 }}
                  activeDot={{ r: 8 }}
                  name={isArabic ? 'منجزة' : 'Completed'}
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
                  {isArabic
                    ? 'توزيع القضايا حسب النوع'
                    : 'Case Type Distribution'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {isArabic
                    ? 'التصنيفات القانونية للقضايا'
                    : 'Legal Case Categories'}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-exclusive to-exclusive-glow flex items-center justify-center shadow-exclusive-glow">
                <PieChartIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={caseTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  innerRadius={60}
                  outerRadius={110}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {caseTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={renderChartTooltip} />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground"
                  style={{ fontSize: '14px', fontWeight: 700 }}
                >
                  {isArabic ? 'الإجمالي' : 'Total'} {caseTypeDistribution.reduce((sum, item) => sum + item.value, 0)}
                </text>
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
                  {isArabic ? 'الأداء الشهري' : 'Monthly Performance'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {isArabic
                    ? 'نتائج القضايا (مكسوبة / خاسرة / تسوية)'
                    : 'Case Outcomes (Won / Lost / Settled)'}
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
                <Tooltip content={renderChartTooltip} />
                <Legend />
                <Bar
                  dataKey="won"
                  fill={chartColors.success}
                  radius={[8, 8, 0, 0]}
                  name={isArabic ? 'مكسوبة' : 'Won'}
                />
                <Bar
                  dataKey="lost"
                  fill={chartColors.danger}
                  radius={[8, 8, 0, 0]}
                  name={isArabic ? 'خاسرة' : 'Lost'}
                />
                <Bar
                  dataKey="settled"
                  fill={chartColors.warning}
                  radius={[8, 8, 0, 0]}
                  name={isArabic ? 'تسوية' : 'Settled'}
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
                  {isArabic ? 'معدل إغلاق القضايا' : 'Case Closure Rate'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {isArabic
                    ? 'نسبة إنجاز القضايا شهرياً'
                    : 'Monthly Case Completion Rate'}
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
                    <stop
                      offset="5%"
                      stopColor={chartColors.neon}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={chartColors.neon}
                      stopOpacity={0.1}
                    />
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
                  content={(props) => {
                    const mappedPayload = props.payload?.map((entry) => ({
                      name: isArabic ? 'معدل الإغلاق' : 'Closure Rate',
                      value: `${entry.value}%`,
                      color: entry.color,
                    }));
                    return (
                      <div className="rounded-lg border border-border/50 bg-popover/95 p-3 shadow-xl backdrop-blur-sm">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                          {props.label}
                        </p>
                        {mappedPayload?.map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm font-semibold text-foreground">
                              {item.name}: {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }}
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

      {/* Upcoming Sessions & Cases by Status */}
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
                {t('dashboard.upcoming_sessions')}
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
                        <p className="font-semibold text-foreground">
                          {session.caseTitle}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {session.caseNumber}
                        </p>
                      </div>
                      <span className="rounded-full bg-gradient-to-r from-accent/10 to-gold/10 px-3 py-1 text-xs font-medium text-accent border border-accent/20">
                        {session.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span>{session.court}</span>
                      <span>•</span>
                      <span>
                        {session.date} - {session.time}
                      </span>
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
                {t('dashboard.casesByStatus')}
              </h2>
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-exclusive to-neon flex items-center justify-center shadow-exclusive-glow">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              {casesByStatus.map((item, index) => (
                <motion.div
                  key={item.status}
                  className="space-y-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {item.status}
                    </span>
                    <span className="text-muted-foreground font-semibold">
                      {item.count}
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted/50 border border-border/30">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / totalCases) * 100}%` }}
                      transition={{
                        delay: 0.7 + index * 0.1,
                        duration: 0.8,
                        ease: 'easeOut',
                      }}
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
                  transition={{
                    delay: 1.2,
                    type: 'spring',
                    stiffness: 200,
                  }}
                >
                  {totalCases}
                </motion.p>
                <p className="text-sm text-muted-foreground mt-1">
                  {isArabic ? 'إجمالي القضايا' : 'Total Cases'}
                </p>
              </div>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
