import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { c as useAuth, h as require_react, s as require_jsx_runtime, u as Link } from "./index-cosAM6zi.js";
import { t as SeoHead } from "./SeoHead-SAtaEFdZ.js";
import { a as useTracker, i as useDashboardStats, n as statusLabel, r as timeAgo, t as Navbar } from "./Navbar-XnbO_Z_a.js";
import { t as useScrollReveal } from "./useScrollReveal-DdeewLgA.js";
//#region src/pages/dashboard/components/DashboardHeader.tsx
var import_jsx_runtime = require_jsx_runtime();
function DashboardHeader({ stats, loading }) {
	const { profile } = useAuth();
	const hour = (/* @__PURE__ */ new Date()).getHours();
	const greeting = hour < 13 ? "Buenos días" : hour < 20 ? "Buenas tardes" : "Buenas noches";
	const displayName = profile?.display_name ?? profile?.username ?? "Usuario";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-zinc-500 dark:text-zinc-400 mb-1",
				children: [greeting, ","]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-3xl md:text-4xl font-black text-zinc-900 dark:text-white",
				style: { fontFamily: "'Space Grotesk', sans-serif" },
				children: [displayName, " 👋"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-zinc-500 dark:text-zinc-400 mt-2",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-4 w-48 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" }) : stats && stats.total_tracked > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"Llevas ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
						className: "text-zinc-700 dark:text-zinc-300",
						children: [stats.total_tracked, " ítems"]
					}),
					" en tu vault.",
					" ",
					stats.completed > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"Has completado ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-zinc-700 dark:text-zinc-300",
							children: stats.completed
						}),
						". Sigue así."
					] })
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Tu vault está vacío. ¡Empieza a añadir ítems al tracker!" })
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/catalog",
				className: "flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-compass-3-line" }), "Explorar catálogo"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/tracker",
				className: "flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-bar-chart-box-line" }), "Mi Tracker"]
			})]
		})]
	});
}
//#endregion
//#region src/pages/dashboard/components/DashboardNotifications.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var TYPE_STYLES = {
	warning: {
		bg: "bg-amber-50 dark:bg-amber-950/20",
		border: "border-amber-200 dark:border-amber-800",
		icon: "text-amber-500",
		badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
	},
	info: {
		bg: "bg-sky-50 dark:bg-sky-950/20",
		border: "border-sky-200 dark:border-sky-800",
		icon: "text-sky-500",
		badge: "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300"
	},
	success: {
		bg: "bg-emerald-50 dark:bg-emerald-950/20",
		border: "border-emerald-200 dark:border-emerald-800",
		icon: "text-emerald-500",
		badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
	},
	tip: {
		bg: "bg-violet-50 dark:bg-violet-950/20",
		border: "border-violet-200 dark:border-violet-800",
		icon: "text-violet-500",
		badge: "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300"
	}
};
function DashboardNotifications({ stats, recentActivity, loading }) {
	const { entries } = useTracker();
	const [dismissed, setDismissed] = (0, import_react.useState)(() => {
		try {
			const stored = localStorage.getItem("vaultly_dismissed_notifications");
			return stored ? new Set(JSON.parse(stored)) : /* @__PURE__ */ new Set();
		} catch {
			return /* @__PURE__ */ new Set();
		}
	});
	const dismiss = (0, import_react.useCallback)((id) => {
		setDismissed((prev) => {
			const next = new Set([...prev, id]);
			try {
				localStorage.setItem("vaultly_dismissed_notifications", JSON.stringify([...next]));
			} catch {}
			return next;
		});
	}, []);
	const visible = (0, import_react.useMemo)(() => {
		if (!stats || loading) return [];
		const allEntries = Object.values(entries);
		const result = [];
		const completedNoRating = allEntries.filter((e) => e.status === "completed" && e.rating === null);
		if (completedNoRating.length > 0) result.push({
			id: "no-rating",
			type: "warning",
			icon: "ri-star-line",
			title: `${completedNoRating.length} ítem${completedNoRating.length > 1 ? "s" : ""} sin puntuar`,
			description: `Has completado ${completedNoRating.length} ítem${completedNoRating.length > 1 ? "s" : ""} pero aún no ${completedNoRating.length > 1 ? "les has puesto" : "le has puesto"} puntuación. ¿Qué te parecieron?`,
			action: {
				label: "Ir al tracker",
				to: "/tracker"
			},
			dismissible: true
		});
		const completedNoReview = allEntries.filter((e) => e.status === "completed" && (!e.review || e.review.trim().length === 0));
		if (completedNoReview.length >= 3) result.push({
			id: "no-review",
			type: "info",
			icon: "ri-quill-pen-line",
			title: `${completedNoReview.length} ítems sin reseña`,
			description: "Tienes varios ítems completados sin reseña. Compartir tu opinión ayuda a la comunidad a descubrir nuevo contenido.",
			action: {
				label: "Explorar mis completados",
				to: "/tracker"
			},
			dismissible: true
		});
		if (stats.in_progress > 5) result.push({
			id: "too-many-in-progress",
			type: "tip",
			icon: "ri-loader-4-line",
			title: `${stats.in_progress} ítems en progreso a la vez`,
			description: "Tienes muchos ítems en progreso simultáneamente. Considera completar algunos antes de empezar nuevos.",
			action: {
				label: "Ver en progreso",
				to: "/tracker"
			},
			dismissible: true
		});
		if (stats.completed === 1) result.push({
			id: "first-completion",
			type: "success",
			icon: "ri-trophy-line",
			title: "¡Primer ítem completado!",
			description: "Has completado tu primer ítem en Vaultly. ¡Sigue así y construye tu vault cultural!",
			dismissible: true
		});
		if (stats.completed === 10) result.push({
			id: "ten-completions",
			type: "success",
			icon: "ri-medal-line",
			title: "¡10 ítems completados!",
			description: "Llevas 10 ítems completados. Tu vault está creciendo. ¿Has compartido tu perfil con amigos?",
			action: {
				label: "Ver mi perfil",
				to: "/profile"
			},
			dismissible: true
		});
		if (stats.pending > 10) result.push({
			id: "high-pending",
			type: "tip",
			icon: "ri-bookmark-line",
			title: `${stats.pending} ítems pendientes acumulados`,
			description: "Tu lista de pendientes está creciendo. ¿Cuál es el siguiente que vas a empezar?",
			action: {
				label: "Ver pendientes",
				to: "/tracker"
			},
			dismissible: true
		});
		if (stats.reviews_written === 0 && stats.completed >= 3) result.push({
			id: "write-first-review",
			type: "tip",
			icon: "ri-chat-quote-line",
			title: "Escribe tu primera reseña",
			description: "Has completado varios ítems pero aún no has escrito ninguna reseña. ¡Comparte tu opinión con la comunidad!",
			action: {
				label: "Ir al catálogo",
				to: "/catalog"
			},
			dismissible: true
		});
		return result;
	}, [
		stats,
		entries,
		loading
	]).filter((n) => !dismissed.has(n.id));
	if (loading || visible.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-8 flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 mb-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-notification-3-line text-zinc-400 text-sm" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider",
					children: "Notificaciones"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-1 px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-bold",
					children: visible.length
				})
			]
		}), visible.map((notif) => {
			const styles = TYPE_STYLES[notif.type];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `flex items-start gap-4 px-5 py-4 rounded-2xl border ${styles.bg} ${styles.border} transition-all`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0 ${styles.badge}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${notif.icon} text-base` })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-zinc-900 dark:text-white",
								children: notif.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed",
								children: notif.description
							}),
							notif.action && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: notif.action.to,
								className: `inline-flex items-center gap-1.5 mt-2 text-xs font-semibold ${styles.icon} hover:opacity-80 transition-opacity cursor-pointer`,
								children: [notif.action.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-line text-xs" })]
							})
						]
					}),
					notif.dismissible && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => dismiss(notif.id),
						className: "w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer flex-shrink-0",
						"aria-label": "Descartar",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-line text-sm" })
					})
				]
			}, notif.id);
		})]
	});
}
//#endregion
//#region src/pages/dashboard/components/StatsCards.tsx
function StatsCards({ stats, loading }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4",
		children: [
			{
				label: "Total en tracker",
				value: stats?.total_tracked ?? 0,
				icon: "ri-stack-line",
				color: "from-violet-500 to-violet-600",
				bg: "bg-violet-50 dark:bg-violet-950/30",
				text: "text-violet-600 dark:text-violet-400"
			},
			{
				label: "Completados",
				value: stats?.completed ?? 0,
				icon: "ri-checkbox-circle-line",
				color: "from-emerald-500 to-teal-600",
				bg: "bg-emerald-50 dark:bg-emerald-950/30",
				text: "text-emerald-600 dark:text-emerald-400"
			},
			{
				label: "En progreso",
				value: stats?.in_progress ?? 0,
				icon: "ri-loader-4-line",
				color: "from-amber-500 to-orange-500",
				bg: "bg-amber-50 dark:bg-amber-950/30",
				text: "text-amber-600 dark:text-amber-400"
			},
			{
				label: "Pendientes",
				value: stats?.pending ?? 0,
				icon: "ri-bookmark-line",
				color: "from-sky-500 to-cyan-600",
				bg: "bg-sky-50 dark:bg-sky-950/30",
				text: "text-sky-600 dark:text-sky-400"
			},
			{
				label: "Puntuación media",
				value: stats?.avg_rating != null ? `${stats.avg_rating}/10` : "—",
				icon: "ri-star-line",
				color: "from-rose-500 to-pink-600",
				bg: "bg-rose-50 dark:bg-rose-950/30",
				text: "text-rose-600 dark:text-rose-400"
			},
			{
				label: "Reseñas escritas",
				value: stats?.reviews_written ?? 0,
				icon: "ri-quill-pen-line",
				color: "from-zinc-500 to-zinc-700",
				bg: "bg-zinc-100 dark:bg-zinc-800/50",
				text: "text-zinc-600 dark:text-zinc-400"
			}
		].map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `rounded-2xl p-5 ${card.bg}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br ${card.color} mb-4`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${card.icon} text-white text-base` })
				}),
				loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-7 w-12 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse mb-1" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `text-2xl font-black mb-1 ${card.text}`,
					style: { fontFamily: "'Space Grotesk', sans-serif" },
					children: card.value
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-zinc-500 dark:text-zinc-400 leading-tight",
					children: card.label
				})
			]
		}, card.label))
	});
}
//#endregion
//#region src/pages/dashboard/components/CurrentlyTracking.tsx
function CurrentlyTracking({ items, loading }) {
	if (!loading && items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-loader-4-line text-zinc-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold text-zinc-900 dark:text-white text-sm",
					children: "En progreso ahora"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/tracker/in_progress",
				className: "text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer",
				children: "Ver tracker"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-6 grid grid-cols-2 sm:grid-cols-4 gap-4",
			children: loading ? Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-[3/4] rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" })]
			}, i)) : items.map((item) => {
				const title = item.item_slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: `/tracker/${item.category}`,
					className: "group cursor-pointer",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative rounded-xl overflow-hidden mb-3 aspect-[3/4] flex items-center justify-center",
							style: { background: `${item.accent}15` },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center gap-2 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-14 h-14 flex items-center justify-center rounded-2xl",
									style: { background: `${item.accent}25` },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
										className: `${item.icon} text-2xl`,
										style: { color: item.accent }
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-center leading-tight text-zinc-700 dark:text-zinc-300 line-clamp-3",
									children: title
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-white text-xs font-semibold",
								style: { background: item.accent },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-loader-4-line" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-xs font-semibold text-zinc-900 dark:text-white leading-tight line-clamp-2 mb-1",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-zinc-400",
							children: "En progreso"
						})
					]
				}, item.id);
			})
		})]
	});
}
//#endregion
//#region src/pages/dashboard/components/RecentActivity.tsx
function RecentActivity({ items, loading }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-history-line text-zinc-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold text-zinc-900 dark:text-white text-sm",
					children: "Actividad reciente"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/tracker",
				className: "text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer",
				children: "Ver todo"
			})]
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "divide-y divide-zinc-50 dark:divide-zinc-800",
			children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4 px-6 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-14 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3.5 w-32 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-20 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" })]
				})]
			}, i))
		}) : items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center py-12 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-history-line text-zinc-400 text-xl" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-zinc-500",
					children: "Aún no hay actividad. ¡Añade algo al tracker!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/catalog",
					className: "text-xs text-violet-500 hover:text-violet-600 font-medium cursor-pointer",
					children: "Explorar catálogo →"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "divide-y divide-zinc-50 dark:divide-zinc-800",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
						style: { background: `${item.accent}18` },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
							className: `${item.icon} text-lg`,
							style: { color: item.accent }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-zinc-900 dark:text-white font-medium truncate",
							children: item.item_slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-zinc-500 mt-0.5",
							children: [statusLabel(item.status_en), item.rating != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-1",
								children: [
									"· ",
									item.rating,
									"/10"
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0",
						style: {
							background: `${item.accent}18`,
							color: item.accent
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: item.categoryLabel
						})
					}),
					item.rating != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 flex-shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-xs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300",
							children: item.rating
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-zinc-400 flex-shrink-0 hidden md:block",
						children: timeAgo(item.updated_at)
					})
				]
			}, item.id))
		})]
	});
}
//#endregion
//#region src/pages/dashboard/components/CategoryProgress.tsx
function CategoryProgress({ categories, loading }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-bar-chart-box-line text-zinc-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold text-zinc-900 dark:text-white text-sm",
					children: "Progreso por categoría"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/tracker",
				className: "text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer",
				children: "Ver tracker"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-6 flex flex-col gap-5",
			children: loading ? Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-24 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-12 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse" })]
			}, i)) : categories.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center py-8 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-bar-chart-box-line text-2xl text-zinc-300 dark:text-zinc-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-zinc-400 text-center",
					children: "Añade ítems al tracker para ver tu progreso por categoría."
				})]
			}) : categories.map((cat) => {
				const completedPct = cat.total > 0 ? Math.round(cat.completed / cat.total * 100) : 0;
				const inProgressPct = cat.total > 0 ? Math.round(cat.in_progress / cat.total * 100) : 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
								className: "text-sm font-medium text-zinc-800 dark:text-zinc-200",
								children: cat.label
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-xs text-zinc-500",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								cat.completed,
								"/",
								cat.total
							] }), cat.avg_rating != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cat.avg_rating })]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "h-full flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full transition-all duration-700",
								style: {
									width: `${completedPct}%`,
									background: cat.accent
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full transition-all duration-700",
								style: {
									width: `${inProgressPct}%`,
									background: `${cat.accent}50`
								}
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 mt-1.5 text-xs text-zinc-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-2 h-2 rounded-full inline-block",
									style: { background: cat.accent }
								}),
								"Completados ",
								completedPct,
								"%"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-2 h-2 rounded-full inline-block",
									style: { background: `${cat.accent}50` }
								}),
								"En progreso ",
								inProgressPct,
								"%"
							]
						})]
					})
				] }, cat.id);
			})
		})]
	});
}
//#endregion
//#region src/pages/dashboard/components/WeeklyActivity.tsx
function WeeklyActivity({ data, loading }) {
	const max = Math.max(...data.map((d) => d.count), 1);
	const total = data.reduce((a, b) => a + b.count, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-calendar-check-line text-zinc-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold text-zinc-900 dark:text-white text-sm",
					children: "Actividad esta semana"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-zinc-400",
				children: loading ? "..." : `${total} acciones`
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-end justify-between gap-2 h-24",
			children: (data.length > 0 ? data : Array.from({ length: 7 }, (_, index) => ({
				day: [
					"L",
					"M",
					"X",
					"J",
					"V",
					"S",
					"D"
				][index],
				count: 0
			}))).map((day) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-2 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full flex items-end justify-center",
						style: { height: "80px" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full rounded-t-lg transition-all duration-500",
							style: {
								height: `${max > 0 ? day.count / max * 100 : 0}%`,
								minHeight: day.count > 0 ? "6px" : "0",
								background: "linear-gradient(to top, #8b5cf6, #f43f5e)",
								opacity: day.count > 0 ? 1 : .15
							}
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-zinc-400 font-medium",
						children: day.day
					})]
				}, day.day);
			})
		})]
	});
}
//#endregion
//#region src/pages/dashboard/page.tsx
function DashboardPage() {
	const dashData = useDashboardStats();
	const headerRef = useScrollReveal({ rootMargin: "0px" });
	const notifRef = useScrollReveal({ rootMargin: "0px" });
	const statsRef = useScrollReveal();
	const trackingRef = useScrollReveal();
	const activityRef = useScrollReveal();
	const weeklyRef = useScrollReveal();
	const progressRef = useScrollReveal();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-zinc-50 dark:bg-zinc-950",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoHead, {
				title: "Dashboard — Vaultly",
				description: "Tu panel personal de Vaultly. Consulta tu actividad, progreso y estadísticas de tracking cultural.",
				canonical: "/dashboard",
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
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardHeader, {
								stats: dashData.stats,
								loading: dashData.loading
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: notifRef,
							className: "sr-item",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardNotifications, {
								stats: dashData.stats,
								recentActivity: dashData.recentActivity,
								loading: dashData.loading
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
							ref: statsRef,
							className: "sr-item mb-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsCards, {
								stats: dashData.stats,
								loading: dashData.loading
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
							ref: trackingRef,
							className: "sr-item mb-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrentlyTracking, {
								items: dashData.currentlyTracking,
								loading: dashData.loading
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "lg:col-span-2 flex flex-col gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									ref: activityRef,
									className: "sr-item",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecentActivity, {
										items: dashData.recentActivity,
										loading: dashData.loading
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									ref: weeklyRef,
									className: "sr-item",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeeklyActivity, {
										data: dashData.weeklyActivity,
										loading: dashData.loading
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								ref: progressRef,
								className: "sr-item-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryProgress, {
									categories: dashData.categoryStats,
									loading: dashData.loading
								})
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { DashboardPage as default };

//# sourceMappingURL=page-BBC-kuPz.js.map