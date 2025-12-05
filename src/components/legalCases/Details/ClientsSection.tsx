import { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import {
  addLegalCaseClients,
  removeLegalCaseClient,
} from '@/api/legalCases.service';
import { getClients } from '@/api/clients.service';
import type { Client as CaseClient } from '@/types/legalCase';
import type { Client as ClientRecord } from '@/types/clients';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';
import CaseSection from './CaseSection';

interface ClientsSectionProps {
  caseId: string;
  clients: CaseClient[];
  onChanged: () => void;
}

interface SelectableClient extends CaseClient {
  client_id: string;
}

const mapToCaseClient = (client: ClientRecord): CaseClient => ({
  id: String(client.id),
  name: client.name,
  phone: client.phone_number,
  email: client.email,
  slug: client.slug,
});

const ClientsSection = ({ caseId, clients, onChanged }: ClientsSectionProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [allClients, setAllClients] = useState<CaseClient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingClients, setPendingClients] = useState<SelectableClient[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const [sectionOpen, setSectionOpen] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data } = await getClients();
        setAllClients((data ?? []).map(mapToCaseClient));
      } catch (error) {
        console.error('Failed to load clients', error);
        toast({
          title: t('legalCaseDetails.clients.loadErrorTitle'),
          description: t('legalCaseDetails.clients.loadErrorDescription'),
          variant: 'destructive',
        });
      }
    };
    fetchClients();
  }, [toast, t]);

  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) {
      return [];
    }
    const lower = searchTerm.trim().toLowerCase();
    return allClients
      .filter((client) => client.name?.toLowerCase().includes(lower))
      .slice(0, 8)
      .map((client) => ({ ...client, client_id: client.id }));
  }, [allClients, searchTerm]);

  const handleAddRow = () => {
    setSectionOpen(true);
    setPendingClients((prev) => [...prev, { client_id: '', id: '', name: '' }]);
  };

  const handleSelectClient = (option: SelectableClient, index: number) => {
    if (clients.some((client) => client.id === option.id)) {
      toast({
        title: t('legalCaseDetails.clients.duplicateClientTitle'),
        description: t('legalCaseDetails.clients.duplicateClientDescription'),
        variant: 'destructive',
      });
      return;
    }

    setPendingClients((prev) => {
      const next = [...prev];
      next[index] = option;
      return next;
    });
    setSearchTerm('');
  };

  const handleRemovePending = (index: number) => {
    setPendingClients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const validClients = pendingClients.filter((client) => client.client_id);
    if (validClients.length === 0) {
      toast({
        title: t('legalCaseDetails.clients.noSelectionTitle'),
        description: t('legalCaseDetails.clients.noSelectionDescription'),
        variant: 'destructive',
      });
      return;
    }

    try {
      await addLegalCaseClients(
        caseId,
        validClients.map((client) => ({ client_id: client.client_id })),
      );
      toast({ title: t('legalCaseDetails.clients.addSuccess') });
      setPendingClients([]);
      onChanged();
    } catch (error) {
      console.error('Failed to add clients', error);
      toast({
        title: t('legalCaseDetails.clients.addErrorTitle'),
        description: t('legalCaseDetails.clients.addErrorDescription'),
        variant: 'destructive',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    try {
      await removeLegalCaseClient(caseId, confirmDelete.id);
      toast({ title: t('legalCaseDetails.clients.removeSuccess') });
      onChanged();
    } catch (error) {
      console.error('Failed to remove client', error);
      toast({
        title: t('legalCaseDetails.clients.removeErrorTitle'),
        description: t('legalCaseDetails.clients.removeErrorDescription'),
        variant: 'destructive',
      });
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <CaseSection
      icon={Users}
      title={t('legalCaseDetails.clients.title')}
      subtitle={t('legalCaseDetails.clients.subtitle')}
      open={sectionOpen}
      onOpenChange={setSectionOpen}
      actions={
        <Button variant="secondary" onClick={handleAddRow} className="self-start sm:self-auto">
          {t('legalCaseDetails.clients.addClient')}
        </Button>
      }
    >
    

      {pendingClients.length > 0 && (
        <div className="space-y-3 rounded-lg border border-dashed border-border/60 bg-muted/20 p-4">
          {pendingClients.map((pending, index) => (
            <div key={`pending-${index}`} className="space-y-2">
              <Input
                value={pending.name ?? ''}
                onChange={(event) => {
                  const value = event.target.value;
                  setPendingClients((prev) => {
                    const next = [...prev];
                    next[index] = { ...next[index], name: value, client_id: '' };
                    return next;
                  });
                  setSearchTerm(value);
                }}
                placeholder={t('legalCaseDetails.clients.searchPlaceholder')}
              />
              {searchTerm && filteredClients.length > 0 && (
                <div className="max-h-48 overflow-y-auto rounded-md border border-border/60 bg-background shadow-card">
                  {filteredClients.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelectClient(option, index)}
                      className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-muted"
                    >
                      <span>{option.name}</span>
                      {option.phone && (
                        <span className="text-xs text-muted-foreground">
                          {option.phone}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemovePending(index)}
              >
                {t('legalCaseDetails.clients.removeRow')}
              </Button>
            </div>
          ))}
          <div className="flex justify-end">
            <Button onClick={handleSave}>{t('legalCaseDetails.clients.saveClients')}</Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-border/60 text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-start">
                {t('legalCaseDetails.clients.columns.slug')}
              </th>
              <th className="px-4 py-2 text-start">
                {t('legalCaseDetails.clients.columns.name')}
              </th>
              <th className="px-4 py-2 text-start">
                {t('legalCaseDetails.clients.columns.phone')}
              </th>
              <th className="px-4 py-2 text-center">
                {t('legalCaseDetails.clients.columns.actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-center text-muted-foreground" colSpan={4}>
                  {t('legalCaseDetails.clients.empty')}
                </td>
              </tr>
            )}
            {clients.map((client) => (
              <tr key={client.id} className="border-t border-border/40">
                <td className="px-4 py-2 text-sm font-medium text-foreground">
                  {client.slug ?? '—'}
                </td>
                <td className="px-4 py-2 text-sm">{client.name}</td>
                <td className="px-4 py-2 text-sm">
                  {client.phone ?? t('legalCaseDetails.clients.noPhone')}
                </td>
                <td className="px-4 py-2 text-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      setConfirmDelete({ id: client.id, name: client.name })
                    }
                  >
                    {t('legalCaseDetails.clients.deleteClient')}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!confirmDelete}
        title={t('legalCaseDetails.clients.deleteConfirmTitle', {
          name: confirmDelete?.name ?? '',
        })}
        description={t('legalCaseDetails.clients.deleteConfirmDescription')}
        confirmLabel={t('legalCaseDetails.clients.confirmDelete')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmDelete(null)}
      />
    </CaseSection>
  );
};

export default ClientsSection;
