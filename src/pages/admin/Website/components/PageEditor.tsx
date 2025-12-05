import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { getWebsitePage, updateWebsitePage, type PageUpdatePayload } from '@/api/websiteAdmin.service';
import type { PageContent } from '@/types/website';

interface PageEditorProps {
  slug: string;
  title?: string;
  description?: string;
}

interface BlockFormValue {
  key: string;
  type: string | null;
  value_en: string;
  value_ar: string;
}

interface PageFormValues {
  title_en: string;
  title_ar: string;
  blocks: BlockFormValue[];
}

const defaultValues: PageFormValues = {
  title_en: '',
  title_ar: '',
  blocks: [],
};

const serializeValue = (value: unknown, type: string | null | undefined): string => {
  if (type === 'list') {
    if (Array.isArray(value)) {
      return value.join('\n');
    }
    return '';
  }

  if (type === 'json') {
    if (value === null || value === undefined) {
      return '';
    }
    try {
      return JSON.stringify(value, null, 2);
    } catch (error) {
      return String(value ?? '');
    }
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'string') {
    return value;
  }

  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
};

const deserializeValue = (input: string, type: string | null | undefined): unknown => {
  if (type === 'list') {
    return input
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  if (type === 'json') {
    if (!input.trim()) {
      return null;
    }

    return JSON.parse(input);
  }

  const trimmed = input;
  if (!trimmed.length) {
    return null;
  }

  return trimmed;
};

const createFormValues = (page: PageContent | undefined): PageFormValues => {
  if (!page) {
    return defaultValues;
  }

  return {
    title_en: page.title?.en ?? '',
    title_ar: page.title?.ar ?? '',
    blocks: (page.content_blocks ?? []).map((block) => ({
      key: block.key,
      type: block.type ?? 'text',
      value_en: serializeValue(block.value?.en ?? null, block.type),
      value_ar: serializeValue(block.value?.ar ?? null, block.type),
    })),
  };
};

const PageEditor: React.FC<PageEditorProps> = ({ slug, title, description }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const pageQuery = useQuery({
    queryKey: ['admin-website-page', slug],
    queryFn: () => getWebsitePage(slug),
    enabled: Boolean(slug),
  });

  const form = useForm<PageFormValues>({
    defaultValues,
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'blocks',
  });

  useEffect(() => {
    if (pageQuery.data) {
      form.reset(createFormValues(pageQuery.data));
    }
  }, [pageQuery.data, form]);

  const mutation = useMutation({
    mutationFn: (payload: PageUpdatePayload) => updateWebsitePage(slug, payload),
    onSuccess: (data) => {
      toast({ title: 'Content saved successfully' });
      form.reset(createFormValues(data));
      queryClient.invalidateQueries({ queryKey: ['admin-website-page', slug] });
      queryClient.invalidateQueries({ queryKey: ['admin-website-pages'] });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to save content';
      toast({ title: 'Failed to save content', description: message, variant: 'destructive' });
    },
  });

  const isLoading = pageQuery.isLoading || pageQuery.isFetching;
  const isSaving = mutation.isPending;

  const handleSubmit = (values: PageFormValues) => {
    try {
      const contentBlocks = values.blocks.map((block) => {
        const type = block.type ?? 'text';
        let valueEn: unknown;
        let valueAr: unknown;

        try {
          valueEn = deserializeValue(block.value_en ?? '', type);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Invalid JSON value';
          throw new Error(`Block "${block.key}" (EN): ${message}`);
        }

        try {
          valueAr = deserializeValue(block.value_ar ?? '', type);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Invalid JSON value';
          throw new Error(`Block "${block.key}" (AR): ${message}`);
        }

        return {
          key: block.key,
          type,
          value: {
            en: valueEn,
            ar: valueAr,
          },
        };
      });

      mutation.mutate({
        title_en: values.title_en ?? null,
        title_ar: values.title_ar ?? null,
        content_blocks: contentBlocks,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to prepare payload';
      toast({ title: 'Validation error', description: message, variant: 'destructive' });
    }
  };

  const blockCards = useMemo(() => {
    if (!fields.length) {
      return (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base font-semibold">No content blocks found for this page.</CardTitle>
          </CardHeader>
        </Card>
      );
    }

    return fields.map((field, index) => {
      const type = field.type ?? 'text';
      const labelSuffix = type === 'list' ? ' (one item per line)' : type === 'json' ? ' (JSON)' : '';

      return (
        <Card key={field.id} className="border-border/60">
          <CardHeader className="space-y-2">
            <CardTitle className="text-base font-semibold">
              {field.key}
              <span className="ml-2 text-xs font-normal uppercase tracking-wide text-muted-foreground">{type}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name={`blocks.${index}.value_en`}
              render={({ field: controlField }) => (
                <FormItem>
                  <FormLabel>English{labelSuffix}</FormLabel>
                  <FormControl>
                    <Textarea rows={type === 'json' ? 12 : type === 'list' ? 8 : 4} {...controlField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`blocks.${index}.value_ar`}
              render={({ field: controlField }) => (
                <FormItem>
                  <FormLabel>Arabic{labelSuffix}</FormLabel>
                  <FormControl>
                    <Textarea rows={type === 'json' ? 12 : type === 'list' ? 8 : 4} dir="rtl" {...controlField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      );
    });
  }, [fields, form.control]);

  if (!slug) {
    return null;
  }

  return (
    <div className="space-y-6">
      {title || description ? (
        <div className="space-y-1">
          {title ? <h2 className="text-xl font-semibold text-foreground">{title}</h2> : null}
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
      ) : null}

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : null}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page title (EN)</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional English title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان الصفحة (AR)</FormLabel>
                  <FormControl>
                    <Input dir="rtl" placeholder="عنوان اختياري" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">{blockCards}</div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PageEditor;
