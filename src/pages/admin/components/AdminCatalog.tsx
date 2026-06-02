import { useState, useRef, useEffect } from 'react';
import { useAdminCatalog, CatalogItem, CatalogItemFormData, EMPTY_CATALOG_FORM } from '@/hooks/useAdminCatalog';
import ItemEntitiesEditor from './ItemEntitiesEditor';

const CATEGORIES = [
  { id: 'videojuegos', label: 'Videojuegos', icon: 'ri-gamepad-line',   color: '#8b5cf6' },
  { id: 'peliculas',   label: 'Películas',   icon: 'ri-film-line',       color: '#f43f5e' },
  { id: 'series',      label: 'Series',      icon: 'ri-tv-2-line',       color: '#f59e0b' },
  { id: 'libros',      label: 'Libros',      icon: 'ri-book-open-line',  color: '#10b981' },
  { id: 'conciertos',  label: 'Conciertos',  icon: 'ri-music-2-line',    color: '#ec4899' },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

function MetaHint({ category }: { category: string }) {
  const hints: Record<string, string> = {
    videojuegos: '{"rating": 4.5, "developers": ["Rockstar"], "publishers": ["Take-Two"]}',
    peliculas:   '{"rating": 8.2, "director": "Nolan", "cast": ["Cillian Murphy"]}',
    series:      '{"rating": 9.0, "seasons": 5, "network": "HBO"}',
    libros:      '{"rating": 4.8, "pages": 320, "genre": "Sci-Fi"}',
    conciertos:  '{"venue": "Madison Square Garden", "city": "New York"}',
  };
  const hint = hints[category];
  if (!hint) return null;
  return <p className="text-xs text-zinc-600 mt-1 font-mono truncate">Ej: {hint}</p>;
}

interface ItemModalProps {
  editTarget: CatalogItem | null;
  saving: boolean;
  onClose: () => void;
  onSave: (form: CatalogItemFormData) => Promise<void>;
}

function ItemModal({ editTarget, saving, onClose, onSave }: ItemModalProps) {
  const [form, setForm] = useState<CatalogItemFormData>(
    editTarget
      ? {
          title: editTarget.title,
          category: editTarget.category,
          description: (editTarget as any).description ?? '',
          image_url: editTarget.image_url ?? '',
          release_date: editTarget.release_date ?? '',
          metadata_raw: editTarget.metadata ? JSON.stringify(editTarget.metadata, null, 2) : '',
        }
      : EMPTY_CATALOG_FORM
  );
  const [metaError, setMetaError] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'entities'>('info');

  const handleSave = async () => {
    if (!form.title.trim()) return;
    if (form.metadata_raw.trim()) {
      try { JSON.parse(form.metadata_raw); } catch {
        setMetaError('JSON inválido — revisa la sintaxis');
        return;
      }
    }
    setMetaError('');
    await onSave(form);
  };

  const isEdit = !!editTarget;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={() => !saving && onClose()}></div>
      <div className="relative z-10 bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-2xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 flex-shrink-0">
          <div>
            <h3 className="text-white font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {isEdit ? 'Editar ítem' : 'Nuevo ítem del catálogo'}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {isEdit ? `Editando: ${editTarget.title}` : 'Crea un ítem manualmente'}
            </p>
          </div>
          <button
            onClick={() => !saving && onClose()}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        {/* Tabs — only when editing */}
        {isEdit && (
          <div className="flex items-center gap-1 px-6 pt-4 flex-shrink-0">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'info'
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
            >
              <i className="ri-file-info-line text-sm"></i>
              Información
            </button>
            <button
              onClick={() => setActiveTab('entities')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'entities'
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
            >
              <i className="ri-user-star-line text-sm"></i>
              Entidades
            </button>
          </div>
        )}

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Info tab ── */}
          {activeTab === 'info' && (
            <div className="px-6 py-5 flex flex-col gap-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                  Título <span className="text-rose-400">*</span>
                </label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Ej: The Last of Us, Dune, 1984..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                  Categoría <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, category: c.id }))}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                        form.category === c.id
                          ? 'border-white/30 bg-white/10'
                          : 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700'
                      }`}
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className={`${c.icon} text-sm`} style={{ color: c.color }}></i>
                      </div>
                      <span className="text-xs text-zinc-300 leading-tight text-center">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">URL de imagen / portada</label>
                <input
                  value={form.image_url}
                  onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                {form.image_url && (
                  <div className="mt-2 flex items-center gap-3">
                    <div className="w-10 h-14 rounded-lg overflow-hidden border border-zinc-700 flex-shrink-0">
                      <img
                        src={form.image_url}
                        alt="preview"
                        className="w-full h-full object-cover object-top"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500">Vista previa</span>
                  </div>
                )}
              </div>

              {/* Release date */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Fecha de lanzamiento</label>
                <input
                  type="date"
                  value={form.release_date}
                  onChange={e => setForm(f => ({ ...f, release_date: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Descripción</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Descripción del ítem..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                />
                <p className="text-xs text-zinc-600 mt-1 text-right">{form.description.length}/500</p>
              </div>

              {/* Metadata JSON */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                  Metadata <span className="text-zinc-600">(JSON opcional)</span>
                </label>
                <textarea
                  value={form.metadata_raw}
                  onChange={e => { setForm(f => ({ ...f, metadata_raw: e.target.value })); setMetaError(''); }}
                  placeholder={'{\n  "rating": 9.0,\n  "genre": "Action"\n}'}
                  rows={4}
                  className={`w-full px-4 py-2.5 rounded-xl bg-zinc-800 border text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 font-mono resize-none ${
                    metaError ? 'border-rose-500 focus:ring-rose-500/30' : 'border-zinc-700 focus:ring-white/20'
                  }`}
                />
                {metaError
                  ? <p className="text-xs text-rose-400 mt-1">{metaError}</p>
                  : <MetaHint category={form.category} />
                }
              </div>
            </div>
          )}

          {/* ── Entities tab ── */}
          {activeTab === 'entities' && isEdit && (
            <div className="px-6 py-5">
              <ItemEntitiesEditor itemId={editTarget.id} />
            </div>
          )}
        </div>

        {/* Footer — only show save on info tab */}
        {activeTab === 'info' && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800 flex-shrink-0">
            <button
              onClick={() => !saving && onClose()}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-semibold hover:bg-zinc-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.title.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-bold hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <i className={isEdit ? 'ri-save-line' : 'ri-add-line'}></i>
                  {isEdit ? 'Guardar cambios' : 'Crear ítem'}
                </>
              )}
            </button>
          </div>
        )}

        {/* Footer — entities tab: just close */}
        {activeTab === 'entities' && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 flex-shrink-0">
            <p className="text-xs text-zinc-600">Los cambios se guardan automáticamente</p>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-semibold hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminCatalog() {
  const {
    items, total, loading, saving, error,
    search, setSearch,
    categoryFilter, setCategoryFilter,
    page, setPage,
    fetchItems,
    createItem, updateItem, deleteItem,
  } = useAdminCatalog();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CatalogItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);
  const actionRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (error) showToast(error, 'err');
  }, [error]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (actionRef.current && !actionRef.current.contains(e.target as Node)) {
        setActionMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openCreate = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (item: CatalogItem) => { setEditTarget(item); setActionMenu(null); setModalOpen(true); };

  const handleSave = async (form: CatalogItemFormData) => {
    let ok: boolean;
    if (editTarget) {
      ok = await updateItem(editTarget.id, form);
      if (ok) showToast('Ítem actualizado correctamente');
    } else {
      ok = await createItem(form);
      if (ok) showToast('Ítem creado correctamente');
    }
    if (ok) setModalOpen(false);
    else showToast('Error al guardar el ítem', 'err');
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteItem(id);
    if (ok) showToast('Ítem eliminado');
    else showToast('Error al eliminar', 'err');
    setDeleteConfirm(null);
    setActionMenu(null);
  };

  const totalPages = Math.ceil(total / 30);

  return (
    <div className="flex flex-col gap-5">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
          toast.type === 'ok'
            ? 'bg-emerald-950 border-emerald-800 text-emerald-300'
            : 'bg-rose-950 border-rose-800 text-rose-300'
        }`}>
          <i className={toast.type === 'ok' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'}></i>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-white font-bold text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Catálogo
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {total.toLocaleString()} ítems en total · Gestiona el catálogo de Vaultly.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-bold hover:bg-zinc-100 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line"></i>
          Nuevo ítem
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm"></i>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar ítem por título..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 focus:outline-none cursor-pointer"
        >
          <option value="all">Todas las categorías</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <button
          onClick={fetchItems}
          className="px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
          title="Recargar"
        >
          <i className="ri-refresh-line text-sm"></i>
        </button>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-zinc-800 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          <div className="col-span-6">Ítem</div>
          <div className="col-span-2 hidden md:block">Categoría</div>
          <div className="col-span-2 hidden lg:block">Fuente</div>
          <div className="col-span-2 hidden lg:block">Fecha</div>
          <div className="col-span-6 md:col-span-2 lg:col-span-1 text-right">Acciones</div>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-zinc-500">Cargando catálogo...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-zinc-600">
            <i className="ri-database-2-line text-3xl mb-2 block"></i>
            <p className="text-sm">
              {total === 0 ? 'No hay ítems todavía — crea el primero' : 'No se encontraron ítems'}
            </p>
            {total === 0 && (
              <button
                onClick={openCreate}
                className="mt-4 px-4 py-2 rounded-xl bg-white text-zinc-900 text-sm font-bold hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                Crear ítem
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-zinc-800" ref={actionRef}>
            {items.map(item => {
              const cat = CAT_MAP[item.category];
              const rating = item.metadata?.rating as number | undefined;
              return (
                <div key={item.id} className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-white/5 transition-colors">
                  {/* Item */}
                  <div className="col-span-10 md:col-span-6 flex items-center gap-3 min-w-0">
                    {item.image_url ? (
                      <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover object-top" />
                      </div>
                    ) : (
                      <div className="w-10 h-14 rounded-lg flex items-center justify-center flex-shrink-0 bg-zinc-800 border border-zinc-700">
                        <i className={`${cat?.icon ?? 'ri-image-line'} text-zinc-600`}></i>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {item.release_date && (
                          <span className="text-xs text-zinc-500">{item.release_date.slice(0, 4)}</span>
                        )}
                        {rating !== undefined && (
                          <>
                            <span className="text-xs text-zinc-600">·</span>
                            <div className="flex items-center gap-0.5">
                              <i className="ri-star-fill text-amber-400 text-xs"></i>
                              <span className="text-xs text-zinc-400">{Number(rating).toFixed(1)}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium mt-1 inline-block ${
                        item.source === 'manual'
                          ? 'bg-zinc-700 text-zinc-400'
                          : 'bg-sky-500/20 text-sky-400'
                      }`}>
                        {item.source === 'manual' ? 'Manual' : item.source.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-span-2 hidden md:flex items-center gap-1.5">
                    {cat && (
                      <>
                        <div className="w-5 h-5 flex items-center justify-center">
                          <i className={`${cat.icon} text-sm`} style={{ color: cat.color }}></i>
                        </div>
                        <span className="text-xs text-zinc-400">{cat.label}</span>
                      </>
                    )}
                  </div>

                  {/* Source */}
                  <div className="col-span-2 hidden lg:block">
                    <span className="text-xs text-zinc-500 font-mono truncate block">{item.source}</span>
                    {item.source_item_id && (
                      <span className="text-xs text-zinc-700 font-mono truncate block">{item.source_item_id.slice(0, 12)}</span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="col-span-2 hidden lg:block">
                    <span className="text-xs text-zinc-500">
                      {item.release_date ?? '—'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 md:col-span-2 lg:col-span-1 flex items-center justify-end relative">
                    <button
                      onClick={() => setActionMenu(prev => prev === item.id ? null : item.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer"
                    >
                      <i className="ri-more-2-fill text-sm"></i>
                    </button>

                    {actionMenu === item.id && (
                      <div className="absolute right-0 top-full mt-1 w-44 bg-zinc-800 rounded-xl border border-zinc-700 z-20 overflow-hidden">
                        <a
                          href={`/catalog/${item.category}/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
                        >
                          <i className="ri-external-link-line"></i> Ver página
                        </a>
                        <button
                          onClick={() => openEdit(item)}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer text-left"
                        >
                          <i className="ri-edit-line"></i> Editar
                        </button>
                        <button
                          onClick={() => { setDeleteConfirm(item.id); setActionMenu(null); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:bg-zinc-700 transition-colors cursor-pointer text-left"
                        >
                          <i className="ri-delete-bin-line"></i> Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500">
            Página {page} de {totalPages} · {total.toLocaleString()} ítems
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <i className="ri-arrow-left-s-line"></i>
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <i className="ri-arrow-right-s-line"></i>
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDeleteConfirm(null)}></div>
          <div className="relative z-10 bg-zinc-900 rounded-2xl border border-zinc-800 p-6 w-full max-w-sm">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center mx-auto mb-4">
              <i className="ri-delete-bin-line text-rose-400 text-xl"></i>
            </div>
            <h3 className="text-white font-bold text-center mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ¿Eliminar ítem?
            </h3>
            <p className="text-zinc-400 text-sm text-center mb-6">
              Se eliminarán también sus entradas en el tracker de usuarios. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-semibold hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-colors cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit modal */}
      {modalOpen && (
        <ItemModal
          editTarget={editTarget}
          saving={saving}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
