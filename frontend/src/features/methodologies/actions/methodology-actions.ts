'use server';

import { createClient } from '@/lib/supabase/server';
import { Methodology } from '@/types/methodology';
import { revalidatePath } from 'next/cache';

export type MethodologyCreateData = {
  name: string;
  description?: string;
};

export type MethodologyUpdateData = MethodologyCreateData;

// Create a new methodology
export async function createMethodology(data: MethodologyCreateData): Promise<{ success: boolean; methodology?: Methodology; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be authenticated to create methodologies' 
      };
    }

    const { data: methodology, error } = await supabase
      .from('methodologies')
      .insert([{
        user_id: user.id,
        name: data.name,
        description: data.description || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating methodology:', error);
      
      // Handle unique constraint violation
      if (error.code === '23505') {
        return { 
          success: false, 
          error: 'A methodology with this name already exists for your account' 
        };
      }
      
      return { 
        success: false, 
        error: 'Failed to create methodology. Please try again.' 
      };
    }

    revalidatePath('/dashboard/methodologies');
    return { success: true, methodology };
  } catch (error) {
    console.error('Unexpected error creating methodology:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}

// Get all methodologies for the current user
export async function getMethodologies(): Promise<{ success: boolean; methodologies?: Methodology[]; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be authenticated to view methodologies' 
      };
    }

    const { data: methodologies, error } = await supabase
      .from('methodologies')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching methodologies:', error);
      return { 
        success: false, 
        error: 'Failed to fetch methodologies. Please try again.' 
      };
    }

    return { success: true, methodologies: methodologies || [] };
  } catch (error) {
    console.error('Unexpected error fetching methodologies:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}

// Get a single methodology by ID
export async function getMethodologyById(id: string): Promise<{ success: boolean; methodology?: Methodology; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be authenticated to view methodologies' 
      };
    }

    const { data: methodology, error } = await supabase
      .from('methodologies')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Supabase error fetching methodology:', error);
      
      if (error.code === 'PGRST116') {
        return { 
          success: false, 
          error: 'Methodology not found' 
        };
      }
      
      return { 
        success: false, 
        error: 'Failed to fetch methodology. Please try again.' 
      };
    }

    return { success: true, methodology };
  } catch (error) {
    console.error('Unexpected error fetching methodology:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}

// Update an existing methodology
export async function updateMethodology(id: string, data: MethodologyUpdateData): Promise<{ success: boolean; methodology?: Methodology; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be authenticated to update methodologies' 
      };
    }

    const { data: methodology, error } = await supabase
      .from('methodologies')
      .update({
        name: data.name,
        description: data.description || null
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating methodology:', error);
      
      // Handle unique constraint violation
      if (error.code === '23505') {
        return { 
          success: false, 
          error: 'A methodology with this name already exists for your account' 
        };
      }
      
      if (error.code === 'PGRST116') {
        return { 
          success: false, 
          error: 'Methodology not found or you do not have permission to update it' 
        };
      }
      
      return { 
        success: false, 
        error: 'Failed to update methodology. Please try again.' 
      };
    }

    revalidatePath('/dashboard/methodologies');
    return { success: true, methodology };
  } catch (error) {
    console.error('Unexpected error updating methodology:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}

// Delete a methodology
export async function deleteMethodology(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be authenticated to delete methodologies' 
      };
    }

    const { error } = await supabase
      .from('methodologies')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Supabase error deleting methodology:', error);
      
      if (error.code === 'PGRST116') {
        return { 
          success: false, 
          error: 'Methodology not found or you do not have permission to delete it' 
        };
      }
      
      return { 
        success: false, 
        error: 'Failed to delete methodology. Please try again.' 
      };
    }

    revalidatePath('/dashboard/methodologies');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting methodology:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}