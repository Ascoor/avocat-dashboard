import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ThemeToggle, {
  themeToggleToneClassMap,
  themeToggleToneVariantMap,
  type ThemeToggleTone,
} from "@/components/ui/theme-toggle";
import BrandLogo from "@/components/common/BrandLogo";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import {
  Award,
  BookOpenText,
  LayoutDashboard,
  Menu,
  Phone,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";

type NavItem = {
  href: string;
  icon: typeof Scale;
  en: string;
  ar: string;
  type?: "anchor" | "route";
};

const navItems: NavItem[] = [
  { href: "#home", icon: Scale, en: "Home", ar: "الرئيسية" },
  { href: "#about", icon: BookOpenText, en: "About", ar: "من نحن" },
  { href: "#services", icon: ShieldCheck, en: "Services", ar: "الخدمات" },
  { href: "#achievements", icon: Award, en: "Achievements", ar: "الإنجازات" },
  { href: "#team", icon: Users, en: "Team", ar: "الفريق" },
  { href: "#contact", icon: Phone, en: "Contact", ar: "اتصل بنا" },
  {
    href: "/showcase",
    icon: LayoutDashboard,
    en: "Dashboard Showcase",
    ar: "معرض لوحات التحكم",
    type: "route",
  },
];

const highlightCopy = {
  en: "Legal Digital Transformation",
  ar: "التحول الرقمي القانوني",
};

const toggleCopy = {
  en: { label: "Switch to Arabic", aria: "Switch to Arabic" },
  ar: { label: "التبديل إلى الإنجليزية", aria: "التبديل إلى الإنجليزية" },
};

const LandingNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const { language, toggleLanguage, direction } = useLanguage();
  const navigate = useNavigate();

  const isDark = theme === "dark";
  const isArabic = language === "ar";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToAnchor = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsOpen(false);
  };

  const handleNavClick = (item: NavItem) => {
    if (item.type === "route") {
      setIsOpen(false);
      navigate(item.href);
      return;
    }
    scrollToAnchor(item.href);
  };
  const isTop = !isScrolled;
  const { label: toggleLabel, aria: toggleAria } = toggleCopy[language];
  const underlineAlignment = isArabic ? "right-0 origin-right" : "left-0 origin-left";

  const actionTone: ThemeToggleTone = isTop ? "hero" : isDark ? "dark" : "light";
  const actionVariant = themeToggleToneVariantMap[actionTone];
  const actionToneClasses = themeToggleToneClassMap[actionTone];
  const actionButtonBase = "rounded-full transition-all duration-300";
  const navTextColor = isTop
    ? "text-white/80 hover:text-white"
    : isDark
    ? "text-white/80 hover:text-white"
    : "text-foreground/80 hover:text-foreground";

  return (
    <nav
      dir={direction}
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-lg border-b border-border shadow-elevated"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          type="button"
          onClick={() => scrollToAnchor("#home")}
          className="flex items-center gap-3"
        >
          {/* موبايل: أيقونة فقط */}
          <div className="block sm:hidden">
            <BrandLogo
              variant="icon"
              className="h-10 w-10" 
              lang={language}
            />
          </div>

          {/* ديسكتوب: شعار كامل */}
          <div className="hidden sm:block">
            <BrandLogo
              variant="text"
              className="h-12"
              dark={isTop ? true : undefined}
              lang={language} 
            />
          </div>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 lg:flex">
        {navItems.map(({ href, icon: Icon, en, ar, type }) => {
  const label = isArabic ? ar : en;
  return (
    <button
      key={href}
      onClick={() => handleNavClick({ href, icon: Icon, en, ar, type })}
      className={`group relative flex items-center gap-2 text-sm font-medium tracking-wide transition-colors ${navTextColor}`}
    >
      <Icon
        className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${
          isDark ? "text-white" : "text-accent"
        }`}
      />
      <span className="relative">
        {label}
        <span
          className={`absolute -bottom-1 block h-0.5 w-full scale-x-0 transform transition-transform duration-300 group-hover:scale-x-100 ${underlineAlignment} ${
            isDark
              ? "bg-white/80"
              : "bg-gradient-to-r from-accent via-primary to-accent"
          }`}
        />
      </span>
    </button>
  );
})}

        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle tone={actionTone} />

          {/* Language */}
          <Button
            variant={actionVariant}
            size="icon"
            onClick={toggleLanguage}
            aria-label={toggleAria}
            className={`${actionButtonBase} ${actionToneClasses} ${
              isArabic ? "font-arabic" : "font-english"
            }`}
          >
            {isArabic ? "EN" : "AR"}
          </Button>

          {/* Login */}
          <Button
            type="button"
            onClick={() => navigate("/login")}
            variant={isDark ? "gold" : "chromatic"}
            size="lg"
            className="hidden lg:inline-flex rounded-full shadow-md transition-transform hover:-translate-y-0.5"
          >
            {isArabic ? "تسجيل الدخول" : "Client Login"}
          </Button>

          {/* Mobile Menu */}
          <Button
            variant={actionVariant}
            size="icon"
            className={`lg:hidden ${actionButtonBase} ${actionToneClasses}`}
            onClick={() => setIsOpen((p) => !p)}
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden border-t border-border/70 bg-background/95 backdrop-blur transition-all duration-300 lg:hidden ${
          isOpen ? "max-h-[560px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-4 px-4 py-6">
          <div
            className={`flex items-center justify-between ${
              isArabic ? "flex-row-reverse" : ""
            }`}
          >
            <div className="flex items-center gap-2 rounded-full border border-border/70 px-3 py-1 text-xs text-foreground/70">
              <Sparkles className="h-3 w-3 text-accent" />
              <span>{isArabic ? highlightCopy.ar : highlightCopy.en}</span>
            </div>

              <ThemeToggle tone={actionTone} />
          </div>

          {navItems.map(({ href, icon: Icon, en, ar, type }) => {
            const label = isArabic ? ar : en;
            return (
              <button
                key={href}
                onClick={() => handleNavClick({ href, icon: Icon, en, ar, type })}
                className={`group flex w-full items-center justify-between rounded-xl border border-transparent px-4 py-3 transition-all hover:border-accent/40 hover:bg-accent/10 ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                <div className="flex items-center gap-3 text-foreground">
                  <Icon className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              </button>
            );
          })}

          <Button
            type="button"
            onClick={() => navigate("/login")}
            variant={isDark ? "gold" : "chromatic"}
            className="w-full rounded-xl py-2 text-sm font-semibold shadow-md transition-transform hover:-translate-y-0.5"
          >
            {isArabic ? "تسجيل الدخول" : "Client Login"}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
