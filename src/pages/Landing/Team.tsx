import { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Scale, ShieldCheck, UserCircle2 } from 'lucide-react';

import SectionHeader from './components/SectionHeader';
import SectionContainer from './components/SectionContainer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';
import { useWebsiteCollection } from '@/hooks/useWebsiteCollection';
import type { Locale, TeamMemberApi } from '@/types/website';

const leadershipIcons = [Scale, GraduationCap, ShieldCheck];

const Team: React.FC = () => {
  const { language } = useLanguage();
  const locale = language as Locale;
  const isArabic = language === 'ar';
  const { loading, getValueForLocale } = useWebsiteContent('team');
  const { data: teamData, loading: teamLoading } = useWebsiteCollection<TeamMemberApi>('/api/website/team');

  const getString = useCallback(
    (key: string, fallback = ''): string =>
      getValueForLocale(key, locale, fallback),
    [getValueForLocale, locale]
  );

  const header = {
    badge: getString('team_badge'),
    title: getString('team_title'),
    description: getString('team_description'),
  };

  const leadershipBadges = useMemo(() => {
    return leadershipIcons
      .map((Icon, index) => ({
        Icon,
        text: getString(`team_leadership_badge_${index + 1}`),
      }))
      .filter((badge) => badge.text);
  }, [getString, locale]);

  const members = useMemo(() => {
    if (Array.isArray(teamData)) {
      return teamData;
    }
    const nested = (teamData as { data?: TeamMemberApi[] } | null)?.data;
    return Array.isArray(nested) ? nested : [];
  }, [teamData]);

  const isLoading = loading || teamLoading;

  const cardVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  } as const;

  return (
    <section id="team" className="bg-surface-highlight/70 py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionContainer
          loading={isLoading}
          loaderLabel={isArabic ? 'جارٍ تحميل الفريق' : 'Loading leadership team'}
          className="bg-background/80"
        >
          <div className="space-y-16">
            <SectionHeader badge={header.badge} title={header.title} subtitle={header.description} />

            <div className="grid gap-10 lg:grid-cols-2">
              {members.map((member, index) => {
                const name = member.name[locale] ?? member.name.en ?? '';
                const role = member.position[locale] ?? member.position.en ?? '';
                const bio = member.bio[locale] ?? member.bio.en ?? '';
                const highlights = member.highlights[locale] ?? member.highlights.en ?? [];

                return (
                  <motion.article
                    key={`${member.id}-${member.name.en}`}
                    dir={isArabic ? 'rtl' : 'ltr'}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ delay: index * 0.08 }}
                    className="flex h-full flex-col gap-6 rounded-3xl border border-border bg-card/80 p-8 shadow-elevated backdrop-blur transition-transform duration-500 hover:-translate-y-2 hover:shadow-premium"
                  >
                    <div className="flex items-start gap-4">
                      <motion.div
                        initial={{ scale: 0.85, rotate: -8, opacity: 0 }}
                        whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                        viewport={{ once: true, amount: 0.75 }}
                        transition={{ duration: 0.55, delay: 0.05 }}
                        className="rounded-3xl bg-gradient-gold p-4 text-accent-foreground shadow-gold"
                      >
                        <UserCircle2 className="h-10 w-10" />
                      </motion.div>
                      <div>
                        <h3
                          className={`text-2xl font-semibold ${
                            isArabic ? 'font-arabic text-accent' : 'font-english text-foreground'
                          }`}
                        >
                          {name}
                        </h3>
                        <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">{role}</p>
                      </div>
                    </div>

                    <motion.div
                      className="space-y-4 text-base leading-relaxed text-muted-foreground"
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.55, delay: 0.12 }}
                    >
                      <p className={isArabic ? 'font-arabic' : 'font-english'}>{bio}</p>
                      <ul
                        className={`space-y-3 pl-5 ${
                          isArabic ? 'border-r-2 border-accent pr-5' : 'border-l-2 border-accent'
                        }`}
                      >
                        {highlights.map((highlight, i) => (
                          <li key={`${member.id}-highlight-${i}`} className="relative">
                            <span
                              className={`absolute top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent bg-card text-xs font-bold text-accent ${
                                isArabic ? 'right-[-18px]' : 'left-[-18px]'
                              }`}
                            >
                              {i + 1}
                            </span>

                            <span
                              className={`leading-relaxed ${
                                isArabic ? 'font-arabic text-right pr-6' : 'font-english text-left pl-6'
                              }`}
                            >
                              {highlight}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>

                    <div className="grid gap-4 md:grid-cols-3">
                      {leadershipBadges.map(({ Icon, text }, badgeIndex) => (
                        <motion.div
                          key={`${member.id}-${text}`}
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{ duration: 0.45, delay: 0.15 + badgeIndex * 0.05 }}
                          className="rounded-2xl border border-border bg-background/70 p-4 text-center"
                        >
                          <Icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                          <p className="text-xs font-semibold text-muted-foreground">{text}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </SectionContainer>
      </div>
    </section>
  );
};

export default Team;
