import { useMemo, useState, type ComponentType } from 'react';
import { motion } from 'framer-motion';
import { Clock3, Mail, MapPin, Phone, Send } from 'lucide-react';

import SectionHeader from './components/SectionHeader';
import SectionContainer from './components/SectionContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';

type ContactLocale = 'ar' | 'en';

interface ContactFormCopy {
  labels: {
    name: string;
    email: string;
    message: string;
  };
  placeholders: {
    name: string;
    email: string;
    message: string;
  };
  submit: string;
  submitting: string;
  success: {
    title: string;
    description: string;
  };
}

interface ContactPoint {
  icon: string;
  title: string;
  details: string;
}

const iconLookup: Record<string, ComponentType<{ className?: string }>> = {
  MapPin,
  Phone,
  Mail,
  Clock3,
};

const Contact: React.FC = () => {
  const { toast } = useToast();
  const { language, direction } = useLanguage();
  const isArabic = language === 'ar';
  const locale = language as ContactLocale;
  const { loading, contentBlocks, getLocalizedValue, getValueForLocale } = useWebsiteContent('contact');

  const header = {
    badge: getValueForLocale('contact_badge', locale) ?? '',
    title: getValueForLocale('contact_title', locale) ?? '',
    description: getValueForLocale('contact_subtitle', locale) ?? '',
    note: getValueForLocale('contact_note', locale) ?? '',
    conciergeTitle: getValueForLocale('contact_concierge_title', locale) ?? '',
    conciergeBody: getValueForLocale('contact_concierge_body', locale) ?? '',
  };

  const formCopy = useMemo<ContactFormCopy>(() => {
    const localized = getLocalizedValue<ContactFormCopy>('contact_form_copy', {
      ar: {
        labels: { name: '', email: '', message: '' },
        placeholders: { name: '', email: '', message: '' },
        submit: '',
        submitting: '',
        success: { title: '', description: '' },
      },
      en: {
        labels: { name: '', email: '', message: '' },
        placeholders: { name: '', email: '', message: '' },
        submit: '',
        submitting: '',
        success: { title: '', description: '' },
      },
    });

    return localized[locale] ?? localized.en ?? {
      labels: { name: '', email: '', message: '' },
      placeholders: { name: '', email: '', message: '' },
      submit: '',
      submitting: '',
      success: { title: '', description: '' },
    };
  }, [getLocalizedValue, locale]);

  const contactPoints = useMemo<ContactPoint[]>(() => {
    return contentBlocks
      .filter((block) => block.key.startsWith('contact_point_'))
      .sort((a, b) => a.key.localeCompare(b.key))
      .map((block) => {
        const localized = block.value as unknown as {
          ar?: ContactPoint | null;
          en?: ContactPoint | null;
        };

        const fallback = localized.en ?? { icon: 'MapPin', title: '', details: '' };
        const data = localized[locale] ?? fallback;

        return {
          icon: data.icon ?? fallback.icon ?? 'MapPin',
          title: data.title ?? fallback.title ?? '',
          details: data.details ?? fallback.details ?? '',
        };
      });
  }, [contentBlocks, locale]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast({ title: formCopy.success.title, description: formCopy.success.description });
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/10 to-background py-24" dir={direction}>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -left-20 top-32 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
        <div className="absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-accent/40 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 lg:px-8">
        <SectionContainer
          loading={loading}
          loaderLabel={locale === 'ar' ? 'جارٍ تجهيز نموذج التواصل' : 'Preparing contact module'}
          className="bg-background/85"
        >
          <div className="space-y-16">
            <SectionHeader badge={header.badge} title={header.title} subtitle={header.description} />

            <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
              <motion.form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-border bg-card/80 p-8 shadow-elevated backdrop-blur"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground" htmlFor="name">
                        {formCopy.labels.name}
                      </label>
                      <Input
                        required
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={formCopy.placeholders.name}
                        className="h-12 rounded-2xl border-border bg-background/70"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground" htmlFor="email">
                        {formCopy.labels.email}
                      </label>
                      <Input
                        required
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={formCopy.placeholders.email}
                        className="h-12 rounded-2xl border-border bg-background/70"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground" htmlFor="message">
                      {formCopy.labels.message}
                    </label>
                    <Textarea
                      required
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder={formCopy.placeholders.message}
                      className="resize-none rounded-2xl border-border bg-background/70"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-gold flex w-full items-center justify-center gap-2 py-3 text-base font-semibold"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2 text-sm">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        {formCopy.submitting}
                      </span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>{formCopy.submit}</span>
                      </>
                    )}
                  </Button>
                </div>
                <p className="mt-6 text-center text-xs uppercase tracking-[0.4em] text-muted-foreground">
                  {header.note}
                </p>
              </motion.form>

              <motion.div
                className="space-y-6 rounded-3xl border border-border bg-card/60 p-8 shadow-ambient backdrop-blur"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">{header.conciergeTitle}</h3>
                  <p className="text-sm text-muted-foreground">{header.conciergeBody}</p>
                </div>

                <div className="space-y-4">
                  {contactPoints.map((point, index) => {
                    const Icon = iconLookup[point.icon] ?? MapPin;
                    return (
                      <motion.div
                        key={`${point.title}-${index}`}
                        initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.7 }}
                        transition={{ duration: 0.45, delay: index * 0.08 }}
                        className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/70 p-3"
                      >
                        <div className="rounded-xl bg-primary/10 p-2 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <h4 className="text-base font-semibold text-foreground">{point.title}</h4>
                          <p className={isArabic ? 'font-arabic' : undefined}>{point.details}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </SectionContainer>
      </div>
    </section>
  );
};

export default Contact;
