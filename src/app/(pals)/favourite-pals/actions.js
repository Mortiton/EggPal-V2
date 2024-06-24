"use server";

import { createClient } from '@/app/utils/supabase/server';

/**
 * Fetches the favourite pals of a given user from the database.
 *
 * @async
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Object[]>} A promise that resolves to an array of favourite pals. Each pal is an object with properties: id, name, type1, type2, kindling, watering, planting, generating_electricity, handiwork, gathering, lumbering, mining, medicine_production, cooling, transporting, farming. If an error occurs, it logs the error and returns an empty array.
 * @throws Will throw an error if the request fails.
 */
export async function getFavouritePals(userId) {
  const supabase = createClient();

  try {
    // Fetch favourite pal_ids for the given user
    let { data: favourites, error: favError } = await supabase
      .from('favourites')
      .select('pal_id')
      .eq('user_id', userId);

    if (favError) throw favError;

    if (!favourites || !favourites.length) {
      return [];
    }

    // Fetch details for each favourite pal
    const palIds = favourites.map(fav => fav.pal_id);
    let { data: pals, error: palError } = await supabase
      .from('palInfo')
      .select('id, name, type1, type2, kindling, watering, planting, generating_electricity, handiwork, gathering, lumbering, mining, medicine_production, cooling, transporting, farming')
      .in('id', palIds);

    if (palError) throw palError;

    return pals;
  } catch (error) {
    console.error('Error fetching favourite pals:', error.message);
    return [];
  }
}