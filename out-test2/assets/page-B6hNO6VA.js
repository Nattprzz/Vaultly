import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { h as require_react, m as useSearchParams, s as require_jsx_runtime, u as Link } from "./index-cosAM6zi.js";
import { t as Navbar } from "./Navbar-XnbO_Z_a.js";
import { t as PEOPLE_MOCK } from "./people-vbkXE967.js";
//#region src/pages/compare/components/CompareSelector.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var ALL_ENTITIES = Object.values(PEOPLE_MOCK);
var ROLE_COLORS = {
	actor: {
		bg: "bg-amber-100",
		text: "text-amber-700",
		icon: "ri-user-smile-line"
	},
	actriz: {
		bg: "bg-rose-100",
		text: "text-rose-700",
		icon: "ri-user-heart-line"
	},
	"actor/actriz": {
		bg: "bg-rose-100",
		text: "text-rose-700",
		icon: "ri-user-heart-line"
	},
	director: {
		bg: "bg-orange-100",
		text: "text-orange-700",
		icon: "ri-movie-2-line"
	},
	autor: {
		bg: "bg-emerald-100",
		text: "text-emerald-700",
		icon: "ri-quill-pen-line"
	},
	desarrollador: {
		bg: "bg-cyan-100",
		text: "text-cyan-700",
		icon: "ri-gamepad-line"
	},
	publisher: {
		bg: "bg-violet-100",
		text: "text-violet-700",
		icon: "ri-building-2-line"
	},
	artista: {
		bg: "bg-pink-100",
		text: "text-pink-700",
		icon: "ri-music-2-line"
	}
};
function getRoleStyle(role) {
	return ROLE_COLORS[role.toLowerCase()] ?? {
		bg: "bg-zinc-100",
		text: "text-zinc-600",
		icon: "ri-user-line"
	};
}
function EntityPicker({ label, accentColor, selected, onSelect, exclude }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)(null);
	const results = ALL_ENTITIES.filter((e) => {
		if (exclude && e.id === exclude) return false;
		if (!query.trim()) return true;
		const q = query.toLowerCase();
		return e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.nationality.toLowerCase().includes(q);
	}).slice(0, 8);
	(0, import_react.useEffect)(() => {
		function handleClick(e) {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, []);
	if (selected) {
		const roleStyle = getRoleStyle(selected.role);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 min-w-0 rounded-2xl border-2 overflow-hidden transition-all",
			style: { borderColor: accentColor },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-1.5 w-full",
				style: { backgroundColor: accentColor }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5 flex items-center gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-100",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: selected.photo,
							alt: selected.name,
							className: "w-full h-full object-cover object-top"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 flex-wrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-zinc-900 dark:text-white text-base leading-tight",
									style: { fontFamily: "'Space Grotesk', sans-serif" },
									children: selected.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${roleStyle.bg} ${roleStyle.text}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${roleStyle.icon} text-xs` }), selected.role]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-zinc-500 mt-0.5",
								children: [
									selected.nationality,
									" · ",
									selected.birthYear
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-zinc-400 mt-1",
								children: [selected.works.length, " obras en catálogo"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => onSelect(null),
						className: "w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-600 transition-all cursor-pointer flex-shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-line text-sm" })
					})
				]
			})]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: "flex-1 min-w-0 relative",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border-2 border-dashed p-5 flex flex-col gap-3 transition-all",
			style: { borderColor: `${accentColor}60` },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-8 h-8 flex items-center justify-center rounded-full",
						style: { backgroundColor: `${accentColor}20` },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
							className: "ri-user-add-line text-sm",
							style: { color: accentColor }
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold text-zinc-500 dark:text-zinc-400",
						children: label
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: query,
						onChange: (e) => {
							setQuery(e.target.value);
							setOpen(true);
						},
						onFocus: () => setOpen(true),
						placeholder: "Buscar actor, director, autor...",
						className: "w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
					})]
				}),
				open && results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-xl z-50 overflow-hidden",
					children: results.map((entity) => {
						const rs = getRoleStyle(entity.role);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								onSelect(entity);
								setOpen(false);
								setQuery("");
							},
							className: "w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: entity.photo,
										alt: entity.name,
										className: "w-full h-full object-cover object-top"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold text-zinc-900 dark:text-white truncate",
										children: entity.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-zinc-400",
										children: entity.nationality
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${rs.bg} ${rs.text}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${rs.icon} text-xs` }), entity.role]
								})
							]
						}, entity.id);
					})
				})
			]
		})
	});
}
function CompareSelector({ entityA, entityB, onSelectA, onSelectB }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-scales-3-line text-zinc-600 dark:text-zinc-400" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-base font-bold text-zinc-900 dark:text-white",
				style: { fontFamily: "'Space Grotesk', sans-serif" },
				children: "Selecciona dos entidades"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-zinc-400",
				children: "Compara su evolución de ratings a lo largo de su carrera"
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntityPicker, {
					label: "Entidad A",
					accentColor: "#f43f5e",
					selected: entityA,
					onSelect: onSelectA,
					exclude: entityB?.id
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-shrink-0 flex flex-col items-center justify-center pt-8 gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-left-right-line text-zinc-500 text-sm" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-zinc-400 font-semibold",
						children: "VS"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntityPicker, {
					label: "Entidad B",
					accentColor: "#06b6d4",
					selected: entityB,
					onSelect: onSelectB,
					exclude: entityA?.id
				})
			]
		})]
	});
}
//#endregion
//#region src/pages/compare/components/CompareChart.tsx
var COLOR_A$2 = "#f43f5e";
var COLOR_B$2 = "#06b6d4";
function buildTimeline(entityA, entityB) {
	return Array.from(new Set([...entityA.works.map((w) => w.year), ...entityB.works.map((w) => w.year)])).sort((a, b) => a - b);
}
function getYearRating(works, year) {
	const match = works.find((w) => w.year === year);
	return match ? {
		rating: match.rating,
		title: match.title
	} : null;
}
function getConsistency$1(works) {
	if (works.length < 2) return 10;
	const ratings = works.map((w) => w.rating);
	const mean = ratings.reduce((s, r) => s + r, 0) / ratings.length;
	const variance = ratings.reduce((s, r) => s + Math.pow(r - mean, 2), 0) / ratings.length;
	return Math.max(0, 10 - Math.sqrt(variance) * 2);
}
function getTrend$1(works) {
	if (works.length < 2) return 0;
	const sorted = [...works].sort((a, b) => a.year - b.year);
	return sorted[sorted.length - 1].rating - sorted[0].rating;
}
function CompareChart({ entityA, entityB }) {
	const [tooltip, setTooltip] = (0, import_react.useState)(null);
	const svgRef = (0, import_react.useRef)(null);
	const WIDTH = 800;
	const HEIGHT = 260;
	const PAD_LEFT = 40;
	const PAD_RIGHT = 20;
	const PAD_TOP = 20;
	const PAD_BOTTOM = 40;
	const INNER_W = WIDTH - PAD_LEFT - PAD_RIGHT;
	const INNER_H = HEIGHT - PAD_TOP - PAD_BOTTOM;
	const worksA = [...entityA.works].sort((a, b) => a.year - b.year);
	const worksB = [...entityB.works].sort((a, b) => a.year - b.year);
	const allYears = buildTimeline(entityA, entityB);
	const minYear = allYears[0];
	const yearRange = allYears[allYears.length - 1] - minYear || 1;
	const allRatings = [...worksA, ...worksB].map((w) => w.rating);
	const minRating = Math.max(0, Math.min(...allRatings) - .5);
	const maxRating = Math.min(10, Math.max(...allRatings) + .5);
	const ratingRange = maxRating - minRating || 1;
	const toX = (0, import_react.useCallback)((year) => PAD_LEFT + (year - minYear) / yearRange * INNER_W, [
		INNER_W,
		minYear,
		yearRange
	]);
	const toY = (0, import_react.useCallback)((rating) => PAD_TOP + INNER_H - (rating - minRating) / ratingRange * INNER_H, [
		INNER_H,
		minRating,
		ratingRange
	]);
	const buildPath = (works) => {
		if (works.length === 0) return "";
		return works.map((w, i) => `${i === 0 ? "M" : "L"} ${toX(w.year).toFixed(1)} ${toY(w.rating).toFixed(1)}`).join(" ");
	};
	const buildArea = (works) => {
		if (works.length === 0) return "";
		const line = buildPath(works);
		const last = works[works.length - 1];
		const first = works[0];
		return `${line} L ${toX(last.year).toFixed(1)} ${(PAD_TOP + INNER_H).toFixed(1)} L ${toX(first.year).toFixed(1)} ${(PAD_TOP + INNER_H).toFixed(1)} Z`;
	};
	const pathA = buildPath(worksA);
	const pathB = buildPath(worksB);
	const areaA = buildArea(worksA);
	const areaB = buildArea(worksB);
	const gridRatings = [
		7,
		7.5,
		8,
		8.5,
		9,
		9.5,
		10
	].filter((r) => r >= minRating && r <= maxRating);
	const handleMouseMove = (0, import_react.useCallback)((e) => {
		const svg = svgRef.current;
		if (!svg) return;
		const rect = svg.getBoundingClientRect();
		const scaleX = WIDTH / rect.width;
		const mx = (e.clientX - rect.left) * scaleX;
		let closestYear = allYears[0];
		let minDist = Infinity;
		for (const y of allYears) {
			const dist = Math.abs(toX(y) - mx);
			if (dist < minDist) {
				minDist = dist;
				closestYear = y;
			}
		}
		if (minDist > 40) {
			setTooltip(null);
			return;
		}
		const points = [];
		const wA = getYearRating(worksA, closestYear);
		const wB = getYearRating(worksB, closestYear);
		if (wA) points.push({
			entity: "A",
			rating: wA.rating,
			title: wA.title,
			year: closestYear,
			color: COLOR_A$2
		});
		if (wB) points.push({
			entity: "B",
			rating: wB.rating,
			title: wB.title,
			year: closestYear,
			color: COLOR_B$2
		});
		if (points.length === 0) {
			setTooltip(null);
			return;
		}
		const avgY = points.reduce((s, p) => {
			const work = p.entity === "A" ? worksA.find((w) => w.year === closestYear) : worksB.find((w) => w.year === closestYear);
			return s + (work ? toY(work.rating) : 0);
		}, 0) / points.length;
		setTooltip({
			x: toX(closestYear),
			y: avgY,
			points
		});
	}, [
		allYears,
		toX,
		toY,
		worksA,
		worksB
	]);
	const consistencyA = getConsistency$1(entityA.works);
	const consistencyB = getConsistency$1(entityB.works);
	const trendA = getTrend$1(entityA.works);
	const trendB = getTrend$1(entityB.works);
	const avgA = entityA.works.reduce((s, w) => s + w.rating, 0) / (entityA.works.length || 1);
	const avgB = entityB.works.reduce((s, w) => s + w.rating, 0) / (entityB.works.length || 1);
	const peakA = Math.max(...entityA.works.map((w) => w.rating));
	const peakB = Math.max(...entityB.works.map((w) => w.rating));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-6 pt-6 pb-4 flex items-center justify-between flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-bold text-zinc-900 dark:text-white",
					style: { fontFamily: "'Space Grotesk', sans-serif" },
					children: "Evolución de ratings"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-zinc-400 mt-0.5",
					children: "Ratings por obra a lo largo de la carrera · hover para detalles"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-0.5 rounded-full",
								style: { backgroundColor: COLOR_A$2 }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-5 h-5 rounded-full overflow-hidden flex-shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: entityA.photo,
									alt: entityA.name,
									className: "w-full h-full object-cover object-top"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300",
								children: entityA.name
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-0.5 rounded-full",
								style: { backgroundColor: COLOR_B$2 }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-5 h-5 rounded-full overflow-hidden flex-shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: entityB.photo,
									alt: entityB.name,
									className: "w-full h-full object-cover object-top"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300",
								children: entityB.name
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-4 pb-2 relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					ref: svgRef,
					viewBox: `0 0 ${WIDTH} ${HEIGHT}`,
					className: "w-full",
					style: { height: 260 },
					onMouseMove: handleMouseMove,
					onMouseLeave: () => setTooltip(null),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: "gradA",
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: COLOR_A$2,
								stopOpacity: "0.15"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: COLOR_A$2,
								stopOpacity: "0.01"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: "gradB",
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: COLOR_B$2,
								stopOpacity: "0.15"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: COLOR_B$2,
								stopOpacity: "0.01"
							})]
						})] }),
						gridRatings.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: PAD_LEFT,
							y1: toY(r),
							x2: WIDTH - PAD_RIGHT,
							y2: toY(r),
							stroke: "#e4e4e7",
							strokeWidth: .5,
							strokeDasharray: "4 4"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: PAD_LEFT - 6,
							y: toY(r) + 4,
							textAnchor: "end",
							fontSize: 9,
							fill: "#a1a1aa",
							children: r
						})] }, r)),
						allYears.filter((_, i) => i % Math.ceil(allYears.length / 8) === 0 || i === allYears.length - 1).map((year) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: toX(year),
							y: PAD_TOP + INNER_H + 18,
							textAnchor: "middle",
							fontSize: 9,
							fill: "#a1a1aa",
							children: year
						}, year)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: areaA,
							fill: "url(#gradA)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: areaB,
							fill: "url(#gradB)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: pathA,
							fill: "none",
							stroke: COLOR_A$2,
							strokeWidth: 2.5,
							strokeLinecap: "round",
							strokeLinejoin: "round"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: pathB,
							fill: "none",
							stroke: COLOR_B$2,
							strokeWidth: 2.5,
							strokeLinecap: "round",
							strokeLinejoin: "round"
						}),
						worksA.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: toX(w.year),
							cy: toY(w.rating),
							r: 4,
							fill: COLOR_A$2,
							stroke: "white",
							strokeWidth: 1.5
						}, i)),
						worksB.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: toX(w.year),
							cy: toY(w.rating),
							r: 4,
							fill: COLOR_B$2,
							stroke: "white",
							strokeWidth: 1.5
						}, i)),
						tooltip && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: tooltip.x,
							y1: PAD_TOP,
							x2: tooltip.x,
							y2: PAD_TOP + INNER_H,
							stroke: "#71717a",
							strokeWidth: 1,
							strokeDasharray: "3 3"
						})
					]
				}), tooltip && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute pointer-events-none z-20",
					style: {
						left: `${tooltip.x / WIDTH * 100}%`,
						top: `${tooltip.y / HEIGHT * 100}%`,
						transform: "translate(-50%, -110%)"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-zinc-900 text-white rounded-xl px-3 py-2.5 shadow-xl min-w-[160px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-zinc-400 font-medium mb-1.5 text-center",
								children: tooltip.points[0]?.year
							}),
							tooltip.points.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mb-1 last:mb-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-2 h-2 rounded-full flex-shrink-0",
										style: { backgroundColor: p.color }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex-1 min-w-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-zinc-300 truncate",
											children: p.title
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold ml-1",
										style: { color: p.color },
										children: p.rating.toFixed(1)
									})
								]
							}, p.entity)),
							tooltip.points.length === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1.5 pt-1.5 border-t border-zinc-700 text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-zinc-400",
									children: ["Diferencia: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-white",
										children: Math.abs(tooltip.points[0].rating - tooltip.points[1].rating).toFixed(1)
									})]
								})
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-6 pb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2",
				children: [
					{
						label: "Rating medio",
						valA: avgA.toFixed(2),
						valB: avgB.toFixed(2),
						numA: avgA,
						numB: avgB,
						icon: "ri-star-line"
					},
					{
						label: "Pico máximo",
						valA: peakA.toFixed(1),
						valB: peakB.toFixed(1),
						numA: peakA,
						numB: peakB,
						icon: "ri-arrow-up-circle-line"
					},
					{
						label: "Consistencia",
						valA: consistencyA.toFixed(1),
						valB: consistencyB.toFixed(1),
						numA: consistencyA,
						numB: consistencyB,
						icon: "ri-pulse-line"
					},
					{
						label: "Tendencia",
						valA: (trendA >= 0 ? "+" : "") + trendA.toFixed(1),
						valB: (trendB >= 0 ? "+" : "") + trendB.toFixed(1),
						numA: trendA,
						numB: trendB,
						icon: "ri-line-chart-line"
					}
				].map((stat) => {
					const winnerA = stat.numA > stat.numB;
					const winnerB = stat.numB > stat.numA;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${stat.icon} text-xs text-zinc-400` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-zinc-400 font-medium",
									children: stat.label
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-sm font-bold",
										style: { color: winnerA ? COLOR_A$2 : "#71717a" },
										children: [stat.valA, winnerA && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-trophy-line text-xs ml-1" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-300 dark:text-zinc-600",
										children: "vs"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-sm font-bold",
										style: { color: winnerB ? COLOR_B$2 : "#71717a" },
										children: [winnerB && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-trophy-line text-xs mr-1" }), stat.valB]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full transition-all",
									style: {
										width: `${stat.numA / (Math.abs(stat.numA) + Math.abs(stat.numB) || 1) * 100}%`,
										backgroundColor: COLOR_A$2
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full transition-all",
									style: {
										width: `${stat.numB / (Math.abs(stat.numA) + Math.abs(stat.numB) || 1) * 100}%`,
										backgroundColor: COLOR_B$2
									}
								})]
							})
						]
					}, stat.label);
				})
			})
		]
	});
}
//#endregion
//#region src/pages/compare/components/CompareStats.tsx
var COLOR_A$1 = "#f43f5e";
var COLOR_B$1 = "#06b6d4";
function getAvg(works) {
	if (!works.length) return 0;
	return works.reduce((s, w) => s + w.rating, 0) / works.length;
}
function getPeak(works) {
	if (!works.length) return 0;
	return Math.max(...works.map((w) => w.rating));
}
function getLowest(works) {
	if (!works.length) return 0;
	return Math.min(...works.map((w) => w.rating));
}
function getConsistency(works) {
	if (works.length < 2) return 10;
	const ratings = works.map((w) => w.rating);
	const mean = ratings.reduce((s, r) => s + r, 0) / ratings.length;
	const variance = ratings.reduce((s, r) => s + Math.pow(r - mean, 2), 0) / ratings.length;
	return Math.max(0, 10 - Math.sqrt(variance) * 2);
}
function getTrend(works) {
	if (works.length < 2) return 0;
	const sorted = [...works].sort((a, b) => a.year - b.year);
	return sorted[sorted.length - 1].rating - sorted[0].rating;
}
function getActiveYears(works) {
	if (works.length < 2) return 0;
	const years = works.map((w) => w.year);
	return Math.max(...years) - Math.min(...years);
}
function getBestWork(works) {
	if (!works.length) return null;
	return works.reduce((b, w) => w.rating > b.rating ? w : b, works[0]);
}
function StatRow({ label, icon, valA, valB, numA, numB, higherIsBetter = true, suffix = "" }) {
	const winnerA = higherIsBetter ? numA > numB : numA < numB;
	const winnerB = higherIsBetter ? numB > numA : numB < numA;
	const tie = numA === numB;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex items-center justify-end gap-1.5",
				children: [winnerA && !tie && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-5 h-5 flex items-center justify-center rounded-full",
					style: { backgroundColor: `${COLOR_A$1}20` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
						className: "ri-trophy-fill text-xs",
						style: { color: COLOR_A$1 }
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm font-bold",
					style: { color: winnerA && !tie ? COLOR_A$1 : "#71717a" },
					children: [valA, suffix]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-0.5 w-32 flex-shrink-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${icon} text-xs text-zinc-400` }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-zinc-400 text-center leading-tight",
						children: label
					}),
					tie && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-zinc-300 font-medium",
						children: "Empate"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm font-bold",
					style: { color: winnerB && !tie ? COLOR_B$1 : "#71717a" },
					children: [valB, suffix]
				}), winnerB && !tie && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-5 h-5 flex items-center justify-center rounded-full",
					style: { backgroundColor: `${COLOR_B$1}20` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
						className: "ri-trophy-fill text-xs",
						style: { color: COLOR_B$1 }
					})
				})]
			})
		]
	});
}
function CompareStats({ entityA, entityB }) {
	const avgA = getAvg(entityA.works);
	const avgB = getAvg(entityB.works);
	const peakA = getPeak(entityA.works);
	const peakB = getPeak(entityB.works);
	const lowestA = getLowest(entityA.works);
	const lowestB = getLowest(entityB.works);
	const consistencyA = getConsistency(entityA.works);
	const consistencyB = getConsistency(entityB.works);
	const trendA = getTrend(entityA.works);
	const trendB = getTrend(entityB.works);
	const yearsA = getActiveYears(entityA.works);
	const yearsB = getActiveYears(entityB.works);
	const bestA = getBestWork(entityA.works);
	const bestB = getBestWork(entityB.works);
	let winsA = 0;
	let winsB = 0;
	[
		{
			a: avgA,
			b: avgB,
			higher: true
		},
		{
			a: peakA,
			b: peakB,
			higher: true
		},
		{
			a: consistencyA,
			b: consistencyB,
			higher: true
		},
		{
			a: trendA,
			b: trendB,
			higher: true
		},
		{
			a: entityA.works.length,
			b: entityB.works.length,
			higher: true
		}
	].forEach(({ a, b, higher }) => {
		if (higher ? a > b : a < b) winsA++;
		else if (higher ? b > a : b < a) winsB++;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 border-b border-zinc-100 dark:border-zinc-800",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 p-5",
						style: { borderBottom: `3px solid ${COLOR_A$1}` },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-xl overflow-hidden flex-shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: entityA.photo,
								alt: entityA.name,
								className: "w-full h-full object-cover object-top"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold text-zinc-900 dark:text-white truncate",
								style: { fontFamily: "'Space Grotesk', sans-serif" },
								children: entityA.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-zinc-400",
								children: entityA.role
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-800/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-zinc-400 uppercase tracking-wider",
								children: "Estadísticas"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mt-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-lg font-black",
										style: { color: COLOR_A$1 },
										children: winsA
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-400",
										children: "vs"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-lg font-black",
										style: { color: COLOR_B$1 },
										children: winsB
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-zinc-400 mt-0.5",
								children: "victorias"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-3 p-5",
						style: { borderBottom: `3px solid ${COLOR_B$1}` },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold text-zinc-900 dark:text-white truncate",
								style: { fontFamily: "'Space Grotesk', sans-serif" },
								children: entityB.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-zinc-400",
								children: entityB.role
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-xl overflow-hidden flex-shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: entityB.photo,
								alt: entityB.name,
								className: "w-full h-full object-cover object-top"
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-6 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
						label: "Rating medio",
						icon: "ri-star-line",
						valA: avgA.toFixed(2),
						valB: avgB.toFixed(2),
						numA: avgA,
						numB: avgB
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
						label: "Pico máximo",
						icon: "ri-arrow-up-circle-line",
						valA: peakA.toFixed(1),
						valB: peakB.toFixed(1),
						numA: peakA,
						numB: peakB
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
						label: "Rating mínimo",
						icon: "ri-arrow-down-circle-line",
						valA: lowestA.toFixed(1),
						valB: lowestB.toFixed(1),
						numA: lowestA,
						numB: lowestB
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
						label: "Consistencia",
						icon: "ri-pulse-line",
						valA: consistencyA.toFixed(1),
						valB: consistencyB.toFixed(1),
						numA: consistencyA,
						numB: consistencyB,
						suffix: "/10"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
						label: "Tendencia carrera",
						icon: "ri-line-chart-line",
						valA: (trendA >= 0 ? "+" : "") + trendA.toFixed(1),
						valB: (trendB >= 0 ? "+" : "") + trendB.toFixed(1),
						numA: trendA,
						numB: trendB
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
						label: "Obras en catálogo",
						icon: "ri-film-line",
						valA: entityA.works.length,
						valB: entityB.works.length,
						numA: entityA.works.length,
						numB: entityB.works.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
						label: "Años de carrera",
						icon: "ri-time-line",
						valA: yearsA > 0 ? `${yearsA} años` : "—",
						valB: yearsB > 0 ? `${yearsB} años` : "—",
						numA: yearsA,
						numB: yearsB
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-6 pb-6 pt-2 grid grid-cols-2 gap-4 border-t border-zinc-100 dark:border-zinc-800 mt-2",
				children: [{
					entity: entityA,
					best: bestA,
					color: COLOR_A$1
				}, {
					entity: entityB,
					best: bestB,
					color: COLOR_B$1
				}].map(({ entity, best, color }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-zinc-400 uppercase tracking-wider",
						children: "Mejor obra"
					}), best ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: best.cover,
								alt: best.title,
								className: "w-full h-full object-cover object-top"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold text-zinc-900 dark:text-white truncate",
									children: best.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-zinc-400",
									children: [
										best.year,
										" · ",
										best.genre
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
										className: "ri-star-fill text-xs",
										style: { color }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold",
										style: { color },
										children: best.rating.toFixed(1)
									})]
								})
							]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-zinc-400",
						children: "Sin datos"
					})]
				}, entity.id))
			})
		]
	});
}
//#endregion
//#region src/pages/compare/components/CompareWorks.tsx
var COLOR_A = "#f43f5e";
var COLOR_B = "#06b6d4";
function buildMergedWorks(entityA, entityB) {
	return Array.from(new Set([...entityA.works.map((w) => w.year), ...entityB.works.map((w) => w.year)])).sort((a, b) => a - b).map((year) => ({
		year,
		workA: entityA.works.find((w) => w.year === year) ?? null,
		workB: entityB.works.find((w) => w.year === year) ?? null
	}));
}
function CompareWorks({ entityA, entityB }) {
	const [sortMode, setSortMode] = (0, import_react.useState)("year");
	const [showOnlyShared, setShowOnlyShared] = (0, import_react.useState)(false);
	const merged = buildMergedWorks(entityA, entityB);
	const sorted = [...showOnlyShared ? merged.filter((m) => m.workA && m.workB) : merged].sort((a, b) => {
		switch (sortMode) {
			case "year": return a.year - b.year;
			case "rating_a": return (b.workA?.rating ?? 0) - (a.workA?.rating ?? 0);
			case "rating_b": return (b.workB?.rating ?? 0) - (a.workB?.rating ?? 0);
			case "diff": {
				const diffA = Math.abs((a.workA?.rating ?? 0) - (a.workB?.rating ?? 0));
				return Math.abs((b.workA?.rating ?? 0) - (b.workB?.rating ?? 0)) - diffA;
			}
			default: return 0;
		}
	});
	const sharedCount = merged.filter((m) => m.workA && m.workB).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-6 py-5 flex items-center justify-between flex-wrap gap-3 border-b border-zinc-100 dark:border-zinc-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-bold text-zinc-900 dark:text-white",
					style: { fontFamily: "'Space Grotesk', sans-serif" },
					children: "Obras por año"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-zinc-400 mt-0.5",
					children: sharedCount > 0 ? `${sharedCount} año${sharedCount !== 1 ? "s" : ""} con obras de ambos` : "Sin años compartidos"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 flex-wrap",
					children: [sharedCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setShowOnlyShared((p) => !p),
						className: `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${showOnlyShared ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-links-line text-xs" }), "Solo compartidos"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1",
						children: [
							{
								value: "year",
								label: "Año"
							},
							{
								value: "rating_a",
								label: entityA.name.split(" ")[0]
							},
							{
								value: "rating_b",
								label: entityB.name.split(" ")[0]
							},
							{
								value: "diff",
								label: "Diferencia"
							}
						].map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSortMode(opt.value),
							className: `px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${sortMode === opt.value ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"}`,
							children: opt.label
						}, opt.value))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[1fr_auto_1fr] gap-0 px-6 py-2 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-2 h-2 rounded-full flex-shrink-0",
							style: { backgroundColor: COLOR_A }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-zinc-500 truncate",
							children: entityA.name
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-16 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-zinc-400",
							children: "Año"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-zinc-500 truncate",
							children: entityB.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-2 h-2 rounded-full flex-shrink-0",
							style: { backgroundColor: COLOR_B }
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-zinc-50 dark:divide-zinc-800/50 max-h-[480px] overflow-y-auto",
				children: sorted.map(({ year, workA, workB }) => {
					const diff = workA && workB ? workA.rating - workB.rating : null;
					const isShared = workA && workB;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `grid grid-cols-[1fr_auto_1fr] gap-0 px-6 py-3 transition-colors ${isShared ? "hover:bg-zinc-50 dark:hover:bg-zinc-800/30" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-3 pr-3",
								children: workA ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-8 h-10 rounded-md overflow-hidden flex-shrink-0 bg-zinc-100",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: workA.cover,
										alt: workA.title,
										className: "w-full h-full object-cover object-top"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate",
											children: workA.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-zinc-400",
											children: workA.genre
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1 mt-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-1 rounded-full",
												style: {
													width: `${workA.rating / 10 * 48}px`,
													backgroundColor: COLOR_A
												}
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold",
												style: { color: COLOR_A },
												children: workA.rating.toFixed(1)
											})]
										})
									]
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-zinc-300 dark:text-zinc-600 italic",
									children: "Sin obra"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-16 flex flex-col items-center justify-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-zinc-500",
										children: year
									}),
									diff !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-bold",
										style: { color: diff > 0 ? COLOR_A : diff < 0 ? COLOR_B : "#71717a" },
										children: [diff > 0 ? "+" : "", diff.toFixed(1)]
									}),
									isShared && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-end gap-3 pl-3",
								children: workB ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 text-right",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate",
											children: workB.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-zinc-400",
											children: workB.genre
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-1 mt-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold",
												style: { color: COLOR_B },
												children: workB.rating.toFixed(1)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-1 rounded-full",
												style: {
													width: `${workB.rating / 10 * 48}px`,
													backgroundColor: COLOR_B
												}
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-8 h-10 rounded-md overflow-hidden flex-shrink-0 bg-zinc-100",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: workB.cover,
										alt: workB.title,
										className: "w-full h-full object-cover object-top"
									})
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-zinc-300 dark:text-zinc-600 italic",
									children: "Sin obra"
								})
							})
						]
					}, year);
				})
			}),
			sorted.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-12 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-file-list-3-line text-2xl text-zinc-300 dark:text-zinc-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-zinc-400 mt-2",
					children: "No hay obras que mostrar"
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/compare/page.tsx
var SUGGESTED_PAIRS = [
	["christopher-nolan", "denis-villeneuve"],
	["cillian-murphy", "timothee-chalamet"],
	["fromsoftware", "cd-projekt-red"],
	["liu-cixin", "isaac-asimov"],
	["emily-blunt", "florence-pugh"],
	["pedro-pascal", "cillian-murphy"]
];
function ComparePage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [entityA, setEntityA] = (0, import_react.useState)(null);
	const [entityB, setEntityB] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const idA = searchParams.get("a");
		const idB = searchParams.get("b");
		if (idA && PEOPLE_MOCK[idA]) setEntityA(PEOPLE_MOCK[idA]);
		if (idB && PEOPLE_MOCK[idB]) setEntityB(PEOPLE_MOCK[idB]);
	}, [searchParams]);
	const handleSelectA = (p) => {
		setEntityA(p);
		const params = new URLSearchParams(searchParams);
		if (p) params.set("a", p.id);
		else params.delete("a");
		setSearchParams(params, { replace: true });
	};
	const handleSelectB = (p) => {
		setEntityB(p);
		const params = new URLSearchParams(searchParams);
		if (p) params.set("b", p.id);
		else params.delete("b");
		setSearchParams(params, { replace: true });
	};
	const handleSuggestedPair = (idA, idB) => {
		const a = PEOPLE_MOCK[idA];
		const b = PEOPLE_MOCK[idB];
		if (a && b) {
			setEntityA(a);
			setEntityB(b);
			setSearchParams({
				a: idA,
				b: idB
			}, { replace: true });
		}
	};
	const bothSelected = entityA && entityB;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-zinc-50 dark:bg-zinc-950",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pt-16 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-screen-xl mx-auto px-4 md:px-6 py-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 mb-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/entities",
								className: "flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-left-line text-xs" }), "Entidades"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-zinc-200 dark:text-zinc-700",
								children: "/"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-zinc-400",
								children: "Comparar"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-6 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl font-black text-zinc-900 dark:text-white",
							style: { fontFamily: "'Space Grotesk', sans-serif" },
							children: "Comparar entidades"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-zinc-500 mt-1 max-w-lg",
							children: "Enfrenta dos actores, directores, autores o estudios y analiza su evolución de ratings, consistencia y trayectoria."
						})] }), bothSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								handleSelectA(null);
								handleSelectB(null);
							},
							className: "flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all cursor-pointer whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-refresh-line text-sm" }), "Nueva comparación"]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-screen-xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompareSelector, {
						entityA,
						entityB,
						onSelectA: handleSelectA,
						onSelectB: handleSelectB
					}),
					!bothSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-bold text-zinc-900 dark:text-white mb-4",
							style: { fontFamily: "'Space Grotesk', sans-serif" },
							children: "Comparaciones sugeridas"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
							children: SUGGESTED_PAIRS.map(([idA, idB]) => {
								const a = PEOPLE_MOCK[idA];
								const b = PEOPLE_MOCK[idB];
								if (!a || !b) return null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleSuggestedPair(idA, idB),
									className: "flex items-center gap-3 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer text-left group",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex -space-x-2 flex-shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-9 h-9 rounded-full overflow-hidden border-2 border-white dark:border-zinc-900 z-10",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: a.photo,
													alt: a.name,
													className: "w-full h-full object-cover object-top"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-9 h-9 rounded-full overflow-hidden border-2 border-white dark:border-zinc-900",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: b.photo,
													alt: b.name,
													className: "w-full h-full object-cover object-top"
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-bold text-zinc-900 dark:text-white truncate group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors",
												children: a.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-zinc-400 truncate",
												children: ["vs ", b.name]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-line text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors flex-shrink-0" })
									]
								}, `${idA}-${idB}`);
							})
						})]
					}),
					bothSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompareChart, {
							entityA,
							entityB
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompareStats, {
								entityA,
								entityB
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompareWorks, {
								entityA,
								entityB
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-between gap-4 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-share-line text-zinc-500 text-sm" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold text-zinc-900 dark:text-white",
									children: "Compartir comparación"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-zinc-400",
									children: "La URL ya incluye los parámetros de esta comparación"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => navigator.clipboard.writeText(window.location.href),
								className: "flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-clipboard-line text-sm" }), "Copiar enlace"]
							})]
						})
					] }),
					!entityA && !entityB && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center py-16 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-20 h-20 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-scales-3-line text-3xl text-zinc-400" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-bold text-zinc-900 dark:text-white mb-2",
								style: { fontFamily: "'Space Grotesk', sans-serif" },
								children: "Elige dos entidades para comparar"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-zinc-400 max-w-sm",
								children: "Selecciona cualquier actor, director, autor o estudio del catálogo y analiza su trayectoria en detalle."
							})
						]
					})
				]
			})
		]
	});
}
//#endregion
export { ComparePage as default };

//# sourceMappingURL=page-B6hNO6VA.js.map