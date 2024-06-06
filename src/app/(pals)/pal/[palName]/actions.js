"use server"

import { createClient } from '@/app/utils/supabase/server';
import { revalidatePath } from "next/cache";

export async function addFavoritePal(userId, palId) {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('favourites')
        .insert([{ user_id: userId, pal_id: palId }]);
  
      if (error) throw error;

      revalidatePath("/favourite-pals");
  
      return data;
    } catch (error) {
      console.error('Error adding favorite pal:', error.message);
      throw error;
    }
  }
  
  export async function removeFavoritePal(userId, palId) {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('favourites')
        .delete()
        .eq('user_id', userId)
        .eq('pal_id', palId);
  
      if (error) throw error;

      revalidatePath("/favourite-pals");
  
      return data;
    } catch (error) {
      console.error('Error removing favorite pal:', error.message);
      throw error;
    }
  }

  export async function getUserFavorites(userId) {
    const supabase = createClient();
    try {
      let { data: favorites, error } = await supabase
        .from('favourites')
        .select('pal_id')
        .eq('user_id', userId);
  
      if (error) throw error;
  
      return favorites.map(favorite => favorite.pal_id);
    } catch (error) {
      console.error('Error fetching user favorites:', error.message);
      return [];
    }
  }

export async function fetchSavedBreedingCombos(userId) {
    const supabase = createClient();
    try {
      let { data: savedCombos, error: savedCombosError } = await supabase
        .from('saved_breeding_combinations')
        .select('breeding_combo_id')
        .eq('user_id', userId);
  
      if (savedCombosError) throw savedCombosError;
  
      if (!savedCombos || !savedCombos.length) {
        return [];
      }
  
      const comboDetails = await Promise.all(savedCombos.map(async (savedCombo) => {
        let { data: combo, error: comboError } = await supabase
          .from('breedingCombos')
          .select('parent1, parent2')
          .eq('id', savedCombo.breeding_combo_id)
          .single();
  
        if (comboError) throw comboError;
  
        let { data: parent1Data, error: parent1Error } = await supabase
          .from('palInfo')
          .select('name, id')
          .eq('name', combo.parent1)
          .single();
  
        if (parent1Error) throw parent1Error;
  
        let { data: parent2Data, error: parent2Error } = await supabase
          .from('palInfo')
          .select('name, id')
          .eq('name', combo.parent2)
          .single();
  
        if (parent2Error) throw parent2Error;
  
        return {
          breeding_combo_id: savedCombo.breeding_combo_id,
          parent1: {
            name: parent1Data.name,
            image: `/images/pals/${parent1Data.id}.png`
          },
          parent2: {
            name: parent2Data.name,
            image: `/images/pals/${parent2Data.id}.png`
          }
        };
      }));
  
      return comboDetails.filter(detail => detail != null);
  
    } catch (error) {
      console.error('Error fetching saved breeding combinations:', error.message);
      return [];
    }
  }
  
  /**
   * Adds a breeding combination to the user's saved combinations.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} breedingComboId - The ID of the breeding combination.
   * @returns {Promise<Object|null>} A promise that resolves to the saved combination data or null if an error occurs.
   */
  export async function addSavedBreedingCombo(userId, breedingComboId) {
    const supabase = createClient();
    try {
      if (!breedingComboId) throw new Error('Invalid breeding combo ID');

      const { data, error } = await supabase
        .from('saved_breeding_combinations')
        .insert([{ user_id: userId, breeding_combo_id: breedingComboId }]);
  
      if (error) throw error;
  
      revalidatePath("/saved-combinations");
  
      return data;
    } catch (error) {
      console.error('Error adding saved breeding combination:', error.message);
      throw error;
    }
  }
  
  /**
   * Removes a breeding combination from the user's saved combinations.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} breedingComboId - The ID of the breeding combination.
   * @returns {Promise<Object|null>} A promise that resolves to the removed combination data or null if an error occurs.
   */
  export async function removeSavedBreedingCombo(userId, breedingComboId) {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('saved_breeding_combinations')
        .delete()
        .eq('user_id', userId)
        .eq('breeding_combo_id', breedingComboId);
  
      if (error) throw error;
  
      revalidatePath("/saved-combinations");
  
      return data;
    } catch (error) {
      console.error('Error removing saved breeding combination:', error.message);
      throw error;
    }
  }

  export async function getPalDetailsAndFavorites(userId, palName) {
    const supabase = createClient();
    try {
        console.log("Fetching pal details and favorites for user:", userId, "and pal:", palName);
        let { data, error } = await supabase
            .rpc('get_pal_details_and_favorites', { user_id: userId, pal_name: palName });

        if (error) {
            console.error('Error from RPC:', error.message);
            throw error;
        }
        
        console.log('Data fetched from RPC:', data);
        
        if (!data || !data.length) {
            console.log("Pal not found or data is null:", data);
            return null;
        }

        return data[0];
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return null;
    }
}