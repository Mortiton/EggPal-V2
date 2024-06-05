'use server';

import { createClient } from '@/app/utils/supabase/server';

export async function getPals() {
  const supabase = createClient();
  const columns = [
    'id', 'name',
    'type1', 'type2',
    'kindling', 'watering', 'planting', 'generating_electricity',
    'handiwork', 'gathering', 'lumbering', 'mining',
    'medicine_production', 'cooling', 'transporting', 'farming'
  ];

  try {
    let { data: pals, error } = await supabase
      .from('palInfo')
      .select(columns.join(','))
      .order('id', { ascending: true }); // Sorts the results by the 'id' column in ascending order.

    if (error) throw error;

    return pals;
  } catch (error) {
    console.error('Error fetching pals:', error.message);
    return null;
  }
}