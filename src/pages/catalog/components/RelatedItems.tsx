import { Link } from 'react-router-dom';
import { CATALOG_MOCK, CATEGORIES } from '@/mocks/catalog';

interface Props {
  category: string;
  currentId: string;
}

export default function RelatedItems({ category, currentId }: Props) {
  const items = (CATALOG_MOCK[category] ?? []).filter(i => i.id !== currentId).slice(0, 5);
  const cat = CATEGORIES.find(c => c.id === category);

  if (items.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-6 h-6 flex items-center justify-center rounded-lg flex-shrink-0"
          style={{ background: `${cat?.accent}20` }}
        >
          <i className={`${cat?.icon} text-xs`} style={{ color: cat?.accent }}></i>
        </div>
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Más en {cat?.label}</h2>
      </div>

      <div className="flex flex-col gap-3">
        {items.map(item => (
          <Link
            key={item.id}
            to={`/catalog/${category}/${item.id}`}
            className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
          >
            <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-800">
              <img
                src={item.cover}
                alt={item.title}
                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-white leading-tight line-clamp-2 mb-1 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-zinc-500">{item.year} · {item.genre}</p>
              <div className="flex items-center gap-1 mt-1">
                <i className="ri-star-fill text-amber-400 text-xs"></i>
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{item.rating}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link
        to={`/catalog`}
        className="flex items-center justify-center gap-1.5 mt-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
      >
        Ver más en {cat?.label}
        <i className="ri-arrow-right-line"></i>
      </Link>
    </div>
  );
}
