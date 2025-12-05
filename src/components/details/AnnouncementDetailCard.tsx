import { motion } from 'framer-motion';
import { 
  Megaphone, Calendar, User, Users, Pin, 
  Bell, ExternalLink, Share2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface AnnouncementData {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  target: 'all' | 'lawyers' | 'staff' | 'department';
  targetName?: string;
  isPinned: boolean;
  priority: 'normal' | 'important' | 'urgent';
}

interface AnnouncementDetailCardProps {
  announcement: AnnouncementData;
  open: boolean;
  onClose: () => void;
}

export const AnnouncementDetailCard = ({ announcement, open, onClose }: AnnouncementDetailCardProps) => {
  const { t, direction } = useLanguage();

  const getPriorityConfig = (priority: string) => {
    const configs = {
      normal: { color: 'bg-muted text-muted-foreground', label: t('normal') || 'عادي' },
      important: { color: 'bg-gold/20 text-gold', label: t('important') || 'مهم' },
      urgent: { color: 'bg-legal-danger-500/20 text-legal-danger-500', label: t('urgent') || 'عاجل' },
    };
    return configs[priority as keyof typeof configs] || configs.normal;
  };

  const getTargetConfig = (target: string) => {
    const configs = {
      all: { icon: Users, label: t('allStaff') || 'الجميع' },
      lawyers: { icon: User, label: t('lawyers') },
      staff: { icon: Users, label: t('staff') || 'الموظفين' },
      department: { icon: Users, label: announcement.targetName || t('department') || 'القسم' },
    };
    return configs[target as keyof typeof configs] || configs.all;
  };

  const priorityConfig = getPriorityConfig(announcement.priority);
  const targetConfig = getTargetConfig(announcement.target);
  const TargetIcon = targetConfig.icon;

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
        <div className="relative bg-gradient-to-r from-gold/20 via-exclusive/10 to-gold/20 p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold to-exclusive shadow-lg">
                <Megaphone className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {announcement.isPinned && (
                    <Pin className="h-4 w-4 text-gold" />
                  )}
                  <Badge className={cn('border-0', priorityConfig.color)}>
                    {priorityConfig.label}
                  </Badge>
                </div>
                <DialogTitle className="text-xl font-bold text-foreground">
                  {announcement.title}
                </DialogTitle>
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
          {/* Meta Info */}
          <div className="grid grid-cols-3 gap-3">
            <motion.div 
              variants={itemVariants}
              className="p-3 rounded-xl bg-surface/50 border border-border/50 text-center"
            >
              <Calendar className="h-4 w-4 text-gold mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">{t('date') || 'التاريخ'}</p>
              <p className="text-sm font-semibold text-foreground">{announcement.date}</p>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              className="p-3 rounded-xl bg-surface/50 border border-border/50 text-center"
            >
              <User className="h-4 w-4 text-brand-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">{t('author') || 'الناشر'}</p>
              <p className="text-sm font-semibold text-foreground">{announcement.author}</p>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              className="p-3 rounded-xl bg-surface/50 border border-border/50 text-center"
            >
              <TargetIcon className="h-4 w-4 text-exclusive mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">{t('target') || 'الفئة'}</p>
              <p className="text-sm font-semibold text-foreground">{targetConfig.label}</p>
            </motion.div>
          </div>

          {/* Content */}
          <motion.div 
            variants={itemVariants}
            className="p-5 rounded-xl bg-gradient-to-br from-surface/80 to-surface/40 border border-border/50"
          >
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {announcement.content}
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div variants={itemVariants} className="flex gap-3 pt-4 border-t border-border/50">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              {t('close')}
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-gold to-exclusive hover:opacity-90">
              <Bell className="h-4 w-4 me-2" />
              {t('markRead') || 'تم القراءة'}
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
