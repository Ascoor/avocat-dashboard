import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Scale, Shield, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Hero: React.FC = () => {
  const { language, direction } = useLanguage();
  const navigate = useNavigate();
  const isArabic = language === 'ar';

  const content = {
    badge: isArabic ? 'مكتب محاماة رائد' : 'Leading Law Firm',
    headline: isArabic
      ? 'الوضوح. الحماية. العدالة.'
      : 'Clarity. Protection. Justice.',
    subheadline: isArabic
      ? 'نقدم حلولاً قانونية متكاملة للأفراد والشركات، مع التزام راسخ بتحقيق أفضل النتائج لعملائنا'
      : 'Comprehensive legal solutions for individuals and businesses, with an unwavering commitment to achieving the best outcomes for our clients',
    firmName: isArabic ? 'ليكس برايم للمحاماة' : 'LexPrime Legal Group',
    ctaPrimary: isArabic ? 'احجز استشارة مجانية' : 'Book Free Consultation',
    ctaSecondary: isArabic ? 'مجالات الممارسة' : 'View Practice Areas',
    stats: [
      { value: isArabic ? '+١٥' : '15+', label: isArabic ? 'سنة خبرة' : 'Years Experience' },
      { value: isArabic ? '+٥٠٠' : '500+', label: isArabic ? 'قضية ناجحة' : 'Successful Cases' },
      { value: isArabic ? '%٩٨' : '98%', label: isArabic ? 'رضا العملاء' : 'Client Satisfaction' },
    ],
    trustBadges: [
      { icon: Shield, text: isArabic ? 'معتمد ومرخص' : 'Certified & Licensed' },
      { icon: Star, text: isArabic ? 'تصنيف ٥ نجوم' : '5-Star Rated' },
      { icon: Users, text: isArabic ? 'فريق متخصص' : 'Expert Team' },
    ],
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <section
      id="home"
      dir={direction}
      className="relative min-h-[90vh] flex items-center overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(225,65%,10%)] via-[hsl(225,65%,16%)] to-[hsl(225,55%,22%)]" />

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-1/4 w-[600px] h-[600px] rounded-full bg-gold/10 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-exclusive/10 blur-[100px]" />
      </div>

      {/* Geometric Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L80 40L40 80L0 40z' fill='none' stroke='%23D4AF37' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto lg:mx-0">
          {/* Badge */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={0}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/10 backdrop-blur-sm">
              <Scale className="h-4 w-4 text-gold" />
              <span className="text-gold-light text-sm font-medium">{content.badge}</span>
            </div>
          </motion.div>

          {/* Firm Name */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={1}
            className="text-gold text-lg sm:text-xl font-semibold mb-4"
          >
            {content.firmName}
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={2}
            className={cn(
              'font-bold text-white mb-6',
              isArabic
                ? 'text-4xl sm:text-5xl lg:text-6xl font-arabic leading-tight'
                : 'text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight tracking-tight'
            )}
          >
            {content.headline}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={3}
            className={cn(
              'text-white/80 max-w-2xl mb-8',
              isArabic ? 'text-lg leading-relaxed' : 'text-lg sm:text-xl leading-relaxed'
            )}
          >
            {content.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={4}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <Button
              size="lg"
              className="bg-gold hover:bg-gold-light text-[hsl(225,65%,12%)] font-semibold px-8 h-12 rounded-full shadow-gold transition-all hover:shadow-lg hover:-translate-y-0.5"
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Calendar className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" />
              {content.ctaPrimary}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:border-white/50 font-semibold px-8 h-12 rounded-full backdrop-blur-sm transition-all"
              onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {content.ctaSecondary}
              <ArrowRight className={cn('h-5 w-5 ml-2', isArabic && 'rotate-180 mr-2 ml-0')} />
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={5}
            className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mb-10"
          >
            {content.stats.map((stat, index) => (
              <div key={index} className={isArabic ? 'text-center' : ''}>
                <div className="text-2xl sm:text-3xl font-bold text-gold mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={6}
            className="flex flex-wrap gap-4 sm:gap-6"
          >
            {content.trustBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <Icon className="h-4 w-4 text-gold" />
                  <span className="text-xs sm:text-sm text-white/80">{badge.text}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 rounded-full bg-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
