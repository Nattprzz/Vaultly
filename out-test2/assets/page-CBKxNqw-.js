import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { c as useAuth, h as require_react, l as supabase, s as require_jsx_runtime, t as useCategories, u as Link } from "./index-cosAM6zi.js";
import { n as getSiteUrl, t as SeoHead } from "./SeoHead-SAtaEFdZ.js";
import { t as Navbar } from "./Navbar-XnbO_Z_a.js";
//#region src/pages/home/components/HeroSection.tsx
var import_jsx_runtime = require_jsx_runtime();
function HeroSection() {
	const { isLoggedIn } = useAuth();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative min-h-screen flex items-center justify-center overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "https://readdy.ai/api/search-image?query=abstract%20dark%20cinematic%20background%20bokeh%20lights%20film%20grain%20moody%20atmosphere%20deep%20dark%20tones%20artistic%20photography%20ultra%20wide%20panoramic&width=1920&height=1080&seq=hero-bg-01&orientation=landscape",
					alt: "Vaultly hero background",
					className: "w-full h-full object-cover object-top"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 overflow-hidden pointer-events-none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute top-1/4 left-8 md:left-16 w-28 h-40 rounded-xl overflow-hidden opacity-30 rotate-[-8deg] hidden lg:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "https://readdy.ai/api/search-image?query=epic%20video%20game%20controller%20neon%20glow%20dark%20background%20cinematic%20lighting%20purple%20tones%20ultra%20detailed%20artistic%20render&width=112&height=160&seq=deco-g1&orientation=portrait",
							alt: "",
							className: "w-full h-full object-cover object-top"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute top-1/3 right-8 md:right-16 w-24 h-36 rounded-xl overflow-hidden opacity-25 rotate-[6deg] hidden lg:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "https://readdy.ai/api/search-image?query=cinematic%20movie%20reel%20film%20strip%20dramatic%20lighting%20dark%20moody%20atmosphere%20red%20tones%20artistic%20photography&width=96&height=144&seq=deco-m1&orientation=portrait",
							alt: "",
							className: "w-full h-full object-cover object-top"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute bottom-1/3 left-24 w-20 h-32 rounded-xl overflow-hidden opacity-20 rotate-[4deg] hidden lg:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "https://readdy.ai/api/search-image?query=stack%20of%20books%20library%20warm%20lighting%20cozy%20atmosphere%20green%20tones%20bokeh%20background%20artistic%20photography&width=80&height=128&seq=deco-b1&orientation=portrait",
							alt: "",
							className: "w-full h-full object-cover object-top"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 w-full text-center px-4 md:px-6 flex flex-col items-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-medium mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" }), "Tu catálogo personal de cultura y entretenimiento"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight",
						style: { fontFamily: "'Space Grotesk', sans-serif" },
						children: [
							"Todo lo que",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-gradient-to-r from-violet-400 via-rose-400 to-amber-400 bg-clip-text text-transparent",
								children: "consumes,"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"organizado."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg md:text-xl text-white/70 max-w-2xl mb-10 leading-relaxed",
						children: "Videojuegos, películas, series, libros y conciertos. Lleva el control de todo lo que has visto, jugado, leído y vivido en un solo lugar."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row items-center gap-4",
						children: [isLoggedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard",
							className: "px-8 py-3.5 rounded-xl bg-white text-zinc-900 font-semibold text-base hover:bg-zinc-100 transition-colors cursor-pointer whitespace-nowrap",
							children: "Ir a mi Dashboard"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							className: "px-8 py-3.5 rounded-xl bg-white text-zinc-900 font-semibold text-base hover:bg-zinc-100 transition-colors cursor-pointer whitespace-nowrap",
							children: "Empieza gratis"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/catalog",
							className: "px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-base hover:bg-white/20 transition-colors cursor-pointer whitespace-nowrap",
							children: "Explorar catálogo"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap items-center justify-center gap-2 mt-12",
						children: [
							{
								icon: "ri-gamepad-line",
								label: "Videojuegos",
								color: "#8b5cf6"
							},
							{
								icon: "ri-film-line",
								label: "Películas",
								color: "#f43f5e"
							},
							{
								icon: "ri-tv-2-line",
								label: "Series",
								color: "#f59e0b"
							},
							{
								icon: "ri-book-open-line",
								label: "Libros",
								color: "#10b981"
							},
							{
								icon: "ri-music-2-line",
								label: "Conciertos",
								color: "#0ea5e9"
							}
						].map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
								className: cat.icon,
								style: { color: cat.color }
							}), cat.label]
						}, cat.label))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 animate-bounce",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-down-line text-xl" })
			})
		]
	});
}
//#endregion
//#region src/pages/home/components/CategoriesSection.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function CategoriesSection() {
	const CATEGORIES = useCategories();
	const sectionRef = (0, import_react.useRef)(null);
	const headerRef = (0, import_react.useRef)(null);
	const [visibleCards, setVisibleCards] = (0, import_react.useState)(new Array(CATEGORIES.length).fill(false));
	const [visibleHeader, setVisibleHeader] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const headerObserver = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setVisibleHeader(true);
				headerObserver.disconnect();
			}
		}, { threshold: .2 });
		if (headerRef.current) headerObserver.observe(headerRef.current);
		return () => headerObserver.disconnect();
	}, []);
	(0, import_react.useEffect)(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				CATEGORIES.forEach((_, i) => {
					setTimeout(() => {
						setVisibleCards((prev) => {
							const next = [...prev];
							next[i] = true;
							return next;
						});
					}, i * 100);
				});
				observer.disconnect();
			}
		}, { threshold: .15 });
		if (sectionRef.current) observer.observe(sectionRef.current);
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-24 px-4 md:px-6 bg-white dark:bg-zinc-950",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-screen-xl mx-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: headerRef,
				className: "text-center mb-14",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-violet-500 uppercase tracking-widest mb-3",
						style: {
							transition: "opacity 500ms ease-out, transform 500ms ease-out",
							opacity: visibleHeader ? 1 : 0,
							transform: visibleHeader ? "translateY(0)" : "translateY(-20px)"
						},
						children: "Categorías"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-4",
						style: {
							fontFamily: "'Space Grotesk', sans-serif",
							transition: "opacity 500ms ease-out 100ms, transform 500ms ease-out 100ms",
							opacity: visibleHeader ? 1 : 0,
							transform: visibleHeader ? "translateY(0)" : "translateY(-20px)"
						},
						children: "Un tracker para cada pasión"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-base",
						style: {
							transition: "opacity 500ms ease-out 200ms, transform 500ms ease-out 200ms",
							opacity: visibleHeader ? 1 : 0,
							transform: visibleHeader ? "translateY(0)" : "translateY(-20px)"
						},
						children: "Elige las categorías que más te interesan y personaliza tu experiencia en Vaultly."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: sectionRef,
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4",
				children: CATEGORIES.map((cat, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: `/catalog/${cat.id}`,
					className: "group relative overflow-hidden rounded-2xl cursor-pointer border-2 border-transparent",
					style: {
						transition: "border-color 300ms, opacity 500ms ease-out, transform 500ms ease-out",
						opacity: visibleCards[i] ? 1 : 0,
						transform: visibleCards[i] ? "translateY(0)" : "translateY(32px)"
					},
					onMouseEnter: (e) => e.currentTarget.style.borderColor = cat.accent,
					onMouseLeave: (e) => e.currentTarget.style.borderColor = "transparent",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "aspect-[3/4] relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: cat.image,
									alt: cat.label,
									className: "w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300` })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute bottom-0 left-0 right-0 p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br ${cat.color} mb-3 group-hover:scale-125`,
									style: { transition: "transform 300ms, box-shadow 300ms" },
									onMouseEnter: (e) => e.currentTarget.style.boxShadow = `0 0 16px 4px ${cat.accent}99`,
									onMouseLeave: (e) => e.currentTarget.style.boxShadow = "none",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${cat.icon} text-white text-lg` })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-white font-bold text-lg leading-tight mb-1 transition-transform duration-300 ease-out group-hover:-translate-y-0.5",
									children: cat.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "overflow-hidden h-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-white/60 text-xs translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out",
										children: [cat.count.toLocaleString(), " ítems"]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-up-line text-white text-sm" })
							})
						})
					]
				}, cat.id))
			})]
		})
	});
}
//#endregion
//#region src/pages/home/components/FeaturedSection.tsx
var STATUS_COLORS = { Catalogo: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400" };
var FADE_OUT_MS = 180;
var STAGGER_MS = 70;
function FeaturedSection() {
	const CATEGORIES = useCategories();
	const [activeFilter, setActiveFilter] = (0, import_react.useState)("all");
	const [displayFilter, setDisplayFilter] = (0, import_react.useState)("all");
	const [isTransitioning, setIsTransitioning] = (0, import_react.useState)(false);
	const [visibleHeader, setVisibleHeader] = (0, import_react.useState)(false);
	const [visibleCards, setVisibleCards] = (0, import_react.useState)([]);
	const [items, setItems] = (0, import_react.useState)([]);
	const headerRef = (0, import_react.useRef)(null);
	const cardsRef = (0, import_react.useRef)(null);
	const transitionTimers = (0, import_react.useRef)([]);
	(0, import_react.useEffect)(() => {
		const load = async () => {
			const { data } = await supabase.from("catalog_items").select("id, slug, category, title, image_url, release_date, metadata").order("updated_at", { ascending: false }).limit(24);
			setItems((data ?? []).map((item) => ({
				id: item.id,
				slug: item.slug,
				category: item.category,
				title: item.title,
				cover: item.image_url ?? "",
				rating: item.metadata?.rating != null ? Number(item.metadata.rating) : null,
				year: item.release_date?.slice(0, 4) ?? "",
				status: "Catalogo"
			})));
		};
		load();
	}, []);
	const filtered = displayFilter === "all" ? items.slice(0, 6) : items.filter((i) => i.category === displayFilter).slice(0, 6);
	const clearTimers = (0, import_react.useCallback)(() => {
		transitionTimers.current.forEach(clearTimeout);
		transitionTimers.current = [];
	}, []);
	const staggerCardsIn = (0, import_react.useCallback)((count) => {
		setVisibleCards(new Array(count).fill(false));
		transitionTimers.current = Array.from({ length: count }, (_, i) => setTimeout(() => {
			setVisibleCards((prev) => {
				const next = [...prev];
				next[i] = true;
				return next;
			});
		}, i * STAGGER_MS));
	}, []);
	const handleFilterChange = (0, import_react.useCallback)((newFilter) => {
		if (newFilter === activeFilter) return;
		clearTimers();
		setIsTransitioning(true);
		setActiveFilter(newFilter);
		const swapTimer = setTimeout(() => {
			setDisplayFilter(newFilter);
			setIsTransitioning(false);
			staggerCardsIn(newFilter === "all" ? Math.min(items.length, 6) : Math.min(items.filter((i) => i.category === newFilter).length, 6));
		}, FADE_OUT_MS);
		transitionTimers.current.push(swapTimer);
	}, [
		activeFilter,
		clearTimers,
		items,
		staggerCardsIn
	]);
	(0, import_react.useEffect)(() => {
		const el = headerRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setVisibleHeader(true);
				observer.disconnect();
			}
		}, { threshold: .2 });
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	(0, import_react.useEffect)(() => {
		const el = cardsRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				staggerCardsIn(filtered.length);
				observer.disconnect();
			}
		}, { threshold: .1 });
		observer.observe(el);
		return () => observer.disconnect();
	}, [filtered.length, staggerCardsIn]);
	(0, import_react.useEffect)(() => () => clearTimers(), [clearTimers]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-24 px-4 md:px-6 bg-zinc-50 dark:bg-zinc-900",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-screen-xl mx-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: headerRef,
					className: "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-rose-500 uppercase tracking-widest mb-3 transition-all duration-500",
						style: {
							opacity: visibleHeader ? 1 : 0,
							transform: visibleHeader ? "translateY(0)" : "translateY(-16px)",
							transitionDelay: "0ms"
						},
						children: "Destacados"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl md:text-4xl font-black text-zinc-900 dark:text-white transition-all duration-500",
						style: {
							fontFamily: "'Space Grotesk', sans-serif",
							opacity: visibleHeader ? 1 : 0,
							transform: visibleHeader ? "translateY(0)" : "translateY(-16px)",
							transitionDelay: "100ms"
						},
						children: "Catalogo reciente"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 flex-wrap transition-all duration-500",
						style: {
							opacity: visibleHeader ? 1 : 0,
							transform: visibleHeader ? "translateY(0)" : "translateY(-16px)",
							transitionDelay: "200ms"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleFilterChange("all"),
							className: `px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${activeFilter === "all" ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"}`,
							children: "Todo"
						}), CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => handleFilterChange(cat.id),
							className: `flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${activeFilter === cat.id ? "text-white" : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"}`,
							style: activeFilter === cat.id ? { background: cat.accent } : {},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${cat.icon} text-xs` }), cat.label]
						}, cat.id))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: cardsRef,
					className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 transition-opacity",
					style: {
						opacity: isTransitioning ? 0 : 1,
						transitionDuration: `${FADE_OUT_MS}ms`
					},
					children: filtered.map((item, index) => {
						const cat = CATEGORIES.find((c) => c.id === item.category);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: `/catalog/${item.category}/${item.slug}`,
							className: "group cursor-pointer transition-all duration-500",
							style: {
								opacity: visibleCards[index] ? 1 : 0,
								transform: visibleCards[index] ? "translateY(0)" : "translateY(24px)"
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative rounded-xl overflow-hidden mb-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "aspect-[2/3] bg-zinc-100 dark:bg-zinc-800",
											children: item.cover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: item.cover,
												alt: item.title,
												className: "w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-full h-full flex items-center justify-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${cat?.icon ?? "ri-image-line"} text-3xl text-zinc-400` })
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute top-2 left-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-6 h-6 flex items-center justify-center rounded-lg",
												style: {
													background: `${cat?.accent}30`,
													backdropFilter: "blur(4px)"
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
													className: `${cat?.icon} text-xs`,
													style: { color: cat?.accent }
												})
											})
										}),
										item.rating != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-xs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-white text-xs font-semibold",
												children: item.rating.toFixed(1)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400",
											children: [item.rating != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-xs" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-white text-xs font-semibold",
														children: item.rating.toFixed(1)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-white/50 text-xs ml-1",
														children: item.year
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-white",
												style: { background: cat?.accent ?? "#e11d48" },
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-eye-line text-xs" }), "Ver detalle"]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-semibold text-zinc-900 dark:text-white leading-tight mb-1 line-clamp-2",
									children: item.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-500",
										children: item.year
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[item.status] || "bg-zinc-100 text-zinc-500"}`,
										children: item.status
									})]
								})
							]
						}, item.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center mt-10 transition-all duration-500",
					style: {
						opacity: visibleCards[Math.max(filtered.length - 1, 0)] ? 1 : 0,
						transform: visibleCards[Math.max(filtered.length - 1, 0)] ? "translateY(0)" : "translateY(16px)",
						transitionDelay: `${filtered.length * STAGGER_MS}ms`
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/catalog",
						className: "inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer",
						children: ["Ver todo el catalogo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-line" })]
					})
				})
			]
		})
	});
}
//#endregion
//#region src/pages/home/components/StatsSection.tsx
function StatsSection() {
	const [stats, setStats] = (0, import_react.useState)([
		{
			label: "Items en catalogo",
			value: "0",
			icon: "ri-database-2-line"
		},
		{
			label: "Usuarios activos",
			value: "0",
			icon: "ri-user-heart-line"
		},
		{
			label: "Resenas escritas",
			value: "0",
			icon: "ri-quill-pen-line"
		},
		{
			label: "Trackers creados",
			value: "0",
			icon: "ri-bar-chart-box-line"
		}
	]);
	(0, import_react.useEffect)(() => {
		const load = async () => {
			const [items, users, reviews, trackers] = await Promise.all([
				supabase.from("catalog_items").select("id", {
					count: "exact",
					head: true
				}),
				supabase.from("profiles").select("id", {
					count: "exact",
					head: true
				}),
				supabase.from("user_item_tracking").select("id", {
					count: "exact",
					head: true
				}).not("review", "is", null).neq("review", ""),
				supabase.from("user_item_tracking").select("id", {
					count: "exact",
					head: true
				})
			]);
			setStats([
				{
					label: "Items en catalogo",
					value: (items.count ?? 0).toLocaleString(),
					icon: "ri-database-2-line"
				},
				{
					label: "Usuarios activos",
					value: (users.count ?? 0).toLocaleString(),
					icon: "ri-user-heart-line"
				},
				{
					label: "Resenas escritas",
					value: (reviews.count ?? 0).toLocaleString(),
					icon: "ri-quill-pen-line"
				},
				{
					label: "Trackers creados",
					value: (trackers.count ?? 0).toLocaleString(),
					icon: "ri-bar-chart-box-line"
				}
			]);
		};
		load();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20 px-4 md:px-6 bg-zinc-900 dark:bg-zinc-950",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-screen-xl mx-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-8",
				children: stats.map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 mx-auto mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${stat.icon} text-white text-xl` })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl md:text-4xl font-black text-white mb-2",
							style: { fontFamily: "'Space Grotesk', sans-serif" },
							children: stat.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-zinc-400 text-sm",
							children: stat.label
						})
					]
				}, stat.label))
			})
		})
	});
}
//#endregion
//#region src/pages/home/components/CTASection.tsx
function CTASection() {
	const { isLoggedIn } = useAuth();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-24 px-4 md:px-6 bg-white dark:bg-zinc-950",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-3xl mx-auto text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-6",
					style: { fontFamily: "'Space Grotesk', sans-serif" },
					children: "Tu cultura, tu vault."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-zinc-500 dark:text-zinc-400 text-lg mb-10",
					children: "Únete a miles de personas que ya llevan el control de todo lo que consumen. Gratis, siempre."
				}),
				isLoggedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard",
					className: "inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-base hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap",
					children: ["Ir a mi Dashboard ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-line" })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/auth",
					className: "inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-base hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap",
					children: ["Crear cuenta gratis ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-line" })]
				})
			]
		})
	});
}
//#endregion
//#region src/pages/home/page.tsx
function getHomeJsonLd() {
	const siteUrl = getSiteUrl();
	return [{
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Vaultly",
		url: siteUrl,
		description: "Plataforma cultural todo-en-uno para trackear películas, series, libros, videojuegos y anime.",
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${siteUrl}/catalog?q={search_term_string}`
			},
			"query-input": "required name=search_term_string"
		}
	}, {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Vaultly",
		url: siteUrl,
		logo: `${siteUrl}/favicon.png`,
		sameAs: []
	}];
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-white dark:bg-zinc-950",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoHead, {
				title: "Vaultly - Trackea películas, series, libros, videojuegos y anime",
				description: "Vaultly es tu plataforma cultural todo-en-uno. Trackea películas, series, libros, videojuegos, anime y más. Descubre, organiza y comparte tu consumo cultural con la comunidad.",
				keywords: "tracker cultural, películas, series, libros, videojuegos, anime, Vaultly",
				canonical: "/",
				jsonLd: getHomeJsonLd()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoriesSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeaturedSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTASection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "bg-zinc-900 dark:bg-black py-10 px-4 md:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-archive-2-line text-white text-xs" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-white",
								style: { fontFamily: "'Space Grotesk', sans-serif" },
								children: "Vaultly"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-zinc-500 text-sm",
							children: "© 2026 Vaultly. Todos los derechos reservados."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4 text-zinc-500 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/privacy",
									rel: "nofollow",
									className: "hover:text-white transition-colors cursor-pointer",
									children: "Privacidad"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/terms",
									rel: "nofollow",
									className: "hover:text-white transition-colors cursor-pointer",
									children: "Términos"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/contact",
									rel: "nofollow",
									className: "hover:text-white transition-colors cursor-pointer",
									children: "Contacto"
								})
							]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { Home as default };

//# sourceMappingURL=page-CBKxNqw-.js.map