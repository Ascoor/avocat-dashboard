import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import BrandLogo from "@/components/common/BrandLogo";
import LegalIcon from "@/components/common/LegalIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { sidebarGroups, type SidebarItem as SidebarItemType } from "@/config/sidebar";
import { getIconDesign } from "@/config/iconography";

const drawerVariants = {
  open: (rtl: boolean) => ({
    x: 0,
    transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] as const },
  }),
  closed: (rtl: boolean) => ({
    x: rtl ? 320 : -320,
    transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] as const },
  }),
};

const MobileDrawer: React.FC = () => {
  const location = useLocation();
  const { t, isRTL } = useLanguage();
  const { isMobileOpen, closeMobile } = useSidebar();

  // إغلاق drawer عند تغيير المسار
  useEffect(() => {
    closeMobile();
  }, [location.pathname, closeMobile]);

  // إغلاق عند الضغط على زر Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobileOpen) {
        closeMobile();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileOpen, closeMobile]);

  // منع التمرير عند فتح القائمة
  useEffect(() => {
    if (isMobileOpen) {
      document.documentElement.classList.add("overflow-hidden");
      return () => {
        document.documentElement.classList.remove("overflow-hidden");
      };
    }

    document.documentElement.classList.remove("overflow-hidden");
    return undefined;
  }, [isMobileOpen]);

  return (
    <AnimatePresence mode="wait">
      {isMobileOpen && (
        <>
          {/* الخلفية الشفافة */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
            className={cn(
              "fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm transition-opacity duration-base ease-smooth md:hidden"
            )}
          />

          {/* القائمة نفسها */}
          <motion.aside
            custom={isRTL}
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={cn(
              "fixed inset-y-0 z-[9999] flex h-full w-full max-w-[360px] flex-col border border-border bg-surface-overlay/90 backdrop-blur-2xl shadow-elegant transition-transform duration-300 ease-\[cubic-bezier(0.32,0.72,0,1)\] md:hidden",
              isRTL ? "right-0" : "left-0"
            )}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* رأس القائمة */}
            <div className="flex items-center justify-between border-b border-border bg-surface-raised/80 px-4 py-3">
              <BrandLogo variant="full" className="h-8" />
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMobile}
                className="h-9 w-9 rounded-full border border-border/80 text-foreground transition duration-base ease-comfort hover:-translate-y-0.5 hover:bg-brand-primary/10 hover:text-brand-primary hover:shadow-soft"
                aria-label={t("common.close")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* روابط القائمة */}
            <nav className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
              {sidebarGroups.map((group) => (
                <div key={group.key} className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground/70 dark:text-foreground/80">
                    {t(`sidebar.sections.${group.key}`)}
                  </p>
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <MobileNavItem key={item.key} item={item} onNavigate={closeMobile} t={t} />
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

interface MobileNavItemProps {
  item: SidebarItemType;
  onNavigate: () => void;
  t: (key: string) => string;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ item, onNavigate, t }) => {
  const hasChildren = item.children && item.children.length > 0;
  const design = getIconDesign(item.iconKey);
  const badgeStyle = {
    background: design.badgeGradient,
    boxShadow: design.shadow,
  } as const;

  if (hasChildren) {
    return (
      <div className="space-y-2 rounded-2xl border border-sidebar-border/60 bg-sidebar-surface/40 p-3">
        <div className="flex items-center gap-3 text-sm font-medium text-sidebar-text-strong">
          <span
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-2xl",
              design.badgeClass ?? "text-white",
            )}
            style={badgeStyle}
          >
            <LegalIcon iconKey={item.iconKey} width={26} height={26} aria-hidden />
          </span>
          <span className="truncate">{t(`nav.${item.key}`)}</span>
        </div>
        <div className="space-y-1">
          {item.children!.map((child) => {
            const childDesign = getIconDesign(child.iconKey);
            const childBadgeStyle = {
              background: childDesign.badgeGradient,
              boxShadow: childDesign.shadow,
            } as const;

            return (
              <NavLink
                key={child.key}
                to={child.path ?? "#"}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-base ease-smooth",
                    isActive
                      ? "bg-brand-primary/10 text-brand-primary"
                      : "text-foreground/80 hover:bg-brand-primary/5 hover:text-brand-primary dark:text-foreground",
                  )
                }
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl",
                    childDesign.badgeClass ?? "text-white",
                  )}
                  style={childBadgeStyle}
                >
                  <LegalIcon iconKey={child.iconKey} width={20} height={20} aria-hidden />
                </span>
                <span className="truncate">{t(`nav.${child.key}`)}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <NavLink
      to={item.path ?? "#"}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition-colors duration-base ease-smooth",
      isActive
        ? "bg-brand-primary/10 text-brand-primary"
        : "text-foreground/80 hover:bg-brand-primary/5 hover:text-brand-primary dark:text-foreground",
    )
  }
    >
      <span
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-2xl",
          design.badgeClass ?? "text-white",
        )}
        style={badgeStyle}
      >
        <LegalIcon iconKey={item.iconKey} width={24} height={24} aria-hidden />
      </span>
      <span className="truncate">{t(`nav.${item.key}`)}</span>
    </NavLink>
  );
};

export default MobileDrawer;
