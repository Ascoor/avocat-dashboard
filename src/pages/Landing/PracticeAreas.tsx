import { motion } from 'framer-motion';
import {
  Building2,
  FileText,
  Gavel,
  Home,
  Scale,
  Users,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionHeader from './components/SectionHeader';
import SectionContainer from './components/SectionContainer';
import { cn } from '@/lib/utils';

interface PracticeArea {
  icon: typeof Scale;
  title: string;
  description: string;
}

const PracticeAreas: React.FC = () => {
  const { language, direction } = useLanguage();
  const isArabic = language === 'ar';

  const content = {
    badge: isArabic ? 'مجالات الممارسة' : 'Practice Areas',
    title: isArabic ? 'خدماتنا القانونية المتخصصة' : 'Our Specialized Legal Services',
    description: isArabic
      ? 'نقدم مجموعة شاملة من الخدمات القانونية بمعايير احترافية عالية'
      : 'We offer a comprehensive range of legal services with high professional standards',
  };

  const practiceAreas: PracticeArea[] = isArabic
    ? [
        {
          icon: Building2,
          title: 'قانون الشركات',
          description: 'تأسيس الشركات، عقود الشراكة، الاندماج والاستحواذ، وحوكمة الشركات',
        },
        {
          icon: Users,
          title: 'قانون الأسرة',
          description: 'قضايا الطلاق، الحضانة، النفقة، وتقسيم الممتلكات الزوجية',
        },
        {
          icon: Gavel,
          title: 'الدفاع الجنائي',
          description: 'التمثيل القانوني في القضايا الجنائية والدفاع أمام المحاكم الجزائية',
        },
        {
          icon: FileText,
          title: 'صياغة العقود',
          description: 'إعداد ومراجعة العقود التجارية، عقود العمل، واتفاقيات الشراكة',
        },
        {
          icon: Home,
          title: 'القانون العقاري',
          description: 'معاملات البيع والشراء، النزاعات العقارية، وعقود الإيجار',
        },
        {
          icon: Scale,
          title: 'التحكيم والوساطة',
          description: 'حل النزاعات التجارية بديلاً عن التقاضي التقليدي',
        },
      ]
    : [
        {
          icon: Building2,
          title: 'Corporate Law',
          description: 'Company formation, partnership agreements, mergers & acquisitions, and corporate governance',
        },
        {
          icon: Users,
          title: 'Family Law',
          description: 'Divorce cases, custody, alimony, and marital property division',
        },
        {
          icon: Gavel,
          title: 'Criminal Defense',
          description: 'Legal representation in criminal cases and defense before criminal courts',
        },
        {
          icon: FileText,
          title: 'Contract Drafting',
          description: 'Preparation and review of commercial contracts, employment agreements, and partnerships',
        },
        {
          icon: Home,
          title: 'Real Estate Law',
          description: 'Property transactions, real estate disputes, and lease agreements',
        },
        {
          icon: Scale,
          title: 'Arbitration & Mediation',
          description: 'Alternative dispute resolution for commercial conflicts',
        },
      ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  return (
    <section id="practice-areas" className="py-20 sm:py-24 bg-secondary/30" dir={direction}>
      <div className="container mx-auto px-4 lg:px-8">
        <SectionContainer loading={false} className="bg-background/60">
          <div className="space-y-12">
            <SectionHeader
              badge={content.badge}
              title={content.title}
              subtitle={content.description}
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {practiceAreas.map((area, index) => {
                const Icon = area.icon;
                return (
                  <motion.div
                    key={index}
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={cardVariants}
                  >
                    <Card className="group h-full border-border/60 bg-card/80 hover:bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <CardContent className="p-6">
                        <div className={cn(
                          'flex items-start gap-4',
                          isArabic && 'flex-row-reverse text-right'
                        )}>
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {area.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {area.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </SectionContainer>
      </div>
    </section>
  );
};

export default PracticeAreas;
