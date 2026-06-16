import { Link } from 'react-router-dom';

interface Props {
  error: string | null;
}

export default function CompanyErrorState({ error }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 pt-14 text-center md:pt-0 md:pl-64">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <i className="ri-building-4-line text-3xl text-[var(--text-tertiary)]" />
      </div>
      <div>
        <p className="text-lg font-bold text-[var(--text-primary)]">Compañía no encontrada</p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {error ?? 'No hay una compañía con este slug en Supabase.'}
        </p>
      </div>
      <Link
        to="/catalog"
        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-brand-dark"
      >
        <i className="ri-arrow-left-line" />
        Volver al catálogo
      </Link>
    </div>
  );
}
