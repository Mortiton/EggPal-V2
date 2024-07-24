"use server"
import { createClient } from "../utils/supabase/server";


/**
 * Fetches the user data from Supabase.
 * 
 * @returns {Promise<Object>} The user data.
 * @throws Will throw an error if the user data cannot be fetched.
 */
export async function getUser() {
    const supabase = createClient();
  
    const { data: { user }, error } = await supabase.auth.getUser();
  
    if (error) {
      throw new Error(error.message);
    }
  
    return user;
  }
