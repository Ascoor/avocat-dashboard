import React, { ReactNode } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import BrandLogo from '@/components/common/BrandLogo';
import LanguageToggle from '@/components/ui/language-toggle';

export interface AuthHighlight {
  icon: ReactNode;
  text: string;
}

export interface AuthLayoutProps {
  heroSide?: 'left' | 'right';
  toolbar?: ReactNode;
  hero: {
    badge?: ReactNode;
    title: string;
    description: string;
    highlights?: AuthHighlight[];
    stats?: Array<{ label: string; value: string }>;
  };
  card: {
    icon?: ReactNode;
    title: string;
    description?: string;
    content: ReactNode;
  };
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  heroSide = 'left',
  toolbar,
  hero,
  card,
}) => {
  const { direction, isRTL } = useLanguage();
  const shouldReverse = isRTL ? heroSide === 'right' : heroSide === 'left';

  return (
    <div
      className="min-h-screen bg-background"
      dir={direction}
    >
      {/* Toolbar */}
      {toolbar && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          {toolbar}
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Hero Section */}
        <div
          className={cn(
            'hidden lg:flex lg:w-1/2 flex-col justify-center px-12 py-16',
            'bg-gradient-to-br from-brand-primary via-primary-glow to-slate-bg',
            'relative overflow-hidden'
          )}
        >
          <div className="relative z-10 space-y-8">
            {hero.badge && (
              <div className="flex items-center gap-2 text-gold-light">
                {hero.badge}
              </div>
            )}

            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white lg:text-5xl">
                {hero.title}
              </h1>
              <p className="text-lg text-white/90">
                {hero.description}
              </p>
            </div>

            {hero.highlights && hero.highlights.length > 0 && (
              <div className="space-y-4">
                {hero.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3 text-white/90">
                    <div className="mt-1 text-gold-light">
                      {highlight.icon}
                    </div>
                    <p>{highlight.text}</p>
                  </div>
                ))}
              </div>
            )}

            {hero.stats && hero.stats.length > 0 && (
              <div className="grid grid-cols-3 gap-4 pt-8">
                {hero.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-gold blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-exclusive blur-3xl" />
          </div>
        </div>

        {/* Card Section */}
        <div
          className={cn(
            'flex w-full lg:w-1/2 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-12',
            shouldReverse && 'lg:order-first'
          )}
        >
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <BrandLogo variant="icon" className="mx-auto h-16 mb-4" />
              <BrandLogo variant="text" className="mx-auto h-12" />
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
              {card.icon && (
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    {card.icon}
                  </div>
                </div>
              )}

              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-foreground">{card.title}</h2>
                {card.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
                )}
              </div>

              {card.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
