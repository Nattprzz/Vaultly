export type TrackerStatus = 'pending' | 'in_progress' | 'completed' | 'dropped' | null;

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

export interface ItemDetail {
  gallery?: GalleryImage[];
  id: string;
  category: string;
  title: string;
  cover: string;
  backdrop: string;
  rating: number;
  year: number;
  genre: string;
  description: string;
  tags: string[];
  // Category-specific fields
  developer?: string;       // games
  publisher?: string;       // games
  platforms?: string[];     // games
  director?: string;        // movies
  cast?: string[];          // movies / series
  duration?: string;        // movies
  seasons?: number;         // series
  episodes?: number;        // series
  network?: string;         // series
  author?: string;          // books
  pages?: number;           // books
  isbn?: string;            // books
  venue?: string;           // concerts
  city?: string;            // concerts
  artist?: string;          // concerts
  setlist?: string[];       // concerts
  // Community
  community_rating: number;
  total_ratings: number;
  total_reviews: number;
}

export const ITEM_DETAIL_MOCK: Record<string, ItemDetail> = {
  g1: {
    id: 'g1', category: 'games',
    title: 'Elden Ring',
    cover: 'https://readdy.ai/api/search-image?query=Elden%20Ring%20fantasy%20dark%20souls%20epic%20landscape%20golden%20tree%20dramatic%20sky%20cinematic%20game%20art%20dark%20moody&width=400&height=560&seq=det-er-cover&orientation=portrait',
    backdrop: 'https://readdy.ai/api/search-image?query=Elden%20Ring%20open%20world%20vast%20landscape%20golden%20glowing%20tree%20dramatic%20epic%20sky%20dark%20fantasy%20cinematic%20ultra%20wide%20panoramic&width=1400&height=600&seq=det-er-back&orientation=landscape',
    rating: 9.4, year: 2022, genre: 'RPG',
    description: 'Elden Ring es un videojuego de rol de acción desarrollado por FromSoftware y publicado por Bandai Namco Entertainment. Ambientado en las Tierras Intermedias, un mundo de fantasía oscura creado en colaboración con el escritor George R. R. Martin, el juego ofrece un mundo abierto masivo lleno de secretos, jefes desafiantes y una narrativa profunda contada a través del entorno y los objetos.',
    tags: ['Mundo abierto', 'Difícil', 'Fantasía oscura', 'Multijugador', 'GOTY 2022'],
    developer: 'FromSoftware',
    publisher: 'Bandai Namco',
    platforms: ['PC', 'PS5', 'PS4', 'Xbox Series X', 'Xbox One'],
    community_rating: 9.4, total_ratings: 48200, total_reviews: 12400,
    gallery: [
      { id: 'g1-1', url: 'https://readdy.ai/api/search-image?query=Elden%20Ring%20vast%20open%20world%20golden%20glowing%20tree%20erdtree%20epic%20landscape%20cinematic%20game%20screenshot&width=800&height=450&seq=gal-er-1&orientation=landscape', caption: 'El Árbol Áureo domina las Tierras Intermedias' },
      { id: 'g1-2', url: 'https://readdy.ai/api/search-image?query=Elden%20Ring%20boss%20fight%20dramatic%20dark%20fantasy%20epic%20battle%20cinematic%20game%20screenshot&width=800&height=450&seq=gal-er-2&orientation=landscape', caption: 'Combate épico contra uno de los Semidioses' },
      { id: 'g1-3', url: 'https://readdy.ai/api/search-image?query=Elden%20Ring%20castle%20fortress%20dramatic%20sky%20dark%20fantasy%20cinematic%20game%20screenshot&width=800&height=450&seq=gal-er-3&orientation=landscape', caption: 'Castillo de Stormveil, primera gran fortaleza' },
      { id: 'g1-4', url: 'https://readdy.ai/api/search-image?query=Elden%20Ring%20underground%20lake%20glowing%20blue%20dramatic%20dark%20fantasy%20cinematic%20game%20screenshot&width=800&height=450&seq=gal-er-4&orientation=landscape', caption: 'El Lago de Podredumbre, zona subterránea' },
    ],
  },
  g2: {
    id: 'g2', category: 'games',
    title: "Baldur's Gate 3",
    cover: 'https://readdy.ai/api/search-image?query=fantasy%20RPG%20dark%20dungeon%20magic%20spell%20dramatic%20lighting%20epic%20game%20art%20dark%20purple%20tones%20cinematic&width=400&height=560&seq=det-bg3-cover&orientation=portrait',
    backdrop: 'https://readdy.ai/api/search-image?query=fantasy%20RPG%20epic%20battle%20magic%20spells%20dramatic%20dark%20dungeon%20cinematic%20ultra%20wide%20panoramic%20purple%20tones&width=1400&height=600&seq=det-bg3-back&orientation=landscape',
    rating: 9.6, year: 2023, genre: 'RPG',
    description: "Baldur's Gate 3 es un juego de rol por turnos desarrollado por Larian Studios, basado en el universo de Dungeons & Dragons. Con una narrativa profunda, personajes memorables y una libertad de elección sin precedentes, el juego permite al jugador tomar decisiones que afectan radicalmente el desarrollo de la historia.",
    tags: ['Por turnos', 'D&D', 'Cooperativo', 'Narrativa', 'GOTY 2023'],
    developer: 'Larian Studios',
    publisher: 'Larian Studios',
    platforms: ['PC', 'PS5', 'Xbox Series X', 'Mac'],
    community_rating: 9.6, total_ratings: 52100, total_reviews: 18700,
    gallery: [
      { id: 'g2-1', url: 'https://readdy.ai/api/search-image?query=Baldurs%20Gate%203%20fantasy%20RPG%20epic%20party%20adventure%20dramatic%20cinematic%20game%20screenshot&width=800&height=450&seq=gal-bg3-1&orientation=landscape', caption: 'Tu grupo de aventureros en acción' },
      { id: 'g2-2', url: 'https://readdy.ai/api/search-image?query=Baldurs%20Gate%203%20dark%20dungeon%20magic%20spell%20dramatic%20lighting%20cinematic%20game%20screenshot&width=800&height=450&seq=gal-bg3-2&orientation=landscape', caption: 'Sistema de combate por turnos' },
      { id: 'g2-3', url: 'https://readdy.ai/api/search-image?query=Baldurs%20Gate%203%20fantasy%20city%20tavern%20dramatic%20warm%20lighting%20cinematic%20game%20screenshot&width=800&height=450&seq=gal-bg3-3&orientation=landscape', caption: 'Baldur\'s Gate, la ciudad más grande del juego' },
    ],
  },
  g3: {
    id: 'g3', category: 'games',
    title: 'God of War Ragnarök',
    cover: 'https://readdy.ai/api/search-image?query=Norse%20mythology%20warrior%20axe%20snow%20dramatic%20sky%20epic%20cinematic%20game%20art%20cold%20tones&width=400&height=560&seq=det-gow-cover&orientation=portrait',
    backdrop: 'https://readdy.ai/api/search-image?query=Norse%20mythology%20epic%20battle%20snow%20storm%20dramatic%20sky%20cinematic%20ultra%20wide%20panoramic%20cold%20tones&width=1400&height=600&seq=det-gow-back&orientation=landscape',
    rating: 9.3, year: 2022, genre: 'Acción',
    description: 'God of War Ragnarök es la secuela directa de God of War (2018). Kratos y Atreus deben enfrentarse a las consecuencias del Fimbulwinter mientras viajan por los Nueve Reinos. Con combates espectaculares y una historia emocionalmente poderosa, es una de las mejores exclusivas de PlayStation.',
    tags: ['Acción', 'Mitología nórdica', 'Narrativa', 'Exclusiva PS'],
    developer: 'Santa Monica Studio',
    publisher: 'Sony Interactive Entertainment',
    platforms: ['PS5', 'PS4', 'PC'],
    community_rating: 9.3, total_ratings: 41800, total_reviews: 9200,
  },
  g4: {
    id: 'g4', category: 'games',
    title: 'Cyberpunk 2077',
    cover: 'https://readdy.ai/api/search-image?query=cyberpunk%20neon%20city%20night%20futuristic%20urban%20rain%20dramatic%20lighting%20yellow%20tones%20cinematic&width=400&height=560&seq=det-cp-cover&orientation=portrait',
    backdrop: 'https://readdy.ai/api/search-image?query=cyberpunk%20neon%20city%20night%20futuristic%20urban%20rain%20dramatic%20lighting%20ultra%20wide%20panoramic%20yellow%20tones&width=1400&height=600&seq=det-cp-back&orientation=landscape',
    rating: 8.7, year: 2020, genre: 'RPG',
    description: 'Cyberpunk 2077 es un RPG de mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder, el glamour y la modificación corporal. Juegas como V, un mercenario que busca un implante único que es la clave de la inmortalidad. Tras un lanzamiento accidentado, las actualizaciones posteriores lo convirtieron en una experiencia excepcional.',
    tags: ['Mundo abierto', 'Futurista', 'RPG', 'Narrativa', 'Acción'],
    developer: 'CD Projekt Red',
    publisher: 'CD Projekt',
    platforms: ['PC', 'PS5', 'PS4', 'Xbox Series X', 'Xbox One'],
    community_rating: 8.7, total_ratings: 38900, total_reviews: 14200,
  },
  g5: {
    id: 'g5', category: 'games',
    title: 'Hollow Knight',
    cover: 'https://readdy.ai/api/search-image?query=dark%20fantasy%20insect%20knight%20underground%20cave%20glowing%20mushrooms%20atmospheric%20game%20art%20blue%20tones&width=400&height=560&seq=det-hk-cover&orientation=portrait',
    backdrop: 'https://readdy.ai/api/search-image?query=dark%20fantasy%20underground%20cave%20glowing%20mushrooms%20atmospheric%20cinematic%20ultra%20wide%20panoramic%20blue%20tones&width=1400&height=600&seq=det-hk-back&orientation=landscape',
    rating: 9.1, year: 2017, genre: 'Metroidvania',
    description: 'Hollow Knight es un juego de acción y aventura ambientado en Hallownest, un antiguo reino de insectos. Con un diseño artístico impresionante, combates precisos y un mundo enorme por explorar, es considerado uno de los mejores juegos indie de la última década.',
    tags: ['Indie', 'Metroidvania', 'Difícil', 'Arte 2D', 'Exploración'],
    developer: 'Team Cherry',
    publisher: 'Team Cherry',
    platforms: ['PC', 'Nintendo Switch', 'PS4', 'Xbox One'],
    community_rating: 9.1, total_ratings: 29400, total_reviews: 7800,
  },
  g6: {
    id: 'g6', category: 'games',
    title: 'Red Dead Redemption 2',
    cover: 'https://readdy.ai/api/search-image?query=wild%20west%20cowboy%20sunset%20dramatic%20landscape%20horse%20cinematic%20warm%20tones%20epic%20game%20art&width=400&height=560&seq=det-rdr-cover&orientation=portrait',
    backdrop: 'https://readdy.ai/api/search-image?query=wild%20west%20sunset%20dramatic%20landscape%20horse%20rider%20cinematic%20ultra%20wide%20panoramic%20warm%20golden%20tones&width=1400&height=600&seq=det-rdr-back&orientation=landscape',
    rating: 9.5, year: 2018, genre: 'Aventura',
    description: 'Red Dead Redemption 2 es una obra maestra del mundo abierto ambientada en el salvaje oeste americano de 1899. Juegas como Arthur Morgan, un forajido que lucha con su lealtad a la banda Van der Linde mientras el mundo a su alrededor cambia irremediablemente. Una de las narrativas más emotivas de la historia de los videojuegos.',
    tags: ['Mundo abierto', 'Western', 'Narrativa', 'Realismo', 'Multijugador'],
    developer: 'Rockstar Games',
    publisher: 'Rockstar Games',
    platforms: ['PC', 'PS4', 'Xbox One'],
    community_rating: 9.5, total_ratings: 55300, total_reviews: 21000,
  },
  m1: {
    id: 'm1', category: 'movies',
    title: 'Dune: Parte II',
    cover: 'https://readdy.ai/api/search-image?query=Dune%20desert%20planet%20sci-fi%20epic%20sand%20dunes%20dramatic%20sky%20cinematic%20movie%20poster%20warm%20tones&width=400&height=560&seq=det-dune-cover&orientation=portrait',
    backdrop: 'https://readdy.ai/api/search-image?query=Dune%20desert%20planet%20sci-fi%20epic%20sand%20dunes%20dramatic%20sky%20cinematic%20ultra%20wide%20panoramic%20warm%20tones&width=1400&height=600&seq=det-dune-back&orientation=landscape',
    rating: 8.8, year: 2024, genre: 'Sci-Fi',
    description: 'La segunda parte de la adaptación de Denis Villeneuve de la novela de Frank Herbert. Paul Atreides se une a los Fremen y comienza un viaje espiritual para convertirse en Muad\'Dib, mientras intenta evitar el terrible futuro que solo él puede prever.',
    tags: ['Épica', 'Sci-Fi', 'Adaptación', 'Desierto', 'Política'],
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Austin Butler', 'Florence Pugh'],
    duration: '2h 46min',
    community_rating: 8.8, total_ratings: 62400, total_reviews: 18900,
    gallery: [
      { id: 'm1-1', url: 'https://readdy.ai/api/search-image?query=Dune%20Part%20Two%20desert%20sandworm%20epic%20cinematic%20movie%20scene%20dramatic%20warm%20tones&width=800&height=450&seq=gal-dune-1&orientation=landscape', caption: 'Paul montando al gusano de arena' },
      { id: 'm1-2', url: 'https://readdy.ai/api/search-image?query=Dune%20Part%20Two%20Fremen%20warriors%20desert%20battle%20dramatic%20cinematic%20movie%20scene&width=800&height=450&seq=gal-dune-2&orientation=landscape', caption: 'Los Fremen preparan la batalla final' },
      { id: 'm1-3', url: 'https://readdy.ai/api/search-image?query=Dune%20Part%20Two%20arena%20gladiator%20fight%20dramatic%20cinematic%20movie%20scene%20dark%20tones&width=800&height=450&seq=gal-dune-3&orientation=landscape', caption: 'El combate en la arena de los Harkonnen' },
    ],
  },
  m2: {
    id: 'm2', category: 'movies',
    title: 'Oppenheimer',
    cover: 'https://readdy.ai/api/search-image?query=atomic%20bomb%20explosion%20dramatic%20fire%20mushroom%20cloud%20dark%20cinematic%20historical%20movie%20poster&width=400&height=560&seq=det-opp-cover&orientation=portrait',
    backdrop: 'https://readdy.ai/api/search-image?query=atomic%20bomb%20explosion%20dramatic%20fire%20mushroom%20cloud%20dark%20cinematic%20ultra%20wide%20panoramic&width=1400&height=600&seq=det-opp-back&orientation=landscape',
    rating: 8.9, year: 2023, genre: 'Drama',
    description: 'La historia del físico J. Robert Oppenheimer y su papel en el desarrollo de la primera bomba atómica durante el Proyecto Manhattan. Christopher Nolan dirige esta épica biográfica que explora la moral, la ciencia y las consecuencias de crear el arma más destructiva de la historia.',
    tags: ['Biográfico', 'Historia', 'Drama', 'IMAX', 'Oscar'],
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.', 'Florence Pugh'],
    duration: '3h 0min',
    community_rating: 8.9, total_ratings: 71200, total_reviews: 22100,
  },
  s1: {
    id: 's1', category: 'series',
    title: 'The Last of Us',
    cover: 'https://readdy.ai/api/search-image?query=post%20apocalyptic%20city%20overgrown%20nature%20dramatic%20lighting%20dark%20moody%20atmosphere%20cinematic%20series%20poster&width=400&height=560&seq=det-tlou-cover&orientation=portrait',
    backdrop: 'https://readdy.ai/api/search-image?query=post%20apocalyptic%20city%20overgrown%20nature%20dramatic%20lighting%20dark%20moody%20atmosphere%20cinematic%20ultra%20wide%20panoramic&width=1400&height=600&seq=det-tlou-back&orientation=landscape',
    rating: 9.1, year: 2023, genre: 'Drama',
    description: 'Adaptación de la aclamada saga de videojuegos. Joel, un superviviente endurecido, es contratado para sacar de contrabando a Ellie, una adolescente de 14 años, de una zona de cuarentena opresiva. Lo que comienza como un pequeño trabajo pronto se convierte en un viaje brutal y desgarrador.',
    tags: ['Post-apocalíptico', 'Drama', 'Supervivencia', 'HBO', 'Adaptación'],
    cast: ['Pedro Pascal', 'Bella Ramsey', 'Gabriel Luna', 'Anna Torv'],
    seasons: 2, episodes: 17,
    network: 'HBO / Max',
    community_rating: 9.1, total_ratings: 58700, total_reviews: 19400,
    gallery: [
      { id: 's1-1', url: 'https://readdy.ai/api/search-image?query=The%20Last%20of%20Us%20post%20apocalyptic%20overgrown%20city%20dramatic%20cinematic%20TV%20series%20scene&width=800&height=450&seq=gal-tlou-1&orientation=landscape', caption: 'La naturaleza reclamando las ciudades' },
      { id: 's1-2', url: 'https://readdy.ai/api/search-image?query=The%20Last%20of%20Us%20Joel%20Ellie%20dramatic%20emotional%20scene%20cinematic%20TV%20series&width=800&height=450&seq=gal-tlou-2&orientation=landscape', caption: 'Joel y Ellie, un vínculo inquebrantable' },
      { id: 's1-3', url: 'https://readdy.ai/api/search-image?query=The%20Last%20of%20Us%20infected%20clicker%20dramatic%20dark%20horror%20cinematic%20TV%20series%20scene&width=800&height=450&seq=gal-tlou-3&orientation=landscape', caption: 'Los infectados, la amenaza constante' },
    ],
  },
  s2: {
    id: 's2', category: 'series',
    title: 'Severance',
    cover: 'https://readdy.ai/api/search-image?query=corporate%20office%20surreal%20minimalist%20dark%20thriller%20dramatic%20lighting%20cinematic%20series%20poster&width=400&height=560&seq=det-sev-cover&orientation=portrait',
    backdrop: 'https://readdy.ai/api/search-image?query=corporate%20office%20surreal%20minimalist%20dark%20thriller%20dramatic%20lighting%20cinematic%20ultra%20wide%20panoramic&width=1400&height=600&seq=det-sev-back&orientation=landscape',
    rating: 9.0, year: 2022, genre: 'Thriller',
    description: 'Mark Scout lidera un equipo en Lumon Industries cuyos empleados se han sometido a un procedimiento de "separación" que divide quirúrgicamente sus recuerdos de trabajo y personales. Esta distopía corporativa es una de las series más originales y perturbadoras de los últimos años.',
    tags: ['Distopía', 'Thriller', 'Misterio', 'Apple TV+', 'Corporativo'],
    cast: ['Adam Scott', 'Britt Lower', 'Zach Cherry', 'Tramell Tillman', 'Patricia Arquette'],
    seasons: 2, episodes: 19,
    network: 'Apple TV+',
    community_rating: 9.0, total_ratings: 44100, total_reviews: 13800,
  },
  b1: {
    id: 'b1', category: 'books',
    title: 'El Problema de los Tres Cuerpos',
    author: 'Liu Cixin',
    cover: 'https://readdy.ai/api/search-image?query=science%20fiction%20book%20cover%20space%20stars%20three%20body%20problem%20cosmic%20dark%20background%20artistic%20illustration&width=400&height=560&seq=det-3b-cover&orientation=portrait',
    backdrop: 'https://readdy.ai/api/search-image?query=science%20fiction%20space%20stars%20cosmic%20dark%20background%20artistic%20illustration%20ultra%20wide%20panoramic&width=1400&height=600&seq=det-3b-back&orientation=landscape',
    rating: 9.0, year: 2008, genre: 'Sci-Fi',
    description: 'Primera entrega de la trilogía "El Recuerdo del Pasado de la Tierra" del autor chino Liu Cixin. Durante la Revolución Cultural China, un proyecto secreto envía señales al espacio. Décadas después, la humanidad descubre que no está sola en el universo, y la respuesta que recibe podría significar su extinción.',
    tags: ['Hard Sci-Fi', 'China', 'Primer contacto', 'Premio Hugo', 'Trilogía'],
    pages: 400,
    isbn: '978-84-9070-340-5',
    community_rating: 9.0, total_ratings: 38200, total_reviews: 11600,
  },
  c1: {
    id: 'c1', category: 'concerts',
    title: 'Taylor Swift — Eras Tour',
    cover: 'https://readdy.ai/api/search-image?query=concert%20stage%20spectacular%20lights%20show%20performer%20crowd%20energy%20colorful%20beams%20dramatic%20atmosphere%20music%20event&width=400&height=560&seq=det-ts-cover&orientation=portrait',
    backdrop: 'https://readdy.ai/api/search-image?query=concert%20stage%20spectacular%20lights%20show%20performer%20crowd%20energy%20colorful%20beams%20dramatic%20atmosphere%20ultra%20wide%20panoramic&width=1400&height=600&seq=det-ts-back&orientation=landscape',
    rating: 9.7, year: 2024, genre: 'Pop',
    description: 'The Eras Tour es la gira de conciertos de Taylor Swift que celebra todas las eras de su carrera musical. Con más de 3 horas de espectáculo, más de 40 canciones y una producción visual sin precedentes, se convirtió en la gira más taquillera de la historia superando los 1.000 millones de dólares en recaudación.',
    tags: ['Pop', 'Gira mundial', 'Récord histórico', 'Espectáculo visual', 'Estadio'],
    artist: 'Taylor Swift',
    venue: 'Estadio Santiago Bernabéu',
    city: 'Madrid, España',
    setlist: ['Miss Americana & The Heartbreak Prince', 'Cruel Summer', 'The Man', 'You Belong With Me', 'Love Story', 'Shake It Off', 'Blank Space', 'Style', 'Anti-Hero', 'Karma'],
    community_rating: 9.7, total_ratings: 29800, total_reviews: 8400,
  },
};

export const MOCK_REVIEWS = [
  {
    id: 'r1',
    user: 'Carlos M.',
    initials: 'CM',
    rating: 10,
    date: 'Hace 3 días',
    body: 'Una obra maestra absoluta. Nunca pensé que un videojuego pudiera emocionarme tanto. La narrativa, el mundo, los personajes... todo es perfecto.',
    accent: '#8b5cf6',
  },
  {
    id: 'r2',
    user: 'Laura G.',
    initials: 'LG',
    rating: 9,
    date: 'Hace 1 semana',
    body: 'Increíble experiencia. La dificultad puede ser frustrante al principio pero cuando le coges el ritmo es adictivo. El diseño de los jefes es espectacular.',
    accent: '#f43f5e',
  },
  {
    id: 'r3',
    user: 'Marcos R.',
    initials: 'MR',
    rating: 8,
    date: 'Hace 2 semanas',
    body: 'Muy buen juego, aunque el mundo abierto a veces se siente un poco vacío comparado con otros títulos. La historia principal es brillante.',
    accent: '#10b981',
  },
];
