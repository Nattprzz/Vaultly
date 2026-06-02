import { useTheme } from '@/hooks/useTheme';
import SettingsCard from './SettingsCard';

const THEME_OPTIONS = [
  {
    id: 'light',
    label: 'Claro',
    icon: 'ri-sun-line',
    preview: 'bg-white border-zinc-200',
    previewInner: 'bg-zinc-100',
    previewText: 'text-zinc-800',
  },
  {
    id: 'dark',
    label: 'Oscuro',
    icon: 'ri-moon-line',
    preview: 'bg-zinc-900 border-zinc-700',
    previewInner: 'bg-zinc-800',
    previewText: 'text-zinc-200',
  },
];

const ACCENT_COLORS = [
  { id: 'violet', label: 'Violeta', color: '#8b5cf6' },
  { id: 'rose',   label: 'Rosa',   color: '#f43f5e' },
  { id: 'amber',  label: 'Ámbar',  color: '#f59e0b' },
  { id: 'emerald',label: 'Verde',  color: '#10b981' },
  { id: 'sky',    label: 'Azul',   color: '#0ea5e9' },
  { id: 'zinc',   label: 'Neutro', color: '#71717a' },
];

const FONT_SIZES = [
  { id: 'sm',   label: 'Pequeño',  sample: 'text-xs' },
  { id: 'base', label: 'Normal',   sample: 'text-sm' },
  { id: 'lg',   label: 'Grande',   sample: 'text-base' },
];

export default function AppearanceSection() {
  const { theme, toggleTheme } = useTheme();

  // Accent color stored in localStorage (cosmetic only for now)
  const savedAccent = localStorage.getItem('vaultly-accent') ?? 'violet';
  const savedFont = localStorage.getItem('vaultly-font-size') ?? 'base';

  const setAccent = (id: string) => localStorage.setItem('vaultly-accent', id);
  const setFont = (id: string) => localStorage.setItem('vaultly-font-size', id);

  return (
    <div className="flex flex-col gap-6">
      {/* Theme */}
      <SettingsCard title="Tema" description="Elige entre modo claro u oscuro para la interfaz.">
        <div className="grid grid-cols-2 gap-4">
          {THEME_OPTIONS.map(opt => {
            const isActive = theme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => { if (theme !== opt.id) toggleTheme(); }}
                className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-zinc-900 dark:border-white'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                }`}
              >
                {/* Mini preview */}
                <div className={`w-full h-20 rounded-lg border ${opt.preview} flex flex-col gap-1.5 p-2 overflow-hidden`}>
                  <div className={`h-2 w-16 rounded-full ${opt.previewInner}`}></div>
                  <div className={`h-2 w-10 rounded-full ${opt.previewInner} opacity-60`}></div>
                  <div className="flex gap-1 mt-1">
                    <div className={`h-6 w-8 rounded ${opt.previewInner}`}></div>
                    <div className={`h-6 w-8 rounded ${opt.previewInner} opacity-60`}></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <i className={`${opt.icon} text-sm text-zinc-600 dark:text-zinc-400`}></i>
                  <span className={`text-sm font-semibold ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`}>
                    {opt.label}
                  </span>
                </div>
                {isActive && (
                  <div className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full bg-zinc-900 dark:bg-white">
                    <i className="ri-check-line text-white dark:text-zinc-900 text-xs"></i>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </SettingsCard>

      {/* Accent color */}
      <SettingsCard title="Color de acento" description="Color principal usado en botones y elementos destacados.">
        <div className="flex items-center gap-3 flex-wrap">
          {ACCENT_COLORS.map(ac => (
            <button
              key={ac.id}
              onClick={() => setAccent(ac.id)}
              title={ac.label}
              className={`relative w-10 h-10 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center ${
                savedAccent === ac.id ? 'ring-2 ring-offset-2 ring-zinc-900 dark:ring-white dark:ring-offset-zinc-900' : ''
              }`}
              style={{ background: ac.color }}
            >
              {savedAccent === ac.id && (
                <i className="ri-check-line text-white text-sm"></i>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-zinc-400 mt-3">El color de acento se aplicará completamente al conectar Supabase.</p>
      </SettingsCard>

      {/* Font size */}
      <SettingsCard title="Tamaño de texto" description="Ajusta el tamaño de la fuente en la interfaz.">
        <div className="flex items-center gap-3">
          {FONT_SIZES.map(fs => (
            <button
              key={fs.id}
              onClick={() => setFont(fs.id)}
              className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all cursor-pointer ${
                savedFont === fs.id
                  ? 'border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800'
                  : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
              }`}
            >
              <span className={`font-semibold text-zinc-900 dark:text-white ${fs.sample}`}>Aa</span>
              <span className="text-xs text-zinc-500">{fs.label}</span>
            </button>
          ))}
        </div>
      </SettingsCard>
    </div>
  );
}
