"use server";

import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Fetches the user's saved breeding combinations.
 *
 * @async
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Object[]>} A promise that resolves to an array of saved breeding combinations. Each combination is an object with properties: breeding_combo_id, parent1, parent2, child. If an error occurs, it logs the error and returns an empty array.
 * @throws Will throw an error if the request fails.
 */
export async function fetchSavedBreedingCombos(userId) {
  const supabase = createClient();
  try {
    let { data: savedCombos, error: savedCombosError } = await supabase
      .from("saved_breeding_combinations")
      .select("breeding_combo_id")
      .eq("user_id", userId);

    if (savedCombosError) throw savedCombosError;

    if (!savedCombos || !savedCombos.length) {
      return [];
    }

    const comboDetails = await Promise.all(
      savedCombos.map(async (savedCombo) => {
        let { data: combo, error: comboError } = await supabase
          .from("breedingCombos")
          .select("parent1, parent2, child")
          .eq("id", savedCombo.breeding_combo_id)
          .single();

        if (comboError) throw comboError;

        let { data: parent1Data, error: parent1Error } = await supabase
          .from("palInfo")
          .select("name, id")
          .eq("name", combo.parent1)
          .single();

        if (parent1Error) throw parent1Error;

        let { data: parent2Data, error: parent2Error } = await supabase
          .from("palInfo")
          .select("name, id")
          .eq("name", combo.parent2)
          .single();

        if (parent2Error) throw parent2Error;

        let { data: childData, error: childError } = await supabase
          .from("palInfo")
          .select("name, id")
          .eq("name", combo.child)
          .single();

        if (childError) throw childError;

        return {
          breeding_combo_id: savedCombo.breeding_combo_id,
          parent1: {
            name: parent1Data.name,
            image: `/images/pals/${parent1Data.id}.png`,
          },
          parent2: {
            name: parent2Data.name,
            image: `/images/pals/${parent2Data.id}.png`,
          },
          child: {
            name: childData.name,
            image: `/images/pals/${childData.id}.png`,
          },
        };
      })
    );

    return comboDetails.filter((detail) => detail != null);
  } catch (error) {
    console.error("Error fetching saved breeding combinations:", error.message);
    return [];
  }
}

/**
 * Adds a breeding combination to the user's saved combinations.
 *
 * @async
 * @param {string} userId - The ID of the user.
 * @param {string} breedingComboId - The ID of the breeding combination.
 * @returns {Promise<Object|null>} A promise that resolves to the saved combination data or null if an error occurs.
 * @throws Will throw an error if the request fails.
 */
export async function addSavedBreedingCombo(userId, breedingComboId) {
  const supabase = createClient();
  try {
    if (!breedingComboId) throw new Error("Invalid breeding combo ID");

    const { data, error } = await supabase
      .from("saved_breeding_combinations")
      .insert([{ user_id: userId, breeding_combo_id: breedingComboId }]);

    if (error) throw error;

    revalidatePath("/saved-combinations");

    return data;
  } catch (error) {
    console.error("Error adding saved breeding combination:", error.message);
    throw error;
  }
}

/**
 * Removes a breeding combination from the user's saved combinations.
 *
 * @async
 * @param {string} userId - The ID of the user.
 * @param {string} breedingComboId - The ID of the breeding combination.
 * @returns {Promise<Object|null>} A promise that resolves to the removed combination data or null if an error occurs.
 * @throws Will throw an error if the request fails.
 */
export async function removeSavedBreedingCombo(userId, breedingComboId) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("saved_breeding_combinations")
      .delete()
      .eq("user_id", userId)
      .eq("breeding_combo_id", breedingComboId);

    if (error) throw error;

    revalidatePath("/saved-combinations");

    return data;
  } catch (error) {
    console.error("Error removing saved breeding combination:", error.message);
    throw error;
  }
}
