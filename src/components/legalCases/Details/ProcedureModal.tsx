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
  createProcedure,
  updateProcedure,
  getProcedureTypes,
  getProcedurePlaceTypes,
} from '@/api/procedures.service';
import { getLawyers } from '@/api/lawyers.service';
import {
  Procedure,
  ProcedurePayload,
  ProcedurePlaceType,
  ProcedureType,
  Lawyer as LegalCaseLawyer,
} from '@/types/legalCase';
import { Lawyer as ApiLawyer } from '@/types/lawyers';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProcedureModalProps {
  open: boolean;
  onClose: () => void;
  caseId: string;
  initialData?: Procedure | null;
  onSuccess: () => void;
}

const defaultForm: ProcedurePayload = {
  job: '',
  date_start: '',
  date_end: '',
  cost: 0,
  cost2: 0,
  cost3: 0,
  procedure_type_id: '',
  lawyer_id: '',
  procedure_place_type_id: '',
  procedure_place_name: '',
  result: '',
  status: 'جاري التنفيذ',
};

const ProcedureModal = ({ open, onClose, caseId, initialData, onSuccess }: ProcedureModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState<ProcedurePayload>(defaultForm);
  const [procedureTypes, setProcedureTypes] = useState<ProcedureType[]>([]);
  const [placeTypes, setPlaceTypes] = useState<ProcedurePlaceType[]>([]);
  const [lawyers, setLawyers] = useState<LegalCaseLawyer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fetchMeta = async () => {
      try {
        const [typesRes, placesRes, lawyersRes] = await Promise.all([
          getProcedureTypes(),
          getProcedurePlaceTypes(),
          getLawyers(),
        ]);
        setProcedureTypes(typesRes.data);
        setPlaceTypes(placesRes.data);
        // Map API lawyers to LegalCase lawyers (convert number id to string)
        setLawyers(lawyersRes.data.map((l: ApiLawyer) => ({ id: String(l.id), name: l.name, licenseNo: l.law_reg_num, phone: l.phone_number })));
      } catch (error) {
        console.error('Failed to load procedure meta', error);
        toast({
          title: t('legalCaseDetails.procedures.metaErrorTitle'),
          description: t('legalCaseDetails.procedures.metaErrorDescription'),
          variant: 'destructive',
        });
      }
    };
    fetchMeta();
  }, [open, toast, t]);

  useEffect(() => {
    if (open && initialData) {
      setForm({
        job: initialData.job ?? '',
        date_start: initialData.date_start ?? '',
        date_end: initialData.date_end ?? '',
        cost: initialData.cost ?? 0,
        cost2: initialData.cost2 ?? 0,
        cost3: initialData.cost3 ?? 0,
        procedure_type_id: initialData.procedure_type_id ?? '',
        lawyer_id: initialData.lawyer_id ?? '',
        procedure_place_type_id: initialData.procedure_place_type_id ?? '',
        procedure_place_name: initialData.procedure_place_name ?? '',
        result: initialData.result ?? '',
        status: initialData.status ?? 'جاري التنفيذ',
      });
    } else if (open) {
      setForm(defaultForm);
    }
  }, [open, initialData]);

  const handleChange = (field: keyof ProcedurePayload, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      if (initialData) {
        await updateProcedure(initialData.id, {
          ...form,
          leg_case_id: caseId,
          updated_by: user?.id,
        });
        toast({ title: t('legalCaseDetails.procedures.updateSuccess') });
      } else {
        await createProcedure({
          ...form,
          leg_case_id: caseId,
          created_by: user?.id,
        });
        toast({ title: t('legalCaseDetails.procedures.createSuccess') });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save procedure', error);
      toast({
        title: t('legalCaseDetails.procedures.saveErrorTitle'),
        description: t('legalCaseDetails.procedures.saveErrorDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (!next ? onClose() : null)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? t('legalCaseDetails.procedures.editTitle')
              : t('legalCaseDetails.procedures.addTitle')}
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span>{t('legalCaseDetails.procedures.fields.type')}</span>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={form.procedure_type_id}
                onChange={(event) => handleChange('procedure_type_id', event.target.value)}
                required
              >
                <option value="">{t('legalCaseDetails.procedures.selectType')}</option>
                {procedureTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span>{t('legalCaseDetails.procedures.fields.placeType')}</span>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={form.procedure_place_type_id}
                onChange={(event) =>
                  handleChange('procedure_place_type_id', event.target.value)
                }
                required
              >
                <option value="">{t('legalCaseDetails.procedures.selectPlaceType')}</option>
                {placeTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span>{t('legalCaseDetails.procedures.fields.placeName')}</span>
              <Input
                value={form.procedure_place_name ?? ''}
                onChange={(event) => handleChange('procedure_place_name', event.target.value)}
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>{t('legalCaseDetails.procedures.fields.lawyer')}</span>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={form.lawyer_id}
                onChange={(event) => handleChange('lawyer_id', event.target.value)}
                required
              >
                <option value="">{t('legalCaseDetails.procedures.selectLawyer')}</option>
                {lawyers.map((lawyer) => (
                  <option key={lawyer.id} value={lawyer.id}>
                    {lawyer.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span>{t('legalCaseDetails.procedures.fields.startDate')}</span>
              <Input
                type="date"
                value={form.date_start ?? ''}
                onChange={(event) => handleChange('date_start', event.target.value)}
                required
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>{t('legalCaseDetails.procedures.fields.endDate')}</span>
              <Input
                type="date"
                value={form.date_end ?? ''}
                onChange={(event) => handleChange('date_end', event.target.value)}
                required
              />
            </label>
          </div>

          <label className="space-y-1 text-sm">
            <span>{t('legalCaseDetails.procedures.fields.job')}</span>
            <Input
              value={form.job}
              onChange={(event) => handleChange('job', event.target.value)}
              required
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>{t('legalCaseDetails.procedures.fields.result')}</span>
            <Textarea
              value={form.result ?? ''}
              onChange={(event) => handleChange('result', event.target.value)}
            />
          </label>

          {initialData && (
            <label className="space-y-1 text-sm">
              <span>{t('legalCaseDetails.procedures.fields.status')}</span>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={form.status ?? ''}
                onChange={(event) => handleChange('status', event.target.value)}
              >
                <option value="جاري التنفيذ">{t('legalCaseDetails.procedures.status.inProgress')}</option>
                <option value="تمت">{t('legalCaseDetails.procedures.status.completed')}</option>
                <option value="لم ينفذ">{t('legalCaseDetails.procedures.status.notExecuted')}</option>
              </select>
            </label>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-1 text-sm">
              <span>{t('legalCaseDetails.procedures.fields.cost')}</span>
              <Input
                type="number"
                value={form.cost ?? 0}
                onChange={(event) => handleChange('cost', Number(event.target.value))}
                min={0}
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>{t('legalCaseDetails.procedures.fields.fee')}</span>
              <Input
                type="number"
                value={form.cost2 ?? 0}
                onChange={(event) => handleChange('cost2', Number(event.target.value))}
                min={0}
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>{t('legalCaseDetails.procedures.fields.otherCost')}</span>
              <Input
                type="number"
                value={form.cost3 ?? 0}
                onChange={(event) => handleChange('cost3', Number(event.target.value))}
                min={0}
              />
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {initialData
                ? t('legalCaseDetails.procedures.updateButton')
                : t('legalCaseDetails.procedures.createButton')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProcedureModal;
