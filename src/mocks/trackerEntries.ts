import { TrackerEntry } from '@/hooks/useTracker';

const NULL_GAME_FIELDS = {
  playingPlatform: null,
  hoursPlayed: null,
  startedAt: null,
  finishedAt: null,
  achievementsUnlocked: null,
} as const;

// Pre-loaded mock tracker entries — realistic data to show the tracker populated
export const MOCK_TRACKER_ENTRIES: Record<string, Omit<TrackerEntry, 'catalogItemId' | 'metadata' | 'title' | 'cover' | 'year' | 'genre'>> = {
  g1: {
    ...NULL_GAME_FIELDS,
    itemId: 'g1', category: 'games', status: 'completed',
    rating: 10, review: 'Una obra maestra absoluta. El mundo abierto más impresionante que he jugado.',
    addedAt: '2024-01-10T10:00:00Z', updatedAt: '2024-03-15T18:30:00Z',
  },
  g2: {
    ...NULL_GAME_FIELDS,
    itemId: 'g2', category: 'games', status: 'playing',
    rating: null, review: '',
    addedAt: '2024-03-01T09:00:00Z', updatedAt: '2024-04-01T20:00:00Z',
  },
  g3: {
    ...NULL_GAME_FIELDS,
    itemId: 'g3', category: 'games', status: 'completed',
    rating: 9, review: 'Narrativa brutal y combates espectaculares.',
    addedAt: '2023-11-10T10:00:00Z', updatedAt: '2023-12-20T16:00:00Z',
  },
  g4: {
    ...NULL_GAME_FIELDS,
    itemId: 'g4', category: 'games', status: 'completed',
    rating: 8, review: 'Tras los parches es un juegazo. Night City es increíble.',
    addedAt: '2022-06-01T10:00:00Z', updatedAt: '2022-09-10T14:00:00Z',
  },
  g5: {
    ...NULL_GAME_FIELDS,
    itemId: 'g5', category: 'games', status: 'pending',
    rating: null, review: '',
    addedAt: '2024-02-14T10:00:00Z', updatedAt: '2024-02-14T10:00:00Z',
  },
  g6: {
    ...NULL_GAME_FIELDS,
    itemId: 'g6', category: 'games', status: 'completed',
    rating: 10, review: 'La mejor narrativa de la historia de los videojuegos. Arthur Morgan es un personaje inolvidable.',
    addedAt: '2023-05-01T10:00:00Z', updatedAt: '2023-07-20T22:00:00Z',
  },
  m1: {
    ...NULL_GAME_FIELDS,
    itemId: 'm1', category: 'movies', status: 'watched',
    rating: 9, review: 'Villeneuve lo ha vuelto a hacer. Épica visual sin igual.',
    addedAt: '2024-03-01T10:00:00Z', updatedAt: '2024-03-05T21:00:00Z',
  },
  m2: {
    ...NULL_GAME_FIELDS,
    itemId: 'm2', category: 'movies', status: 'watched',
    rating: 9, review: 'Cillian Murphy está soberbio. Una película que te deja pensando días.',
    addedAt: '2023-07-21T10:00:00Z', updatedAt: '2023-07-22T23:00:00Z',
  },
  m3: {
    ...NULL_GAME_FIELDS,
    itemId: 'm3', category: 'movies', status: 'watched',
    rating: 10, review: 'La película más original que he visto en años. Absolutamente genial.',
    addedAt: '2023-01-10T10:00:00Z', updatedAt: '2023-01-11T22:00:00Z',
  },
  m4: {
    ...NULL_GAME_FIELDS,
    itemId: 'm4', category: 'movies', status: 'watched',
    rating: 8, review: 'La mejor versión de Batman en cine. Oscura y atmosférica.',
    addedAt: '2022-03-05T10:00:00Z', updatedAt: '2022-03-06T23:00:00Z',
  },
  m5: {
    ...NULL_GAME_FIELDS,
    itemId: 'm5', category: 'movies', status: 'watched',
    rating: 10, review: 'Obra maestra del cine contemporáneo. Bong Joon-ho es un genio.',
    addedAt: '2022-10-01T10:00:00Z', updatedAt: '2022-10-02T22:00:00Z',
  },
  m6: {
    ...NULL_GAME_FIELDS,
    itemId: 'm6', category: 'movies', status: 'pending',
    rating: null, review: '',
    addedAt: '2024-01-05T10:00:00Z', updatedAt: '2024-01-05T10:00:00Z',
  },
  s1: {
    ...NULL_GAME_FIELDS,
    itemId: 's1', category: 'series', status: 'watching',
    rating: null, review: '',
    addedAt: '2024-02-01T10:00:00Z', updatedAt: '2024-04-10T20:00:00Z',
  },
  s2: {
    ...NULL_GAME_FIELDS,
    itemId: 's2', category: 'series', status: 'watched',
    rating: 9, review: 'La serie más original de los últimos años. Cada episodio te deja con la boca abierta.',
    addedAt: '2023-09-01T10:00:00Z', updatedAt: '2023-10-15T22:00:00Z',
  },
  s3: {
    ...NULL_GAME_FIELDS,
    itemId: 's3', category: 'series', status: 'abandoned',
    rating: 6, review: 'Empezó bien pero perdió fuerza. La dejé en la segunda temporada.',
    addedAt: '2022-08-21T10:00:00Z', updatedAt: '2023-02-10T20:00:00Z',
  },
  s4: {
    ...NULL_GAME_FIELDS,
    itemId: 's4', category: 'series', status: 'pending',
    rating: null, review: '',
    addedAt: '2024-04-01T10:00:00Z', updatedAt: '2024-04-01T10:00:00Z',
  },
  b1: {
    ...NULL_GAME_FIELDS,
    itemId: 'b1', category: 'books', status: 'reading',
    rating: null, review: '',
    addedAt: '2024-03-20T10:00:00Z', updatedAt: '2024-04-08T21:00:00Z',
  },
  b2: {
    ...NULL_GAME_FIELDS,
    itemId: 'b2', category: 'books', status: 'read',
    rating: 10, review: 'El libro de ciencia ficción más influyente jamás escrito. Imprescindible.',
    addedAt: '2023-06-01T10:00:00Z', updatedAt: '2023-08-10T22:00:00Z',
  },
  b3: {
    ...NULL_GAME_FIELDS,
    itemId: 'b3', category: 'books', status: 'read',
    rating: 9, review: 'Perturbador y profético. Más relevante hoy que cuando se escribió.',
    addedAt: '2022-11-01T10:00:00Z', updatedAt: '2022-12-05T21:00:00Z',
  },
  c1: {
    ...NULL_GAME_FIELDS,
    itemId: 'c1', category: 'concerts', status: 'attended',
    rating: 10, review: 'El mejor concierto de mi vida. 3 horas de pura magia. Absolutamente impresionante.',
    addedAt: '2024-05-29T10:00:00Z', updatedAt: '2024-05-30T02:00:00Z',
  },
  c2: {
    ...NULL_GAME_FIELDS,
    itemId: 'c2', category: 'concerts', status: 'wishlist',
    rating: null, review: '',
    addedAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z',
  },
};
