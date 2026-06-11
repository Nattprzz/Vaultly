import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { h as require_react, s as require_jsx_runtime, u as Link } from "./index-cosAM6zi.js";
import { t as Navbar } from "./Navbar-XnbO_Z_a.js";
import { t as useScrollReveal } from "./useScrollReveal-DdeewLgA.js";
import { t as PEOPLE_MOCK } from "./people-vbkXE967.js";
//#region src/pages/entities/components/EntitiesHero.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function EntitiesHero({ search, onSearchChange, totalCount }) {
	const inputRef = (0, import_react.useRef)(null);
	const breadcrumbRef = (0, import_react.useRef)(null);
	const badgeRef = (0, import_react.useRef)(null);
	const titleRef = (0, import_react.useRef)(null);
	const descRef = (0, import_react.useRef)(null);
	const statsRef = (0, import_react.useRef)(null);
	const searchRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const timers = [
			[breadcrumbRef, 0],
			[badgeRef, 80],
			[titleRef, 160],
			[descRef, 240],
			[statsRef, 320],
			[searchRef, 420]
		].map(([ref, delay]) => setTimeout(() => ref.current?.classList.add("sr-visible"), delay));
		return () => timers.forEach(clearTimeout);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden bg-zinc-950 pt-24 pb-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 opacity-10",
				style: {
					backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
					backgroundSize: "40px 40px"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-1/4 w-96 h-96 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative max-w-screen-xl mx-auto px-4 md:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: breadcrumbRef,
						className: "sr-item-up flex items-center gap-2 text-xs text-zinc-500 mb-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-home-4-line" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-zinc-300",
								children: "Entidades"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col lg:flex-row lg:items-end gap-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									ref: badgeRef,
									className: "sr-item flex items-center gap-3 mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 h-10 flex items-center justify-center rounded-xl bg-rose-500/20",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-user-star-line text-rose-400 text-lg" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold text-rose-400 uppercase tracking-widest",
										children: "Directorio"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									ref: titleRef,
									className: "sr-item text-4xl md:text-5xl font-black text-white leading-tight mb-3",
									style: { fontFamily: "'Space Grotesk', sans-serif" },
									children: "Entidades"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									ref: descRef,
									className: "sr-item text-zinc-400 text-base max-w-xl leading-relaxed",
									children: "Directores, actores, autores, estudios y artistas. Explora quién hay detrás de cada obra del catálogo."
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: statsRef,
							className: "sr-item flex items-center gap-6 lg:gap-8",
							children: [
								{
									label: "Total",
									value: totalCount,
									icon: "ri-group-line"
								},
								{
									label: "Tipos",
									value: 6,
									icon: "ri-price-tag-3-line"
								},
								{
									label: "Obras vinculadas",
									value: "200+",
									icon: "ri-film-line"
								}
							].map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-8 h-8 flex items-center justify-center mx-auto mb-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${stat.icon} text-zinc-400 text-lg` })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-2xl font-black text-white",
										style: { fontFamily: "'Space Grotesk', sans-serif" },
										children: stat.value
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-zinc-500",
										children: stat.label
									})
								]
							}, stat.label))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: searchRef,
						className: "sr-item mt-8 max-w-2xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-rose-400/50 focus-within:bg-white/8 transition-all cursor-text",
							onClick: () => inputRef.current?.focus(),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-search-line text-zinc-400 text-lg flex-shrink-0" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: inputRef,
									type: "text",
									value: search,
									onChange: (e) => onSearchChange(e.target.value),
									placeholder: "Buscar por nombre, rol, nacionalidad...",
									className: "flex-1 bg-transparent text-white placeholder-zinc-500 text-sm outline-none"
								}),
								search && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => onSearchChange(""),
									className: "w-5 h-5 flex items-center justify-center rounded-full bg-zinc-600 hover:bg-zinc-500 transition-colors cursor-pointer flex-shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-line text-white text-xs" })
								})
							]
						})
					})
				]
			})
		]
	});
}
//#endregion
//#region src/pages/entities/components/EntitiesFilters.tsx
var TYPE_TABS = [
	{
		id: "all",
		label: "Todos",
		icon: "ri-apps-line",
		color: "text-zinc-500"
	},
	{
		id: "actor",
		label: "Actores",
		icon: "ri-user-smile-line",
		color: "text-amber-500"
	},
	{
		id: "actriz",
		label: "Actrices",
		icon: "ri-user-heart-line",
		color: "text-rose-500"
	},
	{
		id: "director",
		label: "Directores",
		icon: "ri-movie-2-line",
		color: "text-orange-500"
	},
	{
		id: "autor",
		label: "Autores",
		icon: "ri-quill-pen-line",
		color: "text-emerald-500"
	},
	{
		id: "desarrollador",
		label: "Estudios",
		icon: "ri-gamepad-line",
		color: "text-cyan-500"
	},
	{
		id: "publisher",
		label: "Publishers",
		icon: "ri-building-2-line",
		color: "text-violet-500"
	},
	{
		id: "artista",
		label: "Artistas",
		icon: "ri-music-2-line",
		color: "text-pink-500"
	}
];
var SORT_OPTIONS = [
	{
		value: "works_desc",
		label: "Más obras"
	},
	{
		value: "works_asc",
		label: "Menos obras"
	},
	{
		value: "rating_desc",
		label: "Mejor valorado"
	},
	{
		value: "name_asc",
		label: "A → Z"
	},
	{
		value: "name_desc",
		label: "Z → A"
	}
];
function EntitiesFilters({ activeType, onTypeChange, sortBy, onSortChange, viewMode, onViewModeChange, resultCount }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "sticky top-16 z-30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-screen-xl mx-auto px-4 md:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide",
				children: TYPE_TABS.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onTypeChange(tab.id),
					className: `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${activeType === tab.id ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${tab.icon} text-sm ${activeType === tab.id ? "" : tab.color}` }), tab.label]
				}, tab.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between pb-3 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-zinc-400 flex-shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-zinc-700 dark:text-zinc-200",
						children: resultCount
					}), " entidades"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-sort-desc text-zinc-400 text-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: sortBy,
							onChange: (e) => onSortChange(e.target.value),
							className: "text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-transparent border-none outline-none cursor-pointer",
							children: SORT_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: opt.value,
								className: "bg-white dark:bg-zinc-900",
								children: opt.label
							}, opt.value))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onViewModeChange("grid"),
							className: `w-7 h-7 flex items-center justify-center rounded-md transition-all cursor-pointer ${viewMode === "grid" ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-grid-line text-sm" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onViewModeChange("list"),
							className: `w-7 h-7 flex items-center justify-center rounded-md transition-all cursor-pointer ${viewMode === "list" ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-list-check text-sm" })
						})]
					})]
				})]
			})]
		})
	});
}
//#endregion
//#region src/pages/entities/components/EntitiesGrid.tsx
var ROLE_COLORS = {
	actor: {
		bg: "bg-amber-100 dark:bg-amber-900/30",
		text: "text-amber-700 dark:text-amber-400",
		icon: "ri-user-smile-line",
		stroke: "#f59e0b"
	},
	actriz: {
		bg: "bg-rose-100 dark:bg-rose-900/30",
		text: "text-rose-700 dark:text-rose-400",
		icon: "ri-user-heart-line",
		stroke: "#f43f5e"
	},
	"actor/actriz": {
		bg: "bg-rose-100 dark:bg-rose-900/30",
		text: "text-rose-700 dark:text-rose-400",
		icon: "ri-user-heart-line",
		stroke: "#f43f5e"
	},
	director: {
		bg: "bg-orange-100 dark:bg-orange-900/30",
		text: "text-orange-700 dark:text-orange-400",
		icon: "ri-movie-2-line",
		stroke: "#f97316"
	},
	autor: {
		bg: "bg-emerald-100 dark:bg-emerald-900/30",
		text: "text-emerald-700 dark:text-emerald-400",
		icon: "ri-quill-pen-line",
		stroke: "#10b981"
	},
	desarrollador: {
		bg: "bg-cyan-100 dark:bg-cyan-900/30",
		text: "text-cyan-700 dark:text-cyan-400",
		icon: "ri-gamepad-line",
		stroke: "#06b6d4"
	},
	publisher: {
		bg: "bg-violet-100 dark:bg-violet-900/30",
		text: "text-violet-700 dark:text-violet-400",
		icon: "ri-building-2-line",
		stroke: "#8b5cf6"
	},
	artista: {
		bg: "bg-pink-100 dark:bg-pink-900/30",
		text: "text-pink-700 dark:text-pink-400",
		icon: "ri-music-2-line",
		stroke: "#ec4899"
	}
};
function getRoleStyle(role) {
	return ROLE_COLORS[role.toLowerCase()] ?? {
		bg: "bg-zinc-100 dark:bg-zinc-800",
		text: "text-zinc-600 dark:text-zinc-400",
		icon: "ri-user-line",
		stroke: "#71717a"
	};
}
function getAvgRating$1(works) {
	if (!works.length) return null;
	return works.reduce((s, w) => s + w.rating, 0) / works.length;
}
function getBestWork(works) {
	if (!works.length) return null;
	return works.reduce((best, w) => w.rating > best.rating ? w : best, works[0]);
}
function RatingSparkline({ works, stroke, width = 120, height = 36, compact = false }) {
	const [tooltip, setTooltip] = (0, import_react.useState)(null);
	if (works.length < 2) {
		if (works.length === 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-2 h-2 rounded-full flex-shrink-0",
					style: { backgroundColor: stroke }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-semibold",
					style: { color: stroke },
					children: works[0].rating.toFixed(1)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-zinc-400",
					children: works[0].year
				})
			]
		});
		return null;
	}
	const sorted = [...works].sort((a, b) => a.year - b.year);
	const ratings = sorted.map((w) => w.rating);
	const minR = Math.min(...ratings);
	const maxR = Math.max(...ratings);
	const range = maxR - minR || 1;
	const pad = compact ? 4 : 6;
	const innerW = width - pad * 2;
	const innerH = height - pad * 2;
	const toX = (i) => pad + i / (sorted.length - 1) * innerW;
	const toY = (r) => pad + innerH - (r - minR) / range * innerH;
	const points = sorted.map((w, i) => ({
		x: toX(i),
		y: toY(w.rating),
		work: w
	}));
	const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
	const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${height.toFixed(1)} L ${points[0].x.toFixed(1)} ${height.toFixed(1)} Z`;
	const maxIdx = ratings.indexOf(maxR);
	const minIdx = ratings.indexOf(minR);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative select-none",
		style: {
			width,
			height
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			width,
			height,
			viewBox: `0 0 ${width} ${height}`,
			className: "overflow-visible",
			onMouseLeave: () => setTooltip(null),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: `grad-${stroke.replace("#", "")}`,
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: stroke,
						stopOpacity: "0.18"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: stroke,
						stopOpacity: "0.02"
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: areaD,
					fill: `url(#grad-${stroke.replace("#", "")})`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: pathD,
					fill: "none",
					stroke,
					strokeWidth: compact ? 1.5 : 2,
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: points[maxIdx].x,
					cy: points[maxIdx].y,
					r: compact ? 2.5 : 3.5,
					fill: stroke,
					stroke: "white",
					strokeWidth: 1.5
				}),
				minIdx !== maxIdx && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: points[minIdx].x,
					cy: points[minIdx].y,
					r: compact ? 2 : 2.5,
					fill: "white",
					stroke,
					strokeWidth: 1.5
				}),
				points.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: p.x,
					cy: p.y,
					r: compact ? 6 : 8,
					fill: "transparent",
					className: "cursor-crosshair",
					onMouseEnter: () => setTooltip({
						x: p.x,
						y: p.y,
						label: `${p.work.title} (${p.work.year})\n${p.work.rating.toFixed(1)}`
					})
				}, i))
			]
		}), tooltip && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute z-50 pointer-events-none",
			style: {
				left: tooltip.x,
				top: tooltip.y - (compact ? 36 : 44),
				transform: "translateX(-50%)"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-zinc-900 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg",
				children: tooltip.label.split("\n").map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: i === 1 ? "font-bold text-center" : "text-zinc-300 text-center",
					children: line
				}, i))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-2 bg-zinc-900 rotate-45 mx-auto -mt-1" })]
		})]
	});
}
function SparklineSection({ works, stroke, compact = false }) {
	if (works.length < 2) return null;
	const sorted = [...works].sort((a, b) => a.year - b.year);
	const ratings = sorted.map((w) => w.rating);
	const minR = Math.min(...ratings);
	const maxR = Math.max(...ratings);
	const trend = ratings[ratings.length - 1] - ratings[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex flex-col gap-1 ${compact ? "" : "pt-2 border-t border-zinc-100 dark:border-zinc-800"}`,
		children: [!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-zinc-400 font-medium",
				children: "Evolución de ratings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1",
				children: trend > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-semibold text-emerald-500 flex items-center gap-0.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-up-line text-xs" }),
						"+",
						trend.toFixed(1)
					]
				}) : trend < 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-semibold text-rose-500 flex items-center gap-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-down-line text-xs" }), trend.toFixed(1)]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-semibold text-zinc-400",
					children: "—"
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-end gap-0.5 flex-shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold leading-none",
						style: { color: stroke },
						children: maxR.toFixed(1)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-zinc-400 leading-none",
						children: minR.toFixed(1)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RatingSparkline, {
					works,
					stroke,
					width: compact ? 80 : 110,
					height: compact ? 28 : 36,
					compact
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-0.5 flex-shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-zinc-400 leading-none",
						children: sorted[0].year
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-zinc-400 leading-none",
						children: sorted[sorted.length - 1].year
					})]
				})
			]
		})]
	});
}
function EntityGridCard({ entity }) {
	const roleStyle = getRoleStyle(entity.role);
	const avgRating = getAvgRating$1(entity.works);
	const bestWork = getBestWork(entity.works);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: `/person/${entity.id}`,
		className: "group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300 cursor-pointer flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-52 overflow-hidden bg-zinc-100 dark:bg-zinc-800",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: entity.photo,
						alt: entity.name,
						className: "w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${roleStyle.bg} ${roleStyle.text}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${roleStyle.icon} text-xs` }), entity.role]
					}),
					avgRating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-xs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white text-xs font-bold",
							children: avgRating.toFixed(1)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute bottom-3 left-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-film-line text-zinc-300 text-xs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-white text-xs font-semibold",
								children: [entity.works.length, " obras"]
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 flex-1 flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-zinc-900 dark:text-white text-sm leading-tight group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-1",
						style: { fontFamily: "'Space Grotesk', sans-serif" },
						children: entity.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-zinc-500 mt-0.5",
						children: [
							entity.nationality,
							" · ",
							entity.birthYear
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1",
						children: entity.known_for.slice(0, 2).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full truncate max-w-[120px]",
							children: k
						}, k))
					}),
					entity.works.length >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SparklineSection, {
						works: entity.works,
						stroke: roleStyle.stroke
					}),
					entity.works.length < 2 && bestWork && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-7 h-9 rounded overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-800",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: bestWork.cover,
									alt: bestWork.title,
									className: "w-full h-full object-cover object-top"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-zinc-400",
									children: "Mejor obra"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300 truncate",
									children: bestWork.title
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-auto flex items-center gap-0.5 flex-shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-xs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-zinc-700 dark:text-zinc-300",
									children: bestWork.rating
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-line text-xs" })
			})
		]
	});
}
function EntityListRow({ entity }) {
	const roleStyle = getRoleStyle(entity.role);
	const avgRating = getAvgRating$1(entity.works);
	const bestWork = getBestWork(entity.works);
	const ratingPct = avgRating ? avgRating / 10 * 100 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: `/person/${entity.id}`,
		className: "group flex items-center gap-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 p-4 transition-all duration-200 cursor-pointer",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-800",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: entity.photo,
					alt: entity.name,
					className: "w-full h-full object-cover object-top"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-zinc-900 dark:text-white text-sm group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors",
							style: { fontFamily: "'Space Grotesk', sans-serif" },
							children: entity.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${roleStyle.bg} ${roleStyle.text}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${roleStyle.icon} text-xs` }), entity.role]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-zinc-500 mt-0.5",
						children: [
							entity.nationality,
							" · Desde ",
							entity.birthYear
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1 mt-1.5",
						children: entity.known_for.slice(0, 3).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded-md",
							children: k
						}, k))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden sm:flex flex-col items-center gap-1 flex-shrink-0 w-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xl font-black text-zinc-900 dark:text-white",
					style: { fontFamily: "'Space Grotesk', sans-serif" },
					children: entity.works.length
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-zinc-400",
					children: "obras"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden md:flex flex-col items-center gap-1.5 flex-shrink-0 w-20",
				children: avgRating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-bold text-zinc-900 dark:text-white",
						children: avgRating.toFixed(1)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-amber-400 rounded-full transition-all",
						style: { width: `${ratingPct}%` }
					})
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-zinc-400",
					children: "—"
				})
			}),
			entity.works.length >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden lg:flex flex-col items-center gap-1 flex-shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-zinc-400 mb-0.5",
					children: "Evolución"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SparklineSection, {
					works: entity.works,
					stroke: roleStyle.stroke,
					compact: true
				})]
			}),
			bestWork && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden xl:flex items-center gap-2 flex-shrink-0 w-40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-8 h-10 rounded overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-800",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: bestWork.cover,
						alt: bestWork.title,
						className: "w-full h-full object-cover object-top"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-zinc-400",
							children: "Mejor obra"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300 truncate",
							children: bestWork.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-0.5 mt-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-xs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-zinc-600 dark:text-zinc-400",
								children: bestWork.rating
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-7 h-7 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-900 dark:group-hover:bg-white text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-900 transition-all duration-200 flex-shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-line text-xs" })
			})
		]
	});
}
function EntitiesGrid({ entities, viewMode }) {
	const containerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const container = containerRef.current;
		if (!container) return;
		const items = Array.from(container.querySelectorAll(".entity-reveal"));
		items.forEach((el) => {
			el.style.opacity = "0";
			el.style.transform = "translateY(20px)";
			el.style.transition = "opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1)";
		});
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const el = entry.target;
					const idx = items.indexOf(el);
					setTimeout(() => {
						el.style.opacity = "1";
						el.style.transform = "none";
					}, Math.min(idx * 40, 600));
					observer.unobserve(el);
				}
			});
		}, {
			rootMargin: "0px 0px -30px 0px",
			threshold: .05
		});
		items.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, [entities, viewMode]);
	if (entities.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-16 h-16 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-user-search-line text-2xl text-zinc-400" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg font-bold text-zinc-900 dark:text-white mb-2",
				style: { fontFamily: "'Space Grotesk', sans-serif" },
				children: "Sin resultados"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-zinc-500 max-w-xs",
				children: "No hay entidades que coincidan con los filtros seleccionados. Prueba con otros criterios."
			})
		]
	});
	if (viewMode === "list") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: containerRef,
		className: "flex flex-col gap-2",
		children: entities.map((entity) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "entity-reveal",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntityListRow, { entity })
		}, entity.id))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: containerRef,
		className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4",
		children: entities.map((entity) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "entity-reveal",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntityGridCard, { entity })
		}, entity.id))
	});
}
//#endregion
//#region src/pages/entities/page.tsx
var ALL_ENTITIES = Object.values(PEOPLE_MOCK);
function matchesType(person, type) {
	if (type === "all") return true;
	return person.role.toLowerCase().includes(type);
}
function matchesSearch(person, query) {
	if (!query.trim()) return true;
	const q = query.toLowerCase();
	return person.name.toLowerCase().includes(q) || person.role.toLowerCase().includes(q) || person.nationality.toLowerCase().includes(q) || person.known_for.some((k) => k.toLowerCase().includes(q)) || person.works.some((w) => w.title.toLowerCase().includes(q));
}
function getAvgRating(works) {
	if (!works.length) return 0;
	return works.reduce((s, w) => s + w.rating, 0) / works.length;
}
function sortEntities(entities, sortBy) {
	return [...entities].sort((a, b) => {
		switch (sortBy) {
			case "works_desc": return b.works.length - a.works.length;
			case "works_asc": return a.works.length - b.works.length;
			case "rating_desc": return getAvgRating(b.works) - getAvgRating(a.works);
			case "name_asc": return a.name.localeCompare(b.name);
			case "name_desc": return b.name.localeCompare(a.name);
			default: return 0;
		}
	});
}
function getTypeStats(entities) {
	const counts = {};
	entities.forEach((e) => {
		const key = e.role.toLowerCase();
		counts[key] = (counts[key] ?? 0) + 1;
	});
	return counts;
}
var TYPE_LABELS = {
	actor: {
		label: "Actores",
		icon: "ri-user-smile-line",
		color: "text-amber-500"
	},
	actriz: {
		label: "Actrices",
		icon: "ri-user-heart-line",
		color: "text-rose-500"
	},
	"actor/actriz": {
		label: "Actor/Actriz",
		icon: "ri-user-heart-line",
		color: "text-rose-500"
	},
	director: {
		label: "Directores",
		icon: "ri-movie-2-line",
		color: "text-orange-500"
	},
	autor: {
		label: "Autores",
		icon: "ri-quill-pen-line",
		color: "text-emerald-500"
	},
	desarrollador: {
		label: "Estudios",
		icon: "ri-gamepad-line",
		color: "text-cyan-500"
	},
	publisher: {
		label: "Publishers",
		icon: "ri-building-2-line",
		color: "text-violet-500"
	},
	artista: {
		label: "Artistas",
		icon: "ri-music-2-line",
		color: "text-pink-500"
	}
};
function EntitiesPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const [activeType, setActiveType] = (0, import_react.useState)("all");
	const [sortBy, setSortBy] = (0, import_react.useState)("works_desc");
	const [viewMode, setViewMode] = (0, import_react.useState)("grid");
	const [showAll, setShowAll] = (0, import_react.useState)(false);
	const sidebarTypeRef = useScrollReveal();
	const sidebarTopRef = useScrollReveal({ rootMargin: "0px 0px -20px 0px" });
	const sidebarStatsRef = useScrollReveal({ rootMargin: "0px 0px -20px 0px" });
	const PAGE_SIZE = 24;
	const filtered = (0, import_react.useMemo)(() => {
		return sortEntities(ALL_ENTITIES.filter((e) => matchesType(e, activeType) && matchesSearch(e, search)), sortBy);
	}, [
		search,
		activeType,
		sortBy
	]);
	const displayed = showAll ? filtered : filtered.slice(0, PAGE_SIZE);
	const typeStats = (0, import_react.useMemo)(() => getTypeStats(ALL_ENTITIES), []);
	const topEntity = (0, import_react.useMemo)(() => [...ALL_ENTITIES].sort((a, b) => b.works.length - a.works.length)[0], []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-zinc-50 dark:bg-zinc-950",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntitiesHero, {
				search,
				onSearchChange: (v) => {
					setSearch(v);
					setShowAll(false);
				},
				totalCount: ALL_ENTITIES.length
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntitiesFilters, {
				activeType,
				onTypeChange: (t) => {
					setActiveType(t);
					setShowAll(false);
				},
				sortBy,
				onSortChange: (s) => {
					setSortBy(s);
					setShowAll(false);
				},
				viewMode,
				onViewModeChange: setViewMode,
				resultCount: filtered.length
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-w-screen-xl mx-auto px-4 md:px-6 py-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntitiesGrid, {
							entities: displayed,
							viewMode
						}), !showAll && filtered.length > PAGE_SIZE && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setShowAll(true),
								className: "flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-add-line" }),
									"Ver ",
									filtered.length - PAGE_SIZE,
									" más"
								]
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "hidden xl:flex flex-col gap-5 w-64 flex-shrink-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								ref: sidebarTypeRef,
								className: "sr-item bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-bold text-zinc-900 dark:text-white mb-4",
									style: { fontFamily: "'Space Grotesk', sans-serif" },
									children: "Por tipo"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-col gap-2.5",
									children: Object.entries(typeStats).sort(([, a], [, b]) => b - a).map(([type, count]) => {
										const meta = TYPE_LABELS[type];
										if (!meta) return null;
										const pct = Math.round(count / ALL_ENTITIES.length * 100);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setActiveType(type),
											className: "w-full text-left cursor-pointer group",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between mb-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${meta.icon} text-xs ${meta.color}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors",
														children: meta.label
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-bold text-zinc-500",
													children: count
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-full rounded-full transition-all duration-500",
													style: {
														width: `${pct}%`,
														background: "linear-gradient(90deg, #f43f5e, #fb923c)"
													}
												})
											})]
										}, type);
									})
								})]
							}),
							topEntity && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								ref: sidebarTopRef,
								className: "sr-item bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative h-28 overflow-hidden",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: topEntity.backdrop,
											alt: topEntity.name,
											className: "w-full h-full object-cover object-top"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute bottom-2 left-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs font-semibold text-amber-400 flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-trophy-line" }), " Más prolífico"]
											})
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 h-10 rounded-xl overflow-hidden flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: topEntity.photo,
											alt: topEntity.name,
											className: "w-full h-full object-cover object-top"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-bold text-zinc-900 dark:text-white truncate",
											style: { fontFamily: "'Space Grotesk', sans-serif" },
											children: topEntity.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-zinc-500",
											children: [topEntity.works.length, " obras en catálogo"]
										})]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								ref: sidebarStatsRef,
								className: "sr-item bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-bold text-zinc-900 dark:text-white mb-4",
									style: { fontFamily: "'Space Grotesk', sans-serif" },
									children: "Estadísticas"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-col gap-3",
									children: [
										{
											label: "Rating medio global",
											value: (ALL_ENTITIES.flatMap((e) => e.works).reduce((s, w) => s + w.rating, 0) / ALL_ENTITIES.flatMap((e) => e.works).length).toFixed(1),
											icon: "ri-star-line",
											color: "text-amber-500"
										},
										{
											label: "Obras totales",
											value: ALL_ENTITIES.flatMap((e) => e.works).length,
											icon: "ri-film-line",
											color: "text-rose-500"
										},
										{
											label: "Entidades activas",
											value: ALL_ENTITIES.length,
											icon: "ri-group-line",
											color: "text-cyan-500"
										}
									].map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${stat.icon} text-sm ${stat.color}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-zinc-500",
												children: stat.label
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-bold text-zinc-900 dark:text-white",
											children: stat.value
										})]
									}, stat.label))
								})]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { EntitiesPage as default };

//# sourceMappingURL=page-BMU_KxHw.js.map