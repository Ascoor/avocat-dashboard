import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PublishScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: { scheduled_for: string; notes?: string | null }) => void;
  defaultDate?: string | null;
  isSubmitting?: boolean;
}

interface ScheduleFormValues {
  scheduled_for: string;
  notes: string;
}

const defaultValues: ScheduleFormValues = {
  scheduled_for: '',
  notes: '',
};

const normalizeDateInput = (input?: string | null): string => {
  if (!input) {
    return '';
  }

  try {
    const date = new Date(input);
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16);
  } catch (error) {
    return '';
  }
};

const PublishScheduleModal: React.FC<PublishScheduleModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  defaultDate,
  isSubmitting,
}) => {
  const form = useForm<ScheduleFormValues>({ defaultValues });

  useEffect(() => {
    if (open) {
      form.reset({
        scheduled_for: normalizeDateInput(defaultDate) || '',
        notes: '',
      });
    }
  }, [defaultDate, form, open]);

  const handleSubmit = (values: ScheduleFormValues) => {
    if (!values.scheduled_for) {
      form.setError('scheduled_for', { message: 'Please choose a publication time' });
      return;
    }

    const date = new Date(values.scheduled_for);
    onSubmit({
      scheduled_for: date.toISOString(),
      notes: values.notes.trim() || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Schedule publish</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="scheduled_for"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publish on</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" min={normalizeDateInput(new Date().toISOString())} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Add context for the reviewer or publisher" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Scheduling…' : 'Schedule'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PublishScheduleModal;
