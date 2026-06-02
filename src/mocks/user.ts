export const MOCK_USER = {
  id: 'user-001',
  username: 'nacho_p',
  display_name: 'Nacho P.',
  initials: 'NP',
  avatar_url: '',
  bio: 'Amante del cine, los videojuegos y los libros de ciencia ficción.',
  active_categories: ['games', 'movies', 'series', 'books'],
  is_admin: false,
  is_public: true,
};

export const MOCK_DASHBOARD_STATS = {
  total_tracked: 47,
  completed: 23,
  in_progress: 12,
  pending: 8,
  dropped: 4,
  avg_rating: 8.4,
  reviews_written: 18,
  by_category: {
    games: { total: 15, completed: 8 },
    movies: { total: 18, completed: 12 },
    series: { total: 9, completed: 3 },
    books: { total: 5, completed: 0 },
  },
};

export const MOCK_RECENT_ACTIVITY = [
  { id: 'a1', action: 'Completó', item: 'Elden Ring', category: 'games', time: 'Hace 2 horas', icon: 'ri-gamepad-line' },
  { id: 'a2', action: 'Añadió a pendientes', item: 'Shogun', category: 'series', time: 'Hace 1 día', icon: 'ri-tv-2-line' },
  { id: 'a3', action: 'Reseñó', item: 'Dune: Parte II', category: 'movies', time: 'Hace 2 días', icon: 'ri-film-line' },
  { id: 'a4', action: 'Empezó a leer', item: 'El Problema de los Tres Cuerpos', category: 'books', time: 'Hace 3 días', icon: 'ri-book-open-line' },
  { id: 'a5', action: 'Puntuó con 9/10', item: 'Severance', category: 'series', time: 'Hace 5 días', icon: 'ri-tv-2-line' },
];
