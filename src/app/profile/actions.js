"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/app/utils/supabase/server";

// Create a Supabase client with admin privileges
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Update the email of the authenticated user.
 *
 * @param {string} email - The new email.
 * @throws Will throw an error if the email update fails.
 */
export async function updateEmail(email) {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ email });

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Update the password of the authenticated user.
 *
 * @param {string} currentPassword - The current password.
 * @param {string} newPassword - The new password.
 * @throws Will throw an error if the password update fails.
 */
export async function updatePassword(currentPassword, newPassword) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

/**
 * Delete the authenticated user.
 *
 * @throws Will throw an error if the user deletion fails.
 */
export async function deleteUser() {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabaseAdmin.rpc('delete_user');

  if (error) {
    throw new Error(error.message);
  }

  // Sign out the user after deletion using the standard client
  await supabase.auth.signOut();

  // Revalidate path and redirect to homepage
  revalidatePath("/");
  redirect("/");
}