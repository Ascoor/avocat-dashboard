import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  createLawyer,
  updateLawyer,
  LawyerPayload,
} from '@/api/lawyers.service';
import { Lawyer } from '@/types/lawyers';

type NullableString = string | '';

type FormState = {
  name: string;
  birthdate: NullableString;
  identity_number: string;
  law_reg_num: string;
  lawyer_class: Lawyer['lawyer_class'] | '';
  email: string;
  phone_number: NullableString;
  gender: Lawyer['gender'] | '';
  address: NullableString;
  religion: Lawyer['religion'] | '';
};

const DEFAULT_FORM: FormState = {
  name: '',
  birthdate: '',
  identity_number: '',
  law_reg_num: '',
  lawyer_class: '',
  email: '',
  phone_number: '',
  gender: '',
  address: '',
  religion: '',
};

const GENDER_OPTIONS: Array<{ value: Lawyer['gender']; key: 'male' | 'female' }> = [
  { value: 'ذكر', key: 'male' },
  { value: 'أنثى', key: 'female' },
];

const RELIGION_OPTIONS: Array<{ value: Lawyer['religion']; key: 'muslim' | 'christian' }> = [
  { value: 'مسلم', key: 'muslim' },
  { value: 'مسيحى', key: 'christian' },
];

const CLASS_OPTIONS: Array<{
  value: Lawyer['lawyer_class'];
  key: 'naqdh' | 'isteenaf' | 'ibtedai' | 'general';
}> = [
  { value: 'نقض', key: 'naqdh' },
  { value: 'إستئناف', key: 'isteenaf' },
  { value: 'إبتدائي', key: 'ibtedai' },
  { value: 'جدول عام', key: 'general' },
];

interface LawyerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: Lawyer | null;
}

const LawyerFormDialog: React.FC<LawyerFormDialogProps> = ({
  open,
  onOpenChange,
  initial,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM);

  useEffect(() => {
    if (!open) {
      setFormState(DEFAULT_FORM);
      return;
    }

    if (initial) {
      setFormState({
        name: initial.name ?? '',
        birthdate: normaliseDate(initial.birthdate),
        identity_number: initial.identity_number ?? '',
        law_reg_num: initial.law_reg_num ?? '',
        lawyer_class: initial.lawyer_class ?? '',
        email: initial.email ?? '',
        phone_number: initial.phone_number ?? '',
        gender: initial.gender ?? '',
        address: initial.address ?? '',
        religion: initial.religion ?? '',
      });
    } else {
      setFormState(DEFAULT_FORM);
    }
  }, [initial, open]);

  const createMutation = useMutation({
    mutationFn: (payload: LawyerPayload) => createLawyer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lawyers'] });
      toast({ title: t('lawyers.form.messages.createSuccess') });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('lawyers.form.messages.error'),
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<LawyerPayload> }) =>
      updateLawyer(String(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lawyers'] });
      toast({ title: t('lawyers.form.messages.updateSuccess') });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('lawyers.form.messages.error'),
        variant: 'destructive',
      });
    },
  });

  const isSaving = useMemo(
    () => createMutation.isPending || updateMutation.isPending,
    [createMutation.isPending, updateMutation.isPending],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const payload: LawyerPayload = {
      name: formState.name.trim(),
      birthdate: formState.birthdate,
      identity_number: formState.identity_number.trim(),
      law_reg_num: formState.law_reg_num.trim(),
      lawyer_class: formState.lawyer_class as Lawyer['lawyer_class'],
      email: formState.email.trim(),
      phone_number: formState.phone_number?.trim() || undefined,
      gender: formState.gender as Lawyer['gender'],
      address: formState.address?.trim() || undefined,
      religion: formState.religion as Lawyer['religion'],
    };

    try {
      if (initial?.id) {
        await updateMutation.mutateAsync({ id: initial.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
    } catch {
      /* handled by mutation */
    }
  };

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initial
              ? t('lawyers.form.titleEdit')
              : t('lawyers.form.titleCreate')}
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label={t('lawyers.form.labels.name')} required>
              <Input
                value={formState.name}
                onChange={(event) => handleChange('name', event.target.value)}
                placeholder={t('lawyers.form.placeholders.name')}
                required
              />
            </Field>
            <Field label={t('lawyers.form.labels.birthdate')} required>
              <Input
                type="date"
                value={formState.birthdate}
                onChange={(event) => handleChange('birthdate', event.target.value)}
                required
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label={t('lawyers.form.labels.identity_number')} required>
              <Input
                value={formState.identity_number}
                onChange={(event) =>
                  handleChange('identity_number', event.target.value)
                }
                placeholder={t('lawyers.form.placeholders.identity_number')}
                required
              />
            </Field>
            <Field label={t('lawyers.form.labels.law_reg_num')} required>
              <Input
                value={formState.law_reg_num}
                onChange={(event) =>
                  handleChange('law_reg_num', event.target.value)
                }
                placeholder={t('lawyers.form.placeholders.law_reg_num')}
                required
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label={t('lawyers.form.labels.lawyer_class')} required>
              <select
                value={formState.lawyer_class}
                onChange={(event) =>
                  handleChange(
                    'lawyer_class',
                    event.target.value as FormState['lawyer_class'],
                  )
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="" disabled>
                  {t('lawyers.form.labels.lawyer_class')}
                </option>
                {CLASS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`lawyers.form.class.${option.key}`)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t('lawyers.form.labels.email')} required>
              <Input
                type="email"
                value={formState.email}
                onChange={(event) => handleChange('email', event.target.value)}
                placeholder={t('lawyers.form.placeholders.email')}
                required
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label={t('lawyers.form.labels.phone_number')}>
              <Input
                value={formState.phone_number}
                onChange={(event) =>
                  handleChange('phone_number', event.target.value)
                }
                placeholder={t('lawyers.form.placeholders.phone_number')}
                type="tel"
              />
            </Field>
            <Field label={t('lawyers.form.labels.address')}>
              <Input
                value={formState.address}
                onChange={(event) => handleChange('address', event.target.value)}
                placeholder={t('lawyers.form.placeholders.address')}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label={t('lawyers.form.labels.gender')} required>
              <select
                value={formState.gender}
                onChange={(event) =>
                  handleChange(
                    'gender',
                    event.target.value as FormState['gender'],
                  )
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="" disabled>
                  {t('lawyers.form.labels.gender')}
                </option>
                {GENDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`lawyers.form.gender.${option.key}`)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t('lawyers.form.labels.religion')} required>
              <select
                value={formState.religion}
                onChange={(event) =>
                  handleChange(
                    'religion',
                    event.target.value as FormState['religion'],
                  )
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="" disabled>
                  {t('lawyers.form.labels.religion')}
                </option>
                {RELIGION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`lawyers.form.religion.${option.key}`)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('lawyers.form.actions.cancel')}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {t('lawyers.form.actions.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const normaliseDate = (value?: string | null): string => {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value.slice(0, 10);
  }
  return parsed.toISOString().slice(0, 10);
};

const Field: React.FC<{
  label: string;
  children: React.ReactNode;
  required?: boolean;
}> = ({ label, children, required }) => (
  <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
    <span>
      {label}
      {required && <span className="text-destructive"> *</span>}
    </span>
    {children}
  </label>
);

export default LawyerFormDialog;
