import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Database, Laptop, Shield, Users } from 'lucide-react';

import SectionHeader from './components/SectionHeader';
import SectionContainer from './components/SectionContainer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';
import type { ContentBlock, Locale } from '@/types/website';

const iconLookup: Record<string, typeof Shield> = {
  shield: Shield,
  users: Users,
  database: Database,
  laptop: Laptop,
};

const Features: React.FC = () => {
  const { language } = useLanguage();
  const locale = language as Locale;
  const { loading, contentBlocks, getValueForLocale } = useWebsiteContent('features');

  const header = {
    eyebrow: getValueForLocale('features_badge', locale) ?? '',
    title: getValueForLocale('features_title', locale) ?? '',
    subtitle: getValueForLocale('features_subtitle', locale) ?? '',
  };

  const features = useMemo(
    () =>
      contentBlocks
        .filter((block) => block.key.startsWith('features_item_'))
        .map((block) => mapFeature(block, locale)),
    [contentBlocks, locale]
  );

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-background py-24"
      aria-labelledby="features-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,hsla(200,85%,65%,0.18),transparent_62%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/70 to-transparent" />

      <div className="container relative z-10 mx-auto px-6">
        <SectionContainer
          loading={loading}
          loaderLabel={locale === 'ar' ? 'جارٍ تحميل قسم المزايا' : 'Loading features'}
          className="bg-background/80"
        >
          <div className="space-y-16">
            <SectionHeader
              title={header.title}
              subtitle={header.subtitle}
              badge={header.eyebrow}
              align="center"
            />

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.article
                  key={`${feature.title}-${index}`}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/90 p-6 shadow-ambient transition-all duration-500 ease-elegant hover:-translate-y-3 hover:shadow-glow-strong"
                >
                  <div className="pointer-events-none absolute inset-[1px] -z-10 rounded-[1.05rem] bg-gradient-card opacity-0 transition-opacity duration-500 ease-elegant group-hover:opacity-100" />
                  <div className="pointer-events-none absolute -inset-12 -z-20 rounded-full bg-gradient-aurora opacity-0 blur-[140px] transition-all duration-700 ease-smooth group-hover:scale-110 group-hover:opacity-60" />

                  <div className="mb-6 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.86, rotate: -10, opacity: 0 }}
                      whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                      viewport={{ once: true, amount: 0.75 }}
                      transition={{ duration: 0.5, delay: 0.05 }}
                      className="relative rounded-full bg-accent-soft p-4 shadow-inner-glow transition-all duration-300 ease-smooth group-hover:scale-105 group-hover:bg-accent"
                    >
                      <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-aurora opacity-0 blur-xl transition-opacity duration-500 ease-smooth group-hover:opacity-80" />
                      <feature.Icon className="h-10 w-10 text-accent" aria-hidden />
                    </motion.div>
                  </div>

                  <h3 className="mb-2 text-xl font-semibold text-text-strong transition-colors duration-300 ease-smooth group-hover:text-primary">
                    {feature.title}
                  </h3>

                  <p className="text-text-body transition-colors duration-300 ease-smooth group-hover:text-text-muted">
                    {feature.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </SectionContainer>
      </div>
    </section>
  );
};

function mapFeature(block: ContentBlock, locale: Locale) {
  const localized = block.value as unknown as {
    ar?: {
      icon?: string;
      title?: string;
      description?: string;
      tagline?: string;
    } | null;
    en?: {
      icon?: string;
      title?: string;
      description?: string;
      tagline?: string;
    } | null;
  };

  const fallback = localized.en ?? {};
  const data = localized[locale] ?? fallback ?? {};
  const iconKey = (data.icon ?? fallback.icon ?? 'shield').toLowerCase();

  return {
    Icon: iconLookup[iconKey] ?? Shield,
    title: data.title ?? fallback.title ?? '',
    description: data.description ?? fallback.description ?? '',
    tagline: data.tagline ?? fallback.tagline ?? '',
  };
}

export default Features;
