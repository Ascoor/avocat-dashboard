import { motion } from 'framer-motion';
import { 
  FileText, Calendar, User, Scale, Clock, 
  CheckCircle, AlertCircle, FileCheck, ExternalLink
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface ProcedureData {
  id: string;
  title: string;
  type: 'motion' | 'memo' | 'request' | 'appeal' | 'document';
  caseNumber: string;
  caseTitle: string;
  date: string;
  deadline?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  lawyer: string;
  description?: string;
  attachments?: string[];
}

interface ProcedureDetailCardProps {
  procedure: ProcedureData;
  open: boolean;
  onClose: () => void;
}

export const ProcedureDetailCard = ({ procedure, open, onClose }: ProcedureDetailCardProps) => {
  const { t, direction } = useLanguage();

  const getTypeConfig = (type: string) => {
    const configs = {
      motion: { color: 'bg-brand-primary/20 text-brand-primary', label: t('motion') || 'طلب' },
      memo: { color: 'bg-gold/20 text-gold', label: t('memo') || 'مذكرة' },
      request: { color: 'bg-neon/20 text-neon', label: t('request') || 'التماس' },
      appeal: { color: 'bg-exclusive/20 text-exclusive', label: t('appeal') || 'استئناف' },
      document: { color: 'bg-muted text-muted-foreground', label: t('document') || 'مستند' },
    };
    return configs[type as keyof typeof configs] || configs.document;
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      draft: { color: 'bg-muted text-muted-foreground', icon: FileText, label: t('draft') || 'مسودة' },
      submitted: { color: 'bg-brand-primary/20 text-brand-primary', icon: Clock, label: t('submitted') || 'مقدم' },
      approved: { color: 'bg-legal-success-500/20 text-legal-success-500', icon: CheckCircle, label: t('approved') || 'موافق' },
      rejected: { color: 'bg-legal-danger-500/20 text-legal-danger-500', icon: AlertCircle, label: t('rejected') || 'مرفوض' },
    };
    return configs[status as keyof typeof configs] || configs.draft;
  };

  const typeConfig = getTypeConfig(procedure.type);
  const statusConfig = getStatusConfig(procedure.status);
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
      <DialogContent className="max-w-xl border-border/50 bg-gradient-to-br from-card via-card to-surface p-0 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-exclusive/20 via-neon/10 to-exclusive/20 p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-exclusive to-neon shadow-lg">
                <FileCheck className="h-8 w-8 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-foreground">
                  {procedure.title}
                </DialogTitle>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <Badge className={cn('border-0', typeConfig.color)}>
                    {typeConfig.label}
                  </Badge>
                  <Badge className={cn('border-0', statusConfig.color)}>
                    <StatusIcon className="h-3 w-3 me-1" />
                    {statusConfig.label}
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-6 space-y-4"
        >
          {/* Case Info */}
          <motion.div 
            variants={itemVariants}
            className="p-4 rounded-xl bg-gradient-to-br from-brand-primary/10 to-transparent border border-brand-primary/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <Scale className="h-4 w-4 text-brand-primary" />
              <span className="text-xs text-muted-foreground">{t('case') || 'القضية'}</span>
            </div>
            <p className="font-mono text-sm text-muted-foreground">{procedure.caseNumber}</p>
            <p className="font-semibold text-foreground">{procedure.caseTitle}</p>
          </motion.div>

          {/* Dates & Lawyer */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              variants={itemVariants}
              className="p-4 rounded-xl bg-surface/50 border border-border/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-gold" />
                <span className="text-xs text-muted-foreground">{t('date') || 'التاريخ'}</span>
              </div>
              <p className="font-semibold text-foreground">{procedure.date}</p>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              className="p-4 rounded-xl bg-surface/50 border border-border/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-exclusive" />
                <span className="text-xs text-muted-foreground">{t('lawyer')}</span>
              </div>
              <p className="font-semibold text-foreground">{procedure.lawyer}</p>
            </motion.div>
          </div>

          {/* Deadline */}
          {procedure.deadline && (
            <motion.div 
              variants={itemVariants}
              className="p-4 rounded-xl bg-gradient-to-br from-legal-warning-500/10 to-transparent border border-legal-warning-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-legal-warning-500" />
                <span className="text-xs text-muted-foreground">{t('deadline') || 'الموعد النهائي'}</span>
              </div>
              <p className="font-semibold text-foreground">{procedure.deadline}</p>
            </motion.div>
          )}

          {/* Description */}
          {procedure.description && (
            <motion.div 
              variants={itemVariants}
              className="p-4 rounded-xl bg-surface/50 border border-border/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{t('description') || 'الوصف'}</span>
              </div>
              <p className="text-foreground text-sm leading-relaxed">{procedure.description}</p>
            </motion.div>
          )}

          {/* Attachments */}
          {procedure.attachments && procedure.attachments.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">
                {t('attachments') || 'المرفقات'}
              </h4>
              <div className="space-y-2">
                {procedure.attachments.map((attachment, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 border border-border/50 hover:bg-surface transition-colors cursor-pointer"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{attachment}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div variants={itemVariants} className="flex gap-3 pt-4 border-t border-border/50">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              {t('close')}
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-exclusive to-neon hover:opacity-90">
              <ExternalLink className="h-4 w-4 me-2" />
              {t('viewCase') || 'عرض القضية'}
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
