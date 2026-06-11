import { SUPABASE_FUNCTIONS_URL } from '@/lib/supabaseConfig';

export function edgeFunctionUrl(functionName: string): string {
  return `${SUPABASE_FUNCTIONS_URL.replace(/\/$/, '')}/${functionName}`;
}
