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
import { Asset } from '@/types/asset';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const assetFormSchema = z.object({
  symbol: z
    .string()
    .min(1, 'Symbol is required')
    .max(20, 'Symbol must be less than 20 characters')
    .regex(/^[A-Z0-9]+$/, 'Symbol must contain only uppercase letters and numbers'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
});

type AssetFormData = z.infer<typeof assetFormSchema>;

interface AssetFormProps {
  initialData?: Asset | null;
  pageTitle: string;
  onSubmit: (data: AssetFormData) => Promise<void>;
  loading?: boolean;
}

export function AssetForm({
  initialData,
  pageTitle,
  onSubmit,
  loading = false
}: AssetFormProps) {
  const defaultValues: AssetFormData = {
    symbol: initialData?.symbol || '',
    name: initialData?.name || '',
    description: initialData?.description || ''
  };

  const form = useForm<AssetFormData>({
    resolver: zodResolver(assetFormSchema),
    defaultValues
  });

  const handleSubmit = async (values: AssetFormData) => {
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
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='symbol'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symbol</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder='e.g., EURUSD, BTCUSD' 
                        {...field}
                        onChange={(e) => {
                          // Convert to uppercase automatically
                          field.onChange(e.target.value.toUpperCase());
                        }}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder='e.g., Euro / US Dollar' 
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Additional information about this asset...'
                      className='resize-none'
                      rows={4}
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
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
                {loading ? 'Saving...' : initialData ? 'Update Asset' : 'Create Asset'}
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

export type { AssetFormData };