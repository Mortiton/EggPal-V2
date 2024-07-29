"use server"
import { createClient } from "../utils/supabase/server";
import { cookies } from 'next/headers'


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
 * Fetches the current session from Supabase.
 * 
 * @returns {Promise<Object|null>} The session data or null if no session exists.
 */
export async function getSession() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore);

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Failed to fetch session:', error.message);
    return null;
  }

  return session;
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

export async function resetPassword(email) {
  const supabase = createClient();
  const resetLinkRedirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/update-password`;  

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: resetLinkRedirectUrl,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateUserPassword({ password, token }) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.updateUser({ 
    password: password 
  }, {
    token: token
  })

  if (error) {
    throw new Error(error.message);
  }

  return { message: 'Password updated successfully' };
}