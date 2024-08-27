import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a Supabase client for server-side use with custom cookie handling
 * @function createClient
 * @returns {Object} A Supabase client instance configured for server-side use
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      /**
       * Custom cookie handling options
       * @type {Object}
       */
      cookies: {
        /**
         * Gets the value of a cookie
         * @param {string} name - The name of the cookie
         * @returns {string|undefined} The value of the cookie, or undefined if not found
         */
        get(name) {
          return cookieStore.get(name)?.value;
        },
        /**
         * Sets a cookie
         * @param {string} name - The name of the cookie
         * @param {string} value - The value to set
         * @param {Object} options - Cookie options
         */
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {}
        },
        /**
         * Removes a cookie
         * @param {string} name - The name of the cookie to remove
         * @param {Object} options - Cookie options
         */
        remove(name, options) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {}
        },
      },
    }
  );
}
