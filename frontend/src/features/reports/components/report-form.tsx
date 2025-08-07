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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Asset } from '@/types/asset';
import { Methodology } from '@/types/methodology';
import { Report } from '@/types/report';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const timeframeOptions = [
  'M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1', 'MN1'
];

const reportFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  asset_id: z
    .string()
    .min(1, 'Asset is required'),
  methodology_id: z
    .string()
    .min(1, 'Methodology is required'),
  main_timeframe: z
    .string()
    .min(1, 'Main timeframe is required'),
  analysis_date: z
    .string()
    .min(1, 'Analysis date is required'),
  status: z.enum(['draft', 'published'])
});

type ReportFormData = z.infer<typeof reportFormSchema>;

interface ReportFormProps {
  initialData?: Report | null;
  pageTitle: string;
  onSubmit: (data: ReportFormData) => Promise<void>;
  loading?: boolean;
  assets: Asset[];
  methodologies: Methodology[];
}

export function ReportForm({
  initialData,
  pageTitle,
  onSubmit,
  loading = false,
  assets,
  methodologies
}: ReportFormProps) {
  const defaultValues: ReportFormData = {
    title: initialData?.title || '',
    asset_id: initialData?.asset_id || '',
    methodology_id: initialData?.methodology_id || '',
    main_timeframe: initialData?.main_timeframe || 'H4',
    analysis_date: initialData?.analysis_date ? new Date(initialData.analysis_date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    status: initialData?.status || 'draft'
  };

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportFormSchema),
    defaultValues
  });

  const handleSubmit = async (values: ReportFormData) => {
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
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder='e.g., Q4 2024 EUR/USD Analysis' 
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
              name='analysis_date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Analysis Date & Time</FormLabel>
                  <FormControl>
                    <Input 
                      type="datetime-local"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='asset_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an asset" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {assets.map((asset) => (
                          <SelectItem key={asset.id} value={asset.id}>
                            <div className="flex items-center">
                              <span className="font-mono font-semibold mr-2">{asset.symbol}</span>
                              <span className="text-muted-foreground">{asset.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name='methodology_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Methodology</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a methodology" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {methodologies.map((methodology) => (
                          <SelectItem key={methodology.id} value={methodology.id}>
                            {methodology.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='main_timeframe'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Timeframe</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select main timeframe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeframeOptions.map((timeframe) => (
                        <SelectItem key={timeframe} value={timeframe}>
                          {timeframe}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
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
                {loading ? 'Saving...' : initialData ? 'Update Report' : 'Create Report'}
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

export type { ReportFormData };