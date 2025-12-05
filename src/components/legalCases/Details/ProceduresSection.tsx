import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useToast } from '@/components/ui/use-toast';
import {
  getProceduresByLegCaseId,
  deleteProcedure,
} from '@/api/procedures.service';
import { Procedure } from '@/types/legalCase';
import ProcedureModal from './ProcedureModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { ClipboardList } from 'lucide-react';
import CaseSection from './CaseSection';

interface ProceduresSectionProps {
  caseId: string;
  onChanged: () => void;
}

const ProceduresSection = ({ caseId, onChanged }: ProceduresSectionProps) => {
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Procedure | null>(null);
  const [sectionOpen, setSectionOpen] = useState(true);

  const fetchProcedures = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getProceduresByLegCaseId(caseId);
      setProcedures(data);
    } catch (error) {
      console.error('Failed to load procedures', error);
      toast({
        title: t('legalCaseDetails.procedures.loadErrorTitle'),
        description: t('legalCaseDetails.procedures.loadErrorDescription'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [caseId, toast, t]);

  useEffect(() => {
    fetchProcedures();
  }, [fetchProcedures]);

  const openCreateModal = () => {
    setSectionOpen(true);
    setEditingProcedure(null);
    setModalOpen(true);
  };

  const openEditModal = (procedure: Procedure) => {
    setSectionOpen(true);
    setEditingProcedure(procedure);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteProcedure(confirmDelete.id);
      toast({ title: t('legalCaseDetails.procedures.deleteSuccess') });
      setConfirmDelete(null);
      fetchProcedures();
      onChanged();
    } catch (error) {
      console.error('Failed to delete procedure', error);
      toast({
        title: t('legalCaseDetails.procedures.deleteErrorTitle'),
        description: t('legalCaseDetails.procedures.deleteErrorDescription'),
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <CaseSection
        icon={ClipboardList}
        title={t('legalCaseDetails.procedures.title')}
        subtitle={t('legalCaseDetails.procedures.subtitle')}
        open={sectionOpen}
        onOpenChange={setSectionOpen}
        toggleLabel={sectionOpen ? t('common.collapse') : t('common.expand')}
        actions={
          <Button onClick={openCreateModal} className="self-start sm:self-auto">
            {t('legalCaseDetails.procedures.addButton')}
          </Button>
        }
      >
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            {t('common.loading')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              dir={isRTL ? 'rtl' : 'ltr'}
              className="min-w-full border border-border/60 text-sm shadow-inner"
            >
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 text-left rtl:text-right">
                    {t('legalCaseDetails.procedures.columns.type')}
                  </th>
                  <th className="px-4 py-2 text-left rtl:text-right">
                    {t('legalCaseDetails.procedures.columns.lawyer')}
                  </th>
                  <th className="px-4 py-2 text-left rtl:text-right">
                    {t('legalCaseDetails.procedures.columns.endDate')}
                  </th>
                  <th className="px-4 py-2 text-left rtl:text-right">
                    {t('legalCaseDetails.procedures.columns.job')}
                  </th>
                  <th className="px-4 py-2 text-left rtl:text-right">
                    {t('legalCaseDetails.procedures.columns.result')}
                  </th>
                  <th className="px-4 py-2 text-left rtl:text-right">
                    {t('legalCaseDetails.procedures.columns.status')}
                  </th>
                  <th className="px-4 py-2 text-center">
                    {t('legalCaseDetails.procedures.columns.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {procedures.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-center text-muted-foreground" colSpan={7}>
                      {t('legalCaseDetails.procedures.empty')}
                    </td>
                  </tr>
                )}
                {procedures.map((procedure) => (
                  <tr
                    key={procedure.id}
                    className="border-t border-border/40 transition-colors hover:bg-muted/20"
                  >
                    <td className="px-4 py-2 text-sm text-foreground text-left rtl:text-right">
                      {procedure.procedure_type?.name ?? '—'}
                    </td>
                    <td className="px-4 py-2 text-sm text-foreground text-left rtl:text-right">
                      {procedure.lawyer?.name ?? '—'}
                    </td>
                    <td className="px-4 py-2 text-sm text-foreground text-left rtl:text-right">
                      {procedure.date_end ?? '—'}
                    </td>
                    <td className="px-4 py-2 text-sm text-foreground text-left rtl:text-right">
                      {procedure.job}
                    </td>
                    <td className="px-4 py-2 text-sm text-foreground text-left rtl:text-right">
                      {procedure.result ?? '—'}
                    </td>
                    <td className="px-4 py-2 text-sm text-foreground text-left rtl:text-right">
                      {procedure.status ?? '—'}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(procedure)}>
                          {t('legalCaseDetails.procedures.editButton')}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setConfirmDelete(procedure)}
                        >
                          {t('legalCaseDetails.procedures.deleteButton')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CaseSection>

      <ProcedureModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        caseId={caseId}
        initialData={editingProcedure ?? undefined}
        onSuccess={() => {
          fetchProcedures();
          onChanged();
        }}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title={t('legalCaseDetails.procedures.deleteConfirmTitle')}
        description={t('legalCaseDetails.procedures.deleteConfirmDescription')}
        confirmLabel={t('legalCaseDetails.procedures.deleteButton')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleDelete}
        onClose={() => setConfirmDelete(null)}
      />
    </>
  );
};

export default ProceduresSection;
