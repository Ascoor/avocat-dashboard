import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, FileText, Clock, CheckCircle2, AlertCircle,
  TrendingUp, Plus, Download, Eye, Send, Filter
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, KpiCard } from "@/components/avocat";
import { cn } from "@/lib/utils";
import { mockInvoices, type InvoiceData } from "@/data/avocat-mock-data";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const BillingPage: React.FC = () => {
  const { language, isRTL } = useLanguage();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const labels = {
    title: isRTL ? "الفواتير والمدفوعات" : "Billing & Invoices",
    subtitle: isRTL ? "إدارة الفواتير والمدفوعات والتقارير المالية" : "Manage invoices, payments, and financial reports",
    newInvoice: isRTL ? "فاتورة جديدة" : "New Invoice",
    search: isRTL ? "بحث في الفواتير..." : "Search invoices...",
    allStatuses: isRTL ? "جميع الحالات" : "All Statuses",
    kpis: {
      outstanding: isRTL ? "المبالغ المستحقة" : "Outstanding Balance",
      paid: isRTL ? "المدفوع هذا الشهر" : "Paid This Month",
      pending: isRTL ? "قيد المراجعة" : "Pending Review",
      overdue: isRTL ? "متأخرة" : "Overdue"
    },
    status: {
      draft: isRTL ? "مسودة" : "Draft",
      sent: isRTL ? "مُرسلة" : "Sent",
      paid: isRTL ? "مدفوعة" : "Paid",
      overdue: isRTL ? "متأخرة" : "Overdue"
    },
    table: {
      invoiceNo: isRTL ? "رقم الفاتورة" : "Invoice #",
      client: isRTL ? "العميل" : "Client",
      amount: isRTL ? "المبلغ" : "Amount",
      status: isRTL ? "الحالة" : "Status",
      dueDate: isRTL ? "تاريخ الاستحقاق" : "Due Date"
    },
    chartTitle: isRTL ? "المدفوعات عبر الزمن" : "Payments Over Time",
    rateCardTitle: isRTL ? "بطاقة الأسعار" : "Rate Card"
  };

  // Calculate KPIs
  const kpis = useMemo(() => {
    const outstanding = mockInvoices
      .filter(i => i.status === "sent" || i.status === "overdue")
      .reduce((sum, i) => sum + i.amount, 0);
    
    const paidThisMonth = mockInvoices
      .filter(i => i.status === "paid")
      .reduce((sum, i) => sum + i.amount, 0);
    
    const pending = mockInvoices.filter(i => i.status === "draft").length;
    const overdue = mockInvoices.filter(i => i.status === "overdue").length;
    
    return { outstanding, paidThisMonth, pending, overdue };
  }, []);

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return mockInvoices.filter((invoice: InvoiceData) => {
      const clientName = isRTL ? invoice.clientAr : invoice.client;
      const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           clientName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || invoice.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus, isRTL]);

  // Chart data
  const chartData = useMemo(() => {
    return [
      { month: isRTL ? "يناير" : "Jan", amount: 45000 },
      { month: isRTL ? "فبراير" : "Feb", amount: 52000 },
      { month: isRTL ? "مارس" : "Mar", amount: 48000 },
      { month: isRTL ? "أبريل" : "Apr", amount: 61000 },
      { month: isRTL ? "مايو" : "May", amount: 55000 },
      { month: isRTL ? "يونيو" : "Jun", amount: 67000 },
    ];
  }, [isRTL]);

  const rateCard = [
    { service: isRTL ? "استشارة قانونية" : "Legal Consultation", rate: 500, unit: isRTL ? "ساعة" : "hour" },
    { service: isRTL ? "صياغة عقود" : "Contract Drafting", rate: 2500, unit: isRTL ? "عقد" : "contract" },
    { service: isRTL ? "تمثيل قضائي" : "Court Representation", rate: 5000, unit: isRTL ? "جلسة" : "session" },
    { service: isRTL ? "مراجعة وثائق" : "Document Review", rate: 300, unit: isRTL ? "ساعة" : "hour" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === "ar" ? "ar-SA" : "en-SA", {
      style: "currency",
      currency: "SAR",
      maximumFractionDigits: 0
    }).format(amount);
  };

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
          <Plus className="h-4 w-4" />
          {labels.newInvoice}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label={labels.kpis.outstanding}
          value={formatCurrency(kpis.outstanding)}
          icon={DollarSign}
          trend="+12%"
          trendUp={false}
          gradient="from-amber-500 to-amber-600"
        />
        <KpiCard
          label={labels.kpis.paid}
          value={formatCurrency(kpis.paidThisMonth)}
          icon={CheckCircle2}
          trend="+8%"
          trendUp={true}
          gradient="from-green-500 to-green-600"
        />
        <KpiCard
          label={labels.kpis.pending}
          value={kpis.pending.toString()}
          icon={Clock}
          gradient="from-primary to-primary-glow"
        />
        <KpiCard
          label={labels.kpis.overdue}
          value={kpis.overdue.toString()}
          icon={AlertCircle}
          trend="-2"
          trendUp={true}
          gradient="from-destructive to-red-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payments Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {labels.chartTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                    formatter={(value: number) => [formatCurrency(value), isRTL ? "المبلغ" : "Amount"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Rate Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gold" />
              {labels.rateCardTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rateCard.map((item, index) => (
                <motion.div
                  key={item.service}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">{item.service}</span>
                  <div className="text-end">
                    <span className="text-sm font-bold text-primary">
                      {formatCurrency(item.rate)}
                    </span>
                    <span className="text-xs text-muted-foreground ms-1">/ {item.unit}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Input
              placeholder={labels.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(isRTL ? "pr-10" : "pl-10")}
            />
            <Filter className={cn(
              "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
              isRTL ? "right-3" : "left-3"
            )} />
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={labels.allStatuses} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{labels.allStatuses}</SelectItem>
              <SelectItem value="draft">{labels.status.draft}</SelectItem>
              <SelectItem value="sent">{labels.status.sent}</SelectItem>
              <SelectItem value="paid">{labels.status.paid}</SelectItem>
              <SelectItem value="overdue">{labels.status.overdue}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className={cn("px-4 py-3 text-sm font-medium text-muted-foreground", isRTL ? "text-right" : "text-left")}>
                    {labels.table.invoiceNo}
                  </th>
                  <th className={cn("px-4 py-3 text-sm font-medium text-muted-foreground", isRTL ? "text-right" : "text-left")}>
                    {labels.table.client}
                  </th>
                  <th className={cn("px-4 py-3 text-sm font-medium text-muted-foreground", isRTL ? "text-right" : "text-left")}>
                    {labels.table.amount}
                  </th>
                  <th className={cn("px-4 py-3 text-sm font-medium text-muted-foreground", isRTL ? "text-right" : "text-left")}>
                    {labels.table.status}
                  </th>
                  <th className={cn("px-4 py-3 text-sm font-medium text-muted-foreground", isRTL ? "text-right" : "text-left")}>
                    {labels.table.dueDate}
                  </th>
                  <th className="px-4 py-3 w-32"></th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice, index) => {
                  const clientName = isRTL ? invoice.clientAr : invoice.client;
                  
                  return (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm font-medium text-foreground">
                          {invoice.invoiceNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm">{clientName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-foreground">
                          {formatCurrency(invoice.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={invoice.status} size="sm" />
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(invoice.dueDate).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                          {invoice.status === "draft" && (
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BillingPage;
