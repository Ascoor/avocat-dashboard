import { lazy, Suspense, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLegalCase } from '@/hooks/useLegalCases';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
 
import {
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  ClipboardList,
  Gavel,
  Hash,
  Layers,
  Megaphone,
  Phone,
  Scale,
  UserCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const ClientsSection = lazy(() => import('./ClientsSection'));
const CourtsSection = lazy(() => import('./CourtsSection'));
const ProceduresSection = lazy(() => import('./ProceduresSection'));
const SessionsSection = lazy(() => import('./SessionsSection'));
const AdsSection = lazy(() => import('./AdsSection'));

const DetailsSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-10 w-40" />
    <Skeleton className="h-48 w-full" />
    <Skeleton className="h-96 w-full" />
  </div>
);

const LegalCaseDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('procedures');
  const [overviewExpanded, setOverviewExpanded] = useState(true);
 
  const OverviewToggleIcon = overviewExpanded
    ? ChevronDown
    : isRTL
    ? ChevronLeft
    : ChevronRight;
 

  const {
    data: legCase,
    isLoading,
    error,
    refetch,
  } = useLegalCase(id);

  const basicInfo = useMemo(() => {
    if (!legCase) return [];
    return [
      {
        label: t('legalCaseDetails.fields.slug'),
        value: legCase.slug ?? '—',
        icon: Hash,
      },
      {
        label: t('legalCaseDetails.fields.title'),
        value: legCase.title ?? '—',
        icon: Layers,
      },
      {
        label: t('legalCaseDetails.fields.status'),
        value: legCase.status ?? '—',
        icon: BadgeCheck,
      },
      {
        label: t('legalCaseDetails.fields.caseType'),
        value: legCase.case_type?.name ?? '—',
        icon: Scale,
      },
      {
        label: t('legalCaseDetails.fields.caseSubType'),
        value: legCase.case_sub_type?.name ?? '—',
        icon: ClipboardList,
      },
      {
        label: t('legalCaseDetails.fields.clientCapacity'),
        value: legCase.client_capacity ?? '—',
        icon: UserCircle2,
      },
    ];
  }, [legCase, t]);

  const opponentInfo = useMemo(() => {
    if (!legCase) return [];
    return [
      {
        label: t('legalCaseDetails.fields.litigantName'),
        value: legCase.litigants_name ?? '—',
        icon: UserCircle2,
      },
      {
        label: t('legalCaseDetails.fields.litigantPhone'),
        value: legCase.litigants_phone ?? '—',
        icon: Phone,
      },
      {
        label: t('legalCaseDetails.fields.lawyerName'),
        value: legCase.litigants_lawyer_name ?? '—',
        icon: Gavel,
      },
      {
        label: t('legalCaseDetails.fields.lawyerPhone'),
        value: legCase.litigants_lawyer_phone ?? '—',
        icon: Phone,
      },
    ];
  }, [legCase, t]);

  if (!id) {
    return (
      <div className="p-6">
        <Card className="p-6 text-destructive">
          {t('legalCaseDetails.fetchError')}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full border border-border/50 bg-surface-highlight/80 backdrop-blur-sm transition hover:border-primary/50 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{t('legalCaseDetails.back')}</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t('legalCaseDetails.title')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('legalCaseDetails.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {isLoading && <DetailsSkeleton />}

      {error && (
        <Card className="p-6 text-destructive">
          {t('legalCaseDetails.fetchError')}
        </Card>
      )}

      {!isLoading && legCase && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <GlassCard
              variant="primary"
              hover="glow"
              className="relative overflow-hidden border border-border/60 bg-surface-muted/80 p-6 md:p-8"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(var(--gradient-primary)))] from-primary/10 via-transparent to-transparent" />
              <div className="relative flex flex-col gap-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {t('legalCaseDetails.sections.basicInfo')}
                    </p>
                    <h2 className="text-2xl font-bold text-foreground">
                      {legCase.title ?? t('legalCaseDetails.title')}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2">
                      {legCase.slug && (
                        <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                          #{legCase.slug}
                        </Badge>
                      )}
                      {legCase.status && (
                        <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
                          {legCase.status}
                        </Badge>
                      )}
                      {legCase.case_type?.name && (
                        <Badge variant="outline" className="border-border/60 bg-surface-highlight/70 text-foreground">
                          {legCase.case_type.name}
                        </Badge>
                      )}
                    </div>
                  </div> 
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setOverviewExpanded((prev) => !prev)}
                    aria-label={overviewExpanded ? t('common.collapse') : t('common.expand')}
                    className="h-10 w-10 rounded-full border border-border/60 bg-background/60 text-muted-foreground transition hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
                  >
                    <OverviewToggleIcon className="h-4 w-4" />
                  </Button>
 
                </div>

                <AnimatePresence initial={false}>
                  {overviewExpanded && (
                    <motion.div
                      key="overview-content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-8 md:grid-cols-2">
                        <InfoList
                          title={t('legalCaseDetails.sections.basicInfo')}
                          items={basicInfo}
                          direction={isRTL ? 'rtl' : 'ltr'}
                        />
                        <InfoList
                          title={t('legalCaseDetails.sections.opponentInfo')}
                          items={opponentInfo}
                          direction={isRTL ? 'rtl' : 'ltr'}
                        />
                      </div>
                      {legCase.description && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.35, delay: 0.1 }}
                          className="mt-6 rounded-2xl border border-border/60 bg-surface-highlight/80 p-5 shadow-inner"
                        >
                          <h3 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                            {t('legalCaseDetails.fields.description')}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-text-strong">
                            {legCase.description}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </GlassCard>
          </motion.div>

          <Suspense fallback={<DetailsSkeleton />}>
            <ClientsSection
              caseId={id}
              clients={legCase.clients ?? []}
              onChanged={refetch}
            />
          </Suspense>

          <Suspense fallback={<DetailsSkeleton />}>
            <CourtsSection
              caseId={id}
              courts={legCase.courts ?? []}
              onChanged={refetch}
            />
          </Suspense>
          <Suspense fallback={<DetailsSkeleton />}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="flex flex-wrap justify-start gap-2 md:justify-center">
                <TabsTrigger
                  value="procedures"
                  className="group flex items-center gap-2 rounded-full border border-border/50 bg-surface-highlight/70 px-4 py-2 text-sm font-semibold text-muted-foreground transition data-[state=active]:border-primary/60 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <ClipboardList className="h-4 w-4 transition group-data-[state=active]:text-primary" />
                  {t('legalCaseDetails.tabs.procedures')}
                </TabsTrigger>
                <TabsTrigger
                  value="sessions"
                  className="group flex items-center gap-2 rounded-full border border-border/50 bg-surface-highlight/70 px-4 py-2 text-sm font-semibold text-muted-foreground transition data-[state=active]:border-primary/60 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <CalendarClock className="h-4 w-4 transition group-data-[state=active]:text-primary" />
                  {t('legalCaseDetails.tabs.sessions')}
                </TabsTrigger>
                <TabsTrigger
                  value="ads"
                  className="group flex items-center gap-2 rounded-full border border-border/50 bg-surface-highlight/70 px-4 py-2 text-sm font-semibold text-muted-foreground transition data-[state=active]:border-primary/60 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <Megaphone className="h-4 w-4 transition group-data-[state=active]:text-primary" />
                  {t('legalCaseDetails.tabs.ads')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="procedures">
                <ProceduresSection caseId={id} onChanged={refetch} />
              </TabsContent>
              <TabsContent value="sessions">
                <SessionsSection caseId={id} onChanged={refetch} />
              </TabsContent>
              <TabsContent value="ads">
                <AdsSection caseId={id} onChanged={refetch} />
              </TabsContent>
            </Tabs>
          </Suspense>

        </div>
      )}
    </div>
  );
};

interface InfoItem {
  label: string;
  value: string;
  icon?: LucideIcon;
}

const INFO_ACCENT_CLASSES = [
  'from-primary/20 via-primary/10 to-transparent',
  'from-sky-500/20 via-sky-500/10 to-transparent',
  'from-emerald-500/20 via-emerald-500/10 to-transparent',
  'from-amber-500/20 via-amber-500/10 to-transparent',
] as const;

const InfoList = ({
  title,
  items,
  direction,
}: {
  title: string;
  items: InfoItem[];
  direction: 'rtl' | 'ltr';
}) => (
  <div className="space-y-4" dir={direction}>
    <h3 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
      {title}
    </h3>
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item, index) => {
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={cn(
              'group relative overflow-hidden rounded-2xl border border-border/60 bg-surface-highlight/80 p-4 shadow-inner backdrop-blur-sm transition hover:border-primary/60',
              direction === 'rtl' ? 'text-right' : 'text-left',
            )}
          >
            <div
              className={cn(
                'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80',
                INFO_ACCENT_CLASSES[index % INFO_ACCENT_CLASSES.length],
              )}
            />
            <div className="relative flex items-center gap-3">
              {item.icon && (
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background/80 text-primary shadow-card ring-1 ring-primary/20">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
              )}
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  {item.label}
                </span>
                <span
                  className={cn(
                    'text-sm font-semibold text-text-strong',
                    direction === 'rtl' ? 'text-left' : 'text-right',
                  )}
                >
                  {item.value || '—'}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
);

export default LegalCaseDetails;
