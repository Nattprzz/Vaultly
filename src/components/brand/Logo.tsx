/**
 * Logo.tsx — compatibilidad para imports antiguos del logo.
 *
 * Reexporta el componente oficial centralizado en components/branding/Logo.
 * Barrel re-export mixing components and constants — fast-refresh limitation is acceptable here.
 */

/* eslint-disable react-refresh/only-export-components */
export {
  default,
  LogoMark,
  VAULTLY_FAVICON_SRC,
  VAULTLY_LOGO_DARK_SRC,
  VAULTLY_LOGO_LIGHT_SRC,
  VAULTLY_LOGO_SRC,
  getVaultlyLogoSrc,
} from '@/components/branding/Logo';
