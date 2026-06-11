import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { h as require_react, p as useParams, s as require_jsx_runtime, t as useCategories, u as Link } from "./index-cosAM6zi.js";
import { n as getSiteUrl, t as SeoHead } from "./SeoHead-SAtaEFdZ.js";
import { t as edgeFunctionUrl } from "./edgeFunctions-CBeptRpx.js";
import { t as Navbar } from "./Navbar-XnbO_Z_a.js";
import { i as toAppCategory } from "./categories-By_tfbgx.js";
import { t as PEOPLE_MOCK } from "./people-vbkXE967.js";
//#region src/hooks/useEntity.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var EDGE_FN_URL = edgeFunctionUrl("catalog-entity");
var memCache = /* @__PURE__ */ new Map();
function useEntity(slug) {
	const [entity, setEntity] = (0, import_react.useState)(null);
	const [items, setItems] = (0, import_react.useState)([]);
	const [stats, setStats] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!slug) return;
		if (memCache.has(slug)) {
			const c = memCache.get(slug);
			setEntity(c.entity);
			setItems(c.items);
			setStats(c.stats);
			return;
		}
		let cancelled = false;
		setLoading(true);
		setError(null);
		(async () => {
			try {
				const res = await fetch(`${EDGE_FN_URL}?slug=${encodeURIComponent(slug)}`);
				if (!res.ok) {
					const body = await res.json().catch(() => ({}));
					throw new Error(body.error ?? `HTTP ${res.status}`);
				}
				const json = await res.json();
				if (!cancelled) {
					memCache.set(slug, {
						entity: json.entity,
						items: json.items ?? [],
						stats: json.stats ?? { total_items: 0 }
					});
					setEntity(json.entity);
					setItems(json.items ?? []);
					setStats(json.stats ?? { total_items: 0 });
				}
			} catch (err) {
				if (!cancelled) setError(err.message);
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [slug]);
	return {
		entity,
		items,
		stats,
		loading,
		error
	};
}
var TYPE_LABELS = {
	developer: "Desarrollador",
	publisher: "Publisher",
	actor: "Actor / Actriz",
	director: "Director/a",
	author: "Autor/a",
	artist: "Artista",
	creator: "Creador/a"
};
var TYPE_ICONS = {
	developer: "ri-code-box-line",
	publisher: "ri-building-line",
	actor: "ri-user-star-line",
	director: "ri-movie-line",
	author: "ri-quill-pen-line",
	artist: "ri-music-2-line",
	creator: "ri-lightbulb-line"
};
//#endregion
//#region src/pages/entity/components/EntityHero.tsx
var import_jsx_runtime = require_jsx_runtime();
function getItemRating$3(item) {
	const r = item.metadata?.rating;
	return r != null ? Number(r) : null;
}
function EntityHero({ entity, items, slug }) {
	const typeLabel = TYPE_LABELS[entity.type] ?? entity.type;
	const typeIcon = TYPE_ICONS[entity.type] ?? "ri-user-line";
	const rated = items.filter((i) => getItemRating$3(i) != null);
	const avgRating = rated.length > 0 ? rated.reduce((s, i) => s + (getItemRating$3(i) ?? 0), 0) / rated.length : null;
	const topRated = rated.length > 0 ? rated.reduce((best, i) => (getItemRating$3(i) ?? 0) > (getItemRating$3(best) ?? 0) ? i : best, rated[0]) : null;
	const years = items.map((i) => i.release_date?.slice(0, 4)).filter(Boolean);
	const minYear = years.length > 0 ? Math.min(...years.map(Number)) : null;
	const maxYear = years.length > 0 ? Math.max(...years.map(Number)) : null;
	const careerSpan = minYear && maxYear && minYear !== maxYear ? `${minYear} – ${maxYear}` : minYear ? String(minYear) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-full overflow-hidden",
		style: { minHeight: 360 },
		children: [
			entity.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 w-full h-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: entity.image_url,
					alt: "",
					className: "w-full h-full object-cover object-top scale-110 blur-md opacity-25"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/85 to-zinc-900/60" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 opacity-5",
				style: {
					backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
					backgroundSize: "40px 40px"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 max-w-screen-xl mx-auto px-4 md:px-6 pt-10 pb-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "flex items-center gap-2 text-xs text-zinc-500 mb-8 flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:text-white transition-colors cursor-pointer",
							children: "Inicio"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-s-line text-zinc-600" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/catalog",
							className: "hover:text-white transition-colors cursor-pointer",
							children: "Catálogo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-s-line text-zinc-600" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-zinc-400",
							children: entity.name
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col lg:flex-row gap-8 items-start lg:items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-white/10 bg-zinc-800 shadow-2xl",
							children: entity.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: entity.image_url,
								alt: entity.name,
								className: "w-full h-full object-cover object-top"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full h-full flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${typeIcon} text-4xl text-zinc-500` })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute -bottom-2 -right-2 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 border border-zinc-700",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${typeIcon} text-sm text-zinc-300` })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-zinc-300 text-xs font-medium mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: typeIcon }), typeLabel]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-4xl md:text-5xl font-black text-white mb-3 leading-tight",
								style: { fontFamily: "'Space Grotesk', sans-serif" },
								children: entity.name
							}),
							entity.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-zinc-400 leading-relaxed max-w-2xl line-clamp-2 mb-5",
								children: entity.bio
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-8 h-8 flex items-center justify-center rounded-lg bg-white/10",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-film-line text-sm text-zinc-300" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-lg font-black text-white leading-none",
											style: { fontFamily: "'Space Grotesk', sans-serif" },
											children: items.length
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-zinc-500",
											children: "obras"
										})] })]
									}),
									avgRating != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-8 h-8 flex items-center justify-center rounded-lg bg-amber-500/20",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-sm text-amber-400" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-lg font-black text-amber-400 leading-none",
											style: { fontFamily: "'Space Grotesk', sans-serif" },
											children: avgRating.toFixed(1)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-zinc-500",
											children: "media"
										})] })]
									}),
									topRated && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-500/20",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-trophy-line text-sm text-emerald-400" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-lg font-black text-emerald-400 leading-none",
											style: { fontFamily: "'Space Grotesk', sans-serif" },
											children: (getItemRating$3(topRated) ?? 0).toFixed(1)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-zinc-500",
											children: "mejor obra"
										})] })]
									}),
									careerSpan && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-8 h-8 flex items-center justify-center rounded-lg bg-white/10",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-calendar-line text-sm text-zinc-300" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-bold text-white leading-none",
											style: { fontFamily: "'Space Grotesk', sans-serif" },
											children: careerSpan
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-zinc-500",
											children: "trayectoria"
										})] })]
									})
								]
							})
						]
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/entity/components/EntityPopularityStats.tsx
function getItemRating$2(item) {
	const r = item.metadata?.rating;
	return r != null ? Number(r) : null;
}
function getItemYear$1(item) {
	const y = item.release_date?.slice(0, 4);
	return y ? Number(y) : null;
}
function getItemGenre$1(item) {
	const g = item.metadata?.genres ?? item.metadata?.genre;
	if (Array.isArray(g)) return g[0] ?? "";
	return String(g ?? "");
}
function EntityPopularityStats({ items }) {
	const CATEGORIES = useCategories();
	const ratedItems = (0, import_react.useMemo)(() => items.filter((i) => getItemRating$2(i) != null), [items]);
	const ratingBuckets = (0, import_react.useMemo)(() => {
		const buckets = {};
		for (let i = 1; i <= 10; i++) buckets[String(i)] = 0;
		ratedItems.forEach((item) => {
			const r = getItemRating$2(item) ?? 0;
			const bucket = Math.min(10, Math.max(1, Math.round(r)));
			buckets[String(bucket)] = (buckets[String(bucket)] ?? 0) + 1;
		});
		return Object.entries(buckets).map(([score, count]) => ({
			score: Number(score),
			count
		}));
	}, [ratedItems]);
	const maxBucketCount = Math.max(...ratingBuckets.map((b) => b.count), 1);
	const timeline = (0, import_react.useMemo)(() => {
		const byYear = {};
		ratedItems.forEach((item) => {
			const y = getItemYear$1(item);
			const r = getItemRating$2(item);
			if (y && r != null) {
				if (!byYear[y]) byYear[y] = [];
				byYear[y].push(r);
			}
		});
		return Object.entries(byYear).map(([year, ratings]) => ({
			year: Number(year),
			avg: ratings.reduce((a, b) => a + b, 0) / ratings.length,
			count: ratings.length
		})).sort((a, b) => a.year - b.year);
	}, [ratedItems]);
	const genreBreakdown = (0, import_react.useMemo)(() => {
		const counts = {};
		items.forEach((item) => {
			const g = getItemGenre$1(item);
			if (g) counts[g] = (counts[g] ?? 0) + 1;
		});
		return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([genre, count]) => ({
			genre,
			count
		}));
	}, [items]);
	const maxGenreCount = Math.max(...genreBreakdown.map((g) => g.count), 1);
	const categoryBreakdown = (0, import_react.useMemo)(() => {
		const counts = {};
		items.forEach((item) => {
			const id = toAppCategory(item.category) ?? item.category;
			counts[id] = (counts[id] ?? 0) + 1;
		});
		return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([catId, count]) => {
			return {
				catId,
				count,
				cat: CATEGORIES.find((c) => c.id === catId)
			};
		});
	}, [items, CATEGORIES]);
	const totalItems = items.length;
	const avgRating = ratedItems.length > 0 ? ratedItems.reduce((s, i) => s + (getItemRating$2(i) ?? 0), 0) / ratedItems.length : null;
	const topRated = ratedItems.length > 0 ? ratedItems.reduce((best, i) => (getItemRating$2(i) ?? 0) > (getItemRating$2(best) ?? 0) ? i : best, ratedItems[0]) : null;
	const lowestRated = ratedItems.length > 0 ? ratedItems.reduce((worst, i) => (getItemRating$2(i) ?? 10) < (getItemRating$2(worst) ?? 10) ? i : worst, ratedItems[0]) : null;
	if (items.length === 0) return null;
	const chartH = 80;
	const chartW = 300;
	const minAvg = timeline.length > 0 ? Math.min(...timeline.map((t) => t.avg)) : 0;
	const range = (timeline.length > 0 ? Math.max(...timeline.map((t) => t.avg)) : 10) - minAvg || 1;
	const points = timeline.map((t, i) => {
		return {
			x: timeline.length > 1 ? i / (timeline.length - 1) * chartW : chartW / 2,
			y: chartH - (t.avg - minAvg) / range * (chartH - 10) - 5,
			...t
		};
	});
	const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
	const areaPath = points.length > 1 ? `M${points[0].x},${chartH} ${points.map((p) => `L${p.x},${p.y}`).join(" ")} L${points[points.length - 1].x},${chartH} Z` : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 flex flex-col gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-bold text-zinc-900 dark:text-white",
						style: { fontFamily: "'Space Grotesk', sans-serif" },
						children: "Resumen"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-zinc-50 dark:bg-zinc-800/60 rounded-xl p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-black text-zinc-900 dark:text-white leading-none mb-1",
									style: { fontFamily: "'Space Grotesk', sans-serif" },
									children: totalItems
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-zinc-500",
									children: "obras totales"
								})]
							}),
							avgRating != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-black text-amber-500 leading-none mb-1",
									style: { fontFamily: "'Space Grotesk', sans-serif" },
									children: avgRating.toFixed(1)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-zinc-500",
									children: "rating medio"
								})]
							}),
							topRated && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-4 col-span-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-trophy-fill text-emerald-500 text-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-zinc-500",
											children: "mejor valorada"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-bold text-zinc-900 dark:text-white line-clamp-1",
										children: topRated.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-emerald-500 font-semibold mt-0.5",
										children: [(getItemRating$2(topRated) ?? 0).toFixed(1), " / 10"]
									})
								]
							}),
							lowestRated && lowestRated.id !== topRated?.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-zinc-50 dark:bg-zinc-800/60 rounded-xl p-4 col-span-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-down-line text-zinc-400 text-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-zinc-500",
											children: "menor valoración"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-bold text-zinc-900 dark:text-white line-clamp-1",
										children: lowestRated.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-zinc-400 font-semibold mt-0.5",
										children: [(getItemRating$2(lowestRated) ?? 0).toFixed(1), " / 10"]
									})
								]
							})
						]
					}),
					categoryBreakdown.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3",
						children: "Por categoría"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-2",
						children: categoryBreakdown.map(({ catId, count, cat }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-5 h-5 flex items-center justify-center flex-shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
										className: `${cat?.icon ?? "ri-folder-line"} text-xs`,
										style: { color: cat?.accent ?? "#888" }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full transition-all duration-700",
										style: {
											width: `${count / totalItems * 100}%`,
											background: cat?.accent ?? "#888"
										}
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-zinc-500 w-4 text-right flex-shrink-0",
									children: count
								})
							]
						}, catId))
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-bold text-zinc-900 dark:text-white mb-1",
						style: { fontFamily: "'Space Grotesk', sans-serif" },
						children: "Evolución de ratings"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-zinc-400 mb-5",
						children: "Rating medio por año de lanzamiento"
					}),
					timeline.length >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								viewBox: `0 0 ${chartW} ${chartH}`,
								className: "w-full",
								style: { height: 100 },
								preserveAspectRatio: "none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "areaGrad",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: "#f59e0b",
											stopOpacity: "0.3"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: "#f59e0b",
											stopOpacity: "0"
										})]
									}) }),
									areaPath && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: areaPath,
										fill: "url(#areaGrad)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
										points: polyline,
										fill: "none",
										stroke: "#f59e0b",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round"
									}),
									points.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: p.x,
										cy: p.y,
										r: "3",
										fill: "#f59e0b"
									}, i))
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-between mt-2",
								children: points.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-zinc-400",
									style: { fontSize: 10 },
									children: p.year
								}, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex flex-col gap-1.5 max-h-32 overflow-y-auto",
								children: [...points].reverse().map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-zinc-500",
										children: p.year
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-1 rounded-full bg-amber-400",
												style: { width: `${p.avg / 10 * 60}px` }
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-zinc-700 dark:text-zinc-300 w-8 text-right",
												children: p.avg.toFixed(1)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-zinc-400 w-12 text-right",
												children: [
													"(",
													p.count,
													" obra",
													p.count !== 1 ? "s" : "",
													")"
												]
											})
										]
									})]
								}, i))
							})
						]
					}) : timeline.length === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center py-8 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-4xl font-black text-amber-400",
							style: { fontFamily: "'Space Grotesk', sans-serif" },
							children: timeline[0].avg.toFixed(1)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-zinc-400",
							children: ["Rating en ", timeline[0].year]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-center py-8 text-zinc-400 text-sm",
						children: "Sin datos de rating"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 flex flex-col gap-5",
				children: [genreBreakdown.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-bold text-zinc-900 dark:text-white mb-4",
					style: { fontFamily: "'Space Grotesk', sans-serif" },
					children: "Géneros"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2.5",
					children: genreBreakdown.map(({ genre, count }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-zinc-600 dark:text-zinc-400 w-20 flex-shrink-0 truncate",
								children: genre
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-gradient-to-r from-zinc-600 to-zinc-400 dark:from-zinc-400 dark:to-zinc-600 transition-all duration-700",
									style: { width: `${count / maxGenreCount * 100}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300 w-4 text-right flex-shrink-0",
								children: count
							})
						]
					}, genre))
				})] }), ratedItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-bold text-zinc-900 dark:text-white mb-4",
					style: { fontFamily: "'Space Grotesk', sans-serif" },
					children: "Distribución de ratings"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-end gap-1 h-16",
					children: ratingBuckets.map(({ score, count }) => {
						const heightPct = maxBucketCount > 0 ? count / maxBucketCount * 100 : 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 flex flex-col items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full flex items-end justify-center",
								style: { height: 52 },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `w-full rounded-t-sm transition-all duration-700 ${score >= 9 ? "bg-emerald-400" : score >= 7 && score < 9 ? "bg-amber-400" : "bg-zinc-300 dark:bg-zinc-600"}`,
									style: { height: `${Math.max(heightPct, count > 0 ? 8 : 0)}%` },
									title: `${score}: ${count} obra${count !== 1 ? "s" : ""}`
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-zinc-400",
								style: { fontSize: 9 },
								children: score
							})]
						}, score);
					})
				})] })]
			})
		]
	});
}
//#endregion
//#region src/pages/entity/components/EntityFilmography.tsx
function getItemRating$1(item) {
	const r = item.metadata?.rating;
	return r != null ? Number(r) : null;
}
function getItemYear(item) {
	return item.release_date?.slice(0, 4) ?? "";
}
function getItemGenre(item) {
	const g = item.metadata?.genres ?? item.metadata?.genre;
	if (Array.isArray(g)) return g[0] ?? "";
	return String(g ?? "");
}
var SORT_OPTIONS = [
	{
		key: "year_desc",
		label: "Más reciente",
		icon: "ri-sort-desc"
	},
	{
		key: "year_asc",
		label: "Más antiguo",
		icon: "ri-sort-asc"
	},
	{
		key: "rating_desc",
		label: "Mejor valorado",
		icon: "ri-star-fill"
	},
	{
		key: "rating_asc",
		label: "Menor rating",
		icon: "ri-star-line"
	},
	{
		key: "title_asc",
		label: "A → Z",
		icon: "ri-sort-alphabet-asc"
	}
];
function sortItems(items, sort) {
	return [...items].sort((a, b) => {
		switch (sort) {
			case "year_desc": return (Number(getItemYear(b)) || 0) - (Number(getItemYear(a)) || 0);
			case "year_asc": return (Number(getItemYear(a)) || 0) - (Number(getItemYear(b)) || 0);
			case "rating_desc": return (getItemRating$1(b) ?? -1) - (getItemRating$1(a) ?? -1);
			case "rating_asc": return (getItemRating$1(a) ?? 11) - (getItemRating$1(b) ?? 11);
			case "title_asc": return a.title.localeCompare(b.title);
			default: return 0;
		}
	});
}
function GridCard({ item }) {
	const CATEGORIES = useCategories();
	const rating = getItemRating$1(item);
	const year = getItemYear(item);
	const genre = getItemGenre(item);
	const categoryId = toAppCategory(item.category) ?? item.category;
	const cat = CATEGORIES.find((c) => c.id === categoryId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: `/catalog/${categoryId}/${item.slug}`,
		className: "group cursor-pointer",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative rounded-xl overflow-hidden mb-3 aspect-[2/3] bg-zinc-100 dark:bg-zinc-800",
				children: [
					item.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.image_url,
						alt: item.title,
						className: "w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105",
						loading: "lazy"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full h-full flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${cat?.icon ?? "ri-image-line"} text-3xl text-zinc-300 dark:text-zinc-600` })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-line text-zinc-900 text-sm" })
						})
					}),
					rating != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-xs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white text-xs font-semibold",
							children: rating.toFixed(1)
						})]
					}),
					cat && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-lg text-white text-[10px] font-semibold",
						style: { background: cat.accent },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${cat.icon} text-[10px]` }), cat.label]
					})
				]
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
			}),
			item.role && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-zinc-400 italic mt-0.5 truncate",
				children: item.role
			})
		]
	});
}
function ListRow({ item, rank }) {
	const CATEGORIES = useCategories();
	const rating = getItemRating$1(item);
	const year = getItemYear(item);
	const genre = getItemGenre(item);
	const categoryId = toAppCategory(item.category) ?? item.category;
	const cat = CATEGORIES.find((c) => c.id === categoryId);
	const ratingColor = rating != null ? rating >= 9 ? "text-emerald-500" : rating >= 7 ? "text-amber-500" : "text-zinc-400" : "text-zinc-400";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: `/catalog/${categoryId}/${item.slug}`,
		className: "group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-bold text-zinc-300 dark:text-zinc-600 w-5 text-center flex-shrink-0",
				children: rank
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-10 h-14 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0",
				children: item.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: item.image_url,
					alt: item.title,
					className: "w-full h-full object-cover object-top",
					loading: "lazy"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full h-full flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${cat?.icon ?? "ri-image-line"} text-xs text-zinc-400` })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold text-zinc-900 dark:text-white leading-tight line-clamp-1 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors",
					children: item.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mt-0.5 flex-wrap",
					children: [
						cat && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-semibold px-1.5 py-0.5 rounded-md text-white",
							style: { background: cat.accent },
							children: cat.label
						}),
						genre && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-zinc-400",
							children: genre
						}),
						item.role && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-zinc-400 italic",
							children: ["· ", item.role]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-zinc-400 flex-shrink-0 hidden sm:block",
				children: year
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1 flex-shrink-0",
				children: rating != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-xs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `text-sm font-bold ${ratingColor}`,
					children: rating.toFixed(1)
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-zinc-400",
					children: "—"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-5 h-5 flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-s-line text-zinc-400 text-sm" })
			})
		]
	});
}
function EntityFilmography({ items, entityName }) {
	const CATEGORIES = useCategories();
	const [sort, setSort] = (0, import_react.useState)("year_desc");
	const [view, setView] = (0, import_react.useState)("grid");
	const [activeCategory, setActiveCategory] = (0, import_react.useState)("all");
	const [showAll, setShowAll] = (0, import_react.useState)(false);
	const availableCategories = (0, import_react.useMemo)(() => {
		const cats = new Set(items.map((i) => toAppCategory(i.category) ?? i.category));
		return Array.from(cats);
	}, [items]);
	const filtered = (0, import_react.useMemo)(() => {
		if (activeCategory === "all") return items;
		return items.filter((i) => (toAppCategory(i.category) ?? i.category) === activeCategory);
	}, [items, activeCategory]);
	const sorted = (0, import_react.useMemo)(() => sortItems(filtered, sort), [filtered, sort]);
	const limit = view === "grid" ? 12 : 15;
	const displayed = showAll ? sorted : sorted.slice(0, limit);
	const hasMore = sorted.length > limit && !showAll;
	if (items.length === 0) return null;
	SORT_OPTIONS.find((o) => o.key === sort)?.label;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold text-zinc-900 dark:text-white",
					style: { fontFamily: "'Space Grotesk', sans-serif" },
					children: "Filmografía & Obras"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-zinc-400 mt-0.5",
					children: [
						sorted.length,
						" obra",
						sorted.length !== 1 ? "s" : "",
						" de ",
						entityName
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: sort,
							onChange: (e) => setSort(e.target.value),
							className: "appearance-none pl-3 pr-8 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600",
							children: SORT_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: o.key,
								children: o.label
							}, o.key))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-down-s-line text-zinc-400 text-sm" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setView("grid"),
							className: `px-3 py-2 flex items-center justify-center transition-colors cursor-pointer ${view === "grid" ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "bg-white dark:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-grid-line text-sm" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setView("list"),
							className: `px-3 py-2 flex items-center justify-center transition-colors cursor-pointer ${view === "list" ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "bg-white dark:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-list-check text-sm" })
						})]
					})]
				})]
			}), availableCategories.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 mt-4 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveCategory("all"),
					className: `px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${activeCategory === "all" ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"}`,
					children: [
						"Todas (",
						items.length,
						")"
					]
				}), availableCategories.map((catId) => {
					const cat = CATEGORIES.find((c) => c.id === catId);
					const count = items.filter((i) => (toAppCategory(i.category) ?? i.category) === catId).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveCategory(catId),
						className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${activeCategory === catId ? "text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"}`,
						style: activeCategory === catId ? { background: cat?.accent ?? "#888" } : {},
						children: [
							cat && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${cat.icon} text-xs` }),
							cat?.label ?? catId,
							" (",
							count,
							")"
						]
					}, catId);
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-6",
			children: [sorted.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center py-12 gap-3 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-12 h-12 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-inbox-line text-xl text-zinc-400" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-zinc-500",
					children: "No hay obras en esta categoría"
				})]
			}) : view === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5",
				children: displayed.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCard, { item }, `${item.id}-${item.role}`))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col divide-y divide-zinc-50 dark:divide-zinc-800/60",
				children: displayed.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListRow, {
					item,
					rank: i + 1
				}, `${item.id}-${item.role}`))
			}), hasMore && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setShowAll(true),
					className: "flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-add-line text-sm" }),
						"Ver las ",
						sorted.length - limit,
						" obras restantes"
					]
				})
			})]
		})]
	});
}
//#endregion
//#region src/pages/entity/components/EntityTopWork.tsx
function getItemRating(item) {
	const r = item.metadata?.rating;
	return r != null ? Number(r) : null;
}
function EntityTopWork({ items }) {
	const CATEGORIES = useCategories();
	const rated = items.filter((i) => getItemRating(i) != null);
	if (rated.length < 2) return null;
	const topWork = rated.reduce((best, i) => (getItemRating(i) ?? 0) > (getItemRating(best) ?? 0) ? i : best, rated[0]);
	const rating = getItemRating(topWork) ?? 0;
	const year = topWork.release_date?.slice(0, 4) ?? "";
	const categoryId = toAppCategory(topWork.category) ?? topWork.category;
	const cat = CATEGORIES.find((c) => c.id === categoryId);
	const genre = (() => {
		const g = topWork.metadata?.genres ?? topWork.metadata?.genre;
		if (Array.isArray(g)) return g[0] ?? "";
		return String(g ?? "");
	})();
	rating / 10 * 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden mb-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full sm:w-48 flex-shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-[2/3] sm:aspect-auto sm:h-full min-h-[200px] bg-zinc-100 dark:bg-zinc-800",
					children: topWork.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: topWork.image_url,
						alt: topWork.title,
						className: "w-full h-full object-cover object-top"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full h-full flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${cat?.icon ?? "ri-image-line"} text-4xl text-zinc-300 dark:text-zinc-600` })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-trophy-fill text-xs" }), "Obra destacada"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 p-6 flex flex-col justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					cat && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-xs font-semibold mb-3",
						style: { background: cat.accent },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${cat.icon} text-xs` }), cat.label]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-2xl font-black text-zinc-900 dark:text-white mb-2 leading-tight",
						style: { fontFamily: "'Space Grotesk', sans-serif" },
						children: topWork.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3 text-sm text-zinc-500 mb-4",
						children: [
							year && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-calendar-line text-xs" }), year]
							}),
							genre && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-price-tag-3-line text-xs" }), genre]
							}),
							topWork.role && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 italic",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-user-line text-xs" }), topWork.role]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-3 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-5xl font-black text-amber-500 leading-none",
							style: { fontFamily: "'Space Grotesk', sans-serif" },
							children: rating.toFixed(1)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-zinc-400 mt-1",
							children: "de 10 puntos"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 pb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-0.5 mb-1",
								children: [
									1,
									2,
									3,
									4,
									5,
									6,
									7,
									8,
									9,
									10
								].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex-1 h-2 rounded-full transition-all duration-700",
									style: {
										background: n <= Math.round(rating) ? rating >= 9 ? "#10b981" : rating >= 7 ? "#f59e0b" : "#94a3b8" : void 0,
										backgroundColor: n <= Math.round(rating) ? void 0 : "rgb(228 228 231)"
									}
								}, n))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-zinc-400",
								children: rating >= 9 ? "Obra maestra" : rating >= 8 ? "Excelente" : rating >= 7 ? "Muy buena" : "Buena"
							})]
						})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: `/catalog/${categoryId}/${topWork.slug}`,
					className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap self-start",
					children: ["Ver en catálogo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-line text-sm" })]
				})]
			})]
		})
	});
}
//#endregion
//#region src/pages/entity/components/EntityRelated.tsx
function roleToType(role) {
	const r = role.toLowerCase();
	if (r.includes("director")) return "director";
	if (r.includes("actor") || r.includes("actriz")) return "actor";
	if (r.includes("autor") || r.includes("author")) return "author";
	if (r.includes("artista") || r.includes("artist")) return "artist";
	if (r.includes("desarrollador") || r.includes("developer")) return "developer";
	if (r.includes("publisher")) return "publisher";
	return "creator";
}
function EntityRelated({ items, currentSlug }) {
	const [showAll, setShowAll] = (0, import_react.useState)(false);
	const myItemIds = (0, import_react.useMemo)(() => new Set(items.map((i) => i.id)), [items]);
	const collaborators = (0, import_react.useMemo)(() => {
		if (myItemIds.size === 0) return [];
		const result = [];
		Object.values(PEOPLE_MOCK).forEach((person) => {
			if (person.id === currentSlug) return;
			const shared = person.works.filter((w) => myItemIds.has(w.id));
			if (shared.length === 0) return;
			result.push({
				id: person.id,
				name: person.name,
				photo: person.photo,
				role: person.role,
				sharedWorkIds: shared.map((w) => w.id),
				sharedWorkTitles: shared.map((w) => w.title),
				collaborationCount: shared.length
			});
		});
		return result.sort((a, b) => b.collaborationCount - a.collaborationCount || a.name.localeCompare(b.name));
	}, [myItemIds, currentSlug]);
	if (collaborators.length === 0) return null;
	const LIMIT = 8;
	const displayed = showAll ? collaborators : collaborators.slice(0, LIMIT);
	const hasMore = collaborators.length > LIMIT && !showAll;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold text-zinc-900 dark:text-white",
					style: { fontFamily: "'Space Grotesk', sans-serif" },
					children: "Colaboradores frecuentes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-zinc-400 mt-0.5",
					children: "Personas y estudios que han trabajado en las mismas obras"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm text-zinc-400 font-medium",
					children: [
						collaborators.length,
						" encontrado",
						collaborators.length !== 1 ? "s" : ""
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4",
				children: displayed.map((collab) => {
					const type = roleToType(collab.role);
					const typeIcon = TYPE_ICONS[type] ?? "ri-user-line";
					const typeLabel = TYPE_LABELS[type] ?? collab.role;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: `/entity/${collab.id}`,
						className: "group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200 cursor-pointer",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex-shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: collab.photo,
											alt: collab.name,
											className: "w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105",
											loading: "lazy"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
											className: `${typeIcon} text-zinc-500 dark:text-zinc-400`,
											style: { fontSize: 9 }
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold text-zinc-900 dark:text-white leading-tight line-clamp-1 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors",
										children: collab.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-zinc-400 mt-0.5",
										children: typeLabel
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex items-center gap-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-links-line text-zinc-400 text-xs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300",
										children: [
											collab.collaborationCount,
											" obra",
											collab.collaborationCount !== 1 ? "s" : "",
											" en común"
										]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2.5 flex flex-col gap-1",
								children: [collab.sharedWorkTitles.slice(0, 2).map((title, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-400 truncate",
										children: title
									})]
								}, i)), collab.sharedWorkTitles.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-zinc-400 italic pl-2.5",
									children: [
										"+",
										collab.sharedWorkTitles.length - 2,
										" más"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-zinc-400 flex items-center gap-1",
									children: ["Ver perfil", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-line text-xs" })]
								})
							})
						]
					}, collab.id);
				})
			}),
			hasMore && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setShowAll(true),
					className: "flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-add-line text-sm" }),
						"Ver ",
						collaborators.length - LIMIT,
						" colaboradores más"
					]
				})
			})
		]
	});
}
//#endregion
//#region src/pages/entity/page.tsx
function PageSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-zinc-50 dark:bg-zinc-950 animate-pulse",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full h-80 bg-zinc-200 dark:bg-zinc-800" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-screen-xl mx-auto px-4 md:px-6 py-10 flex flex-col gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-5",
				children: [
					0,
					1,
					2
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" }, i))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-96 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" })]
		})]
	});
}
function EntityBio({ bio, name }) {
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const isLong = bio.length > 300;
	const displayed = isLong && !expanded ? bio.slice(0, 300) + "…" : bio;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 mb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "text-base font-bold text-zinc-900 dark:text-white mb-3",
				style: { fontFamily: "'Space Grotesk', sans-serif" },
				children: ["Sobre ", name]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed",
				children: displayed
			}),
			isLong && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setExpanded((v) => !v),
				className: "mt-3 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer",
				children: expanded ? "Leer menos" : "Leer más"
			})
		]
	});
}
function EntityPage() {
	const { slug = "" } = useParams();
	const { entity, items, loading, error } = useEntity(slug);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pt-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSkeleton, {})
	})] });
	if (error || !entity) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-white dark:bg-zinc-950 flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col items-center justify-center gap-4 text-zinc-400 pt-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-16 h-16 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-user-unfollow-line text-3xl" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg font-semibold text-zinc-700 dark:text-zinc-300",
					children: "Entidad no encontrada"
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-rose-500 max-w-xs text-center",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/catalog",
					className: "text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline cursor-pointer",
					children: "Volver al catálogo"
				})
			]
		})]
	});
	const typeLabel = TYPE_LABELS[entity.type] ?? entity.type;
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": [
			"actor",
			"director",
			"author",
			"artist"
		].includes(entity.type) ? "Person" : "Organization",
		name: entity.name,
		description: entity.bio ?? void 0,
		image: entity.image_url ?? void 0,
		url: `${getSiteUrl()}/entity/${slug}`
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-zinc-50 dark:bg-zinc-950",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoHead, {
				title: `${entity.name} — ${typeLabel} | Vaultly`,
				description: entity.bio ? entity.bio.slice(0, 155) : `${entity.name} es ${typeLabel.toLowerCase()} con ${items.length} obra${items.length !== 1 ? "s" : ""} en Vaultly.`,
				keywords: `${entity.name}, ${typeLabel}, filmografía, obras, Vaultly`,
				canonical: `/entity/${slug}`,
				ogImage: entity.image_url ?? void 0,
				jsonLd
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntityHero, {
					entity,
					items,
					slug
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-screen-xl mx-auto px-4 md:px-6 py-10",
					children: [
						entity.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntityBio, {
							bio: entity.bio,
							name: entity.name
						}),
						items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntityPopularityStats, { items }),
						items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntityTopWork, { items }),
						items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntityFilmography, {
							items,
							entityName: entity.name
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center py-20 gap-3 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-14 h-14 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-inbox-line text-2xl text-zinc-400" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-zinc-600 dark:text-zinc-400",
									children: "Aún no hay obras vinculadas a esta entidad"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-zinc-400 max-w-xs",
									children: "Las obras se añaden automáticamente cuando se buscan ítems relacionados en el catálogo"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/catalog",
									className: "mt-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap",
									children: "Explorar catálogo"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntityRelated, {
							items,
							currentSlug: slug
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { EntityPage as default };

//# sourceMappingURL=page-CTnS3By_.js.map