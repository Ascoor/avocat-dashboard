import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';

import {
  createArticle,
  deleteArticle,
  listArticles,
  updateArticle,
  type ArticleInput,
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
import { useToast } from '@/components/ui/use-toast';
import useUserRoles from '@/hooks/useUserRoles';
import type { ArticleApi } from '@/types/website';
import UploadMedia from './UploadMedia';
import ConfirmDialog from '@/components/common/ConfirmDialog';

interface ArticleFormValues {
  title_en: string;
  title_ar: string;
  summary_en: string;
  summary_ar: string;
  body_en: string;
  body_ar: string;
  tag_en: string;
  tag_ar: string;
  cover_image: string;
}

const emptyArticle: ArticleFormValues = {
  title_en: '',
  title_ar: '',
  summary_en: '',
  summary_ar: '',
  body_en: '',
  body_ar: '',
  tag_en: '',
  tag_ar: '',
  cover_image: '',
};

const toPayload = (values: ArticleFormValues): ArticleInput => ({
  title_en: values.title_en.trim(),
  title_ar: values.title_ar.trim(),
  summary_en: values.summary_en.trim() || null,
  summary_ar: values.summary_ar.trim() || null,
  body_en: values.body_en.trim(),
  body_ar: values.body_ar.trim(),
  tag_en: values.tag_en.trim() || null,
  tag_ar: values.tag_ar.trim() || null,
  cover_image: values.cover_image.trim() || null,
});

const toFormValues = (article: ArticleApi | null): ArticleFormValues => {
  if (!article) {
    return emptyArticle;
  }

  return {
    title_en: article.title.en ?? '',
    title_ar: article.title.ar ?? '',
    summary_en: article.summary.en ?? '',
    summary_ar: article.summary.ar ?? '',
    body_en: article.body.en ?? '',
    body_ar: article.body.ar ?? '',
    tag_en: article.tag.en ?? '',
    tag_ar: article.tag.ar ?? '',
    cover_image: article.cover_image ?? '',
  };
};

const ArticlesManager: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { can, isLoading: rolesLoading, isFetching: rolesFetching } = useUserRoles();
  const permissionsReady = !(rolesLoading || rolesFetching);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);
  const canViewArticles = permissionsReady && can('pages:view');
  const canManageArticles = permissionsReady && can('pages:edit');

  const articlesQuery = useQuery({
    queryKey: ['admin-website-articles'],
    queryFn: listArticles,
    enabled: canViewArticles,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleApi | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ArticleApi | null>(null);

  const form = useForm<ArticleFormValues>({
    defaultValues: emptyArticle,
  });

  useEffect(() => {
    form.reset(toFormValues(editingArticle));
  }, [editingArticle, form]);

  const saveMutation = useMutation({
    mutationFn: async ({ id, payload }: { id?: number; payload: ArticleInput }) => {
      if (id) {
        return updateArticle(id, payload);
      }
      return createArticle(payload);
    },
    onSuccess: () => {
      toast({ title: 'Article saved' });
      queryClient.invalidateQueries({ queryKey: ['admin-website-articles'] });
      setDialogOpen(false);
      setEditingArticle(null);
    },
    onError: () => {
      toast({ title: 'Failed to save article', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteArticle(id),
    onSuccess: () => {
      toast({ title: 'Article removed' });
      queryClient.invalidateQueries({ queryKey: ['admin-website-articles'] });
    },
    onError: () => {
      toast({ title: 'Unable to delete article', variant: 'destructive' });
    },
    onSettled: () => setPendingDelete(null),
  });

  const handleSubmit = (values: ArticleFormValues) => {
    if (!canManageArticles) {
      toast({ title: 'Read-only mode', description: 'You do not have permission to modify articles.', variant: 'destructive' });
      return;
    }
    const payload = toPayload(values);
    if (!payload.title_en || !payload.title_ar || !payload.body_en || !payload.body_ar) {
      toast({ title: 'Title and body are required in both languages', variant: 'destructive' });
      return;
    }

    const id = editingArticle?.id;
    saveMutation.mutate({ id, payload });
  };

  const handleOpenDialog = (article: ArticleApi | null = null) => {
    if (!canManageArticles) {
      toast({ title: 'Read-only mode', description: 'You do not have permission to edit articles.', variant: 'destructive' });
      return;
    }
    setEditingArticle(article);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingArticle(null);
  };

  const handleRequestDelete = (article: ArticleApi) => {
    if (!canManageArticles) {
      toast({ title: 'Read-only mode', description: 'You do not have permission to delete articles.', variant: 'destructive' });
      return;
    }
    setPendingDelete(article);
  };

  const articles = useMemo(() => articlesQuery.data ?? [], [articlesQuery.data]);
  const filteredArticles = useMemo(() => {
    if (!searchTerm.trim()) {
      return articles;
    }
    const normalized = searchTerm.toLowerCase();
    return articles.filter((article) => {
      const title = `${article.title.en ?? ''} ${article.title.ar ?? ''}`.toLowerCase();
      const tag = `${article.tag.en ?? ''} ${article.tag.ar ?? ''}`.toLowerCase();
      return title.includes(normalized) || tag.includes(normalized) || article.slug.toLowerCase().includes(normalized);
    });
  }, [articles, searchTerm]);
  const visibleArticles = useMemo(() => filteredArticles.slice(0, visibleCount), [filteredArticles, visibleCount]);
  const hasMoreArticles = visibleArticles.length < filteredArticles.length;

  if (!permissionsReady) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!canViewArticles) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
        You do not have permission to view articles.
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold">Articles</CardTitle>
          <CardDescription>Manage insights and blog entries published on the marketing site.</CardDescription>
        </div>
        <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search articles"
              className="pl-9"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setVisibleCount(10);
              }}
            />
          </div>
          <Button type="button" onClick={() => handleOpenDialog(null)} disabled={!canManageArticles}>
            <Plus className="mr-2 h-4 w-4" /> New article
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {articlesQuery.isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : filteredArticles.length === 0 ? (
          <p className="text-sm text-muted-foreground">No articles match the current filters.</p>
        ) : (
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title (EN)</TableHead>
                    <TableHead>العنوان (AR)</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead className="w-32 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleArticles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">{article.title.en}</TableCell>
                      <TableCell>{article.title.ar}</TableCell>
                      <TableCell>{article.tag.en ?? article.tag.ar ?? '—'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(article)} disabled={!canManageArticles}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleRequestDelete(article)} disabled={!canManageArticles}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {hasMoreArticles ? (
              <div className="flex justify-center">
                <Button type="button" variant="outline" onClick={() => setVisibleCount((count) => count + 10)}>
                  Load more articles
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingArticle ? 'Edit article' : 'Create article'}</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title_en">Title (EN)</Label>
                <Input id="title_en" disabled={!canManageArticles} {...form.register('title_en')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title_ar">العنوان (AR)</Label>
                <Input id="title_ar" dir="rtl" disabled={!canManageArticles} {...form.register('title_ar')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag_en">Tag (EN)</Label>
                <Input id="tag_en" disabled={!canManageArticles} {...form.register('tag_en')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag_ar">الوسم (AR)</Label>
                <Input id="tag_ar" dir="rtl" disabled={!canManageArticles} {...form.register('tag_ar')} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="summary_en">Summary (EN)</Label>
                <Textarea id="summary_en" rows={3} disabled={!canManageArticles} {...form.register('summary_en')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary_ar">الملخص (AR)</Label>
                <Textarea id="summary_ar" rows={3} dir="rtl" disabled={!canManageArticles} {...form.register('summary_ar')} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="body_en">Body (EN)</Label>
                <Textarea id="body_en" rows={8} disabled={!canManageArticles} {...form.register('body_en')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body_ar">المحتوى (AR)</Label>
                <Textarea id="body_ar" rows={8} dir="rtl" disabled={!canManageArticles} {...form.register('body_ar')} />
              </div>
            </div>

            <div className="space-y-4">
              <UploadMedia
                value={form.watch('cover_image')}
                label="Cover image"
                description="Upload a hero image that will be displayed on the articles grid."
                onChange={(url) => form.setValue('cover_image', url, { shouldDirty: true })}
                disabled={!canManageArticles}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={saveMutation.isPending || !canManageArticles}>
                {saveMutation.isPending ? 'Saving…' : 'Save article'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDelete && canManageArticles)}
        title="Delete article"
        description="This action cannot be undone."
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (pendingDelete && canManageArticles) {
            deleteMutation.mutate(pendingDelete.id);
          }
        }}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDelete(null);
          }
        }}
      />
    </Card>
  );
};

export default ArticlesManager;
