import { STATS } from '@/mocks/catalog';

export default function StatsSection() {
  return (
    <section className="py-20 px-4 md:px-6 bg-zinc-900 dark:bg-zinc-950">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map(stat => (
            <div key={stat.label} className="text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 mx-auto mb-4">
                <i className={`${stat.icon} text-white text-xl`}></i>
              </div>
              <p className="text-3xl md:text-4xl font-black text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {stat.value}
              </p>
              <p className="text-zinc-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
