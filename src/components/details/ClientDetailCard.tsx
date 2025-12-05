import { motion } from 'framer-motion';
import { 
  User, Phone, Mail, Briefcase, Calendar, MapPin, 
  FileText, Building2, X, ExternalLink
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface ClientData {
  id: string;
  name: string;
  type: 'individual' | 'company';
  phone: string;
  email: string;
  address?: string;
  nationalId?: string;
  casesCount: number;
  status: 'active' | 'inactive';
  joinDate: string;
  cases?: { id: string; title: string; status: string }[];
}

interface ClientDetailCardProps {
  client: ClientData;
  open: boolean;
  onClose: () => void;
}

export const ClientDetailCard = ({ client, open, onClose }: ClientDetailCardProps) => {
  const { t, direction } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-border/50 bg-gradient-to-br from-card via-card to-surface p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-brand-primary/20 via-gold/10 to-brand-primary/20 p-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-gold shadow-lg">
                {client.type === 'company' ? (
                  <Building2 className="h-8 w-8 text-white" />
                ) : (
                  <User className="h-8 w-8 text-white" />
                )}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-foreground">
                  {client.name}
                </DialogTitle>
                <div className="mt-1 flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      'border-0',
                      client.type === 'company' 
                        ? 'bg-exclusive/20 text-exclusive' 
                        : 'bg-neon/20 text-neon'
                    )}
                  >
                    {client.type === 'company' ? t('company') || 'شركة' : t('individual') || 'فرد'}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className={cn(
                      'border-0',
                      client.status === 'active' 
                        ? 'bg-legal-success-500/20 text-legal-success-500' 
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {client.status === 'active' ? t('active') || 'نشط' : t('inactive') || 'غير نشط'}
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
          className="p-6 pt-0 -mt-6"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <motion.div 
              variants={itemVariants}
              className="rounded-xl bg-gradient-to-br from-brand-primary/10 to-transparent p-4 border border-brand-primary/20"
            >
              <Briefcase className="h-5 w-5 text-brand-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">{client.casesCount}</p>
              <p className="text-xs text-muted-foreground">{t('cases')}</p>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              className="rounded-xl bg-gradient-to-br from-gold/10 to-transparent p-4 border border-gold/20"
            >
              <Calendar className="h-5 w-5 text-gold mb-2" />
              <p className="text-sm font-semibold text-foreground">{client.joinDate}</p>
              <p className="text-xs text-muted-foreground">{t('joinDate') || 'تاريخ الانضمام'}</p>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              className="rounded-xl bg-gradient-to-br from-neon/10 to-transparent p-4 border border-neon/20"
            >
              <FileText className="h-5 w-5 text-neon mb-2" />
              <p className="text-sm font-semibold text-foreground">{client.nationalId || '—'}</p>
              <p className="text-xs text-muted-foreground">{t('nationalId') || 'الهوية'}</p>
            </motion.div>
          </div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-3 mb-6">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {t('contactInfo') || 'معلومات الاتصال'}
            </h4>
            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 border border-border/50">
                <Phone className="h-4 w-4 text-brand-primary" />
                <span className="text-foreground" dir="ltr">{client.phone}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 border border-border/50">
                <Mail className="h-4 w-4 text-gold" />
                <span className="text-foreground">{client.email}</span>
              </div>
              {client.address && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 border border-border/50">
                  <MapPin className="h-4 w-4 text-neon" />
                  <span className="text-foreground">{client.address}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Related Cases */}
          {client.cases && client.cases.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {t('relatedCases') || 'القضايا المرتبطة'}
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {client.cases.map((caseItem) => (
                  <div 
                    key={caseItem.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface/50 border border-border/50 hover:bg-surface transition-colors"
                  >
                    <span className="text-sm text-foreground">{caseItem.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {caseItem.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div variants={itemVariants} className="flex gap-3 mt-6 pt-4 border-t border-border/50">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              {t('close')}
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-brand-primary to-gold hover:opacity-90">
              <ExternalLink className="h-4 w-4 me-2" />
              {t('viewProfile') || 'عرض الملف'}
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
