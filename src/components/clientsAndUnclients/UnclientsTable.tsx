import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, Pencil, Trash2 } from 'lucide-react';
 
import DetailsTable, { DetailsTableColumn } from '@/components/common/DetailsTable';
 
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { getUnclients, deleteUnclient } from '@/api/unclients.service';
import type { Unclient } from '@/types/unclients';
import UnclientFormDialog from './UnclientFormDialog';
import type { UnclientFormMode } from './types';

const UnclientsTable = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<UnclientFormMode>('create');
  const [selectedUnclient, setSelectedUnclient] = useState<Unclient | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Unclient | null>(null);

  const unclientsQuery = useQuery({
    queryKey: ['unclients'],
    queryFn: async () => {
      const { data } = await getUnclients();
 
      return data ?? [];
 
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUnclient(String(id)),
    onSuccess: () => {
      toast({ title: t('unclients.messages.deleteSuccess') });
      queryClient.invalidateQueries({ queryKey: ['unclients'] });
    },
    onError: () => {
      toast({
        title: t('unclients.messages.deleteErrorTitle'),
        description: t('unclients.messages.deleteErrorDescription'),
        variant: 'destructive',
      });
    },
    onSettled: () => setConfirmDelete(null),
  });

  const unclients = unclientsQuery.data ?? [];

  const columns = useMemo<DetailsTableColumn<Unclient>[]>(
    () => [
      {
        key: 'slug',
        header: t('unclients.list.table.slug'),
        accessor: (unclient) => unclient.slug ?? '',
        render: (unclient) => unclient.slug ?? '—',
        sortable: true,
      },
      {
        key: 'name',
        header: t('unclients.list.table.name'),
        accessor: (unclient) => unclient.name ?? '',
        render: (unclient) => unclient.name ?? '—',
        sortable: true,
      },
      {
        key: 'identity',
        header: t('unclients.list.table.identity'),
        accessor: (unclient) => unclient.identity_number ?? '',
        render: (unclient) => unclient.identity_number ?? '—',
        sortable: true,
      },
      {
        key: 'phone',
        header: t('unclients.list.table.phone'),
        accessor: (unclient) => unclient.phone_number ?? '',
        render: (unclient) => unclient.phone_number ?? '—',
        sortable: true,
      },
      {
        key: 'email',
        header: t('unclients.list.table.email'),
        accessor: (unclient) => unclient.email ?? '',
        render: (unclient) => unclient.email ?? '—',
        sortable: true,
      },
    ],
    [t],
  );

  const openDialog = (mode: UnclientFormMode, unclient?: Unclient) => {
    setDialogMode(mode);
    setSelectedUnclient(unclient ?? null);
    setDialogOpen(true);
  };

  return (
    <>
      <DetailsTable
        data={unclients}
        columns={columns}
        enableSorting
        enableSearch
        enableExport
        enablePagination
        exportFileName="unclients"
        isLoading={unclientsQuery.isLoading}
        emptyMessage={
          unclientsQuery.isLoading ? t('common.loading') : t('unclients.list.empty')
        }
        onAdd={() => openDialog('create')}
        addButtonLabel={t('unclients.list.add')}
        actionsHeader={t('unclients.list.table.actions')}
        renderActions={(unclient) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => openDialog('view', unclient)}
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">{t('unclients.list.actions.view')}</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => openDialog('edit', unclient)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">{t('unclients.list.actions.edit')}</span>
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={() => setConfirmDelete(unclient)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">{t('unclients.list.actions.delete')}</span>
            </Button>
          </div>
        )}
      />

      <UnclientFormDialog
        open={dialogOpen}
        mode={dialogMode}
        initialData={selectedUnclient ?? undefined}
        onOpenChange={setDialogOpen}
        onSaved={() => queryClient.invalidateQueries({ queryKey: ['unclients'] })}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title={
          confirmDelete
            ? t('unclients.list.confirmDeleteTitle', { name: confirmDelete.name })
            : ''
        }
        description={t('unclients.list.confirmDeleteDescription')}
        confirmLabel={t('unclients.list.confirmDelete')}
        cancelLabel={t('common.cancel')}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (confirmDelete) {
            deleteMutation.mutate(confirmDelete.id);
          }
        }}
      />
    </>
  );
};

export default UnclientsTable;
