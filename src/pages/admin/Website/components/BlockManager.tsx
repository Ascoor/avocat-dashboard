import { Fragment } from 'react';
import type { Control, FieldArrayWithId, UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import JSONBlockEditor from './PageEditor/JSONBlockEditor';
import MediaFieldEditor from './PageEditor/MediaFieldEditor';
import TextFieldEditor from './PageEditor/TextFieldEditor';
import type { PageFormValues } from './PageEditor/types';

const BLOCK_TYPES = [
  { value: 'text', label: 'Text block' },
  { value: 'list', label: 'List block' },
  { value: 'json', label: 'JSON block' },
  { value: 'image', label: 'Image asset' },
  { value: 'media', label: 'Media asset' },
];

interface BlockManagerProps {
  form: UseFormReturn<PageFormValues>;
  control: Control<PageFormValues>;
  fields: FieldArrayWithId<PageFormValues, 'blocks', 'id'>[];
  fieldArray: UseFieldArrayReturn<PageFormValues, 'blocks', 'id'>;
  readOnly?: boolean;
}

const BlockManager: React.FC<BlockManagerProps> = ({ form, control, fields, fieldArray, readOnly = false }) => {
  const { append, remove, move } = fieldArray;

  const handleAddBlock = (type: string) => {
    if (readOnly) {
      return;
    }
    append({ key: '', type, value_en: '', value_ar: '' });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Content blocks</CardTitle>
            <CardDescription>Manage localized content modules for the selected page.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={() => handleAddBlock('text')} disabled={readOnly}>
              <Plus className="mr-2 h-4 w-4" /> Add block
            </Button>
          </div>
        </CardHeader>
      </Card>

      {fields.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base font-semibold">No content blocks yet</CardTitle>
            <CardDescription>Add your first block to start composing this page.</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {fields.map((field, index) => {
        const type = form.watch(`blocks.${index}.type`) ?? 'text';

        return (
          <Fragment key={field.id}>
            <Card className="border-border/60">
              <CardHeader className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-3">
                    <FormField
                      control={control}
                      name={`blocks.${index}.key`}
                      render={({ field: keyField }) => (
                        <FormItem>
                          <FormLabel>Block key</FormLabel>
                          <FormControl>
                          <Input placeholder="hero_headline" disabled={readOnly} {...keyField} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-2 sm:w-60">
                    <FormField
                      control={control}
                      name={`blocks.${index}.type`}
                      render={({ field: typeField }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select value={typeField.value ?? 'text'} onValueChange={(value) => typeField.onChange(value)} disabled={readOnly}>
                            <FormControl>
                              <SelectTrigger disabled={readOnly}>
                                <SelectValue placeholder="Select block type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {BLOCK_TYPES.map((blockType) => (
                                <SelectItem key={blockType.value} value={blockType.value}>
                                  {blockType.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => move(index, Math.max(0, index - 1))}
                        disabled={readOnly || index === 0}
                        aria-label="Move block up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => move(index, Math.min(fields.length - 1, index + 1))}
                        disabled={readOnly || index === fields.length - 1}
                        aria-label="Move block down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={readOnly}
                        aria-label="Remove block"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {type === 'json' ? (
                  <JSONBlockEditor control={control} index={index} readOnly={readOnly} />
                ) : type === 'image' || type === 'media' ? (
                  <MediaFieldEditor control={control} form={form} index={index} readOnly={readOnly} />
                ) : (
                  <TextFieldEditor control={control} index={index} type={type} readOnly={readOnly} />
                )}
              </CardContent>
            </Card>
          </Fragment>
        );
      })}
    </div>
  );
};

export default BlockManager;
