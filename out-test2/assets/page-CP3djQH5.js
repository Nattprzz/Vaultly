import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { c as useAuth, d as useLocation, f as useNavigate, h as require_react, l as supabase, s as require_jsx_runtime, t as useCategories, u as Link } from "./index-cosAM6zi.js";
import { t as SeoHead } from "./SeoHead-SAtaEFdZ.js";
import { t as edgeFunctionUrl } from "./edgeFunctions-CBeptRpx.js";
import { t as ROLE_CONFIG } from "./useItemEntities-kJeAlpQ0.js";
//#region src/hooks/useAdminReports.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var EDGE_URL$1 = edgeFunctionUrl("item-reports");
var STORAGE_KEY = "vaultly_admin_reports_seen";
var POLL_INTERVAL = 3e4;
function getSeenIds() {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? new Set(JSON.parse(stored)) : /* @__PURE__ */ new Set();
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
function saveSeenIds(ids) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
	} catch {}
}
function useAdminReports() {
	const [reports, setReports] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [seenIds, setSeenIds] = (0, import_react.useState)(getSeenIds);
	const mountedRef = (0, import_react.useRef)(true);
	const fetchReports = (0, import_react.useCallback)(async () => {
		try {
			const { data } = await supabase.auth.getSession();
			const token = data.session?.access_token;
			const res = await fetch(EDGE_URL$1, {
				method: "GET",
				headers: token ? { Authorization: `Bearer ${token}` } : void 0
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const json = await res.json();
			if (mountedRef.current) {
				setReports(json.reports ?? []);
				setError(null);
			}
		} catch (err) {
			if (mountedRef.current) setError(String(err));
		} finally {
			if (mountedRef.current) setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		mountedRef.current = true;
		fetchReports();
		return () => {
			mountedRef.current = false;
		};
	}, [fetchReports]);
	(0, import_react.useEffect)(() => {
		const timer = setInterval(fetchReports, POLL_INTERVAL);
		return () => clearInterval(timer);
	}, [fetchReports]);
	return {
		reports,
		pendingCount: reports.filter((r) => r.status === "pending").length,
		newCount: reports.filter((r) => r.status === "pending" && !seenIds.has(r.id)).length,
		loading,
		error,
		markAllSeen: (0, import_react.useCallback)(() => {
			const allIds = new Set(reports.map((r) => r.id));
			setSeenIds(allIds);
			saveSeenIds(allIds);
		}, [reports]),
		resolveReport: (0, import_react.useCallback)(async (id, status, note) => {
			setReports((prev) => prev.map((r) => r.id === id ? {
				...r,
				status,
				resolved_at: (/* @__PURE__ */ new Date()).toISOString(),
				resolved_note: note ?? null
			} : r));
			try {
				const { data } = await supabase.auth.getSession();
				const token = data.session?.access_token;
				const res = await fetch(EDGE_URL$1, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						...token ? { Authorization: `Bearer ${token}` } : {}
					},
					body: JSON.stringify({
						id,
						status,
						resolved_note: note
					})
				});
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
			} catch (err) {
				await fetchReports();
				setError(String(err));
			}
		}, [fetchReports]),
		refresh: fetchReports
	};
}
//#endregion
//#region src/pages/admin/components/AdminSidebar.tsx
var import_jsx_runtime = require_jsx_runtime();
function AdminSidebar({ onClose }) {
	const location = useLocation();
	const { pendingCount } = useAdminReports();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "w-64 flex-shrink-0 bg-zinc-950 min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 px-6 py-5 border-b border-zinc-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center flex-shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-archive-2-line text-white text-sm" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-white font-bold text-sm leading-tight",
					style: { fontFamily: "'Space Grotesk', sans-serif" },
					children: "Vaultly"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-zinc-500 text-xs",
					children: "Panel de Admin"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex-1 px-3 py-4 flex flex-col gap-1",
				children: [{
					id: "catalog",
					label: "Catalogo",
					icon: "ri-database-2-line",
					path: "/admin/catalog"
				}, {
					id: "reports",
					label: "Reportes",
					icon: "ri-flag-2-line",
					badge: pendingCount,
					path: "/admin/reports"
				}].map((item) => {
					const isActive = location.pathname === item.path || item.path !== "/admin" && location.pathname.startsWith(item.path);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.path,
						onClick: onClose,
						className: `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${isActive ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 flex items-center justify-center flex-shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${item.icon} text-base` })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium flex-1",
								children: item.label
							}),
							item.badge !== void 0 && item.badge > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold",
								children: item.badge
							})
						]
					}, item.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-3 py-4 border-t border-zinc-800",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-8 h-8 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-left-line text-base" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium",
						children: "Volver a la app"
					})]
				})
			})
		]
	});
}
//#endregion
//#region src/pages/admin/components/AdminOverview.tsx
function compactNumber(value) {
	return value >= 1e3 ? `${(value / 1e3).toFixed(1)}k` : String(value);
}
function AdminOverview() {
	const CATEGORIES = useCategories();
	const { pendingCount, newCount, markAllSeen } = useAdminReports();
	const [pulse, setPulse] = (0, import_react.useState)(false);
	const [kpiCards, setKpiCards] = (0, import_react.useState)([]);
	const [weeklySignups, setWeeklySignups] = (0, import_react.useState)([]);
	const [categoryDistribution, setCategoryDistribution] = (0, import_react.useState)([]);
	const [activityLog, setActivityLog] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (newCount > 0) {
			setPulse(true);
			const t = setTimeout(() => setPulse(false), 1200);
			return () => clearTimeout(t);
		}
	}, [newCount]);
	(0, import_react.useEffect)(() => {
		const load = async () => {
			const weekAgo = /* @__PURE__ */ new Date();
			weekAgo.setDate(weekAgo.getDate() - 7);
			const [profilesCount, newProfilesCount, catalogCount, newCatalogCount, trackerRows, reviewCount, auditRows] = await Promise.all([
				supabase.from("profiles").select("id", {
					count: "exact",
					head: true
				}),
				supabase.from("profiles").select("id", {
					count: "exact",
					head: true
				}).gte("created_at", weekAgo.toISOString()),
				supabase.from("catalog_items").select("id", {
					count: "exact",
					head: true
				}),
				supabase.from("catalog_items").select("id", {
					count: "exact",
					head: true
				}).gte("created_at", weekAgo.toISOString()),
				supabase.from("user_item_tracking").select("id, category, created_at, updated_at"),
				supabase.from("user_item_tracking").select("id", {
					count: "exact",
					head: true
				}).not("review", "is", null).neq("review", ""),
				supabase.from("admin_audit_logs").select("*").order("created_at", { ascending: false }).limit(5)
			]);
			const trackerData = trackerRows.data ?? [];
			setKpiCards([
				{
					label: "Usuarios totales",
					value: (profilesCount.count ?? 0).toLocaleString(),
					delta: `+${newProfilesCount.count ?? 0} esta semana`,
					icon: "ri-group-line",
					bg: "bg-violet-950/40",
					accent: "#8b5cf6",
					border: "border-violet-900/50"
				},
				{
					label: "Items en catalogo",
					value: (catalogCount.count ?? 0).toLocaleString(),
					delta: `+${newCatalogCount.count ?? 0} esta semana`,
					icon: "ri-database-2-line",
					bg: "bg-rose-950/40",
					accent: "#f43f5e",
					border: "border-rose-900/50"
				},
				{
					label: "Resenas totales",
					value: (reviewCount.count ?? 0).toLocaleString(),
					delta: `${pendingCount} reportes pendientes`,
					icon: "ri-quill-pen-line",
					bg: "bg-amber-950/40",
					accent: "#f59e0b",
					border: "border-amber-900/50"
				},
				{
					label: "Trackers activos",
					value: trackerData.length.toLocaleString(),
					delta: `${trackerData.filter((row) => Date.now() - new Date(row.updated_at).getTime() < 1440 * 60 * 1e3).length} activos hoy`,
					icon: "ri-bar-chart-box-line",
					bg: "bg-emerald-950/40",
					accent: "#10b981",
					border: "border-emerald-900/50"
				}
			]);
			const today = /* @__PURE__ */ new Date();
			const start = new Date(today);
			start.setDate(today.getDate() - 6);
			start.setHours(0, 0, 0, 0);
			const formatter = new Intl.DateTimeFormat("es-ES", { weekday: "short" });
			setWeeklySignups(Array.from({ length: 7 }, (_, index) => {
				const day = new Date(start);
				day.setDate(start.getDate() + index);
				const nextDay = new Date(day);
				nextDay.setDate(day.getDate() + 1);
				const count = trackerData.filter((row) => {
					const created = new Date(row.created_at).getTime();
					return created >= day.getTime() && created < nextDay.getTime();
				}).length;
				return {
					day: formatter.format(day).slice(0, 1).toUpperCase(),
					count
				};
			}));
			const byCategory = /* @__PURE__ */ new Map();
			trackerData.forEach((row) => byCategory.set(row.category, (byCategory.get(row.category) ?? 0) + 1));
			const totalTracked = Math.max(trackerData.length, 1);
			setCategoryDistribution(CATEGORIES.map((cat) => {
				const count = byCategory.get(cat.id) ?? 0;
				return {
					id: cat.id,
					pct: Math.round(count / totalTracked * 100),
					count: compactNumber(count)
				};
			}));
			setActivityLog((auditRows.data ?? []).map((log) => ({
				id: log.id,
				action: `${log.action} ${log.entity}`,
				detail: log.entity_id ?? "Sin identificador",
				time: new Date(log.created_at).toLocaleString("es-ES"),
				icon: "ri-shield-check-line",
				color: "text-violet-400"
			})));
		};
		load();
	}, [pendingCount, CATEGORIES]);
	const maxSignups = Math.max(...weeklySignups.map((d) => d.count), 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			pendingCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `flex items-center justify-between gap-4 px-5 py-4 rounded-2xl border transition-all duration-500 ${newCount > 0 ? "bg-rose-950/40 border-rose-800/60" : "bg-amber-950/30 border-amber-900/50"} ${pulse ? "scale-[1.01]" : "scale-100"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `relative w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 ${newCount > 0 ? "bg-rose-500/20" : "bg-amber-500/20"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `ri-flag-2-line text-lg ${newCount > 0 ? "text-rose-400" : "text-amber-400"}` }), newCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold animate-bounce",
							children: newCount
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `text-sm font-bold ${newCount > 0 ? "text-rose-300" : "text-amber-300"}`,
						children: newCount > 0 ? `${newCount} reporte${newCount > 1 ? "s" : ""} nuevo${newCount > 1 ? "s" : ""} sin revisar` : `${pendingCount} reporte${pendingCount > 1 ? "s" : ""} pendiente${pendingCount > 1 ? "s" : ""} de revision`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-zinc-500 mt-0.5",
						children: "Usuarios han reportado problemas en items del catalogo"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-shrink-0",
					children: [newCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: markAllSeen,
						className: "text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer whitespace-nowrap",
						children: "Marcar vistos"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/reports",
						className: `flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${newCount > 0 ? "bg-rose-500 hover:bg-rose-600 text-white" : "bg-amber-500/20 hover:bg-amber-500/30 text-amber-400"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-line" }), "Ver reportes"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
				children: kpiCards.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `rounded-2xl border ${card.border} ${card.bg} p-5`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-10 h-10 flex items-center justify-center rounded-xl bg-white/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
									className: `${card.icon} text-lg`,
									style: { color: card.accent }
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-zinc-500 font-medium",
								children: card.delta
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xl md:text-3xl font-black text-white mb-1",
							style: { fontFamily: "'Space Grotesk', sans-serif" },
							children: card.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-zinc-400",
							children: card.label
						})
					]
				}, card.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2 bg-zinc-900 rounded-2xl border border-zinc-800 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between mb-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-white text-sm",
							children: "Entradas creadas esta semana"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-zinc-500 mt-0.5",
							children: [
								"Total: ",
								weeklySignups.reduce((a, b) => a + b.count, 0),
								" nuevas entradas"
							]
						})] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-end justify-between gap-2 h-32",
						children: weeklySignups.map((day) => {
							const pct = day.count / maxSignups * 100;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center gap-2 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-500",
										children: day.count
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-full flex items-end justify-center",
										style: { height: "80px" },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-full rounded-t-lg transition-all duration-500",
											style: {
												height: `${pct}%`,
												minHeight: day.count > 0 ? "6px" : "0",
												background: "linear-gradient(to top, #8b5cf6, #f43f5e)",
												opacity: day.count > 0 ? 1 : .15
											}
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-500 font-medium",
										children: day.day
									})
								]
							}, day.day);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-zinc-900 rounded-2xl border border-zinc-800 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-white text-sm mb-5",
						children: "Distribucion por categoria"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-3",
						children: categoryDistribution.map((cd) => {
							const cat = CATEGORIES.find((c) => c.id === cd.id);
							if (!cat) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
										className: `${cat.icon} text-sm`,
										style: { color: cat.accent }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-300",
										children: cat.label
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-500",
										children: cd.count
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-semibold text-zinc-300",
										children: [cd.pct, "%"]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1.5 bg-zinc-800 rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full",
									style: {
										width: `${cd.pct}%`,
										background: cat.accent
									}
								})
							})] }, cd.id);
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-6 py-4 border-b border-zinc-800 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-white text-sm",
						children: "Actividad reciente del sistema"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-zinc-500",
						children: "Auditoria"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-zinc-800",
					children: activityLog.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-6 py-8 text-sm text-zinc-500 text-center",
						children: "Sin actividad registrada"
					}) : activityLog.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 px-6 py-3.5 hover:bg-white/5 transition-colors",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 flex-shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${log.icon} text-sm ${log.color}` })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold text-white",
									children: log.action
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-zinc-500 truncate",
									children: log.detail
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-zinc-600 flex-shrink-0",
								children: log.time
							})
						]
					}, log.id))
				})]
			})
		]
	});
}
//#endregion
//#region src/lib/audit.ts
/**
* Writes a record to admin_audit_logs.
* Fire-and-forget: errors are silently swallowed so they never break the main flow.
*/
async function auditLog(action, entity, entityId, payload) {
	try {
		const { data: sessionData } = await supabase.auth.getSession();
		const actorId = sessionData?.session?.user?.id ?? null;
		await supabase.from("admin_audit_logs").insert({
			actor_id: actorId,
			action,
			entity,
			entity_id: entityId,
			payload: payload ?? null
		});
	} catch {}
}
//#endregion
//#region src/hooks/useAdminUsers.ts
var ACCENTS$1 = [
	"#8b5cf6",
	"#f43f5e",
	"#10b981",
	"#f59e0b",
	"#0ea5e9",
	"#ec4899",
	"#6366f1",
	"#14b8a6"
];
function formatDate$1(date) {
	if (!date) return "Sin fecha";
	return new Date(date).toLocaleDateString("es-ES", {
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
}
function initialsFrom(value) {
	return value.split(/[\s._-]+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "US";
}
function useAdminUsers() {
	const [users, setUsers] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [savingId, setSavingId] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const fetchUsers = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		try {
			const { data: profiles, error: profilesError } = await supabase.from("profiles").select("id, username, display_name, initials, email, role, status, created_at, updated_at").order("created_at", { ascending: false });
			if (profilesError) throw profilesError;
			const ids = (profiles ?? []).map((profile) => profile.id);
			const [trackingRes, reviewsRes] = await Promise.all([ids.length ? supabase.from("user_item_tracking").select("user_id, review").in("user_id", ids) : Promise.resolve({
				data: [],
				error: null
			}), ids.length ? supabase.from("user_item_tracking").select("user_id").in("user_id", ids).not("review", "is", null) : Promise.resolve({
				data: [],
				error: null
			})]);
			if (trackingRes.error) throw trackingRes.error;
			if (reviewsRes.error) throw reviewsRes.error;
			const trackedCounts = /* @__PURE__ */ new Map();
			const reviewCounts = /* @__PURE__ */ new Map();
			(trackingRes.data ?? []).forEach((row) => {
				trackedCounts.set(row.user_id, (trackedCounts.get(row.user_id) ?? 0) + 1);
			});
			(reviewsRes.data ?? []).forEach((row) => {
				reviewCounts.set(row.user_id, (reviewCounts.get(row.user_id) ?? 0) + 1);
			});
			setUsers((profiles ?? []).map((profile, index) => {
				const displayName = profile.display_name || profile.username || profile.email?.split("@")[0] || "Usuario";
				return {
					id: profile.id,
					username: profile.username || profile.email?.split("@")[0] || "usuario",
					display_name: displayName,
					initials: profile.initials || initialsFrom(displayName),
					email: profile.email,
					role: profile.role ?? "user",
					status: profile.status ?? "active",
					joined: formatDate$1(profile.created_at),
					last_active: formatDate$1(profile.updated_at),
					tracked_items: trackedCounts.get(profile.id) ?? 0,
					reviews: reviewCounts.get(profile.id) ?? 0,
					accent: ACCENTS$1[index % ACCENTS$1.length]
				};
			}));
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		fetchUsers();
	}, [fetchUsers]);
	const updateUser = (0, import_react.useCallback)(async (id, updates) => {
		setSavingId(id);
		setError(null);
		const previous = users.find((user) => user.id === id);
		setUsers((prev) => prev.map((user) => user.id === id ? {
			...user,
			...updates
		} : user));
		try {
			const { error: updateError } = await supabase.from("profiles").update(updates).eq("id", id);
			if (updateError) throw updateError;
			await auditLog("update", "profiles", id, updates);
		} catch (err) {
			if (previous) setUsers((prev) => prev.map((user) => user.id === id ? previous : user));
			setError(err.message);
		} finally {
			setSavingId(null);
		}
	}, [users]);
	return {
		users,
		stats: (0, import_react.useMemo)(() => ({
			total: users.length,
			active: users.filter((user) => user.status === "active").length,
			suspended: users.filter((user) => user.status === "suspended").length,
			pending: users.filter((user) => user.status === "pending").length
		}), [users]),
		loading,
		savingId,
		error,
		refresh: fetchUsers,
		updateUser
	};
}
//#endregion
//#region src/pages/admin/components/AdminUsers.tsx
var STATUS_BADGE$1 = {
	active: "bg-emerald-500/20 text-emerald-400",
	suspended: "bg-rose-500/20 text-rose-400",
	pending: "bg-amber-500/20 text-amber-400"
};
var STATUS_LABEL$1 = {
	active: "Activo",
	suspended: "Suspendido",
	pending: "Pendiente"
};
function AdminUsers() {
	const { users, stats, loading, savingId, error, refresh, updateUser } = useAdminUsers();
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [roleFilter, setRoleFilter] = (0, import_react.useState)("all");
	const [actionUser, setActionUser] = (0, import_react.useState)(null);
	const filtered = users.filter((user) => {
		const query = search.toLowerCase();
		const matchSearch = user.display_name.toLowerCase().includes(query) || user.username.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
		const matchStatus = statusFilter === "all" || user.status === statusFilter;
		const matchRole = roleFilter === "all" || user.role === roleFilter;
		return matchSearch && matchStatus && matchRole;
	});
	const toggleSuspend = (user) => {
		updateUser(user.id, { status: user.status === "suspended" ? "active" : "suspended" });
		setActionUser(null);
	};
	const toggleRole = (user) => {
		updateUser(user.id, { role: user.role === "admin" ? "user" : "admin" });
		setActionUser(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-rose-300",
					children: error
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => void refresh(),
					className: "text-xs font-semibold text-rose-200 hover:text-white",
					children: "Reintentar"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Buscar por nombre, usuario o email...",
						className: "w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: statusFilter,
						onChange: (e) => setStatusFilter(e.target.value),
						className: "px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 focus:outline-none cursor-pointer",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "Todos los estados"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "active",
								children: "Activos"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "suspended",
								children: "Suspendidos"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "pending",
								children: "Pendientes"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: roleFilter,
						onChange: (e) => setRoleFilter(e.target.value),
						className: "px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 focus:outline-none cursor-pointer",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "Todos los roles"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "admin",
								children: "Admin"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "user",
								children: "Usuario"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-4 text-xs text-zinc-500",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [filtered.length, " usuarios encontrados"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-emerald-400",
						children: [stats.active, " activos"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-rose-400",
						children: [stats.suspended, " suspendidos"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-amber-400",
						children: [stats.pending, " pendientes"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-12 gap-4 border-b border-zinc-800 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-span-4",
								children: "Usuario"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-span-2 hidden md:block",
								children: "Rol"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-span-2 hidden lg:block",
								children: "Estado"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-span-2 hidden lg:block",
								children: "Tracker"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-span-2 hidden md:block",
								children: "Última actividad"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-span-2 text-right md:col-span-2 lg:col-span-2",
								children: "Acciones"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "divide-y divide-zinc-800",
						children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center py-16 text-zinc-500",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-loader-4-line mr-2 animate-spin" }), "Cargando usuarios..."]
						}), !loading && filtered.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-12 items-center gap-4 px-5 py-4 transition-colors hover:bg-white/5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-6 flex min-w-0 items-center gap-3 md:col-span-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
										style: { background: user.accent },
										children: user.initials
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-semibold text-white",
											children: user.display_name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "truncate text-xs text-zinc-500",
											children: ["@", user.username]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-span-2 hidden md:block",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded-full px-2.5 py-1 text-xs font-semibold ${user.role === "admin" ? "bg-violet-500/20 text-violet-400" : "bg-zinc-700 text-zinc-400"}`,
										children: user.role === "admin" ? "Admin" : "Usuario"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-span-2 hidden lg:block",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE$1[user.status]}`,
										children: STATUS_LABEL$1[user.status]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 hidden lg:block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-zinc-300",
										children: [user.tracked_items, " ítems"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-zinc-600",
										children: [user.reviews, " reseñas"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-span-2 hidden md:block",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-zinc-500",
										children: user.last_active
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative col-span-6 flex items-center justify-end gap-1 md:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setActionUser(actionUser?.id === user.id ? null : user),
										disabled: savingId === user.id,
										className: "flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white disabled:opacity-50",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: savingId === user.id ? "ri-loader-4-line animate-spin text-sm" : "ri-more-2-fill text-sm" })
									}), actionUser?.id === user.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800 shadow-xl",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => toggleRole(user),
											className: "flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-700",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-shield-user-line text-violet-400" }), user.role === "admin" ? "Quitar admin" : "Hacer admin"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => toggleSuspend(user),
											className: `flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors hover:bg-zinc-700 ${user.status === "suspended" ? "text-emerald-400" : "text-rose-400"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: user.status === "suspended" ? "ri-user-follow-line" : "ri-user-forbid-line" }), user.status === "suspended" ? "Reactivar" : "Suspender"]
										})]
									})]
								})
							]
						}, user.id))]
					}),
					!loading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-16 text-center text-zinc-600",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-user-search-line mb-2 block text-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: "No se encontraron usuarios"
						})]
					})
				]
			})
		]
	});
}
//#endregion
//#region src/hooks/useAdminCatalog.ts
var EDGE_URL = edgeFunctionUrl("admin-catalog");
var EMPTY_CATALOG_FORM = {
	title: "",
	category: "videojuegos",
	description: "",
	image_url: "",
	release_date: "",
	metadata_raw: ""
};
async function getAuthHeaders() {
	const { data } = await supabase.auth.getSession();
	const token = data.session?.access_token;
	return {
		"Content-Type": "application/json",
		...token ? { Authorization: `Bearer ${token}` } : {}
	};
}
function useAdminCatalog() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [total, setTotal] = (0, import_react.useState)(0);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("all");
	const [page, setPage] = (0, import_react.useState)(1);
	const fetchItems = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		try {
			const headers = await getAuthHeaders();
			const params = new URLSearchParams({ page: String(page) });
			if (search) params.set("search", search);
			if (categoryFilter !== "all") params.set("category", categoryFilter);
			const res = await fetch(`${EDGE_URL}?${params}`, { headers });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const json = await res.json();
			setItems(json.data ?? []);
			setTotal(json.count ?? 0);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, [
		search,
		categoryFilter,
		page
	]);
	(0, import_react.useEffect)(() => {
		fetchItems();
	}, [fetchItems]);
	const createItem = async (form) => {
		setSaving(true);
		try {
			const headers = await getAuthHeaders();
			let metadata = {};
			if (form.metadata_raw.trim()) metadata = JSON.parse(form.metadata_raw);
			const res = await fetch(EDGE_URL, {
				method: "POST",
				headers,
				body: JSON.stringify({
					title: form.title,
					category: form.category,
					description: form.description || null,
					image_url: form.image_url || null,
					release_date: form.release_date || null,
					metadata
				})
			});
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.error ?? `HTTP ${res.status}`);
			}
			await auditLog("create", "catalog_items", (await res.json().catch(() => ({})))?.id ?? "unknown", {
				title: form.title,
				category: form.category
			});
			await fetchItems();
			return true;
		} catch (err) {
			setError(err.message);
			return false;
		} finally {
			setSaving(false);
		}
	};
	const updateItem = async (id, form) => {
		setSaving(true);
		try {
			const headers = await getAuthHeaders();
			let metadata = {};
			if (form.metadata_raw.trim()) metadata = JSON.parse(form.metadata_raw);
			const res = await fetch(`${EDGE_URL}?id=${id}`, {
				method: "PATCH",
				headers,
				body: JSON.stringify({
					title: form.title,
					category: form.category,
					description: form.description || null,
					image_url: form.image_url || null,
					release_date: form.release_date || null,
					metadata
				})
			});
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.error ?? `HTTP ${res.status}`);
			}
			await auditLog("update", "catalog_items", id, {
				title: form.title,
				category: form.category
			});
			await fetchItems();
			return true;
		} catch (err) {
			setError(err.message);
			return false;
		} finally {
			setSaving(false);
		}
	};
	const deleteItem = async (id) => {
		try {
			const headers = await getAuthHeaders();
			const target = items.find((i) => i.id === id);
			const res = await fetch(`${EDGE_URL}?id=${id}`, {
				method: "DELETE",
				headers
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			await auditLog("delete", "catalog_items", id, {
				title: target?.title ?? null,
				category: target?.category ?? null
			});
			setItems((prev) => prev.filter((i) => i.id !== id));
			setTotal((prev) => prev - 1);
			return true;
		} catch (err) {
			setError(err.message);
			return false;
		}
	};
	return {
		items,
		total,
		loading,
		saving,
		error,
		search,
		setSearch,
		categoryFilter,
		setCategoryFilter,
		page,
		setPage,
		fetchItems,
		createItem,
		updateItem,
		deleteItem
	};
}
//#endregion
//#region src/hooks/useAdminItemEntities.ts
var AVAILABLE_ROLES = Object.entries(ROLE_CONFIG).map(([value, conf]) => ({
	value,
	label: conf.label,
	icon: conf.icon,
	color: conf.color
}));
function useAdminItemEntities(itemId) {
	const [linked, setLinked] = (0, import_react.useState)([]);
	const [loadingLinked, setLoadingLinked] = (0, import_react.useState)(false);
	const [searchResults, setSearchResults] = (0, import_react.useState)([]);
	const [searching, setSearching] = (0, import_react.useState)(false);
	const [linking, setLinking] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const fetchLinked = (0, import_react.useCallback)(async () => {
		if (!itemId) {
			setLinked([]);
			return;
		}
		setLoadingLinked(true);
		try {
			const { data, error: dbErr } = await supabase.from("item_entities").select(`
          role,
          entity_id,
          entities (
            id, name, slug, type, image
          )
        `).eq("item_id", itemId);
			if (dbErr) throw dbErr;
			const result = (data ?? []).filter((r) => r.entities).map((r) => ({
				linkId: `${itemId}|${r.entity_id}|${r.role}`,
				entityId: r.entity_id,
				name: r.entities.name,
				slug: r.entities.slug,
				type: r.entities.type,
				image: r.entities.image ?? null,
				role: r.role
			}));
			result.sort((a, b) => {
				return (ROLE_CONFIG[a.role]?.priority ?? 99) - (ROLE_CONFIG[b.role]?.priority ?? 99);
			});
			setLinked(result);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoadingLinked(false);
		}
	}, [itemId]);
	(0, import_react.useEffect)(() => {
		fetchLinked();
	}, [fetchLinked]);
	return {
		linked,
		loadingLinked,
		searchResults,
		searching,
		linking,
		error,
		setError,
		searchEntities: (0, import_react.useCallback)(async (query) => {
			if (!query.trim()) {
				setSearchResults([]);
				return;
			}
			setSearching(true);
			try {
				const { data, error: dbErr } = await supabase.from("entities").select("id, name, slug, type, image, bio").ilike("name", `%${query.trim()}%`).order("name").limit(20);
				if (dbErr) throw dbErr;
				setSearchResults(data ?? []);
			} catch (err) {
				setError(err.message);
			} finally {
				setSearching(false);
			}
		}, []),
		linkEntity: (0, import_react.useCallback)(async (entityId, role) => {
			if (!itemId) return false;
			if (linked.some((l) => l.entityId === entityId && l.role === role)) {
				setError("Esta entidad ya está vinculada con ese rol");
				return false;
			}
			setLinking(true);
			setError(null);
			try {
				const { error: dbErr } = await supabase.from("item_entities").insert({
					item_id: itemId,
					entity_id: entityId,
					role
				});
				if (dbErr) throw dbErr;
				await auditLog("link_entity", "item_entities", `${itemId}|${entityId}`, {
					item_id: itemId,
					entity_id: entityId,
					role
				});
				await fetchLinked();
				return true;
			} catch (err) {
				setError(err.message);
				return false;
			} finally {
				setLinking(false);
			}
		}, [
			itemId,
			linked,
			fetchLinked
		]),
		unlinkEntity: (0, import_react.useCallback)(async (entityId, role) => {
			if (!itemId) return false;
			try {
				const { error: dbErr } = await supabase.from("item_entities").delete().eq("item_id", itemId).eq("entity_id", entityId).eq("role", role);
				if (dbErr) throw dbErr;
				await auditLog("unlink_entity", "item_entities", `${itemId}|${entityId}`, {
					item_id: itemId,
					entity_id: entityId,
					role
				});
				setLinked((prev) => prev.filter((l) => !(l.entityId === entityId && l.role === role)));
				return true;
			} catch (err) {
				setError(err.message);
				return false;
			}
		}, [itemId]),
		fetchLinked
	};
}
//#endregion
//#region src/pages/admin/components/ItemEntitiesEditor.tsx
function RoleSelector({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-4 gap-1.5",
		children: AVAILABLE_ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => onChange(r.value),
			className: `flex flex-col items-center gap-1 p-2 rounded-lg border text-center transition-all cursor-pointer ${value === r.value ? "border-white/30 bg-white/10" : "border-zinc-700 bg-zinc-800 hover:bg-zinc-700"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-4 h-4 flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
					className: `${r.icon} text-xs`,
					style: { color: r.color }
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] text-zinc-300 leading-tight",
				children: r.label
			})]
		}, r.value))
	});
}
function SearchResultRow({ entity, selectedRole, onLink, linking }) {
	const roleConf = ROLE_CONFIG[entity.type] ?? ROLE_CONFIG["creator"];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 hover:border-zinc-600 transition-colors",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-9 h-9 rounded-lg overflow-hidden flex-shrink-0",
				children: entity.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: entity.image,
					alt: entity.name,
					className: "w-full h-full object-cover object-top"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full h-full flex items-center justify-center",
					style: { background: `${roleConf?.color ?? "#71717a"}20` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
						className: `${roleConf?.icon ?? "ri-user-line"} text-sm`,
						style: { color: roleConf?.color ?? "#71717a" }
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold text-white truncate",
					children: entity.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-zinc-500 truncate",
					children: [
						entity.type,
						" · ",
						entity.slug
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => onLink(entity.id),
				disabled: linking,
				className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-zinc-900 text-xs font-bold hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0",
				children: [linking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-3 h-3 border border-zinc-400 border-t-zinc-900 rounded-full animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-link text-xs" }), "Vincular"]
			})
		]
	});
}
function LinkedEntityChip({ name, image, type, role, onUnlink }) {
	const roleConf = ROLE_CONFIG[role] ?? ROLE_CONFIG["creator"];
	const typeConf = ROLE_CONFIG[type] ?? roleConf;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2.5 px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 group",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-8 h-8 rounded-lg overflow-hidden flex-shrink-0",
				children: image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: image,
					alt: name,
					className: "w-full h-full object-cover object-top"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full h-full flex items-center justify-center",
					style: { background: `${typeConf.color}20` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
						className: `${typeConf.icon} text-xs`,
						style: { color: typeConf.color }
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold text-white truncate",
					children: name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 mt-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-3 h-3 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
							className: `${roleConf.icon} text-[10px]`,
							style: { color: roleConf.color }
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-medium",
						style: { color: roleConf.color },
						children: roleConf.label
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onUnlink,
				className: "w-6 h-6 flex items-center justify-center rounded-md text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 flex-shrink-0",
				title: "Desvincular",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-line text-xs" })
			})
		]
	});
}
function ItemEntitiesEditor({ itemId }) {
	const { linked, loadingLinked, searchResults, searching, linking, error, setError, searchEntities, linkEntity, unlinkEntity } = useAdminItemEntities(itemId);
	const [query, setQuery] = (0, import_react.useState)("");
	const [selectedRole, setSelectedRole] = (0, import_react.useState)("actor");
	const [showSearch, setShowSearch] = (0, import_react.useState)(false);
	const [toast, setToast] = (0, import_react.useState)(null);
	const debounceRef = (0, import_react.useRef)(null);
	const searchRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		if (query.trim().length >= 2) debounceRef.current = setTimeout(() => searchEntities(query), 350);
		else searchEntities("");
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [query, searchEntities]);
	(0, import_react.useEffect)(() => {
		const handler = (e) => {
			if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);
	(0, import_react.useEffect)(() => {
		if (error) {
			setToast({
				msg: error,
				type: "err"
			});
			setError(null);
			setTimeout(() => setToast(null), 3e3);
		}
	}, [error, setError]);
	const handleLink = async (entityId) => {
		if (await linkEntity(entityId, selectedRole)) {
			setToast({
				msg: "Entidad vinculada correctamente",
				type: "ok"
			});
			setTimeout(() => setToast(null), 2500);
			setQuery("");
			setShowSearch(false);
		}
	};
	const handleUnlink = async (entityId, role) => {
		await unlinkEntity(entityId, role);
	};
	const groupedLinked = linked.reduce((acc, e) => {
		if (!acc[e.role]) acc[e.role] = [];
		acc[e.role].push(e);
		return acc;
	}, {});
	const roleOrder = [
		"director",
		"developer",
		"author",
		"artist",
		"creator",
		"studio",
		"publisher",
		"actor"
	];
	const sortedRoles = Object.keys(groupedLinked).sort((a, b) => {
		const ia = roleOrder.indexOf(a);
		const ib = roleOrder.indexOf(b);
		return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-5 h-5 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-user-star-line text-sm text-zinc-400" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-zinc-400 uppercase tracking-wider",
							children: "Entidades vinculadas"
						}),
						linked.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full font-medium",
							children: linked.length
						})
					]
				})
			}),
			toast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${toast.type === "ok" ? "bg-emerald-900/50 border border-emerald-800 text-emerald-300" : "bg-rose-900/50 border border-rose-800 text-rose-300"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: toast.type === "ok" ? "ri-checkbox-circle-line" : "ri-error-warning-line" }), toast.msg]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-zinc-500 mb-2",
				children: "Rol para la próxima vinculación:"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleSelector, {
				value: selectedRole,
				onChange: setSelectedRole
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: searchRef,
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (e) => {
								setQuery(e.target.value);
								setShowSearch(true);
							},
							onFocus: () => setShowSearch(true),
							placeholder: "Buscar entidad por nombre...",
							className: "w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
						}),
						searching && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute right-3 top-1/2 -translate-y-1/2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-4 h-4 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin" })
						})
					]
				}), showSearch && query.trim().length >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-700 rounded-xl z-30 overflow-hidden max-h-64 overflow-y-auto",
					children: searching && searchResults.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-4 py-3 text-xs text-zinc-500 text-center",
						children: "Buscando..."
					}) : searchResults.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-4 py-3 text-xs text-zinc-500 text-center",
						children: "Sin resultados — prueba otro nombre o crea la entidad primero"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2 flex flex-col gap-1.5",
						children: searchResults.map((entity) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchResultRow, {
							entity,
							selectedRole,
							onLink: handleLink,
							linking
						}, entity.id))
					})
				})]
			}),
			loadingLinked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-2",
				children: [
					1,
					2,
					3
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 rounded-xl bg-zinc-800 animate-pulse" }, i))
			}) : linked.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-2 py-6 border border-dashed border-zinc-700 rounded-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-user-star-line text-zinc-600 text-sm" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-zinc-600 text-center",
					children: [
						"Sin entidades vinculadas todavía.",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Busca y añade directores, actores, desarrolladores..."
					]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-3",
				children: sortedRoles.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 mb-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-4 h-4 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
								className: `${ROLE_CONFIG[role]?.icon ?? "ri-user-line"} text-xs`,
								style: { color: ROLE_CONFIG[role]?.color ?? "#71717a" }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-bold uppercase tracking-wider text-zinc-500",
							children: ROLE_CONFIG[role]?.label ?? role
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] text-zinc-700",
							children: [
								"(",
								groupedLinked[role].length,
								")"
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-1.5",
					children: groupedLinked[role].map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkedEntityChip, {
						name: e.name,
						image: e.image,
						type: e.type,
						role: e.role,
						onUnlink: () => handleUnlink(e.entityId, e.role)
					}, e.linkId))
				})] }, role))
			})
		]
	});
}
//#endregion
//#region src/pages/admin/components/AdminCatalog.tsx
var CATEGORIES = [
	{
		id: "videojuegos",
		label: "Videojuegos",
		icon: "ri-gamepad-line",
		color: "#8b5cf6"
	},
	{
		id: "peliculas",
		label: "Películas",
		icon: "ri-film-line",
		color: "#f43f5e"
	},
	{
		id: "series",
		label: "Series",
		icon: "ri-tv-2-line",
		color: "#f59e0b"
	},
	{
		id: "libros",
		label: "Libros",
		icon: "ri-book-open-line",
		color: "#10b981"
	},
	{
		id: "conciertos",
		label: "Conciertos",
		icon: "ri-music-2-line",
		color: "#ec4899"
	}
];
var CAT_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
function MetaHint({ category }) {
	const hint = {
		videojuegos: "{\"rating\": 4.5, \"developers\": [\"Rockstar\"], \"publishers\": [\"Take-Two\"]}",
		peliculas: "{\"rating\": 8.2, \"director\": \"Nolan\", \"cast\": [\"Cillian Murphy\"]}",
		series: "{\"rating\": 9.0, \"seasons\": 5, \"network\": \"HBO\"}",
		libros: "{\"rating\": 4.8, \"pages\": 320, \"genre\": \"Sci-Fi\"}",
		conciertos: "{\"venue\": \"Madison Square Garden\", \"city\": \"New York\"}"
	}[category];
	if (!hint) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-xs text-zinc-600 mt-1 font-mono truncate",
		children: ["Ej: ", hint]
	});
}
function ItemModal({ editTarget, saving, onClose, onSave }) {
	const [form, setForm] = (0, import_react.useState)(editTarget ? {
		title: editTarget.title,
		category: editTarget.category,
		description: editTarget.description ?? "",
		image_url: editTarget.image_url ?? "",
		release_date: editTarget.release_date ?? "",
		metadata_raw: editTarget.metadata ? JSON.stringify(editTarget.metadata, null, 2) : ""
	} : EMPTY_CATALOG_FORM);
	const [metaError, setMetaError] = (0, import_react.useState)("");
	const [activeTab, setActiveTab] = (0, import_react.useState)("info");
	const handleSave = async () => {
		if (!form.title.trim()) return;
		if (form.metadata_raw.trim()) try {
			JSON.parse(form.metadata_raw);
		} catch {
			setMetaError("JSON inválido — revisa la sintaxis");
			return;
		}
		setMetaError("");
		await onSave(form);
	};
	const isEdit = !!editTarget;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-black/70",
			onClick: () => !saving && onClose()
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-2xl max-h-[92vh] flex flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-6 py-5 border-b border-zinc-800 flex-shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-white font-bold",
						style: { fontFamily: "'Space Grotesk', sans-serif" },
						children: isEdit ? "Editar ítem" : "Nuevo ítem del catálogo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-zinc-500 mt-0.5",
						children: isEdit ? `Editando: ${editTarget.title}` : "Crea un ítem manualmente"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => !saving && onClose(),
						className: "w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-line text-lg" })
					})]
				}),
				false,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto",
					children: [activeTab === "info" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-6 py-5 flex flex-col gap-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs font-semibold text-zinc-400 mb-1.5",
								children: ["Título ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-rose-400",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.title,
								onChange: (e) => setForm((f) => ({
									...f,
									title: e.target.value
								})),
								placeholder: "Ej: The Last of Us, Dune, 1984...",
								className: "w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs font-semibold text-zinc-400 mb-1.5",
								children: ["Categoría ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-rose-400",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-5 gap-2",
								children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setForm((f) => ({
										...f,
										category: c.id
									})),
									className: `flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all cursor-pointer ${form.category === c.id ? "border-white/30 bg-white/10" : "border-zinc-700 bg-zinc-800 hover:bg-zinc-700"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-5 h-5 flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
											className: `${c.icon} text-sm`,
											style: { color: c.color }
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-300 leading-tight text-center",
										children: c.label
									})]
								}, c.id))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-zinc-400 mb-1.5",
									children: "URL de imagen / portada"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: form.image_url,
									onChange: (e) => setForm((f) => ({
										...f,
										image_url: e.target.value
									})),
									placeholder: "https://...",
									className: "w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
								}),
								form.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 h-14 rounded-lg overflow-hidden border border-zinc-700 flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: form.image_url,
											alt: "preview",
											className: "w-full h-full object-cover object-top",
											onError: (e) => {
												e.target.style.display = "none";
											}
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-500",
										children: "Vista previa"
									})]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-zinc-400 mb-1.5",
								children: "Fecha de lanzamiento"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: form.release_date,
								onChange: (e) => setForm((f) => ({
									...f,
									release_date: e.target.value
								})),
								className: "w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-zinc-400 mb-1.5",
									children: "Descripción"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: form.description,
									onChange: (e) => setForm((f) => ({
										...f,
										description: e.target.value
									})),
									placeholder: "Descripción del ítem...",
									rows: 3,
									maxLength: 500,
									className: "w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-zinc-600 mt-1 text-right",
									children: [form.description.length, "/500"]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-xs font-semibold text-zinc-400 mb-1.5",
									children: ["Metadata ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-zinc-600",
										children: "(JSON opcional)"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: form.metadata_raw,
									onChange: (e) => {
										setForm((f) => ({
											...f,
											metadata_raw: e.target.value
										}));
										setMetaError("");
									},
									placeholder: "{\n  \"rating\": 9.0,\n  \"genre\": \"Action\"\n}",
									rows: 4,
									className: `w-full px-4 py-2.5 rounded-xl bg-zinc-800 border text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 font-mono resize-none ${metaError ? "border-rose-500 focus:ring-rose-500/30" : "border-zinc-700 focus:ring-white/20"}`
								}),
								metaError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-rose-400 mt-1",
									children: metaError
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaHint, { category: form.category })
							] })
						]
					}), activeTab === "entities" && isEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-6 py-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemEntitiesEditor, { itemId: editTarget.id })
					})]
				}),
				activeTab === "info" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800 flex-shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => !saving && onClose(),
						disabled: saving,
						className: "px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-semibold hover:bg-zinc-700 transition-colors cursor-pointer disabled:opacity-50",
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleSave,
						disabled: saving || !form.title.trim(),
						className: "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-bold hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap",
						children: saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-4 h-4 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" }), "Guardando..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: isEdit ? "ri-save-line" : "ri-add-line" }), isEdit ? "Guardar cambios" : "Crear ítem"] })
					})]
				}),
				activeTab === "entities" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-6 py-4 border-t border-zinc-800 flex-shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-zinc-600",
						children: "Los cambios se guardan automáticamente"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-semibold hover:bg-zinc-700 transition-colors cursor-pointer",
						children: "Cerrar"
					})]
				})
			]
		})]
	});
}
function AdminCatalog() {
	const { items, total, loading, saving, error, search, setSearch, categoryFilter, setCategoryFilter, page, setPage, fetchItems, createItem, updateItem, deleteItem } = useAdminCatalog();
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	const [editTarget, setEditTarget] = (0, import_react.useState)(null);
	const [deleteConfirm, setDeleteConfirm] = (0, import_react.useState)(null);
	const [actionMenu, setActionMenu] = (0, import_react.useState)(null);
	const [toast, setToast] = (0, import_react.useState)(null);
	const actionRef = (0, import_react.useRef)(null);
	const showToast = (msg, type = "ok") => {
		setToast({
			msg,
			type
		});
		setTimeout(() => setToast(null), 3e3);
	};
	(0, import_react.useEffect)(() => {
		if (error) showToast(error, "err");
	}, [error]);
	(0, import_react.useEffect)(() => {
		const handler = (e) => {
			if (actionRef.current && !actionRef.current.contains(e.target)) setActionMenu(null);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);
	const openCreate = () => {
		setEditTarget(null);
		setModalOpen(true);
	};
	const openEdit = (item) => {
		setEditTarget(item);
		setActionMenu(null);
		setModalOpen(true);
	};
	const handleSave = async (form) => {
		let ok;
		if (editTarget) {
			ok = await updateItem(editTarget.id, form);
			if (ok) showToast("Ítem actualizado correctamente");
		} else {
			ok = await createItem(form);
			if (ok) showToast("Ítem creado correctamente");
		}
		if (ok) setModalOpen(false);
		else showToast("Error al guardar el ítem", "err");
	};
	const handleDelete = async (id) => {
		if (await deleteItem(id)) showToast("Ítem eliminado");
		else showToast("Error al eliminar", "err");
		setDeleteConfirm(null);
		setActionMenu(null);
	};
	const totalPages = Math.ceil(total / 30);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			toast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${toast.type === "ok" ? "bg-emerald-950 border-emerald-800 text-emerald-300" : "bg-rose-950 border-rose-800 text-rose-300"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: toast.type === "ok" ? "ri-checkbox-circle-line" : "ri-error-warning-line" }), toast.msg]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-white font-bold text-base",
					style: { fontFamily: "'Space Grotesk', sans-serif" },
					children: "Catálogo"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-zinc-500 mt-0.5",
					children: [total.toLocaleString(), " ítems en total · Gestiona el catálogo de Vaultly."]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: openCreate,
					className: "flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-bold hover:bg-zinc-100 transition-colors cursor-pointer whitespace-nowrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-add-line" }), "Nuevo ítem"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: search,
							onChange: (e) => {
								setSearch(e.target.value);
								setPage(1);
							},
							placeholder: "Buscar ítem por título...",
							className: "w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: categoryFilter,
						onChange: (e) => {
							setCategoryFilter(e.target.value);
							setPage(1);
						},
						className: "px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 focus:outline-none cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "Todas las categorías"
						}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c.id,
							children: c.label
						}, c.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: fetchItems,
						className: "px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer",
						title: "Recargar",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-refresh-line text-sm" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-12 gap-4 px-5 py-3 border-b border-zinc-800 text-xs font-semibold text-zinc-500 uppercase tracking-wider",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-6",
							children: "Ítem"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-2 hidden md:block",
							children: "Categoría"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-2 hidden lg:block",
							children: "Fuente"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-2 hidden lg:block",
							children: "Fecha"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-6 md:col-span-2 lg:col-span-1 text-right",
							children: "Acciones"
						})
					]
				}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-16 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto mb-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-zinc-500",
						children: "Cargando catálogo..."
					})]
				}) : items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-16 text-center text-zinc-600",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-database-2-line text-3xl mb-2 block" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: total === 0 ? "No hay ítems todavía — crea el primero" : "No se encontraron ítems"
						}),
						total === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: openCreate,
							className: "mt-4 px-4 py-2 rounded-xl bg-white text-zinc-900 text-sm font-bold hover:bg-zinc-100 transition-colors cursor-pointer",
							children: "Crear ítem"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-zinc-800",
					ref: actionRef,
					children: items.map((item) => {
						const cat = CAT_MAP[item.category];
						const rating = item.metadata?.rating;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-white/5 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-10 md:col-span-6 flex items-center gap-3 min-w-0",
									children: [item.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 h-14 rounded-lg overflow-hidden flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: item.image_url,
											alt: item.title,
											className: "w-full h-full object-cover object-top"
										})
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 h-14 rounded-lg flex items-center justify-center flex-shrink-0 bg-zinc-800 border border-zinc-700",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${cat?.icon ?? "ri-image-line"} text-zinc-600` })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-semibold text-white truncate",
												children: item.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 mt-0.5 flex-wrap",
												children: [item.release_date && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-zinc-500",
													children: item.release_date.slice(0, 4)
												}), rating !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-zinc-600",
													children: "·"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-0.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-xs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs text-zinc-400",
														children: Number(rating).toFixed(1)
													})]
												})] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-xs px-1.5 py-0.5 rounded font-medium mt-1 inline-block ${item.source === "manual" ? "bg-zinc-700 text-zinc-400" : "bg-sky-500/20 text-sky-400"}`,
												children: item.source === "manual" ? "Manual" : item.source.toUpperCase()
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-span-2 hidden md:flex items-center gap-1.5",
									children: cat && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-5 h-5 flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
											className: `${cat.icon} text-sm`,
											style: { color: cat.color }
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-400",
										children: cat.label
									})] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 hidden lg:block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-500 font-mono truncate block",
										children: item.source
									}), item.source_item_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-700 font-mono truncate block",
										children: item.source_item_id.slice(0, 12)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-span-2 hidden lg:block",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-500",
										children: item.release_date ?? "—"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 md:col-span-2 lg:col-span-1 flex items-center justify-end relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setActionMenu((prev) => prev === item.id ? null : item.id),
										className: "w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-more-2-fill text-sm" })
									}), actionMenu === item.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute right-0 top-full mt-1 w-44 bg-zinc-800 rounded-xl border border-zinc-700 z-20 overflow-hidden",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: `/catalog/${item.category}/${item.slug}`,
												target: "_blank",
												rel: "noopener noreferrer",
												className: "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-external-link-line" }), " Ver página"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => openEdit(item),
												className: "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer text-left",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-edit-line" }), " Editar"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => {
													setDeleteConfirm(item.id);
													setActionMenu(null);
												},
												className: "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:bg-zinc-700 transition-colors cursor-pointer text-left",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-delete-bin-line" }), " Eliminar"]
											})
										]
									})]
								})
							]
						}, item.id);
					})
				})]
			}),
			totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-zinc-500",
					children: [
						"Página ",
						page,
						" de ",
						totalPages,
						" · ",
						total.toLocaleString(),
						" ítems"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setPage((p) => Math.max(1, p - 1)),
						disabled: page === 1,
						className: "px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-left-s-line" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
						disabled: page === totalPages,
						className: "px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-s-line" })
					})]
				})]
			}),
			deleteConfirm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 bg-black/70",
					onClick: () => setDeleteConfirm(null)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 bg-zinc-900 rounded-2xl border border-zinc-800 p-6 w-full max-w-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center mx-auto mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-delete-bin-line text-rose-400 text-xl" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-white font-bold text-center mb-2",
							style: { fontFamily: "'Space Grotesk', sans-serif" },
							children: "¿Eliminar ítem?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-zinc-400 text-sm text-center mb-6",
							children: "Se eliminarán también sus entradas en el tracker de usuarios. Esta acción no se puede deshacer."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDeleteConfirm(null),
								className: "flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-semibold hover:bg-zinc-700 transition-colors cursor-pointer",
								children: "Cancelar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleDelete(deleteConfirm),
								className: "flex-1 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-colors cursor-pointer",
								children: "Eliminar"
							})]
						})
					]
				})]
			}),
			modalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemModal, {
				editTarget,
				saving,
				onClose: () => setModalOpen(false),
				onSave: handleSave
			})
		]
	});
}
//#endregion
//#region src/pages/admin/components/AdminReviews.tsx
var STATUS_BADGE = {
	approved: "bg-emerald-500/20 text-emerald-400",
	pending: "bg-amber-500/20 text-amber-400",
	rejected: "bg-rose-500/20 text-rose-400"
};
var STATUS_LABEL = {
	approved: "Aprobada",
	pending: "Pendiente",
	rejected: "Rechazada"
};
var ACCENTS = [
	"#8b5cf6",
	"#f43f5e",
	"#10b981",
	"#f59e0b",
	"#0ea5e9",
	"#ec4899",
	"#6366f1",
	"#14b8a6"
];
function AdminReviews() {
	const CATEGORIES = useCategories();
	const [reviews, setReviews] = (0, import_react.useState)([]);
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [search, setSearch] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const load = async () => {
			const { data } = await supabase.from("user_item_tracking").select("id, user_id, item_slug, category, rating, review, updated_at").not("review", "is", null).neq("review", "").not("rating", "is", null).order("updated_at", { ascending: false }).limit(100);
			if (!data?.length) {
				setReviews([]);
				return;
			}
			const userIds = [...new Set(data.map((row) => row.user_id).filter(Boolean))];
			const slugs = [...new Set(data.map((row) => row.item_slug).filter(Boolean))];
			const [{ data: profiles }, { data: catalogItems }] = await Promise.all([supabase.from("profiles").select("id, display_name, username, initials").in("id", userIds), supabase.from("catalog_items").select("slug, title").in("slug", slugs)]);
			const profilesById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
			const titlesBySlug = new Map((catalogItems ?? []).map((item) => [item.slug, item.title]));
			setReviews(data.map((row, index) => {
				const profile = profilesById.get(row.user_id);
				const user = profile?.display_name ?? profile?.username ?? "Usuario";
				return {
					id: row.id,
					user,
					initials: profile?.initials ?? user.slice(0, 2).toUpperCase(),
					userAccent: ACCENTS[index % ACCENTS.length],
					item: titlesBySlug.get(row.item_slug) ?? row.item_slug.replace(/-/g, " "),
					category: row.category,
					rating: Number(row.rating),
					body: row.review,
					status: "approved",
					date: new Date(row.updated_at).toLocaleDateString("es-ES"),
					reports: 0
				};
			}));
		};
		load();
	}, []);
	const filtered = reviews.filter((r) => {
		const matchSearch = r.user.toLowerCase().includes(search.toLowerCase()) || r.item.toLowerCase().includes(search.toLowerCase()) || r.body.toLowerCase().includes(search.toLowerCase());
		const matchStatus = statusFilter === "all" || r.status === statusFilter;
		return matchSearch && matchStatus;
	});
	const updateStatus = (id, status) => {
		setReviews((prev) => prev.map((r) => r.id === id ? {
			...r,
			status
		} : r));
	};
	const deleteReview = (id) => {
		setReviews((prev) => prev.filter((r) => r.id !== id));
	};
	const pending = reviews.filter((r) => r.status === "pending").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			pending > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-amber-400 text-xl flex-shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-semibold text-amber-300",
						children: [
							pending,
							" resena",
							pending > 1 ? "s" : "",
							" pendiente",
							pending > 1 ? "s" : "",
							" de moderacion"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-amber-500/70",
						children: "Revisa y aprueba o rechaza las resenas pendientes."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setStatusFilter("pending"),
						className: "ml-auto px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-semibold hover:bg-amber-500/30 transition-colors cursor-pointer whitespace-nowrap",
						children: "Ver pendientes"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Buscar por usuario, item o contenido...",
						className: "w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: [
						"all",
						"pending",
						"approved",
						"rejected"
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setStatusFilter(s),
						className: `px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${statusFilter === s ? "bg-white text-zinc-900" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`,
						children: [s === "all" ? "Todas" : STATUS_LABEL[s], s === "pending" && pending > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-xs",
							children: pending
						})]
					}, s))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [filtered.map((review) => {
					const cat = CATEGORIES.find((c) => c.id === review.category);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `bg-zinc-900 rounded-2xl border p-5 transition-all ${review.status === "pending" ? "border-amber-500/30" : review.status === "rejected" ? "border-rose-500/20" : "border-zinc-800"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-4 mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0",
										style: { background: review.userAccent },
										children: review.initials
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold text-white",
										children: review.user
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 mt-0.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-zinc-500",
												children: "sobre"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-medium text-zinc-300",
												children: review.item
											}),
											cat && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs px-1.5 py-0.5 rounded font-medium",
												style: {
													background: `${cat.accent}20`,
													color: cat.accent
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${cat.icon} mr-0.5` }), cat.label]
											})
										]
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 flex-shrink-0",
									children: [
										review.reports > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-semibold",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-flag-line" }),
												review.reports,
												" reportes"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-sm" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm font-bold text-white",
													children: review.rating
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-zinc-500",
													children: "/10"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_BADGE[review.status]}`,
											children: STATUS_LABEL[review.status]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: `text-sm leading-relaxed mb-4 ${review.status === "rejected" ? "text-zinc-600 line-through" : "text-zinc-400"}`,
								children: [
									"“",
									review.body,
									"”"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-zinc-600",
									children: review.date
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										review.status !== "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => updateStatus(review.id, "approved"),
											className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/30 transition-colors cursor-pointer whitespace-nowrap",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-checkbox-circle-line" }), "Aprobar"]
										}),
										review.status !== "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => updateStatus(review.id, "rejected"),
											className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-semibold hover:bg-rose-500/30 transition-colors cursor-pointer whitespace-nowrap",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-circle-line" }), "Rechazar"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => deleteReview(review.id),
											className: "w-7 h-7 flex items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-700 hover:text-rose-400 transition-colors cursor-pointer",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-delete-bin-line text-sm" })
										})
									]
								})]
							})
						]
					}, review.id);
				}), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-16 text-center text-zinc-600",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-quill-pen-line text-3xl mb-2 block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "No se encontraron resenas"
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/hooks/useAdminEntities.ts
var DEFAULT_FILTERS$1 = {
	search: "",
	type: "all",
	minItems: 0,
	sortField: "created_at",
	sortDir: "desc"
};
var PAGE_SIZE$1 = 25;
function useAdminEntities() {
	const [entities, setEntities] = (0, import_react.useState)([]);
	const [total, setTotal] = (0, import_react.useState)(0);
	const [typeCounts, setTypeCounts] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [filters, setFilters] = (0, import_react.useState)(DEFAULT_FILTERS$1);
	const [page, setPage] = (0, import_react.useState)(1);
	const debounceRef = (0, import_react.useRef)(null);
	const [debouncedSearch, setDebouncedSearch] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			setDebouncedSearch(filters.search);
			setPage(1);
		}, 350);
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [filters.search]);
	const fetchTypeCounts = (0, import_react.useCallback)(async () => {
		const { data } = await supabase.from("entities").select("type");
		if (!data) return;
		const counts = {};
		data.forEach((r) => {
			counts[r.type] = (counts[r.type] ?? 0) + 1;
		});
		setTypeCounts(counts);
	}, []);
	(0, import_react.useEffect)(() => {
		fetchTypeCounts();
	}, [fetchTypeCounts]);
	const fetchEntities = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		try {
			const from = (page - 1) * PAGE_SIZE$1;
			const to = page * PAGE_SIZE$1 - 1;
			let query = supabase.from("entities").select("id, name, type, slug, image, bio, metadata, created_at", { count: "exact" });
			if (filters.type !== "all") query = query.eq("type", filters.type);
			if (debouncedSearch.trim()) query = query.ilike("name", `%${debouncedSearch.trim()}%`);
			if (filters.sortField !== "item_count") query = query.order(filters.sortField, { ascending: filters.sortDir === "asc" });
			else query = query.order("created_at", { ascending: false });
			query = query.range(from, to);
			const { data, error: dbErr, count } = await query;
			if (dbErr) throw dbErr;
			const rows = data ?? [];
			const ids = rows.map((e) => e.id);
			let counts = {};
			if (ids.length > 0) {
				const { data: countData } = await supabase.from("item_entities").select("entity_id").in("entity_id", ids);
				if (countData) countData.forEach((r) => {
					counts[r.entity_id] = (counts[r.entity_id] ?? 0) + 1;
				});
			}
			let enriched = rows.map((e) => ({
				...e,
				item_count: counts[e.id] ?? 0
			}));
			if (filters.sortField === "item_count") enriched = enriched.sort((a, b) => filters.sortDir === "desc" ? b.item_count - a.item_count : a.item_count - b.item_count);
			if (filters.minItems > 0) enriched = enriched.filter((e) => e.item_count >= filters.minItems);
			setEntities(enriched);
			setTotal(count ?? 0);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, [
		page,
		filters.type,
		filters.sortField,
		filters.sortDir,
		filters.minItems,
		debouncedSearch
	]);
	(0, import_react.useEffect)(() => {
		fetchEntities();
	}, [fetchEntities]);
	const setFilter = (0, import_react.useCallback)((key, value) => {
		setFilters((prev) => ({
			...prev,
			[key]: value
		}));
		if (key !== "search") setPage(1);
	}, []);
	const resetFilters = (0, import_react.useCallback)(() => {
		setFilters(DEFAULT_FILTERS$1);
		setPage(1);
	}, []);
	const totalPages = Math.ceil(total / PAGE_SIZE$1);
	return {
		entities,
		total,
		typeCounts,
		loading,
		error,
		filters,
		setFilter,
		resetFilters,
		activeFilterCount: [
			filters.type !== "all",
			filters.minItems > 0,
			filters.sortField !== "created_at" || filters.sortDir !== "desc",
			filters.search.trim().length > 0
		].filter(Boolean).length,
		page,
		setPage,
		totalPages,
		pageSize: PAGE_SIZE$1,
		fetchEntities,
		fetchTypeCounts
	};
}
//#endregion
//#region src/pages/admin/components/AdminEntities.tsx
var ENTITY_TYPES = [
	{
		value: "developer",
		label: "Desarrollador",
		icon: "ri-code-box-line",
		color: "#8b5cf6"
	},
	{
		value: "publisher",
		label: "Publisher",
		icon: "ri-building-line",
		color: "#6366f1"
	},
	{
		value: "director",
		label: "Director",
		icon: "ri-movie-line",
		color: "#f43f5e"
	},
	{
		value: "actor",
		label: "Actor",
		icon: "ri-user-star-line",
		color: "#f59e0b"
	},
	{
		value: "author",
		label: "Autor",
		icon: "ri-book-open-line",
		color: "#10b981"
	},
	{
		value: "creator",
		label: "Creador",
		icon: "ri-lightbulb-line",
		color: "#0ea5e9"
	},
	{
		value: "artist",
		label: "Artista",
		icon: "ri-music-line",
		color: "#ec4899"
	},
	{
		value: "studio",
		label: "Estudio",
		icon: "ri-film-line",
		color: "#14b8a6"
	}
];
var TYPE_META = Object.fromEntries(ENTITY_TYPES.map((t) => [t.value, {
	icon: t.icon,
	color: t.color,
	label: t.label
}]));
var SORT_OPTIONS = [
	{
		value: "created_at",
		label: "Fecha de creación"
	},
	{
		value: "name",
		label: "Nombre (A-Z)"
	},
	{
		value: "item_count",
		label: "Más ítems vinculados"
	}
];
var MIN_ITEMS_OPTIONS = [
	{
		value: 0,
		label: "Cualquier cantidad"
	},
	{
		value: 1,
		label: "Al menos 1 ítem"
	},
	{
		value: 5,
		label: "Al menos 5 ítems"
	},
	{
		value: 10,
		label: "Al menos 10 ítems"
	},
	{
		value: 25,
		label: "Al menos 25 ítems"
	}
];
var EMPTY_FORM = {
	name: "",
	type: "developer",
	image_url: "",
	bio: "",
	metadata_raw: ""
};
function generateSlug(name, type) {
	return `${name}-${type}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function MetadataHint({ type }) {
	const hint = {
		developer: "{\"founded\": \"1998\", \"country\": \"US\"}",
		publisher: "{\"founded\": \"2000\", \"country\": \"JP\"}",
		director: "{\"nationality\": \"US\", \"born\": \"1970\"}",
		actor: "{\"nationality\": \"UK\", \"born\": \"1985\"}",
		author: "{\"nationality\": \"CN\", \"born\": \"1963\"}",
		artist: "{\"genre\": \"Pop\", \"origin\": \"US\"}"
	}[type];
	if (!hint) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-xs text-zinc-600 mt-1 font-mono truncate",
		children: ["Ej: ", hint]
	});
}
function SkeletonRows({ count = 8 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "divide-y divide-zinc-800",
		children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-12 gap-4 px-5 py-4 items-center animate-pulse",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-span-5 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-10 rounded-xl bg-zinc-800 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 bg-zinc-800 rounded w-3/4 mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2.5 bg-zinc-800 rounded w-1/2" })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "col-span-2 hidden md:block h-3 bg-zinc-800 rounded w-16" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "col-span-2 hidden lg:block h-3 bg-zinc-800 rounded w-20" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "col-span-2 hidden lg:block h-3 bg-zinc-800 rounded w-8" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "col-span-1 hidden lg:block h-3 bg-zinc-800 rounded w-8 ml-auto" })
			]
		}, i))
	});
}
function FiltersPanel({ sortField, sortDir, minItems, onSortField, onSortDir, onMinItems, onReset, onClose, activeCount }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute right-0 top-full mt-2 w-72 bg-zinc-900 border border-zinc-700 rounded-2xl z-30 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between px-4 py-3 border-b border-zinc-800",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-bold text-white",
				children: "Filtros avanzados"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [activeCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onReset,
					className: "text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap",
					children: "Limpiar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "w-6 h-6 flex items-center justify-center rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-line text-sm" })
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-4 flex flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider",
					children: "Ordenar por"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-1",
					children: SORT_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onSortField(opt.value),
						className: `flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer text-left ${sortField === opt.value ? "bg-white/10 text-white font-semibold" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"}`,
						children: [opt.label, sortField === opt.value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line text-xs text-white" })]
					}, opt.value))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider",
					children: "Dirección"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: ["desc", "asc"].map((dir) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onSortDir(dir),
						className: `flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${sortDir === dir ? "bg-white/10 text-white border border-white/20" : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: dir === "desc" ? "ri-sort-desc" : "ri-sort-asc" }), dir === "desc" ? "Descendente" : "Ascendente"]
					}, dir))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider",
					children: "Ítems vinculados"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-1",
					children: MIN_ITEMS_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onMinItems(opt.value),
						className: `flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer text-left ${minItems === opt.value ? "bg-white/10 text-white font-semibold" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"}`,
						children: [opt.label, minItems === opt.value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line text-xs text-white" })]
					}, opt.value))
				})] })
			]
		})]
	});
}
function EntityModal({ editTarget, saving, onClose, onSave }) {
	const [form, setForm] = (0, import_react.useState)(editTarget ? {
		name: editTarget.name,
		type: editTarget.type,
		image_url: editTarget.image ?? "",
		bio: editTarget.bio ?? "",
		metadata_raw: editTarget.metadata ? JSON.stringify(editTarget.metadata, null, 2) : ""
	} : EMPTY_FORM);
	const [metaError, setMetaError] = (0, import_react.useState)("");
	const handleSave = async () => {
		if (!form.name.trim()) return;
		if (form.metadata_raw.trim()) try {
			JSON.parse(form.metadata_raw);
		} catch {
			setMetaError("JSON inválido — revisa la sintaxis");
			return;
		}
		setMetaError("");
		await onSave(form);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-black/70",
			onClick: () => !saving && onClose()
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-lg max-h-[90vh] flex flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-6 py-5 border-b border-zinc-800 flex-shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-white font-bold",
						style: { fontFamily: "'Space Grotesk', sans-serif" },
						children: editTarget ? "Editar entidad" : "Nueva entidad"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-zinc-500 mt-0.5",
						children: editTarget ? `Editando: ${editTarget.name}` : "Crea una nueva entidad manualmente"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => !saving && onClose(),
						className: "w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-line text-lg" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs font-semibold text-zinc-400 mb-1.5",
							children: ["Nombre ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-rose-400",
								children: "*"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.name,
							onChange: (e) => setForm((f) => ({
								...f,
								name: e.target.value
							})),
							placeholder: "Ej: Rockstar Games, Christopher Nolan...",
							className: "w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs font-semibold text-zinc-400 mb-1.5",
							children: ["Tipo ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-rose-400",
								children: "*"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-4 gap-2",
							children: ENTITY_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setForm((f) => ({
									...f,
									type: t.value
								})),
								className: `flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all cursor-pointer ${form.type === t.value ? "border-white/30 bg-white/10" : "border-zinc-700 bg-zinc-800 hover:bg-zinc-700"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-5 h-5 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
										className: `${t.icon} text-sm`,
										style: { color: t.color }
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-zinc-300 leading-tight text-center",
									children: t.label
								})]
							}, t.value))
						})] }),
						form.name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-link text-zinc-500 text-sm" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-zinc-500",
									children: "Slug:"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-zinc-300 font-mono",
									children: generateSlug(form.name, form.type)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-zinc-400 mb-1.5",
								children: "URL de imagen"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.image_url,
								onChange: (e) => setForm((f) => ({
									...f,
									image_url: e.target.value
								})),
								placeholder: "https://...",
								className: "w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
							}),
							form.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-12 rounded-xl overflow-hidden border border-zinc-700 flex-shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: form.image_url,
										alt: "preview",
										className: "w-full h-full object-cover object-top",
										onError: (e) => {
											e.target.style.display = "none";
										}
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-zinc-500",
									children: "Vista previa"
								})]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-zinc-400 mb-1.5",
								children: "Biografía / Descripción"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: form.bio,
								onChange: (e) => setForm((f) => ({
									...f,
									bio: e.target.value
								})),
								placeholder: "Breve descripción de la entidad...",
								rows: 3,
								maxLength: 500,
								className: "w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-zinc-600 mt-1 text-right",
								children: [form.bio.length, "/500"]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs font-semibold text-zinc-400 mb-1.5",
								children: ["Metadata ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-zinc-600",
									children: "(JSON opcional)"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: form.metadata_raw,
								onChange: (e) => {
									setForm((f) => ({
										...f,
										metadata_raw: e.target.value
									}));
									setMetaError("");
								},
								placeholder: "{\n  \"founded\": \"1998\",\n  \"country\": \"US\"\n}",
								rows: 4,
								className: `w-full px-4 py-2.5 rounded-xl bg-zinc-800 border text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 font-mono resize-none ${metaError ? "border-rose-500 focus:ring-rose-500/30" : "border-zinc-700 focus:ring-white/20"}`
							}),
							metaError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-rose-400 mt-1",
								children: metaError
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetadataHint, { type: form.type })
						] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800 flex-shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => !saving && onClose(),
						disabled: saving,
						className: "px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-semibold hover:bg-zinc-700 transition-colors cursor-pointer disabled:opacity-50",
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleSave,
						disabled: saving || !form.name.trim(),
						className: "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-bold hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap",
						children: saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-4 h-4 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" }), "Guardando..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: editTarget ? "ri-save-line" : "ri-add-line" }), editTarget ? "Guardar cambios" : "Crear entidad"] })
					})]
				})
			]
		})]
	});
}
function AdminEntities() {
	const { entities, total, typeCounts, loading, error, filters, setFilter, resetFilters, activeFilterCount, page, setPage, totalPages, pageSize, fetchEntities, fetchTypeCounts } = useAdminEntities();
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	const [editTarget, setEditTarget] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [deleteConfirm, setDeleteConfirm] = (0, import_react.useState)(null);
	const [actionMenu, setActionMenu] = (0, import_react.useState)(null);
	const [filtersOpen, setFiltersOpen] = (0, import_react.useState)(false);
	const [toast, setToast] = (0, import_react.useState)(null);
	const actionRef = (0, import_react.useRef)(null);
	const filterRef = (0, import_react.useRef)(null);
	const showToast = (msg, type = "ok") => {
		setToast({
			msg,
			type
		});
		setTimeout(() => setToast(null), 3e3);
	};
	(0, import_react.useEffect)(() => {
		if (error) showToast(error, "err");
	}, [error]);
	(0, import_react.useEffect)(() => {
		const handler = (e) => {
			if (actionRef.current && !actionRef.current.contains(e.target)) setActionMenu(null);
			if (filterRef.current && !filterRef.current.contains(e.target)) setFiltersOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);
	const openCreate = () => {
		setEditTarget(null);
		setModalOpen(true);
	};
	const openEdit = (entity) => {
		setEditTarget(entity);
		setActionMenu(null);
		setModalOpen(true);
	};
	const handleSave = async (form) => {
		setSaving(true);
		let parsedMeta = null;
		if (form.metadata_raw.trim()) try {
			parsedMeta = JSON.parse(form.metadata_raw);
		} catch {
			showToast("JSON inválido", "err");
			setSaving(false);
			return;
		}
		const slug = generateSlug(form.name, form.type);
		const payload = {
			name: form.name.trim(),
			type: form.type,
			slug,
			image: form.image_url.trim() || null,
			bio: form.bio.trim() || null,
			metadata: parsedMeta
		};
		if (editTarget) {
			const { error } = await supabase.from("entities").update(payload).eq("id", editTarget.id);
			if (error) showToast(error.message.includes("unique") ? "Ya existe una entidad con ese nombre y tipo" : "Error al guardar", "err");
			else {
				await auditLog("update", "entities", editTarget.id, {
					name: payload.name,
					type: payload.type
				});
				showToast("Entidad actualizada correctamente");
				setModalOpen(false);
				fetchEntities();
				fetchTypeCounts();
			}
		} else {
			const { data: inserted, error } = await supabase.from("entities").insert(payload).select("id").maybeSingle();
			if (error) showToast(error.message.includes("unique") ? "Ya existe una entidad con ese nombre y tipo" : "Error al crear", "err");
			else {
				await auditLog("create", "entities", inserted?.id ?? "unknown", {
					name: payload.name,
					type: payload.type
				});
				showToast("Entidad creada correctamente");
				setModalOpen(false);
				fetchEntities();
				fetchTypeCounts();
			}
		}
		setSaving(false);
	};
	const handleDelete = async (id) => {
		const target = entities.find((e) => e.id === id);
		const { error } = await supabase.from("entities").delete().eq("id", id);
		if (error) showToast("Error al eliminar", "err");
		else {
			await auditLog("delete", "entities", id, {
				name: target?.name ?? null,
				type: target?.type ?? null
			});
			showToast("Entidad eliminada");
			fetchEntities();
			fetchTypeCounts();
		}
		setDeleteConfirm(null);
		setActionMenu(null);
	};
	const from = (page - 1) * pageSize + 1;
	const to = Math.min(page * pageSize, total);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			toast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${toast.type === "ok" ? "bg-emerald-950 border-emerald-800 text-emerald-300" : "bg-rose-950 border-rose-800 text-rose-300"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: toast.type === "ok" ? "ri-checkbox-circle-line" : "ri-error-warning-line" }), toast.msg]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-white font-bold text-base",
					style: { fontFamily: "'Space Grotesk', sans-serif" },
					children: "Entidades"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-zinc-500 mt-0.5",
					children: [total.toLocaleString(), " entidades en total · Gestiona desarrolladores, actores, directores y más."]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: openCreate,
					className: "flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-bold hover:bg-zinc-100 transition-colors cursor-pointer whitespace-nowrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-add-line" }), "Nueva entidad"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-4 sm:grid-cols-8 gap-2",
				children: ENTITY_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setFilter("type", filters.type === t.value ? "all" : t.value),
					className: `flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all cursor-pointer ${filters.type === t.value ? "border-white/20 bg-white/10" : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-6 h-6 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
								className: `${t.icon} text-sm`,
								style: { color: t.color }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-white",
							children: typeCounts[t.value] ?? 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-zinc-500 leading-tight text-center",
							children: t.label
						})
					]
				}, t.value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: filters.search,
								onChange: (e) => setFilter("search", e.target.value),
								placeholder: "Buscar entidad por nombre...",
								className: "w-full pl-9 pr-9 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
							}),
							filters.search && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setFilter("search", ""),
								className: "absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-line text-sm" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: filters.type,
						onChange: (e) => setFilter("type", e.target.value),
						className: "px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 focus:outline-none cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "Todos los tipos"
						}), ENTITY_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: t.value,
							children: t.label
						}, t.value))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: filterRef,
						className: "relative flex-shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setFiltersOpen((p) => !p),
							className: `flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${activeFilterCount > 0 ? "bg-white/10 border-white/20 text-white" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-equalizer-2-line text-sm" }),
								"Filtros",
								activeFilterCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-[10px] font-bold text-white",
									children: activeFilterCount
								})
							]
						}), filtersOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiltersPanel, {
							sortField: filters.sortField,
							sortDir: filters.sortDir,
							minItems: filters.minItems,
							onSortField: (v) => setFilter("sortField", v),
							onSortDir: (v) => setFilter("sortDir", v),
							onMinItems: (v) => setFilter("minItems", v),
							onReset: resetFilters,
							onClose: () => setFiltersOpen(false),
							activeCount: activeFilterCount
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: fetchEntities,
						className: "px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer",
						title: "Recargar",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-refresh-line text-sm" })
					})
				]
			}),
			activeFilterCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					filters.type !== "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-medium",
						children: [TYPE_META[filters.type]?.label ?? filters.type, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setFilter("type", "all"),
							className: "w-4 h-4 flex items-center justify-center rounded-full hover:bg-zinc-700 cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-line text-[10px]" })
						})]
					}),
					filters.minItems > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-medium",
						children: [
							"≥",
							filters.minItems,
							" ítems",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setFilter("minItems", 0),
								className: "w-4 h-4 flex items-center justify-center rounded-full hover:bg-zinc-700 cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-line text-[10px]" })
							})
						]
					}),
					(filters.sortField !== "created_at" || filters.sortDir !== "desc") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-medium",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: filters.sortDir === "desc" ? "ri-sort-desc text-[10px]" : "ri-sort-asc text-[10px]" }),
							SORT_OPTIONS.find((s) => s.value === filters.sortField)?.label,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setFilter("sortField", "created_at");
									setFilter("sortDir", "desc");
								},
								className: "w-4 h-4 flex items-center justify-center rounded-full hover:bg-zinc-700 cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-line text-[10px]" })
							})
						]
					}),
					activeFilterCount > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: resetFilters,
						className: "text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer whitespace-nowrap",
						children: "Limpiar todo"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 text-xs text-zinc-500",
				children: [!loading && total > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Mostrando ",
						from,
						"–",
						to,
						" de ",
						total.toLocaleString()
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Página ",
						page,
						" de ",
						totalPages
					] })
				] }), !loading && total === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sin resultados" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-12 gap-4 px-5 py-3 border-b border-zinc-800 text-xs font-semibold text-zinc-500 uppercase tracking-wider",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-5",
							children: "Entidad"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-2 hidden md:block",
							children: "Tipo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-2 hidden lg:block",
							children: "Slug"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-2 hidden lg:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									if (filters.sortField === "item_count") setFilter("sortDir", filters.sortDir === "desc" ? "asc" : "desc");
									else {
										setFilter("sortField", "item_count");
										setFilter("sortDir", "desc");
									}
								},
								className: "flex items-center gap-1 hover:text-zinc-300 transition-colors cursor-pointer",
								children: ["Ítems", filters.sortField === "item_count" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${filters.sortDir === "desc" ? "ri-arrow-down-s-line" : "ri-arrow-up-s-line"} text-white` })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-7 md:col-span-3 lg:col-span-1 text-right",
							children: "Acciones"
						})
					]
				}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonRows, { count: 8 }) : entities.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-16 text-center text-zinc-600",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-user-star-line text-3xl mb-2 block" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: total === 0 && !filters.search && filters.type === "all" ? "No hay entidades todavía — crea la primera" : "No se encontraron entidades con estos filtros"
						}),
						activeFilterCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: resetFilters,
							className: "mt-3 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer",
							children: "Limpiar filtros"
						}),
						total === 0 && !filters.search && filters.type === "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: openCreate,
							className: "mt-4 px-4 py-2 rounded-xl bg-white text-zinc-900 text-sm font-bold hover:bg-zinc-100 transition-colors cursor-pointer",
							children: "Crear entidad"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-zinc-800",
					ref: actionRef,
					children: entities.map((entity) => {
						const meta = TYPE_META[entity.type] ?? {
							icon: "ri-user-line",
							color: "#71717a",
							label: entity.type
						};
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-white/5 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-5 flex items-center gap-3 min-w-0",
									children: [entity.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 h-10 rounded-xl overflow-hidden flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: entity.image,
											alt: entity.name,
											className: "w-full h-full object-cover object-top"
										})
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
										style: { background: `${meta.color}20` },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
											className: `${meta.icon} text-base`,
											style: { color: meta.color }
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold text-white truncate",
											children: entity.name
										}), entity.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-zinc-500 truncate mt-0.5",
											children: entity.bio
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 hidden md:flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-5 h-5 flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
											className: `${meta.icon} text-sm`,
											style: { color: meta.color }
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-400",
										children: meta.label
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-span-2 hidden lg:block",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-600 font-mono truncate block",
										children: entity.slug
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 hidden lg:flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-sm font-semibold ${entity.item_count > 0 ? "text-white" : "text-zinc-600"}`,
										children: entity.item_count
									}), entity.item_count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden max-w-16",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full rounded-full",
											style: {
												width: `${Math.min(100, entity.item_count / Math.max(...entities.map((e) => e.item_count), 1) * 100)}%`,
												background: meta.color
											}
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-7 md:col-span-3 lg:col-span-1 flex items-center justify-end relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setActionMenu((prev) => prev === entity.id ? null : entity.id),
										className: "w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-more-2-fill text-sm" })
									}), actionMenu === entity.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute right-0 top-full mt-1 w-44 bg-zinc-800 rounded-xl border border-zinc-700 z-20 overflow-hidden",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: `/entity/${entity.slug}`,
												target: "_blank",
												rel: "noopener noreferrer",
												className: "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-external-link-line" }), " Ver página"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => openEdit(entity),
												className: "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer text-left",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-edit-line" }), " Editar"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => {
													setDeleteConfirm(entity.id);
													setActionMenu(null);
												},
												className: "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:bg-zinc-700 transition-colors cursor-pointer text-left",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-delete-bin-line" }), " Eliminar"]
											})
										]
									})]
								})
							]
						}, entity.id);
					})
				})]
			}),
			totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-zinc-500",
					children: [
						from,
						"–",
						to,
						" de ",
						total.toLocaleString(),
						" entidades"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPage(1),
							disabled: page === 1,
							className: "w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors",
							title: "Primera página",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-skip-back-line text-xs" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPage((p) => Math.max(1, p - 1)),
							disabled: page === 1,
							className: "w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-left-s-line" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1",
							children: Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
								let p;
								if (totalPages <= 5) p = i + 1;
								else if (page <= 3) p = i + 1;
								else if (page >= totalPages - 2) p = totalPages - 4 + i;
								else p = page - 2 + i;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setPage(p),
									className: `w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors cursor-pointer ${p === page ? "bg-white text-zinc-900" : "bg-zinc-800 border border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-white"}`,
									children: p
								}, p);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
							disabled: page === totalPages,
							className: "w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-s-line" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPage(totalPages),
							disabled: page === totalPages,
							className: "w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors",
							title: "Última página",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-skip-forward-line text-xs" })
						})
					]
				})]
			}),
			deleteConfirm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 bg-black/70",
					onClick: () => setDeleteConfirm(null)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 bg-zinc-900 rounded-2xl border border-zinc-800 p-6 w-full max-w-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center mx-auto mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-delete-bin-line text-rose-400 text-xl" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-white font-bold text-center mb-2",
							style: { fontFamily: "'Space Grotesk', sans-serif" },
							children: "¿Eliminar entidad?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-zinc-400 text-sm text-center mb-6",
							children: "Se eliminarán también todas sus relaciones con ítems del catálogo. Esta acción no se puede deshacer."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDeleteConfirm(null),
								className: "flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-semibold hover:bg-zinc-700 transition-colors cursor-pointer",
								children: "Cancelar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleDelete(deleteConfirm),
								className: "flex-1 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-colors cursor-pointer",
								children: "Eliminar"
							})]
						})
					]
				})]
			}),
			modalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntityModal, {
				editTarget,
				saving,
				onClose: () => setModalOpen(false),
				onSave: handleSave
			})
		]
	});
}
//#endregion
//#region src/hooks/useAdminAuditLogs.ts
var PAGE_SIZE = 30;
var DEFAULT_FILTERS = {
	action: "",
	entity: "",
	actor_id: "",
	search: "",
	dateFrom: "",
	dateTo: ""
};
function useAdminAuditLogs() {
	const [logs, setLogs] = (0, import_react.useState)([]);
	const [total, setTotal] = (0, import_react.useState)(0);
	const [page, setPage] = (0, import_react.useState)(1);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [filters, setFilters] = (0, import_react.useState)(DEFAULT_FILTERS);
	const [actionOptions, setActionOptions] = (0, import_react.useState)([]);
	const [entityOptions, setEntityOptions] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		async function loadOptions() {
			const [actionsRes, entitiesRes] = await Promise.all([supabase.from("admin_audit_logs").select("action").order("action"), supabase.from("admin_audit_logs").select("entity").order("entity")]);
			if (actionsRes.data) setActionOptions([...new Set(actionsRes.data.map((r) => r.action).filter(Boolean))]);
			if (entitiesRes.data) setEntityOptions([...new Set(entitiesRes.data.map((r) => r.entity).filter(Boolean))]);
		}
		loadOptions();
	}, []);
	const fetchLogs = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			const from = (page - 1) * PAGE_SIZE;
			const to = from + PAGE_SIZE - 1;
			let query = supabase.from("admin_audit_logs").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(from, to);
			if (filters.action) query = query.eq("action", filters.action);
			if (filters.entity) query = query.eq("entity", filters.entity);
			if (filters.actor_id) query = query.eq("actor_id", filters.actor_id);
			if (filters.dateFrom) query = query.gte("created_at", filters.dateFrom);
			if (filters.dateTo) {
				const end = new Date(filters.dateTo);
				end.setDate(end.getDate() + 1);
				query = query.lt("created_at", end.toISOString());
			}
			const { data, count, error } = await query;
			if (error) throw error;
			const actorIds = [...new Set((data ?? []).map((l) => l.actor_id).filter(Boolean))];
			let profileMap = {};
			if (actorIds.length > 0) {
				const { data: profiles } = await supabase.from("profiles").select("id, username").in("id", actorIds);
				if (profiles) profiles.forEach((p) => {
					profileMap[p.id] = {
						email: "",
						username: p.username ?? p.id.slice(0, 8)
					};
				});
			}
			setLogs((data ?? []).map((log) => ({
				...log,
				actor_email: profileMap[log.actor_id]?.email ?? "",
				actor_username: profileMap[log.actor_id]?.username ?? (log.actor_id ? log.actor_id.slice(0, 8) : "Sistema")
			})));
			setTotal(count ?? 0);
		} finally {
			setLoading(false);
		}
	}, [page, filters]);
	(0, import_react.useEffect)(() => {
		fetchLogs();
	}, [fetchLogs]);
	const updateFilters = (0, import_react.useCallback)((partial) => {
		setFilters((prev) => ({
			...prev,
			...partial
		}));
		setPage(1);
	}, []);
	const resetFilters = (0, import_react.useCallback)(() => {
		setFilters(DEFAULT_FILTERS);
		setPage(1);
	}, []);
	return {
		logs,
		total,
		page,
		totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
		loading,
		filters,
		actionOptions,
		entityOptions,
		activeFilterCount: Object.entries(filters).filter(([, v]) => v !== "").length,
		setPage,
		updateFilters,
		resetFilters,
		refresh: fetchLogs
	};
}
//#endregion
//#region src/pages/admin/components/AdminAuditLogs.tsx
var ACTION_COLORS = {
	create: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
	insert: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
	update: "bg-amber-500/15  text-amber-400  border border-amber-500/30",
	edit: "bg-amber-500/15  text-amber-400  border border-amber-500/30",
	delete: "bg-rose-500/15   text-rose-400   border border-rose-500/30",
	remove: "bg-rose-500/15   text-rose-400   border border-rose-500/30",
	login: "bg-sky-500/15    text-sky-400    border border-sky-500/30",
	logout: "bg-zinc-500/15   text-zinc-400   border border-zinc-500/30",
	approve: "bg-violet-500/15 text-violet-400 border border-violet-500/30",
	reject: "bg-orange-500/15 text-orange-400 border border-orange-500/30"
};
function actionBadgeClass(action) {
	const key = Object.keys(ACTION_COLORS).find((k) => action.toLowerCase().includes(k));
	return key ? ACTION_COLORS[key] : "bg-zinc-700/50 text-zinc-300 border border-zinc-600";
}
var ENTITY_ICONS = {
	catalog_items: "ri-database-2-line",
	entities: "ri-user-star-line",
	reviews: "ri-quill-pen-line",
	profiles: "ri-group-line",
	users: "ri-group-line",
	item_entities: "ri-link-m"
};
function entityIcon(entity) {
	return ENTITY_ICONS[entity] ?? "ri-file-list-3-line";
}
function PayloadModal({ payload, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-black/70",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-5 py-4 border-b border-zinc-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold text-white",
					children: "Payload del log"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-line text-base" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-auto p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "text-xs text-zinc-300 font-mono whitespace-pre-wrap break-all leading-relaxed",
					children: JSON.stringify(payload, null, 2)
				})
			})]
		})]
	});
}
function Pagination({ page, totalPages, onPage }) {
	const pages = [];
	if (totalPages <= 7) for (let i = 1; i <= totalPages; i++) pages.push(i);
	else {
		pages.push(1);
		if (page > 3) pages.push("...");
		for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
		if (page < totalPages - 2) pages.push("...");
		pages.push(totalPages);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => onPage(1),
				disabled: page === 1,
				className: "w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-skip-back-mini-line text-sm" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => onPage(page - 1),
				disabled: page === 1,
				className: "w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-left-s-line text-sm" })
			}),
			pages.map((p, i) => p === "..." ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-8 h-8 flex items-center justify-center text-zinc-600 text-sm",
				children: "…"
			}, `dots-${i}`) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => onPage(p),
				className: `w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${p === page ? "bg-white text-zinc-900" : "text-zinc-400 hover:bg-zinc-800"}`,
				children: p
			}, p)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => onPage(page + 1),
				disabled: page === totalPages,
				className: "w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-s-line text-sm" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => onPage(totalPages),
				disabled: page === totalPages,
				className: "w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-skip-forward-mini-line text-sm" })
			})
		]
	});
}
function AdminAuditLogs() {
	const { logs, total, page, totalPages, loading, filters, actionOptions, entityOptions, activeFilterCount, setPage, updateFilters, resetFilters } = useAdminAuditLogs();
	const [showFilters, setShowFilters] = (0, import_react.useState)(false);
	const [payloadLog, setPayloadLog] = (0, import_react.useState)(null);
	function formatDate(iso) {
		const d = new Date(iso);
		return d.toLocaleDateString("es-ES", {
			day: "2-digit",
			month: "short",
			year: "numeric"
		}) + " · " + d.toLocaleTimeString("es-ES", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit"
		});
	}
	const activeChips = [
		filters.action && {
			key: "action",
			label: `Acción: ${filters.action}`
		},
		filters.entity && {
			key: "entity",
			label: `Entidad: ${filters.entity}`
		},
		filters.actor_id && {
			key: "actor_id",
			label: `Usuario: ${filters.actor_id.slice(0, 8)}…`
		},
		filters.dateFrom && {
			key: "dateFrom",
			label: `Desde: ${filters.dateFrom}`
		},
		filters.dateTo && {
			key: "dateTo",
			label: `Hasta: ${filters.dateTo}`
		}
	].filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold text-white",
					style: { fontFamily: "'Space Grotesk', sans-serif" },
					children: "Auditoría del sistema"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-zinc-500 mt-0.5",
					children: [total.toLocaleString(), " registros en total"]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							placeholder: "Buscar entity_id…",
							value: filters.search,
							onChange: (e) => updateFilters({ search: e.target.value }),
							className: "pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 w-52 transition-colors"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setShowFilters((v) => !v),
						className: `relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer whitespace-nowrap ${showFilters || activeFilterCount > 0 ? "bg-white/10 border-white/20 text-white" : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-equalizer-3-line text-sm" }),
							"Filtros",
							activeFilterCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-5 h-5 flex items-center justify-center rounded-full bg-violet-500 text-white text-xs font-bold",
								children: activeFilterCount
							})
						]
					})]
				})]
			}),
			showFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-zinc-900 border border-zinc-800 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-medium text-zinc-400 mb-1.5",
						children: "Acción"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: filters.action,
						onChange: (e) => updateFilters({ action: e.target.value }),
						className: "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Todas las acciones"
						}), actionOptions.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: a,
							children: a
						}, a))]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-medium text-zinc-400 mb-1.5",
						children: "Entidad"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: filters.entity,
						onChange: (e) => updateFilters({ entity: e.target.value }),
						className: "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Todas las entidades"
						}), entityOptions.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: e,
							children: e
						}, e))]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-medium text-zinc-400 mb-1.5",
						children: "Desde"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: filters.dateFrom,
						onChange: (e) => updateFilters({ dateFrom: e.target.value }),
						className: "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-medium text-zinc-400 mb-1.5",
						children: "Hasta"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: filters.dateTo,
						onChange: (e) => updateFilters({ dateTo: e.target.value }),
						className: "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
					})] }),
					activeFilterCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sm:col-span-2 lg:col-span-4 flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: resetFilters,
							className: "text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer",
							children: "Limpiar todos los filtros"
						})
					})
				]
			}),
			activeChips.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [activeChips.map((chip) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-300",
					children: [chip.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => updateFilters({ [chip.key]: "" }),
						className: "w-4 h-4 flex items-center justify-center rounded-full hover:bg-zinc-600 transition-colors cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-line text-xs" })
					})]
				}, chip.key)), activeChips.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: resetFilters,
					className: "px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer",
					children: "Limpiar todo"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-zinc-800 text-xs font-semibold text-zinc-500 uppercase tracking-wider",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fecha" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Actor" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Acción" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Entidad" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-16 text-right",
								children: "Payload"
							})
						]
					}),
					loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-zinc-800/50",
						children: Array.from({ length: 10 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 animate-pulse",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 bg-zinc-800 rounded w-3/4" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 bg-zinc-800 rounded w-1/2" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 bg-zinc-800 rounded-full w-20" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 bg-zinc-800 rounded w-2/3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 bg-zinc-800 rounded w-16 ml-auto" })
							]
						}, i))
					}) : logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center py-20 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-14 h-14 flex items-center justify-center rounded-2xl bg-zinc-800 mb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-file-list-3-line text-2xl text-zinc-600" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-zinc-400 font-medium",
								children: "Sin registros"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-zinc-600 text-sm mt-1",
								children: "No hay logs que coincidan con los filtros aplicados."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-zinc-800/50",
						children: logs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3.5 hover:bg-zinc-800/40 transition-colors items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-zinc-500 font-mono tabular-nums",
									children: formatDate(log.created_at)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-rose-500/30 flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-user-line text-xs text-zinc-300" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm text-zinc-300 truncate font-mono",
										children: log.actor_username ?? "Sistema"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit ${actionBadgeClass(log.action)}`,
									children: log.action
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-5 h-5 flex items-center justify-center flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${entityIcon(log.entity)} text-zinc-500 text-sm` })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm text-zinc-300 block truncate",
											children: log.entity
										}), log.entity_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-zinc-600 font-mono truncate block",
											children: log.entity_id.length > 20 ? `${log.entity_id.slice(0, 20)}…` : log.entity_id
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-16 flex justify-end",
									children: log.payload && Object.keys(log.payload).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setPayloadLog(log.payload),
										className: "flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs transition-colors cursor-pointer whitespace-nowrap",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-code-s-slash-line text-xs" }), "Ver"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-zinc-700 text-xs",
										children: "—"
									})
								})
							]
						}, log.id))
					}),
					!loading && logs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-5 py-4 border-t border-zinc-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-zinc-500",
							children: [
								"Página ",
								page,
								" de ",
								totalPages,
								" · ",
								total.toLocaleString(),
								" registros"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pagination, {
							page,
							totalPages,
							onPage: setPage
						})]
					})
				]
			}),
			payloadLog && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayloadModal, {
				payload: payloadLog,
				onClose: () => setPayloadLog(null)
			})
		]
	});
}
//#endregion
//#region src/pages/admin/components/AdminReports.tsx
var STATUS_CONFIG = {
	pending: {
		label: "Pendiente",
		icon: "ri-time-line",
		bg: "bg-amber-50 dark:bg-amber-950/30",
		text: "text-amber-600 dark:text-amber-400",
		dot: "bg-amber-400"
	},
	resolved: {
		label: "Resuelto",
		icon: "ri-checkbox-circle-line",
		bg: "bg-emerald-50 dark:bg-emerald-950/30",
		text: "text-emerald-600 dark:text-emerald-400",
		dot: "bg-emerald-400"
	},
	dismissed: {
		label: "Descartado",
		icon: "ri-close-circle-line",
		bg: "bg-zinc-100 dark:bg-zinc-800",
		text: "text-zinc-500 dark:text-zinc-400",
		dot: "bg-zinc-400"
	}
};
var REASON_ICONS = {
	"Información incorrecta": "ri-information-line",
	"Imagen equivocada": "ri-image-line",
	"Título o año erróneo": "ri-calendar-line",
	"Contenido duplicado": "ri-file-copy-line",
	"Descripción inapropiada": "ri-alert-line",
	"Otro": "ri-question-line"
};
var CATEGORY_LABELS = {
	videojuegos: "Videojuegos",
	películas: "Películas",
	series: "Series",
	libros: "Libros",
	conciertos: "Conciertos"
};
function formatDate(iso) {
	return new Date(iso).toLocaleDateString("es-ES", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
}
function ResolveModal({ report, action, onConfirm, onClose }) {
	const [note, setNote] = (0, import_react.useState)("");
	const isResolve = action === "resolved";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `w-8 h-8 flex items-center justify-center rounded-lg ${isResolve ? "bg-emerald-500/20" : "bg-zinc-700"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${isResolve ? "ri-checkbox-circle-line text-emerald-400" : "ri-close-circle-line text-zinc-400"} text-sm` })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-bold text-white",
						children: isResolve ? "Marcar como resuelto" : "Descartar reporte"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-line text-zinc-400 text-sm" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-6 py-5 flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 p-3 rounded-xl bg-zinc-800/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: report.item_cover,
							alt: report.item_title,
							className: "w-10 h-14 object-cover object-top rounded-lg flex-shrink-0"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-white truncate",
								children: report.item_title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-zinc-400",
								children: report.reason
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs font-semibold text-zinc-400 uppercase tracking-wider",
								children: ["Nota interna ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-normal normal-case",
									children: "(opcional)"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: note,
								onChange: (e) => {
									if (e.target.value.length <= 300) setNote(e.target.value);
								},
								placeholder: isResolve ? "Describe qué cambio se realizó..." : "Motivo por el que se descarta...",
								rows: 3,
								className: "w-full px-3 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-sm text-zinc-200 placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-600"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-zinc-500 text-right",
								children: [note.length, "/300"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onClose,
							className: "flex-1 py-2.5 rounded-xl border border-zinc-700 text-sm font-medium text-zinc-400 hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap",
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => onConfirm(note),
							className: `flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 ${isResolve ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-zinc-700 hover:bg-zinc-600 text-zinc-200"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: isResolve ? "ri-checkbox-circle-line" : "ri-close-circle-line" }), isResolve ? "Marcar resuelto" : "Descartar"]
						})]
					})
				]
			})]
		})
	});
}
function ReportRow({ report, isNew, onAction }) {
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const [highlight, setHighlight] = (0, import_react.useState)(isNew);
	const cfg = STATUS_CONFIG[report.status];
	(0, import_react.useEffect)(() => {
		if (isNew) {
			const t = setTimeout(() => setHighlight(false), 4e3);
			return () => clearTimeout(t);
		}
	}, [isNew]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `border rounded-2xl overflow-hidden transition-all duration-700 ${highlight ? "bg-rose-950/30 border-rose-800/60" : "bg-zinc-900 border-zinc-800"}`,
		children: [
			highlight && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 px-5 pt-3 pb-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-semibold text-rose-400",
					children: "Nuevo reporte"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/5 transition-colors",
				onClick: () => setExpanded((v) => !v),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: report.item_cover,
						alt: report.item_title,
						className: "w-9 h-12 object-cover object-top rounded-lg flex-shrink-0"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-white truncate",
								children: report.item_title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-zinc-500 px-2 py-0.5 rounded-full bg-zinc-800 whitespace-nowrap",
								children: CATEGORY_LABELS[report.item_category] ?? report.item_category
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mt-1 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 text-xs text-zinc-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${REASON_ICONS[report.reason] ?? "ri-flag-line"} text-zinc-500` }), report.reason]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-zinc-700",
									children: "·"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-zinc-500",
									children: formatDate(report.reported_at)
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 ${cfg.bg} ${cfg.text}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-1.5 h-1.5 rounded-full ${cfg.dot}` }), cfg.label]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-6 h-6 flex items-center justify-center flex-shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `ri-arrow-down-s-line text-zinc-500 transition-transform ${expanded ? "rotate-180" : ""}` })
					})
				]
			}),
			expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 pb-5 border-t border-zinc-800 pt-4 flex flex-col gap-4",
				children: [
					report.details && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider",
							children: "Descripción del problema"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-zinc-300 leading-relaxed bg-zinc-800/50 rounded-xl px-4 py-3",
							children: report.details
						})]
					}),
					report.resolved_note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider",
								children: "Nota de resolución"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-zinc-400 leading-relaxed bg-zinc-800/30 rounded-xl px-4 py-3 border border-zinc-700/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-admin-line mr-1.5 text-zinc-500" }), report.resolved_note]
							}),
							report.resolved_at && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-zinc-600",
								children: formatDate(report.resolved_at)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: `/catalog/${report.item_category}/${report.item_slug ?? report.item_id}`,
							className: "flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-700 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-external-link-line" }), "Ver ítem"]
						}), report.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => onAction(report.id, "resolved"),
							className: "flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-checkbox-circle-line" }), "Marcar resuelto"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => onAction(report.id, "dismissed"),
							className: "flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-circle-line" }), "Descartar"]
						})] })]
					})
				]
			})
		]
	});
}
function AdminReports() {
	const { reports, pendingCount, newCount, loading, error, markAllSeen, resolveReport, refresh } = useAdminReports();
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [resolveModal, setResolveModal] = (0, import_react.useState)(null);
	const [seenOnMount] = (0, import_react.useState)(() => new Set(reports.map((r) => r.id)));
	(0, import_react.useEffect)(() => {
		markAllSeen();
	}, [markAllSeen]);
	const resolved = reports.filter((r) => r.status === "resolved").length;
	const dismissed = reports.filter((r) => r.status === "dismissed").length;
	const filtered = filter === "all" ? reports : reports.filter((r) => r.status === filter);
	const handleAction = (id, action) => {
		setResolveModal({
			id,
			action
		});
	};
	const handleConfirm = async (note) => {
		if (!resolveModal) return;
		await resolveReport(resolveModal.id, resolveModal.action, note || void 0);
		setResolveModal(null);
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-24 gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-800",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-loader-4-line text-zinc-400 text-2xl animate-spin" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-zinc-500",
			children: "Cargando reportes..."
		})]
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-24 gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-12 h-12 flex items-center justify-center rounded-2xl bg-rose-950/30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-rose-400 text-2xl" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-zinc-300",
				children: "Error al cargar reportes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-zinc-500",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: refresh,
				className: "flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-300 transition-colors cursor-pointer whitespace-nowrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-refresh-line" }), "Reintentar"]
			})
		]
	});
	const activeReport = resolveModal ? reports.find((r) => r.id === resolveModal.id) : null;
	const FILTERS = [
		{
			value: "all",
			label: "Todos",
			count: reports.length
		},
		{
			value: "pending",
			label: "Pendientes",
			count: pendingCount
		},
		{
			value: "resolved",
			label: "Resueltos",
			count: resolved
		},
		{
			value: "dismissed",
			label: "Descartados",
			count: dismissed
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			newCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-4 px-5 py-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-rose-500 animate-ping flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-semibold text-rose-300",
						children: [
							newCount,
							" reporte",
							newCount > 1 ? "s" : "",
							" nuevo",
							newCount > 1 ? "s" : "",
							" desde tu última visita"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: markAllSeen,
					className: "text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer whitespace-nowrap",
					children: "Marcar todos vistos"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-3",
				children: [
					{
						label: "Total reportes",
						value: reports.length,
						icon: "ri-flag-2-line",
						color: "text-zinc-400",
						bg: "bg-zinc-800"
					},
					{
						label: "Pendientes",
						value: pendingCount,
						icon: "ri-time-line",
						color: "text-amber-400",
						bg: "bg-amber-500/10"
					},
					{
						label: "Resueltos",
						value: resolved,
						icon: "ri-checkbox-circle-line",
						color: "text-emerald-400",
						bg: "bg-emerald-500/10"
					},
					{
						label: "Descartados",
						value: dismissed,
						icon: "ri-close-circle-line",
						color: "text-zinc-500",
						bg: "bg-zinc-800"
					}
				].map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `w-10 h-10 flex items-center justify-center rounded-xl ${stat.bg} flex-shrink-0`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${stat.icon} ${stat.color} text-lg` })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-2xl font-black text-white",
						style: { fontFamily: "'Space Grotesk', sans-serif" },
						children: stat.value
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-zinc-500",
						children: stat.label
					})] })]
				}, stat.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-fit",
				children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setFilter(f.value),
					className: `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${filter === f.value ? "bg-white text-zinc-900" : "text-zinc-400 hover:text-zinc-200"}`,
					children: [f.label, f.count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `px-1.5 py-0.5 rounded-full text-xs font-bold ${filter === f.value ? "bg-zinc-200 text-zinc-700" : f.value === "pending" && f.count > 0 ? "bg-amber-500/20 text-amber-400" : "bg-zinc-800 text-zinc-500"}`,
						children: f.count
					})]
				}, f.value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-3",
				children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center py-16 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-14 h-14 flex items-center justify-center rounded-2xl bg-zinc-800 mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-flag-2-line text-zinc-500 text-2xl" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-zinc-400",
							children: "No hay reportes en esta categoría"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-zinc-600 mt-1",
							children: "Cuando los usuarios reporten problemas aparecerán aquí"
						})
					]
				}) : filtered.map((report) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportRow, {
					report,
					isNew: !seenOnMount.has(report.id),
					onAction: handleAction
				}, report.id))
			}),
			resolveModal && activeReport && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResolveModal, {
				report: activeReport,
				action: resolveModal.action,
				onConfirm: handleConfirm,
				onClose: () => setResolveModal(null)
			})
		]
	});
}
//#endregion
//#region src/pages/admin/page.tsx
var SECTION_TITLES = {
	overview: {
		title: "Resumen general",
		subtitle: "KPIs, actividad y estado del sistema.",
		icon: "ri-dashboard-3-line"
	},
	users: {
		title: "Gestión de usuarios",
		subtitle: "Administra cuentas, roles y accesos.",
		icon: "ri-group-line"
	},
	catalog: {
		title: "Catálogo",
		subtitle: "Gestiona los ítems del catálogo de Vaultly.",
		icon: "ri-database-2-line"
	},
	entities: {
		title: "Entidades",
		subtitle: "Crea y edita desarrolladores, actores, autores y más.",
		icon: "ri-user-star-line"
	},
	reviews: {
		title: "Moderación de reseñas",
		subtitle: "Aprueba, rechaza o elimina reseñas.",
		icon: "ri-quill-pen-line"
	},
	reports: {
		title: "Reportes de usuarios",
		subtitle: "Revisa y gestiona los problemas reportados en el catálogo.",
		icon: "ri-flag-2-line"
	},
	audit: {
		title: "Auditoría",
		subtitle: "Historial de acciones administrativas del sistema.",
		icon: "ri-shield-check-line"
	}
};
function getSectionFromPath(path) {
	if (path.includes("/users")) return "users";
	if (path.includes("/catalog")) return "catalog";
	if (path.includes("/entities")) return "entities";
	if (path.includes("/reviews")) return "reviews";
	if (path.includes("/reports")) return "reports";
	if (path.includes("/audit")) return "audit";
	return "overview";
}
function AdminPage() {
	const { isLoggedIn } = useAuth();
	const navigate = useNavigate();
	const [mobileMenuOpen, setMobileMenuOpen] = (0, import_react.useState)(false);
	const { pendingCount, newCount, markAllSeen } = useAdminReports();
	const path = window.location.pathname;
	const section = getSectionFromPath(path);
	const { title, subtitle, icon } = SECTION_TITLES[section];
	(0, import_react.useEffect)(() => {
		if (!isLoggedIn) navigate("/");
	}, [isLoggedIn, navigate]);
	if (!isLoggedIn) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-zinc-950 flex",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoHead, {
				title: "Admin — Vaultly",
				description: "Panel de administración de Vaultly.",
				canonical: "/admin",
				noIndex: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden lg:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSidebar, {})
			}),
			mobileMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:hidden fixed inset-0 z-50 flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 bg-black/70",
					onClick: () => setMobileMenuOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative z-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSidebar, { onClose: () => setMobileMenuOpen(false) })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex flex-col min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between px-4 md:px-8 py-4 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-30",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMobileMenuOpen(true),
							className: "lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 transition-colors cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-menu-line text-lg" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${icon} text-zinc-400 text-lg` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-base font-bold text-white leading-tight",
								style: { fontFamily: "'Space Grotesk', sans-serif" },
								children: title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-zinc-500 hidden sm:block",
								children: subtitle
							})] })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [newCount > 0 && section !== "reports" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/reports",
							onClick: markAllSeen,
							className: "relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-semibold hover:bg-rose-500/30 transition-colors cursor-pointer whitespace-nowrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-flag-2-line" }),
								newCount,
								" reporte",
								newCount > 1 ? "s" : "",
								" nuevo",
								newCount > 1 ? "s" : "",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold",
								children: "N"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-violet-300 hidden sm:block",
								children: "Admin"
							})]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "flex-1 px-4 md:px-8 py-8 overflow-auto",
					children: [
						section === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminOverview, {}),
						section === "users" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminUsers, {}),
						section === "catalog" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCatalog, {}),
						section === "entities" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEntities, {}),
						section === "reviews" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminReviews, {}),
						section === "reports" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminReports, {}),
						section === "audit" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminAuditLogs, {})
					]
				})]
			})
		]
	});
}
//#endregion
export { AdminPage as default };

//# sourceMappingURL=page-CP3djQH5.js.map