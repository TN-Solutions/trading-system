import { supabase } from '@/lib/supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// Upload image to Supabase Storage
export async function uploadReportImage(
  file: File,
  userId: string,
  reportId: string,
  imageType: 'main-timeframe' | 'analysis-block' = 'main-timeframe'
): Promise<UploadResult> {
  try {
    // Create file path: {user_id}/{report_id}/{image_type}-{timestamp}.webp
    const timestamp = Date.now();
    const filePath = `${userId}/${reportId}/${imageType}-${timestamp}.webp`;
    
    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('report-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return {
        success: false,
        error: uploadError.message
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('report-images')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl
    };

  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: 'Failed to upload image'
    };
  }
}

// Delete image from Supabase Storage
export async function deleteReportImage(filePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('report-images')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

// Extract file path from Supabase Storage URL
export function extractFilePathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');
    
    // Expected format: /storage/v1/object/public/report-images/{user_id}/{report_id}/{filename}
    const bucketIndex = pathSegments.indexOf('report-images');
    if (bucketIndex !== -1 && pathSegments.length > bucketIndex + 1) {
      return pathSegments.slice(bucketIndex + 1).join('/');
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting file path from URL:', error);
    return null;
  }
}