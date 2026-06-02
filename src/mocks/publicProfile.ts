export const PUBLIC_PROFILE_USER = {
  id: 'user-002',
  username: 'nacho_p',
  display_name: 'Nacho P.',
  initials: 'NP',
  bio: 'Amante del cine, los videojuegos y los libros de ciencia ficción. Siempre buscando la próxima obra maestra.',
  is_public: true,
  joined: 'Enero 2024',
  following: 48,
  followers: 127,
};

export interface PublicTrackerEntry {
  itemId: string;
  category: string;
  title: string;
  cover: string;
  year: number;
  genre: string;
  rating: number | null;
  status: 'completed' | 'in_progress' | 'pending' | 'dropped';
  review?: string;
  updatedAt: string;
  catAccent: string;
  catIcon: string;
  catLabel: string;
}

export const PUBLIC_TRACKER_ENTRIES: PublicTrackerEntry[] = [
  // Games
  {
    itemId: 'g1', category: 'games', title: 'Elden Ring',
    cover: 'https://readdy.ai/api/search-image?query=Elden%20Ring%20fantasy%20dark%20souls%20epic%20landscape%20golden%20tree%20dramatic%20sky%20cinematic%20game%20art%20dark%20moody&width=280&height=380&seq=cg-er&orientation=portrait',
    year: 2022, genre: 'RPG', rating: 10, status: 'completed',
    review: 'Una obra maestra absoluta. El mundo abierto más impresionante que he jugado. Cada rincón esconde algo increíble.',
    updatedAt: '2024-03-15T18:30:00Z', catAccent: '#8b5cf6', catIcon: 'ri-gamepad-line', catLabel: 'Videojuegos',
  },
  {
    itemId: 'g2', category: 'games', title: "Baldur's Gate 3",
    cover: 'https://readdy.ai/api/search-image?query=fantasy%20RPG%20dark%20dungeon%20magic%20spell%20dramatic%20lighting%20epic%20game%20art%20dark%20purple%20tones%20cinematic&width=280&height=380&seq=cg-bg3&orientation=portrait',
    year: 2023, genre: 'RPG', rating: null, status: 'in_progress',
    updatedAt: '2024-04-01T20:00:00Z', catAccent: '#8b5cf6', catIcon: 'ri-gamepad-line', catLabel: 'Videojuegos',
  },
  {
    itemId: 'g3', category: 'games', title: 'God of War Ragnarök',
    cover: 'https://readdy.ai/api/search-image?query=Norse%20mythology%20warrior%20axe%20snow%20dramatic%20sky%20epic%20cinematic%20game%20art%20cold%20tones&width=280&height=380&seq=cg-gow&orientation=portrait',
    year: 2022, genre: 'Acción', rating: 9, status: 'completed',
    review: 'Narrativa brutal y combates espectaculares. Kratos y Atreus son un dúo increíble.',
    updatedAt: '2023-12-20T16:00:00Z', catAccent: '#8b5cf6', catIcon: 'ri-gamepad-line', catLabel: 'Videojuegos',
  },
  {
    itemId: 'g4', category: 'games', title: 'Cyberpunk 2077',
    cover: 'https://readdy.ai/api/search-image?query=cyberpunk%20neon%20city%20night%20futuristic%20urban%20rain%20dramatic%20lighting%20yellow%20tones%20cinematic&width=280&height=380&seq=cg-cp&orientation=portrait',
    year: 2020, genre: 'RPG', rating: 8, status: 'completed',
    review: 'Tras los parches es un juegazo. Night City es increíble y la historia de V te engancha.',
    updatedAt: '2022-09-10T14:00:00Z', catAccent: '#8b5cf6', catIcon: 'ri-gamepad-line', catLabel: 'Videojuegos',
  },
  {
    itemId: 'g5', category: 'games', title: 'Hollow Knight',
    cover: 'https://readdy.ai/api/search-image?query=dark%20fantasy%20insect%20knight%20underground%20cave%20glowing%20mushrooms%20atmospheric%20game%20art%20blue%20tones&width=280&height=380&seq=cg-hk&orientation=portrait',
    year: 2017, genre: 'Metroidvania', rating: null, status: 'pending',
    updatedAt: '2024-02-14T10:00:00Z', catAccent: '#8b5cf6', catIcon: 'ri-gamepad-line', catLabel: 'Videojuegos',
  },
  {
    itemId: 'g6', category: 'games', title: 'Red Dead Redemption 2',
    cover: 'https://readdy.ai/api/search-image?query=wild%20west%20cowboy%20sunset%20dramatic%20landscape%20horse%20cinematic%20warm%20tones%20epic%20game%20art&width=280&height=380&seq=cg-rdr&orientation=portrait',
    year: 2018, genre: 'Aventura', rating: 10, status: 'completed',
    review: 'La mejor narrativa de la historia de los videojuegos. Arthur Morgan es un personaje inolvidable.',
    updatedAt: '2023-07-20T22:00:00Z', catAccent: '#8b5cf6', catIcon: 'ri-gamepad-line', catLabel: 'Videojuegos',
  },
  // Movies
  {
    itemId: 'm1', category: 'movies', title: 'Dune: Parte II',
    cover: 'https://readdy.ai/api/search-image?query=Dune%20desert%20planet%20sci-fi%20epic%20sand%20dunes%20dramatic%20sky%20cinematic%20movie%20poster%20warm%20tones&width=280&height=380&seq=cm-dune&orientation=portrait',
    year: 2024, genre: 'Sci-Fi', rating: 9, status: 'completed',
    review: 'Villeneuve lo ha vuelto a hacer. Épica visual sin igual. La mejor película del año sin duda.',
    updatedAt: '2024-03-05T21:00:00Z', catAccent: '#f43f5e', catIcon: 'ri-film-line', catLabel: 'Películas',
  },
  {
    itemId: 'm2', category: 'movies', title: 'Oppenheimer',
    cover: 'https://readdy.ai/api/search-image?query=atomic%20bomb%20explosion%20dramatic%20fire%20mushroom%20cloud%20dark%20cinematic%20historical%20movie%20poster&width=280&height=380&seq=cm-opp&orientation=portrait',
    year: 2023, genre: 'Drama', rating: 9, status: 'completed',
    review: 'Cillian Murphy está soberbio. Una película que te deja pensando días después de verla.',
    updatedAt: '2023-07-22T23:00:00Z', catAccent: '#f43f5e', catIcon: 'ri-film-line', catLabel: 'Películas',
  },
  {
    itemId: 'm3', category: 'movies', title: 'Everything Everywhere All at Once',
    cover: 'https://readdy.ai/api/search-image?query=multiverse%20colorful%20surreal%20abstract%20art%20vibrant%20colors%20cinematic%20movie%20poster%20creative&width=280&height=380&seq=cm-eeaao&orientation=portrait',
    year: 2022, genre: 'Sci-Fi', rating: 10, status: 'completed',
    review: 'La película más original que he visto en años. Absolutamente genial en todos los sentidos.',
    updatedAt: '2023-01-11T22:00:00Z', catAccent: '#f43f5e', catIcon: 'ri-film-line', catLabel: 'Películas',
  },
  {
    itemId: 'm4', category: 'movies', title: 'The Batman',
    cover: 'https://readdy.ai/api/search-image?query=dark%20batman%20rain%20noir%20city%20dramatic%20lighting%20dark%20moody%20cinematic%20superhero%20movie%20poster&width=280&height=380&seq=cm-bat&orientation=portrait',
    year: 2022, genre: 'Acción', rating: 8, status: 'completed',
    review: 'La mejor versión de Batman en cine. Oscura, atmosférica y con un Pattinson increíble.',
    updatedAt: '2022-03-06T23:00:00Z', catAccent: '#f43f5e', catIcon: 'ri-film-line', catLabel: 'Películas',
  },
  {
    itemId: 'm5', category: 'movies', title: 'Parasite',
    cover: 'https://readdy.ai/api/search-image?query=korean%20thriller%20dark%20house%20dramatic%20lighting%20social%20class%20cinematic%20movie%20poster%20dark%20tones&width=280&height=380&seq=cm-par&orientation=portrait',
    year: 2019, genre: 'Thriller', rating: 10, status: 'completed',
    review: 'Obra maestra del cine contemporáneo. Bong Joon-ho es un genio absoluto.',
    updatedAt: '2022-10-02T22:00:00Z', catAccent: '#f43f5e', catIcon: 'ri-film-line', catLabel: 'Películas',
  },
  {
    itemId: 'm6', category: 'movies', title: 'Interstellar',
    cover: 'https://readdy.ai/api/search-image?query=space%20wormhole%20galaxy%20stars%20dramatic%20cosmic%20cinematic%20sci-fi%20movie%20poster%20dark%20blue%20tones&width=280&height=380&seq=cm-int&orientation=portrait',
    year: 2014, genre: 'Sci-Fi', rating: null, status: 'pending',
    updatedAt: '2024-01-05T10:00:00Z', catAccent: '#f43f5e', catIcon: 'ri-film-line', catLabel: 'Películas',
  },
  // Series
  {
    itemId: 's1', category: 'series', title: 'The Last of Us',
    cover: 'https://readdy.ai/api/search-image?query=post%20apocalyptic%20city%20overgrown%20nature%20dramatic%20lighting%20dark%20moody%20atmosphere%20cinematic%20series%20poster&width=280&height=380&seq=cs-tlou&orientation=portrait',
    year: 2023, genre: 'Drama', rating: null, status: 'in_progress',
    updatedAt: '2024-04-10T20:00:00Z', catAccent: '#f59e0b', catIcon: 'ri-tv-2-line', catLabel: 'Series',
  },
  {
    itemId: 's2', category: 'series', title: 'Severance',
    cover: 'https://readdy.ai/api/search-image?query=corporate%20office%20surreal%20minimalist%20dark%20thriller%20dramatic%20lighting%20cinematic%20series%20poster&width=280&height=380&seq=cs-sev&orientation=portrait',
    year: 2022, genre: 'Thriller', rating: 9, status: 'completed',
    review: 'La serie más original de los últimos años. Cada episodio te deja con la boca abierta.',
    updatedAt: '2023-10-15T22:00:00Z', catAccent: '#f59e0b', catIcon: 'ri-tv-2-line', catLabel: 'Series',
  },
  {
    itemId: 's3', category: 'series', title: 'House of the Dragon',
    cover: 'https://readdy.ai/api/search-image?query=dragon%20fire%20medieval%20fantasy%20dark%20dramatic%20sky%20cinematic%20series%20poster%20red%20tones&width=280&height=380&seq=cs-hotd&orientation=portrait',
    year: 2022, genre: 'Fantasía', rating: 6, status: 'dropped',
    review: 'Empezó bien pero perdió fuerza. La dejé en la segunda temporada.',
    updatedAt: '2023-02-10T20:00:00Z', catAccent: '#f59e0b', catIcon: 'ri-tv-2-line', catLabel: 'Series',
  },
  {
    itemId: 's4', category: 'series', title: 'Shogun',
    cover: 'https://readdy.ai/api/search-image?query=feudal%20japan%20samurai%20dramatic%20landscape%20cherry%20blossom%20cinematic%20series%20poster%20warm%20tones&width=280&height=380&seq=cs-sho&orientation=portrait',
    year: 2024, genre: 'Drama', rating: null, status: 'pending',
    updatedAt: '2024-04-01T10:00:00Z', catAccent: '#f59e0b', catIcon: 'ri-tv-2-line', catLabel: 'Series',
  },
  // Books
  {
    itemId: 'b1', category: 'books', title: 'El Problema de los Tres Cuerpos',
    cover: 'https://readdy.ai/api/search-image?query=science%20fiction%20book%20cover%20space%20stars%20three%20body%20problem%20cosmic%20dark%20background%20artistic%20illustration&width=280&height=380&seq=cb-3b&orientation=portrait',
    year: 2008, genre: 'Sci-Fi', rating: null, status: 'in_progress',
    updatedAt: '2024-04-08T21:00:00Z', catAccent: '#10b981', catIcon: 'ri-book-open-line', catLabel: 'Libros',
  },
  {
    itemId: 'b2', category: 'books', title: 'Dune',
    cover: 'https://readdy.ai/api/search-image?query=desert%20planet%20sci-fi%20book%20cover%20sand%20dunes%20dramatic%20sky%20artistic%20illustration%20warm%20tones&width=280&height=380&seq=cb-dune&orientation=portrait',
    year: 1965, genre: 'Sci-Fi', rating: 10, status: 'completed',
    review: 'El libro de ciencia ficción más influyente jamás escrito. Imprescindible para cualquier amante del género.',
    updatedAt: '2023-08-10T22:00:00Z', catAccent: '#10b981', catIcon: 'ri-book-open-line', catLabel: 'Libros',
  },
  {
    itemId: 'b3', category: 'books', title: '1984',
    cover: 'https://readdy.ai/api/search-image?query=dystopian%20surveillance%20dark%20eye%20watching%20dramatic%20dark%20book%20cover%20artistic%20illustration%20cold%20tones&width=280&height=380&seq=cb-1984&orientation=portrait',
    year: 1949, genre: 'Distopía', rating: 9, status: 'completed',
    review: 'Perturbador y profético. Más relevante hoy que cuando se escribió. Una lectura obligatoria.',
    updatedAt: '2022-12-05T21:00:00Z', catAccent: '#10b981', catIcon: 'ri-book-open-line', catLabel: 'Libros',
  },
  // Concerts
  {
    itemId: 'c1', category: 'concerts', title: 'Taylor Swift — Eras Tour',
    cover: 'https://readdy.ai/api/search-image?query=concert%20stage%20spectacular%20lights%20show%20performer%20crowd%20energy%20colorful%20beams%20dramatic%20atmosphere%20music%20event&width=280&height=380&seq=cc-ts&orientation=portrait',
    year: 2024, genre: 'Pop', rating: 10, status: 'completed',
    review: 'El mejor concierto de mi vida. 3 horas de pura magia. Absolutamente impresionante en todos los sentidos.',
    updatedAt: '2024-05-30T02:00:00Z', catAccent: '#0ea5e9', catIcon: 'ri-music-2-line', catLabel: 'Conciertos',
  },
  {
    itemId: 'c2', category: 'concerts', title: 'Metallica — M72 World Tour',
    cover: 'https://readdy.ai/api/search-image?query=heavy%20metal%20concert%20fire%20pyrotechnics%20dramatic%20stage%20dark%20atmosphere%20rock%20music%20event&width=280&height=380&seq=cc-met&orientation=portrait',
    year: 2023, genre: 'Metal', rating: null, status: 'pending',
    updatedAt: '2024-01-15T10:00:00Z', catAccent: '#0ea5e9', catIcon: 'ri-music-2-line', catLabel: 'Conciertos',
  },
];
