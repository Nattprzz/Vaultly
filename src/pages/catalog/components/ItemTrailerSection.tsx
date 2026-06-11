import { useState } from 'react';

interface Props {
  trailerKey: string;
  title: string;
}

export default function ItemTrailerSection({ trailerKey, title }: Props) {
  const [playing, setPlaying] = useState(false);

  const thumbHd  = `https://img.youtube.com/vi/${trailerKey}/maxresdefault.jpg`;
  const thumbFb  = `https://img.youtube.com/vi/${trailerKey}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-5">Tráiler oficial</h2>

      <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900">
        {playing ? (
          <iframe
            src={embedUrl}
            title={`Tráiler de ${title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="relative w-full h-full group cursor-pointer block"
            aria-label={`Reproducir tráiler de ${title}`}
          >
            <img
              src={thumbHd}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover"
              onError={e => { (e.currentTarget as HTMLImageElement).src = thumbFb; }}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-600 group-hover:bg-red-500 group-hover:scale-110 transition-all shadow-2xl">
                <i className="ri-play-fill text-3xl text-white ml-1"></i>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
              <span className="w-3 h-2 bg-red-600 rounded-sm inline-block"></span>
              <span className="text-white text-xs font-bold tracking-wide">YouTube</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
