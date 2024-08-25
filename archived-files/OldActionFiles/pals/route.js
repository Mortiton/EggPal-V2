import { createClient } from "@/app/utils/supabase/server";

export async function GET(request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids')?.split(',').map(Number) || null;

  const { data, error } = await supabase.rpc('get_pals', { ids: ids });
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}