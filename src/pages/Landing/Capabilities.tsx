import { useCallback, useMemo } from 'react';
import { Cpu, Layers, ShieldEllipsis } from 'lucide-react';

import SectionTitle from '@/components/SectionTitle';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';
import type { ContentBlock, Locale } from '@/types/website';

    const iconLookup: Record<string, typeof Layers> = {
      layers: Layers,
      cpu: Cpu,
      shieldellipsis: ShieldEllipsis,
    };

    const Capabilities: React.FC = () => {
      const { language } = useLanguage();
      const isArabic = language === 'ar';
      const locale = language as Locale;
      const { contentBlocks, getValueForLocale } = useWebsiteContent('capabilities');

      const getString = useCallback(
        (key: string, fallback = ''): string =>
          getValueForLocale(key, locale, fallback),
        [getValueForLocale, locale]
      );

      const header = {
        badge: getString('capabilities_badge'),
        title: getString('capabilities_title'),
        subtitle: getString('capabilities_subtitle'),
      };

      const capabilities = useMemo(() => {
        return contentBlocks
          .filter((block) => block.key.startsWith('capabilities_item_'))
          .map((block) => mapCapability(block, locale));
      }, [contentBlocks, locale]);

      return (
        <section id="capabilities" className="relative overflow-hidden py-24"
          dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/15 to-background" />

        
          <div className="container relative mx-auto px-4 lg:px-8">
            <div className="mb-16 text-center">
              <div className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-2 text-xs uppercase tracking-widest text-muted-foreground">
                <span>{header.badge}</span>
              </div>

              <div className="relative mx-auto mt-8 inline-flex max-w-3xl flex-col items-center overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary-hover to-accent p-[1px]">
                <div className="relative w-full overflow-hidden rounded-[calc(1.5rem-1px)] bg-gradient-to-r from-background/95 via-background/90 to-background/95 px-8 py-10 shadow-header-light transition-shadow duration-500 dark:from-secondary/40 dark:via-primary-darker/60 dark:to-secondary/40 dark:shadow-header-dark">
                  <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-aurora opacity-0 blur-3xl transition-opacity duration-500 dark:opacity-20" />
                  <SectionTitle
                    className="mx-auto text-center font-display"
                    glowIntensity={0.7}
                  >
                    {header.title}
                  </SectionTitle>
                  <p className="mt-3 text-lg leading-relaxed text-muted-foreground/90 lg:text-xl">
                    {header.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Capabilities Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
              {capabilities.map((capability, index) => {
                const Icon = capability.Icon;
                return (
                  <div
                    key={`${capability.title}-${index}`}
                    className="h-full rounded-3xl border border-border bg-card/80 shadow-elevated backdrop-blur transition-transform duration-500 hover:-translate-y-2 hover:shadow-premium"
                  >
                    {/* Card Header */}
                <div className="mb-6 flex items-center gap-3">
                      <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                            <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-text-strong">
                        {capability.title}
                      </h3>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-4">
                      <p className="leading-relaxed text-muted-foreground">
                        {capability.description}
                      </p>

                      {/* Points List */}
                <ul className="space-y-3">
      {capability.points.map((point, i) => (
        <li
          key={i}
          className="flex items-center gap-2 flex-row"
        >
          {/* رقم التعداد */}
          <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-accent bg-card text-xs font-bold text-accent shadow-glow">
            {i + 1}
          </span>

          {/* النص */}
          <span className="leading-relaxed">{point}</span>
        </li>
      ))}
    </ul>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    };

    function mapCapability(block: ContentBlock, locale: Locale) {
      const localized = block.value as unknown as {
        ar?: { icon?: string; title?: string; description?: string; points?: string[] } | null;
        en?: { icon?: string; title?: string; description?: string; points?: string[] } | null;
      };

      const fallback = localized.en ?? {};
      const data = localized[locale] ?? fallback ?? {};
      const iconKey = (data.icon ?? fallback.icon ?? 'layers').toLowerCase();
      const Icon = iconLookup[iconKey] ?? Layers;

      return {
        Icon,
        title: data.title ?? fallback.title ?? '',
        description: data.description ?? fallback.description ?? '',
        points: (data.points ?? fallback.points ?? []).filter(Boolean),
      };
}

export default Capabilities;
