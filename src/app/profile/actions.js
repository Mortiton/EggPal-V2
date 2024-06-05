'use server';

import { createClient } from '@/app/utils/supabase/server';

export async function updateEmail(email) {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ email });

  if (error) {
    throw new Error(error.message);
  }
}

export async function updatePassword(currentPassword, newPassword) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) {
      throw new Error("User not authenticated");
    }
  
    // Reauthenticate the user with the current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
  
    if (signInError) {
      throw new Error("Current password is incorrect");
    }
  
    const { error } = await supabase.auth.updateUser({ password: newPassword });
  
    if (error) {
      throw new Error(error.message);
    }
  }