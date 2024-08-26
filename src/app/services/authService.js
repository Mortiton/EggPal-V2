"use server";
import { createClient } from "../utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * Retrieves the currently authenticated user
 * @async
 * @function getUser
 * @returns {Promise<Object|null>} The user object if authenticated, or null if not
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
 * Retrieves the current session
 * @async
 * @function getSession
 * @returns {Promise<Object|null>} The session object if active, or null if not
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
 * Checks if a user with the given email exists
 * @async
 * @function checkUserExists
 * @param {string} email - The email to check
 * @returns {Promise<boolean>} True if the user exists, false otherwise
 * @throws {Error} If there's an error checking the user existence
 */
export async function checkUserExists(email) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("check_user_exists", { email });

  if (error) {
    throw new Error(error.message);
  }

  return data.length > 0;
}

/**
 * Signs up a new user
 * @async
 * @function signup
 * @param {FormData} formData - The form data containing email and password
 * @returns {Promise<Object>} An object indicating success or failure of the signup process
 */
export async function signup(formData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const userExists = await checkUserExists(data.email);

    if (userExists) {
      return { success: false, message: "User already registered" };
    }

    const { error } = await supabase.auth.signUp(data);

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "Please check your email to complete the signup process.",
    };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}

/**
 * Logs in a user
 * @async
 * @function login
 * @param {FormData} formData - The form data containing email and password
 * @returns {Promise<Object>} An object indicating success or failure of the login process
 */
export async function login(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message || "Invalid email or password" };
    }

    if (!data?.user) {
      return { error: "Login failed. Please try again." };
    }

    revalidatePath("/", "layout");

    return { success: true, user: data.user };
  } catch (err) {
    console.error("Unexpected error during login:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

/**
 * Initiates the password reset process for a user
 * @async
 * @function resetPassword
 * @param {string} email - The email of the user requesting password reset
 * @returns {Promise<Object>} An object indicating success or failure of the reset password process
 */
export async function resetPassword(email) {
  console.log("resetPassword called with email:", email);
  const supabase = createClient();
  const resetLinkRedirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/update-password`;

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetLinkRedirectUrl,
    });

    if (error) {
      console.error("Supabase returned an error:", error);
      return {
        success: false,
        message:
          error.message || "Failed to send reset email. Please try again.",
      };
    }

    console.log("Password reset email sent successfully");
    return {
      success: true,
      message:
        "If an account with this email exists, a password reset email has been sent.",
    };
  } catch (error) {
    console.error("Caught error in resetPassword:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Updates the user's password after reset
 * @async
 * @function updateUserPassword
 * @param {Object} params - The parameters for updating the password
 * @param {string} params.password - The new password
 * @param {string} params.token - The reset token
 * @returns {Promise<Object>} An object indicating success or failure of the password update process
 */
export async function updateUserPassword({ password, token }) {
  const supabase = createClient();

  try {
    const { data: verifyData, error: verifyError } =
      await supabase.auth.verifyOtp({
        token_hash: token,
        type: "recovery",
      });

    if (verifyError) {
      console.error("OTP verification error:", verifyError);
      return {
        success: false,
        message: verifyError.message || "Failed to verify the reset token.",
      };
    }

    if (!verifyData || !verifyData.session) {
      console.error("OTP verification failed or no session data returned.");
      return {
        success: false,
        message: "Failed to verify the reset token. Please try again.",
      };
    }

    const { access_token } = verifyData.session;

    const { error: updateError } = await supabase.auth.updateUser(
      { password },
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (updateError) {
      console.error("Password update error:", updateError);
      return {
        success: false,
        message:
          updateError.message ||
          "Failed to update the password. Please try again.",
      };
    }

    console.log("Password updated successfully");
    return {
      success: true,
      message: "Your password has been updated successfully.",
    };
  } catch (error) {
    console.error("Unexpected error during password update:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Verifies OTP and logs session data (for debugging purposes)
 * @async
 * @function verifyOtpAndLogSession
 * @param {Object} params - The parameters for OTP verification
 * @param {string} params.token - The OTP token
 * @returns {Promise<Object>} The verification data or an error object
 */
export async function verifyOtpAndLogSession({ token }) {
  const supabase = createClient();

  try {
    console.log(`Verifying OTP with token: ${token}...`);

    const { data: verifyData, error: verifyError } =
      await supabase.auth.verifyOtp({
        token_hash: token,
        type: "recovery",
      });

    if (verifyError) {
      console.error("OTP verification error:", verifyError);
      return { error: verifyError.message };
    }

    if (!verifyData) {
      console.error(
        "OTP verification returned null. Possibly an invalid or expired token."
      );
      return { error: "OTP verification failed, no user data returned." };
    }

    console.log("Session or user data after OTP verification:", verifyData);

    return verifyData;
  } catch (error) {
    console.error("Unexpected error during OTP verification:", error);
    return { error: error.message };
  }
}
