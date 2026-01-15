import { useCallback, useEffect, useState } from 'react';
import { CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import DetailsTable, { DetailsTableColumn } from '@/components/common/DetailsTable';
import { useToast } from '@/components/ui/use-toast';
import {
  getSessionsByLegCaseId,
  deleteSession,
} from '@/api/sessions.service';
import { LegalSession } from '@/types/legalCase';
import SessionModal from './SessionModal';
import { useLanguage } from '@/contexts/LanguageContext';
import CaseSection from './CaseSection';

interface SessionsSectionProps {
  caseId: string;
  onChanged: () => void;
}

const SessionsSection = ({ caseId, onChanged }: SessionsSectionProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [sessions, setSessions] = useState<LegalSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<LegalSession | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<LegalSession | null>(null);
  const [sectionOpen, setSectionOpen] = useState(true);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getSessionsByLegCaseId(caseId);
      setSessions(data.data ?? []);
    } catch (error) {
      console.error('Failed to load sessions', error);
      toast({
        title: t('legalCaseDetails.sessions.loadErrorTitle'),
        description: t('legalCaseDetails.sessions.loadErrorDescription'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [caseId, toast, t]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const openCreateModal = () => {
    setSectionOpen(true);
    setEditingSession(null);
    setModalOpen(true);
  };

  const openEditModal = (session: LegalSession) => {
    setSectionOpen(true);
    setEditingSession(session);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteSession(confirmDelete.id);
      toast({ title: t('legalCaseDetails.sessions.deleteSuccess') });
      setConfirmDelete(null);
      fetchSessions();
      onChanged();
    } catch (error) {
      console.error('Failed to delete session', error);
      toast({
        title: t('legalCaseDetails.sessions.deleteErrorTitle'),
        description: t('legalCaseDetails.sessions.deleteErrorDescription'),
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <CaseSection
        icon={CalendarCheck}
        title={t('legalCaseDetails.sessions.title')}
        subtitle={t('legalCaseDetails.sessions.subtitle')}
        open={sectionOpen}
        onOpenChange={setSectionOpen}
        
      >
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            {t('common.loading')}
          </div>
        ) : (
          <DetailsTable
            data={sessions}
            columns={createSessionColumns(t)}
            actionsHeader={t('legalCaseDetails.sessions.columns.actions')}
            renderActions={(session) => (
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditModal(session)}>
                  {t('legalCaseDetails.sessions.editButton')}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setConfirmDelete(session)}
                >
                  {t('legalCaseDetails.sessions.deleteButton')}
                </Button>
              </div>
            )}
            enableSorting
            enableExport
            exportFileName={`case-${caseId}-sessions`}
            isLoading={loading}
            onAdd={openCreateModal}
            addButtonLabel={t('legalCaseDetails.sessions.addButton')}
            emptyMessage={t('legalCaseDetails.sessions.empty')}
          />
        )}
      </CaseSection>

      <SessionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        caseId={caseId}
        initialData={editingSession ?? undefined}
        onSuccess={() => {
          fetchSessions();
          onChanged();
        }}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title={t('legalCaseDetails.sessions.deleteConfirmTitle')}
        description={t('legalCaseDetails.sessions.deleteConfirmDescription')}
        confirmLabel={t('legalCaseDetails.sessions.deleteButton')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleDelete}
        onClose={() => setConfirmDelete(null)}
      />
    </>
  );
};

const createSessionColumns = (
  t: ReturnType<typeof useLanguage>['t'],
): DetailsTableColumn<LegalSession>[] => [
  {
    key: 'date',
    header: t('legalCaseDetails.sessions.columns.date'),
    accessor: (session) => session.session_date ?? '',
    render: (session) => session.session_date ?? '—',
    sortable: true,
  },
  {
    key: 'lawyer',
    header: t('legalCaseDetails.sessions.columns.lawyer'),
    accessor: (session) => session.lawyer?.name ?? '',
    render: (session) => session.lawyer?.name ?? '—',
    sortable: true,
  },
  {
    key: 'roll',
    header: t('legalCaseDetails.sessions.columns.roll'),
    accessor: (session) => session.session_roll ?? '',
    render: (session) => session.session_roll ?? '—',
  },
  {
    key: 'court',
    header: t('legalCaseDetails.sessions.columns.court'),
    accessor: (session) => session.court?.name ?? '',
    render: (session) => session.court?.name ?? '—',
    sortable: true,
  },
  {
    key: 'orders',
    header: t('legalCaseDetails.sessions.columns.orders'),
    accessor: (session) => session.orders ?? '',
    render: (session) => session.orders ?? '—',
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
];

export default SessionsSection;
