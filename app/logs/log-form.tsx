'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useState } from 'react';
import { toast } from 'sonner';
import { createLog } from '@/action/create-log';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  content: z
    .string()
    .min(10, { message: 'Log must be at least 10 characters' })
    .max(1000, { message: 'Log cannot exceed 1000 characters' }),
});

type FormData = z.infer<typeof formSchema>;

export default function SubmitLogPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: '' },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    const { message, success } = await createLog({
      content: data.content,
    });

    if (message) {
      if (success) {
        toast.success(message);
        form.reset();
      } else {
        toast.error(message);
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className='mx-auto p-6 max-w-xl'>
      <h1 className='mb-4 font-bold text-xl'>Submit Daily Work Log</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Log</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder='What did you work on today?'
                    rows={6}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' disabled={isSubmitting}>
            Submit Log
            {isSubmitting ? <Loader2 className='w-5 h-5 animate-spin' /> : null}
          </Button>
        </form>
      </Form>
    </div>
  );
}
