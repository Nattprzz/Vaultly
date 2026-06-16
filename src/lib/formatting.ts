/**
 * formatting.ts — helpers de formato centralizados para Vaultly.
 *
 * Todos los helpers son puros (sin efectos secundarios) y no dependen de
 * ningún módulo interno, por lo que se pueden importar desde cualquier capa.
 */

const LONG_DATE_FMT = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long',  year: 'numeric' });
const SHORT_DATE_FMT = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
const NUMBER_FMT     = new Intl.NumberFormat('es');

/** Fecha larga en español: "15 de marzo de 2001". Devuelve '' para null/undefined. */
export function fmtDate(value: string | null | undefined): string {
  if (!value) return '';
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return LONG_DATE_FMT.format(d);
  } catch {
    return value;
  }
}

/** Fecha corta en español: "15 mar 2001". Devuelve '—' para null/undefined. */
export function fmtDateShort(value: string | null | undefined): string {
  if (!value) return '—';
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return SHORT_DATE_FMT.format(d);
  } catch {
    return value;
  }
}

/** Extrae el año de una fecha ISO. Devuelve null para null/undefined/inválida. */
export function fmtYear(value: string | null | undefined): number | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.getFullYear();
}

/** Número con separadores de miles en español: "1.234". Devuelve null para null/undefined. */
export function fmtNumber(value: number | null | undefined): string | null {
  return value == null ? null : NUMBER_FMT.format(value);
}

/** Cantidad monetaria con sufijo de escala: "1.5B $", "15M $" o "1.234 $". */
export function fmtMoney(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B $`;
  if (n >= 1_000_000)     return `${Math.round(n / 1_000_000)}M $`;
  return `${n.toLocaleString('es-ES')} $`;
}
