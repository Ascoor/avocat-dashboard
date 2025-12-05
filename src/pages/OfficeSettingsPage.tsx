import { useEffect, useMemo, useState } from 'react';
import { ImageDown, Moon, Pencil, Plus, Settings2, Sun, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import {
  createExpenseCategory,
  deleteExpenseCategory,
  getExpenseCategories,
  getOfficeBrandingSettings,
  updateExpenseCategory,
  updateOfficeBrandingSettings,
  type LogoVariant,
  type ExpenseCategory,
} from '@/api/officeSettings.service';

const ITEMS_PER_PAGE = 5;

type ExpenseCategoryDialogMode = 'create' | 'edit';

const ExpenseCategoriesSection = () => {
  const { t, isRTL } = useLanguage();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<ExpenseCategoryDialogMode>('create');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ExpenseCategory | null>(null);
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');

  const expenseCategoriesQuery = useQuery({
    queryKey: ['expense-categories'],
    queryFn: getExpenseCategories,
  });

  const categories = useMemo(
    () => expenseCategoriesQuery.data ?? [],
    [expenseCategoriesQuery.data],
  );

  const totalPages = Math.max(1, Math.ceil(categories.length / ITEMS_PER_PAGE));
  const paginatedCategories = useMemo(
    () => categories.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [categories, page],
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleOpenDialog = (mode: ExpenseCategoryDialogMode, category?: ExpenseCategory | null) => {
    setDialogMode(mode);
    setSelectedCategory(category ?? null);
    setName(category?.name ?? '');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCategory(null);
    setName('');
  };

  const createMutation = useMutation({
    mutationFn: createExpenseCategory,
    onSuccess: () => {
      toast({ title: t('officeSettings.expenseCategories.messages.createSuccess') });
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
      handleCloseDialog();
    },
    onError: () => {
      toast({
        title: t('officeSettings.expenseCategories.messages.saveErrorTitle'),
        description: t('officeSettings.expenseCategories.messages.saveErrorDescription'),
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { id: number; name: string }) => updateExpenseCategory(payload.id, { name: payload.name }),
    onSuccess: () => {
      toast({ title: t('officeSettings.expenseCategories.messages.updateSuccess') });
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
      handleCloseDialog();
    },
    onError: () => {
      toast({
        title: t('officeSettings.expenseCategories.messages.saveErrorTitle'),
        description: t('officeSettings.expenseCategories.messages.saveErrorDescription'),
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteExpenseCategory(id),
    onSuccess: () => {
      toast({ title: t('officeSettings.expenseCategories.messages.deleteSuccess') });
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
    },
    onError: () => {
      toast({
        title: t('officeSettings.expenseCategories.messages.deleteErrorTitle'),
        description: t('officeSettings.expenseCategories.messages.deleteErrorDescription'),
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setPendingDelete(null);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }

    if (dialogMode === 'edit' && selectedCategory) {
      updateMutation.mutate({ id: selectedCategory.id, name: name.trim() });
    } else {
      createMutation.mutate({ name: name.trim() });
    }
  };

  const handleDelete = (category: ExpenseCategory) => {
    setPendingDelete(category);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className="overflow-hidden">
      <CardHeader
        className={cn(
          'gap-2 sm:flex-row sm:items-center sm:justify-between',
          isRTL ? 'text-right sm:flex-row-reverse' : 'text-left',
        )}
      >
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold">
            {t('officeSettings.expenseCategories.title')}
          </CardTitle>
          <CardDescription>{t('officeSettings.expenseCategories.description')}</CardDescription>
        </div>
        <Button type="button" onClick={() => handleOpenDialog('create')}>
          <Plus className="h-4 w-4" />
          <span>{t('officeSettings.expenseCategories.add')}</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={cn('w-2/3', isRTL ? 'text-right' : 'text-left')}>
                  {t('officeSettings.expenseCategories.table.name')}
                </TableHead>
                <TableHead className={cn('w-1/3', isRTL ? 'text-left' : 'text-right')}>
                  {t('officeSettings.expenseCategories.table.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenseCategoriesQuery.isLoading ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    {t('common.loading')}
                  </TableCell>
                </TableRow>
              ) : expenseCategoriesQuery.isError ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-destructive">
                    {t('officeSettings.expenseCategories.table.error')}
                  </TableCell>
                </TableRow>
              ) : paginatedCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    {t('officeSettings.expenseCategories.table.empty')}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className={cn('font-medium', isRTL ? 'text-right' : 'text-left')}>
                      {category.name}
                    </TableCell>
                    <TableCell className={cn(isRTL ? 'text-left' : 'text-right')}>
                      <div
                        className={cn(
                          'flex items-center gap-2',
                          isRTL ? 'justify-start' : 'justify-end',
                        )}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog('edit', category)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="text-sm">{t('common.edit')}</span>
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(category)}
                          disabled={deleteMutation.isPending && pendingDelete?.id === category.id}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="text-sm">{t('common.delete')}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div
          className={cn(
            'flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between',
            isRTL ? 'sm:flex-row-reverse' : '',
          )}
        >
          <span>
            {t('officeSettings.expenseCategories.pagination.label', {
              current: page,
              total: totalPages,
            })}
          </span>
          <div className={cn('flex items-center gap-2', isRTL ? 'flex-row-reverse' : '')}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              {t('table.previous')}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
            >
              {t('table.next')}
            </Button>
          </div>
        </div>
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={(open) => (!open ? handleCloseDialog() : setDialogOpen(open))}>
        <DialogContent dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader className={isRTL ? 'text-right' : 'text-left'}>
            <DialogTitle>
              {dialogMode === 'edit'
                ? t('officeSettings.expenseCategories.dialog.editTitle')
                : t('officeSettings.expenseCategories.dialog.createTitle')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="expense-category-name">
                {t('officeSettings.expenseCategories.form.nameLabel')}
              </Label>
              <Input
                id="expense-category-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={t('officeSettings.expenseCategories.form.namePlaceholder')}
                autoFocus
              />
            </div>
            <DialogFooter
              className={cn(
                'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2',
                isRTL ? 'sm:flex-row-reverse sm:space-x-reverse' : '',
              )}
            >
              <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {dialogMode === 'edit'
                  ? t('officeSettings.expenseCategories.form.submitUpdate')
                  : t('officeSettings.expenseCategories.form.submitCreate')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t('officeSettings.expenseCategories.delete.title', {
          name: pendingDelete?.name ?? '',
        })}
        description={t('officeSettings.expenseCategories.delete.description')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
        onClose={() => setPendingDelete(null)}
      />
    </Card>
  );
};

const PlaceholderSection = ({ section }: { section: 'serviceTypes' | 'procedurePlaceTypes' | 'procedureTypes' }) => {
  const { t, isRTL } = useLanguage();

  return (
    <Card className="overflow-hidden">
      <CardHeader className={cn('space-y-2', isRTL ? 'text-right' : 'text-left')}>
        <CardTitle>{t(`officeSettings.placeholders.${section}.title`)}</CardTitle>
        <CardDescription>{t(`officeSettings.placeholders.${section}.description`)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-dashed border-muted-foreground/40 bg-muted/30 p-8 text-center text-sm text-muted-foreground">
          {t('officeSettings.placeholders.shared.message')}
        </div>
      </CardContent>
    </Card>
  );
};

type BrandingThemeMode = 'light' | 'dark';

type BrandingFormState = {
  officeName: string;
  theme: {
    light: { primary: string; surface: string; accent: string };
    dark: { primary: string; surface: string; accent: string };
  };
};

const logoVariants: LogoVariant[] = ['primary', 'light', 'dark', 'icon'];

const GeneralSettingsSection = () => {
  const { t, isRTL } = useLanguage();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formState, setFormState] = useState<BrandingFormState>({
    officeName: '',
    theme: {
      light: { primary: '#1E3A8A', surface: 'var(var(--background))FFF', accent: 'var(var(--primary))' },
      dark: { primary: '#60A5FA', surface: '#0B1120', accent: 'var(var(--gold-muted))' },
    },
  });
  const [logoFiles, setLogoFiles] = useState<Record<LogoVariant, File | null>>({
    primary: null,
    light: null,
    dark: null,
    icon: null,
  });
  const [logoPreviews, setLogoPreviews] = useState<Record<LogoVariant, string | null>>({
    primary: null,
    light: null,
    dark: null,
    icon: null,
  });
  const [previewMode, setPreviewMode] = useState<BrandingThemeMode>('light');

  const brandingQuery = useQuery({
    queryKey: ['office-branding'],
    queryFn: getOfficeBrandingSettings,
  });

  useEffect(() => {
    if (!brandingQuery.data) {
      return;
    }

    setFormState({
      officeName: brandingQuery.data.officeName,
      theme: {
        light: {
          primary: brandingQuery.data.theme.light.primary,
          surface: brandingQuery.data.theme.light.surface,
          accent: brandingQuery.data.theme.light.accent,
        },
        dark: {
          primary: brandingQuery.data.theme.dark.primary,
          surface: brandingQuery.data.theme.dark.surface,
          accent: brandingQuery.data.theme.dark.accent,
        },
      },
    });

    setLogoPreviews({
      primary: brandingQuery.data.logos.primary?.url ?? null,
      light: brandingQuery.data.logos.light?.url ?? null,
      dark: brandingQuery.data.logos.dark?.url ?? null,
      icon: brandingQuery.data.logos.icon?.url ?? null,
    });
    setLogoFiles({ primary: null, light: null, dark: null, icon: null });
  }, [brandingQuery.data]);

  useEffect(() => {
    return () => {
      Object.values(logoPreviews).forEach((preview) => {
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [logoPreviews]);

  const updateBrandingMutation = useMutation({
    mutationFn: updateOfficeBrandingSettings,
    onSuccess: (data) => {
      toast({ title: t('officeSettings.generalSettings.messages.updateSuccess') });
      queryClient.invalidateQueries({ queryKey: ['office-branding'] });
      setLogoFiles({ primary: null, light: null, dark: null, icon: null });
      setLogoPreviews({
        primary: data.logos.primary?.url ?? null,
        light: data.logos.light?.url ?? null,
        dark: data.logos.dark?.url ?? null,
        icon: data.logos.icon?.url ?? null,
      });
    },
    onError: () => {
      toast({
        title: t('officeSettings.generalSettings.messages.saveErrorTitle'),
        description: t('officeSettings.generalSettings.messages.saveErrorDescription'),
        variant: 'destructive',
      });
    },
  });

  const handleColorChange = (
    mode: BrandingThemeMode,
    field: keyof BrandingFormState['theme']['light'],
    value: string,
  ) => {
    setFormState((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        [mode]: {
          ...prev.theme[mode],
          [field]: value,
        },
      },
    }));
  };

  const handleLogoChange = (variant: LogoVariant, file: File | null) => {
    setLogoFiles((prev) => ({
      ...prev,
      [variant]: file,
    }));

    setLogoPreviews((prev) => {
      const next = { ...prev };
      if (prev[variant] && prev[variant]?.startsWith('blob:')) {
        URL.revokeObjectURL(prev[variant] as string);
      }
      next[variant] = file ? URL.createObjectURL(file) : brandingQuery.data?.logos[variant]?.url ?? null;
      return next;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('office_name', formState.officeName);
    formData.append('theme[light][primary]', formState.theme.light.primary);
    formData.append('theme[light][surface]', formState.theme.light.surface);
    formData.append('theme[light][accent]', formState.theme.light.accent);
    formData.append('theme[dark][primary]', formState.theme.dark.primary);
    formData.append('theme[dark][surface]', formState.theme.dark.surface);
    formData.append('theme[dark][accent]', formState.theme.dark.accent);

    logoVariants.forEach((variant) => {
      const file = logoFiles[variant];
      if (file) {
        formData.append(`logos[${variant}]`, file);
      }
    });

    updateBrandingMutation.mutate(formData);
  };

  const logoConfigurations: Record<LogoVariant, { label: string; description: string; constraints: string }> = {
    primary: {
      label: t('officeSettings.generalSettings.logos.primary.label'),
      description: t('officeSettings.generalSettings.logos.primary.description'),
      constraints: t('officeSettings.generalSettings.logos.primary.constraints'),
    },
    light: {
      label: t('officeSettings.generalSettings.logos.light.label'),
      description: t('officeSettings.generalSettings.logos.light.description'),
      constraints: t('officeSettings.generalSettings.logos.light.constraints'),
    },
    dark: {
      label: t('officeSettings.generalSettings.logos.dark.label'),
      description: t('officeSettings.generalSettings.logos.dark.description'),
      constraints: t('officeSettings.generalSettings.logos.dark.constraints'),
    },
    icon: {
      label: t('officeSettings.generalSettings.logos.icon.label'),
      description: t('officeSettings.generalSettings.logos.icon.description'),
      constraints: t('officeSettings.generalSettings.logos.icon.constraints'),
    },
  };

  const themeColors = formState.theme[previewMode];

  return (
    <Card className="overflow-hidden">
      <CardHeader className={cn('space-y-2', isRTL ? 'text-right' : 'text-left')}>
        <CardTitle>{t('officeSettings.generalSettings.title')}</CardTitle>
        <CardDescription>{t('officeSettings.generalSettings.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-10">
          <section className="space-y-4">
            <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-end', isRTL ? 'sm:flex-row-reverse' : '')}>
              <div className="flex-1 space-y-2">
                <Label htmlFor="office-name">{t('officeSettings.generalSettings.form.officeName.label')}</Label>
                <Input
                  id="office-name"
                  placeholder={t('officeSettings.generalSettings.form.officeName.placeholder')}
                  value={formState.officeName}
                  onChange={(event) => setFormState((prev) => ({ ...prev, officeName: event.target.value }))}
                />
              </div>
              {brandingQuery.data?.updated_at ? (
                <div className={cn('text-sm text-muted-foreground', isRTL ? 'text-left' : 'text-right')}>
                  <p>{t('officeSettings.generalSettings.metadata.lastUpdated')}</p>
                  <p>{new Date(brandingQuery.data.updated_at).toLocaleString()}</p>
                </div>
              ) : null}
            </div>
          </section>

          <Separator />

          <section className="space-y-6">
            <div className={cn('space-y-2', isRTL ? 'text-right' : 'text-left')}>
              <h3 className="text-lg font-semibold">{t('officeSettings.generalSettings.logos.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('officeSettings.generalSettings.logos.description')}</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {logoVariants.map((variant) => {
                const config = logoConfigurations[variant];
                const preview = logoPreviews[variant];
                const file = logoFiles[variant];

                return (
                  <div key={variant} className="space-y-3 rounded-lg border border-border/60 p-4">
                    <div className={cn('space-y-1', isRTL ? 'text-right' : 'text-left')}>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{config.label}</Badge>
                        {file ? (
                          <span className="text-xs text-muted-foreground">{file.name}</span>
                        ) : null}
                      </div>
                      <p className="text-sm text-muted-foreground">{config.description}</p>
                      <p className="text-xs font-medium text-muted-foreground/80">{config.constraints}</p>
                    </div>
                    <div className="overflow-hidden rounded-md border border-dashed border-border/60 bg-muted/40 p-3">
                      <AspectRatio ratio={3 / 1} className="flex items-center justify-center bg-background">
                        {preview ? (
                          <img src={preview} alt={config.label} className="h-full w-full object-contain" />
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                            <ImageDown className="h-8 w-8" />
                            <span className="text-xs">{t('officeSettings.generalSettings.logos.empty')}</span>
                          </div>
                        )}
                      </AspectRatio>
                    </div>
                    <Input
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml"
                      onChange={(event) => handleLogoChange(variant, event.target.files?.[0] ?? null)}
                    />
                  </div>
                );
              })}
            </div>
          </section>

          <Separator />

          <section className="space-y-6">
            <div className={cn('space-y-2', isRTL ? 'text-right' : 'text-left')}>
              <h3 className="text-lg font-semibold">{t('officeSettings.generalSettings.theme.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('officeSettings.generalSettings.theme.description')}</p>
            </div>
            <div className={cn('flex flex-col gap-6 lg:flex-row', isRTL ? 'lg:flex-row-reverse' : '')}>
              <div className="flex-1 space-y-4">
                {(['light', 'dark'] as BrandingThemeMode[]).map((mode) => (
                  <div key={mode} className="space-y-3 rounded-lg border border-border/60 p-4">
                    <div className={cn('flex items-center justify-between', isRTL ? 'flex-row-reverse' : '')}>
                      <div className={cn('space-y-1', isRTL ? 'text-right' : 'text-left')}>
                        <p className="text-sm font-medium">
                          {t(`officeSettings.generalSettings.theme.modes.${mode}.title`)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t(`officeSettings.generalSettings.theme.modes.${mode}.description`)}
                        </p>
                      </div>
                      <Badge variant="outline">{mode === 'light' ? 'RGB' : 'HEX'}</Badge>
                    </div>
                    <div className={cn('grid gap-4 sm:grid-cols-3', isRTL ? 'text-right' : 'text-left')}>
                      {(Object.keys(formState.theme[mode]) as Array<keyof BrandingFormState['theme']['light']>).map((field) => (
                        <div key={field} className="space-y-2">
                          <Label htmlFor={`${mode}-${field}`} className="text-xs uppercase tracking-wide">
                            {t(`officeSettings.generalSettings.theme.fields.${field}`)}
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id={`${mode}-${field}`}
                              type="color"
                              className="h-10 w-14 cursor-pointer border border-border/60 p-1"
                              value={formState.theme[mode][field]}
                              onChange={(event) => handleColorChange(mode, field, event.target.value)}
                            />
                            <Input
                              value={formState.theme[mode][field]}
                              onChange={(event) => handleColorChange(mode, field, event.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full max-w-sm space-y-4 rounded-lg border border-border/60 p-4">
                <div className={cn('flex items-center justify-between', isRTL ? 'flex-row-reverse' : '')}>
                  <p className="text-sm font-medium">{t('officeSettings.generalSettings.theme.preview.title')}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Sun className="h-4 w-4" />
                    <Switch
                      checked={previewMode === 'dark'}
                      onCheckedChange={(checked) => setPreviewMode(checked ? 'dark' : 'light')}
                    />
                    <Moon className="h-4 w-4" />
                  </div>
                </div>
                <div
                  className="space-y-4 rounded-md p-4"
                  style={{
                    backgroundColor: themeColors.surface,
                    color: themeColors.primary,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{formState.officeName || t('officeSettings.generalSettings.theme.preview.placeholder')}</span>
                    <span className="rounded-full border border-current px-2 py-1 text-xs" style={{ color: themeColors.accent }}>
                      {t('officeSettings.generalSettings.theme.preview.badge')}
                    </span>
                  </div>
                  <div className="rounded-md border border-dashed border-current/40 bg-white/40 p-4 text-center text-xs"
                    style={{
                      background: previewMode === 'dark' ? 'rgba(15,23,42,0.45)' : 'rgba(255,255,255,0.65)',
                      color: themeColors.accent,
                    }}
                  >
                    {t('officeSettings.generalSettings.theme.preview.message')}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>{t('officeSettings.generalSettings.theme.preview.primary', { color: themeColors.primary })}</span>
                    <span>{t('officeSettings.generalSettings.theme.preview.accent', { color: themeColors.accent })}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between', isRTL ? 'sm:flex-row-reverse' : '')}>
            <div className="text-sm text-muted-foreground">
              {brandingQuery.isFetching
                ? t('officeSettings.generalSettings.form.status.loading')
                : brandingQuery.isError
                ? t('officeSettings.generalSettings.form.status.error')
                : t('officeSettings.generalSettings.form.status.ready')}
            </div>
            <div className={cn('flex flex-col-reverse gap-2 sm:flex-row', isRTL ? 'sm:flex-row-reverse' : '')}>
              <Button
                type="button"
                variant="outline"
                onClick={() => brandingQuery.refetch()}
                disabled={brandingQuery.isFetching}
              >
                {t('officeSettings.generalSettings.form.actions.reset')}
              </Button>
              <Button type="submit" disabled={updateBrandingMutation.isPending}>
                {updateBrandingMutation.isPending
                  ? t('officeSettings.generalSettings.form.actions.submitting')
                  : t('officeSettings.generalSettings.form.actions.save')}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const OfficeSettingsPage = () => {
  const { t, isRTL } = useLanguage();
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader
        iconKey="officeSettings"
        title={t('officeSettings.title')}
        subtitle={t('officeSettings.subtitle')}
        actions={
          <Button type="button" variant="outline" onClick={handleRefresh}>
            <Settings2 className="h-4 w-4" />
            <span>{t('officeSettings.actions.refresh')}</span>
          </Button>
        }
      />

      <Tabs defaultValue="expenseCategories" dir={isRTL ? 'rtl' : 'ltr'} className="space-y-6">
        <TabsList
          className={cn(
            'flex w-full flex-wrap gap-2 rounded-md border border-border/60 bg-muted/40 p-1',
            isRTL ? 'justify-end' : 'justify-start',
          )}
        >
          <TabsTrigger value="expenseCategories" className="flex-1 sm:flex-none">
            {t('officeSettings.tabs.expenseCategories')}
          </TabsTrigger>
          <TabsTrigger value="generalSettings" className="flex-1 sm:flex-none">
            {t('officeSettings.tabs.generalSettings')}
          </TabsTrigger>
          <TabsTrigger value="serviceTypes" className="flex-1 sm:flex-none">
            {t('officeSettings.tabs.serviceTypes')}
          </TabsTrigger>
          <TabsTrigger value="procedurePlaceTypes" className="flex-1 sm:flex-none">
            {t('officeSettings.tabs.procedurePlaceTypes')}
          </TabsTrigger>
          <TabsTrigger value="procedureTypes" className="flex-1 sm:flex-none">
            {t('officeSettings.tabs.procedureTypes')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expenseCategories">
          <ExpenseCategoriesSection />
        </TabsContent>
        <TabsContent value="generalSettings">
          <GeneralSettingsSection />
        </TabsContent>
        <TabsContent value="serviceTypes">
          <PlaceholderSection section="serviceTypes" />
        </TabsContent>
        <TabsContent value="procedurePlaceTypes">
          <PlaceholderSection section="procedurePlaceTypes" />
        </TabsContent>
        <TabsContent value="procedureTypes">
          <PlaceholderSection section="procedureTypes" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OfficeSettingsPage;
