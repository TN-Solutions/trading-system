'use server';

import { createClient } from '@/lib/supabase/server';
import { Report, ReportWithDetails, ReportWithBlocks } from '@/types/report';
import { revalidatePath } from 'next/cache';

export type ReportCreateData = {
  title: string;
  asset_id: string;
  methodology_id: string;
  main_timeframe: string;
  main_timeframe_bias?: 'bullish' | 'bearish' | 'neutral';
  main_timeframe_notes?: string;
  analysis_date?: string;
  status: 'draft' | 'published';
};

export type ReportUpdateData = ReportCreateData;

// Create a new report
export async function createReport(data: ReportCreateData): Promise<{ success: boolean; report?: Report; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be authenticated to create reports' 
      };
    }

    // Verify asset exists and belongs to user
    const { data: asset, error: assetError } = await supabase
      .from('assets')
      .select('id')
      .eq('id', data.asset_id)
      .eq('user_id', user.id)
      .single();

    if (assetError || !asset) {
      return {
        success: false,
        error: 'Selected asset not found or you do not have permission to use it'
      };
    }

    // Verify methodology exists and belongs to user
    const { data: methodology, error: methodologyError } = await supabase
      .from('methodologies')
      .select('id')
      .eq('id', data.methodology_id)
      .eq('user_id', user.id)
      .single();

    if (methodologyError || !methodology) {
      return {
        success: false,
        error: 'Selected methodology not found or you do not have permission to use it'
      };
    }

    const { data: report, error } = await supabase
      .from('reports')
      .insert([{
        user_id: user.id,
        title: data.title,
        asset_id: data.asset_id,
        methodology_id: data.methodology_id,
        main_timeframe: data.main_timeframe,
        main_timeframe_bias: data.main_timeframe_bias || 'neutral',
        main_timeframe_notes: data.main_timeframe_notes || '',
        analysis_date: data.analysis_date,
        status: data.status
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating report:', error);
      return { 
        success: false, 
        error: 'Failed to create report. Please try again.' 
      };
    }

    revalidatePath('/dashboard/reports');
    return { success: true, report };
  } catch (error) {
    console.error('Unexpected error creating report:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}

// Get all reports for the current user with asset and methodology details
export async function getReports(): Promise<{ success: boolean; reports?: ReportWithDetails[]; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be authenticated to view reports' 
      };
    }

    const { data: reports, error } = await supabase
      .from('reports')
      .select(`
        *,
        asset:assets(id, symbol, name),
        methodology:methodologies(id, name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching reports:', error);
      return { 
        success: false, 
        error: 'Failed to fetch reports. Please try again.' 
      };
    }

    return { success: true, reports: reports || [] };
  } catch (error) {
    console.error('Unexpected error fetching reports:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}

// Get a single report by ID
export async function getReportById(id: string): Promise<{ success: boolean; report?: ReportWithDetails; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be authenticated to view reports' 
      };
    }

    const { data: report, error } = await supabase
      .from('reports')
      .select(`
        *,
        asset:assets(id, symbol, name),
        methodology:methodologies(id, name)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Supabase error fetching report:', error);
      
      if (error.code === 'PGRST116') {
        return { 
          success: false, 
          error: 'Report not found' 
        };
      }
      
      return { 
        success: false, 
        error: 'Failed to fetch report. Please try again.' 
      };
    }

    return { success: true, report };
  } catch (error) {
    console.error('Unexpected error fetching report:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}

// Update an existing report
export async function updateReport(id: string, data: ReportUpdateData): Promise<{ success: boolean; report?: Report; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be authenticated to update reports' 
      };
    }

    // Get the existing report to check current state
    const { data: existingReport, error: getReportError } = await supabase
      .from('reports')
      .select(`
        id, 
        main_timeframe, 
        status,
        analysis_blocks:analysis_blocks(id)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (getReportError || !existingReport) {
      return {
        success: false,
        error: 'Report not found or you do not have permission to access it'
      };
    }

    // Check if main_timeframe is being changed
    const isMainTimeframeChanging = data.main_timeframe && data.main_timeframe !== existingReport.main_timeframe;
    
    if (isMainTimeframeChanging) {
      // Prevent main_timeframe update if report has analysis blocks or is published
      const hasAnalysisBlocks = existingReport.analysis_blocks && existingReport.analysis_blocks.length > 0;
      const isPublished = existingReport.status === 'published';
      
      if (hasAnalysisBlocks || isPublished) {
        return {
          success: false,
          error: 'Cannot change main timeframe after analysis blocks have been added or report is published'
        };
      }
    }

    // Verify asset exists and belongs to user
    const { data: asset, error: assetError } = await supabase
      .from('assets')
      .select('id')
      .eq('id', data.asset_id)
      .eq('user_id', user.id)
      .single();

    if (assetError || !asset) {
      return {
        success: false,
        error: 'Selected asset not found or you do not have permission to use it'
      };
    }

    // Verify methodology exists and belongs to user
    const { data: methodology, error: methodologyError } = await supabase
      .from('methodologies')
      .select('id')
      .eq('id', data.methodology_id)
      .eq('user_id', user.id)
      .single();

    if (methodologyError || !methodology) {
      return {
        success: false,
        error: 'Selected methodology not found or you do not have permission to use it'
      };
    }

    // Prepare update data, excluding main_timeframe if it shouldn't be updated
    const updateData: any = {
      title: data.title,
      asset_id: data.asset_id,
      methodology_id: data.methodology_id,
      main_timeframe_bias: data.main_timeframe_bias,
      main_timeframe_notes: data.main_timeframe_notes,
      analysis_date: data.analysis_date,
      status: data.status
    };

    // Only include main_timeframe if it's allowed to be updated
    if (!isMainTimeframeChanging || (!existingReport.analysis_blocks?.length && existingReport.status === 'draft')) {
      updateData.main_timeframe = data.main_timeframe;
    }

    const { data: report, error } = await supabase
      .from('reports')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating report:', error);
      
      if (error.code === 'PGRST116') {
        return { 
          success: false, 
          error: 'Report not found or you do not have permission to update it' 
        };
      }
      
      return { 
        success: false, 
        error: 'Failed to update report. Please try again.' 
      };
    }

    revalidatePath('/dashboard/reports');
    return { success: true, report };
  } catch (error) {
    console.error('Unexpected error updating report:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}

// Delete a report
export async function deleteReport(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be authenticated to delete reports' 
      };
    }

    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Supabase error deleting report:', error);
      
      if (error.code === 'PGRST116') {
        return { 
          success: false, 
          error: 'Report not found or you do not have permission to delete it' 
        };
      }
      
      return { 
        success: false, 
        error: 'Failed to delete report. Please try again.' 
      };
    }

    revalidatePath('/dashboard/reports');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting report:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}

// Get a single report by ID with analysis blocks for the editor
export async function getReportWithBlocks(id: string): Promise<{ success: boolean; report?: ReportWithBlocks; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be authenticated to view reports' 
      };
    }

    // Get report with asset and methodology details
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select(`
        *,
        asset:assets(id, symbol, name),
        methodology:methodologies(id, name)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (reportError) {
      console.error('Supabase error fetching report:', reportError);
      
      if (reportError.code === 'PGRST116') {
        return { 
          success: false, 
          error: 'Report not found' 
        };
      }
      
      return { 
        success: false, 
        error: 'Failed to fetch report. Please try again.' 
      };
    }

    // Get analysis blocks for this report
    const { data: blocks, error: blocksError } = await supabase
      .from('analysis_blocks')
      .select('*')
      .eq('report_id', id)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (blocksError) {
      console.error('Supabase error fetching analysis blocks:', blocksError);
      return { 
        success: false, 
        error: 'Failed to fetch analysis blocks. Please try again.' 
      };
    }

    const reportWithBlocks: ReportWithBlocks = {
      ...report,
      analysis_blocks: blocks || []
    };

    return { success: true, report: reportWithBlocks };
  } catch (error) {
    console.error('Unexpected error fetching report with blocks:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}