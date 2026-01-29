import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, PieChart, TrendingUp, Download, Calendar,
  Users, Briefcase, DollarSign, Clock, Filter
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPie, Pie, Cell, LineChart, Line, Legend
} from "recharts";

const ReportsPage: React.FC = () => {
  const { isRTL } = useLanguage();
  
  const [dateRange, setDateRange] = useState("thisMonth");
  const [reportType, setReportType] = useState("all");

  const labels = {
    title: isRTL ? "التقارير والإحصائيات" : "Reports & Analytics",
    subtitle: isRTL ? "تحليلات شاملة لأداء المكتب والعمليات القانونية" : "Comprehensive analytics for office performance and legal operations",
    export: isRTL ? "تصدير التقرير" : "Export Report",
    dateRanges: {
      thisWeek: isRTL ? "هذا الأسبوع" : "This Week",
      thisMonth: isRTL ? "هذا الشهر" : "This Month",
      lastMonth: isRTL ? "الشهر الماضي" : "Last Month",
      thisQuarter: isRTL ? "هذا الربع" : "This Quarter",
      thisYear: isRTL ? "هذه السنة" : "This Year"
    },
    reportTypes: {
      all: isRTL ? "جميع التقارير" : "All Reports",
      cases: isRTL ? "تقارير القضايا" : "Case Reports",
      financial: isRTL ? "التقارير المالية" : "Financial Reports",
      performance: isRTL ? "تقارير الأداء" : "Performance Reports"
    },
    charts: {
      casesByStatus: isRTL ? "القضايا حسب الحالة" : "Cases by Status",
      revenueByMonth: isRTL ? "الإيرادات الشهرية" : "Monthly Revenue",
      teamPerformance: isRTL ? "أداء الفريق" : "Team Performance",
      casesByType: isRTL ? "القضايا حسب النوع" : "Cases by Type"
    },
    quickReports: {
      title: isRTL ? "تقارير سريعة" : "Quick Reports",
      caseSummary: isRTL ? "ملخص القضايا" : "Case Summary",
      financialSummary: isRTL ? "الملخص المالي" : "Financial Summary",
      teamWorkload: isRTL ? "توزيع العمل" : "Team Workload",
      complianceReport: isRTL ? "تقرير الامتثال" : "Compliance Report"
    }
  };

  // Mock chart data
  const casesByStatusData = [
    { name: isRTL ? "نشطة" : "Active", value: 45, color: "hsl(var(--primary))" },
    { name: isRTL ? "قيد الانتظار" : "Pending", value: 23, color: "hsl(38, 92%, 50%)" },
    { name: isRTL ? "مغلقة" : "Closed", value: 32, color: "hsl(142, 76%, 36%)" },
    { name: isRTL ? "معلقة" : "On Hold", value: 12, color: "hsl(var(--muted-foreground))" },
  ];

  const revenueData = [
    { month: isRTL ? "يناير" : "Jan", revenue: 85000, expenses: 42000 },
    { month: isRTL ? "فبراير" : "Feb", revenue: 92000, expenses: 45000 },
    { month: isRTL ? "مارس" : "Mar", revenue: 78000, expenses: 38000 },
    { month: isRTL ? "أبريل" : "Apr", revenue: 110000, expenses: 52000 },
    { month: isRTL ? "مايو" : "May", revenue: 95000, expenses: 48000 },
    { month: isRTL ? "يونيو" : "Jun", revenue: 125000, expenses: 55000 },
  ];

  const teamPerformanceData = [
    { name: isRTL ? "أحمد محمد" : "Ahmed Mohammed", cases: 18, sessions: 24 },
    { name: isRTL ? "سارة أحمد" : "Sara Ahmed", cases: 15, sessions: 20 },
    { name: isRTL ? "خالد علي" : "Khaled Ali", cases: 12, sessions: 16 },
    { name: isRTL ? "نورة سعد" : "Noura Saad", cases: 10, sessions: 14 },
  ];

  const casesByTypeData = [
    { type: isRTL ? "تجاري" : "Commercial", count: 35 },
    { type: isRTL ? "عقاري" : "Real Estate", count: 28 },
    { type: isRTL ? "عمالي" : "Labor", count: 22 },
    { type: isRTL ? "جنائي" : "Criminal", count: 15 },
    { type: isRTL ? "أسري" : "Family", count: 12 },
  ];

  const quickReports = [
    { 
      id: "case-summary",
      title: labels.quickReports.caseSummary,
      icon: Briefcase,
      description: isRTL ? "ملخص شامل لجميع القضايا النشطة والمغلقة" : "Comprehensive summary of all active and closed cases",
      color: "text-primary"
    },
    { 
      id: "financial",
      title: labels.quickReports.financialSummary,
      icon: DollarSign,
      description: isRTL ? "تقرير الإيرادات والمصروفات والفواتير" : "Revenue, expenses, and invoices report",
      color: "text-gold"
    },
    { 
      id: "workload",
      title: labels.quickReports.teamWorkload,
      icon: Users,
      description: isRTL ? "توزيع المهام والقضايا على أعضاء الفريق" : "Task and case distribution among team members",
      color: "text-accent"
    },
    { 
      id: "compliance",
      title: labels.quickReports.complianceReport,
      icon: Clock,
      description: isRTL ? "تقرير الالتزام بالمواعيد والإجراءات" : "Deadlines and procedures compliance report",
      color: "text-green-500"
    },
  ];

  const COLORS = ["hsl(var(--primary))", "hsl(38, 92%, 50%)", "hsl(142, 76%, 36%)", "hsl(var(--muted-foreground))"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{labels.title}</h1>
          <p className="text-muted-foreground">{labels.subtitle}</p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          {labels.export}
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(labels.dateRanges).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(labels.reportTypes).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickReports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-200 h-full">
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn("p-2 rounded-lg bg-muted/50", report.color)}>
                    <report.icon className="h-5 w-5" />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{report.title}</h3>
                <p className="text-sm text-muted-foreground flex-1">{report.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cases by Status - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              {labels.charts.casesByStatus}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={casesByStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {casesByStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue vs Expenses - Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gold" />
              {labels.charts.revenueByMonth}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    reversed={isRTL}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `${value / 1000}K`}
                    orientation={isRTL ? "right" : "left"}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    name={isRTL ? "الإيرادات" : "Revenue"}
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    name={isRTL ? "المصروفات" : "Expenses"}
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--destructive))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Team Performance - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              {labels.charts.teamPerformance}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamPerformanceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="cases" 
                    name={isRTL ? "القضايا" : "Cases"}
                    fill="hsl(var(--primary))" 
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar 
                    dataKey="sessions" 
                    name={isRTL ? "الجلسات" : "Sessions"}
                    fill="hsl(38, 92%, 50%)" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cases by Type - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              {labels.charts.casesByType}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={casesByTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="type" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    reversed={isRTL}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    orientation={isRTL ? "right" : "left"}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    name={isRTL ? "العدد" : "Count"}
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ReportsPage;
