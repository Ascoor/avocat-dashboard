import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from 'lucide-react';

import { getLawyerById } from '@/api/lawyers.service';
import { getSessionsByLawyerId } from '@/api/sessions.service';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import DetailsTable, { DetailsTableColumn } from '@/components/common/DetailsTable';
import { LegalSession } from '@/types/legalCase';
import { Lawyer } from '@/types/lawyers';

const LawyerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { t, isRTL } = useLanguage();

  const lawyerQuery = useQuery({
    queryKey: ['lawyer', id],
    queryFn: async () => (await getLawyerById(String(id))).data,
    enabled: !!id,
  });

  const sessionsQuery = useQuery({
    queryKey: ['lawyer-sessions', id],
    queryFn: async () => (await getSessionsByLawyerId(String(id))).data,
    enabled: !!id,
  });

  const sessionColumns: DetailsTableColumn<LegalSession>[] = useMemo(
    () => [
      {
        key: 'date',
        header: t('legalCaseDetails.sessions.columns.date'),
        accessor: (session) => session.session_date ?? '',
        render: (session) => session.session_date ?? '—',
        sortable: true,
      },
      {
        key: 'court',
        header: t('legalCaseDetails.sessions.columns.court'),
        accessor: (session) => session.court?.name ?? '',
        render: (session) => session.court?.name ?? '—',
        sortable: true,
      },
      {
        key: 'result',
        header: t('legalCaseDetails.sessions.columns.result'),
        accessor: (session) => session.result ?? '',
        render: (session) => session.result ?? '—',
        sortable: true,
      },
      {
        key: 'status',
        header: t('legalCaseDetails.sessions.columns.status'),
        accessor: (session) => session.status ?? '',
        render: (session) => session.status ?? '—',
        sortable: true,
      },
    ],
    [t],
  );

  const lawyer: Lawyer | undefined = lawyerQuery.data;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-9 w-9">
          <Link to="/dashboard/lawyers">
            <ArrowLeft className={isRTL ? 'rotate-180' : ''} />
            <span className="sr-only">{t('common.backToDashboard')}</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-text-strong">
            {t('lawyers.detail.title')}
          </h1>
          <p className="text-sm text-text-muted">
            {lawyer?.name}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <GlassCard variant="primary" className="space-y-6 border border-border/60 bg-gradient-card/80 p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                {t('lawyers.detail.about')}
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-text-strong">
                <li className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{lawyer?.birthdate ?? '—'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-text-muted">{t('lawyers.form.labels.identity_number')}</span>
                  <span>{lawyer?.identity_number ?? '—'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-text-muted">{t('lawyers.form.labels.gender')}</span>
                  <span>{lawyer?.gender ?? '—'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-text-muted">{t('lawyers.form.labels.religion')}</span>
                  <span>{lawyer?.religion ?? '—'}</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                {t('lawyers.detail.meta')}
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-text-strong">
                <li className="flex items-center gap-2">
                  <span className="text-text-muted">{t('lawyers.form.labels.law_reg_num')}</span>
                  <span>{lawyer?.law_reg_num ?? '—'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-text-muted">{t('lawyers.form.labels.lawyer_class')}</span>
                  <span>{lawyer?.lawyer_class ?? '—'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{lawyer?.address ?? '—'}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-surface-highlight/70 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
              {t('lawyers.detail.contact')}
            </h2>
            <div className="mt-3 grid gap-3 text-sm text-text-strong md:grid-cols-2">
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                {lawyer?.email ?? '—'}
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                {lawyer?.phone_number ?? '—'}
              </span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="space-y-4 border border-border/60 bg-card/80 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-strong">
              {t('lawyers.detail.sessions')}
            </h2>
            <span className="text-sm text-text-muted">
              {(sessionsQuery.data ?? []).length}
            </span>
          </div>
          <DetailsTable
            data={sessionsQuery.data ?? []}
            columns={sessionColumns}
            enableSorting
            enableExport
            exportFileName="lawyer-sessions"
            isLoading={sessionsQuery.isLoading}
            emptyMessage={t('legalCaseDetails.sessions.empty')}
          />
        </GlassCard>
      </div>
    </div>
  );
};

export default LawyerDetails;
