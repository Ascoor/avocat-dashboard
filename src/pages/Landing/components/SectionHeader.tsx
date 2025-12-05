import { memo, type ReactNode } from 'react';
import { motion, cubicBezier } from 'framer-motion';

import SectionTitle from '@/components/SectionTitle';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface SectionHeaderProps {
  badge?: string | null;
  title: string | null;
  subtitle?: string | null;
  align?: 'left' | 'center' | 'right';
  eyebrowIcon?: ReactNode;
}

const premiumEase = cubicBezier(0.22, 1, 0.36, 1);

const badgeMotion = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: premiumEase } },
};

const subtitleMotion = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: premiumEase,
      delay: 0.1,
    },
  },
};

const alignClasses: Record<'left' | 'center' | 'right', string> = {
  left: 'text-left',
  center: 'text-center mx-auto',
  right: 'text-right ml-auto',
};

const SectionHeader: React.FC<SectionHeaderProps> = memo(({ badge, title, subtitle, align = 'center', eyebrowIcon }) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  if (!title && !badge && !subtitle) {
    return null;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      dir={isArabic ? 'rtl' : 'ltr'}
      className={cn(
        'section-header-frame max-w-3xl space-y-4',
        alignClasses[align],
        isArabic ? 'font-arabic' : 'font-english',
      )}
    >
      {badge ? (
        <motion.div
          variants={badgeMotion}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/90 px-5 py-2 text-xs font-semibold uppercase text-muted-foreground shadow-inner-glow backdrop-blur-sm dark:border-border/40 dark:bg-background/40 dark:text-foreground/80',
            isArabic ? 'tracking-[0.2em]' : 'tracking-[0.35em]',
            align === 'center' ? 'justify-center' : 'justify-start',
          )}
        >
          {eyebrowIcon ? <span className="text-primary dark:text-primary-light">{eyebrowIcon}</span> : null}
          <span>{badge}</span>
        </motion.div>
      ) : null}

      {title ? (
        <SectionTitle
          className={cn(
            'font-display',
            align === 'center' && 'mx-auto',
            align === 'right' && 'ml-auto',
            isArabic ? 'text-right' : undefined,
          )}
        >
          {title}
        </SectionTitle>
      ) : null}

      {subtitle ? (
        <motion.p
          variants={subtitleMotion}
          className={cn(
            'leading-relaxed text-muted-foreground/90 dark:text-muted-foreground/75',
            isArabic ? 'text-base sm:text-lg' : 'text-lg md:text-xl',
          )}
        >
          {subtitle}
        </motion.p>
      ) : null}
    </motion.div>
  );
});

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;
