"use server";
import { createClient } from "../utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

/**
 * Fetches the user data from Supabase.
 *
 * @returns {Promise<Object|null>} The user data or null if no user is authenticated.
 */
export async function getUser() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Failed to fetch user:", error.message);
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
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Failed to fetch session:", error.message);
    return null;
  }

  return session;
}

/**
 * Check if a user exists in the database.
 *
 * @param {string} email - The email of the user to check.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the user exists.
 * @throws {Error} If an error occurs while checking if the user exists.
 */
export async function checkUserExists(email) {
  const supabase = createClient();

  // Call the custom function to check if the user exists
  const { data, error } = await supabase
    .rpc('check_user_exists', { email });

  if (error) {
    throw new Error(error.message);
  }

  // If data is returned, the user exists
  return data.length > 0;
}

/**
 * Logs in the user with the provided email and password.
 *
 * @param {Object} formData - The login form data.
 * @returns {Promise<Object>} The login result.
 */
export async function login(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Invalid email or password" };
  }

  revalidatePath('/', 'layout')

  return { success: true, user: data.user };
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

  return { message: "Password reset email sent successfully" };
}

export async function updateUserPassword({ password, token }) {
  const supabase = createClient();

  const { data, error: verifyError } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: "recovery",
  });

  if (verifyError) {
    throw new Error(verifyError.message);
  }

  const { error: updateError } = await supabase.auth.updateUser({ password });

  if (updateError) {
    throw new Error(updateError.message);
  }

  return { message: "Password updated successfully" };
}
