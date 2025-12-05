import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, easeOut } from 'framer-motion';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/SectionTitle';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';
import type { Locale } from '@/types/website';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Loader2,
  Cpu,
  PlayCircle,
} from 'lucide-react';
import { smoothScrollToElement } from '@/utils/smoothScroll';
import { resolveAssetUrl } from '@/utils/asset';
import { cn } from '@/lib/utils';
import SilkBackground from './components/SilkBackground'; 
interface HeroSlide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  bullets: string[];
  image?: string;
  overlay: string;
}

const overlayClasses = [
  'bg-gradient-to-b from-black/80 via-slate-900/60 to-transparent',
  'bg-gradient-to-b from-black/75 via-slate-900/55 to-transparent',
  'bg-gradient-to-b from-black/85 via-slate-900/55 to-transparent',
];

const HeroCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const { language } = useLanguage();
  const locale = language as Locale;
  const isArabic = locale === 'ar';
  const { loading, contentBlocks, getLocalizedValue, getValueForLocale } = useWebsiteContent('hero');

  // 🧭 استخراج الشرائح من CMS
  const slideNumbers = useMemo(() => {
    const ids = new Set<number>();
    contentBlocks.forEach((block) => {
      const match = block.key.match(/^hero_slide_(\d+)_/);
      if (match) ids.add(Number(match[1]));
    });
    return Array.from(ids).sort((a, b) => a - b);
  }, [contentBlocks]);

  const slides: HeroSlide[] = useMemo(() => {
    return slideNumbers.map((id, index) => {
      const localizedImage = getLocalizedValue<string>(`hero_slide_${id}_image`);
      const localizedBullets = getLocalizedValue<string[]>(`hero_slide_${id}_bullets`);
      const image = resolveAssetUrl(localizedImage[locale] ?? localizedImage.en ?? undefined);
      const bullets = (localizedBullets[locale] ?? localizedBullets.en ?? []).filter(Boolean);

      return {
        id,
        badge: getValueForLocale(`hero_slide_${id}_badge`, locale, '') ?? '',
        title: getValueForLocale(`hero_slide_${id}_title`, locale, '') ?? '',
        subtitle: getValueForLocale(`hero_slide_${id}_subtitle`, locale, '') ?? '',
        bullets,
        image,
        overlay: overlayClasses[index % overlayClasses.length],
      };
    });
  }, [slideNumbers, locale, getLocalizedValue, getValueForLocale]);

  // ⏱️ التشغيل التلقائي
  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 7000);
    return () => clearInterval(timer);
  }, [autoPlay, slides.length]);

  // 🌀 حالات التحميل
  if (loading && !slides.length)
    return (
      <section id="home" className="relative h-[90vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </section>
    );

  if (!slides.length)
    return (
      <section id="home" className="relative h-[90vh] flex items-center justify-center text-muted-foreground">
        <p>{isArabic ? 'لم يتم العثور على بيانات الشرائح بعد.' : 'No hero slides found yet.'}</p>
      </section>
    );

  const active = slides[current];

  // 🎬 أنيميشن النصوص (Staggered fade + slide)
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: easeOut, // ✅ إصلاح الـ TypeScript error هنا
      },
    }),
  };

  return (
    <section
      id="home"
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative h-[90vh] min-h-[560px] overflow-hidden bg-black sm:min-h-[620px]"
    >
      <SilkBackground
        className="absolute inset-0 -z-10 pointer-events-none opacity-70"
        speed={3.2}
        scale={1.4}
        rotation={0.35}
      />
      {/* الخلفية */}
      <AnimatePresence mode="wait">
        {slides.map(
          (s, i) =>
            i === current && (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 1.2, ease: easeOut }}
                className="absolute inset-0"
              >
                {s.image && (
                  <motion.div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${s.image})` }}
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 6, ease: easeOut }}
                  />
                )}
                <div className={`absolute inset-0 ${s.overlay}`} />
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* المحتوى */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
          <motion.div
            key={active.id}
            initial="hidden"
            animate="visible"
            className="w-full max-w-4xl rounded-3xl bg-slate-950/60 p-6 shadow-ambient backdrop-blur sm:p-8 lg:p-12 dark:bg-background/70"
          >
            {/* البادج */}
            {active.badge && (
              <motion.div
                variants={textVariants}
                custom={0}
                className={cn(
                  'mb-6 inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-4 py-2 font-semibold text-white/90 shadow-inner backdrop-blur',
                  isArabic
                    ? 'arabic-eyebrow font-arabic'
                    : 'text-xs uppercase tracking-[0.3em] font-english',
                )}
              >
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="leading-none">{active.badge}</span>
              </motion.div>
            )}

            {/* العنوان */}
            <SectionTitle
              as="h1"
              variants={textVariants}
              custom={1}
              dir={isArabic ? 'rtl' : 'ltr'}
              animateOnView={false}
              glowIntensity={0.85}
              className={cn(
                'max-w-3xl font-display text-balance text-[hsl(var(--title-color-dark))] dark:text-[hsl(var(--title-color-dark))]',
                isArabic
                  ? 'text-3xl sm:text-4xl xl:text-5xl'
                  : 'text-4xl md:text-5xl xl:text-6xl',
                isArabic ? 'text-right' : 'text-left'
              )}
            >
              {active.title}
            </SectionTitle>


            <motion.p
              variants={textVariants}
              custom={2}
              className={cn(
                'mt-4 text-white/85 leading-relaxed',
                isArabic ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
              )}
            >
              {active.subtitle}
            </motion.p>

            {/* النقاط */}
            <motion.ul
              className={cn(
                'mt-6 space-y-3 text-white/85',
                isArabic ? 'text-sm sm:text-base' : 'text-base'
              )}
              initial="hidden"
              animate="visible"
            >
              {active.bullets.map((b, i) => (
                <motion.li

                  key={b}
                  variants={textVariants}
                  custom={i + 3}
                  className="flex items-start gap-3 leading-relaxed"
                >
                  <ShieldCheck className="mt-1 h-5 w-5 text-accent flex-shrink-0" />
                  <span>{b}</span>
                </motion.li>
              ))}
            </motion.ul>

            {/* الأزرار */}
            <motion.div
              dir={isArabic ? 'ltr' : 'rtl'}
              variants={textVariants}
              custom={active.bullets.length + 4}
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Button
                onClick={() => smoothScrollToElement(document.querySelector('#demo')!)}
                variant="accent"
                className={cn(
                  'btn-primary flex items-center justify-center gap-2 px-8 py-3 font-semibold text-white',
                  isArabic ? 'text-sm sm:text-base' : 'text-base'
                )}
              >
                <PlayCircle className="h-5 w-5" />
                <span>{isArabic ? 'ابدأ رقمنة مكتبك' : 'Start Your Digital Transformation'}</span>
              </Button>

              <Button
                onClick={() => smoothScrollToElement(document.querySelector('#contact')!)}
                variant="hero"
                className={cn(
                  'btn-glass flex items-center justify-center gap-2 border-white/40 px-8 py-3 font-semibold text-white',
                  isArabic ? 'text-sm sm:text-base' : 'text-base'
                )}
              >
                <Cpu className="h-5 w-5" />
                <span>{isArabic ? 'تعرّف على الأنظمة' : 'Explore Our Systems'}</span>
              </Button>
            </motion.div>
          </motion.div>
      </div>

      {/* عناصر التحكم */}
      <div
        dir={isArabic ? 'rtl' : 'ltr'}
        className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center gap-4"
      >
        {/* زر السابق */}
        <button
          onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white hover:bg-black/60 transition"
          aria-label={isArabic ? 'الشريحة السابقة' : 'Previous slide'}
        >
          {isArabic ? (
            <ChevronRight className="h-5 w-5" /> // ← بالعربي الزر العكسي
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>

        {/* النقاط (المؤشرات) */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* زر التالي */}
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white hover:bg-black/60 transition"
          aria-label={isArabic ? 'الشريحة التالية' : 'Next slide'}
        >
          {isArabic ? (
            <ChevronLeft className="h-5 w-5" /> // ← بالعربي السهم العكسي
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>

        <button
          onClick={() => setAutoPlay((p) => !p)}
          className="ml-4 rounded-full border border-white/30 bg-black/30 px-4 py-1 text-xs uppercase text-white/70 hover:text-white transition"
        >
          {autoPlay ? 'Pause' : 'Play'}
        </button>
      </div>
    </section>
  );
};

export default HeroCarousel;
