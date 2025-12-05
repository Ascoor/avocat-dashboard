import { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Gavel, MessageSquareQuote, Trophy } from 'lucide-react';

import SectionHeader from './components/SectionHeader';
import SectionContainer from './components/SectionContainer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';
import { useWebsiteCollection } from '@/hooks/useWebsiteCollection';
import type { AchievementApi, Locale } from '@/types/website';

const storyIcons = [Gavel, MessageSquareQuote, Trophy];

const Achievements: React.FC = () => {
  const { language, direction } = useLanguage();
  const locale = language as Locale;
  const isArabic = language === 'ar';
  const { loading, contentBlocks, getLocalizedValue, getValueForLocale } = useWebsiteContent('achievements');
  const { data: stats, loading: statsLoading } = useWebsiteCollection<AchievementApi>('/api/website/achievements');

  const getString = useCallback(
    (key: string, lang: Locale = locale, fallback = ''): string =>
      getValueForLocale<string>(key, lang) ?? fallback,
    [getValueForLocale, locale]
  );

  const header = {
    badge: getString('achievements_badge'),
    title: getString('achievements_title'),
    description: getString('achievements_description'),
  };

  const metrics = useMemo(() => {
    const keys = contentBlocks
      .filter((block) => block.key.startsWith('achievements_metric_'))
      .sort((a, b) => a.key.localeCompare(b.key));

    return keys.map((block) => getString(block.key));
  }, [contentBlocks, getString]);

  const stories = useMemo(() => {
    const collected: Array<{
      Icon: typeof Gavel;
      title: string;
      summary: string;
      details: string[];
    }> = [];

    contentBlocks
      .filter((block) => block.key.startsWith('achievements_story_'))
      .forEach((block) => {
        const match = block.key.match(/^achievements_story_(\d+)_/);
        if (!match) return;

        const index = Number(match[1]) - 1;
        if (!collected[index]) {
          collected[index] = {
            Icon: storyIcons[index % storyIcons.length],
            title: '',
            summary: '',
            details: [],
          };
        }

        if (block.key.endsWith('_title')) {
          collected[index].title = getString(block.key);
        } else if (block.key.endsWith('_summary')) {
          collected[index].summary = getString(block.key);
        } else if (block.key.endsWith('_details')) {
          const localized = getLocalizedValue<string[]>(block.key, { ar: [], en: [] });
          collected[index].details = (localized[locale] ?? localized.en ?? []).filter(Boolean);
        }
      });

    return collected.filter(Boolean);
  }, [contentBlocks, getLocalizedValue, getString, locale]);

  const achievementStats = stats.length ? stats : [];

  const isLoading = loading || statsLoading;

  return (
    <section id="achievements" className="bg-background py-24" dir={direction}>
      <div className="container mx-auto px-4 lg:px-8">
        <SectionContainer
          loading={isLoading}
          loaderLabel={isArabic ? 'جارٍ تحميل قسم الإنجازات' : 'Loading achievements'}
          className="bg-card/70"
        >
          <div className="space-y-16">
            <SectionHeader badge={header.badge} title={header.title} subtitle={header.description} />

            <div className="grid gap-6 md:grid-cols-3">
              {metrics.map((metric, index) => (
                <motion.div
                  key={`${metric}-${index}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-background to-background p-6 text-center shadow-ambient"
                >
                  <p className="text-sm font-semibold text-primary">{metric}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {stories.map((story, index) => {
                const Icon = story.Icon;

                return (
                  <motion.article
                    key={`${story.title}-${index}`}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, delay: index * 0.1 }}
                    className="flex h-full flex-col gap-6 rounded-3xl border border-border bg-card/80 p-8 shadow-elevated backdrop-blur transition-transform duration-500 hover:-translate-y-2 hover:shadow-premium"
                  >
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
                      <h3 className="text-xl font-semibold text-foreground">{story.title}</h3>
                    </div>

                    <motion.p
                      className="text-base leading-relaxed text-muted-foreground"
                      dir={isArabic ? 'rtl' : 'ltr'}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.55, delay: 0.12 }}
                    >
                      {story.summary}
                    </motion.p>

                    <motion.ul
                      className="space-y-3 text-sm text-muted-foreground"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.55, delay: 0.18 }}
                    >
                      {story.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2" dir={isArabic ? 'rtl' : 'ltr'}>
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </motion.ul>
                  </motion.article>
                );
              })}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {achievementStats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="rounded-3xl border border-border bg-card/70 p-6 text-center shadow-elevated backdrop-blur"
                >
                  <p className="text-3xl font-display font-bold text-primary">{stat.number}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{stat.title[locale] ?? stat.title.en}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionContainer>
      </div>
    </section>
  );
};

export default Achievements;
