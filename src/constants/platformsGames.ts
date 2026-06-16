/**
 * platforms.ts — fuente de verdad de estilos por plataforma para videojuegos.
 *
 * Cada entrada contiene el icono remixicon, el color corporativo y el fabricante.
 * El helper getPlatformStyle() busca primero por coincidencia exacta (lowercase)
 * y luego por subcadena (gana la clave más larga para evitar falsos positivos).
 */

import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface PlatformStyle {
  /** Clase remixicon */
  icon: string;
  /** Color hex corporativo (ajustado para visibilidad en fondos oscuros) */
  color: string;
  /** Nombre del fabricante / grupo */
  manufacturer: string;
}

const DEFAULT_STYLE: PlatformStyle = {
  icon: 'ri-gamepad-line',
  color: '#71717a',
  manufacturer: 'Unknown',
};

// ─── Mapa principal ────────────────────────────────────────────────────────────
// Claves siempre en minúsculas.
const PLATFORM_MAP: Record<string, PlatformStyle> = {
  // ── Nintendo (#E60012) ───────────────────────────────────────────────────────
  'game & watch':                   { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'nintendo entertainment system':  { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'nes':                            { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'family computer disk system':    { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'famicom':                        { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'game boy':                       { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'super nintendo entertainment system': { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'super nintendo':                 { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'snes':                           { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'virtual boy':                    { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'nintendo 64':                    { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'n64':                            { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'pokémon mini':                   { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'pokemon mini':                   { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'nintendo gamecube':              { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'gamecube':                       { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'e-reader':                       { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'game boy advance':               { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'gba':                            { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'nintendo ds':                    { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'nds':                            { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'wii':                            { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'nintendo dsi':                   { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'nintendo 3ds':                   { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  '3ds':                            { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'wii u':                          { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'new nintendo 3ds':               { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'nintendo switch':                { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'nintendo switch 2':              { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },
  'switch':                         { icon: 'ri-switch-fill', color: '#E60012', manufacturer: 'Nintendo' },

  // ── PlayStation (#004098) ────────────────────────────────────────────────────
  'playstation':                    { icon: 'ri-playstation-fill', color: '#004098', manufacturer: 'PlayStation' },
  'playstation 2':                  { icon: 'ri-playstation-fill', color: '#004098', manufacturer: 'PlayStation' },
  'playstation 3':                  { icon: 'ri-playstation-fill', color: '#004098', manufacturer: 'PlayStation' },
  'playstation 4':                  { icon: 'ri-playstation-fill', color: '#004098', manufacturer: 'PlayStation' },
  'playstation 5':                  { icon: 'ri-playstation-fill', color: '#004098', manufacturer: 'PlayStation' },
  'ps1':                            { icon: 'ri-playstation-fill', color: '#004098', manufacturer: 'PlayStation' },
  'ps2':                            { icon: 'ri-playstation-fill', color: '#004098', manufacturer: 'PlayStation' },
  'ps3':                            { icon: 'ri-playstation-fill', color: '#004098', manufacturer: 'PlayStation' },
  'ps4':                            { icon: 'ri-playstation-fill', color: '#004098', manufacturer: 'PlayStation' },
  'ps5':                            { icon: 'ri-playstation-fill', color: '#004098', manufacturer: 'PlayStation' },
  'psp':                            { icon: 'ri-playstation-fill', color: '#004098', manufacturer: 'PlayStation' },
  'playstation portable':           { icon: 'ri-playstation-fill', color: '#004098', manufacturer: 'PlayStation' },
  'ps vita':                        { icon: 'ri-playstation-fill', color: '#004098', manufacturer: 'PlayStation' },
  'playstation vita':               { icon: 'ri-playstation-fill', color: '#004098', manufacturer: 'PlayStation' },
  'ps vr2':                         { icon: 'ri-playstation-fill', color: '#004098', manufacturer: 'PlayStation' },
  'ps vr':                          { icon: 'ri-playstation-fill', color: '#004098', manufacturer: 'PlayStation' },
  'playstation vr2':                { icon: 'ri-playstation-fill', color: '#004098', manufacturer: 'PlayStation' },
  'playstation vr':                 { icon: 'ri-playstation-fill', color: '#004098', manufacturer: 'PlayStation' },

  // ── Xbox (#0F7C11) ───────────────────────────────────────────────────────────
  'xbox series x|s':                { icon: 'ri-xbox-fill', color: '#0F7C11', manufacturer: 'Xbox' },
  'xbox series x/s':                { icon: 'ri-xbox-fill', color: '#0F7C11', manufacturer: 'Xbox' },
  'xbox series x':                  { icon: 'ri-xbox-fill', color: '#0F7C11', manufacturer: 'Xbox' },
  'xbox series s':                  { icon: 'ri-xbox-fill', color: '#0F7C11', manufacturer: 'Xbox' },
  'xbox one':                       { icon: 'ri-xbox-fill', color: '#0F7C11', manufacturer: 'Xbox' },
  'xbox 360':                       { icon: 'ri-xbox-fill', color: '#0F7C11', manufacturer: 'Xbox' },
  'xbox':                           { icon: 'ri-xbox-fill', color: '#0F7C11', manufacturer: 'Xbox' },

  // ── PC / Windows (#5FCBFD) ───────────────────────────────────────────────────
  'pc (windows)':                   { icon: 'ri-windows-fill', color: '#5FCBFD', manufacturer: 'Windows' },
  'windows':                        { icon: 'ri-windows-fill', color: '#5FCBFD', manufacturer: 'Windows' },
  'pc':                             { icon: 'ri-windows-fill', color: '#5FCBFD', manufacturer: 'Windows' },

  // ── Linux (#F86215) ──────────────────────────────────────────────────────────
  'linux':                          { icon: 'ri-ubuntu-line', color: '#F86215', manufacturer: 'Linux' },

  // ── Mac / macOS (#A2AAAD) ────────────────────────────────────────────────────
  'macos':                          { icon: 'ri-apple-line', color: '#A2AAAD', manufacturer: 'Apple' },
  'mac os x':                       { icon: 'ri-apple-line', color: '#A2AAAD', manufacturer: 'Apple' },
  'macintosh':                      { icon: 'ri-apple-line', color: '#A2AAAD', manufacturer: 'Apple' },
  'mac':                            { icon: 'ri-apple-line', color: '#A2AAAD', manufacturer: 'Apple' },
  'apple ii':                       { icon: 'ri-apple-line', color: '#A2AAAD', manufacturer: 'Apple' },
  'apple pippin':                   { icon: 'ri-apple-line', color: '#A2AAAD', manufacturer: 'Apple' },

  // ── iOS / visionOS (#A2AAAD) ─────────────────────────────────────────────────
  'visionos':                       { icon: 'ri-glasses-line', color: '#A2AAAD', manufacturer: 'Apple' },
  'ios':                            { icon: 'ri-apple-line', color: '#A2AAAD', manufacturer: 'Apple' },

  // ── Android (#3DDC84) ────────────────────────────────────────────────────────
  'android':                        { icon: 'ri-android-line', color: '#96C039', manufacturer: 'Android' },

  // ── Sega (#0089CF / Dreamcast #FF6600) ──────────────────────────────────────
  'sg-1000':                        { icon: 'ri-gamepad-line', color: '#0089CF', manufacturer: 'Sega' },
  'master system':                  { icon: 'ri-gamepad-line', color: '#0089CF', manufacturer: 'Sega' },
  'sega mega drive':                { icon: 'ri-gamepad-fill', color: '#0089CF', manufacturer: 'Sega' },
  'mega drive':                     { icon: 'ri-gamepad-fill', color: '#0089CF', manufacturer: 'Sega' },
  'sega genesis':                   { icon: 'ri-gamepad-fill', color: '#0089CF', manufacturer: 'Sega' },
  'genesis':                        { icon: 'ri-gamepad-fill', color: '#0089CF', manufacturer: 'Sega' },
  'game gear':                      { icon: 'ri-smartphone-line', color: '#0089CF', manufacturer: 'Sega' },
  'sega cd':                        { icon: 'ri-gamepad-fill', color: '#0089CF', manufacturer: 'Sega' },
  'pico':                           { icon: 'ri-gamepad-line', color: '#0089CF', manufacturer: 'Sega' },
  '32x':                            { icon: 'ri-gamepad-fill', color: '#0089CF', manufacturer: 'Sega' },
  'sega saturn':                    { icon: 'ri-gamepad-fill', color: '#0089CF', manufacturer: 'Sega' },
  'saturn':                         { icon: 'ri-gamepad-fill', color: '#0089CF', manufacturer: 'Sega' },
  'sega dreamcast':                 { icon: 'ri-gamepad-fill', color: '#FF6600', manufacturer: 'Sega' },
  'dreamcast':                      { icon: 'ri-gamepad-fill', color: '#FF6600', manufacturer: 'Sega' },

  // ── Atari (#D7263D) ──────────────────────────────────────────────────────────
  'atari 2600':                     { icon: 'ri-gamepad-line', color: '#D7263D', manufacturer: 'Atari' },
  'atari 5200':                     { icon: 'ri-gamepad-line', color: '#D7263D', manufacturer: 'Atari' },
  'atari 7800':                     { icon: 'ri-gamepad-line', color: '#D7263D', manufacturer: 'Atari' },
  'atari lynx':                     { icon: 'ri-smartphone-line', color: '#D7263D', manufacturer: 'Atari' },
  'atari jaguar cd':                { icon: 'ri-gamepad-line', color: '#D7263D', manufacturer: 'Atari' },
  'atari jaguar':                   { icon: 'ri-gamepad-line', color: '#D7263D', manufacturer: 'Atari' },

  // ── Valve / Steam (#4B88C7, versión clara del #1B2838 para visibilidad) ──────
  'steam deck':                     { icon: 'ri-steam-fill', color: '#134578', manufacturer: 'Valve' },
  'steamos':                        { icon: 'ri-steam-fill', color: '#134578', manufacturer: 'Valve' },
  'steam':                          { icon: 'ri-steam-fill', color: '#134578', manufacturer: 'Valve' },

  // ── Meta (#0481FC) / Oculus (#0467DF) ──────────────────────────────────────────────────
  'meta quest 3':                   { icon: 'ri-meta-line', color: '#0481FC', manufacturer: 'Meta' },
  'meta quest 2':                   { icon: 'ri-meta-line', color: '#0481FC', manufacturer: 'Meta' },
  'meta quest':                     { icon: 'ri-meta-line', color: '#0481FC', manufacturer: 'Meta' },
  'oculus quest':                   { icon: 'ri-glasses-line', color: '#0467DF', manufacturer: 'Meta' },
  'oculus rift':                    { icon: 'ri-glasses-line', color: '#0467DF', manufacturer: 'Meta' },
  'oculus':                         { icon: 'ri-glasses-line', color: '#0467DF', manufacturer: 'Meta' },

  // ── SNK (#888888, negro ajustado para visibilidad sobre fondos oscuros) ──────
  'neo geo pocket color':           { icon: 'ri-smartphone-line', color: '#888888', manufacturer: 'SNK' },
  'neo geo pocket':                 { icon: 'ri-smartphone-line', color: '#888888', manufacturer: 'SNK' },
  'neo geo cd':                     { icon: 'ri-gamepad-line', color: '#888888', manufacturer: 'SNK' },
  'neo geo mvs':                    { icon: 'ri-gamepad-line', color: '#888888', manufacturer: 'SNK' },
  'neo geo aes':                    { icon: 'ri-gamepad-line', color: '#888888', manufacturer: 'SNK' },
  'neo geo':                        { icon: 'ri-gamepad-line', color: '#888888', manufacturer: 'SNK' },

  // ── SNK (#888888, negro ajustado para visibilidad sobre fondos oscuros) ──────
  'mobile':           { icon: 'ri-smartphone-line', color: '#888888', manufacturer: 'mobile' },
};

// ─── Helper público ────────────────────────────────────────────────────────────

/**
 * Devuelve el estilo de plataforma para un nombre dado.
 *
 * Estrategia de búsqueda:
 * 1. Coincidencia exacta (insensible a mayúsculas)
 * 2. Subcadena — gana la clave más larga para evitar falsos positivos
 *    (p.ej. "pico" no debe activar "pc", pero "PlayStation 5" sí activa "playstation 5")
 * 3. Estilo genérico por defecto
 */
export function getPlatformStyle(name: string): PlatformStyle {
  const lower = name.toLowerCase().trim();

  if (PLATFORM_MAP[lower]) return PLATFORM_MAP[lower];

  let best: PlatformStyle | null = null;
  let bestLen = 0;
  for (const [key, style] of Object.entries(PLATFORM_MAP)) {
    if (lower.includes(key) && key.length > bestLen) {
      best = style;
      bestLen = key.length;
    }
  }

  return best ?? DEFAULT_STYLE;
}

export { DEFAULT_STYLE as DEFAULT_PLATFORM_STYLE };

/**
 * Returns black or white depending on which has sufficient contrast against `hex`.
 * Uses WCAG relative luminance with threshold 0.179 (≈ 4.5:1 on white).
 */
export function getReadableTextColor(hex: string): '#000000' | '#ffffff' {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.179 ? '#000000' : '#ffffff';
}
