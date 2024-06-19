"use server";
import { createClient } from '@/app/utils/supabase/server';


/**
 * Resets the user's password.
 *
 * @param {Object} params - The parameters.
 * @param {string} params.password - The new password.
 * @param {string} params.accessToken - The access token.
 *
 * @returns {Promise<Object>} A promise that resolves to an object with a message indicating that the password was updated successfully.
 *
 * @throws {Error} If there is an error exchanging the code for a session or updating the user's password.
 */
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