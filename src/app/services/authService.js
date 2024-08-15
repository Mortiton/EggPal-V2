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

/**
 * Logs in the user with the provided email and password.
 *
 * @param {FormData} formData - The login form data.
 * @returns {Promise<Object>} The login result, either a success or error message.
 */
export async function login(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Handle Supabase error
      return { error: error.message || "Invalid email or password" };
    }

    if (!data?.user) {
      // Handle unexpected case where user data is not returned
      return { error: "Login failed. Please try again." };
    }

    // Trigger a revalidation to ensure the session is updated
    revalidatePath('/', 'layout');

    return { success: true, user: data.user };

  } catch (err) {
    // Handle unexpected errors (network issues, etc.)
    console.error("Unexpected error during login:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function resetPassword(email) {
  const supabase = createClient();
  const resetLinkRedirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/update-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: resetLinkRedirectUrl,
  });

  if (error) {
    // Ensure the function handles and returns the error properly
    throw new Error(error.message);
  }

  // Always return success regardless of whether an email was sent
  return { message: "If an account with this email exists, a password reset email has been sent." };
}


export async function updateUserPassword({ password, token }) {
  console.log("updateUserPassword called with token:", token);
  const supabase = createClient();

  try {
    console.log("Verifying OTP...");
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'recovery'
    });

    if (verifyError) {
      console.error("OTP verification error:", verifyError);
      return { error: verifyError.message };
    }

    console.log("OTP verified successfully:", verifyData);

    console.log("Updating user password...");
    const { data: updateData, error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      console.error("Password update error:", updateError);
      return { error: updateError.message };
    }

    console.log("Password updated successfully:", updateData);

    revalidatePath('/');
    
    return { success: true };

  } catch (error) {
    console.error("Unexpected error in updateUserPassword:", error);
    return { error: error.message };
  }
}