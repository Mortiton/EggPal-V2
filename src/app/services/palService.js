import React from "react";
import { createClient } from "../utils/supabase/server";

const fetchPals = async (ids = []) => {
    console.log('Fetching pals from database');
    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_pals', { ids: ids.length ? ids : null });
  
    if (error) {
      throw new Error(`Error fetching pals: ${error.message}`);
    }
  
    return data;
  };
  
  const cachedFetchPals = React.cache(fetchPals);
  
  export async function getPals(ids = []) {
    console.log('Fetching pals from cache or database');
    return cachedFetchPals(ids);
  }

/**
 * Fetches all unique work types and their corresponding icons from the icons table.
 *
 * @returns {Promise<Object[]>} A promise that resolves to an array of work types and icons.
 * @throws Will throw an error if the request fails.
 */
export async function getWorkTypes() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("icons")
      .select("icon_name, icon_url")
      .in("Category", ["Work"])
      .order("work_order", { ascending: true });

    if (error) {
      console.error("Supabase Error:", error);
      throw new Error(`Error fetching work types: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching work types:", error);
    return null;
  }
}

/**
 * Fetches all unique type categories and their corresponding order from the Category table.
 *
 * @returns {Promise<Object[]>} A promise that resolves to an array of type categories and their order.
 * @throws Will throw an error if the request fails.
 */
export async function getTypes() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("icons")
      .select("icon_name, icon_url")
      .in("Category", ["Type"])
      .order("type_order", { ascending: true });

    if (error) {
      console.error("Supabase Error:", error);
      throw new Error(`Error fetching type categories: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching type categories:", error);
    return null;
  }
}
