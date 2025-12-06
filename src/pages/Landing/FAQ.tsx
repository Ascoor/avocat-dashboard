import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionHeader from './components/SectionHeader';
import SectionContainer from './components/SectionContainer';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const { language, direction } = useLanguage();
  const isArabic = language === 'ar';

  const faqItems: FAQItem[] = isArabic
    ? [
        {
          question: 'ما هي مجالات الممارسة القانونية التي تتخصصون فيها؟',
          answer: 'نتخصص في قانون الشركات، والقانون الجنائي، وقانون الأسرة، وإعداد العقود، والنزاعات العقارية. يتمتع فريقنا بخبرة واسعة في هذه المجالات ويقدم استشارات متخصصة لكل حالة.',
        },
        {
          question: 'كيف يمكنني حجز استشارة أولية؟',
          answer: 'يمكنك حجز استشارة أولية مجانية من خلال نموذج التواصل على موقعنا، أو الاتصال بنا مباشرة. سنقوم بتحديد موعد مناسب لمناقشة قضيتك مع أحد محامينا المتخصصين.',
        },
        {
          question: 'ما هي رسوم الاستشارة القانونية؟',
          answer: 'نقدم الاستشارة الأولية مجاناً لتقييم قضيتك. بعد ذلك، تختلف الرسوم حسب طبيعة القضية وتعقيدها. نحرص على الشفافية الكاملة في هيكل الأتعاب قبل البدء في أي عمل قانوني.',
        },
        {
          question: 'هل تقدمون خدمات التمثيل أمام المحاكم؟',
          answer: 'نعم، نقدم خدمات التمثيل القانوني الكامل أمام جميع درجات المحاكم. محامونا مرخصون ومعتمدون للترافع أمام المحاكم الابتدائية والاستئنافية ومحاكم التمييز.',
        },
        {
          question: 'كيف يمكنني متابعة تطورات قضيتي؟',
          answer: 'بمجرد توقيع عقد التوكيل، ستحصل على حساب خاص في بوابتنا الإلكترونية الآمنة. من خلالها يمكنك متابعة جميع التطورات والمواعيد والمستندات المتعلقة بقضيتك على مدار الساعة.',
        },
        {
          question: 'هل تتعاملون مع القضايا الدولية؟',
          answer: 'نعم، لدينا شراكات مع مكاتب محاماة دولية تمكننا من تقديم المشورة في القضايا ذات الطابع الدولي، بما في ذلك التجارة الدولية والتحكيم وقضايا الإقامة.',
        },
        {
          question: 'ما هي ساعات العمل وكيف يمكنني التواصل في حالات الطوارئ؟',
          answer: 'ساعات العمل الرسمية من الأحد إلى الخميس، 9 صباحاً - 6 مساءً. لعملائنا الحاليين، نوفر خط طوارئ متاح على مدار الساعة للقضايا العاجلة التي لا تحتمل التأخير.',
        },
      ]
    : [
        {
          question: 'What practice areas do you specialize in?',
          answer: 'We specialize in Corporate Law, Criminal Defense, Family Law, Contract Preparation, and Real Estate Disputes. Our team has extensive experience in these areas and provides specialized consultation for each case.',
        },
        {
          question: 'How can I book an initial consultation?',
          answer: 'You can book a free initial consultation through our website contact form or by calling us directly. We will schedule a convenient time to discuss your case with one of our specialized attorneys.',
        },
        {
          question: 'What are your legal consultation fees?',
          answer: 'We offer a free initial consultation to evaluate your case. After that, fees vary depending on the nature and complexity of the case. We ensure complete transparency in our fee structure before starting any legal work.',
        },
        {
          question: 'Do you provide court representation services?',
          answer: 'Yes, we provide full legal representation before all court levels. Our attorneys are licensed and certified to appear before trial courts, appellate courts, and courts of cassation.',
        },
        {
          question: 'How can I track my case progress?',
          answer: 'Once you sign a power of attorney, you will receive a private account on our secure online portal. Through it, you can track all developments, appointments, and documents related to your case around the clock.',
        },
        {
          question: 'Do you handle international cases?',
          answer: 'Yes, we have partnerships with international law firms that enable us to provide advice on international matters, including international trade, arbitration, and residency cases.',
        },
        {
          question: 'What are your working hours and how can I reach you in emergencies?',
          answer: 'Official working hours are Sunday to Thursday, 9 AM - 6 PM. For our current clients, we provide a 24/7 emergency line for urgent matters that cannot be delayed.',
        },
      ];

  const content = {
    badge: isArabic ? 'الأسئلة الشائعة' : 'FAQ',
    title: isArabic ? 'أسئلة متكررة' : 'Frequently Asked Questions',
    description: isArabic
      ? 'إجابات على الأسئلة الأكثر شيوعاً حول خدماتنا القانونية'
      : 'Answers to the most common questions about our legal services',
  };

  return (
    <section id="faq" className="relative py-20 sm:py-24" dir={direction}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />

      <div className="container relative mx-auto px-4 lg:px-8">
        <SectionContainer loading={false} className="bg-background/70">
          <div className="space-y-12">
            <SectionHeader
              badge={content.badge}
              title={content.title}
              subtitle={content.description}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <Accordion type="single" collapsible className="w-full space-y-3">
                {faqItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <AccordionItem
                      value={`item-${index}`}
                      className="rounded-xl border border-border bg-card/50 px-4 sm:px-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <AccordionTrigger className={`py-4 sm:py-5 text-sm sm:text-base font-medium hover:no-underline ${isArabic ? 'text-right' : 'text-left'}`}>
                        <div className="flex items-center gap-3">
                          <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                          <span className="flex-1">{item.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className={`pb-4 sm:pb-5 text-sm text-muted-foreground leading-relaxed ${isArabic ? 'pr-8' : 'pl-8'}`}>
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </motion.div>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center pt-8"
            >
              <p className="text-muted-foreground text-sm sm:text-base">
                {isArabic ? 'لم تجد إجابة لسؤالك؟' : "Didn't find your answer?"}
                <a
                  href="#contact"
                  className="text-primary font-medium hover:underline ml-1 rtl:mr-1"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {isArabic ? 'تواصل معنا' : 'Contact us'}
                </a>
              </p>
            </motion.div>
          </div>
        </SectionContainer>
      </div>
    </section>
  );
};

export default FAQ;
