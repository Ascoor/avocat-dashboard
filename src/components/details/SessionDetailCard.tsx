import { motion } from 'framer-motion';
import { 
  Calendar, Clock, Building, Scale, User, MapPin,
  FileText, CheckCircle, XCircle, AlertCircle, ExternalLink
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface SessionData {
  id: string;
  date: string;
  time: string;
  caseNumber: string;
  caseTitle: string;
  court: string;
  courtRoom?: string;
  lawyer: string;
  status: 'scheduled' | 'completed' | 'adjourned' | 'cancelled';
  result?: string;
  nextDate?: string;
  notes?: string;
}

interface SessionDetailCardProps {
  session: SessionData;
  open: boolean;
  onClose: () => void;
}

export const SessionDetailCard = ({ session, open, onClose }: SessionDetailCardProps) => {
  const { t, direction } = useLanguage();

  const getStatusConfig = (status: string) => {
    const configs = {
      scheduled: { color: 'bg-brand-primary/20 text-brand-primary', icon: Clock, label: t('scheduled') || 'مجدولة' },
      completed: { color: 'bg-legal-success-500/20 text-legal-success-500', icon: CheckCircle, label: t('completed') || 'مكتملة' },
      adjourned: { color: 'bg-gold/20 text-gold', icon: AlertCircle, label: t('adjourned') || 'مؤجلة' },
      cancelled: { color: 'bg-legal-danger-500/20 text-legal-danger-500', icon: XCircle, label: t('cancelled') || 'ملغاة' },
    };
    return configs[status as keyof typeof configs] || configs.scheduled;
  };

  const statusConfig = getStatusConfig(session.status);
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
        <div className="relative bg-gradient-to-r from-gold/20 via-brand-primary/10 to-gold/20 p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold to-brand-primary shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('session') || 'جلسة'}</p>
                <DialogTitle className="text-xl font-bold text-foreground mt-1">
                  {session.date}
                </DialogTitle>
                <div className="mt-2 flex items-center gap-2">
                  <Badge className={cn('border-0', statusConfig.color)}>
                    <StatusIcon className="h-3 w-3 me-1" />
                    {statusConfig.label}
                  </Badge>
                  <Badge variant="outline" className="font-mono">
                    {session.time}
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
            <p className="font-mono text-sm text-muted-foreground">{session.caseNumber}</p>
            <p className="font-semibold text-foreground">{session.caseTitle}</p>
          </motion.div>

          {/* Court & Lawyer */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              variants={itemVariants}
              className="p-4 rounded-xl bg-surface/50 border border-border/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4 text-gold" />
                <span className="text-xs text-muted-foreground">{t('court')}</span>
              </div>
              <p className="font-semibold text-foreground">{session.court}</p>
              {session.courtRoom && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {session.courtRoom}
                </p>
              )}
            </motion.div>
            <motion.div 
              variants={itemVariants}
              className="p-4 rounded-xl bg-surface/50 border border-border/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-exclusive" />
                <span className="text-xs text-muted-foreground">{t('lawyer')}</span>
              </div>
              <p className="font-semibold text-foreground">{session.lawyer}</p>
            </motion.div>
          </div>

          {/* Result */}
          {session.result && (
            <motion.div 
              variants={itemVariants}
              className="p-4 rounded-xl bg-gradient-to-br from-legal-success-500/10 to-transparent border border-legal-success-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-legal-success-500" />
                <span className="text-xs text-muted-foreground">{t('result') || 'النتيجة'}</span>
              </div>
              <p className="text-foreground">{session.result}</p>
            </motion.div>
          )}

          {/* Next Date */}
          {session.nextDate && (
            <motion.div 
              variants={itemVariants}
              className="p-4 rounded-xl bg-gradient-to-br from-gold/10 to-transparent border border-gold/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-gold" />
                <span className="text-xs text-muted-foreground">{t('nextSession')}</span>
              </div>
              <p className="font-semibold text-foreground">{session.nextDate}</p>
            </motion.div>
          )}

          {/* Notes */}
          {session.notes && (
            <motion.div 
              variants={itemVariants}
              className="p-4 rounded-xl bg-surface/50 border border-border/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{t('notes') || 'ملاحظات'}</span>
              </div>
              <p className="text-foreground text-sm">{session.notes}</p>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div variants={itemVariants} className="flex gap-3 pt-4 border-t border-border/50">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              {t('close')}
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-gold to-brand-primary hover:opacity-90">
              <ExternalLink className="h-4 w-4 me-2" />
              {t('viewCase') || 'عرض القضية'}
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
