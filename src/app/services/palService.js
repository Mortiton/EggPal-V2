import { createClient } from '../utils/supabase/server';

/**
 * Fetches and combines pal information, icon URLs, and skills data.
 *
 * @param {string[]} [ids=[]] - Array of pal IDs to fetch.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of combined pal data objects.
 * @throws Will throw an error if the request fails.
 */
export async function getPals(ids = []) {
    const supabase = createClient();
    console.log('Fetching pals data with IDs:', ids);
  
    try {
      const { data, error } = await supabase.rpc('get_pals', { ids: ids.length ? ids : null });
  
      if (error) {
        console.error('Supabase RPC Error:', error);
        throw new Error(`Error fetching pals: ${error.message}`);
      }
  
      console.log('Number of pals fetched:', data.length);
      return data;
    } catch (error) {
      console.error('Error fetching pals:', error.message);
      return null;
    }
  }