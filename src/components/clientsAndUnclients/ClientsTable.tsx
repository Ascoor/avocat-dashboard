import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Pencil, Trash2 } from 'lucide-react';

import DetailsTable, { DetailsTableColumn } from '@/components/common/DetailsTable';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  updateClient,
} from '@/api/clients.service';
import { useClients, useDeleteClient } from '@/hooks/useClients';
import type { Client, ClientFormMode } from '@/types/clients';
import ClientFormDialog from './ClientFormDialog';

const statusLabelKey: Record<Client['status'], string> = {
  active: 'clients.status.active',
  inactive: 'clients.status.inactive',
};

const statusBadgeClass: Record<Client['status'], string> = {
  active:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700/60 dark:bg-emerald-950/60 dark:text-emerald-200',
  inactive:
    'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-200',
};

const ClientsTable = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { clients, isLoading: isClientsLoading } = useClients();
  const {
    deleteClient: deleteClientMutation,
    isLoading: isDeletingClient,
  } = useDeleteClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<ClientFormMode>('create');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Client | null>(null);

  const toggleStatusMutation = useMutation({
    mutationFn: (client: Client) =>
      updateClient(String(client.id), {
        status: client.status === 'active' ? 'inactive' : 'active',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: () => {
      toast({
        title: t('clients.messages.toggleErrorTitle'),
        description: t('clients.messages.toggleErrorDescription'),
        variant: 'destructive',
      });
    },
  });

  const safeClients = clients ?? [];

  const columns = useMemo<DetailsTableColumn<Client>[]>(
    () => [
      {
        key: 'slug',
        header: t('clients.list.table.slug'),
        accessor: (client) => client.slug ?? '',
        render: (client) => client.slug ?? '—',
        sortable: true,
      },
      {
        key: 'name',
        header: t('clients.list.table.name'),
        accessor: (client) => client.name ?? '',
        render: (client) => client.name ?? '—',
        sortable: true,
      },
      {
        key: 'identity',
        header: t('clients.list.table.identity'),
        accessor: (client) => client.identity_number ?? '',
        render: (client) => client.identity_number ?? '—',
        sortable: true,
      },
      {
        key: 'phone',
        header: t('clients.list.table.phone'),
        accessor: (client) => client.phone_number ?? '',
        render: (client) => client.phone_number ?? '—',
        sortable: true,
      },
      {
        key: 'status',
        header: t('clients.list.table.status'),
        accessor: (client) => client.status,
        render: (client) => {
          const label = t(statusLabelKey[client.status]);
          const classes = statusBadgeClass[client.status];
          return (
            <button
              type="button"
              onClick={() => toggleStatusMutation.mutate(client)}
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${classes}`}
            >
              {label}
            </button>
          );
        },
        sortable: true,
      },
    ],
    [t, toggleStatusMutation],
  );

  const openDialog = (mode: ClientFormMode, client?: Client) => {
    setDialogMode(mode);
    setSelectedClient(client ?? null);
    setDialogOpen(true);
  };

  return (
    <>
      <DetailsTable
        data={safeClients}
        columns={columns}
        enableSorting
        enableSearch
        enableExport
        enablePagination
        exportFileName="clients"
        isLoading={isClientsLoading}
        emptyMessage={
          isClientsLoading ? t('common.loading') : t('clients.list.empty')
        }
        onAdd={() => openDialog('create')}
        addButtonLabel={t('clients.list.add')}
        actionsHeader={t('clients.list.table.actions')}
        renderActions={(client) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => openDialog('view', client)}
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">{t('clients.list.actions.view')}</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => openDialog('edit', client)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">{t('clients.list.actions.edit')}</span>
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={() => setConfirmDelete(client)}
              disabled={isDeletingClient}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">{t('clients.list.actions.delete')}</span>
            </Button>
          </div>
        )}
      />

      <ClientFormDialog
        open={dialogOpen}
        mode={dialogMode}
        initialData={selectedClient ?? undefined}
        onOpenChange={setDialogOpen}
        onSaved={() => queryClient.invalidateQueries({ queryKey: ['clients'] })}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title={
          confirmDelete
            ? t('clients.list.confirmDeleteTitle', { name: confirmDelete.name })
            : ''
        }
        description={t('clients.list.confirmDeleteDescription')}
        confirmLabel={t('clients.list.confirmDelete')}
        cancelLabel={t('common.cancel')}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (confirmDelete) {
            deleteClientMutation(String(confirmDelete.id), {
              onSuccess: () => {
                toast({ title: t('clients.messages.deleteSuccess') });
              },
              onError: () => {
                toast({
                  title: t('clients.messages.deleteErrorTitle'),
                  description: t('clients.messages.deleteErrorDescription'),
                  variant: 'destructive',
                });
              },
              onSettled: () => setConfirmDelete(null),
            });
          }
        }}
      />
    </>
  );
};

export default ClientsTable;
