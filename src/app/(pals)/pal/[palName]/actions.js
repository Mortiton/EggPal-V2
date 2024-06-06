"use server"

import { createClient } from '@/app/utils/supabase/server';

/**
 * Fetches all information about a specific pal from the 'palInfo' table.
 *
 * @param {string} palName - The name of the pal to fetch information for.
 * @returns {Promise<Object|null>} A promise that resolves to the pal information or null if an error occurs.
 */
export async function getAllPalInfo(palName) {
    const supabase = createClient();
    try {
        let { data: pals, error } = await supabase
            .from('palInfo')
            .select('*')
            .eq('name', palName)
            .single();

        if (error) throw error;

        return pals;
    } catch (error) {
        console.error('Error fetching pals:', error.message);
        return null;
    }
}

/**
 * Fetches breeding combinations for a specific pal and includes details of the parent pals.
 *
 * @param {string} palName - The name of the pal to fetch breeding combinations for.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of breeding combinations with parent details.
 */
export async function fetchBreedingCombos(palName) {
    const supabase = createClient();
    try {
        let { data: combos, error: comboError } = await supabase
            .from('breedingCombos')
            .select('parent1, parent2')
            .eq('child', palName);

        if (comboError) throw comboError;

        if (!combos || !combos.length) {
            return [];
        }

        const comboDetails = await Promise.all(combos.map(async (combo) => {
            try {
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
                    parent1: {
                        name: parent1Data.name,
                        image: `/images/pals/${parent1Data.id}.png`
                    },
                    parent2: {
                        name: parent2Data.name,
                        image: `/images/pals/${parent2Data.id}.png`
                    }
                };
            } catch (error) {
                console.error('Error fetching parent details:', error.message);
                return null;
            }
        }));

        return comboDetails.filter(detail => detail != null); // Filters out any null results due to errors.

    } catch (error) {
        console.error('Error fetching breeding combinations with details:', error.message);
        return [];
    }
}

export async function addFavoritePal(userId, palId) {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('favourites')
        .insert([{ user_id: userId, pal_id: palId }]);
  
      if (error) throw error;
  
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
  
      return data;
    } catch (error) {
      console.error('Error removing favorite pal:', error.message);
      throw error;
    }
  }