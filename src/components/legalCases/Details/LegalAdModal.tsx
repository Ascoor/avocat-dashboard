import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  createLegalAd,
  updateLegalAd,
  getLegalAdTypes,
} from '@/api/legalAds.service';
import { LegalAd, LegalAdPayload, LegalAdType } from '@/types/legalCase';
import { useLanguage } from '@/contexts/LanguageContext';

interface LegalAdModalProps {
  open: boolean;
  onClose: () => void;
  caseId: string;
  initialData?: LegalAd | null;
  onSuccess: () => void;
}

const defaultForm: LegalAdPayload = {
  legal_ad_type_id: '',
  number: '',
  date: '',
  details: '',
  status: 'جاري',
};

const LegalAdModal = ({ open, onClose, caseId, initialData, onSuccess }: LegalAdModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState<LegalAdPayload>(defaultForm);
  const [adTypes, setAdTypes] = useState<LegalAdType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fetchTypes = async () => {
      try {
        const { data } = await getLegalAdTypes();
        setAdTypes(data);
      } catch (error) {
        console.error('Failed to load ad types', error);
        toast({
          title: t('legalCaseDetails.ads.metaErrorTitle'),
          description: t('legalCaseDetails.ads.metaErrorDescription'),
          variant: 'destructive',
        });
      }
    };
    fetchTypes();
  }, [open, toast, t]);

  useEffect(() => {
    if (open && initialData) {
      setForm({
        legal_ad_type_id: initialData.legal_ad_type_id ?? '',
        number: initialData.number ?? '',
        date: initialData.date ?? '',
        details: initialData.details ?? '',
        status: initialData.status ?? 'جاري',
      });
    } else if (open) {
      setForm(defaultForm);
    }
  }, [open, initialData]);

  const handleChange = (field: keyof LegalAdPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      if (initialData) {
        await updateLegalAd(initialData.id, {
          ...form,
          leg_case_id: caseId,
          updated_by: user?.id,
        });
        toast({ title: t('legalCaseDetails.ads.updateSuccess') });
      } else {
        await createLegalAd({
          ...form,
          leg_case_id: caseId,
          created_by: user?.id,
        });
        toast({ title: t('legalCaseDetails.ads.createSuccess') });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save legal ad', error);
      toast({
        title: t('legalCaseDetails.ads.saveErrorTitle'),
        description: t('legalCaseDetails.ads.saveErrorDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (!next ? onClose() : null)}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? t('legalCaseDetails.ads.editTitle')
              : t('legalCaseDetails.ads.addTitle')}
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="space-y-1 text-sm">
            <span>{t('legalCaseDetails.ads.fields.type')}</span>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={form.legal_ad_type_id}
              onChange={(event) => handleChange('legal_ad_type_id', event.target.value)}
              required
            >
              <option value="">{t('legalCaseDetails.ads.selectType')}</option>
              {adTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span>{t('legalCaseDetails.ads.fields.number')}</span>
              <Input
                value={form.number ?? ''}
                onChange={(event) => handleChange('number', event.target.value)}
                required
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>{t('legalCaseDetails.ads.fields.date')}</span>
              <Input
                type="date"
                value={form.date ?? ''}
                onChange={(event) => handleChange('date', event.target.value)}
                required
              />
            </label>
          </div>

          <label className="space-y-1 text-sm">
            <span>{t('legalCaseDetails.ads.fields.details')}</span>
            <Textarea
              value={form.details ?? ''}
              onChange={(event) => handleChange('details', event.target.value)}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>{t('legalCaseDetails.ads.fields.status')}</span>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={form.status ?? ''}
              onChange={(event) => handleChange('status', event.target.value)}
            >
              <option value="جاري">{t('legalCaseDetails.ads.status.active')}</option>
              <option value="تم">{t('legalCaseDetails.ads.status.completed')}</option>
              <option value="ملغى">{t('legalCaseDetails.ads.status.cancelled')}</option>
            </select>
          </label>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {initialData
                ? t('legalCaseDetails.ads.updateButton')
                : t('legalCaseDetails.ads.createButton')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LegalAdModal;
