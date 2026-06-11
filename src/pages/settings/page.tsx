import { useState } from 'react';
import { useEffect } from 'react';
import Sidebar from '@/components/feature/Sidebar';
import SeoHead from '@/components/feature/SeoHead';
import { useAuth } from '@/hooks/useAuth';
import SettingsSidebar, { Section } from './components/SettingsSidebar';
import AppearanceSection from './components/AppearanceSection';
import CategoriesSection from './components/CategoriesSection';
import LanguageSection from './components/LanguageSection';
import NotificationsSection from './components/NotificationsSection';
import PrivacySection from './components/PrivacySection';
import AccountSection from './components/AccountSection';

const SECTION_TITLES: Record<Section, { title: string; subtitle: string }> = {
  appearance:    { title: 'Apariencia',     subtitle: 'Personaliza el aspecto visual de Vaultly.' },
  categories:    { title: 'Categorías',     subtitle: 'Elige qué categorías aparecen en tu tracker.' },
  language:      { title: 'Idioma',         subtitle: 'Selecciona el idioma de la interfaz.' },
  notifications: { title: 'Notificaciones', subtitle: 'Gestiona tus alertas y avisos.' },
  privacy:       { title: 'Privacidad',     subtitle: 'Controla la visibilidad de tu perfil y tracker.' },
  account:       { title: 'Cuenta',         subtitle: 'Gestiona tu información personal y seguridad.' },
};

const PUBLIC_SECTIONS: Section[] = ['appearance', 'language'];
const PRIVATE_SECTIONS: Section[] = ['notifications', 'privacy', 'account'];

function SectionContent({ section }: { section: Section }) {
  switch (section) {
    case 'appearance':    return <AppearanceSection />;
    case 'categories':    return <CategoriesSection />;
    case 'language':      return <LanguageSection />;
    case 'notifications': return <NotificationsSection />;
    case 'privacy':       return <PrivacySection />;
    case 'account':       return <AccountSection />;
  }
}

export default function SettingsPage() {
  const { isLoggedIn } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>('appearance');
  const availableSections = isLoggedIn ? [...PUBLIC_SECTIONS, ...PRIVATE_SECTIONS] : PUBLIC_SECTIONS;

  useEffect(() => {
    if (!isLoggedIn && !PUBLIC_SECTIONS.includes(activeSection)) {
      setActiveSection('appearance');
    }
  }, [activeSection, isLoggedIn]);

  const { title, subtitle } = SECTION_TITLES[activeSection];

  return (
    <div className="min-h-screen bg-[var(--bg)] dark:bg-[var(--bg)]">
      <SeoHead
        title="Configuración — Vaultly"
        description="Personaliza tu experiencia en Vaultly: apariencia, categorías, idioma, notificaciones y privacidad."
        canonical="/settings"
        noIndex
      />
      <Sidebar />
      <main className="pt-14 md:pt-0 md:pl-64">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10">
          {/* Page header */}
          <div className="mb-8">
            <h1
              className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Configuración
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Personaliza tu experiencia en Vaultly
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <SettingsSidebar active={activeSection} onChange={setActiveSection} items={availableSections} />

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Section header */}
              <div className="mb-6">
                <h2
                  className="text-xl font-bold text-zinc-900 dark:text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {title}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{subtitle}</p>
              </div>

              {/* Section content */}
              <SectionContent section={activeSection} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
