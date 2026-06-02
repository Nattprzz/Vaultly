export function getSiteUrl(): string {
  const configured = import.meta.env.VITE_SITE_URL as string | undefined;
  const fallback = globalThis.location?.origin ?? 'http://localhost:5173';
  return (configured ?? fallback).replace(/\/$/, '');
}
