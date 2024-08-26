"use server";

import { createClient } from "../utils/supabase/server";
import { getPals } from "../../../archived-files/palService";

/**
 * @typedef {Object} Pal
 * @property {string} id - The unique identifier of the pal
 * @property {string} name - The name of the pal
 * @property {string} type1 - The primary type of the pal
 * @property {string|null} type2 - The secondary type of the pal, if any
 * @property {string} description - A description of the pal
 * @property {string} image_url - The URL of the pal's image
 * @property {string} type1_icon_url - The URL of the icon for the pal's primary type
 * @property {string|null} type2_icon_url - The URL of the icon for the pal's secondary type, if any
 * @property {Object[]} skills - An array of skills the pal possesses
 */

/**
 * @typedef {Object} BreedingCombo
 * @property {string} id - The unique identifier of the saved breeding combination
 * @property {string} breeding_combo_id - The identifier of the breeding combination
 * @property {Object} parent1 - The first parent in the breeding combination
 * @property {string} parent1.id - The ID of the first parent pal
 * @property {string} parent1.name - The name of the first parent pal
 * @property {string} parent1.image - The image URL of the first parent pal
 * @property {Object} parent2 - The second parent in the breeding combination
 * @property {string} parent2.id - The ID of the second parent pal
 * @property {string} parent2.name - The name of the second parent pal
 * @property {string} parent2.image - The image URL of the second parent pal
 * @property {Object} child - The child resulting from the breeding combination
 * @property {string} child.id - The ID of the child pal
 * @property {string} child.name - The name of the child pal
 * @property {string} child.image - The image URL of the child pal
 */

/**
 * Fetches favourite pals for a given user
 * @async
 * @function getFavouritePals
 * @param {string} userId - The ID of the user
 * @returns {Promise<Pal[]>} An array of favourite Pal objects
 * @throws {Error} If there's an error fetching the favourite pals
 */
export async function getFavouritePals(userId) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("favourites")
      .select("pal_id")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching favourite pal IDs:", error);
      throw new Error(error.message);
    }

    const palIds = data.map((fav) => fav.pal_id);

    if (palIds.length === 0) {
      return [];
    }

    const palIdsString = palIds.join(",");
    const pals = await getPals(palIdsString);
    return pals;
  } catch (error) {
    console.error("Error in getFavouritePals:", error);
    throw error;
  }
}

/**
 * Adds a pal to a user's favourites
 * @async
 * @function addFavouritePal
 * @param {string} userId - The ID of the user
 * @param {string} palId - The ID of the pal to add to favourites
 * @throws {Error} If there's an error adding the favourite pal
 */
export async function addFavouritePal(userId, palId) {
  const supabase = createClient();
  const { error } = await supabase
    .from("favourites")
    .insert({ user_id: userId, pal_id: palId });

  if (error) {
    console.error("Error adding favourite pal:", error);
    throw new Error(error.message);
  }
}

/**
 * Removes a pal from a user's favourites
 * @async
 * @function removeFavouritePal
 * @param {string} userId - The ID of the user
 * @param {string} palId - The ID of the pal to remove from favourites
 * @throws {Error} If there's an error removing the favourite pal
 */
export async function removeFavouritePal(userId, palId) {
  const supabase = createClient();
  const { error } = await supabase
    .from("favourites")
    .delete()
    .match({ user_id: userId, pal_id: palId });

  if (error) {
    console.error("Error removing favourite pal:", error);
    throw new Error(error.message);
  }
}

/**
 * Fetches saved breeding combination IDs for a given user
 * @async
 * @function getSavedBreedingCombos
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array<{breeding_combo_id: string}>>} An array of objects containing breeding combination IDs
 * @throws {Error} If there's an error fetching the saved breeding combinations
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
 * Adds a breeding combination to a user's saved list
 * @async
 * @function addSavedBreedingCombo
 * @param {string} userId - The ID of the user
 * @param {string} breedingComboId - The ID of the breeding combination to save
 * @throws {Error} If there's an error adding the saved breeding combination
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
 * Removes a breeding combination from a user's saved list
 * @async
 * @function removeSavedBreedingCombo
 * @param {string} userId - The ID of the user
 * @param {string} comboId - The ID of the breeding combination to remove
 * @throws {Error} If there's an error removing the saved breeding combination
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

/**
 * Fetches saved breeding combinations with full details for a given user
 * @async
 * @function getSavedBreedingCombosWithDetails
 * @param {string} userId - The ID of the user
 * @returns {Promise<BreedingCombo[]>} An array of BreedingCombo objects with full details
 * @throws {Error} If there's an error fetching the saved breeding combinations
 */
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
