/**
 * Vaultly brand mark — "Capas apiladas" concept.
 *
 * Three rounded bars of decreasing width, stacked with a slight rightward
 * offset: simultaneously reads as (a) layered/organised collections — the
 * core promise of Vaultly — and (b) the descending stroke of a "V" in
 * negative space. Pure geometry, single tonal family (brand blue → slate),
 * no gradients, no illustration — designed to stay crisp from a 16px
 * favicon up to a hero lockup on the login screen.
 *
 * Built with `currentColor` + CSS custom properties so it adapts to
 * light/dark automatically when placed inside themed surfaces.
 */

interface LogoMarkProps {
  size?: number;
  className?: string;
}

/** Icon-only mark — use in the sidebar, favicon, app avatar, collapsed states. */
export function LogoMark({ size = 28, className = '' }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="Vaultly"
      className={className}
    >
      <rect x="4" y="6" width="20" height="5" rx="2.5" fill="var(--brand-accent, #3B82F6)" />
      <rect x="4" y="13.5" width="15" height="5" rx="2.5" fill="var(--brand-accent, #3B82F6)" opacity="0.72" />
      <rect x="4" y="21" width="10" height="5" rx="2.5" fill="var(--brand-accent, #3B82F6)" opacity="0.46" />
    </svg>
  );
}

interface LogoProps extends LogoMarkProps {
  withWordmark?: boolean;
}

/** Full lockup — mark + wordmark. Use in navbar/sidebar header, login, app shell. */
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
