import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import DetailsTable, { DetailsTableColumn } from '@/components/common/DetailsTable';
import PageHeader from '@/components/common/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLegalCases, useDeleteLegalCase } from '@/hooks/useLegalCases';
import { LegalCase } from '@/types/legalCase';
import AddEditLegalCaseModal from '@/components/legalCases/AddEditLegalCaseModal';
import { cn } from '@/lib/utils';

const statusClasses: Record<string, string> = {
  'جارى التنفيذ': 'border-amber-200 text-amber-700 dark:border-amber-500/40 dark:text-amber-100 bg-amber-50/70 dark:bg-amber-500/10',
  'قيد التنفيذ': 'border-orange-200 text-orange-700 dark:border-orange-500/40 dark:text-orange-100 bg-orange-50/70 dark:bg-orange-500/10',
  منتهية: 'border-emerald-200 text-emerald-700 dark:border-emerald-500/40 dark:text-emerald-100 bg-emerald-50/70 dark:bg-emerald-500/10',
  متداولة: 'border-blue-200 text-blue-700 dark:border-blue-500/40 dark:text-blue-100 bg-blue-50/70 dark:bg-blue-500/10',
  استيفاء: 'border-purple-200 text-purple-700 dark:border-purple-500/40 dark:text-purple-100 bg-purple-50/70 dark:bg-purple-500/10',
};

const statusEnglish: Record<string, string> = {
  'جارى التنفيذ': 'In progress',
  'قيد التنفيذ': 'Under execution',
  منتهية: 'Completed',
  متداولة: 'In court',
  استيفاء: 'Settlement',
};

const LegalCases = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { data: cases = [], isLoading, error } = useLegalCases();
  const deleteCase = useDeleteLegalCase();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);

  const secondaryLanguage = language === 'ar' ? 'en' : 'ar';

  const columns = useMemo<DetailsTableColumn<LegalCase>[]>(
    () => [
      {
        key: 'slug',
        header: t('legalCases.columns.fileNumber'),
        secondaryHeader: t('legalCases.columns.fileNumber', { lng: secondaryLanguage }),
        accessor: (item) => item.slug ?? '',
        render: (item) => item.slug ?? '—',
        sortable: true,
      },
      {
        key: 'clients',
        header: t('legalCases.columns.clients'),
        secondaryHeader: t('legalCases.columns.clients', { lng: secondaryLanguage }),
        accessor: (item) => item.clients?.map((client) => client.name).join(' ') ?? '',
        render: (item) => {
          if (!item.clients || item.clients.length === 0) {
            return <span className="text-muted-foreground">{t('legalCases.noClient')}</span>;
          }
          const [firstClient, ...others] = item.clients;
          return (
            <div className="flex flex-col items-start gap-1">
              <span>{firstClient.name}</span>
              {others.length > 0 && (
                <span className="text-xs text-destructive">
                  {t('legalCases.moreClients', { count: others.length })}
                </span>
              )}
            </div>
          );
        },
      },
      {
        key: 'client_capacity',
        header: t('legalCases.columns.clientCapacity'),
        secondaryHeader: t('legalCases.columns.clientCapacity', { lng: secondaryLanguage }),
        accessor: (item) => item.client_capacity ?? '',
        render: (item) => item.client_capacity ?? '—',
        sortable: true,
      },
      {
        key: 'title',
        header: t('legalCases.columns.subject'),
        secondaryHeader: t('legalCases.columns.subject', { lng: secondaryLanguage }),
        accessor: (item) => item.title ?? '',
        render: (item) => item.title ?? '—',
        sortable: true,
      },
      {
        key: 'case_sub_type',
        header: t('legalCases.columns.caseType'),
        secondaryHeader: t('legalCases.columns.caseType', { lng: secondaryLanguage }),
        accessor: (item) => item.case_sub_type?.name ?? '',
        render: (item) => item.case_sub_type?.name ?? '—',
        sortable: true,
      },
      {
        key: 'status',
        header: t('legalCases.columns.status'),
        secondaryHeader: t('legalCases.columns.status', { lng: secondaryLanguage }),
        accessor: (item) => item.status ?? '',
        render: (item) => (
          <Badge
            variant="outline"
            className={cn(
              'flex flex-col items-start gap-0.5 rounded-full border px-3 py-1 text-xs font-semibold leading-tight',
              statusClasses[item.status ?? ''] ?? 'border-border/60 text-muted-foreground',
            )}
          >
            <span className="text-sm leading-none">{item.status ?? '—'}</span>
            {item.status ? (
              <span className="text-[11px] font-medium leading-none opacity-80">
                {statusEnglish[item.status] ?? 'Status'}
              </span>
            ) : null}
          </Badge>
        ),
        sortable: true,
      },
    ],
    [secondaryLanguage, t],
  );

  const handleAddCase = () => {
    setSelectedCase(null);
    setIsModalOpen(true);
  };

  const handleEditCase = (id: string) => {
    const target = cases.find((item) => String(item.id) === id);
    if (target) {
      setSelectedCase(target);
      setIsModalOpen(true);
    }
  };

  const handleDeleteCase = (row: LegalCase) => {
    const confirmed = window.confirm(
      t('legalCases.confirmDelete', { title: row.title || row.slug }),
    );

    if (!confirmed) return;

    void deleteCase
      .mutateAsync(String(row.id))
      .then(() => {
        toast({ title: t('legalCases.deleteSuccess') });
      })
      .catch((mutationError) => {
        console.error('Failed to delete legal case', mutationError);
        toast({
          title: t('legalCases.deleteErrorTitle'),
          description: t('legalCases.deleteErrorDescription'),
          variant: 'destructive',
        });
      });
  };

  const handleViewCase = (id: string) => {
    navigate(`/dashboard/cases/${id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader iconKey="cases" title={t('legalCases.title')} subtitle={t('legalCases.subtitle')} />

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-destructive">
          {t('legalCases.fetchError')}
        </div>
      )}

      <DetailsTable
        data={cases}
        columns={columns}
        enableSorting
        enableExport
        exportFileName="legal-cases"
        isLoading={isLoading}
        emptyMessage={error ? t('legalCases.fetchError') : t('common.noData')}
        onAdd={handleAddCase}
        addButtonLabel={t('legalCases.addCase')}
        actionsHeader={t('common.actions')}
        renderActions={(legalCase) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleViewCase(String(legalCase.id))}
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">{t('common.view')}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleEditCase(String(legalCase.id))}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">{t('common.edit')}</span>
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleDeleteCase(legalCase)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">{t('common.delete')}</span>
            </Button>
          </div>
        )}
      />

      <AddEditLegalCaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedCase}
      />
    </div>
  );
};

export default LegalCases;
