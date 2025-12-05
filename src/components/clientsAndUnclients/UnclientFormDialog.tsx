import { useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { createUnclient, updateUnclient } from '@/api/unclients.service';
import type { Unclient } from '@/types/unclients';
import type { UnclientFormMode } from './types';

interface UnclientFormDialogProps {
  open: boolean;
  mode: UnclientFormMode;
  initialData?: Unclient;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

const DEFAULT_UNCLIENT: Partial<Unclient> = {
  slug: '',
  name: '',
  identity_number: '',
  phone_number: '',
  email: '',
  address: '',
  work: '',
  emergency_number: '',
  date_of_birth: '',
  gender: 'ذكر',
  religion: 'مسلم',
};

const UnclientFormDialog: React.FC<UnclientFormDialogProps> = ({
  open,
  mode,
  initialData,
  onOpenChange,
  onSaved,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formState, setFormState] = useState<Partial<Unclient>>(DEFAULT_UNCLIENT);
  const [loading, setLoading] = useState(false);

  const isReadOnly = mode === 'view';

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setFormState({
        ...DEFAULT_UNCLIENT,
        ...initialData,
        date_of_birth: initialData.date_of_birth?.slice(0, 10),
      });
    } else {
      setFormState(DEFAULT_UNCLIENT);
    }
  }, [open, initialData]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const updateField = <K extends keyof Unclient>(key: K, value: Unclient[K]) => {
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
      const payload = {
        ...formState,
        date_of_birth: formState.date_of_birth || null,
      };

      if (mode === 'edit' && initialData) {
        await updateUnclient(String(initialData.id), payload);
        toast({ title: t('unclients.form.messages.updateSuccess') });
      } else {
        await createUnclient(payload as Omit<Unclient, 'id'>);
        toast({ title: t('unclients.form.messages.createSuccess') });
      }

      onSaved?.();
      handleClose();
    } catch (error) {
      console.error('Failed to save unclient', error);
      toast({
        title: t('unclients.form.messages.errorTitle'),
        description: t('unclients.form.messages.errorDescription'),
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
              ? t('unclients.form.titleCreate')
              : mode === 'edit'
                ? t('unclients.form.titleEdit')
                : t('unclients.form.titleView')}
          </DialogTitle>
          {mode === 'view' && (
            <DialogDescription>{t('unclients.form.readOnlyNotice')}</DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label={t('unclients.form.labels.slug')} required>
              <Input
                value={formState.slug ?? ''}
                onChange={(event) => updateField('slug', event.target.value)}
                disabled={isReadOnly}
                placeholder={t('unclients.form.placeholders.slug')}
              />
            </FormField>
            <FormField label={t('unclients.form.labels.name')} required>
              <Input
                value={formState.name ?? ''}
                onChange={(event) => updateField('name', event.target.value)}
                disabled={isReadOnly}
                placeholder={t('unclients.form.placeholders.name')}
              />
            </FormField>
            <FormField label={t('unclients.form.labels.identity')}>
              <Input
                value={formState.identity_number ?? ''}
                onChange={(event) => updateField('identity_number', event.target.value)}
                disabled={isReadOnly}
              />
            </FormField>
            <FormField label={t('unclients.form.labels.phone')}>
              <Input
                value={formState.phone_number ?? ''}
                onChange={(event) => updateField('phone_number', event.target.value)}
                disabled={isReadOnly}
              />
            </FormField>
            <FormField label={t('unclients.form.labels.email')}>
              <Input
                type="email"
                value={formState.email ?? ''}
                onChange={(event) => updateField('email', event.target.value)}
                disabled={isReadOnly}
              />
            </FormField>
            <FormField label={t('unclients.form.labels.address')}>
              <Input
                value={formState.address ?? ''}
                onChange={(event) => updateField('address', event.target.value)}
                disabled={isReadOnly}
              />
            </FormField>
            <FormField label={t('unclients.form.labels.work')}>
              <Input
                value={formState.work ?? ''}
                onChange={(event) => updateField('work', event.target.value)}
                disabled={isReadOnly}
              />
            </FormField>
            <FormField label={t('unclients.form.labels.emergency')}>
              <Input
                value={formState.emergency_number ?? ''}
                onChange={(event) => updateField('emergency_number', event.target.value)}
                disabled={isReadOnly}
              />
            </FormField>
            <FormField label={t('unclients.form.labels.dateOfBirth')}>
              <Input
                type="date"
                value={formState.date_of_birth ?? ''}
                onChange={(event) => updateField('date_of_birth', event.target.value)}
                disabled={isReadOnly}
              />
            </FormField>
            <FormField label={t('unclients.form.labels.gender')}>
              <Select
                value={formState.gender ?? 'ذكر'}
                onValueChange={(value) => updateField('gender', value as Unclient['gender'])}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ذكر">{t('unclients.form.genderOptions.male')}</SelectItem>
                  <SelectItem value="أنثى">{t('unclients.form.genderOptions.female')}</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label={t('unclients.form.labels.religion')}>
              <Select
                value={formState.religion ?? 'مسلم'}
                onValueChange={(value) => updateField('religion', value as Unclient['religion'])}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="مسلم">{t('unclients.form.religionOptions.muslim')}</SelectItem>
                  <SelectItem value="مسيحي">{t('unclients.form.religionOptions.christian')}</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('common.cancel')}
            </Button>
            {!isReadOnly && (
              <Button type="submit" disabled={loading}>
                {loading ? t('common.loading') : t('unclients.form.actions.save')}
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

export default UnclientFormDialog;
