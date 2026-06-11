import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { auditLog } from '@/lib/audit';
import { useAdminEntities, type AdminEntity, type SortField, type SortDir } from '@/hooks/useAdminEntities';

// ─── Constants ────────────────────────────────────────────────────────────────

const ENTITY_TYPES = [
  { value: 'developer', label: 'Desarrollador', icon: 'ri-code-box-line',    color: '#8b5cf6' },
  { value: 'publisher', label: 'Publisher',      icon: 'ri-building-line',    color: '#6366f1' },
  { value: 'director',  label: 'Director',       icon: 'ri-movie-line',       color: '#f43f5e' },
  { value: 'actor',     label: 'Actor',          icon: 'ri-user-star-line',   color: '#f59e0b' },
  { value: 'author',    label: 'Autor',          icon: 'ri-book-open-line',   color: '#10b981' },
  { value: 'creator',   label: 'Creador',        icon: 'ri-lightbulb-line',   color: '#0ea5e9' },
  { value: 'artist',    label: 'Artista',        icon: 'ri-music-line',       color: '#ec4899' },
  { value: 'studio',    label: 'Estudio',        icon: 'ri-film-line',        color: '#14b8a6' },
];

const TYPE_META = Object.fromEntries(
  ENTITY_TYPES.map(t => [t.value, { icon: t.icon, color: t.color, label: t.label }])
);

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'created_at', label: 'Fecha de creación' },
  { value: 'name',       label: 'Nombre (A-Z)' },
  { value: 'item_count', label: 'Más ítems vinculados' },
];

const MIN_ITEMS_OPTIONS = [
  { value: 0,  label: 'Cualquier cantidad' },
  { value: 1,  label: 'Al menos 1 ítem' },
  { value: 5,  label: 'Al menos 5 ítems' },
  { value: 10, label: 'Al menos 10 ítems' },
  { value: 25, label: 'Al menos 25 ítems' },
];

// ─── Form types ───────────────────────────────────────────────────────────────

interface EntityFormData {
  name: string;
  type: string;
  image_url: string;
  bio: string;
  metadata_raw: string;
}

const EMPTY_FORM: EntityFormData = { name: '', type: 'developer', image_url: '', bio: '', metadata_raw: '' };

function generateSlug(name: string, type: string): string {
  return `${name}-${type}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetadataHint({ type }: { type: string }) {
  const hints: Record<string, string> = {
    developer: '{"founded": "1998", "country": "US"}',
    publisher: '{"founded": "2000", "country": "JP"}',
    director:  '{"nationality": "US", "born": "1970"}',
    actor:     '{"nationality": "UK", "born": "1985"}',
    author:    '{"nationality": "CN", "born": "1963"}',
    artist:    '{"genre": "Pop", "origin": "US"}',
  };
  const hint = hints[type];
  if (!hint) return null;
  return <p className="text-xs text-zinc-600 mt-1 font-mono truncate">Ej: {hint}</p>;
}

function SkeletonRows({ count = 8 }: { count?: number }) {
  return (
    <div className="divide-y divide-zinc-800">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="grid grid-cols-12 gap-4 px-5 py-4 items-center animate-pulse">
          <div className="col-span-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex-shrink-0"></div>
            <div className="flex-1">
              <div className="h-3 bg-zinc-800 rounded w-3/4 mb-2"></div>
              <div className="h-2.5 bg-zinc-800 rounded w-1/2"></div>
            </div>
          </div>
          <div className="col-span-2 hidden md:block h-3 bg-zinc-800 rounded w-16"></div>
          <div className="col-span-2 hidden lg:block h-3 bg-zinc-800 rounded w-20"></div>
          <div className="col-span-2 hidden lg:block h-3 bg-zinc-800 rounded w-8"></div>
          <div className="col-span-1 hidden lg:block h-3 bg-zinc-800 rounded w-8 ml-auto"></div>
        </div>
      ))}
    </div>
  );
}

// ─── Advanced filters panel ───────────────────────────────────────────────────

interface FiltersPanelProps {
  sortField: SortField;
  sortDir: SortDir;
  minItems: number;
  onSortField: (v: SortField) => void;
  onSortDir: (v: SortDir) => void;
  onMinItems: (v: number) => void;
  onReset: () => void;
  onClose: () => void;
  activeCount: number;
}

function FiltersPanel({
  sortField, sortDir, minItems,
  onSortField, onSortDir, onMinItems,
  onReset, onClose, activeCount,
}: FiltersPanelProps) {
  return (
    <div className="absolute right-0 top-full mt-2 w-72 bg-zinc-900 border border-zinc-700 rounded-2xl z-30 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <span className="text-sm font-bold text-white">Filtros avanzados</span>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Limpiar
            </button>
          )}
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-sm"></i>
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Sort field */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Ordenar por</label>
          <div className="flex flex-col gap-1">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => onSortField(opt.value)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer text-left ${
                  sortField === opt.value
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                {opt.label}
                {sortField === opt.value && <i className="ri-check-line text-xs text-white"></i>}
              </button>
            ))}
          </div>
        </div>

        {/* Sort direction */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Dirección</label>
          <div className="flex gap-2">
            {(['desc', 'asc'] as SortDir[]).map(dir => (
              <button
                key={dir}
                onClick={() => onSortDir(dir)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  sortDir === dir
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
                }`}
              >
                <i className={dir === 'desc' ? 'ri-sort-desc' : 'ri-sort-asc'}></i>
                {dir === 'desc' ? 'Descendente' : 'Ascendente'}
              </button>
            ))}
          </div>
        </div>

        {/* Min items */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Ítems vinculados</label>
          <div className="flex flex-col gap-1">
            {MIN_ITEMS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => onMinItems(opt.value)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer text-left ${
                  minItems === opt.value
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                {opt.label}
                {minItems === opt.value && <i className="ri-check-line text-xs text-white"></i>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Entity form modal ────────────────────────────────────────────────────────

interface EntityModalProps {
  editTarget: AdminEntity | null;
  saving: boolean;
  onClose: () => void;
  onSave: (form: EntityFormData) => Promise<void>;
}

function EntityModal({ editTarget, saving, onClose, onSave }: EntityModalProps) {
  const [form, setForm] = useState<EntityFormData>(
    editTarget
      ? {
          name: editTarget.name,
          type: editTarget.type,
          image_url: editTarget.image ?? '',
          bio: editTarget.bio ?? '',
          metadata_raw: editTarget.metadata ? JSON.stringify(editTarget.metadata, null, 2) : '',
        }
      : EMPTY_FORM
  );
  const [metaError, setMetaError] = useState('');

  const handleSave = async () => {
    if (!form.name.trim()) return;
    if (form.metadata_raw.trim()) {
      try { JSON.parse(form.metadata_raw); }
      catch { setMetaError('JSON inválido — revisa la sintaxis'); return; }
    }
    setMetaError('');
    await onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={() => !saving && onClose()}></div>
      <div className="relative z-10 bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 flex-shrink-0">
          <div>
            <h3 className="text-white font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {editTarget ? 'Editar entidad' : 'Nueva entidad'}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {editTarget ? `Editando: ${editTarget.name}` : 'Crea una nueva entidad manualmente'}
            </p>
          </div>
          <button
            onClick={() => !saving && onClose()}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
              Nombre <span className="text-red-400">*</span>
            </label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ej: Rockstar Games, Christopher Nolan..."
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
              Tipo <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ENTITY_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, type: t.value }))}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    form.type === t.value
                      ? 'border-white/30 bg-white/10'
                      : 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700'
                  }`}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className={`${t.icon} text-sm`} style={{ color: t.color }}></i>
                  </div>
                  <span className="text-xs text-zinc-300 leading-tight text-center">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Slug preview */}
          {form.name && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700">
              <i className="ri-link text-zinc-500 text-sm"></i>
              <span className="text-xs text-zinc-500">Slug:</span>
              <span className="text-xs text-zinc-300 font-mono">{generateSlug(form.name, form.type)}</span>
            </div>
          )}

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">URL de imagen</label>
            <input
              value={form.image_url}
              onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            {form.image_url && (
              <div className="mt-2 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-700 flex-shrink-0">
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

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Biografía / Descripción</label>
            <textarea
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Breve descripción de la entidad..."
              rows={3}
              maxLength={500}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
            />
            <p className="text-xs text-zinc-600 mt-1 text-right">{form.bio.length}/500</p>
          </div>

          {/* Metadata JSON */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
              Metadata <span className="text-zinc-600">(JSON opcional)</span>
            </label>
            <textarea
              value={form.metadata_raw}
              onChange={e => { setForm(f => ({ ...f, metadata_raw: e.target.value })); setMetaError(''); }}
              placeholder={'{\n  "founded": "1998",\n  "country": "US"\n}'}
              rows={4}
              className={`w-full px-4 py-2.5 rounded-xl bg-zinc-800 border text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 font-mono resize-none ${
                metaError ? 'border-red-500 focus:ring-red-500/30' : 'border-zinc-700 focus:ring-white/20'
              }`}
            />
            {metaError
              ? <p className="text-xs text-red-400 mt-1">{metaError}</p>
              : <MetadataHint type={form.type} />
            }
          </div>
        </div>

        {/* Footer */}
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
            disabled={saving || !form.name.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-bold hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin"></div>
                Guardando...
              </>
            ) : (
              <>
                <i className={editTarget ? 'ri-save-line' : 'ri-add-line'}></i>
                {editTarget ? 'Guardar cambios' : 'Crear entidad'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminEntities() {
  const {
    entities, total, typeCounts, loading, error,
    filters, setFilter, resetFilters, activeFilterCount,
    page, setPage, totalPages, pageSize,
    fetchEntities, fetchTypeCounts,
  } = useAdminEntities();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminEntity | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

  const actionRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (error) showToast(error, 'err');
  }, [error]);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (actionRef.current && !actionRef.current.contains(e.target as Node)) setActionMenu(null);
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFiltersOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openCreate = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (entity: AdminEntity) => { setEditTarget(entity); setActionMenu(null); setModalOpen(true); };

  const handleSave = async (form: { name: string; type: string; image_url: string; bio: string; metadata_raw: string }) => {
    setSaving(true);
    let parsedMeta: Record<string, unknown> | null = null;
    if (form.metadata_raw.trim()) {
      try { parsedMeta = JSON.parse(form.metadata_raw); }
      catch { showToast('JSON inválido', 'err'); setSaving(false); return; }
    }

    const slug = generateSlug(form.name, form.type);
    const payload = {
      name: form.name.trim(),
      type: form.type,
      slug,
      image: form.image_url.trim() || null,
      bio: form.bio.trim() || null,
      metadata: parsedMeta,
    };

    if (editTarget) {
      const { error } = await supabase.from('entities').update(payload).eq('id', editTarget.id);
      if (error) {
        showToast(error.message.includes('unique') ? 'Ya existe una entidad con ese nombre y tipo' : 'Error al guardar', 'err');
      } else {
        await auditLog('update', 'entities', editTarget.id, { name: payload.name, type: payload.type });
        showToast('Entidad actualizada correctamente');
        setModalOpen(false);
        fetchEntities();
        fetchTypeCounts();
      }
    } else {
      const { data: inserted, error } = await supabase.from('entities').insert(payload).select('id').maybeSingle();
      if (error) {
        showToast(error.message.includes('unique') ? 'Ya existe una entidad con ese nombre y tipo' : 'Error al crear', 'err');
      } else {
        await auditLog('create', 'entities', inserted?.id ?? 'unknown', { name: payload.name, type: payload.type });
        showToast('Entidad creada correctamente');
        setModalOpen(false);
        fetchEntities();
        fetchTypeCounts();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const target = entities.find(e => e.id === id);
    const { error } = await supabase.from('entities').delete().eq('id', id);
    if (error) {
      showToast('Error al eliminar', 'err');
    } else {
      await auditLog('delete', 'entities', id, { name: target?.name ?? null, type: target?.type ?? null });
      showToast('Entidad eliminada');
      fetchEntities();
      fetchTypeCounts();
    }
    setDeleteConfirm(null);
    setActionMenu(null);
  };

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col gap-5">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
          toast.type === 'ok'
            ? 'bg-emerald-950 border-emerald-800 text-emerald-300'
            : 'bg-red-950 border-red-800 text-red-300'
        }`}>
          <i className={toast.type === 'ok' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'}></i>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-white font-bold text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Entidades
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {total.toLocaleString()} entidades en total · Gestiona desarrolladores, actores, directores y más.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-bold hover:bg-zinc-100 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line"></i>
          Nueva entidad
        </button>
      </div>

      {/* Type stats bar */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {ENTITY_TYPES.map(t => (
          <button
            key={t.value}
            onClick={() => setFilter('type', filters.type === t.value ? 'all' : t.value)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all cursor-pointer ${
              filters.type === t.value
                ? 'border-white/20 bg-white/10'
                : 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800'
            }`}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <i className={`${t.icon} text-sm`} style={{ color: t.color }}></i>
            </div>
            <span className="text-xs font-bold text-white">{typeCounts[t.value] ?? 0}</span>
            <span className="text-[10px] text-zinc-500 leading-tight text-center">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm"></i>
          <input
            value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
            placeholder="Buscar entidad por nombre..."
            className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
          {filters.search && (
            <button
              onClick={() => setFilter('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-sm"></i>
            </button>
          )}
        </div>

        {/* Type select */}
        <select
          value={filters.type}
          onChange={e => setFilter('type', e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 focus:outline-none cursor-pointer"
        >
          <option value="all">Todos los tipos</option>
          {ENTITY_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        {/* Advanced filters button */}
        <div ref={filterRef} className="relative flex-shrink-0">
          <button
            onClick={() => setFiltersOpen(p => !p)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilterCount > 0
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            <i className="ri-equalizer-2-line text-sm"></i>
            Filtros
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {filtersOpen && (
            <FiltersPanel
              sortField={filters.sortField}
              sortDir={filters.sortDir}
              minItems={filters.minItems}
              onSortField={v => setFilter('sortField', v)}
              onSortDir={v => setFilter('sortDir', v)}
              onMinItems={v => setFilter('minItems', v)}
              onReset={resetFilters}
              onClose={() => setFiltersOpen(false)}
              activeCount={activeFilterCount}
            />
          )}
        </div>

        {/* Refresh */}
        <button
          onClick={fetchEntities}
          className="px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
          title="Recargar"
        >
          <i className="ri-refresh-line text-sm"></i>
        </button>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.type !== 'all' && (
            <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-medium">
              {TYPE_META[filters.type]?.label ?? filters.type}
              <button onClick={() => setFilter('type', 'all')} className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-zinc-700 cursor-pointer">
                <i className="ri-close-line text-[10px]"></i>
              </button>
            </span>
          )}
          {filters.minItems > 0 && (
            <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-medium">
              ≥{filters.minItems} ítems
              <button onClick={() => setFilter('minItems', 0)} className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-zinc-700 cursor-pointer">
                <i className="ri-close-line text-[10px]"></i>
              </button>
            </span>
          )}
          {(filters.sortField !== 'created_at' || filters.sortDir !== 'desc') && (
            <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-medium">
              <i className={filters.sortDir === 'desc' ? 'ri-sort-desc text-[10px]' : 'ri-sort-asc text-[10px]'}></i>
              {SORT_OPTIONS.find(s => s.value === filters.sortField)?.label}
              <button onClick={() => { setFilter('sortField', 'created_at'); setFilter('sortDir', 'desc'); }} className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-zinc-700 cursor-pointer">
                <i className="ri-close-line text-[10px]"></i>
              </button>
            </span>
          )}
          {activeFilterCount > 1 && (
            <button onClick={resetFilters} className="text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer whitespace-nowrap">
              Limpiar todo
            </button>
          )}
        </div>
      )}

      {/* Stats row */}
      <div className="flex items-center gap-3 text-xs text-zinc-500">
        {!loading && total > 0 && (
          <>
            <span>Mostrando {from}–{to} de {total.toLocaleString()}</span>
            <span>·</span>
            <span>Página {page} de {totalPages}</span>
          </>
        )}
        {!loading && total === 0 && <span>Sin resultados</span>}
      </div>

      {/* Table */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        {/* Column headers */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-zinc-800 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          <div className="col-span-5">Entidad</div>
          <div className="col-span-2 hidden md:block">Tipo</div>
          <div className="col-span-2 hidden lg:block">Slug</div>
          <div className="col-span-2 hidden lg:block">
            <button
              onClick={() => {
                if (filters.sortField === 'item_count') {
                  setFilter('sortDir', filters.sortDir === 'desc' ? 'asc' : 'desc');
                } else {
                  setFilter('sortField', 'item_count');
                  setFilter('sortDir', 'desc');
                }
              }}
              className="flex items-center gap-1 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Ítems
              {filters.sortField === 'item_count' && (
                <i className={`${filters.sortDir === 'desc' ? 'ri-arrow-down-s-line' : 'ri-arrow-up-s-line'} text-white`}></i>
              )}
            </button>
          </div>
          <div className="col-span-7 md:col-span-3 lg:col-span-1 text-right">Acciones</div>
        </div>

        {loading ? (
          <SkeletonRows count={8} />
        ) : entities.length === 0 ? (
          <div className="py-16 text-center text-zinc-600">
            <i className="ri-user-star-line text-3xl mb-2 block"></i>
            <p className="text-sm">
              {total === 0 && !filters.search && filters.type === 'all'
                ? 'No hay entidades todavía — crea la primera'
                : 'No se encontraron entidades con estos filtros'}
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="mt-3 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Limpiar filtros
              </button>
            )}
            {total === 0 && !filters.search && filters.type === 'all' && (
              <button
                onClick={openCreate}
                className="mt-4 px-4 py-2 rounded-xl bg-white text-zinc-900 text-sm font-bold hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                Crear entidad
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-zinc-800" ref={actionRef}>
            {entities.map(entity => {
              const meta = TYPE_META[entity.type] ?? { icon: 'ri-user-line', color: '#71717a', label: entity.type };
              return (
                <div key={entity.id} className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-white/5 transition-colors">
                  {/* Entity */}
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    {entity.image ? (
                      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={entity.image} alt={entity.name} className="w-full h-full object-cover object-top" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${meta.color}20` }}>
                        <i className={`${meta.icon} text-base`} style={{ color: meta.color }}></i>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{entity.name}</p>
                      {entity.bio && (
                        <p className="text-xs text-zinc-500 truncate mt-0.5">{entity.bio}</p>
                      )}
                    </div>
                  </div>

                  {/* Type */}
                  <div className="col-span-2 hidden md:flex items-center gap-1.5">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className={`${meta.icon} text-sm`} style={{ color: meta.color }}></i>
                    </div>
                    <span className="text-xs text-zinc-400">{meta.label}</span>
                  </div>

                  {/* Slug */}
                  <div className="col-span-2 hidden lg:block">
                    <span className="text-xs text-zinc-600 font-mono truncate block">{entity.slug}</span>
                  </div>

                  {/* Item count */}
                  <div className="col-span-2 hidden lg:flex items-center gap-2">
                    <span className={`text-sm font-semibold ${entity.item_count > 0 ? 'text-white' : 'text-zinc-600'}`}>
                      {entity.item_count}
                    </span>
                    {entity.item_count > 0 && (
                      <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden max-w-16">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, (entity.item_count / Math.max(...entities.map(e => e.item_count), 1)) * 100)}%`,
                            background: meta.color,
                          }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-7 md:col-span-3 lg:col-span-1 flex items-center justify-end relative">
                    <button
                      onClick={() => setActionMenu(prev => prev === entity.id ? null : entity.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer"
                    >
                      <i className="ri-more-2-fill text-sm"></i>
                    </button>

                    {actionMenu === entity.id && (
                      <div className="absolute right-0 top-full mt-1 w-44 bg-zinc-800 rounded-xl border border-zinc-700 z-20 overflow-hidden">
                        <a
                          href={`/entity/${entity.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
                        >
                          <i className="ri-external-link-line"></i> Ver página
                        </a>
                        <button
                          onClick={() => openEdit(entity)}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer text-left"
                        >
                          <i className="ri-edit-line"></i> Editar
                        </button>
                        <button
                          onClick={() => { setDeleteConfirm(entity.id); setActionMenu(null); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-700 transition-colors cursor-pointer text-left"
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
            {from}–{to} de {total.toLocaleString()} entidades
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Primera página"
            >
              <i className="ri-skip-back-line text-xs"></i>
            </button>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <i className="ri-arrow-left-s-line"></i>
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p: number;
                if (totalPages <= 5) {
                  p = i + 1;
                } else if (page <= 3) {
                  p = i + 1;
                } else if (page >= totalPages - 2) {
                  p = totalPages - 4 + i;
                } else {
                  p = page - 2 + i;
                }
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      p === page
                        ? 'bg-white text-zinc-900'
                        : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <i className="ri-arrow-right-s-line"></i>
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Última página"
            >
              <i className="ri-skip-forward-line text-xs"></i>
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDeleteConfirm(null)}></div>
          <div className="relative z-10 bg-zinc-900 rounded-2xl border border-zinc-800 p-6 w-full max-w-sm">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <i className="ri-delete-bin-line text-red-400 text-xl"></i>
            </div>
            <h3 className="text-white font-bold text-center mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ¿Eliminar entidad?
            </h3>
            <p className="text-zinc-400 text-sm text-center mb-6">
              Se eliminarán también todas sus relaciones con ítems del catálogo. Esta acción no se puede deshacer.
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
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit modal */}
      {modalOpen && (
        <EntityModal
          editTarget={editTarget}
          saving={saving}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
