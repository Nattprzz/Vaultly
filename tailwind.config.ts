/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
      extend: {
        fontFamily: {
          grotesk: ["'Space Grotesk'", 'sans-serif'],
        },
        colors: {
          // Brand blue — the single primary color of the interface.
          // Category colors remain pure accents (see categoryColors.ts) and
          // never compete with this scale for primary UI real estate.
          brand: {
            DEFAULT: '#2563eb',
            soft: 'rgba(37, 99, 235, 0.12)',
            hover: '#1d4ed8',
            dark: '#3b82f6',
            'dark-hover': '#60a5fa',
          },
          // Token-backed surfaces so components can reach for `bg-surface`,
          // `border-app`, `text-secondary`, etc. and stay in sync with
          // index.css custom properties across light/dark automatically.
          surface: {
            DEFAULT: 'var(--surface)',
            raised: 'var(--surface-raised)',
            sunken: 'var(--surface-sunken)',
          },
          app: {
            bg: 'var(--bg)',
            border: 'var(--border)',
            'border-subtle': 'var(--border-subtle)',
            'border-strong': 'var(--border-strong)',
          },
        },
      },
    },
    plugins: [],
  }