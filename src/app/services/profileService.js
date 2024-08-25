"use server"
import { createClient } from "../utils/supabase/server";
import supabaseAdmin from '../utils/supabase/supabaseAdminClient';
import { revalidatePath } from "next/cache";
import { cookies } from 'next/headers';
import { getUser } from './authService';

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

export async function deleteUser() {
  const supabase = createClient();
  const user = await getUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  try {
    // Delete the user
    const { error } = await supabaseAdmin.rpc('deleteUser');

    if (error) {
      return { error: error.message };
    }

    // Clear the user session
    await supabase.auth.signOut({ scope: 'global' });

    // Clear any user-related cookies
    const cookieStore = cookies();
    cookieStore.delete('supabase-auth-token');
    cookieStore.delete('x-user-id');
    cookieStore.delete('x-user-email');


    // Return success
    return { success: true, message: "Your account has been successfully deleted." };
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return { error: error.message || "An unexpected error occurred while deleting the user." };
  }
}