import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useToast } from '@/components/ui/use-toast';
import {
  getLegalAdsByLegCaseId,
  deleteLegalAd,
} from '@/api/legalAds.service';
import { LegalAd } from '@/types/legalCase';
import LegalAdModal from './LegalAdModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { Megaphone } from 'lucide-react';
import CaseSection from './CaseSection';

interface AdsSectionProps {
  caseId: string;
  onChanged: () => void;
}

const AdsSection = ({ caseId, onChanged }: AdsSectionProps) => {
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();
  const [ads, setAds] = useState<LegalAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<LegalAd | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<LegalAd | null>(null);
  const [sectionOpen, setSectionOpen] = useState(true);

  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getLegalAdsByLegCaseId(caseId);
      setAds(data);
    } catch (error) {
      console.error('Failed to load legal ads', error);
      toast({
        title: t('legalCaseDetails.ads.loadErrorTitle'),
        description: t('legalCaseDetails.ads.loadErrorDescription'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [caseId, toast, t]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const openCreateModal = () => {
    setSectionOpen(true);
    setEditingAd(null);
    setModalOpen(true);
  };

  const openEditModal = (ad: LegalAd) => {
    setSectionOpen(true);
    setEditingAd(ad);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteLegalAd(confirmDelete.id);
      toast({ title: t('legalCaseDetails.ads.deleteSuccess') });
      setConfirmDelete(null);
      fetchAds();
      onChanged();
    } catch (error) {
      console.error('Failed to delete legal ad', error);
      toast({
        title: t('legalCaseDetails.ads.deleteErrorTitle'),
        description: t('legalCaseDetails.ads.deleteErrorDescription'),
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <CaseSection
        icon={Megaphone}
        title={t('legalCaseDetails.ads.title')}
        subtitle={t('legalCaseDetails.ads.subtitle')}
        open={sectionOpen}
        onOpenChange={setSectionOpen}
        
        actions={
          <Button onClick={openCreateModal} className="self-start sm:self-auto">
            {t('legalCaseDetails.ads.addButton')}
          </Button>
        }
      >
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            {t('common.loading')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              dir={isRTL ? 'rtl' : 'ltr'}
              className="min-w-full border border-border/60 text-sm shadow-inner"
            >
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 text-left rtl:text-right">
                    {t('legalCaseDetails.ads.columns.type')}
                  </th>
                  <th className="px-4 py-2 text-left rtl:text-right">
                    {t('legalCaseDetails.ads.columns.number')}
                  </th>
                  <th className="px-4 py-2 text-left rtl:text-right">
                    {t('legalCaseDetails.ads.columns.date')}
                  </th>
                  <th className="px-4 py-2 text-left rtl:text-right">
                    {t('legalCaseDetails.ads.columns.status')}
                  </th>
                  <th className="px-4 py-2 text-left rtl:text-right">
                    {t('legalCaseDetails.ads.columns.details')}
                  </th>
                  <th className="px-4 py-2 text-center">
                    {t('legalCaseDetails.ads.columns.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {ads.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-center text-muted-foreground" colSpan={6}>
                      {t('legalCaseDetails.ads.empty')}
                    </td>
                  </tr>
                )}
                {ads.map((ad) => (
                  <tr
                    key={ad.id}
                    className="border-t border-border/40 transition-colors hover:bg-muted/20"
                  >
                    <td className="px-4 py-2 text-sm text-foreground text-left rtl:text-right">
                      {ad.legal_ad_type?.name ?? '—'}
                    </td>
                    <td className="px-4 py-2 text-sm text-foreground text-left rtl:text-right">
                      {ad.number ?? '—'}
                    </td>
                    <td className="px-4 py-2 text-sm text-foreground text-left rtl:text-right">
                      {ad.date ?? '—'}
                    </td>
                    <td className="px-4 py-2 text-sm text-foreground text-left rtl:text-right">
                      {ad.status ?? '—'}
                    </td>
                    <td className="px-4 py-2 text-sm text-foreground text-left rtl:text-right">
                      {ad.details ?? ad.description ?? '—'}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(ad)}>
                          {t('legalCaseDetails.ads.editButton')}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setConfirmDelete(ad)}
                        >
                          {t('legalCaseDetails.ads.deleteButton')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CaseSection>

      <LegalAdModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        caseId={caseId}
        initialData={editingAd ?? undefined}
        onSuccess={() => {
          fetchAds();
          onChanged();
        }}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title={t('legalCaseDetails.ads.deleteConfirmTitle')}
        description={t('legalCaseDetails.ads.deleteConfirmDescription')}
        confirmLabel={t('legalCaseDetails.ads.deleteButton')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleDelete}
        onClose={() => setConfirmDelete(null)}
      />
    </>
  );
};
export default AdsSection;
