import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { c as useAuth, d as useLocation, f as useNavigate, h as require_react, l as supabase, s as require_jsx_runtime, t as useCategories, u as Link } from "./index-cosAM6zi.js";
import { t as useTheme } from "./useTheme-CjO9s6QO.js";
import { n as useSettings } from "./useSettings-CZ1Tg8p7.js";
//#region src/hooks/useTracker.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function rowToEntry(row, catalogItem) {
	const metadata = catalogItem?.metadata ?? {};
	const genres = metadata.genres;
	const genre = Array.isArray(genres) ? String(genres[0] ?? "") : String(metadata.genre ?? "");
	const releaseDate = catalogItem?.release_date;
	return {
		itemId: row.item_slug ?? row.id,
		catalogItemId: row.item_id ?? catalogItem?.id ?? null,
		category: row.category ?? "",
		status: row.status_en ?? "pending",
		rating: row.rating != null ? Number(row.rating) : null,
		review: row.review ?? "",
		addedAt: row.created_at ?? (/* @__PURE__ */ new Date()).toISOString(),
		updatedAt: row.updated_at ?? (/* @__PURE__ */ new Date()).toISOString(),
		title: catalogItem?.title ?? String(row.item_slug ?? "Item desconocido").replace(/-/g, " "),
		cover: catalogItem?.image_url ?? catalogItem?.cover_url ?? "",
		year: releaseDate ? Number(releaseDate.slice(0, 4)) : 0,
		genre
	};
}
function useTracker() {
	const { user, isLoggedIn } = useAuth();
	const [entries, setEntries] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(false);
	const loadEntries = (0, import_react.useCallback)(async () => {
		if (!user) return;
		setLoading(true);
		const { data, error } = await supabase.from("user_item_tracking").select("id, item_id, item_slug, category, status_en, rating, review, created_at, updated_at").eq("user_id", user.id);
		if (!error && data) {
			const slugs = [...new Set(data.map((row) => row.item_slug).filter(Boolean))];
			const ids = [...new Set(data.map((row) => row.item_id).filter(Boolean))];
			const catalogBySlug = /* @__PURE__ */ new Map();
			const catalogById = /* @__PURE__ */ new Map();
			if (slugs.length > 0 || ids.length > 0) {
				let query = supabase.from("catalog_items").select("id, slug, title, image_url, cover_url, release_date, metadata");
				if (slugs.length > 0 && ids.length > 0) query = query.or(`slug.in.(${slugs.join(",")}),id.in.(${ids.join(",")})`);
				else if (slugs.length > 0) query = query.in("slug", slugs);
				else query = query.in("id", ids);
				const { data: catalogRows } = await query;
				catalogRows?.forEach((item) => {
					catalogBySlug.set(item.slug, item);
					catalogById.set(item.id, item);
				});
			}
			const map = {};
			data.forEach((row) => {
				const entry = rowToEntry(row, catalogBySlug.get(row.item_slug) ?? catalogById.get(row.item_id));
				if (entry.itemId) map[entry.itemId] = entry;
			});
			setEntries(map);
		}
		setLoading(false);
	}, [user]);
	(0, import_react.useEffect)(() => {
		if (isLoggedIn && user) loadEntries();
		else setEntries({});
	}, [
		isLoggedIn,
		user,
		loadEntries
	]);
	return {
		entries,
		getEntry: (0, import_react.useCallback)((itemId) => entries[itemId] ?? null, [entries]),
		addOrUpdate: (0, import_react.useCallback)(async (itemId, category, status, rating, review) => {
			if (!user) return;
			const now = (/* @__PURE__ */ new Date()).toISOString();
			const existing = entries[itemId];
			const optimistic = {
				itemId,
				catalogItemId: existing?.catalogItemId ?? null,
				category,
				status,
				rating,
				review,
				addedAt: existing?.addedAt ?? now,
				updatedAt: now,
				title: existing?.title ?? itemId.replace(/-/g, " "),
				cover: existing?.cover ?? "",
				year: existing?.year ?? 0,
				genre: existing?.genre ?? ""
			};
			setEntries((prev) => ({
				...prev,
				[itemId]: optimistic
			}));
			const { data: existingRow } = await supabase.from("user_item_tracking").select("id").eq("user_id", user.id).eq("item_slug", itemId).maybeSingle();
			if (existingRow) await supabase.from("user_item_tracking").update({
				status_en: status,
				rating,
				review,
				category,
				updated_at: now
			}).eq("id", existingRow.id);
			else {
				const { data: catalogItem } = await supabase.from("catalog_items").select("id").eq("slug", itemId).maybeSingle();
				await supabase.from("user_item_tracking").insert({
					user_id: user.id,
					item_id: catalogItem?.id ?? null,
					item_slug: itemId,
					category,
					status_en: status,
					rating,
					review,
					created_at: now,
					updated_at: now
				});
			}
			await loadEntries();
		}, [
			user,
			entries,
			loadEntries
		]),
		remove: (0, import_react.useCallback)(async (itemId) => {
			if (!user) return;
			setEntries((prev) => {
				const next = { ...prev };
				delete next[itemId];
				return next;
			});
			await supabase.from("user_item_tracking").delete().eq("user_id", user.id).eq("item_slug", itemId);
		}, [user]),
		isTracked: (0, import_react.useCallback)((itemId) => Boolean(entries[itemId]), [entries]),
		loading
	};
}
//#endregion
//#region src/hooks/useDashboardStats.ts
function timeAgo(dateStr) {
	const diff = Date.now() - new Date(dateStr).getTime();
	const mins = Math.floor(diff / 6e4);
	if (mins < 60) return `Hace ${mins} min`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `Hace ${hours} hora${hours !== 1 ? "s" : ""}`;
	const days = Math.floor(hours / 24);
	if (days < 7) return `Hace ${days} día${days !== 1 ? "s" : ""}`;
	const weeks = Math.floor(days / 7);
	return `Hace ${weeks} semana${weeks !== 1 ? "s" : ""}`;
}
function statusLabel(status) {
	switch (status) {
		case "completed": return "Completó";
		case "in_progress": return "Empezó";
		case "pending": return "Añadió a pendientes";
		case "dropped": return "Abandonó";
		default: return "Actualizó";
	}
}
function getCatMeta(catId, categories) {
	return categories.find((c) => c.id === catId) ?? {
		label: catId,
		icon: "ri-stack-line",
		accent: "#6b7280"
	};
}
function useDashboardStats() {
	const { user } = useAuth();
	const categories = useCategories();
	const [stats, setStats] = (0, import_react.useState)(null);
	const [categoryStats, setCategoryStats] = (0, import_react.useState)([]);
	const [recentActivity, setRecentActivity] = (0, import_react.useState)([]);
	const [currentlyTracking, setCurrentlyTracking] = (0, import_react.useState)([]);
	const [weeklyActivity, setWeeklyActivity] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		const load = async () => {
			setLoading(true);
			const { data: rows, error } = await supabase.from("user_item_tracking").select("id, item_slug, category, status_en, rating, review, created_at, updated_at").eq("user_id", user.id).order("updated_at", { ascending: false });
			if (error || !rows) {
				setLoading(false);
				return;
			}
			const total = rows.length;
			const completed = rows.filter((r) => r.status_en === "completed").length;
			const inProgress = rows.filter((r) => r.status_en === "in_progress").length;
			const pending = rows.filter((r) => r.status_en === "pending").length;
			const dropped = rows.filter((r) => r.status_en === "dropped").length;
			const rated = rows.filter((r) => r.rating != null);
			const avgRating = rated.length > 0 ? Math.round(rated.reduce((s, r) => s + Number(r.rating), 0) / rated.length * 10) / 10 : null;
			const reviewsWritten = rows.filter((r) => r.review && r.review.trim().length > 0).length;
			setStats({
				total_tracked: total,
				completed,
				in_progress: inProgress,
				pending,
				dropped,
				avg_rating: avgRating,
				reviews_written: reviewsWritten
			});
			const catMap = {};
			rows.forEach((r) => {
				const cat = r.category ?? "unknown";
				if (!catMap[cat]) catMap[cat] = {
					total: 0,
					completed: 0,
					in_progress: 0,
					ratings: []
				};
				catMap[cat].total++;
				if (r.status_en === "completed") catMap[cat].completed++;
				if (r.status_en === "in_progress") catMap[cat].in_progress++;
				if (r.rating != null) catMap[cat].ratings.push(Number(r.rating));
			});
			setCategoryStats(Object.entries(catMap).filter(([, v]) => v.total > 0).map(([catId, v]) => {
				const meta = getCatMeta(catId, categories);
				return {
					id: catId,
					label: meta.label,
					icon: meta.icon,
					accent: meta.accent,
					total: v.total,
					completed: v.completed,
					in_progress: v.in_progress,
					avg_rating: v.ratings.length > 0 ? Math.round(v.ratings.reduce((s, r) => s + r, 0) / v.ratings.length * 10) / 10 : null
				};
			}).sort((a, b) => b.total - a.total));
			setRecentActivity(rows.slice(0, 8).map((r) => {
				const meta = getCatMeta(r.category ?? "", categories);
				return {
					id: r.id,
					item_slug: r.item_slug ?? r.id,
					category: r.category ?? "",
					categoryLabel: meta.label,
					icon: meta.icon,
					accent: meta.accent,
					status_en: r.status_en ?? "pending",
					rating: r.rating != null ? Number(r.rating) : null,
					updated_at: r.updated_at
				};
			}));
			setCurrentlyTracking(rows.filter((r) => r.status_en === "in_progress").slice(0, 4).map((r) => {
				const meta = getCatMeta(r.category ?? "", categories);
				return {
					id: r.id,
					item_slug: r.item_slug ?? r.id,
					category: r.category ?? "",
					icon: meta.icon,
					accent: meta.accent,
					updated_at: r.updated_at
				};
			}));
			const today = /* @__PURE__ */ new Date();
			const start = new Date(today);
			start.setDate(today.getDate() - 6);
			start.setHours(0, 0, 0, 0);
			const formatter = new Intl.DateTimeFormat("es-ES", { weekday: "short" });
			setWeeklyActivity(Array.from({ length: 7 }, (_, index) => {
				const date = new Date(start);
				date.setDate(start.getDate() + index);
				const dayStart = new Date(date);
				dayStart.setHours(0, 0, 0, 0);
				const dayEnd = new Date(date);
				dayEnd.setHours(23, 59, 59, 999);
				const count = rows.filter((row) => {
					const updated = new Date(row.updated_at).getTime();
					return updated >= dayStart.getTime() && updated <= dayEnd.getTime();
				}).length;
				return {
					day: formatter.format(date).slice(0, 1).toUpperCase(),
					count
				};
			}));
			setLoading(false);
		};
		load();
	}, [user, categories]);
	return {
		stats,
		categoryStats,
		recentActivity,
		currentlyTracking,
		weeklyActivity,
		loading
	};
}
//#endregion
//#region src/components/feature/NotificationBell.tsx
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "vaultly_dismissed_notifications";
var TYPE_STYLES = {
	warning: {
		dot: "bg-amber-400",
		icon: "text-amber-500",
		iconBg: "bg-amber-100 dark:bg-amber-900/40"
	},
	info: {
		dot: "bg-sky-400",
		icon: "text-sky-500",
		iconBg: "bg-sky-100 dark:bg-sky-900/40"
	},
	success: {
		dot: "bg-emerald-400",
		icon: "text-emerald-500",
		iconBg: "bg-emerald-100 dark:bg-emerald-900/40"
	},
	tip: {
		dot: "bg-violet-400",
		icon: "text-violet-500",
		iconBg: "bg-violet-100 dark:bg-violet-900/40"
	}
};
function getDismissed() {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? new Set(JSON.parse(stored)) : /* @__PURE__ */ new Set();
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
function saveDismissed(set) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
	} catch {}
}
function NotificationBell() {
	const { entries } = useTracker();
	const { stats, loading } = useDashboardStats();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [dismissed, setDismissed] = (0, import_react.useState)(getDismissed);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		function handleClick(e) {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		}
		if (open) document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [open]);
	const notifications = (0, import_react.useMemo)(() => {
		if (!stats || loading) return [];
		const allEntries = Object.values(entries);
		const result = [];
		const completedNoRating = allEntries.filter((e) => e.status === "completed" && e.rating === null);
		if (completedNoRating.length > 0) result.push({
			id: "no-rating",
			type: "warning",
			icon: "ri-star-line",
			title: `${completedNoRating.length} ítem${completedNoRating.length > 1 ? "s" : ""} sin puntuar`,
			description: `Tienes ${completedNoRating.length} ítem${completedNoRating.length > 1 ? "s completados" : " completado"} sin puntuación.`,
			action: {
				label: "Ir al tracker",
				to: "/tracker"
			}
		});
		const completedNoReview = allEntries.filter((e) => e.status === "completed" && (!e.review || e.review.trim().length === 0));
		if (completedNoReview.length >= 3) result.push({
			id: "no-review",
			type: "info",
			icon: "ri-quill-pen-line",
			title: `${completedNoReview.length} ítems sin reseña`,
			description: "Comparte tu opinión con la comunidad.",
			action: {
				label: "Ver completados",
				to: "/tracker"
			}
		});
		if (stats.in_progress > 5) result.push({
			id: "too-many-in-progress",
			type: "tip",
			icon: "ri-loader-4-line",
			title: `${stats.in_progress} ítems en progreso`,
			description: "Considera completar algunos antes de empezar nuevos.",
			action: {
				label: "Ver tracker",
				to: "/tracker"
			}
		});
		if (stats.completed === 1) result.push({
			id: "first-completion",
			type: "success",
			icon: "ri-trophy-line",
			title: "¡Primer ítem completado!",
			description: "¡Sigue así y construye tu vault cultural!"
		});
		if (stats.completed === 10) result.push({
			id: "ten-completions",
			type: "success",
			icon: "ri-medal-line",
			title: "¡10 ítems completados!",
			description: "¿Has compartido tu perfil con amigos?",
			action: {
				label: "Ver perfil",
				to: "/profile"
			}
		});
		if (stats.pending > 10) result.push({
			id: "high-pending",
			type: "tip",
			icon: "ri-bookmark-line",
			title: `${stats.pending} pendientes acumulados`,
			description: "¿Cuál es el siguiente que vas a empezar?",
			action: {
				label: "Ver pendientes",
				to: "/tracker"
			}
		});
		if (stats.reviews_written === 0 && stats.completed >= 3) result.push({
			id: "write-first-review",
			type: "tip",
			icon: "ri-chat-quote-line",
			title: "Escribe tu primera reseña",
			description: "Has completado varios ítems sin reseñas aún.",
			action: {
				label: "Ir al catálogo",
				to: "/catalog"
			}
		});
		return result;
	}, [
		stats,
		entries,
		loading
	]);
	const visible = (0, import_react.useMemo)(() => notifications.filter((n) => !dismissed.has(n.id)), [notifications, dismissed]);
	const dismiss = (0, import_react.useCallback)((id, e) => {
		e.stopPropagation();
		setDismissed((prev) => {
			const next = new Set([...prev, id]);
			saveDismissed(next);
			return next;
		});
	}, []);
	const dismissAll = (0, import_react.useCallback)(() => {
		const next = new Set([...dismissed, ...visible.map((n) => n.id)]);
		saveDismissed(next);
		setDismissed(next);
		setOpen(false);
	}, [dismissed, visible]);
	const count = visible.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setOpen((p) => !p),
			className: "relative w-9 h-9 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer",
			"aria-label": "Notificaciones",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-notification-3-line text-lg" }), count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full bg-rose-500 text-white text-[9px] font-bold leading-none",
				children: count > 9 ? "9+" : count
			})]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute top-full right-0 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden z-50",
			style: { boxShadow: "0 8px 32px rgba(0,0,0,0.10)" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-notification-3-line text-zinc-500 text-sm" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold text-zinc-900 dark:text-white",
								children: "Notificaciones"
							}),
							count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] font-bold",
								children: count
							})
						]
					}), count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: dismissAll,
						className: "text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer whitespace-nowrap",
						children: "Limpiar todo"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-[360px] overflow-y-auto",
					children: visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center py-10 px-4 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-12 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-checkbox-circle-line text-xl text-zinc-400" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-zinc-500 dark:text-zinc-400 text-center",
							children: "Todo al día, no hay notificaciones pendientes."
						})]
					}) : visible.map((notif, idx) => {
						const styles = TYPE_STYLES[notif.type];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex items-start gap-3 px-4 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors group ${idx < visible.length - 1 ? "border-b border-zinc-50 dark:border-zinc-800" : ""}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0 mt-0.5 ${styles.iconBg}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${notif.icon} text-sm ${styles.icon}` })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-zinc-900 dark:text-white leading-snug",
											children: notif.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed",
											children: notif.description
										}),
										notif.action && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: notif.action.to,
											onClick: () => setOpen(false),
											className: `inline-flex items-center gap-1 mt-1.5 text-[11px] font-semibold ${styles.icon} hover:opacity-75 transition-opacity cursor-pointer`,
											children: [notif.action.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-line text-[10px]" })]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: (e) => dismiss(notif.id, e),
									className: "w-6 h-6 flex items-center justify-center rounded-md text-zinc-300 hover:text-zinc-500 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer flex-shrink-0 opacity-0 group-hover:opacity-100 mt-0.5",
									"aria-label": "Descartar",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-line text-xs" })
								})
							]
						}, notif.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-4 py-2.5 border-t border-zinc-100 dark:border-zinc-800",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/dashboard",
						onClick: () => setOpen(false),
						className: "flex items-center justify-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer",
						children: ["Ver en el dashboard", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-line text-xs" })]
					})
				})
			]
		})]
	});
}
//#endregion
//#region src/components/feature/Navbar.tsx
function Navbar() {
	const { isLoggedIn, profile, logout } = useAuth();
	const { settings } = useSettings();
	const { theme, toggleTheme } = useTheme();
	const CATEGORIES = useCategories();
	const location = useLocation();
	const navigate = useNavigate();
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [catalogOpen, setCatalogOpen] = (0, import_react.useState)(false);
	const [trackerOpen, setTrackerOpen] = (0, import_react.useState)(false);
	const [profileOpen, setProfileOpen] = (0, import_react.useState)(false);
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const catalogRef = (0, import_react.useRef)(null);
	const trackerRef = (0, import_react.useRef)(null);
	const profileRef = (0, import_react.useRef)(null);
	const activeCategories = (0, import_react.useMemo)(() => CATEGORIES.filter((cat) => settings.activeCategories.includes(cat.id)), [settings.activeCategories]);
	const solid = scrolled || location.pathname !== "/";
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	(0, import_react.useEffect)(() => {
		const onPointerDown = (event) => {
			const target = event.target;
			if (!catalogRef.current?.contains(target)) setCatalogOpen(false);
			if (!trackerRef.current?.contains(target)) setTrackerOpen(false);
			if (!profileRef.current?.contains(target)) setProfileOpen(false);
		};
		document.addEventListener("mousedown", onPointerDown);
		return () => document.removeEventListener("mousedown", onPointerDown);
	}, []);
	(0, import_react.useEffect)(() => {
		setCatalogOpen(false);
		setTrackerOpen(false);
		setProfileOpen(false);
		setMobileOpen(false);
	}, [location.pathname]);
	const handleLogout = async () => {
		await logout();
		navigate("/");
	};
	const CategoryMenu = ({ mode }) => {
		const items = mode === "catalog" ? isLoggedIn ? activeCategories : CATEGORIES : activeCategories;
		const basePath = mode === "catalog" ? "/catalog" : "/tracker";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute top-full left-0 mt-2 w-64 overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900",
			children: items.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: `${basePath}/${cat.id}`,
				className: "flex items-center gap-3 px-4 py-3 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex h-8 w-8 items-center justify-center rounded-lg",
					style: { background: `${cat.accent}20` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
						className: `${cat.icon} text-sm`,
						style: { color: cat.accent }
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-medium",
					children: cat.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-xs text-zinc-400",
					children: mode === "catalog" ? "Explorar catálogo" : "Abrir tracker"
				})] })]
			}, cat.id))
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: `fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid ? "border-b border-zinc-100 bg-white/95 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95" : "bg-transparent"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 md:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-rose-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-archive-2-line text-sm text-white" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xl font-bold tracking-tight text-zinc-900 dark:text-white",
						style: { fontFamily: "'Space Grotesk', sans-serif" },
						children: "Vaultly"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden items-center gap-1 md:flex",
					children: [
						isLoggedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard",
							className: `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${location.pathname === "/dashboard" ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"}`,
							children: "Dashboard General"
						}),
						isLoggedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							ref: trackerRef,
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									setTrackerOpen((v) => !v);
									setCatalogOpen(false);
									setProfileOpen(false);
								},
								className: `flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${location.pathname.startsWith("/tracker") ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"}`,
								children: ["Tu Tracker", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `ri-arrow-down-s-line transition-transform ${trackerOpen ? "rotate-180" : ""}` })]
							}), trackerOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryMenu, { mode: "tracker" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							ref: catalogRef,
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									setCatalogOpen((v) => !v);
									setTrackerOpen(false);
									setProfileOpen(false);
								},
								className: `flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${location.pathname.startsWith("/catalog") ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"}`,
								children: ["Catálogo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `ri-arrow-down-s-line transition-transform ${catalogOpen ? "rotate-180" : ""}` })]
							}), catalogOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryMenu, { mode: "catalog" })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden items-center gap-2 md:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: toggleTheme,
							className: "flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
							"aria-label": "Cambiar tema",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: theme === "dark" ? "ri-sun-line" : "ri-moon-line" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/settings",
							className: "flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
							"aria-label": "Configuración",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-settings-3-line" })
						}),
						isLoggedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationBell, {}),
						isLoggedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							ref: profileRef,
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setProfileOpen((v) => !v);
									setCatalogOpen(false);
									setTrackerOpen(false);
								},
								className: "h-9 w-9 overflow-hidden rounded-full",
								children: profile?.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: profile.avatar_url,
									alt: "Avatar",
									className: "h-full w-full object-cover object-top"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-500 to-rose-500 text-sm font-bold text-white",
									children: profile?.initials ?? "NP"
								})
							}), profileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-b border-zinc-100 px-4 py-3 dark:border-zinc-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold text-zinc-900 dark:text-white",
											children: profile?.display_name ?? "Usuario"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-xs text-zinc-500",
											children: profile?.email
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/profile",
										className: "flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-user-line w-4 text-center" }), " Perfil / Cuenta"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/settings",
										className: "flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-settings-3-line w-4 text-center" }), " Configuración"]
									}),
									profile?.role === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/admin/catalog",
										className: "flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-shield-user-line w-4 text-center" }), " Admin"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "border-t border-zinc-100 dark:border-zinc-800",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: handleLogout,
											className: "flex w-full items-center gap-3 px-4 py-2.5 text-sm text-rose-500 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/30",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-logout-box-line w-4 text-center" }), " Cerrar sesión"]
										})
									})
								]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							className: "rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900",
							children: "Iniciar sesión / Entrar"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setMobileOpen((v) => !v),
					className: "flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 md:hidden",
					"aria-label": "Abrir menu",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: mobileOpen ? "ri-close-line text-xl" : "ri-menu-line text-xl" })
				})
			]
		}), mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2 border-t border-zinc-100 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900 md:hidden",
			children: [
				isLoggedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard",
					className: "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-dashboard-line" }), " Dashboard General"]
				}),
				isLoggedIn && activeCategories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: `/tracker/${cat.id}`,
					className: "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: cat.icon }),
						" Tracker: ",
						cat.label
					]
				}, cat.id)),
				(isLoggedIn ? activeCategories : CATEGORIES).map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: `/catalog/${cat.id}`,
					className: "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: cat.icon }),
						" Catálogo: ",
						cat.label
					]
				}, cat.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/settings",
					className: "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-settings-3-line" }), " Configuración"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-zinc-100 pt-2 dark:border-zinc-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: toggleTheme,
						className: "flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: theme === "dark" ? "ri-sun-line" : "ri-moon-line" }), theme === "dark" ? "Modo claro" : "Modo oscuro"]
					}), isLoggedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleLogout,
						className: "rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-500 dark:border-rose-900",
						children: "Salir"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						className: "rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900",
						children: "Entrar"
					})]
				})
			]
		})]
	});
}
//#endregion
export { useTracker as a, useDashboardStats as i, statusLabel as n, timeAgo as r, Navbar as t };

//# sourceMappingURL=Navbar-XnbO_Z_a.js.map