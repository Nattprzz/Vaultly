import { useState } from 'react';
import SettingsCard                         from './SettingsCard';
import { INPUT_BASE, INPUT_NORMAL }         from '../hooks/useAccountSection';
import type { ProfileGroup }                from '../hooks/useAccountSection';

interface Props { profile: ProfileGroup }

export default function ProfileFormCard({ profile: p }: Props) {
  const [backdropError, setBackdropError] = useState(false);
  return (
    <SettingsCard title="Información de perfil" description="Actualiza tu nombre visible, usuario y descripción pública.">
      <div className="flex flex-col gap-4">

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0 group">
            {p.data?.avatar_url ? (
              <img src={p.data.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full object-cover object-top" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-brand dark:bg-brand-dark flex items-center justify-center text-white text-xl font-bold">
                {p.initials}
              </div>
            )}
            <label className={`absolute inset-0 rounded-full flex items-center justify-center bg-black/50 cursor-pointer transition-opacity ${p.avatarUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              {p.avatarUploading
                ? <i className="ri-loader-4-line text-white text-lg animate-spin"></i>
                : <i className="ri-camera-line text-white text-lg"></i>
              }
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={p.onAvatarChange} disabled={p.avatarUploading} />
            </label>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">{p.data?.display_name ?? '—'}</p>
            <p className="text-xs text-zinc-500">@{p.data?.username ?? p.data?.email}</p>
            <p className="text-xs text-zinc-400">{p.data?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <label className="flex items-center gap-1.5 text-xs text-brand dark:text-brand-dark font-medium cursor-pointer hover:text-brand-hover dark:hover:text-brand-dark-hover transition-colors whitespace-nowrap">
                <i className="ri-upload-2-line text-xs"></i>
                Cambiar foto
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={p.onAvatarChange} disabled={p.avatarUploading} />
              </label>
              {p.data?.avatar_url && (
                <>
                  <span className="text-zinc-300 dark:text-zinc-600">·</span>
                  <button type="button" onClick={p.onRemoveAvatar} disabled={p.avatarUploading} className="text-xs text-zinc-400 hover:text-red-500 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50">
                    Eliminar
                  </button>
                </>
              )}
            </div>
            {p.avatarError && (
              <p className="flex items-center gap-1 text-xs text-red-500 mt-0.5">
                <i className="ri-error-warning-line text-xs"></i>{p.avatarError}
              </p>
            )}
            <p className="text-xs text-zinc-400">JPG, PNG, WEBP o GIF · Máx. 2 MB</p>
          </div>
        </div>

        {/* Campos de texto */}
        <div className="flex flex-col gap-3">
          {/* Nombre visible */}
          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
              Nombre visible <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                value={p.displayName}
                onChange={e => { p.setDisplayName(e.target.value); p.touch('displayName'); }}
                onBlur={() => p.touch('displayName')}
                placeholder="Tu nombre público"
                className={`${INPUT_BASE} ${p.getFieldClass('displayName')} pr-9`}
              />
              {p.touched.displayName && p.displayName.trim() && !p.displayNameError && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500">
                  <i className="ri-check-line text-sm"></i>
                </div>
              )}
            </div>
            {p.displayNameError && (
              <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                <i className="ri-error-warning-line text-xs flex-shrink-0"></i>
                {p.displayNameError}
              </p>
            )}
          </div>

          {/* Nombre de usuario */}
          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
              Nombre de usuario <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">@</span>
              <input
                value={p.username}
                onChange={e => { p.setUsername(e.target.value.toLowerCase().replace(/\s/g, '_')); p.touch('username'); }}
                onBlur={() => p.touch('username')}
                placeholder="tu_usuario"
                className={`${INPUT_BASE} pl-8 ${p.getFieldClass('username')} pr-9`}
              />
              {p.touched.username && p.username.trim().length >= 3 && !p.usernameError && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500">
                  <i className="ri-check-line text-sm"></i>
                </div>
              )}
            </div>
            {p.usernameError && (
              <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                <i className="ri-error-warning-line text-xs flex-shrink-0"></i>
                {p.usernameError}
              </p>
            )}
            <p className="text-xs text-zinc-400 mt-1">
              Tu perfil público estará en{' '}
              <span className="font-mono text-zinc-600 dark:text-zinc-300">/u/{p.username || 'tu_usuario'}</span>
            </p>
          </div>

          {/* Biografía */}
          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
              Biografía
            </label>
            <textarea
              value={p.bio}
              onChange={e => { p.setBio(e.target.value.slice(0, 500)); p.touch('bio'); }}
              onBlur={() => p.touch('bio')}
              rows={5}
              placeholder="Cuéntanos algo sobre ti..."
              className={`${INPUT_BASE} ${p.getFieldClass('bio')} resize-none`}
            />
            <p className="text-right text-xs text-zinc-400 mt-1">{p.bio.length}/500</p>
          </div>

          {/* Imagen de portada */}
          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
              Imagen de portada <span className="font-normal normal-case text-zinc-400">(URL)</span>
            </label>
            <input
              type="url"
              value={p.backdropUrl}
              onChange={e => { setBackdropError(false); p.setBackdropUrl(e.target.value); }}
              placeholder="https://ejemplo.com/portada.jpg"
              className={`${INPUT_BASE} ${INPUT_NORMAL}`}
            />
            <p className="text-xs text-zinc-400 mt-1">
              Se mostrará como fondo en la cabecera de tu perfil. Usa una imagen apaisada (mín. 1400 × 400 px).
            </p>
            {p.backdropUrl && (
              <div className="mt-2 w-full h-28 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                {backdropError ? (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                    <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                      <i className="ri-image-line"></i>
                      No se puede cargar la imagen
                    </span>
                  </div>
                ) : (
                  <img
                    src={p.backdropUrl}
                    alt="Preview portada"
                    className="w-full h-full object-cover"
                    onError={() => setBackdropError(true)}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {p.saveError && (
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
            <i className="ri-error-warning-line text-red-500 text-sm flex-shrink-0"></i>
            <p className="text-xs text-red-600 dark:text-red-400">{p.saveError}</p>
          </div>
        )}

        <button
          onClick={p.onSave}
          disabled={p.saving}
          className={`self-start flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap disabled:opacity-60 ${
            p.saved
              ? 'bg-emerald-500 text-white'
              : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90'
          }`}
        >
          {p.saving  ? <><i className="ri-loader-4-line animate-spin"></i> Guardando...</>
          : p.saved   ? <><i className="ri-checkbox-circle-line"></i> Guardado</>
          :              <><i className="ri-save-line"></i> Guardar cambios</>}
        </button>
      </div>
    </SettingsCard>
  );
}
