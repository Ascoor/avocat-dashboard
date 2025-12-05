import BrandLogo from "@/components/common/BrandLogo";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { smoothScrollToElement } from "@/utils/smoothScroll";
import { Linkedin, Mail, MapPin, Phone, Sparkles, Twitter } from "lucide-react";

interface QuickLink {
  href: string;
  label: string;
}

interface ContactDetail {
  icon: string;
  text: string;
}

const Footer: React.FC = () => {
  const { direction, language } = useLanguage();
  const locale = language as "ar" | "en";
  const currentYear = new Date().getFullYear();

  const { getLocalizedValue, getValueForLocale } = useWebsiteContent("footer");

  // ===== محتوى CMS =====
  const mission = (getValueForLocale("footer_mission", locale) ?? "") as string;

  const quickLinksLocalized = getLocalizedValue<QuickLink[]>("footer_quick_links", {
    ar: [],
    en: [],
  });
  const quickLinks =
    (quickLinksLocalized[locale] ?? quickLinksLocalized.en ?? []).filter(Boolean);

  const serviceHighlightsLocalized = getLocalizedValue<string[]>("footer_services", {
    ar: [],
    en: [],
  });
  const serviceHighlights =
    (serviceHighlightsLocalized[locale] ?? serviceHighlightsLocalized.en ?? []).filter(Boolean);

  const contactDetailsLocalized = getLocalizedValue<ContactDetail[]>("footer_contact_details", {
    ar: [],
    en: [],
  });
  const contactDetails =
    (contactDetailsLocalized[locale] ?? contactDetailsLocalized.en ?? []).filter(Boolean);

  const scrollTo = (href: string) => {
    const element = document.querySelector<HTMLElement>(href);
    if (element) smoothScrollToElement(element, { offset: 90, duration: 950 });
  };

  const headingClass =
    "font-semibold text-lg sm:text-xl text-white dark:text-slate-100 mb-4 font-cairo";
  const linkClass =
    "text-slate-300 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-colors duration-300 text-sm inline-block hover:translate-x-1 rtl:hover:-translate-x-1";

  return (
    <footer className="relative overflow-hidden border-t border-border/50 bg-gradient-to-br from-slate-900 via-slate-800/70 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-black">
      {/* تأثير النيون الخفيف */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10 dark:animate-footer-glow" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 overflow-hidden">
        <span className="absolute inset-0 h-full w-[200%] bg-gradient-to-r from-accent via-primary to-gold opacity-75 animate-footer-marquee dark:from-gold dark:via-neon dark:to-primary" />
      </div>

      <div className="relative mx-auto w-full max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8">
        {/* ===== الشبكة الرئيسية ===== */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-14">
          {/* ===== الشعار والمهمة ===== */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BrandLogo variant="full" className="h-10 w-10" />
              <div className="flex flex-col text-sm text-slate-200 dark:text-slate-100">
                <span className="font-semibold tracking-wide">{direction === "rtl" ? "أفوكات" : "Avocat"}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {direction === "rtl" ? "منصة التحول القانوني" : "Legal transformation platform"}
                </span>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-slate-300 dark:text-slate-400">
              {mission
                ? mission
                : language === "ar"
                  ? "رائدون في التحول الرقمي القانوني، نقدم حلولاً متطورة للممارسات القانونية الحديثة."
                  : "Leading legal digital transformation with advanced solutions for modern legal practices."}
            </p>

            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200 shadow-inner backdrop-blur dark:border-white/5 dark:bg-white/10">
              <Sparkles className="h-4 w-4 text-gold" />
              <span>{direction === "rtl" ? "خبرة قانونية مدعومة بالتقنية" : "Legal expertise powered by technology"}</span>
            </div>
          </div>

          {/* ===== الروابط السريعة ===== */}
          <div className="space-y-4">
            <h4 className={headingClass}>
              {direction === "rtl" ? "روابط سريعة" : "Quick Links"}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(link.href);
                    }}
                    className={linkClass}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== الخدمات ===== */}
          <div className="space-y-4">
            <h4 className={headingClass}>
              {direction === "rtl" ? "خدماتنا" : "Our Services"}
            </h4>
            <ul className="space-y-3">
              {serviceHighlights.length > 0
                ? serviceHighlights.map((service, i) => (
                    <li key={i}>
                      <span className="text-slate-300 dark:text-slate-400 hover:text-gold dark:hover:text-gold transition-colors duration-300 cursor-pointer text-sm inline-block hover:translate-x-1 rtl:hover:-translate-x-1">
                        {service}
                      </span>
                    </li>
                  ))
                : [
                    direction === "rtl" ? "أنظمة الإدارة القانونية" : "Legal Management",
                    direction === "rtl" ? "حماية البيانات" : "Data Protection",
                    direction === "rtl" ? "التدريب القانوني" : "Legal Training",
                    direction === "rtl" ? "الخدمات الحكومية" : "Government Services",
                  ].map((s, i) => (
                    <li key={i}>
                      <span className="text-slate-300 dark:text-slate-400 hover:text-gold transition-colors duration-300 text-sm inline-block hover:translate-x-1 rtl:hover:-translate-x-1">
                        {s}
                      </span>
                    </li>
                  ))}
            </ul>
          </div>

          {/* ===== معلومات التواصل ===== */}
          <div className="space-y-4">
            <h4 className={headingClass}>
              {direction === "rtl" ? "معلومات التواصل" : "Contact Info"}
            </h4>
            <div className="space-y-4">
              {contactDetails.length > 0
                ? contactDetails.map((detail, i) => {
                    const Icon =
                      detail.icon === "phone"
                        ? Phone
                        : detail.icon === "mail"
                        ? Mail
                        : detail.icon === "map"
                        ? MapPin
                        : detail.icon === "linkedin"
                        ? Linkedin
                        : detail.icon === "twitter"
                        ? Twitter
                        : null;

                    return (
                      <div
                        key={i}
                        className="flex items-center space-x-3 rtl:space-x-reverse group"
                      >
                        {Icon && (
                          <Icon className="w-5 h-5 text-gold flex-shrink-0 group-hover:scale-110 transition-transform" />
                        )}
                        <span className="text-slate-300 dark:text-slate-400 text-sm">
                          {detail.text}
                        </span>
                      </div>
                    );
                  })
                : [
                    {
                      icon: Phone,
                      text: "+966 11 234 5678",
                    },
                    {
                      icon: Mail,
                      text: "info@avocat.sa",
                    },
                    {
                      icon: MapPin,
                      text:
                        direction === "rtl"
                          ? "الرياض، المملكة العربية السعودية"
                          : "Riyadh, Saudi Arabia",
                    },
                  ].map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-3 rtl:space-x-reverse group"
                    >
                      <d.icon className="w-5 h-5 text-gold flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-slate-300 dark:text-slate-400 text-sm">
                        {d.text}
                      </span>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* ===== الشريط السفلي ===== */}
        <div className="mt-12 border-t border-slate-700/50 pt-8 dark:border-slate-800/50">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-slate-400 dark:text-slate-500 md:flex-row md:text-left">
            <p className="max-w-xl">
              {direction === "rtl"
                ? `© ${currentYear} مكتب أفوكات للمحاماة. جميع الحقوق محفوظة.`
                : `© ${currentYear} Avocat Law Firm. All rights reserved.`}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="#"
                className="transition-colors duration-300 hover:text-accent dark:hover:text-accent"
              >
                {direction === "rtl" ? "سياسة الخصوصية" : "Privacy Policy"}
              </a>
              <a
                href="#"
                className="transition-colors duration-300 hover:text-accent dark:hover:text-accent"
              >
                {direction === "rtl" ? "الشروط والأحكام" : "Terms of Service"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
