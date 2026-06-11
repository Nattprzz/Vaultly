//#region src/mocks/people.ts
var PEOPLE_MOCK = {
	"denis-villeneuve": {
		id: "denis-villeneuve",
		name: "Denis Villeneuve",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20middle%20aged%20male%20film%20director%20confident%20expression%20studio%20lighting%20clean%20background%20neutral%20tones%20cinematic&width=400&height=400&seq=person-dv-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=film%20set%20movie%20production%20cinematic%20camera%20crew%20dramatic%20lighting%20behind%20the%20scenes%20professional%20atmosphere%20wide&width=1400&height=500&seq=person-dv-back&orientation=landscape",
		role: "Director",
		nationality: "Canadiense",
		birthYear: 1967,
		bio: "Denis Villeneuve es uno de los directores más aclamados de su generación. Nacido en Quebec, Canadá, comenzó su carrera en el cine francófono antes de dar el salto a Hollywood. Es conocido por su capacidad para crear atmósferas densas y narrativas visualmente impactantes. Su filmografía incluye thrillers psicológicos, dramas de ciencia ficción y épicas de gran escala. Ha sido nominado al Oscar y ha ganado múltiples premios en festivales internacionales como Cannes y Venecia.",
		known_for: [
			"Dune",
			"Blade Runner 2049",
			"Arrival",
			"Sicario"
		],
		works: [
			{
				id: "m1",
				title: "Dune: Parte II",
				cover: "https://readdy.ai/api/search-image?query=Dune%20desert%20planet%20sci-fi%20epic%20sand%20dunes%20dramatic%20sky%20cinematic%20movie%20poster%20warm%20tones&width=280&height=380&seq=pw-dune2&orientation=portrait",
				year: 2024,
				genre: "Sci-Fi",
				category: "movies",
				rating: 8.8,
				role: "Director"
			},
			{
				id: "dune1",
				title: "Dune: Parte I",
				cover: "https://readdy.ai/api/search-image?query=Dune%20desert%20planet%20sci-fi%20epic%20sand%20dunes%20golden%20sky%20cinematic%20movie%20poster%20warm%20tones%20first%20part&width=280&height=380&seq=pw-dune1&orientation=portrait",
				year: 2021,
				genre: "Sci-Fi",
				category: "movies",
				rating: 8.6,
				role: "Director"
			},
			{
				id: "br2049",
				title: "Blade Runner 2049",
				cover: "https://readdy.ai/api/search-image?query=blade%20runner%202049%20futuristic%20city%20rain%20neon%20lights%20cinematic%20movie%20poster%20dark%20tones&width=280&height=380&seq=pw-br&orientation=portrait",
				year: 2017,
				genre: "Sci-Fi",
				category: "movies",
				rating: 8.7,
				role: "Director"
			},
			{
				id: "arrival",
				title: "Arrival",
				cover: "https://readdy.ai/api/search-image?query=alien%20contact%20sci-fi%20mysterious%20spacecraft%20fog%20dramatic%20cinematic%20movie%20poster%20dark%20tones&width=280&height=380&seq=pw-arr&orientation=portrait",
				year: 2016,
				genre: "Sci-Fi",
				category: "movies",
				rating: 8.9,
				role: "Director"
			},
			{
				id: "sicario",
				title: "Sicario",
				cover: "https://readdy.ai/api/search-image?query=border%20thriller%20desert%20dramatic%20sky%20dark%20cinematic%20movie%20poster%20tense%20atmosphere&width=280&height=380&seq=pw-sic&orientation=portrait",
				year: 2015,
				genre: "Thriller",
				category: "movies",
				rating: 8.5,
				role: "Director"
			},
			{
				id: "enemy",
				title: "Enemy",
				cover: "https://readdy.ai/api/search-image?query=psychological%20thriller%20doppelganger%20dark%20surreal%20cinematic%20movie%20poster%20yellow%20tones&width=280&height=380&seq=pw-ene&orientation=portrait",
				year: 2013,
				genre: "Thriller",
				category: "movies",
				rating: 8.1,
				role: "Director"
			}
		]
	},
	"christopher-nolan": {
		id: "christopher-nolan",
		name: "Christopher Nolan",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20british%20male%20film%20director%20serious%20expression%20studio%20lighting%20clean%20background%20neutral%20tones%20cinematic&width=400&height=400&seq=person-cn-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=imax%20film%20production%20cinematic%20camera%20crew%20dramatic%20lighting%20behind%20the%20scenes%20professional%20atmosphere%20wide&width=1400&height=500&seq=person-cn-back&orientation=landscape",
		role: "Director",
		nationality: "Británico-Americano",
		birthYear: 1970,
		bio: "Christopher Nolan es uno de los cineastas más influyentes y exitosos de la historia del cine moderno. Conocido por sus narrativas no lineales, su uso del tiempo como elemento dramático y su preferencia por el rodaje en película y en formato IMAX. Ha dirigido algunas de las películas más taquilleras y aclamadas de las últimas décadas, combinando el cine de autor con el blockbuster de gran presupuesto. Ganador del Oscar al Mejor Director por Oppenheimer en 2024.",
		known_for: [
			"Oppenheimer",
			"Inception",
			"The Dark Knight",
			"Interstellar"
		],
		works: [
			{
				id: "m2",
				title: "Oppenheimer",
				cover: "https://readdy.ai/api/search-image?query=atomic%20bomb%20explosion%20dramatic%20fire%20mushroom%20cloud%20dark%20cinematic%20historical%20movie%20poster&width=280&height=380&seq=pw-opp&orientation=portrait",
				year: 2023,
				genre: "Drama",
				category: "movies",
				rating: 8.9,
				role: "Director"
			},
			{
				id: "m5",
				title: "Interstellar",
				cover: "https://readdy.ai/api/search-image?query=space%20wormhole%20galaxy%20stars%20dramatic%20cosmic%20cinematic%20sci-fi%20movie%20poster%20dark%20blue%20tones&width=280&height=380&seq=pw-int&orientation=portrait",
				year: 2014,
				genre: "Sci-Fi",
				category: "movies",
				rating: 9.3,
				role: "Director"
			},
			{
				id: "inception",
				title: "Inception",
				cover: "https://readdy.ai/api/search-image?query=dream%20city%20folding%20architecture%20surreal%20dramatic%20cinematic%20movie%20poster%20dark%20tones&width=280&height=380&seq=pw-inc&orientation=portrait",
				year: 2010,
				genre: "Sci-Fi",
				category: "movies",
				rating: 9.2,
				role: "Director"
			},
			{
				id: "tdk",
				title: "The Dark Knight",
				cover: "https://readdy.ai/api/search-image?query=batman%20dark%20knight%20joker%20dramatic%20dark%20cinematic%20movie%20poster%20dark%20tones&width=280&height=380&seq=pw-tdk&orientation=portrait",
				year: 2008,
				genre: "Acción",
				category: "movies",
				rating: 9.5,
				role: "Director"
			},
			{
				id: "dunkirk",
				title: "Dunkirk",
				cover: "https://readdy.ai/api/search-image?query=world%20war%20II%20beach%20dramatic%20sky%20soldiers%20cinematic%20movie%20poster%20dark%20tones&width=280&height=380&seq=pw-dunk&orientation=portrait",
				year: 2017,
				genre: "Drama",
				category: "movies",
				rating: 8.6,
				role: "Director"
			}
		]
	},
	"cillian-murphy": {
		id: "cillian-murphy",
		name: "Cillian Murphy",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20male%20irish%20actor%20intense%20blue%20eyes%20sharp%20features%20studio%20lighting%20clean%20background%20neutral%20tones%20cinematic&width=400&height=400&seq=person-cm-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=dramatic%20film%20set%20actor%20performance%20cinematic%20lighting%20behind%20the%20scenes%20professional%20atmosphere%20wide&width=1400&height=500&seq=person-cm-back&orientation=landscape",
		role: "Actor",
		nationality: "Irlandés",
		birthYear: 1976,
		bio: "Cillian Murphy es un actor irlandés conocido por su intensidad dramática y su capacidad para encarnar personajes complejos y moralmente ambiguos. Ganó el Oscar al Mejor Actor por su interpretación de J. Robert Oppenheimer en la película homónima de Christopher Nolan. Es ampliamente reconocido por su papel de Tommy Shelby en la serie Peaky Blinders, que le catapultó a la fama internacional.",
		known_for: [
			"Oppenheimer",
			"Peaky Blinders",
			"Batman Begins",
			"28 Days Later"
		],
		works: [
			{
				id: "m2",
				title: "Oppenheimer",
				cover: "https://readdy.ai/api/search-image?query=atomic%20bomb%20explosion%20dramatic%20fire%20mushroom%20cloud%20dark%20cinematic%20historical%20movie%20poster&width=280&height=380&seq=pw-opp2&orientation=portrait",
				year: 2023,
				genre: "Drama",
				category: "movies",
				rating: 8.9,
				role: "J. Robert Oppenheimer"
			},
			{
				id: "peaky",
				title: "Peaky Blinders",
				cover: "https://readdy.ai/api/search-image?query=1920s%20gangster%20birmingham%20dark%20dramatic%20cinematic%20series%20poster%20dark%20tones&width=280&height=380&seq=pw-pb&orientation=portrait",
				year: 2013,
				genre: "Drama",
				category: "series",
				rating: 9.1,
				role: "Tommy Shelby"
			},
			{
				id: "batman-begins",
				title: "Batman Begins",
				cover: "https://readdy.ai/api/search-image?query=batman%20dark%20knight%20begins%20dramatic%20dark%20cinematic%20movie%20poster%20dark%20tones&width=280&height=380&seq=pw-bb&orientation=portrait",
				year: 2005,
				genre: "Acción",
				category: "movies",
				rating: 8.7,
				role: "Dr. Jonathan Crane"
			},
			{
				id: "inception2",
				title: "Inception",
				cover: "https://readdy.ai/api/search-image?query=dream%20city%20folding%20architecture%20surreal%20dramatic%20cinematic%20movie%20poster%20dark%20tones&width=280&height=380&seq=pw-inc2&orientation=portrait",
				year: 2010,
				genre: "Sci-Fi",
				category: "movies",
				rating: 9.2,
				role: "Robert Fischer"
			}
		]
	},
	"timothee-chalamet": {
		id: "timothee-chalamet",
		name: "Timothée Chalamet",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20young%20male%20french%20american%20actor%20elegant%20features%20studio%20lighting%20clean%20background%20neutral%20tones%20cinematic&width=400&height=400&seq=person-tc-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=film%20set%20young%20actor%20performance%20cinematic%20lighting%20behind%20the%20scenes%20professional%20atmosphere%20wide&width=1400&height=500&seq=person-tc-back&orientation=landscape",
		role: "Actor",
		nationality: "Franco-Americano",
		birthYear: 1995,
		bio: "Timothée Chalamet es uno de los actores más talentosos y versátiles de su generación. Nacido en Nueva York de padre francés y madre americana, se convirtió en el actor más joven nominado al Oscar al Mejor Actor por Call Me by Your Name. Su capacidad para interpretar personajes vulnerables y complejos le ha convertido en uno de los rostros más reconocibles del cine contemporáneo.",
		known_for: [
			"Dune",
			"Call Me by Your Name",
			"Little Women",
			"Wonka"
		],
		works: [
			{
				id: "m1",
				title: "Dune: Parte II",
				cover: "https://readdy.ai/api/search-image?query=Dune%20desert%20planet%20sci-fi%20epic%20sand%20dunes%20dramatic%20sky%20cinematic%20movie%20poster%20warm%20tones&width=280&height=380&seq=pw-dune2b&orientation=portrait",
				year: 2024,
				genre: "Sci-Fi",
				category: "movies",
				rating: 8.8,
				role: "Paul Atreides"
			},
			{
				id: "dune1b",
				title: "Dune: Parte I",
				cover: "https://readdy.ai/api/search-image?query=Dune%20desert%20planet%20sci-fi%20epic%20sand%20dunes%20golden%20sky%20cinematic%20movie%20poster%20warm%20tones%20first%20part&width=280&height=380&seq=pw-dune1b&orientation=portrait",
				year: 2021,
				genre: "Sci-Fi",
				category: "movies",
				rating: 8.6,
				role: "Paul Atreides"
			},
			{
				id: "cmbyn",
				title: "Call Me by Your Name",
				cover: "https://readdy.ai/api/search-image?query=summer%20italy%20romance%20dramatic%20warm%20sunlight%20cinematic%20movie%20poster%20warm%20tones&width=280&height=380&seq=pw-cmbyn&orientation=portrait",
				year: 2017,
				genre: "Romance",
				category: "movies",
				rating: 8.8,
				role: "Elio Perlman"
			},
			{
				id: "wonka",
				title: "Wonka",
				cover: "https://readdy.ai/api/search-image?query=chocolate%20factory%20fantasy%20colorful%20whimsical%20cinematic%20movie%20poster%20warm%20tones&width=280&height=380&seq=pw-wonka&orientation=portrait",
				year: 2023,
				genre: "Fantasía",
				category: "movies",
				rating: 7.9,
				role: "Willy Wonka"
			}
		]
	},
	"zendaya": {
		id: "zendaya",
		name: "Zendaya",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20young%20female%20american%20actress%20elegant%20confident%20expression%20studio%20lighting%20clean%20background%20neutral%20tones%20cinematic&width=400&height=400&seq=person-zen-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=film%20set%20actress%20performance%20cinematic%20lighting%20behind%20the%20scenes%20professional%20atmosphere%20wide%20desert%20tones&width=1400&height=500&seq=person-zen-back&orientation=landscape",
		role: "Actriz",
		nationality: "Americana",
		birthYear: 1996,
		bio: "Zendaya Maree Stoermer Coleman es una actriz y cantante americana que comenzó su carrera en Disney Channel y se convirtió en una de las artistas más influyentes de su generación. Ganó el Emmy a la Mejor Actriz Dramática por Euphoria, convirtiéndose en la ganadora más joven de la historia en esa categoría. Su papel como Chani en la saga Dune la consolidó como una de las grandes estrellas del cine de ciencia ficción.",
		known_for: [
			"Dune",
			"Euphoria",
			"Spider-Man",
			"The Greatest Showman"
		],
		works: [
			{
				id: "m1",
				title: "Dune: Parte II",
				cover: "https://readdy.ai/api/search-image?query=Dune%20desert%20planet%20sci-fi%20epic%20sand%20dunes%20dramatic%20sky%20cinematic%20movie%20poster%20warm%20tones&width=280&height=380&seq=pw-dune-zen&orientation=portrait",
				year: 2024,
				genre: "Sci-Fi",
				category: "movies",
				rating: 8.8,
				role: "Chani"
			},
			{
				id: "dune1-zen",
				title: "Dune: Parte I",
				cover: "https://readdy.ai/api/search-image?query=Dune%20desert%20planet%20sci-fi%20epic%20sand%20dunes%20golden%20sky%20cinematic%20movie%20poster%20warm%20tones%20first%20part&width=280&height=380&seq=pw-dune1-zen&orientation=portrait",
				year: 2021,
				genre: "Sci-Fi",
				category: "movies",
				rating: 8.6,
				role: "Chani"
			},
			{
				id: "euphoria",
				title: "Euphoria",
				cover: "https://readdy.ai/api/search-image?query=teen%20drama%20neon%20lights%20dark%20atmospheric%20cinematic%20series%20poster%20vibrant%20tones&width=280&height=380&seq=pw-euph&orientation=portrait",
				year: 2019,
				genre: "Drama",
				category: "series",
				rating: 8.7,
				role: "Rue Bennett"
			},
			{
				id: "challengers",
				title: "Challengers",
				cover: "https://readdy.ai/api/search-image?query=tennis%20sport%20drama%20romantic%20cinematic%20movie%20poster%20warm%20tones&width=280&height=380&seq=pw-chal&orientation=portrait",
				year: 2024,
				genre: "Drama",
				category: "movies",
				rating: 8.1,
				role: "Tashi Duncan"
			}
		]
	},
	"emily-blunt": {
		id: "emily-blunt",
		name: "Emily Blunt",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20british%20female%20actress%20elegant%20sophisticated%20expression%20studio%20lighting%20clean%20background%20neutral%20tones%20cinematic&width=400&height=400&seq=person-eb-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=film%20set%20actress%20performance%20cinematic%20lighting%20behind%20the%20scenes%20professional%20atmosphere%20wide&width=1400&height=500&seq=person-eb-back&orientation=landscape",
		role: "Actriz",
		nationality: "Británica",
		birthYear: 1983,
		bio: "Emily Blunt es una actriz británica reconocida por su versatilidad y capacidad para abordar géneros muy distintos, desde el thriller de acción hasta el drama histórico. Nominada al Oscar por Oppenheimer, donde interpretó a Kitty Oppenheimer, y por Mary Poppins Returns. Es considerada una de las mejores actrices de su generación, con una carrera que combina el cine de autor con grandes producciones de Hollywood.",
		known_for: [
			"Oppenheimer",
			"A Quiet Place",
			"Edge of Tomorrow",
			"The Devil Wears Prada"
		],
		works: [
			{
				id: "m2",
				title: "Oppenheimer",
				cover: "https://readdy.ai/api/search-image?query=atomic%20bomb%20explosion%20dramatic%20fire%20mushroom%20cloud%20dark%20cinematic%20historical%20movie%20poster&width=280&height=380&seq=pw-opp-eb&orientation=portrait",
				year: 2023,
				genre: "Drama",
				category: "movies",
				rating: 8.9,
				role: "Kitty Oppenheimer"
			},
			{
				id: "quiet-place",
				title: "A Quiet Place",
				cover: "https://readdy.ai/api/search-image?query=horror%20thriller%20silence%20forest%20dramatic%20dark%20cinematic%20movie%20poster%20dark%20tones&width=280&height=380&seq=pw-aqp&orientation=portrait",
				year: 2018,
				genre: "Terror",
				category: "movies",
				rating: 8.4,
				role: "Evelyn Abbott"
			},
			{
				id: "edge-tomorrow",
				title: "Edge of Tomorrow",
				cover: "https://readdy.ai/api/search-image?query=sci-fi%20war%20mech%20suit%20battle%20dramatic%20cinematic%20movie%20poster%20dark%20tones&width=280&height=380&seq=pw-eot&orientation=portrait",
				year: 2014,
				genre: "Sci-Fi",
				category: "movies",
				rating: 8.5,
				role: "Rita Vrataski"
			}
		]
	},
	"matt-damon": {
		id: "matt-damon",
		name: "Matt Damon",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20middle%20aged%20american%20male%20actor%20confident%20friendly%20expression%20studio%20lighting%20clean%20background%20neutral%20tones%20cinematic&width=400&height=400&seq=person-md-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=film%20set%20actor%20performance%20cinematic%20lighting%20behind%20the%20scenes%20professional%20atmosphere%20wide&width=1400&height=500&seq=person-md-back&orientation=landscape",
		role: "Actor",
		nationality: "Americano",
		birthYear: 1970,
		bio: "Matt Damon es un actor, guionista y productor americano ganador del Oscar al Mejor Guion Original por Good Will Hunting, que coescribió junto a Ben Affleck. Es conocido por su capacidad para interpretar personajes inteligentes y resilientes, desde el genio matemático Will Hunting hasta el astronauta Mark Watney en The Martian. Su papel como el General Leslie Groves en Oppenheimer fue ampliamente elogiado.",
		known_for: [
			"Oppenheimer",
			"Good Will Hunting",
			"The Martian",
			"Jason Bourne"
		],
		works: [
			{
				id: "m2",
				title: "Oppenheimer",
				cover: "https://readdy.ai/api/search-image?query=atomic%20bomb%20explosion%20dramatic%20fire%20mushroom%20cloud%20dark%20cinematic%20historical%20movie%20poster&width=280&height=380&seq=pw-opp-md&orientation=portrait",
				year: 2023,
				genre: "Drama",
				category: "movies",
				rating: 8.9,
				role: "General Leslie Groves"
			},
			{
				id: "martian",
				title: "The Martian",
				cover: "https://readdy.ai/api/search-image?query=mars%20planet%20astronaut%20survival%20sci-fi%20dramatic%20cinematic%20movie%20poster%20red%20tones&width=280&height=380&seq=pw-mart&orientation=portrait",
				year: 2015,
				genre: "Sci-Fi",
				category: "movies",
				rating: 8.6,
				role: "Mark Watney"
			},
			{
				id: "interstellar-md",
				title: "Interstellar",
				cover: "https://readdy.ai/api/search-image?query=space%20wormhole%20galaxy%20stars%20dramatic%20cosmic%20cinematic%20sci-fi%20movie%20poster%20dark%20blue%20tones&width=280&height=380&seq=pw-int-md&orientation=portrait",
				year: 2014,
				genre: "Sci-Fi",
				category: "movies",
				rating: 9.3,
				role: "Dr. Mann"
			}
		]
	},
	"robert-downey-jr": {
		id: "robert-downey-jr",
		name: "Robert Downey Jr.",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20middle%20aged%20american%20male%20actor%20charismatic%20intense%20expression%20studio%20lighting%20clean%20background%20neutral%20tones%20cinematic&width=400&height=400&seq=person-rdj-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=film%20set%20actor%20performance%20cinematic%20lighting%20behind%20the%20scenes%20professional%20atmosphere%20wide%20dramatic&width=1400&height=500&seq=person-rdj-back&orientation=landscape",
		role: "Actor",
		nationality: "Americano",
		birthYear: 1965,
		bio: "Robert Downey Jr. es uno de los actores más icónicos de Hollywood. Tras superar problemas personales a principios de los 2000, protagonizó uno de los mayores comebacks de la industria al encarnar a Tony Stark / Iron Man en el Universo Cinematográfico de Marvel. Ganó el Oscar al Mejor Actor de Reparto por su interpretación de Lewis Strauss en Oppenheimer, cerrando un círculo perfecto en su carrera.",
		known_for: [
			"Iron Man",
			"Oppenheimer",
			"Sherlock Holmes",
			"Avengers: Endgame"
		],
		works: [
			{
				id: "m2",
				title: "Oppenheimer",
				cover: "https://readdy.ai/api/search-image?query=atomic%20bomb%20explosion%20dramatic%20fire%20mushroom%20cloud%20dark%20cinematic%20historical%20movie%20poster&width=280&height=380&seq=pw-opp-rdj&orientation=portrait",
				year: 2023,
				genre: "Drama",
				category: "movies",
				rating: 8.9,
				role: "Lewis Strauss"
			},
			{
				id: "iron-man",
				title: "Iron Man",
				cover: "https://readdy.ai/api/search-image?query=iron%20man%20superhero%20suit%20dramatic%20cinematic%20movie%20poster%20dark%20tones&width=280&height=380&seq=pw-im&orientation=portrait",
				year: 2008,
				genre: "Acción",
				category: "movies",
				rating: 8.6,
				role: "Tony Stark / Iron Man"
			},
			{
				id: "endgame",
				title: "Avengers: Endgame",
				cover: "https://readdy.ai/api/search-image?query=avengers%20superhero%20epic%20battle%20dramatic%20cinematic%20movie%20poster%20dark%20tones&width=280&height=380&seq=pw-eg&orientation=portrait",
				year: 2019,
				genre: "Acción",
				category: "movies",
				rating: 9,
				role: "Tony Stark / Iron Man"
			}
		]
	},
	"florence-pugh": {
		id: "florence-pugh",
		name: "Florence Pugh",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20young%20british%20female%20actress%20bold%20confident%20expression%20studio%20lighting%20clean%20background%20neutral%20tones%20cinematic&width=400&height=400&seq=person-fp-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=film%20set%20actress%20performance%20cinematic%20lighting%20behind%20the%20scenes%20professional%20atmosphere%20wide&width=1400&height=500&seq=person-fp-back&orientation=landscape",
		role: "Actriz",
		nationality: "Británica",
		birthYear: 1996,
		bio: "Florence Pugh es una actriz británica que se ha convertido en una de las voces más frescas y poderosas del cine contemporáneo. Nominada al Oscar por Little Women, es conocida por su intensidad dramática y su capacidad para dominar la pantalla. Apareció tanto en Oppenheimer como en Dune: Parte II en el mismo año, demostrando su versatilidad en géneros completamente distintos.",
		known_for: [
			"Oppenheimer",
			"Dune: Parte II",
			"Little Women",
			"Midsommar"
		],
		works: [
			{
				id: "m2",
				title: "Oppenheimer",
				cover: "https://readdy.ai/api/search-image?query=atomic%20bomb%20explosion%20dramatic%20fire%20mushroom%20cloud%20dark%20cinematic%20historical%20movie%20poster&width=280&height=380&seq=pw-opp-fp&orientation=portrait",
				year: 2023,
				genre: "Drama",
				category: "movies",
				rating: 8.9,
				role: "Jean Tatlock"
			},
			{
				id: "m1",
				title: "Dune: Parte II",
				cover: "https://readdy.ai/api/search-image?query=Dune%20desert%20planet%20sci-fi%20epic%20sand%20dunes%20dramatic%20sky%20cinematic%20movie%20poster%20warm%20tones&width=280&height=380&seq=pw-dune-fp&orientation=portrait",
				year: 2024,
				genre: "Sci-Fi",
				category: "movies",
				rating: 8.8,
				role: "Princesa Irulan"
			},
			{
				id: "midsommar",
				title: "Midsommar",
				cover: "https://readdy.ai/api/search-image?query=folk%20horror%20summer%20festival%20bright%20dramatic%20cinematic%20movie%20poster%20light%20tones&width=280&height=380&seq=pw-mid2&orientation=portrait",
				year: 2019,
				genre: "Terror",
				category: "movies",
				rating: 8.2,
				role: "Dani Ardor"
			}
		]
	},
	"rebecca-ferguson": {
		id: "rebecca-ferguson",
		name: "Rebecca Ferguson",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20swedish%20female%20actress%20elegant%20poised%20expression%20studio%20lighting%20clean%20background%20neutral%20tones%20cinematic&width=400&height=400&seq=person-rf-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=film%20set%20actress%20performance%20cinematic%20lighting%20behind%20the%20scenes%20professional%20atmosphere%20wide&width=1400&height=500&seq=person-rf-back&orientation=landscape",
		role: "Actriz",
		nationality: "Sueca",
		birthYear: 1983,
		bio: "Rebecca Ferguson es una actriz sueca que saltó a la fama internacional con su papel de Ilsa Faust en la saga Mission: Impossible. Es conocida por su elegancia natural y su capacidad para interpretar personajes fuertes y complejos. Su papel como Lady Jessica en la saga Dune es considerado uno de los mejores de su carrera, aportando profundidad emocional y presencia magnética a la pantalla.",
		known_for: [
			"Dune",
			"Mission: Impossible",
			"Doctor Sleep",
			"The Greatest Showman"
		],
		works: [
			{
				id: "m1",
				title: "Dune: Parte II",
				cover: "https://readdy.ai/api/search-image?query=Dune%20desert%20planet%20sci-fi%20epic%20sand%20dunes%20dramatic%20sky%20cinematic%20movie%20poster%20warm%20tones&width=280&height=380&seq=pw-dune-rf&orientation=portrait",
				year: 2024,
				genre: "Sci-Fi",
				category: "movies",
				rating: 8.8,
				role: "Lady Jessica"
			},
			{
				id: "dune1-rf",
				title: "Dune: Parte I",
				cover: "https://readdy.ai/api/search-image?query=Dune%20desert%20planet%20sci-fi%20epic%20sand%20dunes%20golden%20sky%20cinematic%20movie%20poster%20warm%20tones%20first%20part&width=280&height=380&seq=pw-dune1-rf&orientation=portrait",
				year: 2021,
				genre: "Sci-Fi",
				category: "movies",
				rating: 8.6,
				role: "Lady Jessica"
			},
			{
				id: "mi-rogue",
				title: "Mission: Impossible — Rogue Nation",
				cover: "https://readdy.ai/api/search-image?query=spy%20action%20thriller%20dramatic%20cinematic%20movie%20poster%20dark%20tones&width=280&height=380&seq=pw-mi&orientation=portrait",
				year: 2015,
				genre: "Acción",
				category: "movies",
				rating: 8.3,
				role: "Ilsa Faust"
			}
		]
	},
	"austin-butler": {
		id: "austin-butler",
		name: "Austin Butler",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20young%20american%20male%20actor%20handsome%20intense%20expression%20studio%20lighting%20clean%20background%20neutral%20tones%20cinematic&width=400&height=400&seq=person-ab-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=film%20set%20young%20actor%20performance%20cinematic%20lighting%20behind%20the%20scenes%20professional%20atmosphere%20wide&width=1400&height=500&seq=person-ab-back&orientation=landscape",
		role: "Actor",
		nationality: "Americano",
		birthYear: 1991,
		bio: "Austin Butler es un actor americano que se convirtió en estrella internacional tras su aclamada interpretación de Elvis Presley en la biopic de Baz Luhrmann. Nominado al Oscar por ese papel, demostró una transformación física y vocal extraordinaria. En Dune: Parte II encarnó al villano Feyd-Rautha Harkonnen, un papel radicalmente opuesto que confirmó su versatilidad como actor.",
		known_for: [
			"Dune: Parte II",
			"Elvis",
			"The Bikeriders"
		],
		works: [{
			id: "m1",
			title: "Dune: Parte II",
			cover: "https://readdy.ai/api/search-image?query=Dune%20desert%20planet%20sci-fi%20epic%20sand%20dunes%20dramatic%20sky%20cinematic%20movie%20poster%20warm%20tones&width=280&height=380&seq=pw-dune-ab&orientation=portrait",
			year: 2024,
			genre: "Sci-Fi",
			category: "movies",
			rating: 8.8,
			role: "Feyd-Rautha Harkonnen"
		}, {
			id: "elvis",
			title: "Elvis",
			cover: "https://readdy.ai/api/search-image?query=rock%20and%20roll%201950s%20performer%20stage%20dramatic%20cinematic%20movie%20poster%20warm%20tones&width=280&height=380&seq=pw-elvis&orientation=portrait",
			year: 2022,
			genre: "Drama",
			category: "movies",
			rating: 8.4,
			role: "Elvis Presley"
		}]
	},
	"pedro-pascal": {
		id: "pedro-pascal",
		name: "Pedro Pascal",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20latin%20male%20actor%20charismatic%20expression%20studio%20lighting%20clean%20background%20neutral%20tones%20cinematic&width=400&height=400&seq=person-pp-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=dramatic%20tv%20series%20set%20actor%20performance%20cinematic%20lighting%20behind%20the%20scenes%20professional%20atmosphere%20wide&width=1400&height=500&seq=person-pp-back&orientation=landscape",
		role: "Actor",
		nationality: "Chileno-Americano",
		birthYear: 1975,
		bio: "Pedro Pascal es un actor chileno-americano que se convirtió en una de las estrellas más queridas de Hollywood. Nacido en Santiago de Chile, emigró a Estados Unidos de niño. Saltó a la fama internacional con su papel de Oberyn Martell en Game of Thrones, y se consolidó como estrella con The Mandalorian y The Last of Us. Es conocido por su carisma natural y su capacidad para conectar emocionalmente con el público.",
		known_for: [
			"The Last of Us",
			"The Mandalorian",
			"Game of Thrones",
			"Narcos"
		],
		works: [
			{
				id: "s1",
				title: "The Last of Us",
				cover: "https://readdy.ai/api/search-image?query=post%20apocalyptic%20city%20overgrown%20nature%20dramatic%20lighting%20dark%20moody%20atmosphere%20cinematic%20series%20poster&width=280&height=380&seq=pw-tlou&orientation=portrait",
				year: 2023,
				genre: "Drama",
				category: "series",
				rating: 9.1,
				role: "Joel Miller"
			},
			{
				id: "mando",
				title: "The Mandalorian",
				cover: "https://readdy.ai/api/search-image?query=star%20wars%20mandalorian%20space%20western%20dramatic%20cinematic%20series%20poster%20dark%20tones&width=280&height=380&seq=pw-mando&orientation=portrait",
				year: 2019,
				genre: "Sci-Fi",
				category: "series",
				rating: 8.8,
				role: "Din Djarin"
			},
			{
				id: "narcos",
				title: "Narcos",
				cover: "https://readdy.ai/api/search-image?query=colombia%20drug%20cartel%20crime%20thriller%20dramatic%20cinematic%20series%20poster%20warm%20tones&width=280&height=380&seq=pw-narcos&orientation=portrait",
				year: 2015,
				genre: "Drama",
				category: "series",
				rating: 8.9,
				role: "Javier Peña"
			},
			{
				id: "got-pp",
				title: "Game of Thrones",
				cover: "https://readdy.ai/api/search-image?query=medieval%20fantasy%20throne%20dramatic%20dark%20cinematic%20series%20poster%20dark%20tones&width=280&height=380&seq=pw-got&orientation=portrait",
				year: 2011,
				genre: "Fantasía",
				category: "series",
				rating: 9.2,
				role: "Oberyn Martell"
			}
		]
	},
	"bella-ramsey": {
		id: "bella-ramsey",
		name: "Bella Ramsey",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20young%20british%20non-binary%20actor%20expressive%20determined%20expression%20studio%20lighting%20clean%20background%20neutral%20tones%20cinematic&width=400&height=400&seq=person-br-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=tv%20series%20set%20actor%20performance%20cinematic%20lighting%20behind%20the%20scenes%20professional%20atmosphere%20wide&width=1400&height=500&seq=person-br-back&orientation=landscape",
		role: "Actor/Actriz",
		nationality: "Británico/a",
		birthYear: 2003,
		bio: "Bella Ramsey es un actor y actriz británico/a que saltó a la fama con su papel de Lyanna Mormont en Game of Thrones. Su interpretación de Ellie en The Last of Us fue universalmente aclamada, ganando múltiples nominaciones a los Emmy y convirtiéndose en una de las actuaciones más memorables de la televisión reciente. Con tan solo 20 años, es considerado/a uno de los talentos más prometedores de su generación.",
		known_for: [
			"The Last of Us",
			"Game of Thrones",
			"Hilda"
		],
		works: [{
			id: "s1",
			title: "The Last of Us",
			cover: "https://readdy.ai/api/search-image?query=post%20apocalyptic%20city%20overgrown%20nature%20dramatic%20lighting%20dark%20moody%20atmosphere%20cinematic%20series%20poster&width=280&height=380&seq=pw-tlou-br&orientation=portrait",
			year: 2023,
			genre: "Drama",
			category: "series",
			rating: 9.1,
			role: "Ellie Williams"
		}, {
			id: "got-br",
			title: "Game of Thrones",
			cover: "https://readdy.ai/api/search-image?query=medieval%20fantasy%20throne%20dramatic%20dark%20cinematic%20series%20poster%20dark%20tones&width=280&height=380&seq=pw-got-br&orientation=portrait",
			year: 2016,
			genre: "Fantasía",
			category: "series",
			rating: 9.2,
			role: "Lyanna Mormont"
		}]
	},
	"gabriel-luna": {
		id: "gabriel-luna",
		name: "Gabriel Luna",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20latin%20american%20male%20actor%20serious%20intense%20expression%20studio%20lighting%20clean%20background%20neutral%20tones%20cinematic&width=400&height=400&seq=person-gl-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=tv%20series%20set%20actor%20performance%20cinematic%20lighting%20behind%20the%20scenes%20professional%20atmosphere%20wide&width=1400&height=500&seq=person-gl-back&orientation=landscape",
		role: "Actor",
		nationality: "Americano",
		birthYear: 1982,
		bio: "Gabriel Luna es un actor americano de ascendencia mexicana conocido por sus papeles en series y películas de acción. Su interpretación de Tommy Miller en The Last of Us, el hermano de Joel, fue muy elogiada por su profundidad emocional y su química con Pedro Pascal. También es conocido por su papel del Terminator Rev-9 en Terminator: Dark Fate.",
		known_for: [
			"The Last of Us",
			"Terminator: Dark Fate",
			"Agents of S.H.I.E.L.D."
		],
		works: [{
			id: "s1",
			title: "The Last of Us",
			cover: "https://readdy.ai/api/search-image?query=post%20apocalyptic%20city%20overgrown%20nature%20dramatic%20lighting%20dark%20moody%20atmosphere%20cinematic%20series%20poster&width=280&height=380&seq=pw-tlou-gl&orientation=portrait",
			year: 2023,
			genre: "Drama",
			category: "series",
			rating: 9.1,
			role: "Tommy Miller"
		}, {
			id: "terminator-df",
			title: "Terminator: Dark Fate",
			cover: "https://readdy.ai/api/search-image?query=terminator%20robot%20sci-fi%20action%20dramatic%20cinematic%20movie%20poster%20dark%20tones&width=280&height=380&seq=pw-tdf&orientation=portrait",
			year: 2019,
			genre: "Acción",
			category: "movies",
			rating: 7.4,
			role: "Rev-9"
		}]
	},
	"anna-torv": {
		id: "anna-torv",
		name: "Anna Torv",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20an%20australian%20female%20actress%20calm%20intelligent%20expression%20studio%20lighting%20clean%20background%20neutral%20tones%20cinematic&width=400&height=400&seq=person-at-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=tv%20series%20set%20actress%20performance%20cinematic%20lighting%20behind%20the%20scenes%20professional%20atmosphere%20wide&width=1400&height=500&seq=person-at-back&orientation=landscape",
		role: "Actriz",
		nationality: "Australiana",
		birthYear: 1979,
		bio: "Anna Torv es una actriz australiana conocida principalmente por su papel protagonista en la serie de ciencia ficción Fringe, donde interpretó a la agente Olivia Dunham durante cinco temporadas. Su papel de Tess en The Last of Us, aunque breve, fue uno de los más impactantes del primer episodio y fue ampliamente elogiado por la crítica.",
		known_for: [
			"The Last of Us",
			"Fringe",
			"Mindhunter"
		],
		works: [
			{
				id: "s1",
				title: "The Last of Us",
				cover: "https://readdy.ai/api/search-image?query=post%20apocalyptic%20city%20overgrown%20nature%20dramatic%20lighting%20dark%20moody%20atmosphere%20cinematic%20series%20poster&width=280&height=380&seq=pw-tlou-at&orientation=portrait",
				year: 2023,
				genre: "Drama",
				category: "series",
				rating: 9.1,
				role: "Tess"
			},
			{
				id: "fringe",
				title: "Fringe",
				cover: "https://readdy.ai/api/search-image?query=sci-fi%20mystery%20investigation%20dramatic%20cinematic%20series%20poster%20dark%20tones&width=280&height=380&seq=pw-fringe&orientation=portrait",
				year: 2008,
				genre: "Sci-Fi",
				category: "series",
				rating: 8.5,
				role: "Olivia Dunham"
			},
			{
				id: "mindhunter",
				title: "Mindhunter",
				cover: "https://readdy.ai/api/search-image?query=crime%20thriller%20FBI%20investigation%20dark%20dramatic%20cinematic%20series%20poster%20dark%20tones&width=280&height=380&seq=pw-mh&orientation=portrait",
				year: 2017,
				genre: "Thriller",
				category: "series",
				rating: 8.9,
				role: "Wendy Carr"
			}
		]
	},
	"adam-scott": {
		id: "adam-scott",
		name: "Adam Scott",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20an%20american%20male%20actor%20friendly%20approachable%20expression%20studio%20lighting%20clean%20background%20neutral%20tones%20cinematic&width=400&height=400&seq=person-as-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=corporate%20office%20surreal%20minimalist%20tv%20series%20set%20cinematic%20lighting%20behind%20the%20scenes%20professional%20atmosphere%20wide&width=1400&height=500&seq=person-as-back&orientation=landscape",
		role: "Actor",
		nationality: "Americano",
		birthYear: 1973,
		bio: "Adam Scott es un actor americano conocido por su versatilidad en comedia y drama. Saltó a la fama con Parks and Recreation, donde interpretó a Ben Wyatt durante seis temporadas. Su papel de Mark Scout en Severance es considerado el mejor de su carrera, mostrando una profundidad dramática que sorprendió a crítica y público. Ha ganado múltiples premios por esta interpretación.",
		known_for: [
			"Severance",
			"Parks and Recreation",
			"Big Little Lies"
		],
		works: [{
			id: "s2",
			title: "Severance",
			cover: "https://readdy.ai/api/search-image?query=corporate%20office%20surreal%20minimalist%20dark%20thriller%20dramatic%20lighting%20cinematic%20series%20poster&width=280&height=380&seq=pw-sev-as&orientation=portrait",
			year: 2022,
			genre: "Thriller",
			category: "series",
			rating: 9,
			role: "Mark Scout"
		}, {
			id: "parks-rec",
			title: "Parks and Recreation",
			cover: "https://readdy.ai/api/search-image?query=comedy%20government%20office%20warm%20colorful%20cinematic%20series%20poster%20warm%20tones&width=280&height=380&seq=pw-pr&orientation=portrait",
			year: 2009,
			genre: "Comedia",
			category: "series",
			rating: 8.8,
			role: "Ben Wyatt"
		}]
	},
	"britt-lower": {
		id: "britt-lower",
		name: "Britt Lower",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20an%20american%20female%20actress%20warm%20expressive%20expression%20studio%20lighting%20clean%20background%20neutral%20tones%20cinematic&width=400&height=400&seq=person-bl-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=corporate%20office%20surreal%20minimalist%20tv%20series%20set%20cinematic%20lighting%20behind%20the%20scenes%20professional%20atmosphere%20wide&width=1400&height=500&seq=person-bl-back&orientation=landscape",
		role: "Actriz",
		nationality: "Americana",
		birthYear: 1986,
		bio: "Britt Lower es una actriz americana que se hizo conocida a nivel internacional por su papel de Helly R. en Severance. Su interpretación de una empleada que lucha por entender su situación en Lumon Industries fue ampliamente elogiada por su intensidad y matices emocionales. Antes de Severance, tuvo papeles recurrentes en series como Crashing y High Maintenance.",
		known_for: [
			"Severance",
			"Crashing",
			"High Maintenance"
		],
		works: [{
			id: "s2",
			title: "Severance",
			cover: "https://readdy.ai/api/search-image?query=corporate%20office%20surreal%20minimalist%20dark%20thriller%20dramatic%20lighting%20cinematic%20series%20poster&width=280&height=380&seq=pw-sev-bl&orientation=portrait",
			year: 2022,
			genre: "Thriller",
			category: "series",
			rating: 9,
			role: "Helly R."
		}]
	},
	"taylor-swift": {
		id: "taylor-swift",
		name: "Taylor Swift",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20young%20female%20pop%20singer%20performer%20elegant%20expression%20studio%20lighting%20clean%20background%20neutral%20tones&width=400&height=400&seq=person-ts-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=concert%20stage%20spectacular%20lights%20show%20performer%20crowd%20energy%20colorful%20beams%20dramatic%20atmosphere%20music%20event%20wide&width=1400&height=500&seq=person-ts-back&orientation=landscape",
		role: "Artista",
		nationality: "Americana",
		birthYear: 1989,
		bio: "Taylor Swift es una cantautora y artista americana que se ha convertido en la artista musical más influyente de su generación. Con más de 200 millones de álbumes vendidos, es una de las artistas más vendidas de todos los tiempos. Su Eras Tour se convirtió en la gira más taquillera de la historia, superando los 1.000 millones de dólares en recaudación. Ha ganado 14 Grammys y es conocida por su capacidad para reinventarse musicalmente en cada era.",
		known_for: [
			"Eras Tour",
			"Midnights",
			"Folklore",
			"1989"
		],
		works: [
			{
				id: "c1",
				title: "Taylor Swift — Eras Tour",
				cover: "https://readdy.ai/api/search-image?query=concert%20stage%20spectacular%20lights%20show%20performer%20crowd%20energy%20colorful%20beams%20dramatic%20atmosphere%20music%20event&width=280&height=380&seq=pw-ts&orientation=portrait",
				year: 2024,
				genre: "Pop",
				category: "concerts",
				rating: 9.7,
				role: "Artista principal"
			},
			{
				id: "midnights",
				title: "Midnights (álbum)",
				cover: "https://readdy.ai/api/search-image?query=midnight%20dark%20blue%20stars%20moon%20album%20cover%20artistic%20music%20pop&width=280&height=380&seq=pw-mid&orientation=portrait",
				year: 2022,
				genre: "Pop",
				category: "concerts",
				rating: 9.1,
				role: "Artista"
			},
			{
				id: "folklore",
				title: "Folklore (álbum)",
				cover: "https://readdy.ai/api/search-image?query=forest%20misty%20atmospheric%20indie%20folk%20album%20cover%20artistic%20music&width=280&height=380&seq=pw-folk&orientation=portrait",
				year: 2020,
				genre: "Indie Folk",
				category: "concerts",
				rating: 9.4,
				role: "Artista"
			}
		]
	},
	"liu-cixin": {
		id: "liu-cixin",
		name: "Liu Cixin",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20chinese%20male%20author%20writer%20serious%20expression%20studio%20lighting%20clean%20background%20neutral%20tones&width=400&height=400&seq=person-lc-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=science%20fiction%20space%20stars%20cosmic%20dark%20background%20artistic%20wide%20panoramic&width=1400&height=500&seq=person-lc-back&orientation=landscape",
		role: "Autor",
		nationality: "Chino",
		birthYear: 1963,
		bio: "Liu Cixin es el autor de ciencia ficción más importante de China y uno de los más influyentes del mundo. Ingeniero de profesión, comenzó a escribir en su tiempo libre y se convirtió en el primer autor asiático en ganar el Premio Hugo con El Problema de los Tres Cuerpos. Su obra se caracteriza por la ciencia dura, la escala cósmica y una visión filosófica única sobre la humanidad y el universo.",
		known_for: [
			"El Problema de los Tres Cuerpos",
			"El Bosque Oscuro",
			"El Fin de la Muerte"
		],
		works: [
			{
				id: "b1",
				title: "El Problema de los Tres Cuerpos",
				cover: "https://readdy.ai/api/search-image?query=science%20fiction%20book%20cover%20space%20stars%20three%20body%20problem%20cosmic%20dark%20background%20artistic%20illustration&width=280&height=380&seq=pw-3b&orientation=portrait",
				year: 2008,
				genre: "Sci-Fi",
				category: "books",
				rating: 9,
				role: "Autor"
			},
			{
				id: "dark-forest",
				title: "El Bosque Oscuro",
				cover: "https://readdy.ai/api/search-image?query=dark%20forest%20space%20sci-fi%20cosmic%20book%20cover%20artistic%20illustration%20dark%20tones&width=280&height=380&seq=pw-df&orientation=portrait",
				year: 2008,
				genre: "Sci-Fi",
				category: "books",
				rating: 9.2,
				role: "Autor"
			},
			{
				id: "end-death",
				title: "El Fin de la Muerte",
				cover: "https://readdy.ai/api/search-image?query=cosmic%20space%20death%20stars%20sci-fi%20book%20cover%20artistic%20illustration%20dark%20tones&width=280&height=380&seq=pw-ed&orientation=portrait",
				year: 2010,
				genre: "Sci-Fi",
				category: "books",
				rating: 9.1,
				role: "Autor"
			},
			{
				id: "ball-lightning",
				title: "Bola de Rayo",
				cover: "https://readdy.ai/api/search-image?query=lightning%20ball%20energy%20sci-fi%20book%20cover%20artistic%20illustration%20dramatic%20tones&width=280&height=380&seq=pw-bl&orientation=portrait",
				year: 2004,
				genre: "Sci-Fi",
				category: "books",
				rating: 8.4,
				role: "Autor"
			}
		]
	},
	"frank-herbert": {
		id: "frank-herbert",
		name: "Frank Herbert",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20an%20older%20american%20male%20science%20fiction%20author%20wise%20thoughtful%20expression%20studio%20lighting%20clean%20background%20neutral%20tones&width=400&height=400&seq=person-fh-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=desert%20landscape%20science%20fiction%20cosmic%20dramatic%20wide%20panoramic%20warm%20tones&width=1400&height=500&seq=person-fh-back&orientation=landscape",
		role: "Autor",
		nationality: "Americano",
		birthYear: 1920,
		bio: "Frank Herbert fue un escritor americano de ciencia ficción, conocido principalmente por su saga Dune, considerada la novela de ciencia ficción más vendida de todos los tiempos. Publicada en 1965, Dune es una obra maestra que explora temas de ecología, política, religión y el poder a través de la historia de la familia Atreides en el planeta desértico Arrakis. Herbert falleció en 1986, dejando seis novelas de la saga Dune.",
		known_for: [
			"Dune",
			"El Mesías de Dune",
			"Hijos de Dune"
		],
		works: [
			{
				id: "b2",
				title: "Dune",
				cover: "https://readdy.ai/api/search-image?query=desert%20planet%20sci-fi%20book%20cover%20sand%20dunes%20dramatic%20sky%20artistic%20illustration%20warm%20tones&width=280&height=380&seq=pw-duneb-fh&orientation=portrait",
				year: 1965,
				genre: "Sci-Fi",
				category: "books",
				rating: 9.4,
				role: "Autor"
			},
			{
				id: "dune-messiah",
				title: "El Mesías de Dune",
				cover: "https://readdy.ai/api/search-image?query=desert%20planet%20sci-fi%20book%20cover%20sand%20dunes%20dramatic%20sky%20artistic%20illustration%20warm%20tones%20sequel&width=280&height=380&seq=pw-dm&orientation=portrait",
				year: 1969,
				genre: "Sci-Fi",
				category: "books",
				rating: 8.8,
				role: "Autor"
			},
			{
				id: "children-dune",
				title: "Hijos de Dune",
				cover: "https://readdy.ai/api/search-image?query=desert%20planet%20sci-fi%20book%20cover%20sand%20dunes%20dramatic%20sky%20artistic%20illustration%20warm%20tones%20third&width=280&height=380&seq=pw-cd&orientation=portrait",
				year: 1976,
				genre: "Sci-Fi",
				category: "books",
				rating: 8.6,
				role: "Autor"
			}
		]
	},
	"george-orwell": {
		id: "george-orwell",
		name: "George Orwell",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20british%20male%20author%20serious%20intellectual%20expression%20vintage%20style%20studio%20lighting%20clean%20background%20neutral%20tones&width=400&height=400&seq=person-go-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=dystopian%20surveillance%20dark%20dramatic%20wide%20panoramic%20cold%20tones&width=1400&height=500&seq=person-go-back&orientation=landscape",
		role: "Autor",
		nationality: "Británico",
		birthYear: 1903,
		bio: "Eric Arthur Blair, conocido por su seudónimo George Orwell, fue un novelista, ensayista y crítico social británico. Sus obras más famosas, 1984 y Rebelión en la Granja, son consideradas clásicos de la literatura del siglo XX y han tenido una influencia enorme en la cultura popular y el pensamiento político. Sus conceptos como el \"Gran Hermano\", el \"doblepensar\" y la \"neolengua\" han pasado al vocabulario cotidiano.",
		known_for: [
			"1984",
			"Rebelión en la Granja",
			"Homenaje a Cataluña"
		],
		works: [{
			id: "b3",
			title: "1984",
			cover: "https://readdy.ai/api/search-image?query=dystopian%20surveillance%20dark%20eye%20watching%20dramatic%20dark%20book%20cover%20artistic%20illustration%20cold%20tones&width=280&height=380&seq=pw-1984-go&orientation=portrait",
			year: 1949,
			genre: "Distopía",
			category: "books",
			rating: 9.2,
			role: "Autor"
		}, {
			id: "animal-farm",
			title: "Rebelión en la Granja",
			cover: "https://readdy.ai/api/search-image?query=farm%20animals%20political%20satire%20book%20cover%20artistic%20illustration%20warm%20tones&width=280&height=380&seq=pw-af&orientation=portrait",
			year: 1945,
			genre: "Sátira",
			category: "books",
			rating: 9,
			role: "Autor"
		}]
	},
	"patrick-rothfuss": {
		id: "patrick-rothfuss",
		name: "Patrick Rothfuss",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20an%20american%20male%20fantasy%20author%20bearded%20thoughtful%20expression%20studio%20lighting%20clean%20background%20neutral%20tones&width=400&height=400&seq=person-pr-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=fantasy%20magic%20wind%20dramatic%20sky%20wide%20panoramic%20warm%20tones%20epic&width=1400&height=500&seq=person-pr-back&orientation=landscape",
		role: "Autor",
		nationality: "Americano",
		birthYear: 1973,
		bio: "Patrick Rothfuss es un escritor americano de fantasía épica, conocido por su trilogía Crónica del Asesino de Reyes. El primer libro, El Nombre del Viento, fue aclamado como una de las mejores novelas de fantasía de las últimas décadas. La historia de Kvothe, narrada en primera persona con una prosa extraordinariamente bella, ha cautivado a millones de lectores en todo el mundo. Los fans esperan con ansias el tercer libro de la trilogía.",
		known_for: ["El Nombre del Viento", "El Temor de un Hombre Sabio"],
		works: [{
			id: "b4",
			title: "El Nombre del Viento",
			cover: "https://readdy.ai/api/search-image?query=fantasy%20magic%20wind%20dramatic%20sky%20book%20cover%20artistic%20illustration%20warm%20tones%20epic&width=280&height=380&seq=pw-nv-pr&orientation=portrait",
			year: 2007,
			genre: "Fantasía",
			category: "books",
			rating: 9.1,
			role: "Autor"
		}, {
			id: "wise-mans-fear",
			title: "El Temor de un Hombre Sabio",
			cover: "https://readdy.ai/api/search-image?query=fantasy%20magic%20adventure%20dramatic%20sky%20book%20cover%20artistic%20illustration%20warm%20tones%20epic%20sequel&width=280&height=380&seq=pw-wmf&orientation=portrait",
			year: 2011,
			genre: "Fantasía",
			category: "books",
			rating: 9,
			role: "Autor"
		}]
	},
	"yuval-noah-harari": {
		id: "yuval-noah-harari",
		name: "Yuval Noah Harari",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20an%20israeli%20male%20historian%20author%20intellectual%20expression%20studio%20lighting%20clean%20background%20neutral%20tones&width=400&height=400&seq=person-ynh-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=human%20civilization%20history%20dramatic%20wide%20panoramic%20earth%20tones&width=1400&height=500&seq=person-ynh-back&orientation=landscape",
		role: "Autor",
		nationality: "Israelí",
		birthYear: 1976,
		bio: "Yuval Noah Harari es un historiador, filósofo y escritor israelí, profesor en la Universidad Hebrea de Jerusalén. Su libro Sapiens: De animales a dioses se convirtió en un fenómeno editorial mundial, vendiendo más de 20 millones de copias en más de 60 idiomas. Sus obras exploran la historia de la humanidad, el futuro de nuestra especie y el impacto de la tecnología en la sociedad.",
		known_for: [
			"Sapiens",
			"Homo Deus",
			"21 lecciones para el siglo XXI"
		],
		works: [
			{
				id: "b5",
				title: "Sapiens",
				cover: "https://readdy.ai/api/search-image?query=human%20evolution%20history%20dramatic%20artistic%20book%20cover%20illustration%20earth%20civilization&width=280&height=380&seq=pw-sap-ynh&orientation=portrait",
				year: 2011,
				genre: "No ficción",
				category: "books",
				rating: 8.8,
				role: "Autor"
			},
			{
				id: "homo-deus",
				title: "Homo Deus",
				cover: "https://readdy.ai/api/search-image?query=future%20human%20technology%20sci-fi%20book%20cover%20artistic%20illustration%20futuristic%20tones&width=280&height=380&seq=pw-hd&orientation=portrait",
				year: 2015,
				genre: "No ficción",
				category: "books",
				rating: 8.5,
				role: "Autor"
			},
			{
				id: "21-lessons",
				title: "21 lecciones para el siglo XXI",
				cover: "https://readdy.ai/api/search-image?query=modern%20society%20technology%20book%20cover%20artistic%20illustration%20contemporary%20tones&width=280&height=380&seq=pw-21l&orientation=portrait",
				year: 2018,
				genre: "No ficción",
				category: "books",
				rating: 8.3,
				role: "Autor"
			}
		]
	},
	"carlos-ruiz-zafon": {
		id: "carlos-ruiz-zafon",
		name: "Carlos Ruiz Zafón",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20spanish%20male%20author%20warm%20thoughtful%20expression%20studio%20lighting%20clean%20background%20neutral%20tones&width=400&height=400&seq=person-crz-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=gothic%20barcelona%20city%20night%20dramatic%20wide%20panoramic%20dark%20tones&width=1400&height=500&seq=person-crz-back&orientation=landscape",
		role: "Autor",
		nationality: "Español",
		birthYear: 1964,
		bio: "Carlos Ruiz Zafón fue un escritor español nacido en Barcelona, conocido mundialmente por su novela La Sombra del Viento, primera entrega del Cementerio de los Libros Olvidados. Con más de 15 millones de copias vendidas en todo el mundo, es uno de los autores españoles más leídos internacionalmente. Su prosa evocadora y sus tramas llenas de misterio ambientadas en la Barcelona del siglo XX le convirtieron en un referente de la literatura contemporánea. Falleció en 2020.",
		known_for: [
			"La Sombra del Viento",
			"El Juego del Ángel",
			"El Prisionero del Cielo"
		],
		works: [
			{
				id: "b6",
				title: "La Sombra del Viento",
				cover: "https://readdy.ai/api/search-image?query=gothic%20barcelona%20mystery%20dark%20cemetery%20dramatic%20lighting%20book%20cover%20artistic%20illustration&width=280&height=380&seq=pw-sv-crz&orientation=portrait",
				year: 2001,
				genre: "Misterio",
				category: "books",
				rating: 9,
				role: "Autor"
			},
			{
				id: "angel-game",
				title: "El Juego del Ángel",
				cover: "https://readdy.ai/api/search-image?query=gothic%20mystery%20dark%20barcelona%20dramatic%20book%20cover%20artistic%20illustration%20dark%20tones&width=280&height=380&seq=pw-jda&orientation=portrait",
				year: 2008,
				genre: "Misterio",
				category: "books",
				rating: 8.7,
				role: "Autor"
			},
			{
				id: "prisoner-heaven",
				title: "El Prisionero del Cielo",
				cover: "https://readdy.ai/api/search-image?query=gothic%20mystery%20prison%20dark%20dramatic%20book%20cover%20artistic%20illustration%20dark%20tones&width=280&height=380&seq=pw-pdc&orientation=portrait",
				year: 2011,
				genre: "Misterio",
				category: "books",
				rating: 8.5,
				role: "Autor"
			}
		]
	},
	"isaac-asimov": {
		id: "isaac-asimov",
		name: "Isaac Asimov",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20an%20older%20american%20male%20science%20fiction%20author%20intellectual%20expression%20vintage%20style%20studio%20lighting%20clean%20background%20neutral%20tones&width=400&height=400&seq=person-ia-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=galactic%20empire%20sci-fi%20space%20dramatic%20wide%20panoramic%20stars%20civilization&width=1400&height=500&seq=person-ia-back&orientation=landscape",
		role: "Autor",
		nationality: "Americano",
		birthYear: 1920,
		bio: "Isaac Asimov fue un escritor y bioquímico americano, uno de los autores de ciencia ficción más prolíficos e influyentes de todos los tiempos. Escribió más de 500 libros a lo largo de su vida. Es conocido por sus series de la Fundación y los Robots, así como por las Tres Leyes de la Robótica, que han influido profundamente en la cultura popular y el pensamiento sobre la inteligencia artificial.",
		known_for: [
			"Fundación",
			"Yo, Robot",
			"La Trilogía de la Fundación"
		],
		works: [
			{
				id: "b7",
				title: "Fundación",
				cover: "https://readdy.ai/api/search-image?query=galactic%20empire%20sci-fi%20space%20dramatic%20artistic%20book%20cover%20illustration%20stars%20civilization&width=280&height=380&seq=pw-found-ia&orientation=portrait",
				year: 1951,
				genre: "Sci-Fi",
				category: "books",
				rating: 9.3,
				role: "Autor"
			},
			{
				id: "i-robot",
				title: "Yo, Robot",
				cover: "https://readdy.ai/api/search-image?query=robot%20artificial%20intelligence%20sci-fi%20book%20cover%20artistic%20illustration%20futuristic%20tones&width=280&height=380&seq=pw-ir&orientation=portrait",
				year: 1950,
				genre: "Sci-Fi",
				category: "books",
				rating: 9,
				role: "Autor"
			},
			{
				id: "foundation-empire",
				title: "Fundación e Imperio",
				cover: "https://readdy.ai/api/search-image?query=galactic%20empire%20sci-fi%20space%20dramatic%20artistic%20book%20cover%20illustration%20stars%20civilization%20sequel&width=280&height=380&seq=pw-fe&orientation=portrait",
				year: 1952,
				genre: "Sci-Fi",
				category: "books",
				rating: 9.1,
				role: "Autor"
			}
		]
	},
	"gabriel-garcia-marquez": {
		id: "gabriel-garcia-marquez",
		name: "Gabriel García Márquez",
		photo: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20colombian%20male%20author%20warm%20wise%20expression%20vintage%20style%20studio%20lighting%20clean%20background%20neutral%20tones&width=400&height=400&seq=person-ggm-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=magical%20realism%20latin%20america%20tropical%20dramatic%20wide%20panoramic%20warm%20tones&width=1400&height=500&seq=person-ggm-back&orientation=landscape",
		role: "Autor",
		nationality: "Colombiano",
		birthYear: 1927,
		bio: "Gabriel García Márquez, conocido cariñosamente como \"Gabo\", fue un escritor y periodista colombiano, considerado uno de los autores más significativos del siglo XX. Ganador del Premio Nobel de Literatura en 1982, es el máximo exponente del realismo mágico. Cien Años de Soledad, su obra maestra, es considerada una de las novelas más importantes de la literatura universal y ha vendido más de 50 millones de copias. Falleció en 2014.",
		known_for: [
			"Cien Años de Soledad",
			"El Amor en los Tiempos del Cólera",
			"Crónica de una Muerte Anunciada"
		],
		works: [
			{
				id: "b8",
				title: "Cien Años de Soledad",
				cover: "https://readdy.ai/api/search-image?query=magical%20realism%20latin%20america%20tropical%20dramatic%20artistic%20book%20cover%20illustration%20warm%20tones&width=280&height=380&seq=pw-cien-ggm&orientation=portrait",
				year: 1967,
				genre: "Realismo mágico",
				category: "books",
				rating: 9.5,
				role: "Autor"
			},
			{
				id: "love-cholera",
				title: "El Amor en los Tiempos del Cólera",
				cover: "https://readdy.ai/api/search-image?query=romantic%20latin%20america%20tropical%20dramatic%20artistic%20book%20cover%20illustration%20warm%20tones&width=280&height=380&seq=pw-atc&orientation=portrait",
				year: 1985,
				genre: "Romance",
				category: "books",
				rating: 9.1,
				role: "Autor"
			},
			{
				id: "chronicle-death",
				title: "Crónica de una Muerte Anunciada",
				cover: "https://readdy.ai/api/search-image?query=latin%20america%20mystery%20dramatic%20artistic%20book%20cover%20illustration%20warm%20tones&width=280&height=380&seq=pw-cma&orientation=portrait",
				year: 1981,
				genre: "Misterio",
				category: "books",
				rating: 8.9,
				role: "Autor"
			}
		]
	},
	"fromsoftware": {
		id: "fromsoftware",
		name: "FromSoftware",
		photo: "https://readdy.ai/api/search-image?query=professional%20game%20studio%20logo%20dark%20minimalist%20design%20clean%20background%20neutral%20tones&width=400&height=400&seq=person-fs-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=dark%20fantasy%20game%20development%20studio%20cinematic%20dramatic%20lighting%20wide%20panoramic&width=1400&height=500&seq=person-fs-back&orientation=landscape",
		role: "Desarrollador",
		nationality: "Japonés",
		birthYear: 1986,
		bio: "FromSoftware es un estudio de desarrollo de videojuegos japonés fundado en 1986. Bajo la dirección creativa de Hidetaka Miyazaki, se convirtieron en pioneros del subgénero \"Soulslike\" con la saga Dark Souls. Son conocidos por sus juegos de alta dificultad, narrativas crípticas contadas a través del entorno y los objetos, y un diseño de niveles intrincado. Elden Ring, su colaboración con George R.R. Martin, se convirtió en uno de los juegos más vendidos y aclamados de la historia.",
		known_for: [
			"Elden Ring",
			"Dark Souls",
			"Sekiro",
			"Bloodborne"
		],
		works: [
			{
				id: "g1",
				title: "Elden Ring",
				cover: "https://readdy.ai/api/search-image?query=Elden%20Ring%20fantasy%20dark%20souls%20epic%20landscape%20golden%20tree%20dramatic%20sky%20cinematic%20game%20art%20dark%20moody&width=280&height=380&seq=pw-er&orientation=portrait",
				year: 2022,
				genre: "RPG",
				category: "games",
				rating: 9.4,
				role: "Desarrollador"
			},
			{
				id: "sekiro",
				title: "Sekiro: Shadows Die Twice",
				cover: "https://readdy.ai/api/search-image?query=japanese%20samurai%20ninja%20dark%20dramatic%20cinematic%20game%20art%20dark%20tones&width=280&height=380&seq=pw-sek&orientation=portrait",
				year: 2019,
				genre: "Acción",
				category: "games",
				rating: 9.2,
				role: "Desarrollador"
			},
			{
				id: "ds3",
				title: "Dark Souls III",
				cover: "https://readdy.ai/api/search-image?query=dark%20souls%20knight%20fire%20dramatic%20dark%20fantasy%20cinematic%20game%20art%20dark%20tones&width=280&height=380&seq=pw-ds3&orientation=portrait",
				year: 2016,
				genre: "RPG",
				category: "games",
				rating: 9,
				role: "Desarrollador"
			},
			{
				id: "bloodborne",
				title: "Bloodborne",
				cover: "https://readdy.ai/api/search-image?query=gothic%20horror%20victorian%20dark%20dramatic%20cinematic%20game%20art%20dark%20tones&width=280&height=380&seq=pw-bb2&orientation=portrait",
				year: 2015,
				genre: "RPG",
				category: "games",
				rating: 9.3,
				role: "Desarrollador"
			}
		]
	},
	"larian-studios": {
		id: "larian-studios",
		name: "Larian Studios",
		photo: "https://readdy.ai/api/search-image?query=professional%20game%20studio%20logo%20fantasy%20RPG%20dark%20minimalist%20design%20clean%20background%20neutral%20tones&width=400&height=400&seq=person-ls-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=fantasy%20RPG%20game%20development%20studio%20cinematic%20dramatic%20lighting%20wide%20panoramic&width=1400&height=500&seq=person-ls-back&orientation=landscape",
		role: "Desarrollador",
		nationality: "Belga",
		birthYear: 1996,
		bio: "Larian Studios es un estudio de desarrollo de videojuegos belga fundado en 1996 por Swen Vincke. Son conocidos por su saga Divinity: Original Sin, que revitalizó el género de los RPG por turnos. Su obra cumbre, Baldur's Gate 3, ganó el GOTY en los Game Awards 2023 y fue aclamada como uno de los mejores juegos de rol de todos los tiempos, con una libertad narrativa y de elección sin precedentes.",
		known_for: [
			"Baldur's Gate 3",
			"Divinity: Original Sin 2",
			"Divinity: Original Sin"
		],
		works: [{
			id: "g2",
			title: "Baldur's Gate 3",
			cover: "https://readdy.ai/api/search-image?query=fantasy%20RPG%20dark%20dungeon%20magic%20spell%20dramatic%20lighting%20epic%20game%20art%20dark%20purple%20tones%20cinematic&width=280&height=380&seq=pw-bg3-ls&orientation=portrait",
			year: 2023,
			genre: "RPG",
			category: "games",
			rating: 9.6,
			role: "Desarrollador"
		}, {
			id: "dos2",
			title: "Divinity: Original Sin 2",
			cover: "https://readdy.ai/api/search-image?query=fantasy%20RPG%20magic%20battle%20dramatic%20cinematic%20game%20art%20dark%20tones&width=280&height=380&seq=pw-dos2&orientation=portrait",
			year: 2017,
			genre: "RPG",
			category: "games",
			rating: 9.4,
			role: "Desarrollador"
		}]
	},
	"santa-monica-studio": {
		id: "santa-monica-studio",
		name: "Santa Monica Studio",
		photo: "https://readdy.ai/api/search-image?query=professional%20game%20studio%20logo%20action%20adventure%20dark%20minimalist%20design%20clean%20background%20neutral%20tones&width=400&height=400&seq=person-sms-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=Norse%20mythology%20game%20development%20studio%20cinematic%20dramatic%20lighting%20wide%20panoramic%20cold%20tones&width=1400&height=500&seq=person-sms-back&orientation=landscape",
		role: "Desarrollador",
		nationality: "Americano",
		birthYear: 1999,
		bio: "Santa Monica Studio es un estudio de desarrollo de videojuegos americano propiedad de Sony Interactive Entertainment, fundado en 1999. Son los creadores de la saga God of War, una de las franquicias más exitosas y aclamadas de PlayStation. El reinicio de la saga en 2018 y su secuela Ragnarök en 2022 son considerados dos de los mejores juegos de la historia, combinando acción espectacular con una narrativa emocionalmente poderosa.",
		known_for: [
			"God of War",
			"God of War Ragnarök",
			"God of War (2018)"
		],
		works: [{
			id: "g3",
			title: "God of War Ragnarök",
			cover: "https://readdy.ai/api/search-image?query=Norse%20mythology%20warrior%20axe%20snow%20dramatic%20sky%20epic%20cinematic%20game%20art%20cold%20tones&width=280&height=380&seq=pw-gow-sms&orientation=portrait",
			year: 2022,
			genre: "Acción",
			category: "games",
			rating: 9.3,
			role: "Desarrollador"
		}, {
			id: "gow2018",
			title: "God of War (2018)",
			cover: "https://readdy.ai/api/search-image?query=Norse%20mythology%20warrior%20father%20son%20dramatic%20sky%20epic%20cinematic%20game%20art%20cold%20tones&width=280&height=380&seq=pw-gow18&orientation=portrait",
			year: 2018,
			genre: "Acción",
			category: "games",
			rating: 9.5,
			role: "Desarrollador"
		}]
	},
	"cd-projekt-red": {
		id: "cd-projekt-red",
		name: "CD Projekt Red",
		photo: "https://readdy.ai/api/search-image?query=professional%20game%20studio%20logo%20cyberpunk%20RPG%20dark%20minimalist%20design%20clean%20background%20neutral%20tones&width=400&height=400&seq=person-cdpr-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=cyberpunk%20neon%20city%20night%20futuristic%20game%20development%20studio%20cinematic%20dramatic%20lighting%20wide%20panoramic&width=1400&height=500&seq=person-cdpr-back&orientation=landscape",
		role: "Desarrollador",
		nationality: "Polaco",
		birthYear: 1994,
		bio: "CD Projekt Red es un estudio de desarrollo de videojuegos polaco fundado en 1994, conocido por crear la saga The Witcher y Cyberpunk 2077. Son reconocidos por sus RPGs de mundo abierto con narrativas profundas y personajes memorables. A pesar del polémico lanzamiento de Cyberpunk 2077 en 2020, las actualizaciones posteriores y la expansión Phantom Liberty lo convirtieron en una experiencia excepcional.",
		known_for: [
			"Cyberpunk 2077",
			"The Witcher 3",
			"The Witcher 2"
		],
		works: [{
			id: "g4",
			title: "Cyberpunk 2077",
			cover: "https://readdy.ai/api/search-image?query=cyberpunk%20neon%20city%20night%20futuristic%20urban%20rain%20dramatic%20lighting%20yellow%20tones%20cinematic&width=280&height=380&seq=pw-cp-cdpr&orientation=portrait",
			year: 2020,
			genre: "RPG",
			category: "games",
			rating: 8.7,
			role: "Desarrollador"
		}, {
			id: "witcher3",
			title: "The Witcher 3: Wild Hunt",
			cover: "https://readdy.ai/api/search-image?query=fantasy%20RPG%20witcher%20monster%20hunter%20dramatic%20cinematic%20game%20art%20dark%20tones&width=280&height=380&seq=pw-w3&orientation=portrait",
			year: 2015,
			genre: "RPG",
			category: "games",
			rating: 9.7,
			role: "Desarrollador"
		}]
	},
	"team-cherry": {
		id: "team-cherry",
		name: "Team Cherry",
		photo: "https://readdy.ai/api/search-image?query=professional%20indie%20game%20studio%20logo%20dark%20minimalist%20design%20clean%20background%20neutral%20tones&width=400&height=400&seq=person-tc2-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=dark%20fantasy%20underground%20cave%20glowing%20mushrooms%20atmospheric%20game%20development%20studio%20wide%20panoramic%20blue%20tones&width=1400&height=500&seq=person-tc2-back&orientation=landscape",
		role: "Desarrollador",
		nationality: "Australiano",
		birthYear: 2014,
		bio: "Team Cherry es un pequeño estudio indie australiano formado por solo tres personas: Ari Gibson, William Pellen y Jack Vine. Son los creadores de Hollow Knight, uno de los juegos indie más aclamados de la historia. Con un presupuesto mínimo y un equipo diminuto, crearon un mundo enorme, hermoso y profundo que ha vendido más de 5 millones de copias. Su secuela, Hollow Knight: Silksong, es uno de los juegos más esperados de la industria.",
		known_for: ["Hollow Knight", "Hollow Knight: Silksong"],
		works: [{
			id: "g5",
			title: "Hollow Knight",
			cover: "https://readdy.ai/api/search-image?query=dark%20fantasy%20insect%20knight%20underground%20cave%20glowing%20mushrooms%20atmospheric%20game%20art%20blue%20tones&width=280&height=380&seq=pw-hk-tc&orientation=portrait",
			year: 2017,
			genre: "Metroidvania",
			category: "games",
			rating: 9.1,
			role: "Desarrollador"
		}]
	},
	"rockstar-games": {
		id: "rockstar-games",
		name: "Rockstar Games",
		photo: "https://readdy.ai/api/search-image?query=professional%20game%20studio%20logo%20action%20open%20world%20dark%20minimalist%20design%20clean%20background%20neutral%20tones&width=400&height=400&seq=person-rg-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=wild%20west%20sunset%20dramatic%20landscape%20game%20development%20studio%20wide%20panoramic%20warm%20golden%20tones&width=1400&height=500&seq=person-rg-back&orientation=landscape",
		role: "Desarrollador",
		nationality: "Americano",
		birthYear: 1998,
		bio: "Rockstar Games es uno de los estudios de videojuegos más influyentes y exitosos del mundo. Fundado en 1998, son los creadores de las sagas Grand Theft Auto y Red Dead Redemption. Sus juegos de mundo abierto son conocidos por su nivel de detalle sin precedentes, sus narrativas cinematográficas y su capacidad para crear mundos vivos e inmersivos. GTA V es uno de los juegos más vendidos de todos los tiempos con más de 185 millones de copias.",
		known_for: [
			"Red Dead Redemption 2",
			"GTA V",
			"GTA VI"
		],
		works: [{
			id: "g6",
			title: "Red Dead Redemption 2",
			cover: "https://readdy.ai/api/search-image?query=wild%20west%20cowboy%20sunset%20dramatic%20landscape%20horse%20cinematic%20warm%20tones%20epic%20game%20art&width=280&height=380&seq=pw-rdr-rg&orientation=portrait",
			year: 2018,
			genre: "Aventura",
			category: "games",
			rating: 9.5,
			role: "Desarrollador"
		}, {
			id: "gta5",
			title: "Grand Theft Auto V",
			cover: "https://readdy.ai/api/search-image?query=los%20angeles%20city%20crime%20action%20dramatic%20cinematic%20game%20art%20warm%20tones&width=280&height=380&seq=pw-gta5&orientation=portrait",
			year: 2013,
			genre: "Acción",
			category: "games",
			rating: 9.2,
			role: "Desarrollador"
		}]
	},
	"bandai-namco": {
		id: "bandai-namco",
		name: "Bandai Namco",
		photo: "https://readdy.ai/api/search-image?query=professional%20game%20publisher%20logo%20dark%20minimalist%20design%20clean%20background%20neutral%20tones&width=400&height=400&seq=person-bn-photo&orientation=squarish",
		backdrop: "https://readdy.ai/api/search-image?query=dark%20fantasy%20game%20publisher%20cinematic%20dramatic%20lighting%20wide%20panoramic&width=1400&height=500&seq=person-bn-back&orientation=landscape",
		role: "Publisher",
		nationality: "Japonés",
		birthYear: 2006,
		bio: "Bandai Namco Entertainment es una de las compañías de entretenimiento más grandes de Japón, resultado de la fusión entre Namco y Bandai en 2006. Como publisher, han distribuido algunos de los juegos más importantes de la historia, incluyendo la saga Dark Souls y Elden Ring de FromSoftware. También son conocidos por sus propias franquicias como Tekken, Pac-Man y Tales of.",
		known_for: [
			"Elden Ring",
			"Dark Souls",
			"Tekken",
			"Pac-Man"
		],
		works: [{
			id: "g1",
			title: "Elden Ring",
			cover: "https://readdy.ai/api/search-image?query=Elden%20Ring%20fantasy%20dark%20souls%20epic%20landscape%20golden%20tree%20dramatic%20sky%20cinematic%20game%20art%20dark%20moody&width=280&height=380&seq=pw-er-bn&orientation=portrait",
			year: 2022,
			genre: "RPG",
			category: "games",
			rating: 9.4,
			role: "Publisher"
		}, {
			id: "tekken8",
			title: "Tekken 8",
			cover: "https://readdy.ai/api/search-image?query=fighting%20game%20martial%20arts%20dramatic%20cinematic%20game%20art%20dark%20tones&width=280&height=380&seq=pw-tek8&orientation=portrait",
			year: 2024,
			genre: "Lucha",
			category: "games",
			rating: 8.8,
			role: "Desarrollador / Publisher"
		}]
	}
};
//#endregion
export { PEOPLE_MOCK as t };

//# sourceMappingURL=people-vbkXE967.js.map