import React, { useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';
import { Play, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { smoothScrollToElement } from '@/utils/smoothScroll';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const CallToAction: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const isArabic = language === 'ar';
  const locale = language as 'ar' | 'en';
  const { getLocalizedValue, getValueForLocale } = useWebsiteContent('cta');

  const getString = useCallback(
    (key: string, fallback = ''): string => getValueForLocale(key, locale, fallback),
    [getValueForLocale, locale]
  );

  const features = useMemo(() => {
    const localized = getLocalizedValue<string[]>('cta_features', { ar: [], en: [] });
    return (localized[locale] ?? localized.en ?? []).filter(Boolean);
  }, [getLocalizedValue, locale]);

  const clients = useMemo(() => {
    const localized = getLocalizedValue<string[]>('cta_clients', { ar: [], en: [] });
    return (localized[locale] ?? localized.en ?? []).filter(Boolean);
  }, [getLocalizedValue, locale]);

  const primaryLabel = getString('cta_primary_label');
  const secondaryLabel = getString('cta_secondary_label');
  const title = getString('cta_title');
  const subtitle = getString('cta_subtitle');
  const trustNote = getString('cta_trust_note');
  const bottomNote = getString('cta_bottom_note');

  const scrollToSection = (selector: string) => {
    const element = document.querySelector<HTMLElement>(selector);
    if (element) {
      smoothScrollToElement(element, { offset: 90, duration: 950 });
    }
  };

  return (
<section
  id="cta"
  className="relative overflow-hidden py-28 bg-cta-light dark:bg-cta-dark transition-colors duration-700"
>
  {/* Overlay تأثير شفاف */}
  <div className="absolute inset-0 bg-[url('/textures/diagonal-lines.svg')] opacity-[0.04] mix-blend-overlay dark:opacity-[0.08]" />
 <div className="absolute inset-0 bg-[url('/textures/diagonal-lines.svg')] opacity-[0.05] mix-blend-overlay" />

      {/* Floating elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-40 h-40 bg-gold rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-1/4 w-28 h-28 bg-accent-glow rounded-full blur-2xl animate-float" style={{ animationDelay: '1.8s' }} />
      </div>

      <div className="container relative mx-auto px-6 lg:px-10 z-10">
        <div className="text-center space-y-10">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-28 h-28 mx-auto bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-gold animate-glow"
          >
            <Sparkles className="w-12 h-12 text-gold animate-pulse" />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={cn(
              'font-display font-bold text-white leading-tight text-balance',
              isArabic ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-4xl md:text-6xl'
            )}
          >
            {title}{' '}
            <span className="bg-gradient-gold bg-clip-text text-transparent animate-shine">
              ✨
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={cn(
              'text-white/85 max-w-3xl mx-auto leading-relaxed',
              isArabic ? 'text-base sm:text-lg' : 'text-xl md:text-2xl'
            )}
          >
            {subtitle}
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {features.map((feature, i) => (
              <span
                key={i}
                className="bg-white/15 px-5 py-2 rounded-full text-white text-sm font-medium backdrop-blur hover:bg-white/25 transition-all"
              >
                {feature}
              </span>
            ))}
          </motion.div>

          {/* Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Button
              size="lg"
              className={cn(
                'btn-gold px-10 py-5 group shadow-gold hover:shadow-xl hover:scale-105 transition-all',
                isArabic ? 'text-base sm:text-lg' : 'text-lg'
              )}
              onClick={() => scrollToSection('#capabilities')}
            >
              <Play className="w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0 group-hover:scale-110 transition-transform" />
              {primaryLabel}
              <Zap className="w-5 h-5 ml-3 rtl:mr-3 rtl:ml-0 group-hover:rotate-12 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={cn(
                'px-10 py-5 border-2 border-white/50 text-white hover:bg-white/20 transition-all',
                isArabic ? 'text-base sm:text-lg' : 'text-lg'
              )}
              onClick={() => scrollToSection('#contact')}
            >
              {secondaryLabel}
              <ArrowRight className="w-5 h-5 ml-3 rtl:mr-3 rtl:ml-0 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Trust note + Clients */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="space-y-8 mt-12"
          >
            <p className="text-white/70 text-sm">{trustNote}</p>
            <div className="flex flex-wrap justify-center gap-6 opacity-70">
              {clients.map((client, i) => (
                <div
                  key={i}
                  className="px-6 py-3 bg-white/10 rounded-lg text-white text-sm font-medium backdrop-blur hover:bg-white/20 transition"
                >
                  {client}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom Note */}
          <p
            className={cn(
              'text-white/80 font-medium mt-8 animate-pulse',
              isArabic ? 'text-base sm:text-lg' : 'text-lg'
            )}
          >
            {bottomNote}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
