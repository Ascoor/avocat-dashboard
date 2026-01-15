import { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { ComponentType, SVGProps } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BrainCircuit, Scale } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';
import type { Locale } from '@/types/website';
import SectionHeader from './components/SectionHeader';
import SectionContainer from './components/SectionContainer';

const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  legal_services: Scale,
  digital_ai_services: BrainCircuit,
};

const Services: React.FC = () => {
  const { language } = useLanguage();
  const locale = language as Locale;
  const isArabic = language === 'ar';
  const { loading, contentBlocks, getLocalizedValue, getValueForLocale } = useWebsiteContent('services');

  const getString = useCallback(
    (key: string, fallback = ''): string => getValueForLocale(key, locale, fallback),
    [getValueForLocale, locale]
  );

  const groupKeys = useMemo(() => {
    const keys = new Set<string>();

    contentBlocks.forEach((block) => {
      const match = block.key.match(/^services_group_(.+)_title$/);
      if (match) {
        keys.add(match[1]);
      }
    });

    return Array.from(keys);
  }, [contentBlocks]);

  const groups = useMemo(
    () =>
      groupKeys.map((key) => {
        const itemsLocalized = getLocalizedValue<string[]>(`services_group_${key}_items`, {
          ar: [],
          en: [],
        });

        return {
          key,
          Icon: iconMap[key] ?? Scale,
          title: getString(`services_group_${key}_title`),
          description: getString(`services_group_${key}_description`),
          items: (itemsLocalized[locale] ?? itemsLocalized.en ?? []).filter(Boolean),
        };
      }),
    [getLocalizedValue, getString, groupKeys, locale]
  );

  const badge = getString('services_badge');
  const title = getString('services_title');
  const description = getString('services_description');
  const highlightOne = getString('services_highlight_1');
  const highlightTwo = getString('services_highlight_2');

  const cardVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  } as const;

  return (
    <section id="services" className="bg-surface-highlight/60 py-24" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 lg:px-8">
        <SectionContainer
          loading={loading}
          loaderLabel={isArabic ? 'جارٍ تحميل قسم الخدمات' : 'Loading services'}
          className="bg-background/80"
        >
          <div className="space-y-16">
            <SectionHeader badge={badge} title={title} subtitle={description} />

            <div className="grid gap-10 lg:grid-cols-2">
              {groups.map((group, index) => {
                const { Icon } = group;

                return (
                  <motion.div
                    key={group.key}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <Card className="h-full border-border/80 bg-card/80 shadow-elevated backdrop-blur transition-transform duration-500 hover:-translate-y-2 hover:shadow-premium">
                      <CardContent className="space-y-8 p-8">
                        <div className="flex items-center gap-3">
                          <motion.div
                            initial={{ scale: 0.85, rotate: -6, opacity: 0 }}
                            whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                            viewport={{ once: true, amount: 0.7 }}
                            transition={{ duration: 0.6, delay: 0.05 }}
                            className="rounded-2xl bg-gradient-gold p-3 text-accent-foreground shadow-gold"
                          >
                            <Icon className="h-6 w-6" />
                          </motion.div>
                          <h3 className="text-2xl font-semibold text-foreground">{group.title}</h3>
                        </div>

                        <div className="space-y-4 text-base leading-relaxed text-muted-foreground" dir={isArabic ? 'rtl' : 'ltr'}>
                          <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.6 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                          >
                            {group.description}
                          </motion.p>
                          <motion.div
                            className="flex flex-wrap gap-2"
                            dir={isArabic ? 'rtl' : 'ltr'}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.6 }}
                            transition={{ duration: 0.55, delay: 0.16 }}
                          >
                            {group.items.map((item) => (
                              <Badge
                                key={item}
                                variant="outline"
                                className="border-border bg-background/60 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground/90"
                              >
                                {item}
                              </Badge>
                            ))}
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[highlightOne, highlightTwo]
                .filter(Boolean)
                .map((highlight, index) => (
                  <motion.div
                    key={`${highlight}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-background to-background p-6 text-center shadow-ambient"
                  >
                    <p className="text-sm font-semibold text-primary">{highlight}</p>
                  </motion.div>
                ))}
            </div>
          </div>
        </SectionContainer>
      </div>
    </section>
  );
};

export default Services;
