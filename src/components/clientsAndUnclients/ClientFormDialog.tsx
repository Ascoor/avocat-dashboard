import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { createClient, updateClient } from '@/api/clients.service';
import type { Client, ClientFormMode } from '@/types/clients';

interface ClientFormDialogProps {
  open: boolean;
  mode: ClientFormMode;
  initialData?: Client;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

const DEFAULT_CLIENT: Partial<Client> = {
  slug: '',
  name: '',
  identity_number: '',
  address: '',
  phone_number: '',
  email: '',
  nationality: '',
  work: '',
  emergency_number: '',
  date_of_birth: '',
  status: 'active',
  gender: 'ذكر',
  religion: 'مسلم',
};

const ClientFormDialog: React.FC<ClientFormDialogProps> = ({
  open,
  mode,
  initialData,
  onOpenChange,
  onSaved,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formState, setFormState] = useState<Partial<Client>>(DEFAULT_CLIENT);
  const [loading, setLoading] = useState(false);

  const isReadOnly = mode === 'view';

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setFormState({
        ...DEFAULT_CLIENT,
        ...initialData,
        date_of_birth: initialData.date_of_birth?.slice(0, 10),
      });
    } else {
      setFormState(DEFAULT_CLIENT);
    }
  }, [open, initialData]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const updateField = <K extends keyof Client>(key: K, value: Client[K]) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isReadOnly) {
      handleClose();
      return;
    }

    setLoading(true);
    try {
      const payload: Partial<Client> = {
        ...formState,
        date_of_birth: formState.date_of_birth || null,
      };

      if (mode === 'edit' && initialData) {
        await updateClient(String(initialData.id), payload);
        toast({ title: t('clients.form.messages.updateSuccess') });
      } else {
        await createClient(payload);
        toast({ title: t('clients.form.messages.createSuccess') });
      }

      onSaved?.();
      handleClose();
    } catch (error) {
      console.error('Failed to save client', error);
      toast({
        title: t('clients.form.messages.errorTitle'),
        description: t('clients.form.messages.errorDescription'),
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
              ? t('clients.form.titleCreate')
              : mode === 'edit'
                ? t('clients.form.titleEdit')
                : t('clients.form.titleView')}
          </DialogTitle>
          {mode === 'view' && (
            <DialogDescription>{t('clients.form.readOnlyNotice')}</DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label={t('clients.form.labels.slug')} required>
              <Input
                value={formState.slug ?? ''}
                onChange={(event) => updateField('slug', event.target.value)}
                disabled={isReadOnly}
                placeholder={t('clients.form.placeholders.slug')}
              />
            </FormField>
            <FormField label={t('clients.form.labels.name')} required>
              <Input
                value={formState.name ?? ''}
                onChange={(event) => updateField('name', event.target.value)}
                disabled={isReadOnly}
                placeholder={t('clients.form.placeholders.name')}
              />
            </FormField>
            <FormField label={t('clients.form.labels.identity')}>
              <Input
                value={formState.identity_number ?? ''}
                onChange={(event) => updateField('identity_number', event.target.value)}
                disabled={isReadOnly}
              />
            </FormField>
            <FormField label={t('clients.form.labels.phone')}>
              <Input
                value={formState.phone_number ?? ''}
                onChange={(event) => updateField('phone_number', event.target.value)}
                disabled={isReadOnly}
              />
            </FormField>
            <FormField label={t('clients.form.labels.email')}>
              <Input
                type="email"
                value={formState.email ?? ''}
                onChange={(event) => updateField('email', event.target.value)}
                disabled={isReadOnly}
              />
            </FormField>
            <FormField label={t('clients.form.labels.address')}>
              <Input
                value={formState.address ?? ''}
                onChange={(event) => updateField('address', event.target.value)}
                disabled={isReadOnly}
              />
            </FormField>
            <FormField label={t('clients.form.labels.status')}>
              <Select
                value={formState.status ?? 'active'}
                onValueChange={(value) => updateField('status', value as Client['status'])}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t('clients.status.active')}</SelectItem>
                  <SelectItem value="inactive">{t('clients.status.inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label={t('clients.form.labels.dateOfBirth')}>
              <Input
                type="date"
                value={formState.date_of_birth ?? ''}
                onChange={(event) => updateField('date_of_birth', event.target.value)}
                disabled={isReadOnly}
              />
            </FormField>
            <FormField label={t('clients.form.labels.nationality')}>
              <Input
                value={formState.nationality ?? ''}
                onChange={(event) => updateField('nationality', event.target.value)}
                disabled={isReadOnly}
              />
            </FormField>
            <FormField label={t('clients.form.labels.work')}>
              <Input
                value={formState.work ?? ''}
                onChange={(event) => updateField('work', event.target.value)}
                disabled={isReadOnly}
              />
            </FormField>
            <FormField label={t('clients.form.labels.emergency')}>
              <Input
                value={formState.emergency_number ?? ''}
                onChange={(event) => updateField('emergency_number', event.target.value)}
                disabled={isReadOnly}
              />
            </FormField>
          </div>

          <FormField label={t('clients.form.labels.religion')}>
            <Input
              value={formState.religion ?? ''}
              onChange={(event) => updateField('religion', event.target.value as Client['religion'])}
              disabled={isReadOnly}
            />
          </FormField>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('common.cancel')}
            </Button>
            {!isReadOnly && (
              <Button type="submit" disabled={loading}>
                {loading ? t('common.loading') : t('clients.form.actions.save')}
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

export default ClientFormDialog;
