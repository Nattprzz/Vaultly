export default function CompanyLoadingState() {
  return (
    <div className="min-h-screen bg-[var(--bg)] animate-pulse">
      <div className="h-64 bg-zinc-200 dark:bg-zinc-800" />
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10 space-y-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div className="space-y-4">
            <div className="h-48 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-40 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="h-64 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
