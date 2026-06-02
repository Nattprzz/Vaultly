import { useSettings, Language } from '@/hooks/useSettings';
import SettingsCard from './SettingsCard';

const LANGUAGES: { id: Language; label: string; native: string; flag: string }[] = [
  { id: 'es', label: 'Español',    native: 'Español',    flag: '🇪🇸' },
  { id: 'en', label: 'Inglés',     native: 'English',    flag: '🇬🇧' },
  { id: 'fr', label: 'Francés',    native: 'Français',   flag: '🇫🇷' },
  { id: 'de', label: 'Alemán',     native: 'Deutsch',    flag: '🇩🇪' },
  { id: 'pt', label: 'Portugués',  native: 'Português',  flag: '🇵🇹' },
  { id: 'it', label: 'Italiano',   native: 'Italiano',   flag: '🇮🇹' },
  { id: 'ja', label: 'Japonés',    native: '日本語',      flag: '🇯🇵' },
  { id: 'ko', label: 'Coreano',    native: '한국어',      flag: '🇰🇷' },
];

export default function LanguageSection() {
  const { settings, update } = useSettings();

  return (
    <div className="flex flex-col gap-6">
      <SettingsCard
        title="Idioma de la aplicación"
        description="Selecciona el idioma en el que quieres usar Vaultly."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LANGUAGES.map(lang => {
            const isActive = settings.language === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => update('language', lang.id)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 transition-all cursor-pointer text-left ${
                  isActive
                    ? 'border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                <span className="text-2xl flex-shrink-0">{lang.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-300'}`}>
                    {lang.native}
                  </p>
                  <p className="text-xs text-zinc-400">{lang.label}</p>
                </div>
                {isActive && (
                  <div className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center flex-shrink-0">
                    <i className="ri-check-line text-white dark:text-zinc-900 text-xs"></i>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 flex items-start gap-2">
          <i className="ri-translate-2 text-amber-500 text-sm mt-0.5 flex-shrink-0"></i>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            El soporte completo de idiomas estará disponible próximamente. Actualmente la app está disponible en español.
          </p>
        </div>
      </SettingsCard>
    </div>
  );
}
