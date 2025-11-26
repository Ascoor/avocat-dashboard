import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { 
  Scale, 
  Users, 
  Briefcase, 
  Calendar, 
  FileText, 
  UsersRound, 
  TrendingUp,
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-law-firm.jpg';

export default function Landing() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const features = [
    {
      icon: Briefcase,
      title: t('caseManagement'),
      description: t('caseManagementDesc'),
    },
    {
      icon: Users,
      title: t('clientManagement'),
      description: t('clientManagementDesc'),
    },
    {
      icon: Calendar,
      title: t('sessionTracking'),
      description: t('sessionTrackingDesc'),
    },
    {
      icon: FileText,
      title: t('documentManagement'),
      description: t('documentManagementDesc'),
    },
    {
      icon: UsersRound,
      title: t('teamCollaboration'),
      description: t('teamCollaborationDesc'),
    },
    {
      icon: TrendingUp,
      title: t('reporting'),
      description: t('reportingDesc'),
    },
  ];

  const benefits = [
    { icon: Shield, text: language === 'ar' ? 'أمان وخصوصية عالية' : 'High Security & Privacy' },
    { icon: Clock, text: language === 'ar' ? 'توفير الوقت والجهد' : 'Save Time & Effort' },
    { icon: CheckCircle2, text: language === 'ar' ? 'سهولة الاستخدام' : 'Easy to Use' },
    { icon: TrendingUp, text: language === 'ar' ? 'زيادة الإنتاجية' : 'Increase Productivity' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Law Firm" 
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-primary/80"></div>
        </div>
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaC0ydjJoMnYtMmgydi0yaC0yem0tMiAydi0yaC0ydjJoMnptMi0xMnYyaC0ydjJoMnYtMmgydi0yaC0yem0tMiAydi0yaC0ydjJoMnptLTQtMnYyaC0ydjJoMnYtMmgydi0yaC0yem0tMiAydi0yaC0ydjJoMnptMTAgMHYyaDJ2LTJoLTJ6bTIgMHYtMmgtMnYyaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
        
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-accent to-accent/70 shadow-gold"
            >
              <Scale className="h-14 w-14 text-primary" />
            </motion.div>

            <h1 className="mb-6 text-4xl font-bold text-primary-foreground md:text-6xl">
              {t('heroTitle')}
            </h1>
            
            <p className="mb-10 text-lg text-primary-foreground/90 md:text-xl">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="group relative overflow-hidden bg-accent text-accent-foreground shadow-gold hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t('getStarted')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-accent to-gold-400 opacity-0 transition-opacity group-hover:opacity-100" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-accent text-primary-foreground hover:bg-accent/10"
              >
                {t('requestDemo')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t('features')}</h2>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'مجموعة متكاملة من الأدوات لإدارة مكتبك القانوني بكفاءة' 
                : 'A comprehensive set of tools to manage your law office efficiently'}
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group h-full p-6 transition-all hover:shadow-custom-lg hover:shadow-gold/20">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md transition-transform group-hover:scale-110">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Avocat Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t('whyAvocat')}</h2>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'الحل الأمثل لمكاتب المحاماة الحديثة' 
                : 'The optimal solution for modern law firms'}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                    <benefit.icon className="h-8 w-8 text-accent" />
                  </div>
                  <p className="font-medium">{benefit.text}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="gradient-hero rounded-3xl p-12 text-center shadow-custom-xl"
          >
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
              {language === 'ar' ? 'ابدأ مع أفوكات اليوم' : 'Start with Avocat Today'}
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/90">
              {language === 'ar' 
                ? 'انضم إلى مئات مكاتب المحاماة التي تثق بأفوكات' 
                : 'Join hundreds of law firms that trust Avocat'}
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="bg-accent text-accent-foreground shadow-gold hover:shadow-xl"
            >
              {t('getStarted')}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <Scale className="h-6 w-6 text-accent" />
              <span className="text-sm text-muted-foreground">
                © 2024 Avocat. {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
              </span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-accent transition-colors">{t('aboutSystem')}</a>
              <a href="#" className="hover:text-accent transition-colors">{t('contact')}</a>
              <a href="#" className="hover:text-accent transition-colors">{t('terms')}</a>
              <a href="#" className="hover:text-accent transition-colors">{t('privacy')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
