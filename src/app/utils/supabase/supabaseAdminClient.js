import { createClient } from "./server";

/**
 * Supabase admin client with elevated privileges for server-side operations
 * @type {Object} Represents a SupabaseClient instance from @supabase/ssr
 */
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default supabaseAdmin;
