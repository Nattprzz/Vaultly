/**
 * Logo.tsx — logo oficial de Vaultly adaptado al tema activo.
 *
 * Centraliza la selección entre las versiones para fondo claro y fondo oscuro.
 * Se usa en navegación, autenticación, estados de carga y componentes de marca.
 */

// ─── Hooks ───────────────────────────────────────────────────────────────────

import { useTheme } from '@/hooks/useTheme';

// ─── Constantes ──────────────────────────────────────────────────────────────

export const VAULTLY_LOGO_LIGHT_SRC = '/logos/logo_fondo_claro.png';
export const VAULTLY_LOGO_DARK_SRC = '/logos/logo_fondo_oscuro.png';
export const VAULTLY_LOGO_SRC = VAULTLY_LOGO_LIGHT_SRC;
export const VAULTLY_FAVICON_SRC = '/logos/favicon.ico';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface LogoMarkProps {
  /** Tamaño en píxeles del logo. Por defecto 28. */
  size?: number;
  /** Clases CSS adicionales para el elemento de imagen. */
  className?: string;
}

interface LogoProps extends LogoMarkProps {
  /** Si true (por defecto), muestra el wordmark "Vaultly" junto a la marca. */
  withWordmark?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Devuelve la ruta del logo que corresponde al tema actual.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function getVaultlyLogoSrc(theme: 'light' | 'dark') {
  return theme === 'dark' ? VAULTLY_LOGO_DARK_SRC : VAULTLY_LOGO_LIGHT_SRC;
}

// ─── Componentes ─────────────────────────────────────────────────────────────

/**
 * Marca visual oficial sin wordmark textual.
 */
export function LogoMark({ size = 28, className = '' }: LogoMarkProps) {
  const { theme } = useTheme();
  const logoSrc = getVaultlyLogoSrc(theme);

  return (
    <img
      src={logoSrc}
      alt="Vaultly"
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  );
}

/**
 * Lockup completo: logo oficial más wordmark.
 */
export default function Logo({ size = 28, withWordmark = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {withWordmark && (
        <span className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
          Vaultly
        </span>
      )}
    </div>
  );
}
