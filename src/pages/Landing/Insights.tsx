import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { useWebsiteCollection } from "@/hooks/useWebsiteCollection";
import SectionTitle from '@/components/SectionTitle';
import type { ArticleApi, Locale } from "@/types/website";
import { BrainCircuit, Newspaper, ShieldAlert } from "lucide-react";

const articleIcons = [BrainCircuit, Newspaper, ShieldAlert];

const Insights: React.FC = () => {
  const { language, direction } = useLanguage();
  const locale = language as Locale;
  const isArabic = language === "ar";
  const { getValueForLocale } = useWebsiteContent('articles');
  const { data: articlesRaw } = useWebsiteCollection<ArticleApi>("/api/website/articles");

  const articlesData = useMemo<ArticleApi[]>(() => {
    if (Array.isArray(articlesRaw)) {
      return articlesRaw as ArticleApi[];
    }

    const nested = (articlesRaw as { data?: ArticleApi[] } | null)?.data;
    return Array.isArray(nested) ? nested : [];
  }, [articlesRaw]);

  const badge = getValueForLocale('articles_badge', locale) ?? '';
  const title = getValueForLocale('articles_title', locale) ?? '';
  const description = getValueForLocale('articles_description', locale) ?? '';
  const cta = getValueForLocale('articles_cta', locale) ?? '';

  const articles = articlesData.slice(0, 3);

  return (
    <section id="insights" className="bg-background py-24" dir={direction}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2 text-xs font-semibold text-muted-foreground">
            <span>{badge}</span>
          </div>
          <SectionTitle className="mx-auto font-display" glowIntensity={0.68}>
            {title}
          </SectionTitle>
          <p className="mt-4 text-lg text-muted-foreground lg:text-xl">{description}</p>

        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {articles.map((article, index) => {
            const Icon = articleIcons[index % articleIcons.length];
            const localizedTitle = article.title[locale] ?? "";
            const summary = article.summary[locale] ?? article.body[locale] ?? "";
            const tag = article.tag[locale] ?? "";

            return (
              <article
                key={article.slug ?? `${article.id}-${index}`}
                className="flex h-full flex-col rounded-3xl border border-border bg-card/80 p-8 shadow-elevated backdrop-blur transition-transform duration-500 hover:-translate-y-2 hover:shadow-premium"
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{tag}</span>
                </div>
                <div className={`space-y-4 ${isArabic ? "text-right" : "text-left"}`}>
                  <h3 className="text-xl font-semibold text-foreground">{localizedTitle}</h3>
                  <p className="text-base leading-relaxed text-muted-foreground">{summary}</p>
                </div>
                <div className={`mt-6 flex-1 border-t border-border pt-4 text-sm text-muted-foreground ${isArabic ? "text-right" : "text-left"}`}>
                  {cta}

                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Insights;
