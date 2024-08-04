const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const headers = {
  'apikey': supabaseAnonKey,
  'Authorization': `Bearer ${supabaseAnonKey}`,
  'Content-Type': 'application/json'
};

export async function getPals() {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/get_pals`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ids: null }),
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch pals');
  }

  return response.json();
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