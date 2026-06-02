const configuredFunctionsUrl = import.meta.env.VITE_PUBLIC_SUPABASE_FUNCTIONS_URL as string | undefined;
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL as string | undefined;

const functionsBaseUrl = configuredFunctionsUrl
  ?? (supabaseUrl ? `${supabaseUrl.replace(/\/$/, '')}/functions/v1` : '');

export function edgeFunctionUrl(functionName: string): string {
  if (!functionsBaseUrl) {
    throw new Error('Falta configurar VITE_PUBLIC_SUPABASE_URL o VITE_PUBLIC_SUPABASE_FUNCTIONS_URL.');
  }

  return `${functionsBaseUrl}/${functionName}`;
}
