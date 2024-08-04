"use server";

import { createClient } from "../src/app/utils/supabase/server";
import { unstable_cache } from "next/cache";

const CACHE_DURATION = 30 * 24 * 60 * 60; // 30 days in seconds

/**
 * Creates a Supabase client.
 * @returns {import('@supabase/ssr').SupabaseClient} A Supabase client instance.
 */
const getSupabaseClient = () => createClient();

/**
 * Fetches pal data from the database with caching.
 * @param {number[]} ids - An array of pal IDs to fetch. If empty, fetches all pals.
 * @returns {Promise<Object[]>} A promise that resolves to an array of pal objects.
 */
const fetchPalsFromDB = async (supabase, ids = null) => {
  const { data, error } = await supabase.rpc('get_pals', { ids: ids });
  if (error) throw new Error(`Error fetching pals: ${error.message}`);
  
  if (ids && ids.length > 0) {
    // Filter results if specific ids were requested
    return data.filter(pal => ids.includes(pal.id));
  } else {
    // Return all pals if no ids were specified
    return data;
  }
};

const getCachedPals = unstable_cache(
  fetchPalsFromDB,
  ['pals'],
  { revalidate: CACHE_DURATION }
);

export async function getPals(ids = []) {
  const supabase = createClient();
  
  if (ids.length > 0) {
    // For specific pals (e.g., favorites), don't use cache
    return fetchPalsFromDB(supabase, ids);
  } else {
    // For all pals (e.g., homepage), use cache
    return getCachedPals(supabase, null);
  }
}
/**
 * Fetches work types from the database with caching.
 * @returns {Promise<Object[]>} A promise that resolves to an array of work type objects.
 */
export async function getWorkTypes() {
  const supabase = getSupabaseClient();
  const fetchWorkTypes = unstable_cache(
    async (supabase) => {
      const { data, error } = await supabase
        .from("icons")
        .select("icon_name, icon_url")
        .in("category", ["Work"])
        .order("work_order", { ascending: true });

      if (error) throw new Error(`Error fetching work types: ${error.message}`);
      return data;
    },
    ["work_types"],
    { revalidate: CACHE_DURATION }
  );
  return fetchWorkTypes(supabase);
}

/**
 * Fetches pal types from the database with caching.
 * @returns {Promise<Object[]>} A promise that resolves to an array of pal type objects.
 */
export async function getTypes() {
  const supabase = getSupabaseClient();
  const fetchTypes = unstable_cache(
    async (supabase) => {
      const { data, error } = await supabase
        .from("icons")
        .select("icon_name, icon_url")
        .in("category", ["Type"])
        .order("type_order", { ascending: true });

      if (error) throw new Error(`Error fetching pal types: ${error.message}`);
      return data;
    },
    ["pal_types"],
    { revalidate: CACHE_DURATION }
  );
  return fetchTypes(supabase);
}

/**
 * Fetches breeding combinations from the database with caching.
 * @param {string} palName - The name of the pal to fetch breeding combinations for.
 * @returns {Promise<Object[]>} A promise that resolves to an array of breeding combination objects.
 */
export async function getBreedingCombinations(palName) {
  const supabase = getSupabaseClient();
  const fetchBreedingCombinations = unstable_cache(
    async (supabase, palName) => {
      const { data, error } = await supabase.rpc("get_breeding_combos", {
        child_pal_name: palName,
      });
      if (error)
        throw new Error(
          `Error fetching breeding combinations: ${error.message}`
        );
      return data;
    },
    ["breeding_combinations"],
    { revalidate: CACHE_DURATION }
  );
  return fetchBreedingCombinations(supabase, palName);
}
