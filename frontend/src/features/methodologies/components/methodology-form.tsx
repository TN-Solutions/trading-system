'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Methodology } from '@/types/methodology';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const methodologyFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s\-_.()]+$/, 'Name must contain only letters, numbers, spaces, and basic punctuation'),
  description: z
    .string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional()
});

type MethodologyFormData = z.infer<typeof methodologyFormSchema>;

interface MethodologyFormProps {
  initialData?: Methodology | null;
  pageTitle: string;
  onSubmit: (data: MethodologyFormData) => Promise<void>;
  loading?: boolean;
}

export function MethodologyForm({
  initialData,
  pageTitle,
  onSubmit,
  loading = false
}: MethodologyFormProps) {
  const defaultValues: MethodologyFormData = {
    name: initialData?.name || '',
    description: initialData?.description || ''
  };

  const form = useForm<MethodologyFormData>({
    resolver: zodResolver(methodologyFormSchema),
    defaultValues
  });

  const handleSubmit = async (values: MethodologyFormData) => {
    try {
      await onSubmit(values);
      if (!initialData) {
        form.reset();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder='e.g., ICT, Smart Money Concepts, Elliott Wave' 
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe the methodology, its principles, and key characteristics...'
                      className='min-h-[100px] resize-y'
                      rows={6}
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className='text-right text-sm text-muted-foreground'>
                    {field.value?.length || 0}/2000 characters
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex gap-4'>
              <Button 
                type='submit' 
                disabled={loading}
                className='min-w-[120px]'
              >
                {loading ? 'Saving...' : initialData ? 'Update Methodology' : 'Create Methodology'}
              </Button>
              {initialData && (
                <Button 
                  type='button' 
                  variant='outline'
                  onClick={() => form.reset()}
                  disabled={loading}
                >
                  Reset
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export type { MethodologyFormData };