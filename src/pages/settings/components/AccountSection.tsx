import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { supabase } from '@/lib/supabase';
import SettingsCard from './SettingsCard';

export default function AccountSection() {
  const { profile, logout, refreshProfile } = useAuth();
  const { reset } = useSettings();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [touched, setTouched] = useState({ displayName: false, username: false, bio: false });

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Avatar upload
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  // Change password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [pwTouched, setPwTouched] = useState({ current: false, newPw: false, confirm: false });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? '');
      setUsername(profile.username ?? '');
      setBio(profile.bio ?? '');
    }
  }, [profile]);

  const touch = (field: keyof typeof touched) =>
    setTouched(prev => ({ ...prev, [field]: true }));

  const displayNameError = touched.displayName && !displayName.trim() ? 'El nombre visible es obligatorio.' : '';
  const usernameError = touched.username && username.trim().length < 3 ? 'Mínimo 3 caracteres.' : '';

  const inputBase = 'w-full px-4 py-2.5 rounded-xl border text-sm text-zinc-900 dark:text-white focus:outline-none transition-all';
  const inputNormal = 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500/30';
  const inputErrorClass = 'border-rose-400 dark:border-rose-500 bg-rose-50/40 dark:bg-rose-950/10 focus:ring-2 focus:ring-rose-500/20';
  const inputSuccessClass = 'border-emerald-400 dark:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10 focus:ring-2 focus:ring-emerald-500/20';

  const getDisplayNameClass = () => {
    if (displayNameError) return inputErrorClass;
    if (touched.displayName && displayName.trim()) return inputSuccessClass;
    return inputNormal;
  };
  const getUsernameClass = () => {
    if (usernameError) return inputErrorClass;
    if (touched.username && username.trim().length >= 3) return inputSuccessClass;
    return inputNormal;
  };
  const getBioClass = () => {
    if (touched.bio && bio.trim()) return inputSuccessClass;
    return inputNormal;
  };

  const getInitials = (name: string) =>
    name.split(/[\s_-]+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');

  const handleSave = async () => {
    setTouched({ displayName: true, username: true, bio: true });
    if (!displayName.trim() || username.trim().length < 3) return;
    if (!profile) return;
    setSaving(true);
    setSaveError('');

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName.trim(),
        username: username.trim().toLowerCase().replace(/\s/g, '_'),
        bio: bio.trim(),
        initials: getInitials(displayName.trim() || username.trim()),
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id);

    setSaving(false);

    if (error) {
      setSaveError('Error al guardar. Inténtalo de nuevo.');
    } else {
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setAvatarError('');

    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('El archivo no puede superar 2 MB.');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setAvatarError('Formato no válido. Usa JPG, PNG, WEBP o GIF.');
      return;
    }

    setAvatarUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${profile.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true });

      if (uploadError) { setAvatarError('Error al subir la imagen.'); return; }

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      const urlWithCache = `${publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlWithCache, updated_at: new Date().toISOString() })
        .eq('id', profile.id);

      if (updateError) { setAvatarError('Error al guardar el avatar.'); return; }

      await refreshProfile();
    } catch {
      setAvatarError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setAvatarUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    if (!profile?.avatar_url) return;
    setAvatarUploading(true);
    try {
      const path = `${profile.id}/avatar`;
      await supabase.storage.from('avatars').remove([
        `${path}.jpg`, `${path}.jpeg`, `${path}.png`, `${path}.webp`, `${path}.gif`,
      ]);
      await supabase.from('profiles').update({ avatar_url: null, updated_at: new Date().toISOString() }).eq('id', profile.id);
      await refreshProfile();
    } catch {
      setAvatarError('Error al eliminar el avatar.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const touchPw = (field: keyof typeof pwTouched) =>
    setPwTouched(prev => ({ ...prev, [field]: true }));

  const currentPwError = pwTouched.current && !currentPassword ? 'Introduce tu contraseña actual.' : '';
  const newPwError = pwTouched.newPw
    ? !newPassword ? 'La nueva contraseña es obligatoria.'
    : newPassword.length < 8 ? 'Mínimo 8 caracteres.'
    : newPassword === currentPassword ? 'Debe ser diferente a la actual.'
    : '' : '';
  const confirmPwError = pwTouched.confirm
    ? !confirmPassword ? 'Confirma la nueva contraseña.'
    : confirmPassword !== newPassword ? 'Las contraseñas no coinciden.'
    : '' : '';

  const pwStrength = newPassword.length === 0 ? 0 : newPassword.length < 6 ? 1 : newPassword.length < 10 ? 2 : 3;
  const pwStrengthLabel = ['', 'Débil', 'Media', 'Fuerte'];
  const pwStrengthColor = ['', 'bg-rose-400', 'bg-amber-400', 'bg-emerald-400'];

  const getPwClass = (hasError: boolean, isValid: boolean) => {
    if (hasError) return inputErrorClass;
    if (isValid) return inputSuccessClass;
    return inputNormal;
  };

  const handleChangePassword = async () => {
    setPwTouched({ current: true, newPw: true, confirm: true });
    if (!currentPassword || newPwError || confirmPwError || confirmPassword !== newPassword) return;
    setPwSaving(true);
    setPwError('');
    try {
      // Re-authenticate first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) { setPwError('No se pudo verificar tu sesión.'); return; }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (signInError) { setPwError('La contraseña actual es incorrecta.'); return; }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) { setPwError(updateError.message); return; }

      setPwSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPwTouched({ current: false, newPw: false, confirm: false });
      setTimeout(() => setPwSaved(false), 3000);
    } catch {
      setPwError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setPwSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleReset = () => {
    reset();
    setShowResetConfirm(false);
  };

  const initials = profile?.initials ?? (profile?.display_name?.slice(0, 2).toUpperCase() ?? '??');

  return (
    <div className="flex flex-col gap-6">
      {/* Profile info */}
      <SettingsCard title="Información de perfil" description="Actualiza tu nombre visible, usuario y descripción pública.">
        <div className="flex flex-col gap-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0 group">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover object-top"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center text-white text-xl font-bold">
                  {initials}
                </div>
              )}
              {/* Overlay on hover */}
              <label className={`absolute inset-0 rounded-full flex items-center justify-center bg-black/50 cursor-pointer transition-opacity ${avatarUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {avatarUploading ? (
                  <i className="ri-loader-4-line text-white text-lg animate-spin"></i>
                ) : (
                  <i className="ri-camera-line text-white text-lg"></i>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  onChange={handleAvatarChange}
                  disabled={avatarUploading}
                />
              </label>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">{profile?.display_name ?? '—'}</p>
              <p className="text-xs text-zinc-500">@{profile?.username ?? profile?.email}</p>
              <p className="text-xs text-zinc-400">{profile?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <label className="flex items-center gap-1.5 text-xs text-violet-500 font-medium cursor-pointer hover:text-violet-600 transition-colors whitespace-nowrap">
                  <i className="ri-upload-2-line text-xs"></i>
                  Cambiar foto
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="sr-only"
                    onChange={handleAvatarChange}
                    disabled={avatarUploading}
                  />
                </label>
                {profile?.avatar_url && (
                  <>
                    <span className="text-zinc-300 dark:text-zinc-600">·</span>
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      disabled={avatarUploading}
                      className="text-xs text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </div>
              {avatarError && (
                <p className="flex items-center gap-1 text-xs text-rose-500 mt-0.5">
                  <i className="ri-error-warning-line text-xs"></i>{avatarError}
                </p>
              )}
              <p className="text-xs text-zinc-400">JPG, PNG, WEBP o GIF · Máx. 2 MB</p>
            </div>
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
                Nombre visible <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  value={displayName}
                  onChange={e => { setDisplayName(e.target.value); touch('displayName'); }}
                  onBlur={() => touch('displayName')}
                  placeholder="Tu nombre público"
                  className={`${inputBase} ${getDisplayNameClass()} pr-9`}
                />
                {touched.displayName && displayName.trim() && !displayNameError && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500">
                    <i className="ri-check-line text-sm"></i>
                  </div>
                )}
              </div>
              {displayNameError && (
                <p className="flex items-center gap-1.5 text-xs text-rose-500 mt-1">
                  <i className="ri-error-warning-line text-xs flex-shrink-0"></i>
                  {displayNameError}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
                Nombre de usuario <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">@</span>
                <input
                  value={username}
                  onChange={e => { setUsername(e.target.value.toLowerCase().replace(/\s/g, '_')); touch('username'); }}
                  onBlur={() => touch('username')}
                  placeholder="tu_usuario"
                  className={`${inputBase} pl-8 ${getUsernameClass()} pr-9`}
                />
                {touched.username && username.trim().length >= 3 && !usernameError && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500">
                    <i className="ri-check-line text-sm"></i>
                  </div>
                )}
              </div>
              {usernameError && (
                <p className="flex items-center gap-1.5 text-xs text-rose-500 mt-1">
                  <i className="ri-error-warning-line text-xs flex-shrink-0"></i>
                  {usernameError}
                </p>
              )}
              <p className="text-xs text-zinc-400 mt-1">
                Tu perfil público estará en <span className="font-mono text-zinc-600 dark:text-zinc-300">/u/{username || 'tu_usuario'}</span>
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
                Biografía
              </label>
              <textarea
                value={bio}
                onChange={e => { setBio(e.target.value.slice(0, 200)); touch('bio'); }}
                onBlur={() => touch('bio')}
                rows={3}
                placeholder="Cuéntanos algo sobre ti..."
                className={`${inputBase} ${getBioClass()} resize-none`}
              />
              <p className="text-right text-xs text-zinc-400 mt-1">{bio.length}/200</p>
            </div>
          </div>

          {saveError && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
              <i className="ri-error-warning-line text-rose-500 text-sm flex-shrink-0"></i>
              <p className="text-xs text-rose-600 dark:text-rose-400">{saveError}</p>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className={`self-start flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap disabled:opacity-60 ${
              saved
                ? 'bg-emerald-500 text-white'
                : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90'
            }`}
          >
            {saving ? (
              <><i className="ri-loader-4-line animate-spin"></i> Guardando...</>
            ) : saved ? (
              <><i className="ri-checkbox-circle-line"></i> Guardado</>
            ) : (
              <><i className="ri-save-line"></i> Guardar cambios</>
            )}
          </button>
        </div>
      </SettingsCard>

      {/* Change password */}
      <SettingsCard title="Cambiar contraseña" description="Introduce tu contraseña actual y elige una nueva.">
        <div className="flex flex-col gap-3">
          {/* Current password */}
          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
              Contraseña actual <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${currentPwError ? 'text-rose-400' : 'text-zinc-400'}`}>
                <i className="ri-lock-line text-sm"></i>
              </div>
              <input
                type={showCurrentPass ? 'text' : 'password'}
                value={currentPassword}
                onChange={e => { setCurrentPassword(e.target.value); touchPw('current'); setPwError(''); }}
                onBlur={() => touchPw('current')}
                placeholder="Tu contraseña actual"
                autoComplete="current-password"
                className={`${inputBase} pl-10 pr-14 ${getPwClass(!!currentPwError, pwTouched.current && !!currentPassword && !currentPwError)}`}
              />
              {pwTouched.current && currentPassword && !currentPwError && (
                <div className="absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500">
                  <i className="ri-check-line text-sm"></i>
                </div>
              )}
              <button type="button" onClick={() => setShowCurrentPass(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer">
                <i className={showCurrentPass ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'}></i>
              </button>
            </div>
            {currentPwError && (
              <p className="flex items-center gap-1.5 text-xs text-rose-500 mt-1">
                <i className="ri-error-warning-line text-xs flex-shrink-0"></i>{currentPwError}
              </p>
            )}
          </div>

          {/* New password */}
          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
              Nueva contraseña <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${newPwError ? 'text-rose-400' : 'text-zinc-400'}`}>
                <i className="ri-lock-password-line text-sm"></i>
              </div>
              <input
                type={showNewPass ? 'text' : 'password'}
                value={newPassword}
                onChange={e => { setNewPassword(e.target.value); touchPw('newPw'); }}
                onBlur={() => touchPw('newPw')}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                className={`${inputBase} pl-10 pr-14 ${getPwClass(!!newPwError, pwTouched.newPw && !newPwError && newPassword.length >= 8)}`}
              />
              {pwTouched.newPw && !newPwError && newPassword.length >= 8 && (
                <div className="absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500">
                  <i className="ri-check-line text-sm"></i>
                </div>
              )}
              <button type="button" onClick={() => setShowNewPass(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer">
                <i className={showNewPass ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'}></i>
              </button>
            </div>
            {newPwError && (
              <p className="flex items-center gap-1.5 text-xs text-rose-500 mt-1">
                <i className="ri-error-warning-line text-xs flex-shrink-0"></i>{newPwError}
              </p>
            )}
            {newPassword.length > 0 && (
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex gap-1 flex-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= pwStrength ? pwStrengthColor[pwStrength] : 'bg-zinc-200 dark:bg-zinc-700'}`} />
                  ))}
                </div>
                <span className={`text-xs font-medium ${pwStrength === 1 ? 'text-rose-400' : pwStrength === 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {pwStrengthLabel[pwStrength]}
                </span>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
              Confirmar contraseña <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${confirmPwError ? 'text-rose-400' : 'text-zinc-400'}`}>
                <i className="ri-shield-check-line text-sm"></i>
              </div>
              <input
                type={showConfirmPass ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); touchPw('confirm'); }}
                onBlur={() => touchPw('confirm')}
                placeholder="Repite la nueva contraseña"
                autoComplete="new-password"
                className={`${inputBase} pl-10 pr-14 ${getPwClass(!!confirmPwError, pwTouched.confirm && !confirmPwError && !!confirmPassword && confirmPassword === newPassword)}`}
              />
              {pwTouched.confirm && !confirmPwError && confirmPassword && confirmPassword === newPassword && (
                <div className="absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500">
                  <i className="ri-check-line text-sm"></i>
                </div>
              )}
              <button type="button" onClick={() => setShowConfirmPass(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer">
                <i className={showConfirmPass ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'}></i>
              </button>
            </div>
            {confirmPwError && (
              <p className="flex items-center gap-1.5 text-xs text-rose-500 mt-1">
                <i className="ri-error-warning-line text-xs flex-shrink-0"></i>{confirmPwError}
              </p>
            )}
          </div>

          {pwError && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
              <i className="ri-error-warning-line text-rose-500 text-sm flex-shrink-0"></i>
              <p className="text-xs text-rose-600 dark:text-rose-400">{pwError}</p>
            </div>
          )}

          <button
            onClick={handleChangePassword}
            disabled={pwSaving}
            className={`self-start flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap disabled:opacity-60 ${
              pwSaved ? 'bg-emerald-500 text-white' : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90'
            }`}
          >
            {pwSaving ? (
              <><i className="ri-loader-4-line animate-spin"></i> Guardando...</>
            ) : pwSaved ? (
              <><i className="ri-checkbox-circle-line"></i> Contraseña actualizada</>
            ) : (
              <><i className="ri-key-2-line"></i> Cambiar contraseña</>
            )}
          </button>
        </div>
      </SettingsCard>

      {/* Session */}
      <SettingsCard title="Sesión activa">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
              <i className="ri-computer-line text-zinc-500"></i>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">Navegador web</p>
              <p className="text-xs text-zinc-500">Sesión actual · Activa ahora</p>
            </div>
          </div>
          {!showLogoutConfirm ? (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-logout-box-line"></i>
              Cerrar sesión
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => setShowLogoutConfirm(false)} className="px-3 py-2 text-sm text-zinc-500 cursor-pointer whitespace-nowrap">
                Cancelar
              </button>
              <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-rose-500 text-white text-sm font-semibold cursor-pointer whitespace-nowrap">
                Confirmar
              </button>
            </div>
          )}
        </div>
      </SettingsCard>

      {/* Danger zone */}
      <SettingsCard title="Zona de peligro">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900">
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">Restablecer configuración</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Vuelve a los ajustes predeterminados de la app.</p>
            </div>
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 rounded-xl border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-colors cursor-pointer whitespace-nowrap"
              >
                Restablecer
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => setShowResetConfirm(false)} className="px-3 py-2 text-sm text-zinc-500 cursor-pointer whitespace-nowrap">Cancelar</button>
                <button onClick={handleReset} className="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold cursor-pointer whitespace-nowrap">Confirmar</button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900">
            <div>
              <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">Eliminar cuenta</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Esta acción es irreversible. Se borrarán todos tus datos.</p>
            </div>
            <button className="px-4 py-2 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-sm font-medium hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors cursor-pointer whitespace-nowrap">
              Eliminar
            </button>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
