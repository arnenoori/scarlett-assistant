import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getWebsitesCount() {
  const { count, error } = await supabase
    .from('websites')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error fetching websites count:', error);
    return 0;
  }

  return count || 0;
}