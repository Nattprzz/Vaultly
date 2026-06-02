import { useEffect } from 'react';

interface Props {
  username: string;
  displayName: string;
  profileUrl: string;
  onClose: () => void;
}

const SHARE_OPTIONS = [
  { id: 'twitter', label: 'X / Twitter', icon: 'ri-twitter-x-line', color: '#000000', getUrl: (url: string, name: string) => `https://twitter.com/intent/tweet?text=Echa%20un%20vistazo%20a%20mi%20vault%20en%20Vaultly%20%F0%9F%8E%AE%F0%9F%8E%AC%F0%9F%93%9A&url=${encodeURIComponent(url)}&via=vaultlyapp` },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'ri-whatsapp-line', color: '#25D366', getUrl: (url: string, name: string) => `https://wa.me/?text=Mira%20mi%20tracker%20personal%20en%20Vaultly%3A%20${encodeURIComponent(url)}` },
  { id: 'telegram', label: 'Telegram', icon: 'ri-telegram-line', color: '#2AABEE', getUrl: (url: string, name: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=Mi%20vault%20en%20Vaultly` },
  { id: 'reddit', label: 'Reddit', icon: 'ri-reddit-line', color: '#FF4500', getUrl: (url: string, name: string) => `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=Mi%20tracker%20en%20Vaultly` },
];

export default function ShareModal({ username, displayName, profileUrl, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleCopy = () => navigator.clipboard.writeText(profileUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white">Compartir perfil</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Comparte tu vault con el mundo</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
            <i className="ri-close-line"></i>
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Profile preview card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">{displayName}</p>
              <p className="text-xs text-zinc-500">@{username} · Vaultly</p>
            </div>
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-rose-500 flex-shrink-0">
              <i className="ri-archive-2-line text-white text-sm"></i>
            </div>
          </div>

          {/* URL copy */}
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Enlace directo</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                <i className="ri-link text-zinc-400 text-sm flex-shrink-0"></i>
                <span className="text-xs text-zinc-600 dark:text-zinc-400 truncate">{profileUrl}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
              >
                <i className="ri-file-copy-line"></i>
                Copiar
              </button>
            </div>
          </div>

          {/* Social share */}
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Compartir en redes</p>
            <div className="grid grid-cols-2 gap-2">
              {SHARE_OPTIONS.map(opt => (
                <a
                  key={opt.id}
                  href={opt.getUrl(profileUrl, displayName)}
                  target="_blank"
                  rel="nofollow noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <i className={`${opt.icon} text-lg`} style={{ color: opt.color }}></i>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{opt.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Tracker share note */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900">
            <i className="ri-information-line text-violet-500 text-sm mt-0.5 flex-shrink-0"></i>
            <p className="text-xs text-violet-700 dark:text-violet-400">
              Quien visite tu perfil podrá ver tu tracker completo, estadísticas y reseñas públicas. Puedes cambiar la visibilidad en <strong>Configuración → Privacidad</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
