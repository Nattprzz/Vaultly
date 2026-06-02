import { useState } from 'react';
import type { GalleryImage } from '@/mocks/itemDetail';

interface Props {
  gallery: GalleryImage[];
  title: string;
}

export default function ItemGallery({ gallery, title }: Props) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!gallery || gallery.length === 0) return null;

  return (
    <>
      <div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Galería</h2>

        {/* Main image */}
        <div
          className="relative w-full aspect-video rounded-2xl overflow-hidden mb-3 cursor-zoom-in group"
          onClick={() => setLightbox(true)}
        >
          <img
            src={gallery[active].url}
            alt={gallery[active].caption}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <p className="text-white text-sm font-medium">{gallery[active].caption}</p>
          </div>
          <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <i className="ri-fullscreen-line text-sm"></i>
          </div>
          {/* Nav arrows */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); setActive(i => (i - 1 + gallery.length) % gallery.length); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors cursor-pointer"
              >
                <i className="ri-arrow-left-s-line"></i>
              </button>
              <button
                onClick={e => { e.stopPropagation(); setActive(i => (i + 1) % gallery.length); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors cursor-pointer"
              >
                <i className="ri-arrow-right-s-line"></i>
              </button>
            </>
          )}
          {/* Counter */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
            {active + 1} / {gallery.length}
          </div>
        </div>

        {/* Thumbnails */}
        {gallery.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {gallery.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActive(i)}
                className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden transition-all cursor-pointer ${
                  i === active ? 'ring-2 ring-zinc-900 dark:ring-white opacity-100' : 'opacity-50 hover:opacity-80'
                }`}
              >
                <img src={img.url} alt={img.caption} className="w-full h-full object-cover object-top" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-xl"></i>
          </button>

          {gallery.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); setActive(i => (i - 1 + gallery.length) % gallery.length); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <i className="ri-arrow-left-s-line text-xl"></i>
              </button>
              <button
                onClick={e => { e.stopPropagation(); setActive(i => (i + 1) % gallery.length); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <i className="ri-arrow-right-s-line text-xl"></i>
              </button>
            </>
          )}

          <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <img
              src={gallery[active].url}
              alt={gallery[active].caption}
              className="w-full rounded-2xl object-cover"
            />
            <p className="text-zinc-400 text-sm text-center mt-3">{gallery[active].caption}</p>
            <p className="text-zinc-600 text-xs text-center mt-1">{title} — {active + 1} de {gallery.length}</p>
          </div>
        </div>
      )}
    </>
  );
}
