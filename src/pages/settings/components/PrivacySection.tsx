/**
 * PrivacySection.tsx — sección de configuración de privacidad del perfil.
 *
 * Gestiona los flags de visibilidad del perfil público: visibilidad global,
 * compartir tracker, mostrar puntuaciones, reseñas y estado de los ítems.
 * Los tres primeros se guardan en `profiles`; `show_item_status` en
 * `user_tracker_settings`. Desactivar el perfil público deshabilita en
 * cascada todas las opciones dependientes.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useAuth }    from '@/hooks/useAuth';

// ─── Librerías externas ──────────────────────────────────────────────────────

import { supabase }   from '@/lib/supabase';

// ─── Componentes ─────────────────────────────────────────────────────────────

import SettingsCard, { ToggleRow } from './SettingsCard';
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Flags de privacidad del perfil público. */
interface PrivacyState {
  is_public:        boolean;
  share_tracker:    boolean;
  show_ratings:     boolean;
  show_reviews:     boolean;
  show_item_status: boolean;
}

/** Estados del guardado para el botón de acción. */
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// ─── Componente ──────────────────────────────────────────────────────────────

export default function PrivacySection() {
  const { profile, refreshProfile } = useAuth();

  // ─── Estado ───────────────────────────────────────────────────────────────

  const [priv, setPriv] = useState<PrivacyState>({
    is_public:        true,
    share_tracker:    true,
    show_ratings:     true,
    show_reviews:     true,
    show_item_status: true,
  });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // ─── Efectos ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!profile) return;

    setPriv(prev => ({
      ...prev,
      is_public:     profile.is_public     ?? true,
      share_tracker: profile.share_tracker  ?? true,
      show_ratings:  profile.show_ratings   ?? true,
      show_reviews:  profile.show_reviews   ?? true,
    }));

    // show_item_status está en user_tracker_settings, no en profiles
    supabase
      .from('user_tracker_settings')
      .select('show_item_status')
      .eq('user_id', profile.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) return;
        setPriv(prev => ({ ...prev, show_item_status: data?.show_item_status ?? true }));
      });
  }, [profile]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  /**
   * Actualiza un flag de privacidad y aplica las restricciones en cascada
   * cuando el perfil pasa a privado.
   */
  const update = (key: keyof PrivacyState, value: boolean) => {
    setPriv(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'is_public' && !value) {
        next.share_tracker    = false;
        next.show_ratings     = false;
        next.show_reviews     = false;
        next.show_item_status = false;
      }
      return next;
    });
  };

  /** Persiste los flags en Supabase (profiles + user_tracker_settings en paralelo). */
  const handleSave = async () => {
    if (!profile) return;
    setSaveStatus('saving');

    const [{ error: profileError }, { error: settingsError }] = await Promise.all([
      supabase
        .from('profiles')
        .update({
          is_public:     priv.is_public,
          share_tracker: priv.share_tracker,
          show_ratings:  priv.show_ratings,
          show_reviews:  priv.show_reviews,
          updated_at:    new Date().toISOString(),
        })
        .eq('id', profile.id),
      supabase
        .from('user_tracker_settings')
        .upsert({ user_id: profile.id, show_item_status: priv.show_item_status }, { onConflict: 'user_id' }),
    ]);

    const error = profileError ?? settingsError;

    if (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } else {
      await refreshProfile();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    }
  };

  // ─── Datos derivados ──────────────────────────────────────────────────────

  const profileUsername = profile?.username ?? profile?.email?.split('@')[0] ?? 'usuario';
  const shareUrl        = `${window.location.origin}/u/${profileUsername}`;

  // ─── Renderizado ──────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">
      {/* Visibilidad del perfil */}
      <SettingsCard
        title="Visibilidad del perfil"
        description="Controla qué pueden ver otros usuarios de tu actividad en Vaultly."
      >
        <div className="flex flex-col">
          <ToggleRow
            label="Perfil público"
            description="Cualquiera puede ver tu perfil y estadísticas generales."
            checked={priv.is_public}
            onChange={v => update('is_public', v)}
          />
          <ToggleRow
            label="Compartir tracker"
            description="Tu tracker es visible para quien tenga el enlace."
            checked={priv.share_tracker}
            onChange={v => update('share_tracker', v)}
            disabled={!priv.is_public}
          />
          <ToggleRow
            label="Mostrar puntuaciones"
            description="Tus valoraciones son visibles en tu perfil público."
            checked={priv.show_ratings}
            onChange={v => update('show_ratings', v)}
            disabled={!priv.is_public}
          />
          <ToggleRow
            label="Mostrar reseñas"
            description="Tus reseñas son visibles en el catálogo y en tu perfil."
            checked={priv.show_reviews}
            onChange={v => update('show_reviews', v)}
            disabled={!priv.is_public}
          />
          <ToggleRow
            label="Mostrar estado de los ítems"
            description="El estado de cada ítem es visible en tu perfil público."
            checked={priv.show_item_status}
            onChange={v => update('show_item_status', v)}
            disabled={!priv.is_public}
          />
        </div>

        {!priv.is_public && (
          <div className="mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <i className="ri-lock-line text-zinc-500 text-sm flex-shrink-0"></i>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Tu perfil está en modo <strong>privado</strong>. Solo tú puedes verlo.
            </p>
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="mt-4 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
            <i className="ri-error-warning-line text-red-500 text-sm flex-shrink-0"></i>
            <p className="text-xs text-red-600 dark:text-red-400">Error al guardar. Inténtalo de nuevo.</p>
          </div>
        )}

        <div className="mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap disabled:opacity-60 ${
              saveStatus === 'saved'
                ? 'bg-emerald-500 text-white'
                : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90'
            }`}
          >
            {saveStatus === 'saving' && <><i className="ri-loader-4-line animate-spin"></i> Guardando...</>}
            {saveStatus === 'saved'  && <><i className="ri-checkbox-circle-line"></i> Guardado</>}
            {(saveStatus === 'error' || saveStatus === 'idle') && <><i className="ri-save-line"></i> Guardar cambios</>}
          </button>
        </div>
      </SettingsCard>

      {/* Enlace compartible del perfil público */}
      <SettingsCard
        title="Enlace de tu perfil público"
        description="Comparte tu perfil público o en redes sociales."
      >
        <div className={`transition-opacity ${!priv.is_public ? 'opacity-40 pointer-events-none select-none' : ''}`}>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 min-w-0">
              <i className="ri-link text-zinc-400 text-sm flex-shrink-0"></i>
              <span className="text-sm text-zinc-600 dark:text-zinc-400 truncate">{shareUrl}</span>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            >
              <i className="ri-file-copy-line"></i>
              Copiar
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            {[
              { icon: 'ri-twitter-x-line', label: 'X / Twitter', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}` },
              { icon: 'ri-whatsapp-line',  label: 'WhatsApp',    href: `https://wa.me/?text=${encodeURIComponent(shareUrl)}`                   },
              { icon: 'ri-telegram-line',  label: 'Telegram',    href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`             },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className={s.icon}></i>
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {!priv.is_public && (
          <p className="text-xs text-zinc-400 mt-3">
            Activa el perfil público para obtener tu enlace compartible.
          </p>
        )}
      </SettingsCard>

      {/* Explicación del sistema de privacidad */}
      <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
        <i className="ri-information-line text-zinc-400 text-base flex-shrink-0 mt-0.5"></i>
        <div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-0.5">¿Cómo funciona la privacidad?</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Con el perfil público activado, cualquiera puede ver tu página en <span className="font-mono">/u/{profileUsername}</span>. Puedes controlar de forma granular qué información es visible: puntuaciones, reseñas y tracker son opcionales. Los cambios se aplican de inmediato al guardar.
          </p>
        </div>
      </div>

      {/* Documentos legales */}
      <SettingsCard
        title="Documentos legales"
        description="Consulta nuestras políticas y condiciones de uso en cualquier momento."
      >
        <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
          {[
            {
              to:          '/privacy',
              icon:        'ri-shield-check-line',
              iconColor:   'text-brand dark:text-brand-dark',
              iconBg:      'bg-brand/10 dark:bg-brand-dark/15',
              title:       'Política de Privacidad',
              desc:        'Cómo recopilamos, usamos y protegemos tus datos personales.',
              badge:       'Actualizado abr. 2026',
              badgeColor:  'bg-brand/10 dark:bg-brand-dark/15 text-brand dark:text-brand-dark',
            },
            {
              to:          '/terms',
              icon:        'ri-file-list-3-line',
              iconColor:   'text-amber-500',
              iconBg:      'bg-amber-50 dark:bg-amber-950/30',
              title:       'Términos de Uso',
              desc:        'Condiciones que regulan el acceso y uso de la plataforma.',
              badge:       'Versión 3.0',
              badgeColor:  'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
            },
            {
              to:          '/contact',
              icon:        'ri-customer-service-2-line',
              iconColor:   'text-sky-500',
              iconBg:      'bg-sky-50 dark:bg-sky-950/30',
              title:       'Contacto y soporte',
              desc:        'Envíanos una consulta, reporta un bug o comparte una sugerencia.',
              badge:       'Respuesta &lt; 48h',
              badgeColor:  'bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400',
            },
          ].map(item => (
            <Link
              key={item.to}
              to={item.to}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 group hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                <i className={`${item.icon} ${item.iconColor} text-base`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{item.title}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.badgeColor}`}
                    dangerouslySetInnerHTML={{ __html: item.badge }}
                  />
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">{item.desc}</p>
              </div>
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors">
                <i className="ri-external-link-line text-sm"></i>
              </div>
            </Link>
          ))}
        </div>
      </SettingsCard>
    </div>
  );
}
