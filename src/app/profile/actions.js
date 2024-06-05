"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/app/utils/supabase/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function updateEmail(email) {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ email });

  if (error) {
    throw new Error(error.message);
  }
}

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