import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Search, Plus, Eye, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Cases() {
  const { t, language } = useLanguage();

  const cases = [
    {
      id: 1,
      caseNumber: 'C-2024-0145',
      title: language === 'ar' ? 'نزاع عقد تجاري' : 'Commercial Contract Dispute',
      client: language === 'ar' ? 'شركة النور للتجارة' : 'Al-Nour Trading Company',
      opponent: language === 'ar' ? 'شركة الأمل' : 'Al-Amal Company',
      court: language === 'ar' ? 'المحكمة التجارية - الدائرة الأولى' : 'Commercial Court - First Circuit',
      status: language === 'ar' ? 'قيد الإجراء' : 'In Progress',
      stage: language === 'ar' ? 'مرحلة المرافعة' : 'Pleading Stage',
      nextSession: '2024-01-20',
      lawyer: language === 'ar' ? 'أحمد محمود' : 'Ahmed Mahmoud',
      priority: 'high',
    },
    {
      id: 2,
      caseNumber: 'C-2024-0098',
      title: language === 'ar' ? 'قضية عمالية' : 'Labor Dispute',
      client: language === 'ar' ? 'محمد أحمد' : 'Mohamed Ahmed',
      opponent: language === 'ar' ? 'شركة البناء الحديثة' : 'Modern Construction Co.',
      court: language === 'ar' ? 'محكمة العمل' : 'Labor Court',
      status: language === 'ar' ? 'جديدة' : 'New',
      stage: language === 'ar' ? 'تحقيقات أولية' : 'Initial Investigation',
      nextSession: '2024-01-18',
      lawyer: language === 'ar' ? 'سارة علي' : 'Sarah Ali',
      priority: 'medium',
    },
    {
      id: 3,
      caseNumber: 'C-2024-0234',
      title: language === 'ar' ? 'استئناف حكم مدني' : 'Civil Judgment Appeal',
      client: language === 'ar' ? 'فاطمة خالد' : 'Fatima Khaled',
      opponent: language === 'ar' ? 'بنك الوطني' : 'National Bank',
      court: language === 'ar' ? 'محكمة الاستئناف' : 'Court of Appeal',
      status: language === 'ar' ? 'قيد الإجراء' : 'In Progress',
      stage: language === 'ar' ? 'استئناف' : 'Appeal',
      nextSession: '2024-02-05',
      lawyer: language === 'ar' ? 'محمد حسن' : 'Mohamed Hassan',
      priority: 'high',
    },
    {
      id: 4,
      caseNumber: 'C-2024-0067',
      title: language === 'ar' ? 'قضية إيجارات' : 'Rental Dispute',
      client: language === 'ar' ? 'عبدالله سالم' : 'Abdullah Salem',
      opponent: language === 'ar' ? 'علي عمر' : 'Ali Omar',
      court: language === 'ar' ? 'المحكمة الجزئية' : 'Partial Court',
      status: language === 'ar' ? 'معلقة' : 'Pending',
      stage: language === 'ar' ? 'انتظار الحكم' : 'Awaiting Judgment',
      nextSession: null,
      lawyer: language === 'ar' ? 'أحمد محمود' : 'Ahmed Mahmoud',
      priority: 'low',
    },
  ];

  const getStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'جديدة': 'bg-blue-500/10 text-blue-500',
      'New': 'bg-blue-500/10 text-blue-500',
      'قيد الإجراء': 'bg-accent/10 text-accent',
      'In Progress': 'bg-accent/10 text-accent',
      'معلقة': 'bg-orange-500/10 text-orange-500',
      'Pending': 'bg-orange-500/10 text-orange-500',
      'مغلقة': 'bg-green-500/10 text-green-500',
      'Closed': 'bg-green-500/10 text-green-500',
    };
    return statusMap[status] || 'bg-gray-500/10 text-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const map: { [key: string]: string } = {
      high: 'bg-red-500/10 text-red-500',
      medium: 'bg-yellow-500/10 text-yellow-500',
      low: 'bg-green-500/10 text-green-500',
    };
    return map[priority] || 'bg-gray-500/10 text-gray-500';
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
          <Button className="bg-accent text-accent-foreground shadow-gold hover:shadow-xl">
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
          <Card className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute top-3 h-4 w-4 text-muted-foreground ltr:left-3 rtl:right-3" />
                <Input
                  placeholder={t('search') + '...'}
                  className="ltr:pl-9 rtl:pr-9"
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
              <Card className="group p-6 transition-all hover:shadow-custom-lg hover:shadow-gold/10">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-sm font-mono text-muted-foreground">
                        {caseItem.caseNumber}
                      </span>
                      <Badge className={getPriorityColor(caseItem.priority)}>
                        {caseItem.priority}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold">{caseItem.title}</h3>
                  </div>
                  <Badge className={getStatusColor(caseItem.status)}>
                    {caseItem.status}
                  </Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-muted-foreground">{t('client')}</p>
                      <p className="font-medium">{caseItem.client}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-muted-foreground">⚖️</span>
                    <div className="flex-1">
                      <p className="text-muted-foreground">{t('court')}</p>
                      <p className="font-medium">{caseItem.court}</p>
                    </div>
                  </div>

                  {caseItem.nextSession && (
                    <div className="flex items-start gap-2">
                      <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-muted-foreground">{t('nextSession')}</p>
                        <p className="font-medium">{caseItem.nextSession}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{t('lawyer')}:</span>
                    <span className="font-medium">{caseItem.lawyer}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 border-t border-border/50 pt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                    {t('view')}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
