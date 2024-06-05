import { createClient } from '@/app/utils/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET function to handle GET requests.
 * It extracts the token_hash, type, and next parameters from the request URL.
 * If token_hash and type are present, it verifies the OTP.
 * If the OTP is verified successfully, it redirects to the next page.
 * If the OTP verification fails, it redirects to the error page.
 *
 * @param {Object} request - The request object.
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object.
 */
export async function GET(request) {
  // Extract search parameters from request URL
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');  
  const next = searchParams.get('next') || '/';

  // Prepare the redirect URL
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete('token_hash');
  redirectTo.searchParams.delete('type');

  // If token_hash and type are present, verify the OTP
  if (token_hash && type) {
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    // If OTP is verified successfully, redirect to the next page
    if (!error) {
      redirectTo.searchParams.delete('next');
      return NextResponse.redirect(redirectTo);
    }
  }

  // If OTP verification fails, redirect to the error page
  redirectTo.pathname = '/error';
  return NextResponse.redirect(redirectTo);
}