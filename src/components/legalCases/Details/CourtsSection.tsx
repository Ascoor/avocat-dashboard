import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useToast } from '@/components/ui/use-toast';
import {
  addLegalCaseCourts,
  removeLegalCaseCourt,
} from '@/api/legalCases.service';
import { ArrowLeft } from 'lucide-react'; // Import the ArrowLeft icon
import { useNavigate } from 'react-router-dom'; // For navigation

import { getCourts } from '@/api/courts.service';
import { Court } from '@/types/legalCase';
import { useLanguage } from '@/contexts/LanguageContext';
import { Landmark, ChevronDown, ChevronUp } from 'lucide-react'; // Chevron icons for toggle
import CaseSection from './CaseSection';

const YEARS = Array.from({ length: 50 }, (_, index) => String(2000 + index));

interface CourtsSectionProps {
  caseId: string;
  courts: any[]; // Define the court type properly
  onChanged: () => void;
}

const CourtsSection = ({ caseId, courts, onChanged }: CourtsSectionProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [availableCourts, setAvailableCourts] = useState<Court[]>([]);
  const [newCourts, setNewCourts] = useState<any[]>([]); // Define new court type properly
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const [sectionOpen, setSectionOpen] = useState(true); // Track section visibility
  const navigate = useNavigate(); // For navigating back

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const { data } = await getCourts();
        setAvailableCourts(data);
      } catch (error) {
        console.error('Failed to load courts', error);
        toast({
          title: t('legalCaseDetails.courts.loadErrorTitle'),
          description: t('legalCaseDetails.courts.loadErrorDescription'),
          variant: 'destructive',
        });
      }
    };
    fetchCourts();
  }, [toast, t]);

  const courtLevels = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    availableCourts.forEach((court) => {
      if (court.court_level) {
        map.set(court.court_level.id, {
          id: court.court_level.id,
          name: court.court_level.name,
        });
      }
    });
    return Array.from(map.values());
  }, [availableCourts]);

  const courtsByLevel = useMemo(() => {
    return availableCourts.reduce<Record<string, Court[]>>((acc, court) => {
      const levelId = court.court_level?.id;
      if (!levelId) return acc;
      if (!acc[levelId]) acc[levelId] = [];
      acc[levelId].push(court);
      return acc;
    }, {});
  }, [availableCourts]);

  const handleAddRow = () => {
    setSectionOpen(true);
    setNewCourts((prev) => [
      ...prev,
      { case_number: '', case_year: '', court_level_id: '', court_id: '' },
    ]);
  };

  const updateNewCourt = (index: number, field: string, value: string) => {
    setNewCourts((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      if (field === 'court_level_id') {
        next[index].court_id = '';
      }
      return next;
    });
  };

  const removeRow = (index: number) => {
    setNewCourts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (newCourts.length === 0) {
      toast({
        title: t('legalCaseDetails.courts.noCourtsTitle'),
        description: t('legalCaseDetails.courts.noCourtsDescription'),
        variant: 'destructive',
      });
      return;
    }

    const invalid = newCourts.find(
      (court) =>
        !court.case_number || !court.case_year || !court.court_level_id || !court.court_id,
    );

    if (invalid) {
      toast({
        title: t('legalCaseDetails.courts.missingFieldsTitle'),
        description: t('legalCaseDetails.courts.missingFieldsDescription'),
        variant: 'destructive',
      });
      return;
    }

    try {
      await addLegalCaseCourts(caseId, newCourts);
      toast({ title: t('legalCaseDetails.courts.addSuccess') });
      setNewCourts([]);
      onChanged();
    } catch (error) {
      console.error('Failed to add courts', error);
      toast({
        title: t('legalCaseDetails.courts.addErrorTitle'),
        description: t('legalCaseDetails.courts.addErrorDescription'),
        variant: 'destructive',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    try {
      await removeLegalCaseCourt(caseId, confirmDelete.id);
      toast({ title: t('legalCaseDetails.courts.removeSuccess') });
      onChanged();
    } catch (error) {
      console.error('Failed to remove court', error);
      toast({
        title: t('legalCaseDetails.courts.removeErrorTitle'),
        description: t('legalCaseDetails.courts.removeErrorDescription'),
        variant: 'destructive',
      });
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <CaseSection
      icon={Landmark}
      title={t('legalCaseDetails.courts.title')}
      subtitle={t('legalCaseDetails.courts.subtitle')}
      open={sectionOpen}
      onOpenChange={setSectionOpen}
 
      actions={
        <Button variant="secondary" onClick={handleAddRow} className="self-start sm:self-auto">
          {t('legalCaseDetails.courts.addCourt')}
        </Button>
      }
    >
 
      {/* New courts input section */}
      {newCourts.length > 0 && (
        <div className="space-y-4 rounded-lg border border-dashed border-border/60 bg-muted/20 p-4">
          {newCourts.map((court, index) => (
            <div key={`new-court-${index}`} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Input
                value={court.case_number}
                onChange={(event) => updateNewCourt(index, 'case_number', event.target.value)}
                placeholder={t('legalCaseDetails.courts.caseNumberPlaceholder')}
              />
              <select
                value={court.case_year}
                onChange={(event) => updateNewCourt(index, 'case_year', event.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">{t('legalCaseDetails.courts.selectYear')}</option>
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                value={court.court_level_id}
                onChange={(event) => updateNewCourt(index, 'court_level_id', event.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">{t('legalCaseDetails.courts.selectLevel')}</option>
                {courtLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
              <select
                value={court.court_id}
                onChange={(event) => updateNewCourt(index, 'court_id', event.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                disabled={!court.court_level_id}
              >
                <option value="">{t('legalCaseDetails.courts.selectCourt')}</option>
                {(courtsByLevel[court.court_level_id] ?? []).map((available) => (
                  <option key={available.id} value={available.id}>
                    {available.name}
                  </option>
                ))}
              </select>
              <div className="sm:col-span-2 lg:col-span-4">
                <Button variant="ghost" size="sm" onClick={() => removeRow(index)}>
                  {t('legalCaseDetails.courts.removeRow')}
                </Button>
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <Button onClick={handleSave}>{t('legalCaseDetails.courts.saveCourts')}</Button>
          </div>
        </div>
      )}

      {/* Display list of existing courts */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-border/60 text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-start">{t('legalCaseDetails.courts.columns.court')}</th>
              <th className="px-4 py-2 text-start">{t('legalCaseDetails.courts.columns.level')}</th>
              <th className="px-4 py-2 text-start">{t('legalCaseDetails.courts.columns.caseNumber')}</th>
              <th className="px-4 py-2 text-start">{t('legalCaseDetails.courts.columns.caseYear')}</th>
              <th className="px-4 py-2 text-center">{t('legalCaseDetails.courts.columns.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {courts.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-center text-muted-foreground" colSpan={5}>
                  {t('legalCaseDetails.courts.empty')}
                </td>
              </tr>
            )}
            {courts.map((court) => (
              <tr key={court.id} className="border-t border-border/40">
                <td className="px-4 py-2 text-sm">{court.name}</td>
                <td className="px-4 py-2 text-sm">{court.court_level?.name ?? '—'}</td>
                <td className="px-4 py-2 text-sm">{court.case_number ?? '—'}</td>
                <td className="px-4 py-2 text-sm">{court.case_year ?? '—'}</td>
                <td className="px-4 py-2 text-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setConfirmDelete({ id: court.id, name: court.name })}
                  >
                    {t('legalCaseDetails.courts.deleteCourt')}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm deletion dialog */}
      <ConfirmDialog
        open={!!confirmDelete}
        title={t('legalCaseDetails.courts.deleteConfirmTitle', {
          name: confirmDelete?.name ?? '',
        })}
        description={t('legalCaseDetails.courts.deleteConfirmDescription')}
        confirmLabel={t('legalCaseDetails.courts.confirmDelete')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmDelete(null)}
      />
    </CaseSection>
  );
};

export default CourtsSection;
