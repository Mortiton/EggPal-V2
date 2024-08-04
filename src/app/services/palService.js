"use server";

import { createClient } from "../utils/supabase/server";
import { unstable_cache } from "next/cache";

const CACHE_DURATION = 30 * 24 * 60 * 60; // 30 days in seconds

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getPals(ids) {
  const url = `${supabaseUrl}/rest/v1/rpc/get_pals`;
  try {
    let idsArray;
    if (Array.isArray(ids)) {
      idsArray = ids;
    } else if (ids && typeof ids === 'string') {
      idsArray = [ids];
    } else {
      idsArray = [];
    }

    console.log(`Fetching pals with ids: ${idsArray.length > 0 ? idsArray.join(', ') : 'all'}`);
    console.log('Fetch URL:', url);

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL or Key is missing');
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ ids: idsArray.length > 0 ? idsArray : null }),
      cache: 'no-store' // Temporarily disable caching for debugging
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const pals = await response.json();
    console.log(`Fetched ${pals.length} pals:`, pals);

    return pals;
  } catch (error) {
    console.error('Error in getPals:', error);
    throw error;
  }
}

export async function getPalById(palId) {
  console.log(`Getting pal by id: ${palId}`);
  if (!palId || typeof palId !== 'string') {
    throw new Error(`Invalid pal ID provided: ${palId}`);
  }
  const pals = await getPals([palId]);
  console.log(`Pals returned for id ${palId}:`, pals);
  return pals[0] || null;
}
/**
 * Fetches work types from the database with caching.
 * @param {import('@supabase/ssr').SupabaseClient} supabase - The Supabase client instance.
 * @returns {Promise<Object[]>} A promise that resolves to an array of work type objects.
 */
const fetchWorkTypes = unstable_cache(
  async (supabase) => {
    const { data, error } = await supabase
      .from("icons")
      .select("icon_name, icon_url")
      .in("Category", ["Work"])
      .order("work_order", { ascending: true });

    if (error) throw new Error(`Error fetching work types: ${error.message}`);
    return data;
  },
  ["work_types"],
  { revalidate: CACHE_DURATION }
);

export async function getWorkTypes() {
  const supabase = createClient();
  return fetchWorkTypes(supabase);
}

/**
 * Fetches pal types from the database with caching.
 * @param {import('@supabase/ssr').SupabaseClient} supabase - The Supabase client instance.
 * @returns {Promise<Object[]>} A promise that resolves to an array of pal type objects.
 */
const fetchTypes = unstable_cache(
  async (supabase) => {
    const { data, error } = await supabase
      .from("icons")
      .select("icon_name, icon_url")
      .in("Category", ["Type"])
      .order("type_order", { ascending: true });

    if (error) throw new Error(`Error fetching pal types: ${error.message}`);
    return data;
  },
  ["pal_types"],
  { revalidate: CACHE_DURATION }
);

export async function getTypes() {
  const supabase = createClient();
  return fetchTypes(supabase);
}

/**
 * Fetches breeding combinations from the database with caching.
 * @param {import('@supabase/ssr').SupabaseClient} supabase - The Supabase client instance.
 * @param {string} palName - The name of the pal to fetch breeding combinations for.
 * @returns {Promise<Object[]>} A promise that resolves to an array of breeding combination objects.
 */
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

export async function getBreedingCombinations(palName) {
  const supabase = createClient();
  return fetchBreedingCombinations(supabase, palName);
}