import { motion } from 'framer-motion';
import { 
  Scale, User, Users, Building, Calendar, FileText, 
  Clock, AlertCircle, CheckCircle, XCircle, ExternalLink,
  Gavel
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface CaseData {
  id: string;
  caseNumber: string;
  title: string;
  client: string;
  opponent: string;
  court: string;
  status: 'new' | 'inProgress' | 'pending' | 'closed';
  stage: string;
  priority: 'high' | 'medium' | 'low';
  nextSession?: string;
  lawyer: string;
  openDate: string;
  description?: string;
  sessions?: { date: string; status: string; notes: string }[];
  procedures?: { date: string; title: string; type: string }[];
}

interface CaseDetailCardProps {
  caseData: CaseData;
  open: boolean;
  onClose: () => void;
}

export const CaseDetailCard = ({ caseData, open, onClose }: CaseDetailCardProps) => {
  const { t, direction } = useLanguage();

  const getStatusConfig = (status: string) => {
    const configs = {
      new: { color: 'bg-neon/20 text-neon', icon: AlertCircle, label: t('new') },
      inProgress: { color: 'bg-brand-primary/20 text-brand-primary', icon: Clock, label: t('inProgress') },
      pending: { color: 'bg-gold/20 text-gold', icon: Clock, label: t('pending') },
      closed: { color: 'bg-legal-success-500/20 text-legal-success-500', icon: CheckCircle, label: t('closed') },
    };
    return configs[status as keyof typeof configs] || configs.new;
  };

  const getPriorityConfig = (priority: string) => {
    const configs = {
      high: { color: 'bg-legal-danger-500/20 text-legal-danger-500', label: t('high') || 'عاجل' },
      medium: { color: 'bg-legal-warning-500/20 text-legal-warning-500', label: t('medium') || 'متوسط' },
      low: { color: 'bg-legal-success-500/20 text-legal-success-500', label: t('low') || 'عادي' },
    };
    return configs[priority as keyof typeof configs] || configs.medium;
  };

  const statusConfig = getStatusConfig(caseData.status);
  const priorityConfig = getPriorityConfig(caseData.priority);
  const StatusIcon = statusConfig.icon;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl border-border/50 bg-gradient-to-br from-card via-card to-surface p-0 overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-brand-primary/20 via-exclusive/10 to-brand-primary/20 p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-exclusive shadow-lg">
                <Scale className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-mono">{caseData.caseNumber}</p>
                <DialogTitle className="text-xl font-bold text-foreground mt-1">
                  {caseData.title}
                </DialogTitle>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <Badge className={cn('border-0', statusConfig.color)}>
                    <StatusIcon className="h-3 w-3 me-1" />
                    {statusConfig.label}
                  </Badge>
                  <Badge className={cn('border-0', priorityConfig.color)}>
                    {priorityConfig.label}
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content with Tabs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-6 overflow-y-auto"
        >
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview">{t('overview') || 'نظرة عامة'}</TabsTrigger>
              <TabsTrigger value="sessions">{t('sessions')}</TabsTrigger>
              <TabsTrigger value="procedures">{t('procedures')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Parties */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-neon/10 to-transparent border border-neon/20">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-neon" />
                    <span className="text-xs text-muted-foreground">{t('client')}</span>
                  </div>
                  <p className="font-semibold text-foreground">{caseData.client}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-legal-danger-500/10 to-transparent border border-legal-danger-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-legal-danger-500" />
                    <span className="text-xs text-muted-foreground">{t('opponent')}</span>
                  </div>
                  <p className="font-semibold text-foreground">{caseData.opponent}</p>
                </div>
              </motion.div>

              {/* Case Info */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface/50 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4 text-brand-primary" />
                    <span className="text-xs text-muted-foreground">{t('court')}</span>
                  </div>
                  <p className="font-semibold text-foreground">{caseData.court}</p>
                </div>
                <div className="p-4 rounded-xl bg-surface/50 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Gavel className="h-4 w-4 text-gold" />
                    <span className="text-xs text-muted-foreground">{t('lawyer')}</span>
                  </div>
                  <p className="font-semibold text-foreground">{caseData.lawyer}</p>
                </div>
              </motion.div>

              {/* Timeline Info */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface/50 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-exclusive" />
                    <span className="text-xs text-muted-foreground">{t('openDate') || 'تاريخ الفتح'}</span>
                  </div>
                  <p className="font-semibold text-foreground">{caseData.openDate}</p>
                </div>
                {caseData.nextSession && (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-gold/10 to-transparent border border-gold/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-gold" />
                      <span className="text-xs text-muted-foreground">{t('nextSession')}</span>
                    </div>
                    <p className="font-semibold text-foreground">{caseData.nextSession}</p>
                  </div>
                )}
              </motion.div>

              {/* Description */}
              {caseData.description && (
                <motion.div variants={itemVariants} className="p-4 rounded-xl bg-surface/50 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{t('description') || 'الوصف'}</span>
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">{caseData.description}</p>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="sessions" className="space-y-3">
              {caseData.sessions && caseData.sessions.length > 0 ? (
                caseData.sessions.map((session, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="p-4 rounded-xl bg-surface/50 border border-border/50 hover:bg-surface transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">{session.date}</span>
                      <Badge variant="outline">{session.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{session.notes}</p>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {t('noSessions') || 'لا توجد جلسات'}
                </div>
              )}
            </TabsContent>

            <TabsContent value="procedures" className="space-y-3">
              {caseData.procedures && caseData.procedures.length > 0 ? (
                caseData.procedures.map((procedure, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="p-4 rounded-xl bg-surface/50 border border-border/50 hover:bg-surface transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">{procedure.title}</span>
                      <Badge variant="outline">{procedure.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{procedure.date}</p>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {t('noProcedures') || 'لا توجد إجراءات'}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <motion.div variants={itemVariants} className="flex gap-3 mt-6 pt-4 border-t border-border/50">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              {t('close')}
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-brand-primary to-exclusive hover:opacity-90">
              <ExternalLink className="h-4 w-4 me-2" />
              {t('viewFull') || 'عرض كامل'}
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
