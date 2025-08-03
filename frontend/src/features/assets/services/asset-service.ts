import { supabase } from '@/lib/supabase';
import { Asset } from '@/types/asset';

export class AssetService {
  // Get all assets for the current user (client-side)
  static async getAssets(): Promise<Asset[]> {
    const { data: assets, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching assets:', error);
      throw new Error('Failed to fetch assets');
    }

    return assets || [];
  }

  // Get a single asset by ID (client-side)
  static async getAssetById(id: string): Promise<Asset | null> {
    const { data: asset, error } = await supabase
      .from('assets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Asset not found
      }
      console.error('Error fetching asset:', error);
      throw new Error('Failed to fetch asset');
    }

    return asset;
  }

  // Search assets by symbol or name
  static async searchAssets(query: string): Promise<Asset[]> {
    if (!query.trim()) {
      return this.getAssets();
    }

    const { data: assets, error } = await supabase
      .from('assets')
      .select('*')
      .or(`symbol.ilike.%${query}%,name.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching assets:', error);
      throw new Error('Failed to search assets');
    }

    return assets || [];
  }

  // Subscribe to real-time changes for assets
  static subscribeToAssets(
    callback: (payload: any) => void
  ) {
    const subscription = supabase
      .channel('assets_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assets'
        },
        callback
      )
      .subscribe();

    return subscription;
  }

  // Unsubscribe from real-time changes
  static unsubscribeFromAssets(subscription: any) {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  }
}