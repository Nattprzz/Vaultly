import { useState } from 'react';
import type { ItemDetail } from '@/types/itemDetail';

// ─── Language label ────────────────────────────────────────────────────────────
const LANG_LABELS: Record<string, string> = {
  en: 'Inglés', es: 'Español', fr: 'Francés', de: 'Alemán',
  it: 'Italiano', pt: 'Portugués', ja: 'Japonés', ko: 'Coreano',
  zh: 'Chino', ru: 'Ruso', ar: 'Árabe', hi: 'Hindi', tr: 'Turco',
};
function langLabel(code: string): string {
  return LANG_LABELS[code.toLowerCase()] ?? code.toUpperCase();
}

// ─── Event date ────────────────────────────────────────────────────────────────
function fmtEventDate(date: string): string {
  try {
    return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date));
  } catch {
    return date;
  }
}

// ─── Metacritic color ─────────────────────────────────────────────────────────
function metacriticStyle(score: number) {
  if (score >= 75) return { bg: 'bg-emerald-500/15 border-emerald-500/30', text: 'text-emerald-400' };
  if (score >= 50) return { bg: 'bg-amber-500/15 border-amber-500/30',   text: 'text-amber-400'   };
  return               { bg: 'bg-red-500/15 border-red-500/30',           text: 'text-red-400'     };
}

// ─── Platform icon ─────────────────────────────────────────────────────────────
const PLAT_ICONS: [string, string][] = [
  ['pc',          'ri-computer-line'],
  ['playstation', 'ri-gamepad-line'],
  ['xbox',        'ri-joystick-line'],
  ['nintendo',    'ri-gamepad-fill'],
  ['switch',      'ri-gamepad-fill'],
  ['ios',         'ri-apple-line'],
  ['android',     'ri-android-line'],
  ['mac',         'ri-mac-line'],
  ['linux',       'ri-terminal-line'],
  ['mobile',      'ri-smartphone-line'],
];
function platIcon(name: string): string {
  const lower = name.toLowerCase();
  return PLAT_ICONS.find(([k]) => lower.includes(k))?.[1] ?? 'ri-game-line';
}

// ─── Info table row ────────────────────────────────────────────────────────────
interface InfoRow {
  label: string;
  value: string | string[];
  icon: string;
  link?: string;
}

function InfoTable({ rows }: { rows: InfoRow[] }) {
  return (
    <div className="flex flex-col divide-y divide-zinc-800/60">
      {rows.map(row => (
        <div key={row.label} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
          <div className="flex items-center gap-2 w-32 flex-shrink-0 pt-0.5">
            <i className={`${row.icon} text-zinc-600 text-sm flex-shrink-0`}></i>
            <span className="text-xs font-medium text-zinc-500 leading-tight">{row.label}</span>
          </div>
          <div className="flex-1 min-w-0">
            {Array.isArray(row.value) ? (
              <div className="flex flex-wrap gap-1">
                {row.value.map(v => (
                  <span
                    key={v}
                    className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs font-medium"
                  >
                    {v}
                  </span>
                ))}
              </div>
            ) : row.link ? (
              <a
                href={row.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-200 font-medium hover:text-blue-400 transition-colors truncate block"
              >
                {row.value}
                <i className="ri-external-link-line ml-1 text-xs text-zinc-500"></i>
              </a>
            ) : (
              <span className="text-sm text-zinc-200 font-medium">{row.value}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
const DESC_LIMIT = 420;

export default function ItemInfo({ item }: { item: ItemDetail }) {
  const [descExpanded, setDescExpanded] = useState(false);

  const longDesc = (item.description?.length ?? 0) > DESC_LIMIT;
  const displayDesc =
    longDesc && !descExpanded
      ? `${item.description.slice(0, DESC_LIMIT)}…`
      : item.description;

  // ── Build info table rows per category ──────────────────────────────────────
  const rows: InfoRow[] = [];

  if (item.category === 'peliculas') {
    if (item.director)                    rows.push({ label: 'Director',      value: item.director,                      icon: 'ri-movie-2-line'      });
    if (item.duration)                    rows.push({ label: 'Duración',      value: item.duration,                      icon: 'ri-time-line'         });
    if (item.year > 0)                    rows.push({ label: 'Estreno',       value: String(item.year),                  icon: 'ri-calendar-line'     });
    if (item.origin_country)              rows.push({ label: 'País',          value: item.origin_country,                icon: 'ri-map-pin-line'      });
    if (item.original_language)           rows.push({ label: 'Idioma orig.',  value: langLabel(item.original_language),  icon: 'ri-translate-2'       });
    if (item.network)                     rows.push({ label: 'Distribución',  value: item.network,                       icon: 'ri-tv-2-line'         });
    if (item.production_companies?.length) rows.push({ label: 'Productoras',  value: item.production_companies!,         icon: 'ri-building-line'     });
  }

  if (item.category === 'series') {
    if (item.seasons)                     rows.push({ label: 'Temporadas',    value: String(item.seasons),               icon: 'ri-archive-line'      });
    if (item.episodes)                    rows.push({ label: 'Episodios',     value: String(item.episodes),              icon: 'ri-film-line'         });
    if (item.duration)                    rows.push({ label: 'Duración/ep',   value: item.duration,                      icon: 'ri-time-line'         });
    if (item.year > 0)                    rows.push({ label: 'Estreno',       value: String(item.year),                  icon: 'ri-calendar-line'     });
    if (item.last_air_date)               rows.push({ label: 'Finalización',  value: fmtEventDate(item.last_air_date),   icon: 'ri-calendar-check-line' });
    if (item.series_status)               rows.push({ label: 'Estado',        value: item.series_status,                 icon: 'ri-signal-tower-line' });
    if (item.origin_country)              rows.push({ label: 'País',          value: item.origin_country,                icon: 'ri-map-pin-line'      });
    if (item.original_language)           rows.push({ label: 'Idioma orig.',  value: langLabel(item.original_language),  icon: 'ri-translate-2'       });
    if (item.network)                     rows.push({ label: 'Plataforma',    value: item.network,                       icon: 'ri-tv-2-line'         });
    if (item.production_companies?.length) rows.push({ label: 'Productoras',  value: item.production_companies!,         icon: 'ri-building-line'     });
  }

  if (item.category === 'videojuegos') {
    if (item.developer)                   rows.push({ label: 'Desarrollador', value: item.developer,                     icon: 'ri-code-box-line'     });
    if (item.publisher)                   rows.push({ label: 'Publisher',     value: item.publisher,                     icon: 'ri-building-line'     });
    if (item.year > 0)                    rows.push({ label: 'Lanzamiento',   value: String(item.year),                  icon: 'ri-calendar-line'     });
    if (item.esrb)                        rows.push({ label: 'Clasificación', value: item.esrb,                          icon: 'ri-shield-line'       });
    if (item.playtime != null)            rows.push({ label: 'Horas aprox.',  value: `~${item.playtime}h`,               icon: 'ri-timer-line'        });
    if (item.achievements_count != null)  rows.push({ label: 'Logros',        value: String(item.achievements_count),    icon: 'ri-trophy-line'       });
    if (item.website)                     rows.push({ label: 'Sitio web',     value: item.website,   link: item.website, icon: 'ri-global-line'       });
  }

  if (item.category === 'libros') {
    const authorVal = item.authors?.length ? item.authors : item.author ? [item.author] : null;
    if (authorVal)                        rows.push({ label: 'Autor/es',      value: authorVal,                          icon: 'ri-quill-pen-line'    });
    if (item.publisher)                   rows.push({ label: 'Editorial',     value: item.publisher,                     icon: 'ri-building-line'     });
    if (item.year > 0)                    rows.push({ label: 'Publicación',   value: String(item.year),                  icon: 'ri-calendar-line'     });
    if (item.pages)                       rows.push({ label: 'Páginas',       value: String(item.pages),                 icon: 'ri-file-text-line'    });
    if (item.language)                    rows.push({ label: 'Idioma',        value: langLabel(item.language),            icon: 'ri-translate-2'       });
    if (item.isbn)                        rows.push({ label: 'ISBN',          value: item.isbn,                          icon: 'ri-barcode-line'      });
  }

  if (item.category === 'conciertos') {
    if (item.artist)                      rows.push({ label: 'Artista',       value: item.artist,                        icon: 'ri-music-2-line'      });
    if (item.event_date)                  rows.push({ label: 'Fecha',         value: fmtEventDate(item.event_date),       icon: 'ri-calendar-event-line' });
    if (item.event_time)                  rows.push({ label: 'Hora',          value: item.event_time,                    icon: 'ri-time-line'         });
    if (item.venue)                       rows.push({ label: 'Recinto',       value: item.venue,                         icon: 'ri-building-4-line'   });
    if (item.city)                        rows.push({ label: 'Ciudad',        value: item.city,                          icon: 'ri-map-pin-line'      });
    if (item.country)                     rows.push({ label: 'País',          value: item.country,                       icon: 'ri-flag-line'         });
  }

  const hasKeywords = !!item.keywords?.length;
  const hasMetacritic = item.metacritic != null;
  const hasPlatforms = !!(item.category === 'videojuegos' && item.platforms?.length);
  const hasSetlist = !!item.setlist?.length;

  return (
    <div className="flex flex-col gap-8">

      {/* ── Description ─────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">Descripción</h2>
        <p className="text-zinc-400 leading-relaxed text-sm">{displayDesc}</p>
        {longDesc && (
          <button
            onClick={() => setDescExpanded(v => !v)}
            className="mt-2 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            {descExpanded ? 'Leer menos ↑' : 'Leer más ↓'}
          </button>
        )}
      </div>

      {/* ── Technical sheet ──────────────────────────────────────────────────── */}
      {rows.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Ficha técnica</h2>
          <InfoTable rows={rows} />
        </div>
      )}

      {/* ── Metacritic ───────────────────────────────────────────────────────── */}
      {hasMetacritic && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Metacritic</h2>
          <div className="flex items-center gap-4">
            {(() => {
              const style = metacriticStyle(item.metacritic!);
              return (
                <div className={`w-16 h-16 flex items-center justify-center rounded-2xl border text-2xl font-black flex-shrink-0 ${style.bg} ${style.text}`}>
                  {item.metacritic}
                </div>
              );
            })()}
            <div>
              <p className="text-sm font-semibold text-white">
                {item.metacritic! >= 75 ? 'Aclamación universal' :
                 item.metacritic! >= 50 ? 'Reseñas mixtas' :
                 'Reseñas desfavorables'}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                Basado en crítica profesional · Escala 0–100
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Platforms (games) ────────────────────────────────────────────────── */}
      {hasPlatforms && (
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Plataformas</h2>
          <div className="flex flex-wrap gap-2">
            {item.platforms!.map(p => (
              <div
                key={p}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700/60 text-zinc-300 text-xs font-medium"
              >
                <i className={`${platIcon(p)} text-sm text-zinc-500`}></i>
                {p}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Keywords ─────────────────────────────────────────────────────────── */}
      {hasKeywords && (
        <div>
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Palabras clave</h2>
          <div className="flex flex-wrap gap-1.5">
            {item.keywords!.map(kw => (
              <span
                key={kw}
                className="px-2.5 py-1 rounded-lg bg-zinc-800/60 border border-zinc-700/40 text-zinc-400 text-xs"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Setlist (concerts) ───────────────────────────────────────────────── */}
      {hasSetlist && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Setlist (extracto)</h2>
          <ol className="flex flex-col">
            {item.setlist!.map((song, i) => (
              <li
                key={song}
                className="flex items-center gap-3 py-2.5 border-b border-zinc-800/60 last:border-0"
              >
                <span className="text-xs font-bold text-zinc-600 w-5 text-right flex-shrink-0">{i + 1}</span>
                <i className="ri-music-2-line text-zinc-600 text-sm flex-shrink-0"></i>
                <span className="text-sm text-zinc-200">{song}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
