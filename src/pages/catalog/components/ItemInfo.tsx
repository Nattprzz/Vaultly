import { useState } from 'react';
import type { ItemDetail } from '@/types/itemDetail';
import type { CatalogItemFull } from '@/hooks/useCatalogItem';
import { getPlatformStyle } from '@/constants/platformsGames';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeArr(v: unknown): string[] {
  if (Array.isArray(v)) return (v as unknown[]).filter(x => typeof x === 'string' && x.trim() !== '').map(String);
  if (typeof v === 'string' && v.trim()) return [v.trim()];
  return [];
}

function safeStr(v: unknown): string | null {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'string') return v.trim() || null;
  return String(v) || null;
}

function safeNum(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

const LANG_LABELS: Record<string, string> = {
  en: 'Inglés',  es: 'Español', fr: 'Francés', de: 'Alemán',
  it: 'Italiano', pt: 'Portugués', ja: 'Japonés', ko: 'Coreano',
  zh: 'Chino',   ru: 'Ruso',    ar: 'Árabe',   hi: 'Hindi',
  tr: 'Turco',   nl: 'Holandés', pl: 'Polaco',  sv: 'Sueco',
  da: 'Danés',   fi: 'Finés',
};
function langLabel(code: string): string {
  return LANG_LABELS[code?.toLowerCase()] ?? code?.toUpperCase() ?? '';
}

function fmtDate(date: string): string {
  try {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(new Date(date));
  } catch {
    return date;
  }
}

function fmtMoney(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B $`;
  if (n >= 1_000_000)     return `${Math.round(n / 1_000_000)}M $`;
  return `${n.toLocaleString('es-ES')} $`;
}

function metacriticStyle(score: number) {
  if (score >= 75) return { bg: 'bg-emerald-500/15 border-emerald-500/30', text: 'text-emerald-400' };
  if (score >= 50) return { bg: 'bg-amber-500/15 border-amber-500/30',     text: 'text-amber-400'   };
  return               { bg: 'bg-red-500/15 border-red-500/30',            text: 'text-red-400'     };
}


const SOURCE_LABELS: Record<string, string> = {
  igdb: 'IGDB',
  tmdb: 'The Movie Database',
  google_books: 'Google Books',
  ticketmaster: 'Ticketmaster',
  manual: 'Vaultly',
};

// ─── InfoTable ────────────────────────────────────────────────────────────────

interface InfoRow {
  label: string;
  value: string | string[];
  icon: string;
  link?: string;
}

function InfoTable({ rows }: { rows: InfoRow[] }) {
  if (rows.length === 0) return null;
  return (
    <div className="flex flex-col divide-y divide-zinc-800/60">
      {rows.map(row => (
        <div key={row.label} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
          <div className="flex items-center gap-2 w-32 flex-shrink-0 pt-0.5">
            <i className={`${row.icon} text-zinc-600 text-sm flex-shrink-0`} />
            <span className="text-xs font-medium text-zinc-500 leading-tight">{row.label}</span>
          </div>
          <div className="flex-1 min-w-0">
            {Array.isArray(row.value) ? (
              <div className="flex flex-wrap gap-1">
                {row.value.map(v => (
                  <span key={v} className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs font-medium">
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
                <i className="ri-external-link-line ml-1 text-xs text-zinc-500" />
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

export default function ItemInfo({
  item,
  rawItem,
}: {
  item: ItemDetail;
  rawItem?: CatalogItemFull;
}) {
  const [descExpanded, setDescExpanded] = useState(false);

  const meta = (rawItem?.metadata ?? {}) as Record<string, unknown>;

  // ── Description ──────────────────────────────────────────────────────────────
  const desc = item.description ?? '';
  const paragraphs = desc.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  const isSingleLong = paragraphs.length <= 1 && desc.length > 500;
  const needsExpand  = paragraphs.length > 3 || isSingleLong;

  // ── Build rows per category ───────────────────────────────────────────────────
  const rows: InfoRow[] = [];

  // ── Videojuegos ───────────────────────────────────────────────────────────────
  if (item.category === 'videojuegos') {
    const devsFromMeta  = safeArr(meta.developers);
    const pubsFromMeta  = safeArr(meta.publishers);
    const devs          = devsFromMeta.length ? devsFromMeta : (item.developer ? [item.developer] : []);
    const pubs          = pubsFromMeta.length ? pubsFromMeta : (item.publisher ? [item.publisher] : []);
    const modes         = safeArr(meta.game_modes);
    const rd            = meta.release_dates as Record<string, string | null> | undefined;
    const ratingN       = safeNum(meta.rating_count);
    const extScore      = safeNum(meta.rating);
    const franchise     = safeStr(meta.franchise ?? meta.series_name);
    const igdbSlug      = safeStr(meta.igdb_slug);

    if (item.year > 0)               rows.push({ label: 'Lanzamiento',   value: String(item.year),                                               icon: 'ri-calendar-line'      });
    if (rd?.north_america)           rows.push({ label: 'Lanz. EEUU',    value: fmtDate(rd.north_america!),                                      icon: 'ri-flag-line'          });
    if (rd?.europe)                  rows.push({ label: 'Lanz. Europa',  value: fmtDate(rd.europe!),                                             icon: 'ri-global-line'        });
    if (rd?.japan)                   rows.push({ label: 'Lanz. Japón',   value: fmtDate(rd.japan!),                                              icon: 'ri-map-pin-line'       });
    if (devs.length)                 rows.push({ label: 'Desarrollador', value: devs,                                                            icon: 'ri-code-box-line'      });
    if (pubs.length)                 rows.push({ label: 'Publisher',     value: pubs,                                                            icon: 'ri-building-line'      });
    if (franchise)                   rows.push({ label: 'Saga',          value: franchise,                                                       icon: 'ri-stack-line'         });
    if (modes.length)                rows.push({ label: 'Modos',         value: modes,                                                           icon: 'ri-team-line'          });
    if (item.esrb)                   rows.push({ label: 'Clasificación', value: item.esrb,                                                       icon: 'ri-shield-line'        });
    if (item.playtime != null)       rows.push({ label: 'Horas aprox.',  value: `~${item.playtime}h`,                                            icon: 'ri-timer-line'         });
    if (item.achievements_count != null) rows.push({ label: 'Logros',   value: String(item.achievements_count),                                  icon: 'ri-trophy-line'        });
    if (extScore != null)            rows.push({ label: 'Puntuación',    value: `${extScore.toFixed(1)} / 10`,                                   icon: 'ri-star-line'          });
    if (ratingN != null)             rows.push({ label: 'Valoraciones',  value: ratingN.toLocaleString('es-ES'),                                 icon: 'ri-user-line'          });
    if (item.website)                rows.push({ label: 'Sitio web',     value: item.website,  link: item.website,                               icon: 'ri-global-line'        });
    if (igdbSlug)                    rows.push({ label: 'Ver en IGDB',   value: 'igdb.com',    link: `https://www.igdb.com/games/${igdbSlug}`,   icon: 'ri-external-link-line' });
  }

  // ── Películas ─────────────────────────────────────────────────────────────────
  if (item.category === 'peliculas') {
    const ratingN       = safeNum(meta.rating_count ?? meta.vote_count);
    const extScore      = safeNum(meta.rating);
    const budget        = safeNum(meta.budget);
    const revenue       = safeNum(meta.revenue);
    const spokenLangs   = safeArr(meta.spoken_languages);
    const releaseDate   = safeStr(meta.release_date);
    const tmdbId        = rawItem?.source === 'tmdb' ? rawItem.source_item_id : null;
    const castFromMeta  = safeArr(meta.cast);
    const castArr       = (castFromMeta.length ? castFromMeta : safeArr(item.cast)).slice(0, 8);

    if (releaseDate || item.year > 0) rows.push({ label: 'Estreno',      value: releaseDate ? fmtDate(releaseDate) : String(item.year),           icon: 'ri-calendar-line'          });
    if (item.director)               rows.push({ label: 'Director',      value: item.director,                                                    icon: 'ri-movie-2-line'           });
    if (castArr.length)              rows.push({ label: 'Reparto',        value: castArr,                                                          icon: 'ri-user-star-line'         });
    if (item.duration)               rows.push({ label: 'Duración',       value: item.duration,                                                   icon: 'ri-time-line'              });
    if (item.origin_country)         rows.push({ label: 'País',           value: item.origin_country,                                             icon: 'ri-map-pin-line'           });
    if (item.original_language)      rows.push({ label: 'Idioma orig.',   value: langLabel(item.original_language),                               icon: 'ri-translate-2'            });
    if (spokenLangs.length)          rows.push({ label: 'Idiomas',        value: spokenLangs.map(langLabel),                                      icon: 'ri-translate-2'            });
    if (item.production_companies?.length) rows.push({ label: 'Productoras', value: item.production_companies!,                                   icon: 'ri-building-line'          });
    if (budget != null && budget > 0) rows.push({ label: 'Presupuesto',   value: fmtMoney(budget),                                               icon: 'ri-money-dollar-circle-line' });
    if (revenue != null && revenue > 0) rows.push({ label: 'Recaudación', value: fmtMoney(revenue),                                              icon: 'ri-money-dollar-circle-line' });
    if (extScore != null)            rows.push({ label: 'Puntuación',     value: `${extScore.toFixed(1)} / 10`,                                  icon: 'ri-star-line'              });
    if (ratingN != null)             rows.push({ label: 'Valoraciones',   value: ratingN.toLocaleString('es-ES'),                                 icon: 'ri-user-line'              });
    if (tmdbId)                      rows.push({ label: 'Ver en TMDB',    value: 'themoviedb.org', link: `https://www.themoviedb.org/movie/${tmdbId}`, icon: 'ri-external-link-line' });
  }

  // ── Series ────────────────────────────────────────────────────────────────────
  if (item.category === 'series') {
    const ratingN       = safeNum(meta.rating_count ?? meta.vote_count);
    const extScore      = safeNum(meta.rating);
    const creators      = safeArr(meta.creators);
    const firstAir      = safeStr(meta.first_air_date ?? meta.release_date);
    const lastAir       = safeStr(meta.last_air_date) ?? item.last_air_date ?? null;
    const tmdbId        = rawItem?.source === 'tmdb' ? rawItem.source_item_id : null;
    const castFromMeta  = safeArr(meta.cast);
    const castArr       = (castFromMeta.length ? castFromMeta : safeArr(item.cast)).slice(0, 8);

    if (firstAir || item.year > 0)   rows.push({ label: 'Estreno',       value: firstAir ? fmtDate(firstAir) : String(item.year),                icon: 'ri-calendar-line'       });
    if (lastAir)                     rows.push({ label: 'Finalización',   value: fmtDate(lastAir),                                               icon: 'ri-calendar-check-line' });
    if (item.series_status)          rows.push({ label: 'Estado',         value: item.series_status,                                             icon: 'ri-signal-tower-line'   });
    if (item.seasons)                rows.push({ label: 'Temporadas',     value: String(item.seasons),                                           icon: 'ri-archive-line'        });
    if (item.episodes)               rows.push({ label: 'Episodios',      value: String(item.episodes),                                          icon: 'ri-film-line'           });
    if (item.duration)               rows.push({ label: 'Duración/ep',    value: item.duration,                                                  icon: 'ri-time-line'           });
    if (creators.length)             rows.push({ label: 'Creador',        value: creators,                                                       icon: 'ri-user-star-line'      });
    if (castArr.length)              rows.push({ label: 'Reparto',        value: castArr,                                                        icon: 'ri-users-line'          });
    if (item.network)                rows.push({ label: 'Plataforma',     value: item.network,                                                   icon: 'ri-tv-2-line'           });
    if (item.origin_country)         rows.push({ label: 'País',           value: item.origin_country,                                            icon: 'ri-map-pin-line'        });
    if (item.original_language)      rows.push({ label: 'Idioma orig.',   value: langLabel(item.original_language),                              icon: 'ri-translate-2'         });
    if (item.production_companies?.length) rows.push({ label: 'Productoras', value: item.production_companies!,                                  icon: 'ri-building-line'       });
    if (extScore != null)            rows.push({ label: 'Puntuación',     value: `${extScore.toFixed(1)} / 10`,                                  icon: 'ri-star-line'           });
    if (ratingN != null)             rows.push({ label: 'Valoraciones',   value: ratingN.toLocaleString('es-ES'),                                icon: 'ri-user-line'           });
    if (tmdbId)                      rows.push({ label: 'Ver en TMDB',    value: 'themoviedb.org', link: `https://www.themoviedb.org/tv/${tmdbId}`, icon: 'ri-external-link-line' });
  }

  // ── Libros ────────────────────────────────────────────────────────────────────
  if (item.category === 'libros') {
    const authorsFromMeta = safeArr(meta.authors);
    const authorVal       = authorsFromMeta.length ? authorsFromMeta : (item.authors ?? (item.author ? [item.author] : []));
    const ratingN         = safeNum(meta.rating_count);
    const extScore        = safeNum(meta.rating);
    const saga            = meta.saga as { name?: string | null; volume?: number | null } | undefined;
    const sagaLabel       = saga?.name
      ? (saga.volume != null ? `${saga.name} #${saga.volume}` : saga.name)
      : null;
    const formats         = safeArr(meta.formats_available);
    const pubDate         = safeStr(meta.published_date ?? meta.release_date);

    if (authorVal.length)            rows.push({ label: 'Autor/es',      value: authorVal,                                                       icon: 'ri-quill-pen-line'     });
    if (item.publisher)              rows.push({ label: 'Editorial',     value: item.publisher,                                                  icon: 'ri-building-line'      });
    if (pubDate)                     rows.push({ label: 'Publicación',   value: fmtDate(pubDate),                                               icon: 'ri-calendar-line'      });
    else if (item.year > 0)          rows.push({ label: 'Publicación',   value: String(item.year),                                              icon: 'ri-calendar-line'      });
    if (item.pages)                  rows.push({ label: 'Páginas',       value: String(item.pages),                                             icon: 'ri-file-text-line'     });
    if (item.language)               rows.push({ label: 'Idioma',        value: langLabel(item.language),                                       icon: 'ri-translate-2'        });
    if (item.isbn)                   rows.push({ label: 'ISBN',          value: item.isbn,                                                      icon: 'ri-barcode-line'       });
    if (sagaLabel)                   rows.push({ label: 'Saga',          value: sagaLabel,                                                      icon: 'ri-stack-line'         });
    if (formats.length)              rows.push({ label: 'Formatos',      value: formats,                                                        icon: 'ri-book-open-line'     });
    if (extScore != null)            rows.push({ label: 'Puntuación',    value: `${extScore.toFixed(1)} / 10`,                                  icon: 'ri-star-line'          });
    if (ratingN != null)             rows.push({ label: 'Valoraciones',  value: ratingN.toLocaleString('es-ES'),                                icon: 'ri-user-line'          });
  }

  // ── Conciertos ────────────────────────────────────────────────────────────────
  if (item.category === 'conciertos') {
    const artistsFromMeta = safeArr(meta.artists);
    const artists         = artistsFromMeta.length ? artistsFromMeta : (item.artist ? [item.artist] : []);
    const concertGenres   = safeArr(meta.genres);
    const segment         = safeStr(meta.segment);
    const promoterRaw     = meta.promoter;
    const promoter        = safeStr(
      (typeof promoterRaw === 'object' && promoterRaw !== null
        ? (promoterRaw as Record<string, unknown>).name
        : promoterRaw) ?? meta.promoter_name,
    );
    const priceRanges = Array.isArray(meta.priceRanges)
      ? (meta.priceRanges as Array<Record<string, unknown>>)
      : null;
    const priceStr = priceRanges?.length
      ? priceRanges
          .map(r => {
            const mn = safeNum(r.min);
            const mx = safeNum(r.max);
            const cur = String(r.currency ?? '');
            if (mn != null && mx != null) return `${mn} – ${mx} ${cur}`.trim();
            if (mn != null) return `desde ${mn} ${cur}`.trim();
            return null;
          })
          .filter(Boolean)
          .join(' / ')
      : null;
    const officialUrl = safeStr(meta.url);
    const eventDate   = safeStr(meta.event_date) ?? item.event_date ?? null;
    const eventTime   = safeStr(meta.start_time) ?? item.event_time ?? null;
    const venue       = safeStr(meta.venue) ?? item.venue ?? null;
    const city        = safeStr(meta.city) ?? item.city ?? null;
    const country     = safeStr(meta.country) ?? item.country ?? null;

    if (artists.length)              rows.push({ label: 'Artista',       value: artists,                                                         icon: 'ri-music-2-line'        });
    if (eventDate)                   rows.push({ label: 'Fecha',         value: fmtDate(eventDate),                                             icon: 'ri-calendar-event-line' });
    if (eventTime)                   rows.push({ label: 'Hora',          value: eventTime,                                                      icon: 'ri-time-line'           });
    if (venue)                       rows.push({ label: 'Recinto',       value: venue,                                                          icon: 'ri-building-4-line'     });
    if (city)                        rows.push({ label: 'Ciudad',        value: city,                                                           icon: 'ri-map-pin-line'        });
    if (country)                     rows.push({ label: 'País',          value: country,                                                        icon: 'ri-flag-line'           });
    if (concertGenres.length)        rows.push({ label: 'Género',        value: concertGenres,                                                  icon: 'ri-music-line'          });
    if (segment)                     rows.push({ label: 'Tipo',          value: segment,                                                        icon: 'ri-apps-line'           });
    if (promoter)                    rows.push({ label: 'Organizador',   value: promoter,                                                       icon: 'ri-group-line'          });
    if (priceStr)                    rows.push({ label: 'Precio',        value: priceStr,                                                       icon: 'ri-ticket-line'         });
    if (officialUrl)                 rows.push({ label: 'Entradas',      value: 'Ver entradas', link: officialUrl,                              icon: 'ri-external-link-line'  });
  }

  // ── Extra sections ────────────────────────────────────────────────────────────
  const hltb         = meta.howlongtobeat as { main?: number | null; main_extra?: number | null; completionist?: number | null } | undefined;
  const hasHLTB      = item.category === 'videojuegos' && !!hltb && (hltb.main != null || hltb.main_extra != null || hltb.completionist != null);
  const hasMetacritic = item.metacritic != null;
  const hasPlatforms  = item.category === 'videojuegos' && (item.platforms?.length ?? 0) > 0;
  const hasKeywords   = (item.keywords?.length ?? 0) > 0;
  const hasSetlist    = (item.setlist?.length ?? 0) > 0;
  const hasTrailer    = !!item.trailer_key;
  const anyStructured = rows.length > 0 || hasMetacritic || hasPlatforms || hasHLTB || hasKeywords || hasSetlist || hasTrailer;

  const sourceName = rawItem?.source ? (SOURCE_LABELS[rawItem.source] ?? rawItem.source) : null;

  return (
    <div className="flex flex-col gap-8">

      {/* ── Description ─────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">Descripción</h2>
        <div className="relative">
          <div
            style={{
              maxHeight: needsExpand && !descExpanded ? '11rem' : '2000px',
              overflow: 'hidden',
              transition: 'max-height 0.35s ease',
            }}
          >
            {paragraphs.length > 0 ? (
              <div className="flex flex-col gap-3">
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-zinc-400 leading-relaxed text-sm">{p}</p>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 text-sm italic">Sin descripción disponible.</p>
            )}
          </div>
          {needsExpand && !descExpanded && (
            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none" />
          )}
        </div>
        {needsExpand && (
          <button
            onClick={() => setDescExpanded(v => !v)}
            className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            <i className={descExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} />
            {descExpanded ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </div>

      {/* ── Ficha técnica ────────────────────────────────────────────────────── */}
      {rows.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Ficha técnica</h2>
          <InfoTable rows={rows} />
        </div>
      )}

      {/* ── Plataformas (games) ──────────────────────────────────────────────── */}
      {hasPlatforms && (
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Plataformas</h2>
          <div className="flex flex-wrap gap-2">
            {item.platforms!.map(p => {
              const ps = getPlatformStyle(p);
              return (
                <div
                  key={p}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/80 border text-xs font-medium text-zinc-100 transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
                  style={{
                    borderColor: `${ps.color}55`,
                    boxShadow: `0 0 10px ${ps.color}18`,
                  }}
                >
                  <i
                    className={`${ps.icon} text-sm flex-shrink-0`}
                    style={{ color: ps.color }}
                  />
                  {p}
                </div>
              );
            })}
          </div>
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
              <p className="text-xs text-zinc-500 mt-0.5">Basado en crítica profesional · Escala 0–100</p>
            </div>
          </div>
        </div>
      )}

      {/* ── HowLongToBeat ────────────────────────────────────────────────────── */}
      {hasHLTB && (
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Tiempo estimado</h2>
          <div className="grid grid-cols-3 gap-3">
            {hltb!.main != null && (
              <div className="flex flex-col items-center gap-1.5 py-4 rounded-xl bg-zinc-800 border border-zinc-700/60">
                <span className="text-xl font-black text-white">{hltb!.main}h</span>
                <span className="text-[11px] text-zinc-500 text-center leading-tight px-1">Historia<br />principal</span>
              </div>
            )}
            {hltb!.main_extra != null && (
              <div className="flex flex-col items-center gap-1.5 py-4 rounded-xl bg-zinc-800 border border-zinc-700/60">
                <span className="text-xl font-black text-white">{hltb!.main_extra}h</span>
                <span className="text-[11px] text-zinc-500 text-center leading-tight px-1">Historia<br />+ extras</span>
              </div>
            )}
            {hltb!.completionist != null && (
              <div className="flex flex-col items-center gap-1.5 py-4 rounded-xl bg-zinc-800 border border-zinc-700/60">
                <span className="text-xl font-black text-white">{hltb!.completionist}h</span>
                <span className="text-[11px] text-zinc-500 text-center leading-tight px-1">Completista</span>
              </div>
            )}
          </div>
          <p className="text-xs text-zinc-600 mt-2">Fuente: HowLongToBeat</p>
        </div>
      )}

      {/* ── Tráiler ──────────────────────────────────────────────────────────── */}
      {hasTrailer && (
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Tráiler</h2>
          <a
            href={`https://www.youtube.com/watch?v=${item.trailer_key}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700/60 text-zinc-200 text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            <i className="ri-youtube-line text-red-500 text-lg" />
            Ver tráiler en YouTube
            <i className="ri-external-link-line text-zinc-500 text-xs" />
          </a>
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
                <i className="ri-music-2-line text-zinc-600 text-sm flex-shrink-0" />
                <span className="text-sm text-zinc-200">{song}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* ── Empty state ──────────────────────────────────────────────────────── */}
      {!anyStructured && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800">
            <i className="ri-information-line text-zinc-500 text-lg" />
          </div>
          <p className="text-sm text-zinc-500">No hay información adicional disponible para este ítem.</p>
        </div>
      )}

      {/* ── Fuente de datos ──────────────────────────────────────────────────── */}
      {sourceName && (
        <div className="pt-2 border-t border-zinc-800/50">
          <p className="text-xs text-zinc-600 flex items-center gap-1.5">
            <i className="ri-database-line" />
            Datos procedentes de{' '}
            <span className="font-medium text-zinc-500">{sourceName}</span>
          </p>
        </div>
      )}
    </div>
  );
}
