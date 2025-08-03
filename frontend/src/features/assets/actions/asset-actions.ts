'use server';

import { createClient } from '@/lib/supabase/server';
import { Asset } from '@/types/asset';
import { revalidatePath } from 'next/cache';

export type AssetCreateData = {
  symbol: string;
  name: string;
  description?: string;
};

export type AssetUpdateData = AssetCreateData;

// Create a new asset
export async function createAsset(data: AssetCreateData): Promise<{ success: boolean; asset?: Asset; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be authenticated to create assets' 
      };
    }

    const { data: asset, error } = await supabase
      .from('assets')
      .insert([{
        user_id: user.id,
        symbol: data.symbol,
        name: data.name,
        description: data.description || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating asset:', error);
      
      // Handle unique constraint violation
      if (error.code === '23505') {
        return { 
          success: false, 
          error: 'An asset with this symbol already exists for your account' 
        };
      }
      
      return { 
        success: false, 
        error: 'Failed to create asset. Please try again.' 
      };
    }

    revalidatePath('/dashboard/assets');
    return { success: true, asset };
  } catch (error) {
    console.error('Unexpected error creating asset:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}

// Get all assets for the current user
export async function getAssets(): Promise<{ success: boolean; assets?: Asset[]; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be authenticated to view assets' 
      };
    }

    const { data: assets, error } = await supabase
      .from('assets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching assets:', error);
      return { 
        success: false, 
        error: 'Failed to fetch assets. Please try again.' 
      };
    }

    return { success: true, assets: assets || [] };
  } catch (error) {
    console.error('Unexpected error fetching assets:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}

// Get a single asset by ID
export async function getAssetById(id: string): Promise<{ success: boolean; asset?: Asset; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be authenticated to view assets' 
      };
    }

    const { data: asset, error } = await supabase
      .from('assets')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Supabase error fetching asset:', error);
      
      if (error.code === 'PGRST116') {
        return { 
          success: false, 
          error: 'Asset not found' 
        };
      }
      
      return { 
        success: false, 
        error: 'Failed to fetch asset. Please try again.' 
      };
    }

    return { success: true, asset };
  } catch (error) {
    console.error('Unexpected error fetching asset:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}

// Update an existing asset
export async function updateAsset(id: string, data: AssetUpdateData): Promise<{ success: boolean; asset?: Asset; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be authenticated to update assets' 
      };
    }

    const { data: asset, error } = await supabase
      .from('assets')
      .update({
        symbol: data.symbol,
        name: data.name,
        description: data.description || null
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating asset:', error);
      
      // Handle unique constraint violation
      if (error.code === '23505') {
        return { 
          success: false, 
          error: 'An asset with this symbol already exists for your account' 
        };
      }
      
      if (error.code === 'PGRST116') {
        return { 
          success: false, 
          error: 'Asset not found or you do not have permission to update it' 
        };
      }
      
      return { 
        success: false, 
        error: 'Failed to update asset. Please try again.' 
      };
    }

    revalidatePath('/dashboard/assets');
    return { success: true, asset };
  } catch (error) {
    console.error('Unexpected error updating asset:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}

// Delete an asset
export async function deleteAsset(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be authenticated to delete assets' 
      };
    }

    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Supabase error deleting asset:', error);
      
      if (error.code === 'PGRST116') {
        return { 
          success: false, 
          error: 'Asset not found or you do not have permission to delete it' 
        };
      }
      
      return { 
        success: false, 
        error: 'Failed to delete asset. Please try again.' 
      };
    }

    revalidatePath('/dashboard/assets');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting asset:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}