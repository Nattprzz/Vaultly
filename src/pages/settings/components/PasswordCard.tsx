import SettingsCard         from './SettingsCard';
import { INPUT_BASE }       from '../hooks/useAccountSection';
import type { PasswordGroup } from '../hooks/useAccountSection';

interface Props { password: PasswordGroup }

export default function PasswordCard({ password: pw }: Props) {
  return (
    <SettingsCard title="Cambiar contraseña" description="Introduce tu contraseña actual y elige una nueva.">
      <div className="flex flex-col gap-3">

        {/* Contraseña actual */}
        <div>
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
            Contraseña actual <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${pw.currentPwError ? 'text-red-400' : 'text-zinc-400'}`}>
              <i className="ri-lock-line text-sm"></i>
            </div>
            <input
              type={pw.showCurrentPass ? 'text' : 'password'}
              value={pw.currentPassword}
              onChange={e => { pw.setCurrentPassword(e.target.value); pw.touchPw('current'); pw.clearPwError(); }}
              onBlur={() => pw.touchPw('current')}
              placeholder="Tu contraseña actual"
              autoComplete="current-password"
              className={`${INPUT_BASE} pl-10 pr-14 ${pw.getFieldClass(!!pw.currentPwError, pw.pwTouched.current && !!pw.currentPassword && !pw.currentPwError)}`}
            />
            {pw.pwTouched.current && pw.currentPassword && !pw.currentPwError && (
              <div className="absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500">
                <i className="ri-check-line text-sm"></i>
              </div>
            )}
            <button type="button" onClick={() => pw.setShowCurrentPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer">
              <i className={pw.showCurrentPass ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'}></i>
            </button>
          </div>
          {pw.currentPwError && (
            <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
              <i className="ri-error-warning-line text-xs flex-shrink-0"></i>{pw.currentPwError}
            </p>
          )}
        </div>

        {/* Nueva contraseña */}
        <div>
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
            Nueva contraseña <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${pw.newPwError ? 'text-red-400' : 'text-zinc-400'}`}>
              <i className="ri-lock-password-line text-sm"></i>
            </div>
            <input
              type={pw.showNewPass ? 'text' : 'password'}
              value={pw.newPassword}
              onChange={e => { pw.setNewPassword(e.target.value); pw.touchPw('newPw'); }}
              onBlur={() => pw.touchPw('newPw')}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              className={`${INPUT_BASE} pl-10 pr-14 ${pw.getFieldClass(!!pw.newPwError, pw.pwTouched.newPw && !pw.newPwError && pw.newPassword.length >= 8)}`}
            />
            {pw.pwTouched.newPw && !pw.newPwError && pw.newPassword.length >= 8 && (
              <div className="absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500">
                <i className="ri-check-line text-sm"></i>
              </div>
            )}
            <button type="button" onClick={() => pw.setShowNewPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer">
              <i className={pw.showNewPass ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'}></i>
            </button>
          </div>
          {pw.newPwError && (
            <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
              <i className="ri-error-warning-line text-xs flex-shrink-0"></i>{pw.newPwError}
            </p>
          )}
          {pw.newPassword.length > 0 && (
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex gap-1 flex-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= pw.pwStrength ? pw.pwStrengthColor[pw.pwStrength] : 'bg-zinc-200 dark:bg-zinc-700'}`} />
                ))}
              </div>
              <span className={`text-xs font-medium ${pw.pwStrength === 1 ? 'text-red-400' : pw.pwStrength === 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {pw.pwStrengthLabel[pw.pwStrength]}
              </span>
            </div>
          )}
        </div>

        {/* Confirmar contraseña */}
        <div>
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
            Confirmar contraseña <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${pw.confirmPwError ? 'text-red-400' : 'text-zinc-400'}`}>
              <i className="ri-shield-check-line text-sm"></i>
            </div>
            <input
              type={pw.showConfirmPass ? 'text' : 'password'}
              value={pw.confirmPassword}
              onChange={e => { pw.setConfirmPassword(e.target.value); pw.touchPw('confirm'); }}
              onBlur={() => pw.touchPw('confirm')}
              placeholder="Repite la nueva contraseña"
              autoComplete="new-password"
              className={`${INPUT_BASE} pl-10 pr-14 ${pw.getFieldClass(!!pw.confirmPwError, pw.pwTouched.confirm && !pw.confirmPwError && !!pw.confirmPassword && pw.confirmPassword === pw.newPassword)}`}
            />
            {pw.pwTouched.confirm && !pw.confirmPwError && pw.confirmPassword && pw.confirmPassword === pw.newPassword && (
              <div className="absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500">
                <i className="ri-check-line text-sm"></i>
              </div>
            )}
            <button type="button" onClick={() => pw.setShowConfirmPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer">
              <i className={pw.showConfirmPass ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'}></i>
            </button>
          </div>
          {pw.confirmPwError && (
            <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
              <i className="ri-error-warning-line text-xs flex-shrink-0"></i>{pw.confirmPwError}
            </p>
          )}
        </div>

        {pw.pwError && (
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
            <i className="ri-error-warning-line text-red-500 text-sm flex-shrink-0"></i>
            <p className="text-xs text-red-600 dark:text-red-400">{pw.pwError}</p>
          </div>
        )}

        <button
          onClick={pw.onChangePassword}
          disabled={pw.pwSaving}
          className={`self-start flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap disabled:opacity-60 ${
            pw.pwSaved ? 'bg-emerald-500 text-white' : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90'
          }`}
        >
          {pw.pwSaving ? <><i className="ri-loader-4-line animate-spin"></i> Guardando...</>
          : pw.pwSaved  ? <><i className="ri-checkbox-circle-line"></i> Contraseña actualizada</>
          :                <><i className="ri-key-2-line"></i> Cambiar contraseña</>}
        </button>
      </div>
    </SettingsCard>
  );
}
