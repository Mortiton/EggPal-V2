"use server";
import { createClient } from "../utils/supabase/server";
import supabaseAdmin from "../utils/supabase/supabaseAdminClient";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getUser } from "./authService";

/**
 * Updates the email address for the authenticated user
 * @async
 * @function updateEmail
 * @param {string} email - The new email address
 * @returns {Promise<Object>} An object indicating success or containing an error message
 * @property {boolean} [success] - Indicates if the email update was successful
 * @property {string} [error] - Error message if the update failed
 */
export async function updateEmail(email) {
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.updateUser({ email });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Updates the password for the authenticated user
 * @async
 * @function updatePassword
 * @param {string} currentPassword - The user's current password
 * @param {string} newPassword - The new password to set
 * @throws {Error} If the user is not authenticated, the current password is incorrect, or the update fails
 */
export async function updatePassword(currentPassword, newPassword) {
  const user = await getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const supabase = createClient();

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
 * Deletes the authenticated user's account
 * @async
 * @function deleteUser
 * @returns {Promise<Object>} An object indicating success or containing an error message
 * @property {boolean} [success] - Indicates if the account deletion was successful
 * @property {string} [message] - Success message if the deletion was successful
 * @property {string} [error] - Error message if the deletion failed
 */
export async function deleteUser() {
  const supabase = createClient();
  const user = await getUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  try {
    // Delete the user
    const { error } = await supabaseAdmin.rpc("deleteUser");

    if (error) {
      return { error: error.message };
    }

    // Clear the user session
    await supabase.auth.signOut({ scope: "global" });

    // Clear any user-related cookies
    const cookieStore = cookies();
    cookieStore.delete("supabase-auth-token");
    cookieStore.delete("x-user-id");
    cookieStore.delete("x-user-email");

    // Return success
    return {
      success: true,
      message: "Your account has been successfully deleted.",
    };
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return {
      error:
        error.message ||
        "An unexpected error occurred while deleting the user.",
    };
  }
}
