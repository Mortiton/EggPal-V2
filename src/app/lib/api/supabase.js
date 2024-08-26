const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** @constant {number} CACHE_DURATION - General cache duration in seconds (30 days) */
const CACHE_DURATION = 30 * 24 * 60 * 60;

/** @constant {number} ALL_PALS_CACHE_DURATION - Cache duration for all pals in seconds (30 days) */
const ALL_PALS_CACHE_DURATION = 30 * 24 * 60 * 60;

/** @constant {number} INDIVIDUAL_PAL_CACHE_DURATION - Cache duration for individual pals in seconds (1 hour) */
const INDIVIDUAL_PAL_CACHE_DURATION = 60 * 60;

/** @constant {Object} headers - HTTP headers for Supabase API requests */
const headers = {
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${supabaseAnonKey}`,
  "Content-Type": "application/json",
};

/**
 * Fetches pal data from Supabase
 * @async
 * @function getPals
 * @param {(string|string[]|null)} [ids=null] - The ID(s) of the pal(s) to fetch. If null, fetches all pals.
 * @returns {Promise<Array<Object>>} An array of pal objects
 * @throws {Error} If the fetch operation fails
 */
export async function getPals(ids = null) {
  const url = new URL(`${supabaseUrl}/rest/v1/rpc/get_pals`);
  if (ids !== null) {
    const idsString = Array.isArray(ids) ? ids.join(",") : ids;
    url.searchParams.append("ids", idsString);
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      next: {
        revalidate:
          ids && ids.length === 1
            ? INDIVIDUAL_PAL_CACHE_DURATION
            : ALL_PALS_CACHE_DURATION,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch pals: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (ids) {
      const idArray = Array.isArray(ids) ? ids : [ids];
      return data.filter((pal) => idArray.includes(pal.id.toString()));
    } else {
      return data;
    }
  } catch (error) {
    console.error(`Error in getPals: ${error.message}`);
    throw error;
  }
}

/**
 * Fetches work types from Supabase
 * @async
 * @function getWorkTypes
 * @returns {Promise<Array<Object>>} An array of work type objects
 * @throws {Error} If the fetch operation fails
 */
export async function getWorkTypes() {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/icons?select=icon_name,icon_url&category=eq.Work&order=work_order.asc`,
    {
      headers,
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch work types from the database");
  }

  return response.json();
}

/**
 * Fetches pal types from Supabase
 * @async
 * @function getTypes
 * @returns {Promise<Array<Object>>} An array of pal type objects
 * @throws {Error} If the fetch operation fails
 */
export async function getTypes() {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/icons?select=icon_name,icon_url&category=eq.Type&order=type_order.asc`,
    {
      headers,
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch pal types from the database");
  }

  return response.json();
}

/**
 * Fetches all necessary data for the PalCard component
 * @async
 * @function getCardData
 * @returns {Promise<Object>} An object containing pals, work types, and pal types
 * @throws {Error} If any of the fetch operations fail
 */
export async function getCardData() {
  try {
    const [pals, workTypes, types] = await Promise.all([
      getPals(),
      getWorkTypes(),
      getTypes(),
    ]);

    return { pals, workTypes, types };
  } catch (error) {
    console.error("Error fetching card data from the database:", error);
    throw error;
  }
}

/**
 * Fetches breeding combinations for a specific pal
 * @async
 * @function getBreedingCombinations
 * @param {string} palName - The name of the pal to fetch breeding combinations for
 * @returns {Promise<Array<Object>>} An array of breeding combination objects
 * @throws {Error} If the fetch operation fails
 */
export async function getBreedingCombinations(palName) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/rpc/get_breeding_combos`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ child_pal_name: palName }),
      next: { revalidate: CACHE_DURATION },
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      `Error fetching breeding combinations: ${response.status} ${response.statusText} ${errorBody}`
    );
    return [];
  }

  return response.json();
}
