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
  createSession,
  updateSession,
  getLegalSessionTypes,
} from '@/api/sessions.service';
import { getCourts } from '@/api/courts.service';
import { getLawyers } from '@/api/lawyers.service';
import { Court, Lawyer, LegalSession, LegalSessionPayload, LegalSessionType } from '@/types/legalCase';
import { useLanguage } from '@/contexts/LanguageContext';

interface SessionModalProps {
  open: boolean;
  onClose: () => void;
  caseId: string;
  initialData?: LegalSession | null;
  onSuccess: () => void;
}

const defaultForm: LegalSessionPayload = {
  session_date: '',
  session_roll: '',
  cost1: 0,
  cost2: 0,
  cost3: 0,
  court_id: '',
  legal_session_type_id: '',
  lawyer_id: '',
  court_department: '',
  result: '',
  orders: '',
  notes: '',
  status: 'جارى التنفيذ',
  Judgment_operative: '',
};

const SessionModal = ({ open, onClose, caseId, initialData, onSuccess }: SessionModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState<LegalSessionPayload>(defaultForm);
  const [courts, setCourts] = useState<Court[]>([]);
  const [sessionTypes, setSessionTypes] = useState<LegalSessionType[]>([]);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fetchMeta = async () => {
      try {
        const [courtsRes, typesRes, lawyersRes] = await Promise.all([
          getCourts(),
          getLegalSessionTypes(),
          getLawyers(),
        ]);
        setCourts(courtsRes.data);
        setSessionTypes(typesRes.data);
        setLawyers(lawyersRes.data);
      } catch (error) {
        console.error('Failed to load session meta', error);
        toast({
          title: t('legalCaseDetails.sessions.metaErrorTitle'),
          description: t('legalCaseDetails.sessions.metaErrorDescription'),
          variant: 'destructive',
        });
      }
    };
    fetchMeta();
  }, [open, toast, t]);

  useEffect(() => {
    if (open && initialData) {
      setForm({
        session_date: initialData.session_date ?? '',
        session_roll: initialData.session_roll ?? '',
        cost1: initialData.cost1 ?? 0,
        cost2: initialData.cost2 ?? 0,
        cost3: initialData.cost3 ?? 0,
        court_id: initialData.court_id ?? '',
        legal_session_type_id: initialData.legal_session_type_id ?? '',
        lawyer_id: initialData.lawyer_id ?? '',
        court_department: initialData.court_department ?? '',
        result: initialData.result ?? '',
        orders: initialData.orders ?? '',
        notes: initialData.notes ?? '',
        status: initialData.status ?? 'جارى التنفيذ',
        Judgment_operative: initialData.Judgment_operative ?? '',
      });
    } else if (open) {
      setForm(defaultForm);
    }
  }, [open, initialData]);

  const handleChange = (field: keyof LegalSessionPayload, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      if (initialData) {
        await updateSession(initialData.id, {
          ...form,
          leg_case_id: caseId,
          updated_by: user?.id,
        });
        toast({ title: t('legalCaseDetails.sessions.updateSuccess') });
      } else {
        await createSession({
          ...form,
          leg_case_id: caseId,
          created_by: user?.id,
        });
        toast({ title: t('legalCaseDetails.sessions.createSuccess') });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save session', error);
      toast({
        title: t('legalCaseDetails.sessions.saveErrorTitle'),
        description: t('legalCaseDetails.sessions.saveErrorDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (!next ? onClose() : null)}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? t('legalCaseDetails.sessions.editTitle')
              : t('legalCaseDetails.sessions.addTitle')}
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span>{t('legalCaseDetails.sessions.fields.court')}</span>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={form.court_id}
                onChange={(event) => handleChange('court_id', event.target.value)}
                required
              >
                <option value="">{t('legalCaseDetails.sessions.selectCourt')}</option>
                {courts.map((court) => (
                  <option key={court.id} value={court.id}>
                    {court.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span>{t('legalCaseDetails.sessions.fields.type')}</span>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={form.legal_session_type_id}
                onChange={(event) => handleChange('legal_session_type_id', event.target.value)}
                required
              >
                <option value="">{t('legalCaseDetails.sessions.selectType')}</option>
                {sessionTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span>{t('legalCaseDetails.sessions.fields.lawyer')}</span>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={form.lawyer_id}
                onChange={(event) => handleChange('lawyer_id', event.target.value)}
                required
              >
                <option value="">{t('legalCaseDetails.sessions.selectLawyer')}</option>
                {lawyers.map((lawyer) => (
                  <option key={lawyer.id} value={lawyer.id}>
                    {lawyer.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span>{t('legalCaseDetails.sessions.fields.sessionDate')}</span>
              <Input
                type="date"
                value={form.session_date ?? ''}
                onChange={(event) => handleChange('session_date', event.target.value)}
                required
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>{t('legalCaseDetails.sessions.fields.sessionRoll')}</span>
              <Input
                value={form.session_roll ?? ''}
                onChange={(event) => handleChange('session_roll', event.target.value)}
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>{t('legalCaseDetails.sessions.fields.courtDepartment')}</span>
              <Input
                value={form.court_department ?? ''}
                onChange={(event) => handleChange('court_department', event.target.value)}
              />
            </label>
          </div>

          <label className="space-y-1 text-sm">
            <span>{t('legalCaseDetails.sessions.fields.orders')}</span>
            <Textarea
              value={form.orders ?? ''}
              onChange={(event) => handleChange('orders', event.target.value)}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>{t('legalCaseDetails.sessions.fields.result')}</span>
            <Textarea
              value={form.result ?? ''}
              onChange={(event) => handleChange('result', event.target.value)}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>{t('legalCaseDetails.sessions.fields.notes')}</span>
            <Textarea
              value={form.notes ?? ''}
              onChange={(event) => handleChange('notes', event.target.value)}
            />
          </label>

          {initialData && (
            <label className="space-y-1 text-sm">
              <span>{t('legalCaseDetails.sessions.fields.status')}</span>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={form.status ?? ''}
                onChange={(event) => handleChange('status', event.target.value)}
              >
                <option value="جارى التنفيذ">{t('legalCaseDetails.sessions.status.inProgress')}</option>
                <option value="تمت">{t('legalCaseDetails.sessions.status.completed')}</option>
                <option value="ملغاة">{t('legalCaseDetails.sessions.status.cancelled')}</option>
              </select>
            </label>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-1 text-sm">
              <span>{t('legalCaseDetails.sessions.fields.cost1')}</span>
              <Input
                type="number"
                value={form.cost1 ?? 0}
                onChange={(event) => handleChange('cost1', Number(event.target.value))}
                min={0}
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>{t('legalCaseDetails.sessions.fields.cost2')}</span>
              <Input
                type="number"
                value={form.cost2 ?? 0}
                onChange={(event) => handleChange('cost2', Number(event.target.value))}
                min={0}
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>{t('legalCaseDetails.sessions.fields.cost3')}</span>
              <Input
                type="number"
                value={form.cost3 ?? 0}
                onChange={(event) => handleChange('cost3', Number(event.target.value))}
                min={0}
              />
            </label>
          </div>

          <label className="space-y-1 text-sm">
            <span>{t('legalCaseDetails.sessions.fields.judgment')}</span>
            <Textarea
              value={form.Judgment_operative ?? ''}
              onChange={(event) => handleChange('Judgment_operative', event.target.value)}
            />
          </label>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {initialData
                ? t('legalCaseDetails.sessions.updateButton')
                : t('legalCaseDetails.sessions.createButton')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SessionModal;
