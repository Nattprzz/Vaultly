export interface AdminUser {
  id: string;
  username: string;
  display_name: string;
  initials: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended' | 'pending';
  joined: string;
  last_active: string;
  tracked_items: number;
  reviews: number;
  accent: string;
}

export interface AdminCatalogItem {
  id: string;
  title: string;
  category: string;
  genre: string;
  year: number;
  rating: number;
  cover: string;
  source: 'api' | 'manual';
  status: 'published' | 'draft' | 'flagged';
  total_tracked: number;
  added: string;
}

export interface AdminReview {
  id: string;
  user: string;
  initials: string;
  userAccent: string;
  item: string;
  category: string;
  rating: number;
  body: string;
  status: 'approved' | 'pending' | 'rejected';
  date: string;
  reports: number;
}

export const ADMIN_STATS = {
  total_users: 24847,
  new_users_week: 312,
  total_items: 51550,
  new_items_week: 84,
  total_reviews: 138200,
  pending_reviews: 23,
  total_tracked: 67200,
  active_today: 1842,
};

export const ADMIN_WEEKLY_SIGNUPS = [
  { day: 'L', count: 38 },
  { day: 'M', count: 52 },
  { day: 'X', count: 44 },
  { day: 'J', count: 61 },
  { day: 'V', count: 78 },
  { day: 'S', count: 95 },
  { day: 'D', count: 67 },
];

export const ADMIN_USERS: AdminUser[] = [
  { id: 'u1', username: 'nacho_p', display_name: 'Nacho P.', initials: 'NP', email: 'nacho@example.com', role: 'admin', status: 'active', joined: '2024-01-10', last_active: 'Hace 2 horas', tracked_items: 47, reviews: 18, accent: '#8b5cf6' },
  { id: 'u2', username: 'maria_g', display_name: 'María García', initials: 'MG', email: 'maria@example.com', role: 'user', status: 'active', joined: '2024-01-15', last_active: 'Hace 1 día', tracked_items: 63, reviews: 31, accent: '#f43f5e' },
  { id: 'u3', username: 'carlos_m', display_name: 'Carlos Martínez', initials: 'CM', email: 'carlos@example.com', role: 'user', status: 'active', joined: '2024-02-03', last_active: 'Hace 3 días', tracked_items: 28, reviews: 9, accent: '#10b981' },
  { id: 'u4', username: 'laura_s', display_name: 'Laura Sánchez', initials: 'LS', email: 'laura@example.com', role: 'user', status: 'active', joined: '2024-02-18', last_active: 'Hace 5 horas', tracked_items: 91, reviews: 44, accent: '#f59e0b' },
  { id: 'u5', username: 'pedro_r', display_name: 'Pedro Ruiz', initials: 'PR', email: 'pedro@example.com', role: 'user', status: 'suspended', joined: '2024-03-01', last_active: 'Hace 2 semanas', tracked_items: 12, reviews: 3, accent: '#0ea5e9' },
  { id: 'u6', username: 'ana_l', display_name: 'Ana López', initials: 'AL', email: 'ana@example.com', role: 'user', status: 'active', joined: '2024-03-12', last_active: 'Hace 1 hora', tracked_items: 55, reviews: 22, accent: '#ec4899' },
  { id: 'u7', username: 'javier_f', display_name: 'Javier Fernández', initials: 'JF', email: 'javier@example.com', role: 'user', status: 'pending', joined: '2024-04-01', last_active: 'Nunca', tracked_items: 0, reviews: 0, accent: '#6366f1' },
  { id: 'u8', username: 'sofia_m', display_name: 'Sofía Moreno', initials: 'SM', email: 'sofia@example.com', role: 'user', status: 'active', joined: '2024-04-05', last_active: 'Hace 30 min', tracked_items: 34, reviews: 15, accent: '#14b8a6' },
];

export const ADMIN_CATALOG_ITEMS: AdminCatalogItem[] = [
  { id: 'g1', title: 'Elden Ring', category: 'games', genre: 'RPG', year: 2022, rating: 9.4, cover: 'https://readdy.ai/api/search-image?query=Elden%20Ring%20fantasy%20dark%20souls%20epic%20landscape%20golden%20tree%20dramatic%20sky%20cinematic%20game%20art%20dark%20moody&width=60&height=80&seq=adm-g1&orientation=portrait', source: 'api', status: 'published', total_tracked: 4820, added: '2024-01-10' },
  { id: 'g2', title: "Baldur's Gate 3", category: 'games', genre: 'RPG', year: 2023, rating: 9.6, cover: 'https://readdy.ai/api/search-image?query=fantasy%20RPG%20dark%20dungeon%20magic%20spell%20dramatic%20lighting%20epic%20game%20art%20dark%20purple%20tones%20cinematic&width=60&height=80&seq=adm-g2&orientation=portrait', source: 'api', status: 'published', total_tracked: 5210, added: '2024-01-12' },
  { id: 'm1', title: 'Dune: Parte II', category: 'movies', genre: 'Sci-Fi', year: 2024, rating: 8.8, cover: 'https://readdy.ai/api/search-image?query=Dune%20desert%20planet%20sci-fi%20epic%20sand%20dunes%20dramatic%20sky%20cinematic%20movie%20poster%20warm%20tones&width=60&height=80&seq=adm-m1&orientation=portrait', source: 'api', status: 'published', total_tracked: 6240, added: '2024-03-01' },
  { id: 'm2', title: 'Oppenheimer', category: 'movies', genre: 'Drama', year: 2023, rating: 8.9, cover: 'https://readdy.ai/api/search-image?query=atomic%20bomb%20explosion%20dramatic%20fire%20mushroom%20cloud%20dark%20cinematic%20historical%20movie%20poster&width=60&height=80&seq=adm-m2&orientation=portrait', source: 'api', status: 'published', total_tracked: 7120, added: '2023-07-21' },
  { id: 's1', title: 'The Last of Us', category: 'series', genre: 'Drama', year: 2023, rating: 9.1, cover: 'https://readdy.ai/api/search-image?query=post%20apocalyptic%20city%20overgrown%20nature%20dramatic%20lighting%20dark%20moody%20atmosphere%20cinematic%20series%20poster&width=60&height=80&seq=adm-s1&orientation=portrait', source: 'api', status: 'published', total_tracked: 5870, added: '2023-01-15' },
  { id: 's2', title: 'Severance', category: 'series', genre: 'Thriller', year: 2022, rating: 9.0, cover: 'https://readdy.ai/api/search-image?query=corporate%20office%20surreal%20minimalist%20dark%20thriller%20dramatic%20lighting%20cinematic%20series%20poster&width=60&height=80&seq=adm-s2&orientation=portrait', source: 'api', status: 'published', total_tracked: 4410, added: '2022-02-18' },
  { id: 'b1', title: 'El Problema de los Tres Cuerpos', category: 'books', genre: 'Sci-Fi', year: 2008, rating: 9.0, cover: 'https://readdy.ai/api/search-image?query=science%20fiction%20book%20cover%20space%20stars%20three%20body%20problem%20cosmic%20dark%20background%20artistic%20illustration&width=60&height=80&seq=adm-b1&orientation=portrait', source: 'manual', status: 'published', total_tracked: 3820, added: '2024-01-20' },
  { id: 'c1', title: 'Taylor Swift — Eras Tour', category: 'concerts', genre: 'Pop', year: 2024, rating: 9.7, cover: 'https://readdy.ai/api/search-image?query=concert%20stage%20spectacular%20lights%20show%20performer%20crowd%20energy%20colorful%20beams%20dramatic%20atmosphere%20music%20event&width=60&height=80&seq=adm-c1&orientation=portrait', source: 'api', status: 'flagged', total_tracked: 2980, added: '2024-05-01' },
];

export const ADMIN_REVIEWS: AdminReview[] = [
  { id: 'r1', user: 'María García', initials: 'MG', userAccent: '#f43f5e', item: 'Elden Ring', category: 'games', rating: 10, body: 'Una obra maestra absoluta. Nunca pensé que un videojuego pudiera emocionarme tanto. La narrativa, el mundo, los personajes... todo es perfecto.', status: 'approved', date: '2024-04-10', reports: 0 },
  { id: 'r2', user: 'Carlos Martínez', initials: 'CM', userAccent: '#10b981', item: 'Dune: Parte II', category: 'movies', rating: 9, body: 'Villeneuve lo ha vuelto a hacer. Épica visual sin igual. La mejor película del año sin duda.', status: 'approved', date: '2024-04-08', reports: 0 },
  { id: 'r3', user: 'Pedro Ruiz', initials: 'PR', userAccent: '#0ea5e9', item: 'Taylor Swift — Eras Tour', category: 'concerts', rating: 2, body: 'Contenido inapropiado que viola las normas de la comunidad. Este texto ha sido reportado múltiples veces por usuarios.', status: 'pending', date: '2024-04-12', reports: 7 },
  { id: 'r4', user: 'Laura Sánchez', initials: 'LS', userAccent: '#f59e0b', item: 'Severance', category: 'series', rating: 10, body: 'La serie más original de los últimos años. Cada episodio te deja con la boca abierta. Adam Scott está increíble.', status: 'approved', date: '2024-04-07', reports: 0 },
  { id: 'r5', user: 'Ana López', initials: 'AL', userAccent: '#ec4899', item: "Baldur's Gate 3", category: 'games', rating: 9, body: 'El mejor RPG que he jugado en años. La libertad de elección es increíble y la historia te engancha desde el primer momento.', status: 'pending', date: '2024-04-11', reports: 0 },
  { id: 'r6', user: 'Sofía Moreno', initials: 'SM', userAccent: '#14b8a6', item: 'Oppenheimer', category: 'movies', rating: 8, body: 'Cillian Murphy está soberbio. Una película que te deja pensando días. Nolan en su mejor momento.', status: 'approved', date: '2024-04-05', reports: 0 },
  { id: 'r7', user: 'Javier Fernández', initials: 'JF', userAccent: '#6366f1', item: 'The Last of Us', category: 'series', rating: 1, body: 'Spam y contenido no relacionado con el ítem. Reportado por varios usuarios de la comunidad.', status: 'rejected', date: '2024-04-09', reports: 12 },
];

export type ReportStatus = 'pending' | 'resolved' | 'dismissed';
export type ReportReason = 'Información incorrecta' | 'Imagen equivocada' | 'Título o año erróneo' | 'Contenido duplicado' | 'Descripción inapropiada' | 'Otro';

export interface AdminReport {
  id: string;
  item_id: string;
  item_title: string;
  item_category: string;
  item_cover: string;
  reason: ReportReason;
  details: string;
  reported_at: string;
  status: ReportStatus;
  resolved_at?: string;
  resolved_note?: string;
}

export const ADMIN_REPORTS: AdminReport[] = [
  {
    id: 'rep1',
    item_id: 'g1',
    item_title: 'Elden Ring',
    item_category: 'videojuegos',
    item_cover: 'https://readdy.ai/api/search-image?query=Elden%20Ring%20fantasy%20dark%20souls%20epic%20landscape%20golden%20tree%20dramatic%20sky%20cinematic%20game%20art%20dark%20moody&width=60&height=80&seq=adm-g1&orientation=portrait',
    reason: 'Información incorrecta',
    details: 'El año de lanzamiento aparece como 2021 pero fue lanzado en febrero de 2022.',
    reported_at: '2026-04-13T10:22:00Z',
    status: 'pending',
  },
  {
    id: 'rep2',
    item_id: 'm1',
    item_title: 'Dune: Parte II',
    item_category: 'películas',
    item_cover: 'https://readdy.ai/api/search-image?query=Dune%20desert%20planet%20sci-fi%20epic%20sand%20dunes%20dramatic%20sky%20cinematic%20movie%20poster%20warm%20tones&width=60&height=80&seq=adm-m1&orientation=portrait',
    reason: 'Imagen equivocada',
    details: 'La portada que aparece es de la primera parte, no de la segunda.',
    reported_at: '2026-04-13T14:05:00Z',
    status: 'pending',
  },
  {
    id: 'rep3',
    item_id: 's2',
    item_title: 'Severance',
    item_category: 'series',
    item_cover: 'https://readdy.ai/api/search-image?query=corporate%20office%20surreal%20minimalist%20dark%20thriller%20dramatic%20lighting%20cinematic%20series%20poster&width=60&height=80&seq=adm-s2&orientation=portrait',
    reason: 'Título o año erróneo',
    details: 'La temporada 2 salió en 2025, no en 2022. Hay que separar las temporadas o actualizar el año.',
    reported_at: '2026-04-12T09:30:00Z',
    status: 'resolved',
    resolved_at: '2026-04-12T11:00:00Z',
    resolved_note: 'Año actualizado a 2025 en la ficha.',
  },
  {
    id: 'rep4',
    item_id: 'b1',
    item_title: 'El Problema de los Tres Cuerpos',
    item_category: 'libros',
    item_cover: 'https://readdy.ai/api/search-image?query=science%20fiction%20book%20cover%20space%20stars%20three%20body%20problem%20cosmic%20dark%20background%20artistic%20illustration&width=60&height=80&seq=adm-b1&orientation=portrait',
    reason: 'Descripción inapropiada',
    details: 'La sinopsis contiene spoilers importantes del final del libro sin ningún aviso.',
    reported_at: '2026-04-11T18:44:00Z',
    status: 'pending',
  },
  {
    id: 'rep5',
    item_id: 'c1',
    item_title: 'Taylor Swift — Eras Tour',
    item_category: 'conciertos',
    item_cover: 'https://readdy.ai/api/search-image?query=concert%20stage%20spectacular%20lights%20show%20performer%20crowd%20energy%20colorful%20beams%20dramatic%20atmosphere%20music%20event&width=60&height=80&seq=adm-c1&orientation=portrait',
    reason: 'Contenido duplicado',
    details: 'Este ítem está duplicado, ya existe otro con el mismo nombre en la categoría de conciertos.',
    reported_at: '2026-04-10T20:15:00Z',
    status: 'dismissed',
    resolved_at: '2026-04-11T08:00:00Z',
    resolved_note: 'No es duplicado, son ediciones distintas del tour.',
  },
  {
    id: 'rep6',
    item_id: 'g2',
    item_title: "Baldur's Gate 3",
    item_category: 'videojuegos',
    item_cover: 'https://readdy.ai/api/search-image?query=fantasy%20RPG%20dark%20dungeon%20magic%20spell%20dramatic%20lighting%20epic%20game%20art%20dark%20purple%20tones%20cinematic&width=60&height=80&seq=adm-g2&orientation=portrait',
    reason: 'Otro',
    details: 'Falta el estudio desarrollador (Larian Studios) en la ficha del juego.',
    reported_at: '2026-04-09T12:00:00Z',
    status: 'resolved',
    resolved_at: '2026-04-09T15:30:00Z',
    resolved_note: 'Entidad de Larian Studios añadida y vinculada al ítem.',
  },
  {
    id: 'rep7',
    item_id: 'm2',
    item_title: 'Oppenheimer',
    item_category: 'películas',
    item_cover: 'https://readdy.ai/api/search-image?query=atomic%20bomb%20explosion%20dramatic%20fire%20mushroom%20cloud%20dark%20cinematic%20historical%20movie%20poster&width=60&height=80&seq=adm-m2&orientation=portrait',
    reason: 'Información incorrecta',
    details: 'La duración indicada es de 150 minutos pero la película dura 180 minutos.',
    reported_at: '2026-04-08T16:20:00Z',
    status: 'pending',
  },
];

export const ADMIN_ACTIVITY_LOG = [
  { id: 'l1', action: 'Usuario registrado', detail: '@sofia_m se unió a Vaultly', time: 'Hace 30 min', icon: 'ri-user-add-line', color: 'text-emerald-500' },
  { id: 'l2', action: 'Reseña reportada', detail: 'Reseña de @pedro_r en "Eras Tour" — 7 reportes', time: 'Hace 1 hora', icon: 'ri-flag-line', color: 'text-rose-500' },
  { id: 'l3', action: 'Ítem añadido', detail: '"Shogun" añadido al catálogo de Series', time: 'Hace 2 horas', icon: 'ri-add-circle-line', color: 'text-violet-500' },
  { id: 'l4', action: 'Usuario suspendido', detail: '@pedro_r suspendido por comportamiento', time: 'Hace 3 horas', icon: 'ri-user-forbid-line', color: 'text-amber-500' },
  { id: 'l5', action: 'Reseña rechazada', detail: 'Reseña de @javier_f eliminada por spam', time: 'Hace 5 horas', icon: 'ri-delete-bin-line', color: 'text-rose-500' },
  { id: 'l6', action: 'Nuevo récord', detail: '1.842 usuarios activos hoy — nuevo máximo', time: 'Hace 6 horas', icon: 'ri-trophy-line', color: 'text-amber-400' },
];
