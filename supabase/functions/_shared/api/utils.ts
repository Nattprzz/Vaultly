/**
 * utils.ts — utilidades compartidas de APIs externas.
 *
 * Centraliza helpers de entorno, slugs, limpieza HTML y filtrado de listas.
 *
 * Utilizado por todos los clientes de proveedores externos.
 */

export function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export async function timedFetch(
  input: string | URL | Request,
  init: RequestInit = {},
  timeoutMs = 10000,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Construye slugs técnicos que preservan el origen externo del elemento.
 *
 * @param prefix Prefijo de proveedor o categoría.
 * @param sourceId Identificador externo.
 * @returns Slug de origen estable.
 */
export function toSourceSlug(prefix: string, sourceId: string | number): string {
  return `${prefix}-${String(sourceId).replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
}

/**
 * Elimina valores nulos o indefinidos de una lista tipada.
 *
 * @param items Lista con valores opcionales.
 * @returns Lista compacta con valores definidos.
 */
export function compact<T>(items: Array<T | null | undefined>): T[] {
  return items.filter(Boolean) as T[];
}

/**
 * Limpia marcas HTML de descripciones externas.
 *
 * @param value Texto recibido desde proveedor.
 * @returns Texto plano o null.
 */
export function stripHtml(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() || null;
}
