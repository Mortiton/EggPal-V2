import { createClient } from "./server";

/**
 * Supabase admin client with elevated privileges for server-side operations
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default supabaseAdmin;
