"use server"
import { createClient } from "../utils/supabase/server";


/**
 * Fetches the user data from Supabase.
 * 
 * @returns {Promise<Object|null>} The user data or null if no user is authenticated.
 */
export async function getUser() {
  const supabase = createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Failed to fetch user:', error.message);
    return null; 
  }

  return user;
}

/**
 * Logs in the user with the provided email and password.
 * 
 * @param {Object} values - The login values.
 * @param {string} values.email - The email address.
 * @param {string} values.password - The password.
 * @returns {Promise<Object>} The login result.
 * @throws Will throw an error if login fails.
 */
export async function login({ email, password }) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error('Invalid email or password');
  }

  return { success: true };
}