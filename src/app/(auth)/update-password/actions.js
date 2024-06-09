"use server";
import { createClient } from '@/app/utils/supabase/server';

export async function resetPassword({ password, accessToken }) {
    const supabase = createClient();
  
    // Exchange the code for a session
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(accessToken);
    if (exchangeError || !data.session) {
        throw new Error('Failed to authenticate with reset token');
      }
    
      // Update the user's password
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        throw new Error(error.message);
      }
    
      return { message: 'Password updated successfully' };
    }