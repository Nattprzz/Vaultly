import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { h as require_react, l as supabase, p as useParams, s as require_jsx_runtime, t as useCategories, u as Link } from "./index-cosAM6zi.js";
import { t as SeoHead } from "./SeoHead-SAtaEFdZ.js";
import { t as Navbar } from "./Navbar-XnbO_Z_a.js";
import { i as usePublicReviews, t as formatDate } from "./useReviews-DBv0YoLg.js";
//#region src/hooks/usePublicTracker.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function getCatMeta(catId, categories) {
	return categories.find((c) => c.id === catId) ?? {
		label: catId,
		icon: "ri-stack-line",
		accent: "#6b7280"
	};
}
function canReadPublicTracker(privacy) {
	return Boolean(privacy?.is_public && privacy.share_tracker);
}
function usePublicTracker(userId, privacy) {
	const categories = useCategories();
	const [entries, setEntries] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [hidden, setHidden] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!userId || !canReadPublicTracker(privacy)) {
			setEntries([]);
			setHidden(Boolean(userId));
			setLoading(false);
			return;
		}
		const load = async () => {
			setLoading(true);
			setHidden(false);
			const { data } = await supabase.from("user_item_tracking").select("id, item_id, item_slug, category, status_en, rating, review, updated_at").eq("user_id", userId).order("updated_at", { ascending: false });
			if (data) {
				const slugs = [...new Set(data.map((row) => row.item_slug).filter(Boolean))];
				const catalogBySlug = /* @__PURE__ */ new Map();
				if (slugs.length > 0) {
					const { data: catalogRows } = await supabase.from("catalog_items").select("id, slug, title, image_url, cover_url, release_date, metadata").in("slug", slugs);
					catalogRows?.forEach((item) => {
						catalogBySlug.set(item.slug, item);
					});
				}
				setEntries(data.map((r) => {
					const meta = getCatMeta(r.category ?? "", categories);
					const catalogItem = catalogBySlug.get(r.item_slug ?? "");
					const metadata = catalogItem?.metadata ?? {};
					const genres = metadata.genres;
					const genre = Array.isArray(genres) ? String(genres[0] ?? "") : String(metadata.genre ?? "");
					const releaseDate = catalogItem?.release_date;
					return {
						id: r.id,
						item_slug: r.item_slug ?? r.id,
						category: r.category ?? "",
						categoryLabel: meta.label,
						categoryIcon: meta.icon,
						categoryAccent: meta.accent,
						status: privacy?.show_item_status === false ? null : r.status_en ?? "pending",
						rating: privacy?.show_ratings ? r.rating != null ? Number(r.rating) : null : null,
						review: privacy?.show_reviews ? r.review ?? null : null,
						updated_at: r.updated_at,
						title: catalogItem?.title ?? String(r.item_slug ?? "").replace(/-/g, " "),
						cover: catalogItem?.image_url ?? catalogItem?.cover_url ?? "",
						year: releaseDate ? Number(releaseDate.slice(0, 4)) : 0,
						genre
					};
				}));
			}
			setLoading(false);
		};
		load();
	}, [
		userId,
		privacy?.is_public,
		privacy?.share_tracker,
		privacy?.show_ratings,
		privacy?.show_reviews,
		privacy?.show_item_status,
		categories
	]);
	return {
		entries,
		loading,
		hidden
	};
}
//#endregion
//#region src/pages/public-profile/components/PublicProfileHero.tsx
var import_jsx_runtime = require_jsx_runtime();
function PublicProfileHero({ username, userId, displayName, initials, privacy }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const { entries } = usePublicTracker(userId, privacy);
	const completed = privacy.show_item_status === false ? "—" : entries.filter((e) => e.status === "completed").length;
	const rated = entries.filter((e) => e.rating !== null);
	const avgRating = rated.length > 0 ? (rated.reduce((s, e) => s + (e.rating ?? 0), 0) / rated.length).toFixed(1) : "—";
	const reviews = privacy.show_reviews ? entries.filter((e) => e.review && e.review.trim().length > 0).length : "—";
	const profileUrl = `${window.location.origin}/u/${username}`;
	const handleCopy = () => {
		navigator.clipboard.writeText(profileUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-full h-52 md:h-72 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: "https://readdy.ai/api/search-image?query=abstract%20dark%20cinematic%20gradient%20background%20bokeh%20lights%20moody%20atmosphere%20deep%20dark%20tones%20artistic%20photography%20ultra%20wide%20panoramic%20minimal&width=1400&height=400&seq=pub-profile-banner-01&orientation=landscape",
			alt: "Banner de perfil",
			className: "w-full h-full object-cover object-top"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 via-transparent to-transparent" })]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-screen-xl mx-auto px-4 md:px-8 -mt-16 relative z-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col md:flex-row md:items-end justify-between gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end gap-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center text-white text-3xl font-black border-4 border-zinc-50 dark:border-zinc-950 flex-shrink-0",
					children: initials
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-1 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl md:text-3xl font-black text-zinc-900 dark:text-white",
							style: { fontFamily: "'Space Grotesk', sans-serif" },
							children: displayName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-global-line text-xs" }), "Perfil público"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-zinc-500 dark:text-zinc-400",
						children: ["@", username]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2 pb-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleCopy,
					className: `flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${copied ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400" : "border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: copied ? "ri-checkbox-circle-line" : "ri-link" }), copied ? "Copiado" : "Copiar enlace"]
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800",
			children: [
				{
					label: "En tracker",
					value: entries.length,
					icon: "ri-stack-line",
					color: "text-violet-500"
				},
				{
					label: "Completados",
					value: completed,
					icon: "ri-checkbox-circle-line",
					color: "text-emerald-500"
				},
				{
					label: "Puntuación media",
					value: avgRating,
					icon: "ri-star-line",
					color: "text-amber-500"
				},
				{
					label: "Reseñas",
					value: reviews,
					icon: "ri-quill-pen-line",
					color: "text-rose-500"
				}
			].map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${stat.icon} ${stat.color} text-lg` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-lg font-black text-zinc-900 dark:text-white",
					style: { fontFamily: "'Space Grotesk', sans-serif" },
					children: stat.value
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-zinc-500 dark:text-zinc-400 ml-1.5",
					children: stat.label
				})] })]
			}, stat.label))
		})]
	})] });
}
//#endregion
//#region src/pages/public-profile/components/PublicTrackerList.tsx
var STATUS_CONFIG = {
	completed: {
		label: "Completado",
		color: "text-emerald-600 dark:text-emerald-400",
		bg: "bg-emerald-50 dark:bg-emerald-950/30",
		icon: "ri-checkbox-circle-line"
	},
	in_progress: {
		label: "En progreso",
		color: "text-amber-600 dark:text-amber-400",
		bg: "bg-amber-50 dark:bg-amber-950/30",
		icon: "ri-loader-4-line"
	},
	pending: {
		label: "Pendiente",
		color: "text-zinc-500 dark:text-zinc-400",
		bg: "bg-zinc-100 dark:bg-zinc-800",
		icon: "ri-bookmark-line"
	},
	dropped: {
		label: "Abandonado",
		color: "text-rose-600 dark:text-rose-400",
		bg: "bg-rose-50 dark:bg-rose-950/30",
		icon: "ri-close-circle-line"
	}
};
var STATUS_FILTERS = [
	{
		id: "all",
		label: "Todos"
	},
	{
		id: "completed",
		label: "Completados"
	},
	{
		id: "in_progress",
		label: "En progreso"
	},
	{
		id: "pending",
		label: "Pendientes"
	},
	{
		id: "dropped",
		label: "Abandonados"
	}
];
function PublicTrackerList({ userId, privacy }) {
	const CATEGORIES = useCategories();
	const { entries, loading, hidden } = usePublicTracker(userId, privacy);
	const [activeCategory, setActiveCategory] = (0, import_react.useState)("all");
	const [activeStatus, setActiveStatus] = (0, import_react.useState)("all");
	const [viewMode, setViewMode] = (0, import_react.useState)("grid");
	const [search, setSearch] = (0, import_react.useState)("");
	const categoryFilters = (0, import_react.useMemo)(() => {
		const cats = [...new Set(entries.map((e) => e.category))];
		const all = [{
			id: "all",
			label: "Todo",
			icon: "ri-apps-line",
			accent: "#71717a"
		}];
		const rest = cats.map((catId) => {
			const meta = CATEGORIES.find((c) => c.id === catId);
			return {
				id: catId,
				label: meta?.label ?? catId,
				icon: meta?.icon ?? "ri-stack-line",
				accent: meta?.accent ?? "#6b7280"
			};
		});
		return [...all, ...rest];
	}, [entries, CATEGORIES]);
	const filtered = (0, import_react.useMemo)(() => entries.filter((e) => {
		const matchCat = activeCategory === "all" || e.category === activeCategory;
		const matchStatus = activeStatus === "all" || e.status === activeStatus;
		const title = e.title || e.item_slug.replace(/-/g, " ");
		const matchSearch = search.trim() === "" || title.toLowerCase().includes(search.toLowerCase());
		return matchCat && matchStatus && matchSearch;
	}), [
		entries,
		activeCategory,
		activeStatus,
		search
	]);
	const grouped = (0, import_react.useMemo)(() => filtered.reduce((acc, e) => {
		const key = e.categoryLabel;
		if (!acc[key]) acc[key] = [];
		acc[key].push(e);
		return acc;
	}, {}), [filtered]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3",
		children: Array.from({ length: 12 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-[2/3] rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" })]
		}, i))
	});
	if (hidden) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-14 h-14 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-lock-line text-2xl text-zinc-400" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-bold text-zinc-900 dark:text-white mb-2",
				children: "Tracker privado"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-zinc-500",
				children: "Este usuario ha ocultado su lista de seguimiento."
			})
		]
	});
	if (entries.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-14 h-14 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-stack-line text-2xl text-zinc-400" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-bold text-zinc-900 dark:text-white mb-2",
				children: "Tracker vacío"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-zinc-500",
				children: "Este usuario aún no ha añadido ítems a su tracker."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-2 flex-wrap mb-5",
			children: categoryFilters.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setActiveCategory(cat.id),
				className: `flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${activeCategory === cat.id ? "text-white" : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600"}`,
				style: activeCategory === cat.id ? { background: cat.accent } : {},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${cat.icon} text-sm` }), cat.label]
			}, cat.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 w-full sm:max-w-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: "Buscar en la lista...",
						value: search,
						onChange: (e) => setSearch(e.target.value),
						className: "w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 overflow-x-auto",
					children: STATUS_FILTERS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setActiveStatus(s.id),
						className: `px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${activeStatus === s.id ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"}`,
						children: s.label
					}, s.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 ml-auto",
					children: ["grid", "list"].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setViewMode(v),
						className: `w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer ${viewMode === v ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white" : "text-zinc-400 hover:text-zinc-600"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: v === "grid" ? "ri-grid-line text-sm" : "ri-list-check text-sm" })
					}, v))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-xs text-zinc-400 mb-5",
			children: [
				filtered.length,
				" ",
				filtered.length === 1 ? "ítem" : "ítems"
			]
		}),
		filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center py-20 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-search-line text-3xl text-zinc-300 dark:text-zinc-600 mb-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-zinc-500",
				children: "Sin resultados. Prueba con otros filtros."
			})]
		}) : activeCategory === "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-10",
			children: Object.entries(grouped).map(([catLabel, items]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-7 h-7 flex items-center justify-center rounded-lg",
						style: { background: `${items[0]?.categoryAccent}20` },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
							className: `${items[0]?.categoryIcon} text-sm`,
							style: { color: items[0]?.categoryAccent }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-zinc-900 dark:text-white text-sm",
						children: catLabel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-zinc-400 ml-1",
						children: [
							"(",
							items.length,
							")"
						]
					})
				]
			}), viewMode === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridView, { items }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListView, { items })] }, catLabel))
		}) : viewMode === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridView, { items: filtered }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListView, { items: filtered })
	] });
}
function GridView({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3",
		children: items.map((item) => {
			const sc = item.status ? STATUS_CONFIG[item.status] ?? STATUS_CONFIG["pending"] : null;
			const title = item.title || item.item_slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: `/catalog/${item.category}/${item.item_slug}`,
				className: "group cursor-pointer",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative rounded-xl overflow-hidden mb-2 aspect-[2/3] flex items-center justify-center",
						style: { background: `${item.categoryAccent}15` },
						children: [
							item.cover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: item.cover,
								alt: title,
								className: "h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col items-center gap-1 p-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
									className: `${item.categoryIcon} text-3xl`,
									style: { color: item.categoryAccent }
								})
							}),
							sc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md backdrop-blur-sm ${sc.bg}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${sc.icon} ${sc.color} text-xs` })
							}),
							item.rating !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute bottom-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-xs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-white text-xs font-bold",
									children: item.rating
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-zinc-900 dark:text-white line-clamp-2 leading-tight",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-zinc-400 mt-0.5",
						children: item.categoryLabel
					})
				]
			}, item.id);
		})
	});
}
function ListView({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-2",
		children: items.map((item, idx) => {
			const sc = item.status ? STATUS_CONFIG[item.status] ?? STATUS_CONFIG["pending"] : null;
			const title = item.title || item.item_slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: `/catalog/${item.category}/${item.item_slug}`,
				className: "group flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all cursor-pointer",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-black text-zinc-300 dark:text-zinc-700 w-5 text-center flex-shrink-0",
						children: idx + 1
					}),
					item.cover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.cover,
						alt: title,
						className: "w-10 h-14 rounded-lg object-cover object-top flex-shrink-0"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-14 rounded-lg flex items-center justify-center flex-shrink-0",
						style: { background: `${item.categoryAccent}15` },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
							className: `${item.categoryIcon} text-xl`,
							style: { color: item.categoryAccent }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-rose-500 transition-colors line-clamp-1",
							children: title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block",
							style: {
								background: `${item.categoryAccent}15`,
								color: item.categoryAccent
							},
							children: item.categoryLabel
						})]
					}),
					sc ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${sc.bg} ${sc.color}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: sc.icon }), sc.label]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden sm:block w-24 flex-shrink-0" }),
					item.rating !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 flex-shrink-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-sm" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold text-zinc-900 dark:text-white",
								children: item.rating
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-zinc-400",
								children: "/10"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-12 flex-shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-s-line text-zinc-300 dark:text-zinc-600 flex-shrink-0" })
				]
			}, item.id);
		})
	});
}
//#endregion
//#region src/pages/public-profile/components/PublicProfileStats.tsx
function PublicProfileStats({ userId, privacy }) {
	const CATEGORIES = useCategories();
	const { entries, loading, hidden } = usePublicTracker(userId, privacy);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-6",
		children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-40 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse mb-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-4 gap-3",
				children: Array.from({ length: 4 }).map((_, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-20 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" }, j))
			})]
		}, i))
	});
	if (hidden) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-lock-line text-3xl text-zinc-300 dark:text-zinc-600 mb-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-zinc-500",
			children: "Este usuario ha ocultado sus estadísticas públicas."
		})]
	});
	const showStatus = privacy.show_item_status !== false;
	const completed = showStatus ? entries.filter((e) => e.status === "completed").length : 0;
	const inProgress = showStatus ? entries.filter((e) => e.status === "in_progress").length : 0;
	const pending = showStatus ? entries.filter((e) => e.status === "pending").length : 0;
	const dropped = showStatus ? entries.filter((e) => e.status === "dropped").length : 0;
	const completionRate = entries.length > 0 ? Math.round(completed / entries.length * 100) : 0;
	const rated = entries.filter((e) => e.rating !== null);
	const avgRating = rated.length > 0 ? (rated.reduce((s, e) => s + (e.rating ?? 0), 0) / rated.length).toFixed(1) : "—";
	const ratingDist = Array.from({ length: 10 }, (_, i) => {
		const score = i + 1;
		return {
			score,
			count: rated.filter((e) => e.rating === score).length
		};
	});
	const maxCount = Math.max(...ratingDist.map((r) => r.count), 1);
	const catStats = CATEGORIES.map((cat) => {
		const catEntries = entries.filter((e) => e.category === cat.id);
		if (catEntries.length === 0) return null;
		const catCompleted = showStatus ? catEntries.filter((e) => e.status === "completed").length : 0;
		const catRated = catEntries.filter((e) => e.rating !== null);
		const catAvg = catRated.length > 0 ? (catRated.reduce((s, e) => s + (e.rating ?? 0), 0) / catRated.length).toFixed(1) : null;
		const pct = showStatus ? Math.round(catCompleted / catEntries.length * 100) : 0;
		return {
			...cat,
			total: catEntries.length,
			completed: catCompleted,
			avg: catAvg,
			pct
		};
	}).filter(Boolean);
	if (entries.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-bar-chart-box-line text-3xl text-zinc-300 dark:text-zinc-600 mb-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-zinc-500",
			children: "Sin estadísticas todavía."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-bold text-zinc-900 dark:text-white mb-5 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-pie-chart-line text-violet-500" }), "Resumen global"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-zinc-600 dark:text-zinc-400",
								children: "Tasa de finalización"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm font-bold text-zinc-900 dark:text-white",
								children: [completionRate, "%"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-gradient-to-r from-violet-500 to-rose-500 transition-all duration-700",
								style: { width: `${completionRate}%` }
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
						children: [
							{
								label: "Completados",
								value: completed,
								color: "text-emerald-500",
								bg: "bg-emerald-50 dark:bg-emerald-950/30",
								icon: "ri-checkbox-circle-line"
							},
							{
								label: "En progreso",
								value: inProgress,
								color: "text-amber-500",
								bg: "bg-amber-50 dark:bg-amber-950/30",
								icon: "ri-loader-4-line"
							},
							{
								label: "Pendientes",
								value: pending,
								color: "text-zinc-500",
								bg: "bg-zinc-100 dark:bg-zinc-800",
								icon: "ri-bookmark-line"
							},
							{
								label: "Abandonados",
								value: dropped,
								color: "text-rose-500",
								bg: "bg-rose-50 dark:bg-rose-950/30",
								icon: "ri-close-circle-line"
							}
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex flex-col items-center gap-1.5 py-4 rounded-xl ${s.bg}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${s.icon} ${s.color} text-xl` }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xl font-black text-zinc-900 dark:text-white",
									style: { fontFamily: "'Space Grotesk', sans-serif" },
									children: s.value
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-zinc-500",
									children: s.label
								})
							]
						}, s.label))
					})
				]
			}),
			catStats.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-bold text-zinc-900 dark:text-white mb-5 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-bar-chart-box-line text-rose-500" }), "Por categoría"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-4",
					children: catStats.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-7 h-7 flex items-center justify-center rounded-lg",
								style: { background: `${cat.accent}20` },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
									className: `${cat.icon} text-sm`,
									style: { color: cat.accent }
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold text-zinc-800 dark:text-zinc-200",
								children: cat.label
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4 text-xs text-zinc-500",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								cat.completed,
								"/",
								cat.total
							] }), cat.avg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-zinc-700 dark:text-zinc-300",
									children: cat.avg
								})]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full transition-all duration-700",
							style: {
								width: `${cat.pct}%`,
								background: cat.accent
							}
						})
					})] }, cat.id))
				})]
			}),
			rated.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-bold text-zinc-900 dark:text-white mb-5 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-line text-amber-400" }), "Distribución de puntuaciones"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-end gap-2 h-28",
					children: ratingDist.map(({ score, count }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 flex flex-col items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-zinc-500",
								children: count > 0 ? count : ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full rounded-t-md transition-all duration-500",
								style: {
									height: `${count / maxCount * 80}px`,
									minHeight: count > 0 ? "4px" : "0",
									background: count > 0 ? score >= 9 ? "#10b981" : score >= 7 ? "#f59e0b" : "#f43f5e" : "#f4f4f5"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-zinc-400",
								children: score
							})
						]
					}, score))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
				children: [
					{
						icon: "ri-star-fill",
						iconColor: "text-amber-400",
						bg: "bg-amber-50 dark:bg-amber-950/30",
						value: avgRating,
						label: "Puntuación media"
					},
					{
						icon: "ri-quill-pen-line",
						iconColor: "text-violet-500",
						bg: "bg-violet-50 dark:bg-violet-950/30",
						value: entries.filter((e) => e.review?.trim()).length,
						label: "Reseñas escritas"
					},
					{
						icon: "ri-trophy-line",
						iconColor: "text-emerald-500",
						bg: "bg-emerald-50 dark:bg-emerald-950/30",
						value: `${completionRate}%`,
						label: "Tasa de finalización"
					}
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `w-10 h-10 flex items-center justify-center rounded-xl ${f.bg} mx-auto mb-3`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${f.icon} ${f.iconColor} text-lg` })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xl font-black text-zinc-900 dark:text-white mb-1",
							style: { fontFamily: "'Space Grotesk', sans-serif" },
							children: f.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-zinc-500",
							children: f.label
						})
					]
				}, f.label))
			})
		]
	});
}
//#endregion
//#region src/pages/public-profile/components/PublicProfileReviews.tsx
function PublicProfileReviews({ userId, displayName, initials, privacy }) {
	const { reviews, loading, hidden } = usePublicReviews(userId, privacy);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-4",
		children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-12 h-16 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-40 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-24 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" })]
		}, i))
	});
	if (hidden) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-14 h-14 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-lock-line text-2xl text-zinc-400" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-bold text-zinc-900 dark:text-white mb-2",
				children: "Reseñas privadas"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-zinc-500 max-w-xs",
				children: "Este usuario ha ocultado sus reseñas públicas."
			})
		]
	});
	if (reviews.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-14 h-14 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-quill-pen-line text-2xl text-zinc-400" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-bold text-zinc-900 dark:text-white mb-2",
				children: "Sin reseñas todavía"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-zinc-500 max-w-xs",
				children: "Este usuario no ha escrito reseñas aún."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-4",
		children: reviews.map((entry) => {
			const title = entry.title || entry.item_slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 mb-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: `/catalog/${entry.category}/${entry.item_slug}`,
								className: "flex-shrink-0 cursor-pointer",
								children: entry.cover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: entry.cover,
									alt: title,
									className: "w-12 h-16 rounded-lg object-cover object-top"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-16 rounded-lg flex items-center justify-center",
									style: { background: `${entry.categoryAccent}15` },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
										className: `${entry.categoryIcon} text-2xl`,
										style: { color: entry.categoryAccent }
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: `/catalog/${entry.category}/${entry.item_slug}`,
									className: "cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-sm font-bold text-zinc-900 dark:text-white hover:text-rose-500 transition-colors line-clamp-1",
										children: title
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-2 mt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs px-2 py-0.5 rounded-full font-medium",
										style: {
											background: `${entry.categoryAccent}15`,
											color: entry.categoryAccent
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${entry.categoryIcon} mr-1 text-xs` }), entry.categoryLabel]
									})
								})]
							}),
							entry.rating !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center gap-0.5 flex-shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-base" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-lg font-black text-zinc-900 dark:text-white",
										style: { fontFamily: "'Space Grotesk', sans-serif" },
										children: entry.rating
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-zinc-400",
									children: "/10"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
						className: "text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic border-l-2 border-zinc-200 dark:border-zinc-700 pl-4",
						children: [
							"“",
							entry.review,
							"”"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mt-4 pt-3 border-t border-zinc-50 dark:border-zinc-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold",
								children: initials
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-zinc-500",
								children: displayName
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-zinc-400",
							children: formatDate(entry.updated_at)
						})]
					})
				]
			}, entry.id);
		})
	});
}
//#endregion
//#region src/pages/public-profile/page.tsx
var TABS = [
	{
		id: "tracker",
		label: "Lista de seguimiento",
		icon: "ri-stack-line"
	},
	{
		id: "stats",
		label: "Estadísticas",
		icon: "ri-bar-chart-box-line"
	},
	{
		id: "reviews",
		label: "Reseñas",
		icon: "ri-quill-pen-line"
	}
];
function PublicProfilePage() {
	const { username } = useParams();
	const [activeTab, setActiveTab] = (0, import_react.useState)("tracker");
	const [publicUser, setPublicUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [notFound, setNotFound] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!username) return;
		const fetchUser = async () => {
			setLoading(true);
			const { data } = await supabase.from("profiles").select("id, username, display_name, initials, is_public, share_tracker, show_ratings, show_reviews").eq("username", username).maybeSingle();
			if (!data || data.is_public === false) setNotFound(true);
			else setPublicUser(data);
			setLoading(false);
		};
		fetchUser();
	}, [username]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 pt-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center animate-pulse",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-archive-2-line text-white" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-zinc-400",
				children: "Cargando perfil..."
			})]
		})]
	});
	if (notFound) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-zinc-50 dark:bg-zinc-950",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoHead, {
				title: "Perfil no encontrado — Vaultly",
				description: "Este perfil no existe o no está disponible.",
				canonical: `/u/${username}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-16 flex flex-col items-center justify-center min-h-[80vh] text-center px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-16 h-16 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-user-unfollow-line text-3xl text-zinc-400" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-black text-zinc-900 dark:text-white mb-2",
						style: { fontFamily: "'Space Grotesk', sans-serif" },
						children: "Perfil no encontrado"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-zinc-500 mb-6 max-w-xs",
						children: [
							"El usuario ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["@", username] }),
							" no existe o su perfil no es público."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/catalog",
						className: "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-compass-3-line" }), "Explorar catálogo"]
					})
				]
			})
		]
	});
	const displayName = publicUser?.display_name ?? username ?? "";
	const initials = publicUser?.initials ?? displayName.slice(0, 2).toUpperCase();
	const privacy = {
		is_public: publicUser?.is_public ?? false,
		share_tracker: publicUser?.share_tracker ?? false,
		show_ratings: publicUser?.show_ratings ?? false,
		show_reviews: publicUser?.show_reviews ?? false
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-zinc-50 dark:bg-zinc-950",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoHead, {
				title: `${displayName} (@${username}) — Vaultly`,
				description: `Perfil público de ${displayName} en Vaultly. Descubre su lista de seguimiento, estadísticas y reseñas culturales.`,
				canonical: `/u/${username}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-zinc-50 dark:bg-zinc-950 pb-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicProfileHero, {
							username: username ?? "",
							userId: publicUser?.id ?? null,
							displayName,
							initials,
							privacy
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 sticky top-16 z-30 mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-w-screen-xl mx-auto px-4 md:px-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1 overflow-x-auto",
								children: TABS.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setActiveTab(tab.id),
									className: `flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white" : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: tab.icon }), tab.label]
								}, tab.id))
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-screen-xl mx-auto px-4 md:px-8 py-8",
						children: [
							activeTab === "tracker" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicTrackerList, {
								userId: publicUser?.id ?? null,
								privacy
							}),
							activeTab === "stats" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicProfileStats, {
								userId: publicUser?.id ?? null,
								privacy
							}),
							activeTab === "reviews" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicProfileReviews, {
								userId: publicUser?.id ?? null,
								displayName,
								initials,
								privacy
							})
						]
					})
				]
			})
		]
	});
}
//#endregion
export { PublicProfilePage as default };

//# sourceMappingURL=page-siJHSJ_y.js.map