import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { c as useAuth, f as useNavigate, h as require_react, l as supabase, p as useParams, s as require_jsx_runtime, t as useCategories, u as Link } from "./index-cosAM6zi.js";
import { n as getSiteUrl, t as SeoHead } from "./SeoHead-SAtaEFdZ.js";
import { t as edgeFunctionUrl } from "./edgeFunctions-CBeptRpx.js";
import { n as useSettings } from "./useSettings-CZ1Tg8p7.js";
import { t as Navbar } from "./Navbar-XnbO_Z_a.js";
import { n as isAppCategory, r as toApiCategory } from "./categories-By_tfbgx.js";
//#region src/hooks/useCatalogSearch.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var EDGE_FN_URL = edgeFunctionUrl("catalog-search");
var PAGE_SIZE = 20;
var memoryCache = /* @__PURE__ */ new Map();
function useCatalogSearch() {
	const [results, setResults] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [loadingMore, setLoadingMore] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [source, setSource] = (0, import_react.useState)(null);
	const [page, setPage] = (0, import_react.useState)(1);
	const [hasMore, setHasMore] = (0, import_react.useState)(false);
	const currentQueryRef = (0, import_react.useRef)(null);
	const abortRef = (0, import_react.useRef)(null);
	const fetchPage = (0, import_react.useCallback)(async (category, query, pageNum, append) => {
		const cacheKey = `${category}:${query.toLowerCase()}:${pageNum}`;
		if (memoryCache.has(cacheKey)) {
			const cached = memoryCache.get(cacheKey);
			if (append) setResults((prev) => {
				const existingSlugs = new Set(prev.map((i) => i.slug));
				const newItems = cached.data.filter((i) => !existingSlugs.has(i.slug));
				return [...prev, ...newItems];
			});
			else {
				setResults(cached.data);
				setSource(cached.source);
			}
			setHasMore(cached.data.length >= PAGE_SIZE);
			setPage(pageNum);
			return;
		}
		if (!append) {
			abortRef.current?.abort();
			abortRef.current = new AbortController();
		}
		if (append) setLoadingMore(true);
		else setLoading(true);
		setError(null);
		try {
			const params = new URLSearchParams({
				category,
				query: query.trim(),
				page: String(pageNum)
			});
			const res = await fetch(`${EDGE_FN_URL}?${params}`, { signal: append ? void 0 : abortRef.current?.signal });
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.error ?? `HTTP ${res.status}`);
			}
			const json = await res.json();
			const pageResult = {
				data: json.data ?? [],
				source: json.source
			};
			memoryCache.set(cacheKey, pageResult);
			if (append) setResults((prev) => {
				const existingSlugs = new Set(prev.map((i) => i.slug));
				const newItems = pageResult.data.filter((i) => !existingSlugs.has(i.slug));
				return [...prev, ...newItems];
			});
			else {
				setResults(pageResult.data);
				setSource(pageResult.source);
			}
			setHasMore(pageResult.data.length >= PAGE_SIZE);
			setPage(pageNum);
		} catch (err) {
			if (err.name === "AbortError") return;
			setError(err.message);
			if (!append) setResults([]);
		} finally {
			if (append) setLoadingMore(false);
			else setLoading(false);
		}
	}, []);
	return {
		results,
		loading,
		loadingMore,
		error,
		source,
		page,
		hasMore,
		search: (0, import_react.useCallback)((category, query) => {
			if (!category || !query.trim()) return;
			currentQueryRef.current = {
				category,
				query: query.trim()
			};
			fetchPage(category, query.trim(), 1, false);
		}, [fetchPage]),
		loadMore: (0, import_react.useCallback)(() => {
			const ctx = currentQueryRef.current;
			if (!ctx || loadingMore || !hasMore) return;
			fetchPage(ctx.category, ctx.query, page + 1, true);
		}, [
			fetchPage,
			page,
			loadingMore,
			hasMore
		]),
		clear: (0, import_react.useCallback)(() => {
			abortRef.current?.abort();
			currentQueryRef.current = null;
			setResults([]);
			setError(null);
			setSource(null);
			setLoading(false);
			setLoadingMore(false);
			setPage(1);
			setHasMore(false);
		}, [])
	};
}
var DEFAULT_FILTERS = {
	yearMin: 1970,
	yearMax: (/* @__PURE__ */ new Date()).getFullYear(),
	minRating: 0,
	genres: [],
	platforms: [],
	languages: [],
	cities: [],
	duration: "all",
	pageCount: "all",
	seriesStatus: "all",
	sort: "relevance"
};
function getItemYear(item) {
	return parseInt(item.release_date?.slice(0, 4) ?? "0", 10);
}
function getItemRating(item) {
	return Number(item.metadata?.rating ?? 0);
}
function getItemGenres(item) {
	const g = item.metadata?.genres ?? item.metadata?.genre;
	if (Array.isArray(g)) return g.map(String);
	if (g) return [String(g)];
	return [];
}
function toStringArray(value) {
	if (Array.isArray(value)) return value.map(String).filter(Boolean);
	if (value) return [String(value)];
	return [];
}
function getNumber(value) {
	const n = Number(value);
	return Number.isFinite(n) && n > 0 ? n : null;
}
function matchesRange(value, range, bounds) {
	if (range === "all") return true;
	if (value == null) return true;
	const [min, max] = bounds[range];
	return value >= min && value <= max;
}
/** Extract all unique genres from a list of items */
function extractGenres(items) {
	const set = /* @__PURE__ */ new Set();
	items.forEach((item) => getItemGenres(item).forEach((g) => {
		if (g) set.add(g);
	}));
	return Array.from(set).sort();
}
/** Apply filters + sort to a list of items */
function applyFilters(items, filters) {
	let out = items.filter((item) => {
		const year = getItemYear(item);
		const rating = getItemRating(item);
		const genres = getItemGenres(item);
		if (year > 0 && (year < filters.yearMin || year > filters.yearMax)) return false;
		if (filters.minRating > 0 && rating < filters.minRating) return false;
		if (filters.genres.length > 0) {
			if (!filters.genres.some((fg) => genres.some((g) => g.toLowerCase().includes(fg.toLowerCase())))) return false;
		}
		if (filters.platforms.length > 0) {
			const platforms = toStringArray(item.metadata?.platforms);
			if (platforms.length > 0 && !filters.platforms.some((fp) => platforms.some((p) => p.toLowerCase().includes(fp.toLowerCase())))) return false;
		}
		if (filters.languages.length > 0) {
			const language = String(item.metadata?.language ?? item.metadata?.original_language ?? "");
			if (language && !filters.languages.includes(language)) return false;
		}
		if (filters.cities.length > 0) {
			const city = String(item.metadata?.city ?? "");
			if (city && !filters.cities.includes(city)) return false;
		}
		if (!matchesRange(getNumber(item.metadata?.runtime), filters.duration, {
			short: [1, 89],
			medium: [90, 139],
			long: [140, 999]
		})) return false;
		if (!matchesRange(getNumber(item.metadata?.page_count), filters.pageCount, {
			short: [1, 249],
			medium: [250, 499],
			long: [500, 9999]
		})) return false;
		if (filters.seriesStatus !== "all") {
			const status = String(item.metadata?.status ?? "");
			if (status && status !== filters.seriesStatus) return false;
		}
		return true;
	});
	switch (filters.sort) {
		case "rating_desc":
			out = [...out].sort((a, b) => getItemRating(b) - getItemRating(a));
			break;
		case "rating_asc":
			out = [...out].sort((a, b) => getItemRating(a) - getItemRating(b));
			break;
		case "year_desc":
			out = [...out].sort((a, b) => getItemYear(b) - getItemYear(a));
			break;
		case "year_asc":
			out = [...out].sort((a, b) => getItemYear(a) - getItemYear(b));
			break;
		case "title_asc":
			out = [...out].sort((a, b) => a.title.localeCompare(b.title));
			break;
		default: break;
	}
	return out;
}
/** Count how many filters are active (differ from defaults) */
function countActiveFilters(filters) {
	let count = 0;
	if (filters.yearMin !== DEFAULT_FILTERS.yearMin) count++;
	if (filters.yearMax !== DEFAULT_FILTERS.yearMax) count++;
	if (filters.minRating > 0) count++;
	if (filters.genres.length > 0) count++;
	if (filters.platforms.length > 0) count++;
	if (filters.languages.length > 0) count++;
	if (filters.cities.length > 0) count++;
	if (filters.duration !== "all") count++;
	if (filters.pageCount !== "all") count++;
	if (filters.seriesStatus !== "all") count++;
	if (filters.sort !== "relevance") count++;
	return count;
}
function useCatalogFilters() {
	const [filters, setFilters] = (0, import_react.useState)(DEFAULT_FILTERS);
	const setYearMin = (0, import_react.useCallback)((v) => setFilters((f) => ({
		...f,
		yearMin: v
	})), []);
	const setYearMax = (0, import_react.useCallback)((v) => setFilters((f) => ({
		...f,
		yearMax: v
	})), []);
	const setMinRating = (0, import_react.useCallback)((v) => setFilters((f) => ({
		...f,
		minRating: v
	})), []);
	const setSort = (0, import_react.useCallback)((v) => setFilters((f) => ({
		...f,
		sort: v
	})), []);
	const setDuration = (0, import_react.useCallback)((v) => setFilters((f) => ({
		...f,
		duration: v
	})), []);
	const setPageCount = (0, import_react.useCallback)((v) => setFilters((f) => ({
		...f,
		pageCount: v
	})), []);
	const setSeriesStatus = (0, import_react.useCallback)((v) => setFilters((f) => ({
		...f,
		seriesStatus: v
	})), []);
	const toggleGenre = (0, import_react.useCallback)((genre) => {
		setFilters((f) => ({
			...f,
			genres: f.genres.includes(genre) ? f.genres.filter((g) => g !== genre) : [...f.genres, genre]
		}));
	}, []);
	const togglePlatform = (0, import_react.useCallback)((platform) => {
		setFilters((f) => ({
			...f,
			platforms: f.platforms.includes(platform) ? f.platforms.filter((item) => item !== platform) : [...f.platforms, platform]
		}));
	}, []);
	const toggleLanguage = (0, import_react.useCallback)((language) => {
		setFilters((f) => ({
			...f,
			languages: f.languages.includes(language) ? f.languages.filter((item) => item !== language) : [...f.languages, language]
		}));
	}, []);
	const toggleCity = (0, import_react.useCallback)((city) => {
		setFilters((f) => ({
			...f,
			cities: f.cities.includes(city) ? f.cities.filter((item) => item !== city) : [...f.cities, city]
		}));
	}, []);
	const reset = (0, import_react.useCallback)(() => setFilters(DEFAULT_FILTERS), []);
	return {
		filters,
		activeCount: (0, import_react.useMemo)(() => countActiveFilters(filters), [filters]),
		setYearMin,
		setYearMax,
		setMinRating,
		setSort,
		setDuration,
		setPageCount,
		setSeriesStatus,
		toggleGenre,
		togglePlatform,
		toggleLanguage,
		toggleCity,
		reset
	};
}
//#endregion
//#region src/pages/catalog/components/CatalogFilters.tsx
var import_jsx_runtime = require_jsx_runtime();
var CURRENT_YEAR = (/* @__PURE__ */ new Date()).getFullYear();
var SORT_OPTIONS = [
	{
		value: "relevance",
		label: "Relevancia"
	},
	{
		value: "rating_desc",
		label: "Mejor valorados"
	},
	{
		value: "rating_asc",
		label: "Peor valorados"
	},
	{
		value: "year_desc",
		label: "Más recientes"
	},
	{
		value: "year_asc",
		label: "Más antiguos"
	},
	{
		value: "title_asc",
		label: "A-Z"
	}
];
var RATING_OPTIONS = [
	0,
	6,
	7,
	8,
	9
];
var YEAR_PRESETS = [
	{
		label: "Todo",
		min: DEFAULT_FILTERS.yearMin,
		max: DEFAULT_FILTERS.yearMax
	},
	{
		label: "2020s",
		min: 2020,
		max: CURRENT_YEAR
	},
	{
		label: "2010s",
		min: 2010,
		max: 2019
	},
	{
		label: "2000s",
		min: 2e3,
		max: 2009
	},
	{
		label: "Clásicos",
		min: 1970,
		max: 1999
	}
];
var DURATION_OPTIONS = [
	{
		value: "all",
		label: "Todas"
	},
	{
		value: "short",
		label: "< 90 min"
	},
	{
		value: "medium",
		label: "90-139 min"
	},
	{
		value: "long",
		label: "140+ min"
	}
];
var PAGE_OPTIONS = [
	{
		value: "all",
		label: "Todas"
	},
	{
		value: "short",
		label: "< 250"
	},
	{
		value: "medium",
		label: "250-499"
	},
	{
		value: "long",
		label: "500+"
	}
];
function CatalogFilters({ filters, availableGenres, availablePlatforms, availableLanguages, availableCities, availableSeriesStatuses, activeCategory, activeCount, onYearMin, onYearMax, onMinRating, onSort, onDuration, onPageCount, onSeriesStatus, onToggleGenre, onTogglePlatform, onToggleLanguage, onToggleCity, onReset, onClose }) {
	const panelRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const handlePointerDown = (event) => {
			if (panelRef.current && !panelRef.current.contains(event.target)) onClose();
		};
		document.addEventListener("mousedown", handlePointerDown);
		return () => document.removeEventListener("mousedown", handlePointerDown);
	}, [onClose]);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (event) => {
			if (event.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);
	const activeYearPreset = YEAR_PRESETS.find((preset) => filters.yearMin === preset.min && filters.yearMax === preset.max)?.label ?? "custom";
	const setYearPreset = (label) => {
		const preset = YEAR_PRESETS.find((item) => item.label === label);
		if (!preset) return;
		onYearMin(preset.min);
		onYearMax(preset.max);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: panelRef,
		className: "absolute right-0 top-full z-40 mt-2 w-[min(92vw,980px)] overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-xl shadow-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold text-zinc-900 dark:text-white",
					children: "Filtros"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-zinc-400",
					children: activeCount > 0 ? `${activeCount} activos` : "Sin filtros activos"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [activeCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onReset,
						className: "text-xs font-medium text-zinc-400 hover:text-rose-500",
						children: "Limpiar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-line" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid max-h-[68vh] grid-cols-1 gap-4 overflow-y-auto p-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSection, {
							label: "Orden",
							value: filters.sort,
							onChange: (value) => onSort(value),
							options: SORT_OPTIONS
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold uppercase tracking-wide text-zinc-400",
								children: "Puntuación"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-5 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800",
								children: RATING_OPTIONS.map((rating) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => onMinRating(rating),
									className: `rounded-md px-2 py-1.5 text-xs font-semibold transition-colors ${filters.minRating === rating ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white" : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"}`,
									children: rating === 0 ? "Todo" : `${rating}+`
								}, rating))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSection, {
							label: "Año",
							value: activeYearPreset,
							onChange: setYearPreset,
							options: [...YEAR_PRESETS.map((preset) => ({
								value: preset.label,
								label: preset.label
							})), {
								value: "custom",
								label: `${filters.yearMin}-${filters.yearMax}`,
								disabled: true
							}]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeRow, {
								label: "Desde",
								value: filters.yearMin,
								min: 1970,
								max: CURRENT_YEAR,
								onChange: (value) => onYearMin(Math.min(value, filters.yearMax - 1))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeRow, {
								label: "Hasta",
								value: filters.yearMax,
								min: 1970,
								max: CURRENT_YEAR,
								onChange: (value) => onYearMax(Math.max(value, filters.yearMin + 1))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChecklistSection, {
						label: "Géneros",
						values: availableGenres,
						selected: filters.genres,
						onToggle: onToggleGenre
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							activeCategory === "videojuegos" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChecklistSection, {
								label: "Plataformas",
								values: availablePlatforms,
								selected: filters.platforms,
								onToggle: onTogglePlatform
							}),
							activeCategory === "peliculas" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSection, {
								label: "Duración",
								value: filters.duration,
								onChange: (value) => onDuration(value),
								options: DURATION_OPTIONS
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChecklistSection, {
								label: "Idioma original",
								values: availableLanguages,
								selected: filters.languages,
								onToggle: onToggleLanguage
							})] }),
							activeCategory === "series" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSection, {
								label: "Estado",
								value: filters.seriesStatus,
								onChange: onSeriesStatus,
								options: [{
									value: "all",
									label: "Todos"
								}, ...availableSeriesStatuses.map((status) => ({
									value: status,
									label: status
								}))]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChecklistSection, {
								label: "Idioma original",
								values: availableLanguages,
								selected: filters.languages,
								onToggle: onToggleLanguage
							})] }),
							activeCategory === "libros" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSection, {
								label: "Páginas",
								value: filters.pageCount,
								onChange: (value) => onPageCount(value),
								options: PAGE_OPTIONS
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChecklistSection, {
								label: "Idioma",
								values: availableLanguages,
								selected: filters.languages,
								onToggle: onToggleLanguage
							})] }),
							activeCategory === "conciertos" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChecklistSection, {
								label: "Ciudad",
								values: availableCities,
								selected: filters.cities,
								onToggle: onToggleCity
							}),
							activeCategory === "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "rounded-lg bg-zinc-50 px-3 py-2 text-xs text-zinc-500 dark:bg-zinc-800/70 dark:text-zinc-400",
								children: "Elige una categoría para ver filtros específicos como plataforma, duración, idioma o ciudad."
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-2 border-t border-zinc-100 p-3 dark:border-zinc-800",
				children: [activeCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onReset,
					className: "rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800",
					children: "Limpiar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "rounded-lg bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900",
					children: "Aplicar"
				})]
			})
		]
	});
}
function SelectSection({ label, value, options, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "text-xs font-semibold uppercase tracking-wide text-zinc-400",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			value,
			onChange: (event) => onChange(event.target.value),
			className: "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
			children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: option.value,
				disabled: option.disabled,
				children: option.label
			}, option.value))
		})]
	});
}
function RangeRow({ label, value, min, max, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-10 text-xs text-zinc-400",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "range",
				min,
				max,
				value,
				onChange: (event) => onChange(Number(event.target.value)),
				className: "h-1.5 flex-1 accent-zinc-900 dark:accent-white"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-9 text-right text-xs font-semibold text-zinc-500",
				children: value
			})
		]
	});
}
function ChecklistSection({ label, values, selected, onToggle }) {
	if (values.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "text-xs font-semibold uppercase tracking-wide text-zinc-400",
				children: label
			}), selected.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => selected.forEach((item) => onToggle(item)),
				className: "text-xs font-medium text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200",
				children: "Quitar"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-h-40 space-y-1 overflow-y-auto pr-1",
			children: values.map((value) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: selected.includes(value),
						onChange: () => onToggle(value),
						className: "h-4 w-4 rounded border-zinc-300 accent-zinc-900 dark:border-zinc-600 dark:accent-white"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: value
					})]
				}, value);
			})
		})]
	});
}
//#endregion
//#region src/pages/catalog/page.tsx
var siteUrl = getSiteUrl();
var CATALOG_JSONLD = {
	"@context": "https://schema.org",
	"@type": "CollectionPage",
	name: "Catálogo - Vaultly",
	description: "Explora el catálogo completo de Vaultly: videojuegos, películas, series, libros, anime y más.",
	url: `${siteUrl}/catalog`,
	isPartOf: {
		"@type": "WebSite",
		name: "Vaultly",
		url: siteUrl
	}
};
function getRating(item) {
	if (item.metadata?.rating != null) return Number(item.metadata.rating);
	return null;
}
function getYear(item) {
	return item.release_date?.slice(0, 4) ?? "";
}
function getGenre(item) {
	const g = item.metadata?.genre ?? item.metadata?.genres;
	if (Array.isArray(g)) return g[0] ?? "";
	return String(g ?? "");
}
function extractStringOptions(items, keys) {
	const keyList = Array.isArray(keys) ? keys : [keys];
	const values = /* @__PURE__ */ new Set();
	items.forEach((item) => {
		keyList.forEach((key) => {
			const value = item.metadata?.[key];
			if (Array.isArray(value)) value.map(String).filter(Boolean).forEach((v) => values.add(v));
			else if (value) values.add(String(value));
		});
	});
	return Array.from(values).sort((a, b) => a.localeCompare(b, "es"));
}
var SOURCE_CONFIG = {
	cache: {
		label: "Desde caché",
		icon: "ri-database-2-line",
		cls: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
	},
	external_cached: {
		label: "Guardado en caché",
		icon: "ri-save-line",
		cls: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400"
	},
	external: {
		label: "API externa",
		icon: "ri-global-line",
		cls: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
	}
};
var SORT_LABELS = {
	relevance: "Relevancia",
	rating_desc: "Mejor valorados",
	rating_asc: "Peor valorados",
	year_desc: "Más recientes",
	year_asc: "Más antiguos",
	title_asc: "A → Z"
};
var DURATION_CHIP_LABELS = {
	short: "< 90 min",
	medium: "90-139 min",
	long: "140+ min"
};
var PAGE_CHIP_LABELS = {
	short: "< 250 páginas",
	medium: "250-499 páginas",
	long: "500+ páginas"
};
var ALL_CATEGORY = {
	id: "all",
	label: "Todo",
	icon: "ri-apps-2-line",
	accent: "#52525b"
};
var isValidCategory = (category) => isAppCategory(category);
function ItemCard({ item, categoryId, catIcon }) {
	const rating = getRating(item);
	const year = getYear(item);
	const genre = getGenre(item);
	const targetCategory = categoryId === "all" ? String(item.category ?? "") : categoryId;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: targetCategory ? `/catalog/${targetCategory}/${item.slug || item.id}` : "/catalog",
		className: "group cursor-pointer",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative rounded-xl overflow-hidden mb-3 aspect-[2/3] bg-zinc-100 dark:bg-zinc-800",
				children: [item.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: item.image_url,
					alt: item.title,
					title: `${item.title}${genre ? ` — ${genre}` : ""}`,
					className: "w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105",
					loading: "lazy"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full h-full flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${catIcon ?? "ri-image-line"} text-3xl text-zinc-300 dark:text-zinc-600` })
				}), rating != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-xs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-white text-xs font-semibold",
						children: Number(rating).toFixed(1)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold text-zinc-900 dark:text-white leading-tight mb-1 line-clamp-2",
				children: item.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-zinc-500 flex-shrink-0",
					children: year
				}), genre && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-zinc-400 truncate",
					children: genre
				})]
			})
		]
	});
}
function SkeletonGrid({ count = 12 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5",
		children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "animate-pulse",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "rounded-xl bg-zinc-100 dark:bg-zinc-800 aspect-[2/3] mb-3" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 bg-zinc-100 dark:bg-zinc-800 rounded mb-2" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-2/3" })
			]
		}, i))
	});
}
function CatalogPage() {
	const navigate = useNavigate();
	const { category: routeCategory } = useParams();
	const { isLoggedIn } = useAuth();
	const { settings } = useSettings();
	const CATEGORIES = useCategories();
	const [activeCategory, setActiveCategory] = (0, import_react.useState)(isValidCategory(routeCategory) ? routeCategory : "all");
	const [search, setSearch] = (0, import_react.useState)("");
	const [debouncedSearch, setDebouncedSearch] = (0, import_react.useState)("");
	const [filtersOpen, setFiltersOpen] = (0, import_react.useState)(false);
	const [cachedItems, setCachedItems] = (0, import_react.useState)([]);
	const [cachedLoading, setCachedLoading] = (0, import_react.useState)(false);
	const filterBtnRef = (0, import_react.useRef)(null);
	const debounceRef = (0, import_react.useRef)(null);
	const sentinelRef = (0, import_react.useRef)(null);
	const { results, loading, loadingMore, error, source, page, hasMore, search: runSearch, loadMore, clear } = useCatalogSearch();
	const { filters, activeCount, setYearMin, setYearMax, setMinRating, setSort, setDuration, setPageCount, setSeriesStatus, toggleGenre, togglePlatform, toggleLanguage, toggleCity, reset } = useCatalogFilters();
	const enabledCategories = (0, import_react.useMemo)(() => isLoggedIn ? CATEGORIES.filter((category) => settings.activeCategories.includes(category.id)) : CATEGORIES, [isLoggedIn, settings.activeCategories]);
	const enabledCategoryIds = (0, import_react.useMemo)(() => enabledCategories.map((category) => category.id), [enabledCategories]);
	(0, import_react.useEffect)(() => {
		if (!routeCategory) {
			setActiveCategory("all");
			return;
		}
		if (isValidCategory(routeCategory) && (!isLoggedIn || enabledCategoryIds.includes(routeCategory))) {
			setActiveCategory(routeCategory);
			return;
		}
		navigate("/catalog", { replace: true });
	}, [
		enabledCategoryIds,
		isLoggedIn,
		navigate,
		routeCategory
	]);
	(0, import_react.useEffect)(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => setDebouncedSearch(search.trim()), 500);
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [search]);
	(0, import_react.useEffect)(() => {
		const apiCategory = toApiCategory(activeCategory);
		if (debouncedSearch.length >= 2 && apiCategory) runSearch(apiCategory, debouncedSearch);
		else clear();
	}, [
		debouncedSearch,
		activeCategory,
		runSearch,
		clear
	]);
	(0, import_react.useEffect)(() => {
		if (debouncedSearch.length >= 2) return;
		let cancelled = false;
		const loadCachedItems = async () => {
			setCachedLoading(true);
			const categoryIds = activeCategory === "all" ? enabledCategoryIds : [activeCategory];
			let query = supabase.from("catalog_items").select("id, slug, title, description, image_url, release_date, source, source_item_id, metadata, category").order("updated_at", { ascending: false }).limit(60);
			if (categoryIds.length > 0) query = query.in("category", categoryIds);
			const { data } = await query;
			if (!cancelled) {
				setCachedItems(data ?? []);
				setCachedLoading(false);
			}
		};
		loadCachedItems();
		return () => {
			cancelled = true;
		};
	}, [
		activeCategory,
		debouncedSearch.length,
		enabledCategoryIds
	]);
	const handleLoadMore = (0, import_react.useCallback)(() => {
		if (hasMore && !loadingMore && !loading) loadMore();
	}, [
		hasMore,
		loadingMore,
		loading,
		loadMore
	]);
	(0, import_react.useEffect)(() => {
		const el = sentinelRef.current;
		if (!el) return;
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) handleLoadMore();
		}, { rootMargin: "200px" });
		observer.observe(el);
		return () => observer.disconnect();
	}, [handleLoadMore]);
	const cat = activeCategory === "all" ? ALL_CATEGORY : CATEGORIES.find((c) => c.id === activeCategory);
	const isSearching = debouncedSearch.length >= 2;
	const apiCategory = toApiCategory(activeCategory);
	const rawItems = isSearching && apiCategory ? results : cachedItems;
	const availableGenres = (0, import_react.useMemo)(() => extractGenres(rawItems), [rawItems]);
	const availablePlatforms = (0, import_react.useMemo)(() => extractStringOptions(rawItems, "platforms"), [rawItems]);
	const availableLanguages = (0, import_react.useMemo)(() => extractStringOptions(rawItems, ["language", "original_language"]), [rawItems]);
	const availableCities = (0, import_react.useMemo)(() => extractStringOptions(rawItems, "city"), [rawItems]);
	const availableSeriesStatuses = (0, import_react.useMemo)(() => extractStringOptions(rawItems, "status"), [rawItems]);
	const displayItems = (0, import_react.useMemo)(() => applyFilters(rawItems, filters), [rawItems, filters]);
	const filteredOut = rawItems.length - displayItems.length;
	const srcConfig = source ? SOURCE_CONFIG[source] : null;
	const activeChips = [];
	if (filters.sort !== "relevance") activeChips.push({
		key: "sort",
		label: SORT_LABELS[filters.sort],
		onRemove: () => setSort("relevance")
	});
	if (filters.minRating > 0) activeChips.push({
		key: "rating",
		label: `★ ${filters.minRating}+`,
		onRemove: () => setMinRating(0)
	});
	if (filters.yearMin !== DEFAULT_FILTERS.yearMin || filters.yearMax !== DEFAULT_FILTERS.yearMax) activeChips.push({
		key: "year",
		label: `${filters.yearMin} – ${filters.yearMax}`,
		onRemove: () => {
			setYearMin(DEFAULT_FILTERS.yearMin);
			setYearMax(DEFAULT_FILTERS.yearMax);
		}
	});
	filters.genres.forEach((g) => activeChips.push({
		key: `genre-${g}`,
		label: g,
		onRemove: () => toggleGenre(g)
	}));
	filters.platforms.forEach((p) => activeChips.push({
		key: `platform-${p}`,
		label: p,
		onRemove: () => togglePlatform(p)
	}));
	filters.languages.forEach((l) => activeChips.push({
		key: `language-${l}`,
		label: l.toUpperCase(),
		onRemove: () => toggleLanguage(l)
	}));
	filters.cities.forEach((c) => activeChips.push({
		key: `city-${c}`,
		label: c,
		onRemove: () => toggleCity(c)
	}));
	if (filters.duration !== "all") activeChips.push({
		key: "duration",
		label: `Duración ${DURATION_CHIP_LABELS[filters.duration]}`,
		onRemove: () => setDuration("all")
	});
	if (filters.pageCount !== "all") activeChips.push({
		key: "pages",
		label: `Páginas ${PAGE_CHIP_LABELS[filters.pageCount]}`,
		onRemove: () => setPageCount("all")
	});
	if (filters.seriesStatus !== "all") activeChips.push({
		key: "status",
		label: filters.seriesStatus,
		onRemove: () => setSeriesStatus("all")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-white dark:bg-zinc-950",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoHead, {
				title: "Catálogo - Videojuegos, películas, series, libros y anime | Vaultly",
				description: "Explora el catálogo completo de Vaultly. Encuentra y trackea videojuegos, películas, series, libros, anime y mucho más.",
				keywords: "catálogo videojuegos, películas, series, libros, anime, Vaultly",
				canonical: "/catalog",
				jsonLd: CATALOG_JSONLD
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 px-4 md:px-6 py-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-screen-xl mx-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-3xl font-black text-zinc-900 dark:text-white mb-6",
								style: { fontFamily: "'Space Grotesk', sans-serif" },
								children: "Catálogo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2 mb-6",
								children: [ALL_CATEGORY, ...enabledCategories].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										setActiveCategory(c.id);
										setSearch("");
										reset();
										navigate(c.id === "all" ? "/catalog" : `/catalog/${c.id}`);
									},
									className: `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${activeCategory === c.id ? "text-white" : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"}`,
									style: activeCategory === c.id ? { background: c.accent } : {},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: c.icon }), c.label]
								}, c.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex-1 max-w-md",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: search,
											onChange: (e) => setSearch(e.target.value),
											placeholder: `Buscar en ${cat?.label ?? ""}...`,
											className: "w-full pl-9 pr-9 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300/50 dark:focus:ring-zinc-600/50"
										}),
										search && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setSearch(""),
											className: "absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer transition-colors",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-line text-sm" })
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									ref: filterBtnRef,
									className: "relative flex-shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setFiltersOpen((p) => !p),
										className: `flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${activeCount > 0 ? "bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white text-white dark:text-zinc-900" : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-equalizer-2-line" }),
											"Filtros",
											activeCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${activeCount > 0 ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900" : ""}`,
												children: activeCount
											})
										]
									}), filtersOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogFilters, {
										filters,
										availableGenres,
										availablePlatforms,
										availableLanguages,
										availableCities,
										availableSeriesStatuses,
										activeCategory,
										activeCount,
										onYearMin: setYearMin,
										onYearMax: setYearMax,
										onMinRating: setMinRating,
										onSort: setSort,
										onDuration: setDuration,
										onPageCount: setPageCount,
										onSeriesStatus: setSeriesStatus,
										onToggleGenre: toggleGenre,
										onTogglePlatform: togglePlatform,
										onToggleLanguage: toggleLanguage,
										onToggleCity: toggleCity,
										onReset: reset,
										onClose: () => setFiltersOpen(false)
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap items-center gap-2 min-h-[28px]",
								children: [
									isSearching && srcConfig && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${srcConfig.cls}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: srcConfig.icon }), srcConfig.label]
									}),
									!loading && (isSearching || activeCount > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-zinc-400",
										children: [
											displayItems.length,
											" resultado",
											displayItems.length !== 1 ? "s" : "",
											filteredOut > 0 && ` · ${filteredOut} filtrado${filteredOut !== 1 ? "s" : ""}`,
											page > 1 && ` · pág. ${page}`
										]
									}),
									activeChips.map((chip) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium",
										children: [chip.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: chip.onRemove,
											className: "w-4 h-4 flex items-center justify-center rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-line text-[10px]" })
										})]
									}, chip.key)),
									activeChips.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: reset,
										className: "text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer whitespace-nowrap",
										children: "Limpiar todo"
									})
								]
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-screen-xl mx-auto px-4 md:px-6 py-10",
					children: [
						(loading || cachedLoading) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonGrid, { count: 12 }),
						!loading && !cachedLoading && error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center py-20 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-12 flex items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-xl text-rose-500" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-xs",
									children: "No se pudo conectar con la API. Comprueba tu conexión o inténtalo de nuevo."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => apiCategory ? runSearch(apiCategory, debouncedSearch) : clear(),
									className: "mt-1 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-refresh-line mr-1.5" }), "Reintentar"]
								})
							]
						}),
						!loading && !cachedLoading && !error && displayItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5",
							children: displayItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCard, {
								item,
								categoryId: activeCategory,
								catIcon: cat?.icon
							}, item.slug || item.id))
						}), isSearching && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									ref: sentinelRef,
									className: "h-1"
								}),
								loadingMore && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonGrid, { count: 6 })
								}),
								hasMore && !loadingMore && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-3 mt-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: loadMore,
										className: "flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-down-line" }), "Cargar más resultados"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-zinc-400",
										children: [
											"Mostrando ",
											displayItems.length,
											" resultados · página ",
											page
										]
									})]
								}),
								!hasMore && !loadingMore && page > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-2 mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-checkbox-circle-line text-zinc-400 text-sm" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-zinc-400",
										children: [
											"Has visto todos los resultados — ",
											rawItems.length,
											" ítems en ",
											page,
											" página",
											page !== 1 ? "s" : ""
										]
									})]
								})
							]
						})] }),
						!loading && !cachedLoading && !error && displayItems.length === 0 && rawItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center py-20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-14 h-14 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 mx-auto mb-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-equalizer-2-line text-2xl text-zinc-400" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-zinc-600 dark:text-zinc-400",
									children: "Ningún resultado coincide con los filtros activos"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs mt-1 text-zinc-400 dark:text-zinc-600 mb-4",
									children: [
										rawItems.length,
										" resultado",
										rawItems.length !== 1 ? "s" : "",
										" antes de filtrar"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: reset,
									className: "px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap",
									children: "Limpiar filtros"
								})
							]
						}),
						!loading && !cachedLoading && !error && rawItems.length === 0 && isSearching && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center py-20 text-zinc-400",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-14 h-14 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 mx-auto mb-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-search-line text-2xl" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm font-medium text-zinc-600 dark:text-zinc-400",
									children: [
										"Sin resultados para \"",
										debouncedSearch,
										"\""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs mt-1 text-zinc-400 dark:text-zinc-600",
									children: "Prueba con otro término o cambia de categoría"
								})
							]
						}),
						!loading && !cachedLoading && !isSearching && activeCount === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-zinc-400 text-center mt-8",
							children: "Escribe al menos 2 caracteres para buscar · Los resultados se guardan automáticamente en caché"
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { CatalogPage as default };

//# sourceMappingURL=page-Wv7P-Xel.js.map