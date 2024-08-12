"use server"
import { createClient } from "../utils/supabase/server";
import supabaseAdmin from '../utils/supabase/supabaseAdminClient';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getUser } from './authService';

export async function updateEmail(email) {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ email });

  if (error) {
    throw new Error(error.message);
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
  const user = await getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabaseAdmin.rpc('deleteUser');

  if (error) {
    throw new Error(error.message);
  }

  const supabase = createClient();
  await supabase.auth.signOut();

  revalidatePath("/");
  redirect("/");
}
