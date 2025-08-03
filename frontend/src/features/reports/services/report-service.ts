import { supabase } from '@/lib/supabase';
import { ReportWithDetails } from '@/types/report';

export class ReportService {
  // Get all reports for the current user (client-side)
  static async getReports(): Promise<ReportWithDetails[]> {
    const { data: reports, error } = await supabase
      .from('reports')
      .select(`
        *,
        asset:assets(id, symbol, name),
        methodology:methodologies(id, name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
      throw new Error('Failed to fetch reports');
    }

    return reports || [];
  }

  // Get a single report by ID (client-side)
  static async getReportById(id: string): Promise<ReportWithDetails | null> {
    const { data: report, error } = await supabase
      .from('reports')
      .select(`
        *,
        asset:assets(id, symbol, name),
        methodology:methodologies(id, name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Report not found
      }
      console.error('Error fetching report:', error);
      throw new Error('Failed to fetch report');
    }

    return report;
  }

  // Search reports by title, asset, or methodology
  static async searchReports(query: string): Promise<ReportWithDetails[]> {
    if (!query.trim()) {
      return this.getReports();
    }

    const { data: reports, error } = await supabase
      .from('reports')
      .select(`
        *,
        asset:assets(id, symbol, name),
        methodology:methodologies(id, name)
      `)
      .or(`title.ilike.%${query}%,asset.symbol.ilike.%${query}%,asset.name.ilike.%${query}%,methodology.name.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching reports:', error);
      throw new Error('Failed to search reports');
    }

    return reports || [];
  }

  // Subscribe to real-time changes for reports
  static subscribeToReports(
    callback: (payload: any) => void
  ) {
    const subscription = supabase
      .channel('reports_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reports'
        },
        callback
      )
      .subscribe();

    return subscription;
  }

  // Unsubscribe from real-time changes
  static unsubscribeFromReports(subscription: any) {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  }
}