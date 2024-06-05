"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/app/utils/supabase/server";

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
 * Sign up a new user.
 *
 * @param {FormData} formData - The form data containing the user's email and password.
 * @throws {Error} If an error occurs while signing up the user.
 */
export async function signup(formData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const userExists = await checkUserExists(data.email);

  if (userExists) {
    throw new Error("User already registered");
  }
  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  // Revalidate the cache for the root path
  revalidatePath("/", "layout");
}