import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import DetailsTable, { DetailsTableColumn } from '@/components/common/DetailsTable';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { GlassCard } from '@/components/ui/glass-card';
import LawyerFormDialog from '@/components/lawyers/LawyerFormDialog';
import { getLawyers, deleteLawyer } from '@/api/lawyers.service';
import { Lawyer } from '@/types/lawyers';
import PageHeader from '../common/PageHeader';

const LawyersList = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [lawyerToDelete, setLawyerToDelete] = useState<Lawyer | null>(null);

  const { data, isLoading } = useQuery<Lawyer[]>({
    queryKey: ['lawyers'],
    queryFn: async () => (await getLawyers()).data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteLawyer(String(id)),
    onSuccess: () => {
      toast({ title: t('lawyers.form.messages.deleteSuccess') });
      queryClient.invalidateQueries({ queryKey: ['lawyers'] });
      setLawyerToDelete(null);
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('lawyers.form.messages.error'),
        variant: 'destructive',
      });
    },
  });

  const columns: DetailsTableColumn<Lawyer>[] = [
    {
      key: 'name',
      header: t('lawyers.list.table.name'),
      accessor: (lawyer) => lawyer.name,
      render: (lawyer) => lawyer.name,
      sortable: true,
    },
    {
      key: 'identity_number',
      header: t('lawyers.list.table.identity'),
      accessor: (lawyer) => lawyer.identity_number,
      render: (lawyer) => lawyer.identity_number,
      sortable: true,
    },
    {
      key: 'law_reg_num',
      header: t('lawyers.list.table.license'),
      accessor: (lawyer) => lawyer.law_reg_num,
      render: (lawyer) => lawyer.law_reg_num,
      sortable: true,
    },
    {
      key: 'lawyer_class',
      header: t('lawyers.list.table.class'),
      accessor: (lawyer) => lawyer.lawyer_class,
      render: (lawyer) => lawyer.lawyer_class,
      sortable: true,
    },
    {
      key: 'email',
      header: t('lawyers.list.table.email'),
      accessor: (lawyer) => lawyer.email,
      render: (lawyer) => lawyer.email,
      sortable: true,
    },
    {
      key: 'phone_number',
      header: t('lawyers.list.table.phone'),
      accessor: (lawyer) => lawyer.phone_number ?? '',
      render: (lawyer) => lawyer.phone_number ?? '—',
    },
  ];

  const handleOpenForm = () => {
    setSelectedLawyer(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        iconKey="lawyers"
        title={t('lawyers.list.title')}
        subtitle={t('lawyers.list.subtitle')}
      />


      <GlassCard className="rounded-2xl border border-border/60 bg-card/80 p-0">
        <DetailsTable
          data={data ?? []}
          columns={columns}
          enableSorting
          enableExport
          exportFileName="lawyers"
          emptyMessage={t('lawyers.list.empty')}
          isLoading={isLoading}
          onAdd={handleOpenForm}
          addButtonLabel={t('lawyers.list.add')}
          actionsHeader={t('lawyers.list.table.actions')}
          renderActions={(lawyer) => (
            <div className="flex items-center justify-center gap-2">
              <Button asChild variant="outline" size="icon" className="h-8 w-8">
                <Link to={`/dashboard/lawyers/${lawyer.id}`}>
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">{t('lawyers.list.actions.view')}</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setSelectedLawyer(lawyer);
                  setFormOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">{t('lawyers.list.actions.edit')}</span>
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={() => setLawyerToDelete(lawyer)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">{t('lawyers.list.actions.delete')}</span>
              </Button>
            </div>
          )}
        />
      </GlassCard>

      <LawyerFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={selectedLawyer}
      />

      <ConfirmDialog
        open={!!lawyerToDelete}
        title={lawyerToDelete ? t('lawyers.list.confirmDeleteTitle', { name: lawyerToDelete.name }) : ''}
        description={t('lawyers.list.confirmDeleteDescription')}
        confirmLabel={t('lawyers.list.confirmDelete')}
        cancelLabel={t('common.cancel')}
        onClose={() => setLawyerToDelete(null)}
        onConfirm={() => {
          if (!lawyerToDelete) return;
          deleteMutation.mutate(lawyerToDelete.id);
        }}
      />
    </div>
  );
};

export default LawyersList;
