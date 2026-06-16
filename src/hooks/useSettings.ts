/**
 * useSettings.ts — preferencias de aplicación del usuario.
 *
 * Gestiona la configuración personal: idioma, categorías activas, notificaciones
 * y privacidad. Se sincroniza con localStorage para persistencia offline
 * y con Supabase para las categorías activas del usuario autenticado.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useCallback, useEffect } from 'react';

// ─── Servicios ───────────────────────────────────────────────────────────────

import { supabase } from '@/lib/supabase';

// ─── Hooks ───────────────────────────────────────────────────────────────────

import { useAuth } from '@/hooks/useAuth';

// ─── Tipos ───────────────────────────────────────────────────────────────────

/** Idioma de la aplicación. */
export type Language = 'es' | 'en' | 'fr' | 'de' | 'pt' | 'it' | 'ja' | 'ko';

/**
 * Configuración completa de la aplicación para un usuario.
 *
 * Nota: la privacidad del perfil (is_public, share_tracker, show_ratings,
 * show_reviews) se gestiona exclusivamente en la tabla `profiles` de Supabase
 * vía PrivacySection.tsx, no en estos ajustes locales.
 */
export interface AppSettings {
  /** Idioma de la interfaz */
  language: Language;
  /** Categorías visibles en la navegación y el tracker */
  activeCategories: string[];
  /** Preferencias de notificaciones */
  notifications: {
    /** Notificaciones sobre nuevos lanzamientos */
    newReleases: boolean;
    /** Notificaciones sobre actividad de la comunidad */
    communityActivity: boolean;
    /** Resumen semanal por correo */
    weeklyDigest: boolean;
    /** Recordatorios del tracker */
    trackerReminders: boolean;
  };
}

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Clave de localStorage para las preferencias del usuario. */
export const SETTINGS_STORAGE_KEY = 'vaultly-settings';

/** Valores por defecto de la configuración para usuarios nuevos. */
const DEFAULT_SETTINGS: AppSettings = {
  language: 'es',
  activeCategories: ['videojuegos', 'peliculas', 'series', 'libros', 'conciertos'],
  notifications: {
    newReleases: true,
    communityActivity: false,
    weeklyDigest: true,
    trackerReminders: true,
  },
};

// ─── Funciones auxiliares ────────────────────────────────────────────────────

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS;
}

function saveSettings(s: AppSettings) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(s));
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Gestiona las preferencias personales del usuario.
 *
 * Responsabilidades:
 * - Cargar la configuración desde localStorage al iniciar.
 * - Sincronizar las categorías activas desde Supabase si el usuario está autenticado.
 * - Persistir cambios en localStorage de forma inmediata.
 * - Sincronizar las categorías activas en Supabase al cambiarlas.
 */
export function useSettings() {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  const { user, isLoggedIn } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  // ─── Efectos ─────────────────────────────────────────────────────────────────

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

  // ─── Handlers ────────────────────────────────────────────────────────────────

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

  /**
   * Actualiza un campo raíz de la configuración.
   *
   * @param key Clave de AppSettings a actualizar.
   * @param value Nuevo valor.
   */
  const update = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      saveSettings(next);
      return next;
    });
  }, []);

  /**
   * Actualiza un campo anidado dentro de `notifications` o `privacy`.
   *
   * @param section Sección de configuración a modificar.
   * @param field Campo dentro de la sección.
   * @param value Nuevo valor.
   */
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

  /**
   * Activa o desactiva una categoría en la navegación.
   * No permite desactivar la última categoría activa.
   *
   * @param catId Identificador de la categoría.
   */
  const toggleCategory = useCallback((catId: string) => {
    setSettings(prev => {
      const has = prev.activeCategories.includes(catId);
      if (has && prev.activeCategories.length <= 1) return prev;
      const activeCategories = has
        ? prev.activeCategories.filter(c => c !== catId)
        : [...prev.activeCategories, catId];
      const next = { ...prev, activeCategories };
      saveSettings(next);
      void persistActiveCategories(activeCategories);
      return next;
    });
  }, [persistActiveCategories]);

  /**
   * Restaura la configuración a los valores por defecto y sincroniza con Supabase.
   */
  const reset = useCallback(() => {
    saveSettings(DEFAULT_SETTINGS);
    setSettings(DEFAULT_SETTINGS);
    void persistActiveCategories(DEFAULT_SETTINGS.activeCategories);
  }, [persistActiveCategories]);

  return { settings, update, updateNested, toggleCategory, reset };
}
