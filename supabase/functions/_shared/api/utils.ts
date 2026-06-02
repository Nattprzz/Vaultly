export function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export function toSourceSlug(prefix: string, sourceId: string | number): string {
  return `${prefix}-${String(sourceId).replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
}

export function compact<T>(items: Array<T | null | undefined>): T[] {
  return items.filter(Boolean) as T[];
}

export function stripHtml(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() || null;
}
