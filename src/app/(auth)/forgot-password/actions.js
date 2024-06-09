"use server";

import { createClient } from "@/app/utils/supabase/server";

/**
 * Calls the backend to initiate a password reset email.
 *
 * @param {string} email - The email address to send the reset link to.
 * @throws {Error} - Throws an error if the reset email cannot be sent.
 */
export async function resetPassword(email) {
  const supabase = createClient();
  // Ensure that the URL is absolute and includes the full domain
  const resetLinkRedirectUrl = `http://localhost:3000/update-password`;  // Change this to your production domain when deploying

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: resetLinkRedirectUrl,
  });

  if (error) {
    throw new Error(error.message);
  }
}