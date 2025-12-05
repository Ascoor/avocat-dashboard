import type { Control } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import type { PageFormValues } from './types';

interface JSONBlockEditorProps {
  control: Control<PageFormValues>;
  index: number;
  readOnly?: boolean;
}

const JSONBlockEditor: React.FC<JSONBlockEditorProps> = ({ control, index, readOnly = false }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={control}
        name={`blocks.${index}.value_en`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>English JSON</FormLabel>
            <FormControl>
              <Textarea rows={12} disabled={readOnly} {...field} />
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
            <FormLabel>Arabic JSON</FormLabel>
            <FormControl>
              <Textarea rows={12} dir="rtl" disabled={readOnly} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default JSONBlockEditor;
