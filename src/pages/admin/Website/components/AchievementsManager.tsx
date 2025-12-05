import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import {
  createAchievement,
  deleteAchievement,
  listAchievements,
  updateAchievement,
  type AchievementInput,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import type { AchievementApi } from '@/types/website';
import { useToast } from '@/components/ui/use-toast';
import useUserRoles from '@/hooks/useUserRoles';

interface AchievementFormValues {
  title_en: string;
  title_ar: string;
  number: string;
}

const emptyAchievement: AchievementFormValues = {
  title_en: '',
  title_ar: '',
  number: '',
};

const toFormValues = (achievement: AchievementApi | null): AchievementFormValues => {
  if (!achievement) {
    return emptyAchievement;
  }

  return {
    title_en: achievement.title.en ?? '',
    title_ar: achievement.title.ar ?? '',
    number: achievement.number ? String(achievement.number) : '',
  };
};

const toPayload = (values: AchievementFormValues): AchievementInput => ({
  title_en: values.title_en.trim(),
  title_ar: values.title_ar.trim(),
  number: values.number.trim() ? Number(values.number) : null,
});

const AchievementsManager: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { can, isLoading: rolesLoading, isFetching: rolesFetching } = useUserRoles();
  const permissionsReady = !(rolesLoading || rolesFetching);
  const canViewAchievements = permissionsReady && can('pages:view');
  const canManageAchievements = permissionsReady && can('pages:edit');

  const achievementsQuery = useQuery({
    queryKey: ['admin-achievements'],
    queryFn: listAchievements,
    enabled: canViewAchievements,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<AchievementApi | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AchievementApi | null>(null);

  const form = useForm<AchievementFormValues>({
    defaultValues: emptyAchievement,
  });

  useEffect(() => {
    form.reset(toFormValues(editingAchievement));
  }, [editingAchievement, form]);

  const saveMutation = useMutation({
    mutationFn: async ({ id, payload }: { id?: number; payload: AchievementInput }) => {
      if (id) {
        return updateAchievement(id, payload);
      }
      return createAchievement(payload);
    },
    onSuccess: () => {
      toast({ title: 'Achievement saved' });
      queryClient.invalidateQueries({ queryKey: ['admin-achievements'] });
      handleCloseDialog();
    },
    onError: () => {
      toast({ title: 'Unable to save achievement', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAchievement(id),
    onSuccess: () => {
      toast({ title: 'Achievement removed' });
      queryClient.invalidateQueries({ queryKey: ['admin-achievements'] });
    },
    onError: () => {
      toast({ title: 'Failed to delete achievement', variant: 'destructive' });
    },
    onSettled: () => setPendingDelete(null),
  });

  const handleSubmit = (values: AchievementFormValues) => {
    if (!canManageAchievements) {
      toast({ title: 'Read-only mode', description: 'You do not have permission to modify achievements.', variant: 'destructive' });
      return;
    }
    const payload = toPayload(values);
    if (!payload.title_en || !payload.title_ar) {
      toast({ title: 'Title is required in both languages', variant: 'destructive' });
      return;
    }

    saveMutation.mutate({ id: editingAchievement?.id, payload });
  };

  const handleOpenDialog = (achievement: AchievementApi | null = null) => {
    if (!canManageAchievements) {
      toast({ title: 'Read-only mode', description: 'You do not have permission to edit achievements.', variant: 'destructive' });
      return;
    }
    setEditingAchievement(achievement);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAchievement(null);
  };

  const achievements = useMemo(() => achievementsQuery.data ?? [], [achievementsQuery.data]);

  if (!permissionsReady) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!canViewAchievements) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
        You do not have permission to view achievements.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Achievements</CardTitle>
            <CardDescription>Control the statistics shown in the achievements strip.</CardDescription>
          </div>
          <Button type="button" onClick={() => handleOpenDialog(null)} disabled={!canManageAchievements}>
            <Plus className="mr-2 h-4 w-4" /> Add achievement
          </Button>
        </CardHeader>
        <CardContent>
          {achievementsQuery.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : achievements.length === 0 ? (
            <p className="text-sm text-muted-foreground">No achievements found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title (EN)</TableHead>
                    <TableHead>العنوان (AR)</TableHead>
                    <TableHead className="w-24">Number</TableHead>
                    <TableHead className="w-32 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {achievements.map((achievement) => (
                    <TableRow key={achievement.id}>
                      <TableCell className="font-medium">{achievement.title.en}</TableCell>
                      <TableCell dir="rtl">{achievement.title.ar}</TableCell>
                      <TableCell>{achievement.number ?? '-'}</TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenDialog(achievement)}
                          disabled={!canManageAchievements}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            if (!canManageAchievements) {
                              toast({ title: 'Read-only mode', description: 'You do not have permission to delete achievements.', variant: 'destructive' });
                              return;
                            }
                            setPendingDelete(achievement);
                          }}
                          disabled={!canManageAchievements}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
            <DialogTitle>{editingAchievement ? 'Edit achievement' : 'Add achievement'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title_en">Title (EN)</Label>
              <Input id="title_en" disabled={!canManageAchievements} {...form.register('title_en')} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title_ar">العنوان (AR)</Label>
              <Input id="title_ar" dir="rtl" disabled={!canManageAchievements} {...form.register('title_ar')} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="number">Number (optional)</Label>
              <Input id="number" type="number" min={0} disabled={!canManageAchievements} {...form.register('number')} />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={saveMutation.isPending || !canManageAchievements}>
                {saveMutation.isPending ? 'Saving…' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete achievement?"
        description="This will remove the metric from the landing page."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (!pendingDelete) {
            return;
          }
          if (!canManageAchievements) {
            toast({ title: 'Read-only mode', description: 'You do not have permission to delete achievements.', variant: 'destructive' });
            return;
          }
          deleteMutation.mutate(pendingDelete.id);
        }}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default AchievementsManager;
