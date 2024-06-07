"use server";

import { createClient } from '@/app/utils/supabase/server';

export async function getFavoritePals(userId) {
  const supabase = createClient();

  try {
    // Fetch favorite pal_ids for the given user
    let { data: favorites, error: favError } = await supabase
      .from('favourites')
      .select('pal_id')
      .eq('user_id', userId);

    if (favError) throw favError;

    if (!favorites || !favorites.length) {
      return [];
    }

    // Fetch details for each favorite pal
    const palIds = favorites.map(fav => fav.pal_id);
    let { data: pals, error: palError } = await supabase
      .from('palInfo')
      .select('id, name, type1, type2, kindling, watering, planting, generating_electricity, handiwork, gathering, lumbering, mining, medicine_production, cooling, transporting, farming')
      .in('id', palIds);

    if (palError) throw palError;

    return pals;
  } catch (error) {
    console.error('Error fetching favorite pals:', error.message);
    return [];
  }
}
