import type { Control } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import type { PageFormValues } from './types';

interface TextFieldEditorProps {
  control: Control<PageFormValues>;
  index: number;
  type?: string | null;
  readOnly?: boolean;
}

const resolveRows = (type: string | null | undefined) => {
  if (type === 'list') {
    return 6;
  }

  return 4;
};

const TextFieldEditor: React.FC<TextFieldEditorProps> = ({ control, index, type, readOnly = false }) => {
  const labelSuffix = type === 'list' ? ' (one item per line)' : '';

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={control}
        name={`blocks.${index}.value_en`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>English{labelSuffix}</FormLabel>
            <FormControl>
              <Textarea rows={resolveRows(type)} disabled={readOnly} {...field} />
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
            <FormLabel>Arabic{labelSuffix}</FormLabel>
            <FormControl>
              <Textarea rows={resolveRows(type)} dir="rtl" disabled={readOnly} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TextFieldEditor;
