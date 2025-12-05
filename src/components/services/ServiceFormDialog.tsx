import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  createService,
  updateService,
  getServiceTypes,
  getServiceById,
} from '@/api/services.service';
import { getClients } from '@/api/clients.service';
import { getUnclients } from '@/api/unclients.service';
import type { Client } from '@/types/clients';
import type { Unclient } from '@/types/unclients';
import type {
  ServiceDialogMode,
  ServiceFormInput,
  ServiceRecord,
  ServiceAssociation,
  ServiceTypeOption,
} from './types';

interface ServiceFormDialogProps {
  open: boolean;
  mode: ServiceDialogMode;
  serviceId?: string | number | null;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

const DEFAULT_FORM: ServiceFormInput = {
  slug: '',
  service_type_id: '',
  description: '',
  service_place_name: '',
  service_year: '',
  status: 'جارى التنفيذ',
  client_id: null,
  unclient_id: null,
};

const SERVICE_STATUS_OPTIONS = [
  { value: 'جارى التنفيذ', key: 'inProgress' },
  { value: 'قيد التنفيذ', key: 'underExecution' },
  { value: 'منتهية', key: 'completed' },
  { value: 'متداولة', key: 'circulating' },
  { value: 'استيفاء', key: 'settled' },
] as const;

type UserAssociationType = 'client' | 'unclient';

const ServiceFormDialog: React.FC<ServiceFormDialogProps> = ({
  open,
  mode,
  serviceId,
  onOpenChange,
  onSaved,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();

  const [formState, setFormState] = useState<ServiceFormInput>(DEFAULT_FORM);
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeOption[]>([]);
  const [clients, setClients] = useState<ServiceAssociation[]>([]);
  const [unclients, setUnclients] = useState<ServiceAssociation[]>([]);
  const [associationType, setAssociationType] = useState<UserAssociationType>('client');
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const normaliseArray = <T,>(value: unknown): T[] => {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value as T[];
    if (value && typeof value === 'object') {
      const inner = (value as Record<string, unknown>).data;
      if (Array.isArray(inner)) {
        return inner as T[];
      }
    }
    return [];
  };

  const mapAssociations = <T extends { id?: string | number | null; name?: string | null }>(
    items: T[],
  ): ServiceAssociation[] =>
    items
      .filter((item) => item && item.id !== undefined && item.id !== null)
      .map((item) => ({
        id: String(item.id),
        name: item.name ?? '-',
      }));

  const isReadOnly = mode === 'view';
  const isDisabled = isReadOnly || isFetching;

  const loadLookups = async () => {
    try {
      const [typesRes, clientsRes, unclientsRes] = await Promise.all([
        getServiceTypes(),
        getClients(),
        getUnclients(),
      ]);

      setServiceTypes(normaliseArray<ServiceTypeOption>(typesRes.data));
      setClients(mapAssociations<Client>(clientsRes.data ?? []));
      setUnclients(mapAssociations<Unclient>(unclientsRes.data ?? []));
    } catch (error) {
      console.error('Failed to load service dependencies', error);
      toast({
        title: t('services.form.messages.loadErrorTitle'),
        description: t('services.form.messages.loadErrorDescription'),
        variant: 'destructive',
      });
    }
  };

  const populateFromService = (service: ServiceRecord) => {
    setFormState({
      slug: service.slug ?? '',
      service_type_id: service.service_type_id ?? service.service_type?.id ?? '',
      description: service.description ?? '',
      service_place_name: service.service_place_name ?? '',
      service_year: service.service_year ?? '',
      status: service.status ?? 'جارى التنفيذ',
      client_id: service.clients?.[0]?.id ?? null,
      unclient_id: service.unclients?.[0]?.id ?? null,
      created_by: service.created_at ? undefined : user?.id,
      updated_by: user?.id,
    });

    if (service.clients && service.clients.length > 0) {
      setAssociationType('client');
    } else if (service.unclients && service.unclients.length > 0) {
      setAssociationType('unclient');
    } else {
      setAssociationType('client');
    }
  };

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const initialise = async () => {
      setIsFetching(true);
      await loadLookups();

      if ((mode === 'edit' || mode === 'view') && serviceId) {
        try {
          const response = await getServiceById(String(serviceId));
          if (cancelled) return;
          const record = response.data.service ?? (response.data as unknown as ServiceRecord);
          populateFromService(record);
        } catch (error) {
          if (!cancelled) {
            console.error('Failed to load service', error);
            toast({
              title: t('services.form.messages.loadErrorTitle'),
              description: t('services.form.messages.loadErrorDescription'),
              variant: 'destructive',
            });
          }
        } finally {
          if (!cancelled) {
            setIsFetching(false);
          }
        }
      } else if (!cancelled) {
        setFormState({
          ...DEFAULT_FORM,
          created_by: user?.id,
          updated_by: user?.id,
        });
        setAssociationType('client');
        setIsFetching(false);
      }
    };

    initialise();

    return () => {
      cancelled = true;
    };
  }, [open, mode, serviceId, t, toast, user?.id]);

  const serviceStatusOptions = useMemo(
    () =>
      SERVICE_STATUS_OPTIONS.map(({ value, key }) => ({
        value,
        label: t(`services.status.${key}` as const),
      })),
    [t],
  );

  const handleClose = () => {
    onOpenChange(false);
  };

  const updateField = <K extends keyof ServiceFormInput>(key: K, value: ServiceFormInput[K]) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAssociationTypeChange = (value: UserAssociationType) => {
    setAssociationType(value);
    if (value === 'client') {
      updateField('unclient_id', null);
    } else {
      updateField('client_id', null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isReadOnly) {
      handleClose();
      return;
    }

    setLoading(true);
    try {
      const payload: ServiceFormInput = {
        ...formState,
        client_id: associationType === 'client' ? formState.client_id ?? null : null,
        unclient_id: associationType === 'unclient' ? formState.unclient_id ?? null : null,
        created_by: formState.created_by ?? user?.id,
        updated_by: user?.id,
      };

      if (mode === 'edit' && serviceId) {
        await updateService(String(serviceId), payload);
        toast({ title: t('services.form.messages.updateSuccess') });
      } else {
        await createService(payload);
        toast({ title: t('services.form.messages.createSuccess') });
      }

      onSaved?.();
      handleClose();
    } catch (error) {
      console.error('Failed to save service', error);
      toast({
        title: t('services.form.messages.errorTitle'),
        description: t('services.form.messages.errorDescription'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create'
              ? t('services.form.titleCreate')
              : mode === 'edit'
                ? t('services.form.titleEdit')
                : t('services.form.titleView')}
          </DialogTitle>
          {mode === 'view' && (
            <DialogDescription>{t('services.form.readOnlyNotice')}</DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              label={t('services.form.labels.slug')}
              required
            >
              <Input
                value={formState.slug}
                onChange={(event) => updateField('slug', event.target.value)}
                disabled={isDisabled}
                placeholder={t('services.form.placeholders.slug')}
              />
            </FormField>

            <FormField label={t('services.form.labels.serviceType')} required>
              <Select
                value={formState.service_type_id}
                onValueChange={(value) => updateField('service_type_id', value)}
                disabled={isDisabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('services.form.placeholders.serviceType')} />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type.id} value={String(type.id)}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label={t('services.form.labels.place')} required>
              <Input
                value={formState.service_place_name}
                onChange={(event) => updateField('service_place_name', event.target.value)}
                disabled={isDisabled}
                placeholder={t('services.form.placeholders.place')}
              />
            </FormField>

            <FormField label={t('services.form.labels.year')} required>
              <Input
                value={formState.service_year}
                onChange={(event) => updateField('service_year', event.target.value)}
                disabled={isDisabled}
                placeholder={t('services.form.placeholders.year')}
              />
            </FormField>
          </div>

          <FormField label={t('services.form.labels.description')}>
            <Textarea
              value={formState.description}
              onChange={(event) => updateField('description', event.target.value)}
              disabled={isDisabled}
              className="min-h-[120px]"
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label={t('services.form.labels.associationType')}>
              <Select
                value={associationType}
                onValueChange={(value) => handleAssociationTypeChange(value as UserAssociationType)}
                disabled={isDisabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">{t('services.form.association.client')}</SelectItem>
                  <SelectItem value="unclient">{t('services.form.association.unclient')}</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            {(mode === 'edit' || mode === 'view') && (
              <FormField label={t('services.form.labels.status')}>
                <Select
                  value={formState.status}
                  onValueChange={(value) => updateField('status', value)}
                  disabled={isDisabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            )}
          </div>

          {associationType === 'client' && (
            <FormField label={t('services.form.labels.client')}>
              <Select
                value={formState.client_id ?? ''}
                onValueChange={(value) => updateField('client_id', value || null)}
                disabled={isDisabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('services.form.placeholders.client')} />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={String(client.id)}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          )}

          {associationType === 'unclient' && (
            <FormField label={t('services.form.labels.unclient')}>
              <Select
                value={formState.unclient_id ?? ''}
                onValueChange={(value) => updateField('unclient_id', value || null)}
                disabled={isDisabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('services.form.placeholders.unclient')} />
                </SelectTrigger>
                <SelectContent>
                  {unclients.map((unclient) => (
                    <SelectItem key={unclient.id} value={String(unclient.id)}>
                      {unclient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('common.cancel')}
            </Button>
            {!isReadOnly && (
              <Button type="submit" disabled={loading || isFetching}>
                {loading ? t('common.loading') : mode === 'edit' ? t('common.save') : t('services.form.actions.create')}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, required, children }) => (
  <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
    <span>
      {label}
      {required && <span className="text-destructive"> *</span>}
    </span>
    {children}
  </label>
);

export default ServiceFormDialog;
