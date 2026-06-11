import { useState } from 'react';
import { usePublicTracker } from '@/hooks/usePublicTracker';
import type { PublicPrivacyFlags } from '@/types/privacy';

interface Props {
  username: string;
  userId: string | null;
  displayName: string;
  initials: string;
  privacy: PublicPrivacyFlags;
}

export default function PublicProfileHero({ username, userId, displayName, initials, privacy }: Props) {
  const [copied, setCopied] = useState(false);
  const { entries, hidden } = usePublicTracker(userId, privacy);

  const completed = privacy.show_item_status === false ? '—' : entries.filter(e => e.status === 'completed').length;
  const rated = entries.filter(e => e.rating !== null);
  const avgRating = rated.length > 0
    ? (rated.reduce((s, e) => s + (e.rating ?? 0), 0) / rated.length).toFixed(1)
    : '—';
  const reviews = privacy.show_reviews ? entries.filter(e => e.review && e.review.trim().length > 0).length : '—';

  const trackerCountDisplay = hidden ? 'â€”' : entries.length;
  const completedDisplay = hidden ? 'â€”' : completed;
  const avgRatingDisplay = hidden ? 'â€”' : avgRating;
  const reviewsDisplay = hidden ? 'â€”' : reviews;

  const profileUrl = `${window.location.origin}/u/${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Banner */}
      <div className="relative w-full h-52 md:h-72 overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=abstract%20dark%20cinematic%20gradient%20background%20bokeh%20lights%20moody%20atmosphere%20deep%20dark%20tones%20artistic%20photography%20ultra%20wide%20panoramic%20minimal&width=1400&height=400&seq=pub-profile-banner-01&orientation=landscape"
          alt="Banner de perfil"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 via-transparent to-transparent"></div>
      </div>

      {/* Profile info */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-end gap-5">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-brand dark:bg-brand-dark flex items-center justify-center text-white text-3xl font-black border-4 border-zinc-50 dark:border-zinc-950 flex-shrink-0">
              {initials}
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {displayName}
                </h1>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <i className="ri-global-line text-xs"></i>
                  Perfil público
                </span>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">@{username}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pb-1">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                copied
                  ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <i className={copied ? 'ri-checkbox-circle-line' : 'ri-link'}></i>
              {copied ? 'Copiado' : 'Copiar enlace'}
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          {[
            { label: 'En tracker', value: trackerCountDisplay, icon: 'ri-stack-line', color: 'text-brand dark:text-brand-dark' },
            { label: 'Completados', value: completedDisplay, icon: 'ri-checkbox-circle-line', color: 'text-emerald-500' },
            { label: 'Puntuación media', value: avgRating, icon: 'ri-star-line', color: 'text-amber-500' },
            { label: 'Reseñas', value: reviews, icon: 'ri-quill-pen-line', color: 'text-brand dark:text-brand-dark' },
          ].map(stat => ({
            ...stat,
            value: stat.icon === 'ri-star-line'
              ? avgRatingDisplay
              : stat.icon === 'ri-quill-pen-line'
                ? reviewsDisplay
                : stat.value,
          })).map(stat => (
            <div key={stat.label} className="flex items-center gap-2">
              <i className={`${stat.icon} ${stat.color} text-lg`}></i>
              <div>
                <span className="text-lg font-black text-zinc-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stat.value}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1.5">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
