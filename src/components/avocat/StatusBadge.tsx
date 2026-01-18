import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

type StatusType = 
  | 'active' | 'pending' | 'closed' | 'on-hold' | 'urgent'
  | 'todo' | 'in-progress' | 'done' | 'overdue'
  | 'draft' | 'sent' | 'paid'
  | 'high' | 'medium' | 'low'
  | 'confidential' | 'internal' | 'client-ready'
  | 'admin' | 'partner' | 'associate' | 'paralegal' | 'client-viewer';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; labelAr: string; className: string }> = {
  // Case statuses
  active: { label: 'Active', labelAr: 'نشطة', className: 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30' },
  pending: { label: 'Pending', labelAr: 'معلقة', className: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30' },
  closed: { label: 'Closed', labelAr: 'مغلقة', className: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30' },
  'on-hold': { label: 'On Hold', labelAr: 'موقوفة', className: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30' },
  urgent: { label: 'Urgent', labelAr: 'عاجلة', className: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30 animate-pulse' },
  
  // Task statuses
  todo: { label: 'To Do', labelAr: 'للتنفيذ', className: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30' },
  'in-progress': { label: 'In Progress', labelAr: 'قيد التنفيذ', className: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30' },
  done: { label: 'Done', labelAr: 'منجزة', className: 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30' },
  overdue: { label: 'Overdue', labelAr: 'متأخرة', className: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30' },
  
  // Invoice statuses
  draft: { label: 'Draft', labelAr: 'مسودة', className: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30' },
  sent: { label: 'Sent', labelAr: 'مرسلة', className: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30' },
  paid: { label: 'Paid', labelAr: 'مدفوعة', className: 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30' },
  
  // Priority
  high: { label: 'High', labelAr: 'عالية', className: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30' },
  medium: { label: 'Medium', labelAr: 'متوسطة', className: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30' },
  low: { label: 'Low', labelAr: 'منخفضة', className: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30' },
  
  // Security levels
  confidential: { label: 'Confidential', labelAr: 'سري', className: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30' },
  internal: { label: 'Internal', labelAr: 'داخلي', className: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30' },
  'client-ready': { label: 'Client Ready', labelAr: 'جاهز للعميل', className: 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30' },
  
  // Roles
  admin: { label: 'Admin', labelAr: 'مدير', className: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30' },
  partner: { label: 'Partner', labelAr: 'شريك', className: 'bg-gold/15 text-gold-muted dark:text-gold border-gold/30' },
  associate: { label: 'Associate', labelAr: 'محامي', className: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30' },
  paralegal: { label: 'Paralegal', labelAr: 'مساعد قانوني', className: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30' },
  'client-viewer': { label: 'Client Viewer', labelAr: 'عارض العميل', className: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30' },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export const StatusBadge = ({ status, size = 'md', className }: StatusBadgeProps) => {
  const { language } = useLanguage();
  const config = statusConfig[status];
  
  if (!config) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-full border',
        'transition-colors duration-200',
        config.className,
        sizeClasses[size],
        className
      )}
    >
      {language === 'ar' ? config.labelAr : config.label}
    </span>
  );
};

export default StatusBadge;
