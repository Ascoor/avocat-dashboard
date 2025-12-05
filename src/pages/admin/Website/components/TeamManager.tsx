import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';

import {
  createTeamMember,
  deleteTeamMember,
  listTeamMembers,
  updateTeamMember,
  type TeamMemberInput,
} from '@/api/websiteAdmin.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import type { TeamMemberApi } from '@/types/website';
import { useToast } from '@/components/ui/use-toast';
import useUserRoles from '@/hooks/useUserRoles';

interface TeamMemberFormValues {
  name_en: string;
  name_ar: string;
  position_en: string;
  position_ar: string;
  bio_en: string;
  bio_ar: string;
  highlights_en: string;
  highlights_ar: string;
  image: string;
}

const emptyMember: TeamMemberFormValues = {
  name_en: '',
  name_ar: '',
  position_en: '',
  position_ar: '',
  bio_en: '',
  bio_ar: '',
  highlights_en: '',
  highlights_ar: '',
  image: '',
};

const toInputPayload = (values: TeamMemberFormValues): TeamMemberInput => ({
  name_en: values.name_en.trim(),
  name_ar: values.name_ar.trim(),
  position_en: values.position_en.trim(),
  position_ar: values.position_ar.trim(),
  bio_en: values.bio_en.trim() || null,
  bio_ar: values.bio_ar.trim() || null,
  highlights_en: values.highlights_en
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0),
  highlights_ar: values.highlights_ar
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0),
  image: values.image.trim() || null,
});

const toFormValues = (member: TeamMemberApi | null): TeamMemberFormValues => {
  if (!member) {
    return emptyMember;
  }

  return {
    name_en: member.name.en ?? '',
    name_ar: member.name.ar ?? '',
    position_en: member.position.en ?? '',
    position_ar: member.position.ar ?? '',
    bio_en: member.bio.en ?? '',
    bio_ar: member.bio.ar ?? '',
    highlights_en: (member.highlights.en ?? []).join('\n'),
    highlights_ar: (member.highlights.ar ?? []).join('\n'),
    image: member.image ?? '',
  };
};

const TeamManager: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { can, isLoading: rolesLoading, isFetching: rolesFetching } = useUserRoles();
  const permissionsReady = !(rolesLoading || rolesFetching);
  const canViewTeam = permissionsReady && can('pages:view');
  const canManageTeam = permissionsReady && can('pages:edit');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);

  const teamQuery = useQuery({
    queryKey: ['admin-team-members'],
    queryFn: listTeamMembers,
    enabled: canViewTeam,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMemberApi | null>(null);
  const [pendingDelete, setPendingDelete] = useState<TeamMemberApi | null>(null);

  const form = useForm<TeamMemberFormValues>({
    defaultValues: emptyMember,
  });

  useEffect(() => {
    form.reset(toFormValues(editingMember));
  }, [editingMember, form]);

  const saveMutation = useMutation({
    mutationFn: async ({ id, payload }: { id?: number; payload: TeamMemberInput }) => {
      if (id) {
        return updateTeamMember(id, payload);
      }
      return createTeamMember(payload);
    },
    onSuccess: () => {
      toast({ title: 'Team member saved' });
      queryClient.invalidateQueries({ queryKey: ['admin-team-members'] });
      setDialogOpen(false);
      setEditingMember(null);
    },
    onError: () => {
      toast({ title: 'Failed to save team member', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTeamMember(id),
    onSuccess: () => {
      toast({ title: 'Team member removed' });
      queryClient.invalidateQueries({ queryKey: ['admin-team-members'] });
    },
    onError: () => {
      toast({ title: 'Unable to delete team member', variant: 'destructive' });
    },
    onSettled: () => setPendingDelete(null),
  });

  const handleSubmit = (values: TeamMemberFormValues) => {
    if (!canManageTeam) {
      toast({ title: 'Read-only mode', description: 'You do not have permission to modify team members.', variant: 'destructive' });
      return;
    }
    const payload = toInputPayload(values);
    const id = editingMember?.id;
    if (!payload.name_en || !payload.name_ar) {
      toast({ title: 'Name is required in both languages', variant: 'destructive' });
      return;
    }

    saveMutation.mutate({ id, payload });
  };

  const handleOpenDialog = (member: TeamMemberApi | null = null) => {
    if (!canManageTeam) {
      toast({ title: 'Read-only mode', description: 'You do not have permission to edit team members.', variant: 'destructive' });
      return;
    }
    setEditingMember(member);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingMember(null);
  };

  const handleRequestDelete = (member: TeamMemberApi) => {
    if (!canManageTeam) {
      toast({ title: 'Read-only mode', description: 'You do not have permission to delete team members.', variant: 'destructive' });
      return;
    }
    setPendingDelete(member);
  };

  const members = useMemo(() => teamQuery.data ?? [], [teamQuery.data]);
  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) {
      return members;
    }
    const normalized = searchTerm.toLowerCase();
    return members.filter((member) => {
      const name = `${member.name.en ?? ''} ${member.name.ar ?? ''}`.toLowerCase();
      const role = `${member.position.en ?? ''} ${member.position.ar ?? ''}`.toLowerCase();
      return name.includes(normalized) || role.includes(normalized);
    });
  }, [members, searchTerm]);
  const visibleMembers = useMemo(() => filteredMembers.slice(0, visibleCount), [filteredMembers, visibleCount]);
  const hasMoreMembers = visibleMembers.length < filteredMembers.length;

  if (!permissionsReady) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!canViewTeam) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
        You do not have permission to view team members.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold">Leadership team</CardTitle>
            <CardDescription>Manage the team members showcased on the landing page.</CardDescription>
          </div>
          <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search team members"
                className="pl-9"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setVisibleCount(10);
                }}
              />
            </div>
            <Button type="button" onClick={() => handleOpenDialog(null)} disabled={!canManageTeam}>
              <Plus className="mr-2 h-4 w-4" /> Add member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {teamQuery.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : filteredMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No team members match the current filters.</p>
          ) : (
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name (EN)</TableHead>
                      <TableHead>اسم (AR)</TableHead>
                      <TableHead>Role (EN)</TableHead>
                      <TableHead className="w-32 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name.en}</TableCell>
                        <TableCell dir="rtl">{member.name.ar}</TableCell>
                        <TableCell>{member.position.en}</TableCell>
                        <TableCell className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenDialog(member)}
                            disabled={!canManageTeam}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRequestDelete(member)}
                            disabled={!canManageTeam}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {hasMoreMembers ? (
                <div className="flex justify-center">
                  <Button type="button" variant="outline" onClick={() => setVisibleCount((count) => count + 10)}>
                    Load more members
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={(next) => {
          if (!next) {
            handleCloseDialog();
          } else {
            setDialogOpen(true);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMember ? 'Edit team member' : 'Add team member'}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name_en">Name (EN)</Label>
                <Input id="name_en" disabled={!canManageTeam} {...form.register('name_en')} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name_ar">الاسم (AR)</Label>
                <Input id="name_ar" dir="rtl" disabled={!canManageTeam} {...form.register('name_ar')} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position_en">Role (EN)</Label>
                <Input id="position_en" disabled={!canManageTeam} {...form.register('position_en')} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position_ar">الدور (AR)</Label>
                <Input id="position_ar" dir="rtl" disabled={!canManageTeam} {...form.register('position_ar')} required />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="bio_en">Bio (EN)</Label>
                <Textarea id="bio_en" rows={4} disabled={!canManageTeam} {...form.register('bio_en')} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio_ar">السيرة (AR)</Label>
                <Textarea id="bio_ar" rows={4} dir="rtl" disabled={!canManageTeam} {...form.register('bio_ar')} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="highlights_en">Highlights (EN)</Label>
                <Textarea
                  id="highlights_en"
                  rows={4}
                  placeholder="One item per line"
                  disabled={!canManageTeam}
                  {...form.register('highlights_en')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="highlights_ar">أبرز الإنجازات (AR)</Label>
                <Textarea
                  id="highlights_ar"
                  rows={4}
                  dir="rtl"
                  placeholder="عنصر لكل سطر"
                  disabled={!canManageTeam}
                  {...form.register('highlights_ar')}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Image path (optional)</Label>
              <Input
                id="image"
                placeholder="branding/landing/team-1.png"
                disabled={!canManageTeam}
                {...form.register('image')}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={saveMutation.isPending || !canManageTeam}>
                {saveMutation.isPending ? 'Saving…' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDelete && canManageTeam)}
        title="Remove team member?"
        description="This action removes the member from the public landing page."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (pendingDelete && canManageTeam) {
            deleteMutation.mutate(pendingDelete.id);
          }
        }}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default TeamManager;
