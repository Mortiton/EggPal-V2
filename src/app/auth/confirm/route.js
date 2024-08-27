import { createClient } from "@/app/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * Handles GET requests for One-Time Password (OTP) verification
 * @async
 * @function
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse>} A redirect response based on the OTP verification result
 */
export async function GET(request) {
  // Extract search parameters from request URL
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") || "/";

  // Prepare the redirect URL
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");

  // If token_hash and type are present, verify the OTP
  if (token_hash && type) {
    /**
     * Creates a Supabase client for authentication
     * @type {Object}
     */
    const supabase = createClient();

    /**
     * Verifies the OTP using Supabase authentication
     * @type {Object}
     */
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    // If OTP is verified successfully, redirect to the next page
    if (!error) {
      redirectTo.searchParams.delete("next");
      return NextResponse.redirect(redirectTo);
    }
  }

  // If OTP verification fails, redirect to the error page
  redirectTo.pathname = "/error";
  return NextResponse.redirect(redirectTo);
}
