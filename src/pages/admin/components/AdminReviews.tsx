import { useState } from 'react';
import { ADMIN_REVIEWS, AdminReview } from '@/mocks/admin';
import { CATEGORIES } from '@/mocks/catalog';

const STATUS_BADGE: Record<AdminReview['status'], string> = {
  approved: 'bg-emerald-500/20 text-emerald-400',
  pending:  'bg-amber-500/20 text-amber-400',
  rejected: 'bg-rose-500/20 text-rose-400',
};
const STATUS_LABEL: Record<AdminReview['status'], string> = {
  approved: 'Aprobada', pending: 'Pendiente', rejected: 'Rechazada',
};

export default function AdminReviews() {
  const [reviews, setReviews] = useState(ADMIN_REVIEWS);
  const [statusFilter, setStatusFilter] = useState<AdminReview['status'] | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = reviews.filter(r => {
    const matchSearch = r.user.toLowerCase().includes(search.toLowerCase()) ||
      r.item.toLowerCase().includes(search.toLowerCase()) ||
      r.body.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, status: AdminReview['status']) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const pending = reviews.filter(r => r.status === 'pending').length;

  return (
    <div className="flex flex-col gap-5">
      {/* Alert for pending */}
      {pending > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <i className="ri-error-warning-line text-amber-400 text-xl flex-shrink-0"></i>
          <div>
            <p className="text-sm font-semibold text-amber-300">{pending} reseña{pending > 1 ? 's' : ''} pendiente{pending > 1 ? 's' : ''} de moderación</p>
            <p className="text-xs text-amber-500/70">Revisa y aprueba o rechaza las reseñas pendientes.</p>
          </div>
          <button
            onClick={() => setStatusFilter('pending')}
            className="ml-auto px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-semibold hover:bg-amber-500/30 transition-colors cursor-pointer whitespace-nowrap"
          >
            Ver pendientes
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm"></i>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por usuario, ítem o contenido..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          />
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-white text-zinc-900'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {s === 'all' ? 'Todas' : STATUS_LABEL[s]}
              {s === 'pending' && pending > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-xs">{pending}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <div className="flex flex-col gap-3">
        {filtered.map(review => {
          const cat = CATEGORIES.find(c => c.id === review.category);
          return (
            <div
              key={review.id}
              className={`bg-zinc-900 rounded-2xl border p-5 transition-all ${
                review.status === 'pending'
                  ? 'border-amber-500/30'
                  : review.status === 'rejected'
                  ? 'border-rose-500/20'
                  : 'border-zinc-800'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: review.userAccent }}
                  >
                    {review.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{review.user}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-zinc-500">sobre</span>
                      <span className="text-xs font-medium text-zinc-300">{review.item}</span>
                      {cat && (
                        <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: `${cat.accent}20`, color: cat.accent }}>
                          <i className={`${cat.icon} mr-0.5`}></i>{cat.label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {review.reports > 0 && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-semibold">
                      <i className="ri-flag-line"></i>
                      {review.reports} reportes
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    <i className="ri-star-fill text-amber-400 text-sm"></i>
                    <span className="text-sm font-bold text-white">{review.rating}</span>
                    <span className="text-xs text-zinc-500">/10</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_BADGE[review.status]}`}>
                    {STATUS_LABEL[review.status]}
                  </span>
                </div>
              </div>

              {/* Body */}
              <p className={`text-sm leading-relaxed mb-4 ${
                review.status === 'rejected' ? 'text-zinc-600 line-through' : 'text-zinc-400'
              }`}>
                &ldquo;{review.body}&rdquo;
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600">{review.date}</span>
                <div className="flex items-center gap-2">
                  {review.status !== 'approved' && (
                    <button
                      onClick={() => updateStatus(review.id, 'approved')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/30 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-checkbox-circle-line"></i>
                      Aprobar
                    </button>
                  )}
                  {review.status !== 'rejected' && (
                    <button
                      onClick={() => updateStatus(review.id, 'rejected')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-semibold hover:bg-rose-500/30 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-close-circle-line"></i>
                      Rechazar
                    </button>
                  )}
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-700 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <i className="ri-delete-bin-line text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-zinc-600">
            <i className="ri-quill-pen-line text-3xl mb-2 block"></i>
            <p className="text-sm">No se encontraron reseñas</p>
          </div>
        )}
      </div>
    </div>
  );
}
