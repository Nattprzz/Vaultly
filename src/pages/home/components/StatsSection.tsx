import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface StatItem {
  label: string;
  value: string;
  icon: string;
}

export default function StatsSection() {
  const [stats, setStats] = useState<StatItem[]>([
    { label: 'Ítems en catálogo', value: '0', icon: 'ri-database-2-line' },
    { label: 'Usuarios activos', value: '0', icon: 'ri-user-heart-line' },
    { label: 'Reseñas escritas', value: '0', icon: 'ri-quill-pen-line' },
    { label: 'Trackers creados', value: '0', icon: 'ri-bar-chart-box-line' },
  ]);

  useEffect(() => {
    const load = async () => {
      const [items, users, reviews, trackers] = await Promise.all([
        supabase.from('catalog_items').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('user_item_tracking').select('id', { count: 'exact', head: true }).not('review', 'is', null).neq('review', ''),
        supabase.from('user_item_tracking').select('id', { count: 'exact', head: true }),
      ]);

      setStats([
        { label: 'Ítems en catálogo', value: (items.count ?? 0).toLocaleString(), icon: 'ri-database-2-line' },
        { label: 'Usuarios activos', value: (users.count ?? 0).toLocaleString(), icon: 'ri-user-heart-line' },
        { label: 'Reseñas escritas', value: (reviews.count ?? 0).toLocaleString(), icon: 'ri-quill-pen-line' },
        { label: 'Trackers creados', value: (trackers.count ?? 0).toLocaleString(), icon: 'ri-bar-chart-box-line' },
      ]);
    };

    void load();
  }, []);

  return (
    <section className="py-20 px-4 md:px-6 bg-zinc-900 dark:bg-zinc-950">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(stat => (
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
