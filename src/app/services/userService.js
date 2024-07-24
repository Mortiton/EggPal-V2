"use server"
import { createClient } from "../utils/supabase/server";
import { getPals } from "./palService";




/**
 * Fetches the favorite pals of the authenticated user.
 * 
 * @param {string} userId - The ID of the authenticated user.
 * @returns {Promise<Object[]>} The favorite pals of the user.
 * @throws Will throw an error if the favorite pals cannot be fetched.
 */
export async function getFavouritePals(userId) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('favourites')
      .select('pal_id')
      .eq('user_id', userId);
  
    if (error) {
      throw new Error(error.message);
    }
  
    const palIds = data.map(fav => fav.pal_id);
    const pals = await getPals(palIds);
  
    return pals;
  }

  /**
 * Adds a pal to the user's favourites.
 * 
 * @param {string} userId - The ID of the authenticated user.
 * @param {string} palId - The ID of the pal to add to favourites.
 * @returns {Promise<void>}
 * @throws Will throw an error if the pal cannot be added to favourites.
 */
export async function addFavouritePal(userId, palId) {
    const supabase = createClient();
    const { error } = await supabase
      .from('favourites')
      .insert([{ user_id: userId, pal_id: palId }]);
  
    if (error) {
      throw new Error(error.message);
    }
  }
  
  /**
   * Removes a pal from the user's favourites.
   * 
   * @param {string} userId - The ID of the authenticated user.
   * @param {string} palId - The ID of the pal to remove from favourites.
   * @returns {Promise<void>}
   * @throws Will throw an error if the pal cannot be removed from favourites.
   */
  export async function removeFavouritePal(userId, palId) {
    const supabase = createClient();
    const { error } = await supabase
      .from('favourites')
      .delete()
      .eq('user_id', userId)
      .eq('pal_id', palId);
  
    if (error) {
      throw new Error(error.message);
    }
  }