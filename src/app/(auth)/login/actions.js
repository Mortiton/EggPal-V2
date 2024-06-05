'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/app/utils/supabase/server';

export async function login({ email, password }) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error('Invalid email or password');
  }

  revalidatePath('/');
  return { success: true };
}