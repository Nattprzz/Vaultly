function requiredEnv(name: string): string {
  const value = import.meta.env[name] as string | undefined;
  if (!value || value.trim().length === 0) {
    throw new Error(`Falta configurar ${name}. Define esta variable en tu .env antes de iniciar Vaultly.`);
  }
  return value.trim();
}

function optionalEnv(name: string): string | null {
  const value = import.meta.env[name] as string | undefined;
  return value && value.trim().length > 0 ? value.trim() : null;
}

export const SUPABASE_URL = requiredEnv('VITE_PUBLIC_SUPABASE_URL');
export const SUPABASE_ANON_KEY = requiredEnv('VITE_PUBLIC_SUPABASE_ANON_KEY');
export const SUPABASE_FUNCTIONS_URL =
  optionalEnv('VITE_PUBLIC_SUPABASE_FUNCTIONS_URL') ?? `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1`;
