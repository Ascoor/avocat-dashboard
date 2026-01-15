import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export interface CaseSectionProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  toggleLabel?: string;
}

const CaseSection = ({
  icon: Icon,
  title,
  subtitle,
  actions,
  children,
  className,
  contentClassName,
  open = true,
  onOpenChange,
}: CaseSectionProps) => {
  const isControlled = typeof onOpenChange === 'function';
  const [internalOpen, setInternalOpen] = useState(open);
  const { isRTL } = useLanguage();

  useEffect(() => {
    if (!isControlled) setInternalOpen(open);
  }, [open, isControlled]);

  const isOpen = isControlled ? open : internalOpen;
  const ToggleIcon = isOpen ? ChevronDown : isRTL ? ChevronLeft : ChevronRight;

  const handleToggle = () => {
    const next = !isOpen;
    if (isControlled) onOpenChange?.(next);
    else setInternalOpen(next);
  };

  return (
    <section
      dir={isRTL ? 'rtl' : 'ltr'}
      className={cn(
        'relative overflow-hidden rounded-3xl border border-border/70 bg-card/60 p-6 shadow-card backdrop-blur',
        className
      )}
    >
      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top,_var(var(--gradient-primary)))] from-primary/10 via-transparent to-transparent opacity-70" />

      {/* Header */}
      <div className="relative flex flex-col gap-4">
        <div className="flex flex-col gap-4 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {/* Arrow toggle before icon */}
            <button
              type="button"
              onClick={handleToggle}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-surface-highlight/70 text-muted-foreground transition hover:text-primary"
              aria-label={isOpen ? 'Collapse section' : 'Expand section'}
            >
              <ToggleIcon className="h-5 w-5" />
            </button>

            {/* Section icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 text-primary">
              <Icon className="h-5 w-5" />
            </div>

            {/* Title & subtitle */}
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>

          {/* Right-side actions */}
          <div className="flex items-center gap-3">{actions}</div>
        </div>

        {/* Collapsible content */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="case-section-content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className={cn('mt-1 space-y-4', contentClassName)}>{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CaseSection;
