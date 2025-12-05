import { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Award, Building2, Compass, Handshake, Target, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';
import type { Locale } from '@/types/website';
import SectionHeader from './components/SectionHeader';
import SectionContainer from './components/SectionContainer';
import { Card, CardContent } from '@/components/ui/card';

const pillarIcons = [Building2, Target, Compass, Handshake];

const About: React.FC = () => {
  const { language, direction } = useLanguage();
  const locale = language as Locale;
  const isArabic = language === 'ar';
  const { loading, contentBlocks, getLocalizedValue, getValueForLocale } =
    useWebsiteContent('about');

  // Extract pillars dynamically
  const pillarNumbers = useMemo(() => {
    const numbers = new Set<number>();
    contentBlocks.forEach((block) => {
      const match = block.key.match(/^about_pillar_(\d+)_/);
      if (match) numbers.add(Number(match[1]));
    });
    return Array.from(numbers).sort((a, b) => a - b);
  }, [contentBlocks]);

  const getString = useCallback(
    (key: string, lang: Locale = locale, fallback = ''): string =>
      getValueForLocale<string>(key, lang) ?? fallback,
    [getValueForLocale, locale]
  );

  const pillars = useMemo(
    () =>
      pillarNumbers.map((number, index) => {
        const pointsLocalized = getLocalizedValue<string[]>(`about_pillar_${number}_points`, {
          ar: [],
          en: [],
        });
        return {
          icon: pillarIcons[index % pillarIcons.length],
          title: getString(`about_pillar_${number}_title`),
          description: getString(`about_pillar_${number}_description`),
          points: (pointsLocalized[locale] ?? pointsLocalized.en ?? []).filter(Boolean),
          arabicTitle: getString(`about_pillar_${number}_title`, 'ar'),
        };
      }),
    [getLocalizedValue, getString, locale, pillarNumbers]
  );

  const badge = getString('about_badge');
  const title = getString('about_title');
  const description = getString('about_description');
  const detailLabel = getString('about_detail_label');

  // Achievements content
  const achievements = [
    { number: '150+', label: isArabic ? 'قضايا ناجحة' : 'Successful Cases' },
    { number: '20+', label: isArabic ? 'شركاء' : 'Partners' },
    { number: '10+', label: isArabic ? 'سنوات خبرة' : 'Years Experience' },
    { number: '100%', label: isArabic ? 'رضا العملاء' : 'Client Satisfaction' },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  } as const;

  return (
    <section id="about" className="relative overflow-hidden py-24" dir={direction}>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-secondary/20 via-background to-background" />
      <div className="container relative mx-auto px-4 lg:px-8">
        <SectionContainer
          loading={loading}
          loaderLabel={isArabic ? 'جارٍ تجهيز قسم من نحن' : 'Preparing about section'}
          className="bg-background/70"
        >
          <div className="space-y-20">
            <SectionHeader badge={badge} title={title} subtitle={description} />

            <div className="grid gap-16 lg:grid-cols-2 items-start">
              {/* ===== Left: Features & Vision ===== */}
              <div className="space-y-10">
                <div className="space-y-6">
                  {pillars.map((pillar, index) => {
                    const Icon = pillar.icon;
                    return (
                      <motion.div
                        key={index}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.35 }}
                        className="flex items-start space-x-4 rtl:space-x-reverse"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center shadow-gold">
                          <Icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-primary mb-2">
                            {pillar.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {pillar.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Vision / Mission Card */}
                <Card className="bg-gradient-subtle border-0 shadow-card">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <CheckCircle className="w-8 h-8 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="text-lg font-semibold text-primary mb-3">
                          {direction === 'rtl' ? 'رؤيتنا' : 'Our Vision'}
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {direction === 'rtl'
                            ? 'نسعى لقيادة التحول الرقمي في القطاع القانوني عبر حلول تقنية مبتكرة تعزز الكفاءة والشفافية مع الحفاظ على أعلى معايير الجودة والأمان.'
                            : 'We aim to lead digital transformation in the legal sector with innovative tech solutions that enhance efficiency and transparency while ensuring top quality and security.'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* ===== Right: Achievements ===== */}
              <div className="grid grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <Card
                    key={index}
                    className="text-center p-8 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-0"
                  >
                    <CardContent className="p-0">
                      <div className="text-4xl font-bold text-gold mb-2 font-inter">
                        {achievement.number}
                      </div>
                      <div className="text-muted-foreground font-medium">
                        {achievement.label}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Certified Card */}
                <Card className="col-span-2 bg-gradient-secondary text-center p-8 shadow-luxury">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h4 className="text-xl font-bold text-gold mb-3">
                      {direction === 'rtl' ? 'معتمدون ومرخصون' : 'Certified & Licensed'}
                    </h4>
                    <p className="text-secondary-foreground">
                      {direction === 'rtl'
                        ? 'حاصلون على جميع التراخيص والاعتمادات لممارسة الخدمات القانونية والتقنية'
                        : 'Fully licensed and certified for legal and technical service delivery'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </SectionContainer>
      </div>
    </section>
  );
};

export default About;
