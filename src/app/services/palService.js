import { createClient } from '../utils/supabase/server';

/**
 * Fetches pal information using the RPC call.
 * 
 * @param {Array<string>} ids - The list of pal IDs to fetch. Defaults to an empty array to fetch all pals.
 * @returns {Promise<Array<Object>>} The fetched pal information.
 */
export async function getPals(ids = []) {
  const supabase = createClient();

  // Make the RPC call to get the pal information
  const { data, error } = await supabase.rpc('get_pals', {  });

  if (error) {
    throw new Error(`Failed to fetch pals: ${error.message}`);
  }

  return data;
}