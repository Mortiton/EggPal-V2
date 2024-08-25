/** @type {string} The Supabase URL */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

/** @type {string} The Supabase anonymous key */
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** @type {number} Cache duration for general data (30 days in seconds) */
const CACHE_DURATION = 30 * 24 * 60 * 60;

/** @type {number} Cache duration for all pals data (30 days in seconds) */
const ALL_PALS_CACHE_DURATION = 30 * 24 * 60 * 60;

/** @type {number} Cache duration for individual pal data (1 hour in seconds) */
const INDIVIDUAL_PAL_CACHE_DURATION = 60 * 60;

/** @type {Object} Headers for database requests */
const headers = {
  'apikey': supabaseAnonKey,
  'Authorization': `Bearer ${supabaseAnonKey}`,
  'Content-Type': 'application/json'
};


export async function getPals(ids = null) {
  const url = new URL(`${supabaseUrl}/rest/v1/rpc/get_pals`);
  if (ids !== null) {
    // Convert ids to a comma-separated string
    const idsString = Array.isArray(ids) ? ids.join(',') : ids;
    url.searchParams.append('ids', idsString);
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
      next: { 
        revalidate: ids && ids.length === 1 ? INDIVIDUAL_PAL_CACHE_DURATION : ALL_PALS_CACHE_DURATION 
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch pals: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (ids) {
      // Convert ids to an array if it's a string
      const idArray = Array.isArray(ids) ? ids : [ids];
      // Filter results if specific ids were requested
      return data.filter(pal => idArray.includes(pal.id.toString()));
    } else {
      // Return all pals if no ids were specified
      return data;
    }
  } catch (error) {
    console.error(`Error in getPals: ${error.message}`);
    throw error;
  }
}

/**
 * Fetches work types from the database
 * @returns {Promise<Array<Object>>} Array of work type objects
 * @throws {Error} If the database request fails
 */
export async function getWorkTypes() {
  // Fetch work types from the database
  const response = await fetch(`${supabaseUrl}/rest/v1/icons?select=icon_name,icon_url&category=eq.Work&order=work_order.asc`, {
    headers,
    next: { revalidate: 3600 }
  });

  // Check if the response is successful
  if (!response.ok) {
    throw new Error('Failed to fetch work types from the database');
  }

  return response.json();
}

/**
 * Fetches pal types from the database
 * @returns {Promise<Array<Object>>} Array of pal type objects
 * @throws {Error} If the database request fails
 */
export async function getTypes() {
  // Fetch pal types from the database
  const response = await fetch(`${supabaseUrl}/rest/v1/icons?select=icon_name,icon_url&category=eq.Type&order=type_order.asc`, {
    headers,
    next: { revalidate: 3600 }
  });

  // Check if the response is successful
  if (!response.ok) {
    throw new Error('Failed to fetch pal types from the database');
  }

  return response.json();
}

/**
 * Fetches all card data (pals, work types, and pal types) from the database
 * @returns {Promise<Object>} Object containing pals, work types, and pal types
 * @throws {Error} If any of the database requests fail
 */
export async function getCardData() {
  try {
    // Fetch all data concurrently from the database
    const [pals, workTypes, types] = await Promise.all([
      getPals(),
      getWorkTypes(),
      getTypes()
    ]);

    return { pals, workTypes, types };
  } catch (error) {
    console.error('Error fetching card data from the database:', error);
    throw error;
  }
}


export async function getBreedingCombinations(palName) {
  // Fetch breeding combinations from the database
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/get_breeding_combos`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ child_pal_name: palName }),
    next: { revalidate: CACHE_DURATION }
  });

  // Check if the response is successful
  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Error fetching breeding combinations: ${response.status} ${response.statusText} ${errorBody}`);
    return []; 
  }

  return response.json();
}
