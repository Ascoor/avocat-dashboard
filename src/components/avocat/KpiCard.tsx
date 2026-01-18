import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  gradient?: string;
  delay?: number;
  className?: string;
}

export const KpiCard = ({
  icon: Icon,
  label,
  value,
  trend,
  trendUp = true,
  gradient = 'from-primary to-primary-glow',
  delay = 0,
  className,
}: KpiCardProps) => {
  const { direction } = useLanguage();
  const isRtl = direction === 'rtl';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group relative overflow-hidden rounded-2xl',
        'bg-card border border-border/50',
        'shadow-custom-md hover:shadow-custom-lg',
        'transition-all duration-300',
        'hover:-translate-y-1',
        className
      )}
    >
      {/* Background gradient on hover */}
      <div className={cn(
        'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500',
        'bg-gradient-to-br',
        gradient,
        'opacity-5 dark:opacity-10'
      )} />

      <div className="relative p-5">
        <div className={cn('flex items-start gap-4', isRtl && 'flex-row-reverse')}>
          {/* Icon container */}
          <div className={cn(
            'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl',
            'bg-gradient-to-br',
            gradient,
            'text-white shadow-lg',
            'transition-transform duration-300 group-hover:scale-110'
          )}>
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>

          {/* Content */}
          <div className={cn('flex-1 min-w-0', isRtl && 'text-right')}>
            <p className="text-sm font-medium text-muted-foreground truncate">
              {label}
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground tracking-tight">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {trend && (
              <p className={cn(
                'mt-1 text-xs font-medium',
                trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}>
                {trend}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className={cn(
        'absolute bottom-0 left-0 right-0 h-1',
        'bg-gradient-to-r',
        gradient,
        'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
      )} />
    </motion.div>
  );
};

export default KpiCard;
