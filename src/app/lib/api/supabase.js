const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const CACHE_DURATION = 30 * 24 * 60 * 60;
const ALL_PALS_CACHE_DURATION = 30 * 24 * 60 * 60; // 30 days in seconds
const INDIVIDUAL_PAL_CACHE_DURATION = 60 * 60; // 1 hour in seconds

const headers = {
  'apikey': supabaseAnonKey,
  'Authorization': `Bearer ${supabaseAnonKey}`,
  'Content-Type': 'application/json'
};

export async function getPals(ids = null) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/get_pals`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ids: ids }),
    next: { 
      revalidate: ids && ids.length === 1 ? INDIVIDUAL_PAL_CACHE_DURATION : ALL_PALS_CACHE_DURATION 
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch pals');
  }

  const data = await response.json();

  if (ids && ids.length > 0) {
    // Filter results if specific ids were requested
    return data.filter(pal => ids.includes(pal.id));
  } else {
    // Return all pals if no ids were specified
    return data;
  }
}

export async function getWorkTypes() {
  const response = await fetch(`${supabaseUrl}/rest/v1/icons?select=icon_name,icon_url&category=eq.Work&order=work_order.asc`, {
    headers,
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch work types');
  }

  return response.json();
}

export async function getTypes() {
  const response = await fetch(`${supabaseUrl}/rest/v1/icons?select=icon_name,icon_url&category=eq.Type&order=type_order.asc`, {
    headers,
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch pal types');
  }

  return response.json();
}

export async function getCardData() {
  try {
    const [pals, workTypes, types] = await Promise.all([
      getPals(),
      getWorkTypes(),
      getTypes()
    ]);

    return { pals, workTypes, types };
  } catch (error) {
    console.error('Error fetching card data:', error);
    throw error;
  }
}

export async function getBreedingCombinations(palName) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/get_breeding_combos`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ child_pal_name: palName }),
    next: { revalidate: CACHE_DURATION }
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Error fetching breeding combinations: ${response.status} ${response.statusText} ${errorBody}`);
    return []; // Return an empty array instead of throwing an error
  }

  return response.json();
}