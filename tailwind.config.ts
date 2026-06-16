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
        animation: {
          shine: 'shine var(--duration, 14s) infinite linear',
        },
        keyframes: {
          shine: {
            '0%':  { backgroundPosition: '0% 0%'     },
            '50%': { backgroundPosition: '100% 100%' },
            'to':  { backgroundPosition: '0% 0%'     },
          },
        },
        colors: {
          // Brand blue — the single primary color of the interface.
          // Category colors remain pure accents (see categoryColors.ts) and
          // never compete with this scale for primary UI real estate.
          brand: {
            DEFAULT: '#0553EB',
            soft: 'rgba(5, 83, 235, 0.10)',
            hover: '#1E63F5',
            active: '#033596',
            secondary: '#033596',
            deep: '#011741',
            dark: '#0553EB',
            'dark-hover': '#1E63F5',
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