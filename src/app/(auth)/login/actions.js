'use server';

// Importing necessary libraries and functions
import { revalidatePath } from 'next/cache';
import { createClient } from '@/app/utils/supabase/server';

/**
 * Asynchronous function to handle user login.
 * It creates a new Supabase client, attempts to sign in with the provided email and password,
 * and throws an error if the sign-in fails.
 * If the sign-in is successful, it revalidates the root path and returns a success object.
 *
 * @param {Object} credentials - An object containing the user's email and password.
 * @param {string} credentials.email - The user's email.
 * @param {string} credentials.password - The user's password.
 * @returns {Promise<Object>} A promise that resolves to an object containing a success property.
 * @throws {Error} Will throw an error if the sign-in fails.
 */
export async function login({ email, password }) {
  // Create a new Supabase client
  const supabase = createClient();

  // Attempt to sign in with the provided email and password
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  // If the sign-in fails, throw an error
  if (error) {
    throw new Error('Invalid email or password');
  }

  // If the sign-in is successful, revalidate the root path
  revalidatePath('/');

  // Return a success object
  return { success: true };
}

