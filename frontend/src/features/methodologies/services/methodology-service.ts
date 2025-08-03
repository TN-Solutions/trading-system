import { supabase } from '@/lib/supabase';
import { Methodology } from '@/types/methodology';

export class MethodologyService {
  // DEPRECATED: Use server actions instead of client-side queries for security
  // This class is kept for reference but should not be used in production
  // All methodology operations should go through server actions in methodology-actions.ts
  
  private constructor() {
    // Prevent instantiation - use server actions instead
  }
  
  static deprecationWarning() {
    console.warn(
      'MethodologyService is deprecated. Use server actions from methodology-actions.ts for secure, RLS-enforced operations.'
    );
  }
}