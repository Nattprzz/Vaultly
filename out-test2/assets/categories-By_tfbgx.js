//#region src/lib/categories.ts
var API_CATEGORY_BY_APP = {
	videojuegos: "games",
	peliculas: "movies",
	series: "series",
	libros: "books",
	conciertos: "concerts"
};
var APP_CATEGORY_BY_API = {
	games: "videojuegos",
	movies: "peliculas",
	series: "series",
	books: "libros",
	concerts: "conciertos"
};
var SCHEMA_TYPE_BY_APP_CATEGORY = {
	videojuegos: "VideoGame",
	peliculas: "Movie",
	series: "TVSeries",
	libros: "Book",
	conciertos: "MusicEvent"
};
function isAppCategory(value) {
	return value === "videojuegos" || value === "peliculas" || value === "series" || value === "libros" || value === "conciertos";
}
function toApiCategory(value) {
	if (!value) return void 0;
	if (isAppCategory(value)) return API_CATEGORY_BY_APP[value];
	if (value in APP_CATEGORY_BY_API) return value;
}
function toAppCategory(value) {
	if (!value) return void 0;
	if (isAppCategory(value)) return value;
	if (value in APP_CATEGORY_BY_API) return APP_CATEGORY_BY_API[value];
}
//#endregion
export { toAppCategory as i, isAppCategory as n, toApiCategory as r, SCHEMA_TYPE_BY_APP_CATEGORY as t };

//# sourceMappingURL=categories-By_tfbgx.js.map