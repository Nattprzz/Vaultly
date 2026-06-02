import { TrackerEntry } from '@/hooks/useTracker';

// Pre-loaded mock tracker entries — realistic data to show the tracker populated
export const MOCK_TRACKER_ENTRIES: Record<string, TrackerEntry> = {
  g1: {
    itemId: 'g1', category: 'games', status: 'completed',
    rating: 10, review: 'Una obra maestra absoluta. El mundo abierto más impresionante que he jugado.',
    addedAt: '2024-01-10T10:00:00Z', updatedAt: '2024-03-15T18:30:00Z',
  },
  g2: {
    itemId: 'g2', category: 'games', status: 'in_progress',
    rating: null, review: '',
    addedAt: '2024-03-01T09:00:00Z', updatedAt: '2024-04-01T20:00:00Z',
  },
  g3: {
    itemId: 'g3', category: 'games', status: 'completed',
    rating: 9, review: 'Narrativa brutal y combates espectaculares.',
    addedAt: '2023-11-10T10:00:00Z', updatedAt: '2023-12-20T16:00:00Z',
  },
  g4: {
    itemId: 'g4', category: 'games', status: 'completed',
    rating: 8, review: 'Tras los parches es un juegazo. Night City es increíble.',
    addedAt: '2022-06-01T10:00:00Z', updatedAt: '2022-09-10T14:00:00Z',
  },
  g5: {
    itemId: 'g5', category: 'games', status: 'pending',
    rating: null, review: '',
    addedAt: '2024-02-14T10:00:00Z', updatedAt: '2024-02-14T10:00:00Z',
  },
  g6: {
    itemId: 'g6', category: 'games', status: 'completed',
    rating: 10, review: 'La mejor narrativa de la historia de los videojuegos. Arthur Morgan es un personaje inolvidable.',
    addedAt: '2023-05-01T10:00:00Z', updatedAt: '2023-07-20T22:00:00Z',
  },
  m1: {
    itemId: 'm1', category: 'movies', status: 'completed',
    rating: 9, review: 'Villeneuve lo ha vuelto a hacer. Épica visual sin igual.',
    addedAt: '2024-03-01T10:00:00Z', updatedAt: '2024-03-05T21:00:00Z',
  },
  m2: {
    itemId: 'm2', category: 'movies', status: 'completed',
    rating: 9, review: 'Cillian Murphy está soberbio. Una película que te deja pensando días.',
    addedAt: '2023-07-21T10:00:00Z', updatedAt: '2023-07-22T23:00:00Z',
  },
  m3: {
    itemId: 'm3', category: 'movies', status: 'completed',
    rating: 10, review: 'La película más original que he visto en años. Absolutamente genial.',
    addedAt: '2023-01-10T10:00:00Z', updatedAt: '2023-01-11T22:00:00Z',
  },
  m4: {
    itemId: 'm4', category: 'movies', status: 'completed',
    rating: 8, review: 'La mejor versión de Batman en cine. Oscura y atmosférica.',
    addedAt: '2022-03-05T10:00:00Z', updatedAt: '2022-03-06T23:00:00Z',
  },
  m5: {
    itemId: 'm5', category: 'movies', status: 'completed',
    rating: 10, review: 'Obra maestra del cine contemporáneo. Bong Joon-ho es un genio.',
    addedAt: '2022-10-01T10:00:00Z', updatedAt: '2022-10-02T22:00:00Z',
  },
  m6: {
    itemId: 'm6', category: 'movies', status: 'pending',
    rating: null, review: '',
    addedAt: '2024-01-05T10:00:00Z', updatedAt: '2024-01-05T10:00:00Z',
  },
  s1: {
    itemId: 's1', category: 'series', status: 'in_progress',
    rating: null, review: '',
    addedAt: '2024-02-01T10:00:00Z', updatedAt: '2024-04-10T20:00:00Z',
  },
  s2: {
    itemId: 's2', category: 'series', status: 'completed',
    rating: 9, review: 'La serie más original de los últimos años. Cada episodio te deja con la boca abierta.',
    addedAt: '2023-09-01T10:00:00Z', updatedAt: '2023-10-15T22:00:00Z',
  },
  s3: {
    itemId: 's3', category: 'series', status: 'dropped',
    rating: 6, review: 'Empezó bien pero perdió fuerza. La dejé en la segunda temporada.',
    addedAt: '2022-08-21T10:00:00Z', updatedAt: '2023-02-10T20:00:00Z',
  },
  s4: {
    itemId: 's4', category: 'series', status: 'pending',
    rating: null, review: '',
    addedAt: '2024-04-01T10:00:00Z', updatedAt: '2024-04-01T10:00:00Z',
  },
  b1: {
    itemId: 'b1', category: 'books', status: 'in_progress',
    rating: null, review: '',
    addedAt: '2024-03-20T10:00:00Z', updatedAt: '2024-04-08T21:00:00Z',
  },
  b2: {
    itemId: 'b2', category: 'books', status: 'completed',
    rating: 10, review: 'El libro de ciencia ficción más influyente jamás escrito. Imprescindible.',
    addedAt: '2023-06-01T10:00:00Z', updatedAt: '2023-08-10T22:00:00Z',
  },
  b3: {
    itemId: 'b3', category: 'books', status: 'completed',
    rating: 9, review: 'Perturbador y profético. Más relevante hoy que cuando se escribió.',
    addedAt: '2022-11-01T10:00:00Z', updatedAt: '2022-12-05T21:00:00Z',
  },
  c1: {
    itemId: 'c1', category: 'concerts', status: 'completed',
    rating: 10, review: 'El mejor concierto de mi vida. 3 horas de pura magia. Absolutamente impresionante.',
    addedAt: '2024-05-29T10:00:00Z', updatedAt: '2024-05-30T02:00:00Z',
  },
  c2: {
    itemId: 'c2', category: 'concerts', status: 'pending',
    rating: null, review: '',
    addedAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z',
  },
};
