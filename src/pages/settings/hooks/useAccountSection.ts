/**
 * useAccountSection.ts — lógica de estado para la sección de cuenta.
 *
 * Centraliza todos los estados, efectos y handlers de AccountSection.tsx,
 * devolviendo grupos tipados (profile, password, session, danger) que se
 * pasan directamente a cada subcomponente sin prop-drilling manual.
 */

import { useState, useEffect }         from 'react';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useNavigate }                 from 'react-router-dom';
import { useAuth }                     from '@/hooks/useAuth';
import type { AuthProfile }            from '@/hooks/useAuth';
import { useSettings }                 from '@/hooks/useSettings';
import { supabase }                    from '@/lib/supabase';

// ─── Constantes de clases de inputs ──────────────────────────────────────────
// Compartidas entre ProfileFormCard y PasswordCard.

export const INPUT_BASE    = 'w-full px-4 py-2.5 rounded-xl border text-sm text-zinc-900 dark:text-white focus:outline-none transition-all';
export const INPUT_NORMAL  = 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-brand/30';
export const INPUT_ERROR   = 'border-red-400 dark:border-red-500 bg-red-50/40 dark:bg-red-950/10 focus:ring-2 focus:ring-red-500/20';
export const INPUT_SUCCESS = 'border-emerald-400 dark:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10 focus:ring-2 focus:ring-emerald-500/20';

// ─── Helper privado ───────────────────────────────────────────────────────────

function computeInitials(name: string): string {
  return name.split(/[\s_-]+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}

// ─── Tipos de los grupos ──────────────────────────────────────────────────────

type ProfileTouched  = { displayName: boolean; username: boolean; bio: boolean; backdropUrl: boolean };
type PasswordTouched = { current: boolean; newPw: boolean; confirm: boolean };
type ProfileField    = 'displayName' | 'username' | 'bio' | 'backdropUrl';
type PasswordField   = keyof PasswordTouched;

export interface ProfileGroup {
  data:             AuthProfile | null;
  displayName:      string;
  username:         string;
  bio:              string;
  backdropUrl:      string;
  touched:          ProfileTouched;
  saving:           boolean;
  saved:            boolean;
  saveError:        string;
  displayNameError: string;
  usernameError:    string;
  initials:         string;
  avatarUploading:  boolean;
  avatarError:      string;
  setDisplayName(v: string): void;
  setUsername(v: string): void;
  setBio(v: string): void;
  setBackdropUrl(v: string): void;
  touch(f: ProfileField): void;
  getFieldClass(f: ProfileField): string;
  onSave(): void;
  onAvatarChange(e: ChangeEvent<HTMLInputElement>): void;
  onRemoveAvatar(): void;
}

export interface PasswordGroup {
  currentPassword:  string;
  newPassword:      string;
  confirmPassword:  string;
  showCurrentPass:  boolean;
  showNewPass:      boolean;
  showConfirmPass:  boolean;
  pwTouched:        PasswordTouched;
  pwSaving:         boolean;
  pwSaved:          boolean;
  pwError:          string;
  currentPwError:   string;
  newPwError:       string;
  confirmPwError:   string;
  pwStrength:       number;
  pwStrengthLabel:  string[];
  pwStrengthColor:  string[];
  setCurrentPassword(v: string): void;
  setNewPassword(v: string): void;
  setConfirmPassword(v: string): void;
  setShowCurrentPass: Dispatch<SetStateAction<boolean>>;
  setShowNewPass:     Dispatch<SetStateAction<boolean>>;
  setShowConfirmPass: Dispatch<SetStateAction<boolean>>;
  touchPw(f: PasswordField): void;
  clearPwError(): void;
  getFieldClass(hasError: boolean, isValid: boolean): string;
  onChangePassword(): void;
}

export interface SessionGroup {
  showLogoutConfirm: boolean;
  setShowLogoutConfirm(v: boolean): void;
  onLogout(): void;
}

export interface DangerGroup {
  showResetConfirm:   boolean;
  showDeleteNotice:   boolean;
  setShowResetConfirm(v: boolean): void;
  setShowDeleteNotice(v: boolean): void;
  onReset(): void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAccountSection(): {
  profile:  ProfileGroup;
  password: PasswordGroup;
  session:  SessionGroup;
  danger:   DangerGroup;
} {
  const { profile, logout, refreshProfile } = useAuth();
  const { reset }                           = useSettings();
  const navigate                            = useNavigate();

  // ── Estado: perfil ───────────────────────────────────────────────────────

  const [displayName,  setDisplayName]  = useState('');
  const [username,     setUsername]     = useState('');
  const [bio,          setBio]          = useState('');
  const [backdropUrl,  setBackdropUrl]  = useState('');
  const [saving,       setSaving]       = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [saveError,    setSaveError]    = useState('');
  const [touched, setTouched]           = useState<ProfileTouched>({ displayName: false, username: false, bio: false, backdropUrl: false });

  // ── Estado: avatar ───────────────────────────────────────────────────────

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError,     setAvatarError]     = useState('');

  // ── Estado: contraseña ───────────────────────────────────────────────────

  const [currentPassword,  setCurrentPassword]  = useState('');
  const [newPassword,      setNewPassword]       = useState('');
  const [confirmPassword,  setConfirmPassword]   = useState('');
  const [showCurrentPass,  setShowCurrentPass]   = useState(false);
  const [showNewPass,      setShowNewPass]       = useState(false);
  const [showConfirmPass,  setShowConfirmPass]   = useState(false);
  const [pwTouched, setPwTouched]                = useState<PasswordTouched>({ current: false, newPw: false, confirm: false });
  const [pwSaving,  setPwSaving]                 = useState(false);
  const [pwSaved,   setPwSaved]                  = useState(false);
  const [pwError,   setPwError]                  = useState('');

  // ── Estado: sesión / zona peligro ────────────────────────────────────────

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showResetConfirm,  setShowResetConfirm]  = useState(false);
  const [showDeleteNotice,  setShowDeleteNotice]  = useState(false);

  // ── Efectos ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? '');
      setUsername(profile.username ?? '');
      setBio(profile.bio ?? '');
      setBackdropUrl(profile.backdrop_url ?? '');
    }
  }, [profile]);

  // ── Derivados: perfil ────────────────────────────────────────────────────

  const touch   = (f: ProfileField)  => setTouched  (prev => ({ ...prev, [f]: true }));
  const touchPw = (f: PasswordField) => setPwTouched(prev => ({ ...prev, [f]: true }));

  const displayNameError = touched.displayName && !displayName.trim()       ? 'El nombre visible es obligatorio.' : '';
  const usernameError    = touched.username    && username.trim().length < 3 ? 'Mínimo 3 caracteres.'             : '';
  const initials         = profile?.initials ?? (profile?.display_name?.slice(0, 2).toUpperCase() ?? '??');

  function getProfileFieldClass(f: ProfileField): string {
    if (f === 'displayName') {
      if (displayNameError)                                return INPUT_ERROR;
      if (touched.displayName && displayName.trim())       return INPUT_SUCCESS;
    } else if (f === 'username') {
      if (usernameError)                                   return INPUT_ERROR;
      if (touched.username && username.trim().length >= 3) return INPUT_SUCCESS;
    } else {
      if (touched.bio && bio.trim())                       return INPUT_SUCCESS;
    }
    return INPUT_NORMAL;
  }

  // ── Derivados: contraseña ────────────────────────────────────────────────

  const currentPwError = pwTouched.current && !currentPassword ? 'Introduce tu contraseña actual.' : '';
  const newPwError     = pwTouched.newPw
    ? !newPassword           ? 'La nueva contraseña es obligatoria.'
    : newPassword.length < 8 ? 'Mínimo 8 caracteres.'
    : newPassword === currentPassword ? 'Debe ser diferente a la actual.'
    : '' : '';
  const confirmPwError = pwTouched.confirm
    ? !confirmPassword                ? 'Confirma la nueva contraseña.'
    : confirmPassword !== newPassword ? 'Las contraseñas no coinciden.'
    : '' : '';

  const pwStrength      = newPassword.length === 0 ? 0 : newPassword.length < 6 ? 1 : newPassword.length < 10 ? 2 : 3;
  const pwStrengthLabel = ['', 'Débil', 'Media', 'Fuerte'];
  const pwStrengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-emerald-400'];

  function getPwFieldClass(hasError: boolean, isValid: boolean): string {
    if (hasError) return INPUT_ERROR;
    if (isValid)  return INPUT_SUCCESS;
    return INPUT_NORMAL;
  }

  // ── Handlers: perfil ─────────────────────────────────────────────────────

  const handleSave = async () => {
    setTouched({ displayName: true, username: true, bio: true, backdropUrl: true });
    if (!displayName.trim() || username.trim().length < 3 || !profile) return;
    setSaving(true);
    setSaveError('');

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName.trim(),
        username:     username.trim().toLowerCase().replace(/\s/g, '_'),
        bio:          bio.trim(),
        backdrop_url: backdropUrl.trim() || null,
        initials:     computeInitials(displayName.trim() || username.trim()),
        updated_at:   new Date().toISOString(),
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

  // ── Handlers: avatar ─────────────────────────────────────────────────────

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setAvatarError('');

    if (file.size > 2 * 1024 * 1024) { setAvatarError('El archivo no puede superar 2 MB.'); return; }
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setAvatarError('Formato no válido. Usa JPG, PNG, WEBP o GIF.');
      return;
    }

    setAvatarUploading(true);
    try {
      const ext  = file.name.split('.').pop();
      const path = `${profile.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
      if (uploadError) { setAvatarError('Error al subir la imagen.'); return; }

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      const { error: updateError }  = await supabase
        .from('profiles')
        .update({ avatar_url: `${publicUrl}?t=${Date.now()}`, updated_at: new Date().toISOString() })
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
      const base = `${profile.id}/avatar`;
      await supabase.storage.from('avatars').remove(
        [`${base}.jpg`, `${base}.jpeg`, `${base}.png`, `${base}.webp`, `${base}.gif`],
      );
      await supabase
        .from('profiles')
        .update({ avatar_url: null, updated_at: new Date().toISOString() })
        .eq('id', profile.id);
      await refreshProfile();
    } catch {
      setAvatarError('Error al eliminar el avatar.');
    } finally {
      setAvatarUploading(false);
    }
  };

  // ── Handlers: contraseña ─────────────────────────────────────────────────

  /**
   * Valida el formulario de contraseña contra los valores actuales, sin depender
   * de los derivados `*PwError` que están condicionados a `pwTouched`.
   */
  function passwordFormIsValid(): boolean {
    if (!currentPassword)                              return false;
    if (!newPassword || newPassword.length < 8)        return false;
    if (newPassword === currentPassword)               return false;
    if (!confirmPassword || confirmPassword !== newPassword) return false;
    return true;
  }

  const handleChangePassword = async () => {
    // Marcar como tocados para mostrar los mensajes de error en la UI
    setPwTouched({ current: true, newPw: true, confirm: true });
    // Validar directamente contra los valores actuales (no contra derivados de estado)
    if (!passwordFormIsValid()) return;
    setPwSaving(true);
    setPwError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) { setPwError('No se pudo verificar tu sesión.'); return; }

      const { error: signInError } = await supabase.auth.signInWithPassword({ email: user.email, password: currentPassword });
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

  // ── Handlers: sesión / zona peligro ──────────────────────────────────────

  const handleLogout = async () => { await logout(); navigate('/'); };
  const handleReset  = () => { reset(); setShowResetConfirm(false); };

  // ── Return ───────────────────────────────────────────────────────────────

  return {
    profile: {
      data: profile,
      displayName, username, bio, backdropUrl, touched,
      saving, saved, saveError,
      displayNameError, usernameError, initials,
      avatarUploading, avatarError,
      setDisplayName, setUsername, setBio, setBackdropUrl,
      touch,
      getFieldClass:  getProfileFieldClass,
      onSave:         handleSave,
      onAvatarChange: handleAvatarChange,
      onRemoveAvatar: handleRemoveAvatar,
    },
    password: {
      currentPassword, newPassword, confirmPassword,
      showCurrentPass, showNewPass, showConfirmPass,
      pwTouched, pwSaving, pwSaved, pwError,
      currentPwError, newPwError, confirmPwError,
      pwStrength, pwStrengthLabel, pwStrengthColor,
      setCurrentPassword, setNewPassword, setConfirmPassword,
      setShowCurrentPass, setShowNewPass, setShowConfirmPass,
      touchPw,
      clearPwError:     () => setPwError(''),
      getFieldClass:    getPwFieldClass,
      onChangePassword: handleChangePassword,
    },
    session: {
      showLogoutConfirm,
      setShowLogoutConfirm,
      onLogout: handleLogout,
    },
    danger: {
      showResetConfirm,  setShowResetConfirm,
      showDeleteNotice,  setShowDeleteNotice,
      onReset: handleReset,
    },
  };
}
