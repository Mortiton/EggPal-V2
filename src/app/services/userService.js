"use server";
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
    .from("favourites")
    .select("pal_id")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  const palIds = data.map((fav) => fav.pal_id);
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
    .from("favourites")
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
    .from("favourites")
    .delete()
    .eq("user_id", userId)
    .eq("pal_id", palId);

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Fetches the saved breeding combinations for a user.
 *
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array>} - A promise that resolves to an array of saved breeding combinations.
 */
export async function getSavedBreedingCombos(userId) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("saved-breeding-combinations")
    .select("breeding_combo_id")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Adds a breeding combination to the user's saved combinations.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} breedingComboId - The ID of the breeding combination.
 * @returns {Promise<void>}
 */
export async function addSavedBreedingCombo(userId, breedingComboId) {
  const supabase = createClient();
  const { error } = await supabase
    .from("saved-breeding-combinations")
    .insert([{ user_id: userId, breeding_combo_id: breedingComboId }]);

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Removes a breeding combination from the user's saved combinations.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} comboId - The ID of the breeding combination.
 * @returns {Promise<void>}
 */
export async function removeSavedBreedingCombo(userId, comboId) {
  const supabase = createClient();
  const { error } = await supabase
    .from("saved-breeding-combinations")
    .delete()
    .eq("user_id", userId)
    .eq("breeding_combo_id", comboId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getSavedBreedingCombosWithDetails(userId) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    "get_saved_breeding_combos_with_details",
    {
      p_user_id: userId,
    }
  );

  if (error) {
    console.error("Error fetching saved breeding combinations:", error);
    throw error;
  }

  return data.map((item) => ({
    id: item.id,
    breedingComboId: item.breeding_combo_id,
    parent1: {
      id: item.parent1_id,
      name: item.parent1_name,
      image: item.parent1_image,
    },
    parent2: {
      id: item.parent2_id,
      name: item.parent2_name,
      image: item.parent2_image,
    },
    child: {
      id: item.child_id,
      name: item.child_name,
      image: item.child_image,
    },
  }));
}


