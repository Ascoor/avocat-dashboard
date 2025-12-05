import { useMemo } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4';

const motionMap = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
} as const;

type GlowStyle = CSSProperties & {
  '--glow-intensity'?: number | string;
};

type SectionTitleProps<T extends HeadingTag = 'h2'> = HTMLMotionProps<T> & {
  as?: T;
  children: ReactNode;
  glowIntensity?: number | string;
  animateOnView?: boolean;
  textDir?: 'rtl' | 'ltr'; // ✅ اسم مختلف لتجنب التضارب مع attr dir
};

export const SectionTitle = <T extends HeadingTag = 'h2'>(props: SectionTitleProps<T>) => {
  const {
    as: componentTag = 'h2',
    animateOnView = true,
    className,
    children,
    glowIntensity,
    style,
    initial,
    whileInView,
    viewport,
    transition,
    textDir, // ✅ استخدمنا الاسم الجديد هنا
    ...rest
  } = props;

  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const MotionComponent = useMemo(() => motionMap[componentTag as HeadingTag], [componentTag]);

  const baseFont = isArabic ? 'font-arabic' : 'font-english';
  const baseTracking = isArabic ? 'tracking-[0.03em]' : 'tracking-[0.08em]';
  const baseSize = isArabic ? 'arabic-heading-lg' : 'text-3xl md:text-5xl';
  const baseAlignment = isArabic ? 'text-right' : 'text-left';
  const baseLeading = isArabic ? 'leading-[1.3]' : 'leading-tight';

  const resolvedStyle: GlowStyle = {
    ...(style as GlowStyle),
  };

  if (glowIntensity !== undefined) {
    resolvedStyle['--glow-intensity'] = glowIntensity;
  }

  const defaultInitial = {
    opacity: 0,
    x: isArabic ? -50 : 50,
    y: 30,
    scale: 0.97,
  };

  const defaultWhileInView = {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
  };

  const defaultViewport = { once: true, amount: 0.55 };
  const defaultTransition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  const direction = textDir ?? (isArabic ? 'ltr' : 'rtl'); // ✅ هذا هو المتغير المستخدم فعلاً

  const sizeClasses = isArabic
    ? 'text-2xl sm:text-3xl lg:text-4xl'
    : 'text-3xl sm:text-4xl lg:text-5xl';

  const trackingClass = isArabic ? 'tracking-[0.05em]' : 'tracking-[0.08em]';

  return (
    <MotionComponent
      dir={direction}
      initial={initial ?? (animateOnView ? defaultInitial : undefined)}
      whileInView={whileInView ?? (animateOnView ? defaultWhileInView : undefined)}
      viewport={viewport ?? (animateOnView ? defaultViewport : undefined)}
      transition={transition ?? (animateOnView ? defaultTransition : undefined)}
      className={cn(
        'section-title relative inline-flex w-fit items-center justify-center text-balance font-extrabold',
        sizeClasses,
        trackingClass,
        'text-[hsl(var(--title-color-light))] dark:text-[hsl(var(--title-color-dark))]',
        'drop-shadow-[0_0_18px_rgba(175,220,255,var(--glow-intensity))]',
        'after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-[2.5rem]',
        'after:bg-gradient-to-b after:from-transparent after:via-white/10 after:to-white/5',
        'dark:after:via-white/5 dark:after:to-white/0',
        'transition-all duration-700 ease-out',
        'hover:text-white hover:drop-shadow-[0_0_25px_rgba(175,220,255,0.8)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2',
        'focus-visible:ring-offset-background',
        baseFont,
        baseTracking,
        baseSize,
        baseAlignment,
        baseLeading,
        className,
      )}
      style={resolvedStyle}
      {...rest}
    >
      <span className="relative z-10">{children}</span>
    </MotionComponent>
  );
};

export default SectionTitle;
