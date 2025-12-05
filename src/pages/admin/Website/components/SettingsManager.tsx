import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { resolveAssetUrl } from '@/utils/asset';
import PageEditor from './PageEditor/PageEditor';
import { getWebsitePage } from '@/api/websiteAdmin.service';
import type { ContentBlock, Locale, Localized, PageContent } from '@/types/website';
import useUserRoles from '@/hooks/useUserRoles';

interface LogoPreview {
  id: string;
  tag: string;
  src: string;
  alt: string;
}

const LOCALES: Locale[] = ['en', 'ar'];
const MODES: Array<'light' | 'dark'> = ['light', 'dark'];

const SettingsManager: React.FC = () => {
  const { can, isLoading: rolesLoading, isFetching: rolesFetching } = useUserRoles();
  const permissionsReady = !(rolesLoading || rolesFetching);
  const canViewSettings = permissionsReady && can('pages:view');

  const settingsQuery = useQuery({
    queryKey: ['admin-website-page', 'settings'],
    queryFn: () => getWebsitePage('settings'),
    enabled: canViewSettings,
  });

  const previews = useMemo(() => buildLogoPreviews(settingsQuery.data), [settingsQuery.data]);

  if (!permissionsReady) {
    return (
      <div className="space-y-6">
        <Card className="border-border/70">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <LogoSkeletonGrid />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canViewSettings) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
        You do not have permission to view website settings.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Brand assets</CardTitle>
          <CardDescription>Logos currently served to the public website.</CardDescription>
        </CardHeader>
        <CardContent>
          {settingsQuery.isLoading ? (
            <LogoSkeletonGrid />
          ) : previews.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {previews.map((preview) => (
                <div
                  key={preview.id}
                  className="space-y-3 rounded-2xl border border-border/60 bg-background/75 p-4 shadow-inner-glow"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
                    {preview.tag}
                  </p>
                  <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-border/50 bg-muted/40 p-4">
                    <img
                      src={preview.src}
                      alt={preview.alt}
                      className="max-h-20 w-auto object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No branding assets available yet.</p>
          )}
        </CardContent>
      </Card>

      <PageEditor
        slug="settings"
        title="Global settings"
        description="Edit the raw logo references and other shared marketing content blocks returned by the website API."
      />
    </div>
  );
};

const LogoSkeletonGrid: React.FC = () => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <Skeleton key={index} className="h-32 rounded-2xl" />
    ))}
  </div>
);

function buildLogoPreviews(page?: PageContent | null): LogoPreview[] {
  if (!page) {
    return [];
  }

  const blocks = page.content_blocks ?? [];
  const getBlock = (key: string): ContentBlock | undefined =>
    blocks.find((block) => block.key === key);

  const siteLogo = getBlock('site_logo')?.value as Localized<string> | undefined;
  const logoIcon = getBlock('logo_icon')?.value as Localized<Record<'light' | 'dark', string>> | undefined;
  const logoText = getBlock('logo_text')?.value as Localized<Record<'light' | 'dark', string>> | undefined;
  const logoFull = getBlock('logo_full')?.value as Localized<Record<'light' | 'dark', string>> | undefined;

  const previews: LogoPreview[] = [];

  const pushPreview = (id: string, label: string, src: string | undefined) => {
    if (!src) return;
    previews.push({ id, tag: label, src, alt: label });
  };

  if (siteLogo) {
    LOCALES.forEach((locale) => {
      const src = resolveAssetUrl(siteLogo[locale] ?? siteLogo.en ?? undefined) ?? undefined;
      const localeLabel = locale === 'ar' ? 'Arabic' : 'English';
      pushPreview(`site-${locale}`, `${localeLabel} primary`, src);
    });
  }

  const addLocalizedCollection = (
    value: Localized<Record<'light' | 'dark', string>> | undefined,
    label: string,
  ) => {
    if (!value) return;

    LOCALES.forEach((locale) => {
      const group = value[locale] ?? value.en;
      if (!group) return;

      MODES.forEach((mode) => {
        const src = resolveAssetUrl(group[mode] ?? undefined);
        const localeLabel = locale === 'ar' ? 'Arabic' : 'English';
        const modeLabel = mode === 'light' ? 'Light' : 'Dark';
        pushPreview(
          `${label}-${locale}-${mode}`,
          `${localeLabel} ${label.toLowerCase()} (${modeLabel})`,
          src,
        );
      });
    });
  };

  addLocalizedCollection(logoFull, 'Full logo');
  addLocalizedCollection(logoText, 'Wordmark');
  addLocalizedCollection(logoIcon, 'Icon');

  return previews;
}

export default SettingsManager;
