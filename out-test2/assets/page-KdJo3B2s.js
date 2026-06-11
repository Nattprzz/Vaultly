import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { c as useAuth, f as useNavigate, h as require_react, s as require_jsx_runtime, t as useCategories, u as Link } from "./index-cosAM6zi.js";
import { t as SeoHead } from "./SeoHead-SAtaEFdZ.js";
import { a as useTracker, t as Navbar } from "./Navbar-XnbO_Z_a.js";
import { r as useMyReviews, t as formatDate } from "./useReviews-DBv0YoLg.js";
//#region src/pages/profile/components/ShareModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var SHARE_OPTIONS = [
	{
		id: "twitter",
		label: "X / Twitter",
		icon: "ri-twitter-x-line",
		color: "#000000",
		getUrl: (url, name) => `https://twitter.com/intent/tweet?text=Echa%20un%20vistazo%20a%20mi%20vault%20en%20Vaultly%20%F0%9F%8E%AE%F0%9F%8E%AC%F0%9F%93%9A&url=${encodeURIComponent(url)}&via=vaultlyapp`
	},
	{
		id: "whatsapp",
		label: "WhatsApp",
		icon: "ri-whatsapp-line",
		color: "#25D366",
		getUrl: (url, name) => `https://wa.me/?text=Mira%20mi%20tracker%20personal%20en%20Vaultly%3A%20${encodeURIComponent(url)}`
	},
	{
		id: "telegram",
		label: "Telegram",
		icon: "ri-telegram-line",
		color: "#2AABEE",
		getUrl: (url, name) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=Mi%20vault%20en%20Vaultly`
	},
	{
		id: "reddit",
		label: "Reddit",
		icon: "ri-reddit-line",
		color: "#FF4500",
		getUrl: (url, name) => `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=Mi%20tracker%20en%20Vaultly`
	}
];
function ShareModal({ username, displayName, profileUrl, onClose }) {
	(0, import_react.useEffect)(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "";
		};
	}, []);
	const handleCopy = () => navigator.clipboard.writeText(profileUrl);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4",
		onClick: (e) => {
			if (e.target === e.currentTarget) onClose();
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-bold text-zinc-900 dark:text-white",
					children: "Compartir perfil"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-zinc-500 mt-0.5",
					children: "Comparte tu vault con el mundo"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-line" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 flex flex-col gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0",
								children: displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold text-zinc-900 dark:text-white",
									children: displayName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-zinc-500",
									children: [
										"@",
										username,
										" · Vaultly"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-rose-500 flex-shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-archive-2-line text-white text-sm" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2",
						children: "Enlace directo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-link text-zinc-400 text-sm flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-zinc-600 dark:text-zinc-400 truncate",
								children: profileUrl
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleCopy,
							className: "flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-file-copy-line" }), "Copiar"]
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3",
						children: "Compartir en redes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2",
						children: SHARE_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: opt.getUrl(profileUrl, displayName),
							target: "_blank",
							rel: "nofollow noreferrer",
							className: "flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
								className: `${opt.icon} text-lg`,
								style: { color: opt.color }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
								children: opt.label
							})]
						}, opt.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2 p-3 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-information-line text-violet-500 text-sm mt-0.5 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-violet-700 dark:text-violet-400",
							children: [
								"Quien visite tu perfil podrá ver tu tracker completo, estadísticas y reseñas públicas. Puedes cambiar la visibilidad en ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Configuración → Privacidad" }),
								"."
							]
						})]
					})
				]
			})]
		})]
	});
}
//#endregion
//#region src/pages/profile/components/ProfileHero.tsx
function ProfileHero({ isOwn }) {
	const { profile } = useAuth();
	const { entries } = useTracker();
	const [shareOpen, setShareOpen] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const all = Object.values(entries);
	const completed = all.filter((e) => e.status === "completed").length;
	const rated = all.filter((e) => e.rating !== null);
	const avgRating = rated.length > 0 ? (rated.reduce((s, e) => s + (e.rating ?? 0), 0) / rated.length).toFixed(1) : "—";
	const reviews = all.filter((e) => e.review && e.review.trim().length > 0).length;
	const profileUsername = profile?.username ?? profile?.email?.split("@")[0] ?? "usuario";
	const profileUrl = `${window.location.origin}/u/${profileUsername}`;
	const handleCopy = () => {
		navigator.clipboard.writeText(profileUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	const initials = profile?.initials ?? profile?.display_name?.slice(0, 2).toUpperCase() ?? "??";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full h-48 md:h-64 overflow-hidden rounded-2xl mb-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "https://readdy.ai/api/search-image?query=abstract%20dark%20cinematic%20gradient%20background%20bokeh%20lights%20moody%20atmosphere%20deep%20dark%20tones%20artistic%20photography%20ultra%20wide%20panoramic%20minimal&width=1400&height=400&seq=profile-banner-01&orientation=landscape",
					alt: "Banner de perfil",
					className: "w-full h-full object-cover object-top"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-transparent to-transparent" }),
				isOwn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/settings",
					className: "absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm text-white text-xs font-medium hover:bg-black/60 transition-colors cursor-pointer whitespace-nowrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-edit-line" }), "Editar perfil"]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-4 md:px-8 -mt-16 relative z-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row md:items-end justify-between gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end gap-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center text-white text-3xl font-black border-4 border-white dark:border-zinc-950 flex-shrink-0",
						children: initials
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pb-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-2xl md:text-3xl font-black text-zinc-900 dark:text-white",
									style: { fontFamily: "'Space Grotesk', sans-serif" },
									children: profile?.display_name ?? profileUsername
								}), profile?.is_public && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-global-line text-xs" }), "Público"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-zinc-500 dark:text-zinc-400",
								children: ["@", profileUsername]
							}),
							profile?.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-md",
								children: profile.bio
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 pb-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: profileUrl,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-eye-line" }), "Ver perfil público"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleCopy,
							className: `flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${copied ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400" : "border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: copied ? "ri-checkbox-circle-line" : "ri-link" }), copied ? "Copiado" : "Copiar enlace"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setShareOpen(true),
							className: "flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-share-forward-line" }), "Compartir"]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800",
				children: [[
					{
						label: "En tracker",
						value: all.length,
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
				}, stat.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 ml-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-zinc-400",
						children: "Miembro desde"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold text-zinc-600 dark:text-zinc-300",
						children: "Enero 2024"
					})]
				})]
			})]
		}),
		shareOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareModal, {
			username: profileUsername,
			displayName: profile?.display_name ?? profileUsername,
			profileUrl,
			onClose: () => setShareOpen(false)
		})
	] });
}
//#endregion
//#region src/pages/profile/components/ProfileStats.tsx
function ProfileStats() {
	const CATEGORIES = useCategories();
	const { entries } = useTracker();
	const all = Object.values(entries);
	const globalCompleted = all.filter((e) => e.status === "completed").length;
	const globalInProgress = all.filter((e) => e.status === "in_progress").length;
	const globalPending = all.filter((e) => e.status === "pending").length;
	const globalDropped = all.filter((e) => e.status === "dropped").length;
	const completionRate = all.length > 0 ? Math.round(globalCompleted / all.length * 100) : 0;
	const rated = all.filter((e) => e.rating !== null);
	const avgRating = rated.length > 0 ? (rated.reduce((s, e) => s + (e.rating ?? 0), 0) / rated.length).toFixed(1) : "—";
	[...all].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0];
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
								value: globalCompleted,
								color: "text-emerald-500",
								bg: "bg-emerald-50 dark:bg-emerald-950/30",
								icon: "ri-checkbox-circle-line"
							},
							{
								label: "En progreso",
								value: globalInProgress,
								color: "text-amber-500",
								bg: "bg-amber-50 dark:bg-amber-950/30",
								icon: "ri-loader-4-line"
							},
							{
								label: "Pendientes",
								value: globalPending,
								color: "text-zinc-500",
								bg: "bg-zinc-100 dark:bg-zinc-800",
								icon: "ri-bookmark-line"
							},
							{
								label: "Abandonados",
								value: globalDropped,
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-bold text-zinc-900 dark:text-white mb-5 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-bar-chart-box-line text-rose-500" }), "Por categoría"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-4",
					children: CATEGORIES.map((cat) => {
						const catEntries = all.filter((e) => e.category === cat.id);
						if (catEntries.length === 0) return null;
						const catCompleted = catEntries.filter((e) => e.status === "completed").length;
						const catRated = catEntries.filter((e) => e.rating !== null);
						const catAvg = catRated.length > 0 ? (catRated.reduce((s, e) => s + (e.rating ?? 0), 0) / catRated.length).toFixed(1) : "—";
						const pct = catEntries.length > 0 ? Math.round(catCompleted / catEntries.length * 100) : 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
									catCompleted,
									"/",
									catEntries.length
								] }), catAvg !== "—" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-zinc-700 dark:text-zinc-300",
										children: catAvg
									})]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full transition-all duration-700",
								style: {
									width: `${pct}%`,
									background: cat.accent
								}
							})
						})] }, cat.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/30 mx-auto mb-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-lg" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-black text-zinc-900 dark:text-white mb-1",
								style: { fontFamily: "'Space Grotesk', sans-serif" },
								children: avgRating
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-zinc-500",
								children: "Puntuación media"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-10 h-10 flex items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/30 mx-auto mb-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-quill-pen-line text-violet-500 text-lg" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-black text-zinc-900 dark:text-white mb-1",
								style: { fontFamily: "'Space Grotesk', sans-serif" },
								children: all.filter((e) => e.review?.trim()).length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-zinc-500",
								children: "Reseñas escritas"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30 mx-auto mb-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-trophy-line text-emerald-500 text-lg" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-2xl font-black text-zinc-900 dark:text-white mb-1",
								style: { fontFamily: "'Space Grotesk', sans-serif" },
								children: [completionRate, "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-zinc-500",
								children: "Tasa de finalización"
							})
						]
					})
				]
			})
		]
	});
}
//#endregion
//#region src/pages/profile/components/ProfileShowcase.tsx
function enrichItem(entry, categories) {
	const category = entry.category;
	const cat = categories.find((c) => c.id === category);
	if (!cat) return null;
	return {
		itemId: entry.itemId,
		category,
		rating: entry.rating,
		status: entry.status,
		title: entry.title,
		cover: entry.cover,
		year: entry.year,
		genre: entry.genre,
		catAccent: cat.accent,
		catIcon: cat.icon
	};
}
function ProfileShowcase() {
	const categories = useCategories();
	const { entries } = useTracker();
	const all = Object.values(entries);
	const topRated = all.filter((e) => e.rating !== null && e.status === "completed").sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 6).map((e) => enrichItem(e, categories)).filter(Boolean);
	const recentCompleted = all.filter((e) => e.status === "completed").sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 4).map((e) => enrichItem(e, categories)).filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [topRated.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-trophy-line text-amber-400 text-lg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-bold text-zinc-900 dark:text-white",
				children: "Mejor valorados"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-3 sm:grid-cols-6 gap-3",
			children: topRated.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: `/catalog/${item.category}/${item.itemId}`,
				className: "group cursor-pointer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative rounded-xl overflow-hidden mb-2 aspect-[2/3]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: item.cover,
							alt: item.title,
							className: "w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute bottom-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-xs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-white text-xs font-bold",
								children: item.rating
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute top-1.5 left-1.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-5 h-5 flex items-center justify-center rounded-md backdrop-blur-sm",
								style: { background: `${item.catAccent}40` },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
									className: `${item.catIcon} text-xs`,
									style: { color: item.catAccent }
								})
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold text-zinc-900 dark:text-white line-clamp-2 leading-tight",
					children: item.title
				})]
			}, item.itemId))
		})] }), recentCompleted.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-checkbox-circle-line text-emerald-500 text-lg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-bold text-zinc-900 dark:text-white",
				children: "Completados recientemente"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-3",
			children: recentCompleted.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: `/catalog/${item.category}/${item.itemId}`,
				className: "group flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all cursor-pointer",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-black text-zinc-300 dark:text-zinc-700 w-5 text-center flex-shrink-0",
						children: idx + 1
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-14 rounded-lg overflow-hidden flex-shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: item.cover,
							alt: item.title,
							className: "w-full h-full object-cover object-top"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-1",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mt-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs px-2 py-0.5 rounded-full font-medium",
								style: {
									background: `${item.catAccent}15`,
									color: item.catAccent
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${item.catIcon} mr-1 text-xs` }), item.genre]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-zinc-400",
								children: item.year
							})]
						})]
					}),
					item.rating !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-s-line text-zinc-300 dark:text-zinc-600 flex-shrink-0" })
				]
			}, item.itemId))
		})] })]
	});
}
//#endregion
//#region src/pages/profile/components/ProfileReviews.tsx
function ProfileReviews() {
	const { profile } = useAuth();
	const { reviews, loading } = useMyReviews();
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
				children: "Cuando escribas reseñas en el catálogo, aparecerán aquí."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/catalog",
				className: "mt-4 text-sm text-violet-500 hover:text-violet-600 font-medium cursor-pointer",
				children: "Explorar catálogo →"
			})
		]
	});
	const initials = profile?.initials ?? "??";
	const displayName = profile?.display_name ?? profile?.username ?? "Tú";
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
										className: "text-sm font-bold text-zinc-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors line-clamp-1",
										children: title
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-2 mt-1 flex-wrap",
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
//#region src/pages/profile/page.tsx
var TABS = [
	{
		id: "showcase",
		label: "Highlights",
		icon: "ri-trophy-line"
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
function ProfilePage() {
	const { isLoggedIn } = useAuth();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = (0, import_react.useState)("showcase");
	(0, import_react.useEffect)(() => {
		if (!isLoggedIn) navigate("/");
	}, [isLoggedIn, navigate]);
	if (!isLoggedIn) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-zinc-50 dark:bg-zinc-950",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoHead, {
				title: "Mi Perfil — Vaultly",
				description: "Tu perfil público en Vaultly. Muestra tus highlights, estadísticas y reseñas culturales.",
				canonical: "/profile",
				noIndex: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-white dark:bg-zinc-950 pb-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileHero, { isOwn: true })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 sticky top-16 z-30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-w-screen-xl mx-auto px-4 md:px-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1",
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
							activeTab === "showcase" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileShowcase, {}),
							activeTab === "stats" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileStats, {}),
							activeTab === "reviews" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileReviews, {})
						]
					})
				]
			})
		]
	});
}
//#endregion
export { ProfilePage as default };

//# sourceMappingURL=page-KdJo3B2s.js.map