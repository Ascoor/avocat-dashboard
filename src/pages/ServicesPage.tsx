import { useCallback, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import DetailsTable, { DetailsTableColumn } from '@/components/common/DetailsTable';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ServiceFormDialog from '@/components/services/ServiceFormDialog';
import type { ServiceRecord } from '@/components/services/types';
import {
  getServices,
  deleteService,
} from '@/api/services.service';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS = [
  { value: 'جارى التنفيذ', key: 'inProgress' },
  { value: 'قيد التنفيذ', key: 'underExecution' },
  { value: 'منتهية', key: 'completed' },
  { value: 'متداولة', key: 'circulating' },
  { value: 'استيفاء', key: 'settled' },
] as const;

const statusClassMap: Record<string, string> = {
  'جارى التنفيذ': 'border-amber-300 text-amber-700 dark:border-amber-500/40 dark:text-amber-100 bg-amber-50/70 dark:bg-amber-500/10',
  'قيد التنفيذ': 'border-blue-300 text-blue-700 dark:border-blue-500/40 dark:text-blue-100 bg-blue-50/70 dark:bg-blue-500/10',
  'منتهية': 'border-emerald-300 text-emerald-700 dark:border-emerald-500/40 dark:text-emerald-100 bg-emerald-50/70 dark:bg-emerald-500/10',
  'متداولة': 'border-slate-300 text-slate-700 dark:border-slate-500/40 dark:text-slate-100 bg-slate-50/70 dark:bg-slate-500/10',
  'استيفاء': 'border-purple-300 text-purple-700 dark:border-purple-500/40 dark:text-purple-100 bg-purple-50/70 dark:bg-purple-500/10',
  unknown: 'border-border/60 text-muted-foreground',
};

const statusEnglishFallback: Record<(typeof STATUS_OPTIONS)[number]['key'], string> = {
  inProgress: 'In progress',
  underExecution: 'Under execution',
  completed: 'Completed',
  circulating: 'In court',
  settled: 'Settlement',
};

const bilingualFallbacks = {
  slug: { en: 'Reference', ar: 'المرجع' },
  type: { en: 'Service type', ar: 'نوع الخدمة' },
  place: { en: 'Place', ar: 'مكان التنفيذ' },
  year: { en: 'Year', ar: 'السنة' },
  status: { en: 'Status', ar: 'الحالة' },
};

const ServicesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedService, setSelectedService] = useState<ServiceRecord | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const secondaryLanguage = language === 'ar' ? 'en' : 'ar';

  const buildHeader = useCallback(
    (key: string, fallbackKey: keyof typeof bilingualFallbacks) => ({
      header: t(key, { defaultValue: bilingualFallbacks[fallbackKey][language] }),
      secondary: t(key, {
        lng: secondaryLanguage,
        defaultValue: bilingualFallbacks[fallbackKey][secondaryLanguage],
      }),
    }),
    [language, secondaryLanguage, t],
  );

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedService(null);
      setDialogMode('create');
    }
  };

  const servicesQuery = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data } = await getServices();
      if (Array.isArray(data)) {
        return data as unknown as ServiceRecord[];
      }
      return data.services ?? [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteService(String(id)),
    onSuccess: () => {
      toast({ title: t('services.messages.deleteSuccess') });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: () => {
      toast({
        title: t('services.messages.deleteErrorTitle'),
        description: t('services.messages.deleteErrorDescription'),
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setConfirmOpen(false);
      setSelectedService(null);
    },
  });

  const services = servicesQuery.data ?? [];

  const columns = useMemo<DetailsTableColumn<ServiceRecord>[]>(
    () => [
      {
        key: 'slug',
        header: buildHeader('services.list.table.slug', 'slug').header,
        secondaryHeader: buildHeader('services.list.table.slug', 'slug').secondary,
        accessor: (service) => service.slug ?? '',
        render: (service) => service.slug ?? '—',
        sortable: true,
      },
      {
        key: 'type',
        header: buildHeader('services.list.table.type', 'type').header,
        secondaryHeader: buildHeader('services.list.table.type', 'type').secondary,
        accessor: (service) => service.service_type?.name ?? '',
        render: (service) => service.service_type?.name ?? '—',
        sortable: true,
      },
      {
        key: 'place',
        header: buildHeader('services.list.table.place', 'place').header,
        secondaryHeader: buildHeader('services.list.table.place', 'place').secondary,
        accessor: (service) => service.service_place_name ?? '',
        render: (service) => service.service_place_name ?? '—',
        sortable: true,
      },
      {
        key: 'year',
        header: buildHeader('services.list.table.year', 'year').header,
        secondaryHeader: buildHeader('services.list.table.year', 'year').secondary,
        accessor: (service) => service.service_year ?? '',
        render: (service) => service.service_year ?? '—',
        sortable: true,
      },
      {
        key: 'status',
        header: buildHeader('services.list.table.status', 'status').header,
        secondaryHeader: buildHeader('services.list.table.status', 'status').secondary,
        accessor: (service) => service.status ?? '',
        render: (service) => {
          const match = STATUS_OPTIONS.find((option) => option.value === service.status);
          const label = match ? t(`services.status.${match.key}`) : service.status ?? t('services.status.unknown');
          const englishLabel = match
            ? t(`services.status.${match.key}`, { lng: 'en', defaultValue: statusEnglishFallback[match.key] })
            : service.status ?? t('services.status.unknown');
          const customClass = statusClassMap[match?.value ?? ''] ?? 'border-border/60 text-muted-foreground';
          return (
            <Badge
              variant="outline"
              className={cn(
                'flex flex-col items-start gap-0.5 rounded-full border px-3 py-1 text-xs font-semibold leading-tight',
                customClass,
              )}
            >
              <span className="text-sm leading-none">{label}</span>
              {englishLabel ? (
                <span className="text-[11px] font-medium leading-none opacity-80">{englishLabel}</span>
              ) : null}
            </Badge>
          );
        },
        sortable: true,
      },
    ],
    [buildHeader, t],
  );

  const handleOpen = (mode: 'create' | 'edit' | 'view', service?: ServiceRecord) => {
    setDialogMode(mode);
    setSelectedService(service ?? null);
    setDialogOpen(true);
  };

  const handleDelete = (service: ServiceRecord) => {
    setSelectedService(service);
    setConfirmOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader iconKey="services" title={t('services.title')} subtitle={t('services.subtitle')} />

      <DetailsTable
        data={services}
        columns={columns}
        enableSorting
        enableExport
        enableSearch
        enablePagination
        exportFileName="services"
        isLoading={servicesQuery.isLoading}
        emptyMessage={servicesQuery.isLoading ? t('common.loading') : t('services.list.empty')}
        onAdd={() => handleOpen('create')}
        addButtonLabel={t('services.list.add')}
        actionsHeader={t('services.list.table.actions')}
        renderActions={(service) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleOpen('view', service)}
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">{t('services.list.actions.view')}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleOpen('edit', service)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">{t('services.list.actions.edit')}</span>
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleDelete(service)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">{t('services.list.actions.delete')}</span>
            </Button>
          </div>
        )}
      />

      <ServiceFormDialog
        open={dialogOpen}
        mode={dialogMode}
        serviceId={selectedService?.id}
        onOpenChange={handleDialogOpenChange}
        onSaved={() => {
          queryClient.invalidateQueries({ queryKey: ['services'] });
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={t('services.list.confirmDeleteTitle', { name: selectedService?.slug ?? '' })}
        description={t('services.list.confirmDeleteDescription')}
        confirmLabel={t('services.list.confirmDelete')}
        cancelLabel={t('common.cancel')}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (!selectedService?.id) return;
          deleteMutation.mutate(selectedService.id);
        }}
      />
    </div>
  );
};

export default ServicesPage;
