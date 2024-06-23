'use server';

import { createClient } from '@/app/utils/supabase/server';

/**
 * Fetches and returns data about pals from the 'palInfo' table in the database.
 * The data includes the id, name, types, and various base skills of each pal.
 * If there's an error during the database query, it logs the error message to the console and returns null.
 *
 * @returns {Promise<Array|null>} An array of pals if the database query is successful, or null if there's an error.
 */
export async function getPals() {
  console.log('Fetching pals data...');
  
  // Create a new Supabase client
  const supabase = createClient();

  // Define the columns to fetch from the 'palInfo' table
  const columns = [
    'id', 'name',
    'type1', 'type2',
    'kindling', 'watering', 'planting', 'generating_electricity',
    'handiwork', 'gathering', 'lumbering', 'mining',
    'medicine_production', 'cooling', 'transporting', 'farming'
  ];

  try {
    // Fetch data from the 'palInfo' table, selecting only the specified columns
    // and ordering the results by the 'id' column in ascending order
    let { data: pals, error } = await supabase
      .from('palInfo')
      .select(columns.join(','))
      .order('id', { ascending: true });

    // If there's an error during the database query, throw the error
    if (error) throw error;

    // console.log('Fetched pals data:', pals);
    
    // Return the fetched data
    return pals;
  } catch (error) {
    // Log the error message to the console and return null
    console.error('Error fetching pals:', error.message);
    return null;
  }
}