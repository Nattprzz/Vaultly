import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { c as useAuth, f as useNavigate, h as require_react, p as useParams, s as require_jsx_runtime, t as useCategories, u as Link } from "./index-cosAM6zi.js";
import { t as SeoHead } from "./SeoHead-SAtaEFdZ.js";
import { n as useSettings } from "./useSettings-CZ1Tg8p7.js";
import { a as useTracker, t as Navbar } from "./Navbar-XnbO_Z_a.js";
import { t as AddToTrackerModal } from "./AddToTrackerModal-YBJNjXj-.js";
import { t as useScrollReveal } from "./useScrollReveal-DdeewLgA.js";
import { n as isAppCategory } from "./categories-By_tfbgx.js";
//#region src/pages/tracker/components/TrackerHeader.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function TrackerHeader({ entries }) {
	const { profile, user } = useAuth();
	const all = Object.values(entries);
	const completed = all.filter((e) => e.status === "completed").length;
	const inProgress = all.filter((e) => e.status === "in_progress").length;
	const pending = all.filter((e) => e.status === "pending").length;
	const rated = all.filter((e) => e.rating !== null);
	const avgRating = rated.length > 0 ? (rated.reduce((s, e) => s + (e.rating ?? 0), 0) / rated.length).toFixed(1) : "—";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-zinc-500 dark:text-zinc-400 mb-1",
					children: "Tu vault personal"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl md:text-4xl font-black text-zinc-900 dark:text-white",
					style: { fontFamily: "'Space Grotesk', sans-serif" },
					children: "Mi Tracker"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-zinc-500 dark:text-zinc-400 mt-1.5",
					children: [
						"@",
						profile?.username ?? user?.email?.split("@")[0] ?? "usuario",
						" · ",
						all.length,
						" ítems en total"
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/catalog",
				className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap self-start md:self-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-add-line" }), "Añadir contenido"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
			children: [
				{
					label: "Completados",
					value: completed,
					icon: "ri-checkbox-circle-line",
					color: "text-emerald-500",
					bg: "bg-emerald-50 dark:bg-emerald-950/30"
				},
				{
					label: "En progreso",
					value: inProgress,
					icon: "ri-loader-4-line",
					color: "text-amber-500",
					bg: "bg-amber-50 dark:bg-amber-950/30"
				},
				{
					label: "Pendientes",
					value: pending,
					icon: "ri-bookmark-line",
					color: "text-zinc-500",
					bg: "bg-zinc-100 dark:bg-zinc-800/50"
				},
				{
					label: "Puntuación media",
					value: avgRating,
					icon: "ri-star-line",
					color: "text-amber-400",
					bg: "bg-amber-50 dark:bg-amber-950/30"
				}
			].map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `flex items-center gap-3 px-4 py-3 rounded-xl ${stat.bg}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${stat.icon} text-xl ${stat.color}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg font-black text-zinc-900 dark:text-white leading-none",
					style: { fontFamily: "'Space Grotesk', sans-serif" },
					children: stat.value
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-zinc-500 dark:text-zinc-400 mt-0.5",
					children: stat.label
				})] })]
			}, stat.label))
		})]
	});
}
//#endregion
//#region src/pages/tracker/components/CategoryTabs.tsx
function CategoryTabs({ activeCategory, onSelect, entries, activeCategories }) {
	const CATEGORIES = useCategories();
	const allEntries = Object.values(entries);
	const getCount = (catId) => catId === "all" ? allEntries.length : allEntries.filter((e) => e.category === catId).length;
	const visibleCats = CATEGORIES.filter((c) => activeCategories.includes(c.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 flex-wrap mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => onSelect("all"),
			className: `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${activeCategory === "all" ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-apps-line text-sm" }),
				"Todo",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `text-xs px-1.5 py-0.5 rounded-full font-semibold ${activeCategory === "all" ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"}`,
					children: getCount("all")
				})
			]
		}), visibleCats.map((cat) => {
			const count = getCount(cat.id);
			const isActive = activeCategory === cat.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => onSelect(cat.id),
				className: `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${isActive ? "text-white" : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"}`,
				style: isActive ? { background: cat.accent } : {},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${cat.icon} text-sm` }),
					cat.label,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `text-xs px-1.5 py-0.5 rounded-full font-semibold ${isActive ? "bg-white/25 text-white" : "bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"}`,
						children: count
					})
				]
			}, cat.id);
		})]
	});
}
//#endregion
//#region src/pages/tracker/components/StatusFilters.tsx
var STATUS_OPTIONS = [
	{
		value: "all",
		label: "Todos",
		icon: "ri-list-check"
	},
	{
		value: "in_progress",
		label: "En progreso",
		icon: "ri-loader-4-line"
	},
	{
		value: "pending",
		label: "Pendientes",
		icon: "ri-bookmark-line"
	},
	{
		value: "completed",
		label: "Completados",
		icon: "ri-checkbox-circle-line"
	},
	{
		value: "dropped",
		label: "Abandonados",
		icon: "ri-close-circle-line"
	}
];
var STATUS_ACTIVE_STYLES = {
	all: "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900",
	in_progress: "bg-amber-500 text-white",
	pending: "bg-zinc-500 text-white",
	completed: "bg-emerald-500 text-white",
	dropped: "bg-rose-500 text-white"
};
function StatusFilters({ activeStatus, onStatusChange, sortBy, onSortChange, viewMode, onViewModeChange, counts }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-2 flex-wrap",
			children: STATUS_OPTIONS.map((opt) => {
				const isActive = activeStatus === opt.value;
				const count = counts[opt.value] ?? 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onStatusChange(opt.value),
					className: `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${isActive ? STATUS_ACTIVE_STYLES[opt.value] : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: opt.icon }),
						opt.label,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `${isActive ? "opacity-70" : "text-zinc-400"}`,
							children: [
								"(",
								count,
								")"
							]
						})
					]
				}, opt.value);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 flex-shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: sortBy,
				onChange: (e) => onSortChange(e.target.value),
				className: "text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "updated",
						children: "Última actualización"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "added",
						children: "Fecha añadido"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "rating",
						children: "Puntuación"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "title",
						children: "Título A-Z"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => onViewModeChange("grid"),
					className: `w-8 h-8 flex items-center justify-center transition-colors cursor-pointer ${viewMode === "grid" ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "bg-white dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-700"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-grid-line text-sm" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => onViewModeChange("list"),
					className: `w-8 h-8 flex items-center justify-center transition-colors cursor-pointer ${viewMode === "list" ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "bg-white dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-700"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-list-unordered text-sm" })
				})]
			})]
		})]
	});
}
//#endregion
//#region src/pages/tracker/components/TrackerGrid.tsx
var STATUS_BADGE$1 = {
	pending: {
		label: "Pendiente",
		cls: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
	},
	in_progress: {
		label: "En progreso",
		cls: "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
	},
	completed: {
		label: "Completado",
		cls: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
	},
	dropped: {
		label: "Abandonado",
		cls: "bg-rose-100 dark:bg-rose-950/40 text-rose-500"
	}
};
function TrackerGrid({ enriched }) {
	const { getEntry, addOrUpdate, remove } = useTracker();
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
		children: enriched.map((item) => {
			const badge = STATUS_BADGE$1[item.status];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "group relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: `/catalog/${item.category}/${item.itemId}`,
						className: "block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mb-2.5 aspect-[2/3] overflow-hidden rounded-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: item.cover,
									alt: item.title,
									className: "h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute left-2 top-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded-full px-2 py-0.5 text-xs font-semibold ${badge.cls}`,
										children: badge.label
									})
								}),
								item.rating !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 backdrop-blur-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-xs text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold text-white",
										children: item.rating
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute right-2 top-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-6 w-6 items-center justify-center rounded-lg backdrop-blur-sm",
										style: { background: `${item.catAccent}30` },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
											className: `${item.catIcon} text-xs`,
											style: { color: item.catAccent }
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: (e) => {
											e.preventDefault();
											setEditItem(item);
										},
										className: "rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-zinc-900",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-edit-line mr-1" }), "Editar"]
									})
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-0.5 line-clamp-2 text-xs font-semibold leading-tight text-zinc-900 dark:text-white",
						children: item.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-zinc-400",
						children: [
							item.year,
							" · ",
							item.genre
						]
					})
				]
			}, item.itemId);
		})
	}), editItem && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddToTrackerModal, {
		itemId: editItem.itemId,
		category: editItem.category,
		title: editItem.title,
		cover: editItem.cover,
		existing: getEntry(editItem.itemId),
		onSave: (status, rating, review) => addOrUpdate(editItem.itemId, editItem.category, status, rating, review),
		onRemove: () => remove(editItem.itemId),
		onClose: () => setEditItem(null)
	})] });
}
//#endregion
//#region src/pages/tracker/components/trackerEntryUtils.ts
function enrichEntries(entries, categories) {
	return Object.values(entries).map((entry) => {
		const cat = categories.find((c) => c.id === entry.category);
		return {
			...entry,
			title: entry.title || entry.itemId.replace(/-/g, " "),
			cover: entry.cover,
			year: entry.year,
			genre: entry.genre,
			catAccent: cat?.accent ?? "#8b5cf6",
			catIcon: cat?.icon ?? "ri-star-line",
			catLabel: cat?.label ?? entry.category
		};
	});
}
//#endregion
//#region src/pages/tracker/components/TrackerList.tsx
var STATUS_BADGE = {
	pending: {
		label: "Pendiente",
		cls: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500",
		dot: "bg-zinc-400"
	},
	in_progress: {
		label: "En progreso",
		cls: "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
		dot: "bg-amber-400"
	},
	completed: {
		label: "Completado",
		cls: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
		dot: "bg-emerald-400"
	},
	dropped: {
		label: "Abandonado",
		cls: "bg-rose-100 dark:bg-rose-950/40 text-rose-500",
		dot: "bg-rose-400"
	}
};
function TrackerList({ enriched }) {
	const { getEntry, addOrUpdate, remove } = useTracker();
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-2",
		children: enriched.map((item) => {
			const badge = STATUS_BADGE[item.status];
			const updatedDate = new Date(item.updatedAt).toLocaleDateString("es-ES", {
				day: "numeric",
				month: "short",
				year: "numeric"
			});
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "group flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: `/catalog/${item.category}/${item.itemId}`,
						className: "flex-shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-16 rounded-lg overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: item.cover,
								alt: item.title,
								className: "w-full h-full object-cover object-top"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-start gap-2 mb-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: `/catalog/${item.category}/${item.itemId}`,
									className: "cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm font-semibold text-zinc-900 dark:text-white leading-tight hover:text-violet-600 dark:hover:text-violet-400 transition-colors line-clamp-1",
										children: item.title
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
										style: {
											background: `${item.catAccent}15`,
											color: item.catAccent
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${item.catIcon} text-xs` }), item.catLabel]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-400",
										children: item.year
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-400",
										children: "·"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-400",
										children: item.genre
									})
								]
							}),
							item.review && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 line-clamp-1 italic",
								children: [
									"“",
									item.review,
									"”"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-shrink-0 hidden sm:flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-1.5 h-1.5 rounded-full ${badge.dot}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-xs px-2.5 py-1 rounded-full font-medium ${badge.cls}`,
							children: badge.label
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-shrink-0 hidden md:flex items-center gap-1 w-16 justify-center",
						children: item.rating !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-sm" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold text-zinc-900 dark:text-white",
								children: item.rating
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-zinc-400",
								children: "/10"
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-zinc-300 dark:text-zinc-600",
							children: "—"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-shrink-0 hidden lg:block text-xs text-zinc-400 w-24 text-right",
						children: updatedDate
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setEditItem(item),
						className: "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer opacity-0 group-hover:opacity-100",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-edit-line text-sm" })
					})
				]
			}, item.itemId);
		})
	}), editItem && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddToTrackerModal, {
		itemId: editItem.itemId,
		category: editItem.category,
		title: editItem.title,
		cover: editItem.cover,
		existing: getEntry(editItem.itemId),
		onSave: (status, rating, review) => addOrUpdate(editItem.itemId, editItem.category, status, rating, review),
		onRemove: () => remove(editItem.itemId),
		onClose: () => setEditItem(null)
	})] });
}
//#endregion
//#region src/pages/tracker/components/TrackerEmpty.tsx
function TrackerEmpty({ category, statusFilter }) {
	const cat = useCategories().find((c) => c.id === category);
	const isFiltered = statusFilter !== "all";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-16 h-16 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${cat?.icon ?? "ri-inbox-line"} text-2xl text-zinc-400` })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg font-bold text-zinc-900 dark:text-white mb-2",
				children: isFiltered ? "Sin resultados para este filtro" : `Tu tracker de ${cat?.label ?? "contenido"} está vacío`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mb-6",
				children: isFiltered ? "Prueba a cambiar el filtro de estado para ver más ítems." : `Explora el catálogo y añade ${cat?.label?.toLowerCase() ?? "contenido"} a tu tracker.`
			}),
			!isFiltered && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: `/catalog/${category !== "all" ? category : ""}`,
				className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-compass-3-line" }), "Explorar catálogo"]
			})
		]
	});
}
//#endregion
//#region src/pages/tracker/page.tsx
function sortEntries(items, sortBy) {
	return [...items].sort((a, b) => {
		switch (sortBy) {
			case "updated": return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
			case "added": return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
			case "rating": return (b.rating ?? -1) - (a.rating ?? -1);
			case "title": return a.title.localeCompare(b.title, "es");
			default: return 0;
		}
	});
}
function TrackerPage() {
	const { isLoggedIn, profile } = useAuth();
	const { settings } = useSettings();
	const navigate = useNavigate();
	const { category: paramCategory } = useParams();
	const { entries, loading } = useTracker();
	const CATEGORIES = useCategories();
	const [activeCategory, setActiveCategory] = (0, import_react.useState)(paramCategory ?? "all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [sortBy, setSortBy] = (0, import_react.useState)("updated");
	const [viewMode, setViewMode] = (0, import_react.useState)("grid");
	const headerRef = useScrollReveal({ rootMargin: "0px" });
	const tabsRef = useScrollReveal({ rootMargin: "0px" });
	const filtersRef = useScrollReveal({ rootMargin: "0px" });
	const gridRef = useScrollReveal();
	(0, import_react.useEffect)(() => {
		if (!isLoggedIn) navigate("/");
	}, [isLoggedIn, navigate]);
	const activeCategories = (0, import_react.useMemo)(() => CATEGORIES.filter((category) => settings.activeCategories.includes(category.id)).map((category) => category.id), [settings.activeCategories, CATEGORIES]);
	(0, import_react.useEffect)(() => {
		if (!paramCategory) {
			setActiveCategory("all");
			return;
		}
		if (isAppCategory(paramCategory) && activeCategories.includes(paramCategory)) {
			setActiveCategory(paramCategory);
			return;
		}
		navigate("/tracker", { replace: true });
	}, [
		activeCategories,
		navigate,
		paramCategory
	]);
	const handleCategorySelect = (id) => {
		setActiveCategory(id);
		setStatusFilter("all");
		if (id === "all") navigate("/tracker");
		else navigate(`/tracker/${id}`);
	};
	const allEnriched = (0, import_react.useMemo)(() => enrichEntries(entries, CATEGORIES).filter((entry) => activeCategories.includes(entry.category)), [
		activeCategories,
		entries,
		CATEGORIES
	]);
	const byCat = (0, import_react.useMemo)(() => activeCategory === "all" ? allEnriched : allEnriched.filter((e) => e.category === activeCategory), [allEnriched, activeCategory]);
	const statusCounts = (0, import_react.useMemo)(() => ({
		all: byCat.length,
		in_progress: byCat.filter((e) => e.status === "in_progress").length,
		pending: byCat.filter((e) => e.status === "pending").length,
		completed: byCat.filter((e) => e.status === "completed").length,
		dropped: byCat.filter((e) => e.status === "dropped").length
	}), [byCat]);
	const filtered = (0, import_react.useMemo)(() => statusFilter === "all" ? byCat : byCat.filter((e) => e.status === statusFilter), [byCat, statusFilter]);
	const sorted = (0, import_react.useMemo)(() => sortEntries(filtered, sortBy), [filtered, sortBy]);
	if (!isLoggedIn) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-zinc-50 dark:bg-zinc-950",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoHead, {
				title: "Mi Tracker — Vaultly",
				description: "Gestiona tu lista de seguimiento personal en Vaultly.",
				canonical: "/tracker",
				noIndex: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "pt-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-screen-xl mx-auto px-4 md:px-6 py-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: headerRef,
							className: "sr-item",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackerHeader, { entries })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: tabsRef,
							className: "sr-item",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryTabs, {
								activeCategory,
								onSelect: handleCategorySelect,
								entries,
								activeCategories
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: filtersRef,
							className: "sr-item",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusFilters, {
								activeStatus: statusFilter,
								onStatusChange: setStatusFilter,
								sortBy,
								onSortChange: setSortBy,
								viewMode,
								onViewModeChange: setViewMode,
								counts: statusCounts
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: gridRef,
							className: "sr-item",
							children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-center py-24",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-loader-4-line text-3xl text-zinc-400 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-zinc-400",
										children: "Cargando tu tracker..."
									})]
								})
							}) : sorted.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackerEmpty, {
								category: activeCategory,
								statusFilter
							}) : viewMode === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackerGrid, { enriched: sorted }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackerList, { enriched: sorted })
						})
					]
				})
			})
		]
	});
}
//#endregion
export { TrackerPage as default };

//# sourceMappingURL=page-Brgt8zg5.js.map