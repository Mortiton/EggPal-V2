import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/**
 * Updates the user session and manages authentication state
 * @async
 * @function updateSession
 * @param {Object} request - The incoming request object
 * @returns {Promise<Object>} The response object with updated headers and cookies
 */
export async function updateSession(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  /**
   * Supabase client instance for server-side operations
   * @type {Object}
   */
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        /**
         * Gets the value of a cookie from the request
         * @param {string} name - The name of the cookie
         * @returns {string|undefined} The value of the cookie, or undefined if not found
         */
        get(name) {
          return request.cookies.get(name)?.value;
        },
        /**
         * Sets a cookie in both the request and response
         * @param {string} name - The name of the cookie
         * @param {string} value - The value to set
         * @param {Object} options - Cookie options (CookieSerializeOptions from next/server)
         */
        set(name, value, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        /**
         * Removes a cookie from both the request and response
         * @param {string} name - The name of the cookie to remove
         * @param {Object} options - Cookie options (CookieSerializeOptions from next/server)
         */
        remove(name, options) {
          request.cookies.delete({
            name,
            ...options,
          });
          response.cookies.delete({
            name,
            ...options,
          });
        },
      },
    }
  );

  // Refreshing the auth token and getting user data
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Set user information in headers
    response.headers.set("x-user-id", user.id);
    response.headers.set("x-user-email", user.email);
  }

  return response;
}
