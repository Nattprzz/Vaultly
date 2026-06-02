type Section = 'appearance' | 'categories' | 'language' | 'notifications' | 'privacy' | 'account';

interface NavItem {
  id: Section;
  label: string;
  icon: string;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'appearance',    label: 'Apariencia',    icon: 'ri-palette-line',       description: 'Tema, colores y fuentes' },
  { id: 'categories',   label: 'Categorías',    icon: 'ri-apps-2-line',        description: 'Gestiona tu tracker' },
  { id: 'language',     label: 'Idioma',        icon: 'ri-translate-2',        description: 'Idioma de la aplicación' },
  { id: 'notifications',label: 'Notificaciones',icon: 'ri-notification-3-line',description: 'Alertas y avisos' },
  { id: 'privacy',      label: 'Privacidad',    icon: 'ri-shield-check-line',  description: 'Visibilidad de tu perfil' },
  { id: 'account',      label: 'Cuenta',        icon: 'ri-user-settings-line', description: 'Datos y seguridad' },
];

interface Props {
  active: Section;
  onChange: (s: Section) => void;
  items?: Section[];
}

export default function SettingsSidebar({ active, onChange, items }: Props) {
  const visibleItems = items ? NAV_ITEMS.filter(item => items.includes(item.id)) : NAV_ITEMS;

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <nav className="flex flex-col gap-1">
        {visibleItems.map(item => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer w-full ${
              active === item.id
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <div className={`w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 ${
              active === item.id
                ? 'bg-white/20 dark:bg-zinc-900/20'
                : 'bg-zinc-100 dark:bg-zinc-800'
            }`}>
              <i className={`${item.icon} text-sm`}></i>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight">{item.label}</p>
              <p className={`text-xs leading-tight mt-0.5 ${active === item.id ? 'text-white/60 dark:text-zinc-900/60' : 'text-zinc-400'}`}>
                {item.description}
              </p>
            </div>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export type { Section };
