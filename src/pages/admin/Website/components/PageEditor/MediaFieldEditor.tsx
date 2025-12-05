import type { Control, UseFormReturn } from 'react-hook-form';

import UploadMedia from '../UploadMedia';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import type { PageFormValues } from './types';

interface MediaFieldEditorProps {
  control: Control<PageFormValues>;
  form: UseFormReturn<PageFormValues>;
  index: number;
  readOnly?: boolean;
}

const MediaFieldEditor: React.FC<MediaFieldEditorProps> = ({ control, form, index, readOnly = false }) => {
  const valueEn = form.watch(`blocks.${index}.value_en`);
  const valueAr = form.watch(`blocks.${index}.value_ar`);

  const handleUpload = (url: string) => {
    form.setValue(`blocks.${index}.value_en`, url, { shouldDirty: true });
    form.setValue(`blocks.${index}.value_ar`, url, { shouldDirty: true });
  };

  return (
    <div className="space-y-4">
      <UploadMedia value={valueEn || valueAr || ''} onChange={handleUpload} disabled={readOnly} />

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name={`blocks.${index}.value_en`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Media URL (EN)</FormLabel>
              <FormControl>
                <Input placeholder="https://" disabled={readOnly} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`blocks.${index}.value_ar`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>رابط الوسائط (AR)</FormLabel>
              <FormControl>
                <Input dir="rtl" placeholder="https://" disabled={readOnly} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default MediaFieldEditor;
