import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export type Language = 'es' | 'en' | 'fr' | 'de' | 'pt' | 'it' | 'ja' | 'ko';

export interface AppSettings {
  language: Language;
  activeCategories: string[];
  notifications: {
    newReleases: boolean;
    communityActivity: boolean;
    weeklyDigest: boolean;
    trackerReminders: boolean;
  };
  privacy: {
    publicProfile: boolean;
    shareTracker: boolean;
    showRatings: boolean;
    showReviews: boolean;
  };
}

export const SETTINGS_STORAGE_KEY = 'vaultly-settings';

const DEFAULT_SETTINGS: AppSettings = {
  language: 'es',
  activeCategories: ['videojuegos', 'peliculas', 'series', 'libros', 'conciertos'],
  notifications: {
    newReleases: true,
    communityActivity: false,
    weeklyDigest: true,
    trackerReminders: true,
  },
  privacy: {
    publicProfile: true,
    shareTracker: true,
    showRatings: true,
    showReviews: true,
  },
};

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch { /* empty */ }
  return DEFAULT_SETTINGS;
}

function saveSettings(s: AppSettings) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(s));
}

export function useSettings() {
  const { user, isLoggedIn } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  useEffect(() => {
    if (!isLoggedIn || !user) return;

    supabase
      .from('user_tracker_settings')
      .select('selected_categories')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        const selected = data?.selected_categories;
        if (!Array.isArray(selected) || selected.length === 0) return;

        setSettings(prev => {
          const next = { ...prev, activeCategories: selected as string[] };
          saveSettings(next);
          return next;
        });
      });
  }, [isLoggedIn, user]);

  const persistActiveCategories = useCallback(
    async (activeCategories: string[]) => {
      if (!user) return;

      await supabase
        .from('user_tracker_settings')
        .upsert(
          { user_id: user.id, selected_categories: activeCategories, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' },
        );
    },
    [user],
  );

  const update = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      saveSettings(next);
      return next;
    });
  }, []);

  const updateNested = useCallback(
    <K extends 'notifications' | 'privacy', F extends keyof AppSettings[K]>(
      section: K,
      field: F,
      value: AppSettings[K][F],
    ) => {
      setSettings(prev => {
        const next = {
          ...prev,
          [section]: { ...prev[section], [field]: value },
        };
        saveSettings(next);
        return next;
      });
    },
    [],
  );

  const toggleCategory = useCallback((catId: string) => {
    setSettings(prev => {
      const has = prev.activeCategories.includes(catId);
      // Must keep at least 1 category active
      if (has && prev.activeCategories.length <= 1) return prev;
      const activeCategories = has
        ? prev.activeCategories.filter(c => c !== catId)
        : [...prev.activeCategories, catId];
      const next = {
        ...prev,
        activeCategories,
      };
      saveSettings(next);
      void persistActiveCategories(activeCategories);
      return next;
    });
  }, [persistActiveCategories]);

  const reset = useCallback(() => {
    saveSettings(DEFAULT_SETTINGS);
    setSettings(DEFAULT_SETTINGS);
    void persistActiveCategories(DEFAULT_SETTINGS.activeCategories);
  }, [persistActiveCategories]);

  return { settings, update, updateNested, toggleCategory, reset };
}
