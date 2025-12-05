import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Search, Plus, Eye, Calendar, User, Scale } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CaseDetailCard } from '@/components/details';

export default function Cases() {
  const { t, language } = useLanguage();
  const [selectedCase, setSelectedCase] = useState<any>(null);

  const cases = [
    {
      id: '1',
      caseNumber: 'C-2024-0145',
      title: language === 'ar' ? 'نزاع عقد تجاري' : 'Commercial Contract Dispute',
      client: language === 'ar' ? 'شركة النور للتجارة' : 'Al-Nour Trading Company',
      opponent: language === 'ar' ? 'شركة الأمل' : 'Al-Amal Company',
      court: language === 'ar' ? 'المحكمة التجارية - الدائرة الأولى' : 'Commercial Court - First Circuit',
      status: 'inProgress' as const,
      stage: language === 'ar' ? 'مرحلة المرافعة' : 'Pleading Stage',
      nextSession: '2024-01-20',
      lawyer: language === 'ar' ? 'أحمد محمود' : 'Ahmed Mahmoud',
      priority: 'high' as const,
      openDate: '2024-01-05',
      description: language === 'ar' 
        ? 'نزاع حول عقد توريد بقيمة 2 مليون ريال بسبب تأخر في التسليم وعدم مطابقة المواصفات'
        : 'Dispute over a 2 million SAR supply contract due to delivery delays and non-conforming specifications',
      sessions: [
        { date: '2024-01-10', status: language === 'ar' ? 'مكتملة' : 'Completed', notes: language === 'ar' ? 'تقديم المذكرات الأولية' : 'Initial briefs submitted' },
        { date: '2024-01-20', status: language === 'ar' ? 'مجدولة' : 'Scheduled', notes: language === 'ar' ? 'جلسة مرافعة' : 'Pleading session' },
      ],
      procedures: [
        { date: '2024-01-08', title: language === 'ar' ? 'مذكرة دفاع' : 'Defense Memo', type: language === 'ar' ? 'مذكرة' : 'Memo' },
        { date: '2024-01-15', title: language === 'ar' ? 'طلب استدعاء شهود' : 'Witness Summons Request', type: language === 'ar' ? 'طلب' : 'Request' },
      ],
    },
    {
      id: '2',
      caseNumber: 'C-2024-0098',
      title: language === 'ar' ? 'قضية عمالية' : 'Labor Dispute',
      client: language === 'ar' ? 'محمد أحمد' : 'Mohamed Ahmed',
      opponent: language === 'ar' ? 'شركة البناء الحديثة' : 'Modern Construction Co.',
      court: language === 'ar' ? 'محكمة العمل' : 'Labor Court',
      status: 'new' as const,
      stage: language === 'ar' ? 'تحقيقات أولية' : 'Initial Investigation',
      nextSession: '2024-01-18',
      lawyer: language === 'ar' ? 'سارة علي' : 'Sarah Ali',
      priority: 'medium' as const,
      openDate: '2024-01-02',
      description: language === 'ar'
        ? 'مطالبة بمستحقات نهاية الخدمة وتعويض عن الفصل التعسفي'
        : 'Claim for end-of-service benefits and compensation for unfair dismissal',
      sessions: [],
      procedures: [],
    },
    {
      id: '3',
      caseNumber: 'C-2024-0234',
      title: language === 'ar' ? 'استئناف حكم مدني' : 'Civil Judgment Appeal',
      client: language === 'ar' ? 'فاطمة خالد' : 'Fatima Khaled',
      opponent: language === 'ar' ? 'بنك الوطني' : 'National Bank',
      court: language === 'ar' ? 'محكمة الاستئناف' : 'Court of Appeal',
      status: 'inProgress' as const,
      stage: language === 'ar' ? 'استئناف' : 'Appeal',
      nextSession: '2024-02-05',
      lawyer: language === 'ar' ? 'محمد حسن' : 'Mohamed Hassan',
      priority: 'high' as const,
      openDate: '2023-12-15',
      sessions: [
        { date: '2024-01-05', status: language === 'ar' ? 'مكتملة' : 'Completed', notes: language === 'ar' ? 'تقديم صحيفة الاستئناف' : 'Appeal brief submitted' },
      ],
      procedures: [],
    },
    {
      id: '4',
      caseNumber: 'C-2024-0067',
      title: language === 'ar' ? 'قضية إيجارات' : 'Rental Dispute',
      client: language === 'ar' ? 'عبدالله سالم' : 'Abdullah Salem',
      opponent: language === 'ar' ? 'علي عمر' : 'Ali Omar',
      court: language === 'ar' ? 'المحكمة الجزئية' : 'Partial Court',
      status: 'pending' as const,
      stage: language === 'ar' ? 'انتظار الحكم' : 'Awaiting Judgment',
      nextSession: undefined,
      lawyer: language === 'ar' ? 'أحمد محمود' : 'Ahmed Mahmoud',
      priority: 'low' as const,
      openDate: '2023-10-20',
      sessions: [],
      procedures: [],
    },
  ];

  const getStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'new': 'bg-neon/20 text-neon',
      'inProgress': 'bg-brand-primary/20 text-brand-primary',
      'pending': 'bg-gold/20 text-gold',
      'closed': 'bg-legal-success-500/20 text-legal-success-500',
    };
    return statusMap[status] || 'bg-muted text-muted-foreground';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: { ar: string; en: string } } = {
      'new': { ar: 'جديدة', en: 'New' },
      'inProgress': { ar: 'قيد الإجراء', en: 'In Progress' },
      'pending': { ar: 'معلقة', en: 'Pending' },
      'closed': { ar: 'مغلقة', en: 'Closed' },
    };
    return labels[status] ? labels[status][language === 'ar' ? 'ar' : 'en'] : status;
  };

  const getPriorityColor = (priority: string) => {
    const map: { [key: string]: string } = {
      high: 'bg-legal-danger-500/20 text-legal-danger-500',
      medium: 'bg-legal-warning-500/20 text-legal-warning-500',
      low: 'bg-legal-success-500/20 text-legal-success-500',
    };
    return map[priority] || 'bg-muted text-muted-foreground';
  };

  const getPriorityLabel = (priority: string) => {
    const labels: { [key: string]: { ar: string; en: string } } = {
      'high': { ar: 'عاجل', en: 'High' },
      'medium': { ar: 'متوسط', en: 'Medium' },
      'low': { ar: 'عادي', en: 'Low' },
    };
    return labels[priority] ? labels[priority][language === 'ar' ? 'ar' : 'en'] : priority;
  };

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
            <h1 className="text-3xl font-bold">{t('cases')}</h1>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'إدارة ومتابعة جميع القضايا' : 'Manage and track all cases'}
            </p>
          </div>
          <Button className="bg-gradient-to-r from-brand-primary to-exclusive text-white shadow-lg hover:opacity-90">
            <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {language === 'ar' ? 'قضية جديدة' : 'New Case'}
          </Button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 bg-gradient-to-r from-surface/50 to-card border-border/50">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute top-3 h-4 w-4 text-muted-foreground ltr:left-3 rtl:right-3" />
                <Input
                  placeholder={t('search') + '...'}
                  className="ltr:pl-9 rtl:pr-9 bg-background/50"
                />
              </div>
              <Button variant="outline">
                {t('filter')}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Cases Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {cases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="group p-6 transition-all hover:shadow-custom-lg hover:shadow-gold/10 bg-gradient-to-br from-card to-surface/50 border-border/50">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-sm font-mono text-muted-foreground">
                        {caseItem.caseNumber}
                      </span>
                      <Badge className={getPriorityColor(caseItem.priority)}>
                        {getPriorityLabel(caseItem.priority)}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{caseItem.title}</h3>
                  </div>
                  <Badge className={getStatusColor(caseItem.status)}>
                    {getStatusLabel(caseItem.status)}
                  </Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-neon" />
                    <div className="flex-1">
                      <p className="text-muted-foreground">{t('client')}</p>
                      <p className="font-medium text-foreground">{caseItem.client}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Scale className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                    <div className="flex-1">
                      <p className="text-muted-foreground">{t('court')}</p>
                      <p className="font-medium text-foreground">{caseItem.court}</p>
                    </div>
                  </div>

                  {caseItem.nextSession && (
                    <div className="flex items-start gap-2">
                      <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-exclusive" />
                      <div className="flex-1">
                        <p className="text-muted-foreground">{t('nextSession')}</p>
                        <p className="font-medium text-foreground">{caseItem.nextSession}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-brand-primary" />
                    <span className="text-muted-foreground">{t('lawyer')}:</span>
                    <span className="font-medium text-foreground">{caseItem.lawyer}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 border-t border-border/50 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 hover:bg-brand-primary/10 hover:text-brand-primary hover:border-brand-primary/30"
                    onClick={() => setSelectedCase(caseItem)}
                  >
                    <Eye className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                    {t('view')}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hover:bg-gold/10 hover:text-gold hover:border-gold/30"
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Case Detail Modal */}
      {selectedCase && (
        <CaseDetailCard
          caseData={selectedCase}
          open={!!selectedCase}
          onClose={() => setSelectedCase(null)}
        />
      )}
    </DashboardLayout>
  );
}
