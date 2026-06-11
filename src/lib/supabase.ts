import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

console.log('SUPABASE URL:', supabaseUrl);
console.log('SUPABASE KEY:', supabaseAnonKey ? 'EXISTS' : 'MISSING');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Missing Supabase env vars. URL=${supabaseUrl ? 'OK' : 'MISSING'} KEY=${supabaseAnonKey ? 'OK' : 'MISSING'}`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);