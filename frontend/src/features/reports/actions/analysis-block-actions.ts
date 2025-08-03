'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { AnalysisBlock } from '@/types';

// Validation schemas
const analysisBlockSchema = z.object({
  report_id: z.string().uuid('Invalid report ID'),
  timeframe: z.string().min(1, 'Timeframe is required'),
  bias: z.enum(['bullish', 'bearish', 'neutral'], {
    errorMap: () => ({ message: 'Bias must be bullish, bearish, or neutral' }),
  }),
  chart_data: z.any().optional(),
  notes: z.string().optional(),
  snapshot_image_url: z.string().url().optional().or(z.literal('')),
});

const updateAnalysisBlockSchema = analysisBlockSchema.partial().extend({
  id: z.string().uuid('Invalid block ID'),
});

export async function createAnalysisBlock(
  data: z.infer<typeof analysisBlockSchema>
): Promise<{ success: boolean; error?: string; data?: AnalysisBlock }> {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Validate input
    const validatedData = analysisBlockSchema.parse(data);

    // Verify user owns the report
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('id, user_id')
      .eq('id', validatedData.report_id)
      .eq('user_id', user.id)
      .single();

    if (reportError || !report) {
      return { success: false, error: 'Report not found or access denied' };
    }

    // Create analysis block
    const { data: analysisBlock, error } = await supabase
      .from('analysis_blocks')
      .insert({
        ...validatedData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating analysis block:', error);
      return { success: false, error: 'Failed to create analysis block' };
    }

    revalidatePath(`/dashboard/reports/${validatedData.report_id}`);
    return { success: true, data: analysisBlock };
  } catch (error) {
    console.error('Error in createAnalysisBlock:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Validation error' };
    }
    return { success: false, error: 'Failed to create analysis block' };
  }
}

export async function updateAnalysisBlock(
  data: z.infer<typeof updateAnalysisBlockSchema>
): Promise<{ success: boolean; error?: string; data?: AnalysisBlock }> {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Validate input
    const validatedData = updateAnalysisBlockSchema.parse(data);
    const { id, ...updateData } = validatedData;

    // Verify user owns the analysis block
    const { data: existingBlock, error: blockError } = await supabase
      .from('analysis_blocks')
      .select('id, user_id, report_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (blockError || !existingBlock) {
      return { success: false, error: 'Analysis block not found or access denied' };
    }

    // Update analysis block
    const { data: analysisBlock, error } = await supabase
      .from('analysis_blocks')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating analysis block:', error);
      return { success: false, error: 'Failed to update analysis block' };
    }

    revalidatePath(`/dashboard/reports/${existingBlock.report_id}`);
    return { success: true, data: analysisBlock };
  } catch (error) {
    console.error('Error in updateAnalysisBlock:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Validation error' };
    }
    return { success: false, error: 'Failed to update analysis block' };
  }
}

export async function deleteAnalysisBlock(
  blockId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Verify user owns the analysis block and get report_id for revalidation
    const { data: existingBlock, error: blockError } = await supabase
      .from('analysis_blocks')
      .select('id, user_id, report_id')
      .eq('id', blockId)
      .eq('user_id', user.id)
      .single();

    if (blockError || !existingBlock) {
      return { success: false, error: 'Analysis block not found or access denied' };
    }

    // Delete analysis block
    const { error } = await supabase
      .from('analysis_blocks')
      .delete()
      .eq('id', blockId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting analysis block:', error);
      return { success: false, error: 'Failed to delete analysis block' };
    }

    revalidatePath(`/dashboard/reports/${existingBlock.report_id}`);
    return { success: true };
  } catch (error) {
    console.error('Error in deleteAnalysisBlock:', error);
    return { success: false, error: 'Failed to delete analysis block' };
  }
}

export async function getAnalysisBlocksByReportId(
  reportId: string
): Promise<{ success: boolean; error?: string; data?: AnalysisBlock[] }> {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Verify user owns the report
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('id, user_id')
      .eq('id', reportId)
      .eq('user_id', user.id)
      .single();

    if (reportError || !report) {
      return { success: false, error: 'Report not found or access denied' };
    }

    // Get analysis blocks
    const { data: blocks, error } = await supabase
      .from('analysis_blocks')
      .select('*')
      .eq('report_id', reportId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching analysis blocks:', error);
      return { success: false, error: 'Failed to fetch analysis blocks' };
    }

    return { success: true, data: blocks || [] };
  } catch (error) {
    console.error('Error in getAnalysisBlocksByReportId:', error);
    return { success: false, error: 'Failed to fetch analysis blocks' };
  }
}