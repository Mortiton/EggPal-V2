"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for browser-side use
 * @function createClient
 * @returns {import('@supabase/supabase-js').SupabaseClient} A Supabase client instance
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
