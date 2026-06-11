import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { c as useAuth, f as useNavigate, h as require_react, l as supabase, p as useParams, s as require_jsx_runtime, t as useCategories, u as Link } from "./index-cosAM6zi.js";
import { n as getSiteUrl, t as SeoHead } from "./SeoHead-SAtaEFdZ.js";
import { t as edgeFunctionUrl } from "./edgeFunctions-CBeptRpx.js";
import { n as useItemEntities, t as ROLE_CONFIG } from "./useItemEntities-kJeAlpQ0.js";
import { a as useTracker, t as Navbar } from "./Navbar-XnbO_Z_a.js";
import { n as useItemReviews } from "./useReviews-DBv0YoLg.js";
import { t as AddToTrackerModal } from "./AddToTrackerModal-YBJNjXj-.js";
import { t as useScrollReveal } from "./useScrollReveal-DdeewLgA.js";
import { i as toAppCategory, t as SCHEMA_TYPE_BY_APP_CATEGORY } from "./categories-By_tfbgx.js";
//#region src/pages/catalog/components/ItemHero.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function ItemHero({ item }) {
	const cat = useCategories().find((c) => c.id === item.category);
	const navigate = useNavigate();
	const backdropRef = (0, import_react.useRef)(null);
	const breadcrumbRef = (0, import_react.useRef)(null);
	const badgeRef = (0, import_react.useRef)(null);
	const titleRef = (0, import_react.useRef)(null);
	const metaRef = (0, import_react.useRef)(null);
	const ratingRef = (0, import_react.useRef)(null);
	const tagsRef = (0, import_react.useRef)(null);
	const coverRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const timers = [
			[backdropRef, 0],
			[coverRef, 100],
			[breadcrumbRef, 150],
			[badgeRef, 200],
			[titleRef, 280],
			[metaRef, 360],
			[ratingRef, 430],
			[tagsRef, 500]
		].map(([ref, delay]) => setTimeout(() => {
			ref.current?.classList.add("sr-visible");
		}, delay));
		return () => timers.forEach(clearTimeout);
	}, [item.id]);
	const handleBack = () => {
		if (window.history.length > 1) navigate(-1);
		else navigate(`/catalog/${item.category}`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: backdropRef,
		className: "sr-item relative w-full h-[380px] md:h-[480px] overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: item.backdrop,
				alt: item.title,
				className: "w-full h-full object-cover object-top"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 via-black/30 to-black/10" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-zinc-50/90 dark:from-zinc-950/90 via-transparent to-transparent" })
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "max-w-screen-xl mx-auto px-4 md:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col md:flex-row gap-6 -mt-24 md:-mt-36 relative z-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: coverRef,
				className: "sr-item-scale flex-shrink-0 w-36 md:w-48 lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-36 md:w-48 aspect-[2/3] rounded-2xl overflow-hidden border-4 border-white dark:border-zinc-900",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.cover,
						alt: item.title,
						className: "w-full h-full object-cover object-top"
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 pt-0 md:pt-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: breadcrumbRef,
						className: "sr-item-up flex items-center gap-2 text-xs text-zinc-500 mb-3 flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleBack,
								className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-700 transition-colors cursor-pointer whitespace-nowrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-left-line text-xs" }), "Volver"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-s-line text-zinc-300 dark:text-zinc-600" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: `/catalog/${item.category}`,
								className: "hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer transition-colors",
								children: cat?.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-s-line text-zinc-300 dark:text-zinc-600" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-zinc-700 dark:text-zinc-300 truncate max-w-[200px]",
								children: item.title
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: badgeRef,
						className: "sr-item inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3",
						style: {
							background: `${cat?.accent}20`,
							color: cat?.accent
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: cat?.icon }), cat?.label]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						ref: titleRef,
						className: "sr-item text-3xl md:text-5xl font-black text-zinc-900 dark:text-white mb-3 leading-tight",
						style: { fontFamily: "'Space Grotesk', sans-serif" },
						children: item.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: metaRef,
						className: "sr-item flex flex-wrap items-center gap-3 mb-4 text-sm text-zinc-500 dark:text-zinc-400",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.year }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.genre }),
							item.duration && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.duration })] }),
							item.seasons && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								item.seasons,
								" temporadas · ",
								item.episodes,
								" ep."
							] })] }),
							item.pages && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [item.pages, " páginas"] })] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: ratingRef,
						className: "sr-item flex items-center gap-3 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [
								[
									1,
									2,
									3,
									4,
									5
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `text-lg ${s <= Math.round(item.rating / 2) ? "ri-star-fill text-amber-400" : "ri-star-line text-zinc-300 dark:text-zinc-600"}` }, s)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xl font-black text-zinc-900 dark:text-white ml-1",
									style: { fontFamily: "'Space Grotesk', sans-serif" },
									children: item.rating
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-zinc-400",
									children: "/10"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm text-zinc-400 hidden sm:inline",
							children: [item.total_ratings.toLocaleString(), " valoraciones"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: tagsRef,
						className: "sr-item flex flex-wrap gap-2",
						children: item.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-3 py-1 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-xs font-medium",
							children: tag
						}, tag))
					})
				]
			})]
		})
	})] });
}
//#endregion
//#region src/pages/catalog/components/ItemInfo.tsx
var LABEL_TO_ENTITY_TYPE = {
	"Director": "director",
	"Reparto": "actor",
	"Autor": "author",
	"Artista": "artist",
	"Desarrollador": "developer",
	"Publisher": "publisher"
};
var LABEL_ICON = {
	"Director": "ri-movie-line",
	"Reparto": "ri-user-star-line",
	"Autor": "ri-quill-pen-line",
	"Artista": "ri-music-2-line",
	"Desarrollador": "ri-code-box-line",
	"Publisher": "ri-building-line"
};
var LABEL_COLOR = {
	"Director": "#f43f5e",
	"Reparto": "#8b5cf6",
	"Autor": "#10b981",
	"Artista": "#0ea5e9",
	"Desarrollador": "#f59e0b",
	"Publisher": "#6366f1"
};
function PersonChip({ name }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-user-line text-zinc-400 text-xs flex-shrink-0" }), name]
	});
}
var PERSON_FIELDS = new Set([
	"Director",
	"Reparto",
	"Autor",
	"Artista",
	"Desarrollador",
	"Publisher"
]);
function ItemInfo({ item }) {
	const details = [];
	if (item.developer) details.push({
		label: "Desarrollador",
		value: item.developer
	});
	if (item.publisher) details.push({
		label: "Publisher",
		value: item.publisher
	});
	if (item.platforms) details.push({
		label: "Plataformas",
		value: item.platforms
	});
	if (item.director) details.push({
		label: "Director",
		value: item.director
	});
	if (item.cast) details.push({
		label: "Reparto",
		value: item.cast.slice(0, 6)
	});
	if (item.duration) details.push({
		label: "Duración",
		value: item.duration
	});
	if (item.network) details.push({
		label: "Plataforma",
		value: item.network
	});
	if (item.seasons) details.push({
		label: "Temporadas",
		value: String(item.seasons)
	});
	if (item.episodes) details.push({
		label: "Episodios",
		value: String(item.episodes)
	});
	if (item.author) details.push({
		label: "Autor",
		value: item.author
	});
	if (item.pages) details.push({
		label: "Páginas",
		value: String(item.pages)
	});
	if (item.isbn) details.push({
		label: "ISBN",
		value: item.isbn
	});
	if (item.artist) details.push({
		label: "Artista",
		value: item.artist
	});
	if (item.venue) details.push({
		label: "Recinto",
		value: item.venue
	});
	if (item.city) details.push({
		label: "Ciudad",
		value: item.city
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-bold text-zinc-900 dark:text-white mb-3",
				children: "Descripción"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm",
				children: item.description
			})] }),
			details.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-bold text-zinc-900 dark:text-white mb-4",
				children: "Información"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-4",
				children: details.map((d) => {
					const isPerson = PERSON_FIELDS.has(d.label);
					const icon = LABEL_ICON[d.label];
					const color = LABEL_COLOR[d.label];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-4 h-4 flex items-center justify-center flex-shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
									className: `${icon} text-xs`,
									style: { color: color ?? "#71717a" }
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-zinc-400 uppercase tracking-wider",
								children: d.label
							})]
						}), Array.isArray(d.value) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5 pl-5",
							children: d.value.map((v) => isPerson ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonChip, {
								name: v,
								entityType: LABEL_TO_ENTITY_TYPE[d.label]
							}, v) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium",
								children: v
							}, v))
						}) : isPerson ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5 pl-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonChip, {
								name: d.value,
								entityType: LABEL_TO_ENTITY_TYPE[d.label]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-zinc-800 dark:text-zinc-200 font-medium pl-5",
							children: d.value
						})]
					}, d.label);
				})
			})] }),
			item.setlist && item.setlist.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-bold text-zinc-900 dark:text-white mb-4",
				children: "Setlist (extracto)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "flex flex-col gap-1",
				children: item.setlist.map((song, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3 py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-zinc-300 dark:text-zinc-600 w-5 text-right flex-shrink-0",
							children: i + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-music-2-line text-zinc-400 text-sm flex-shrink-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-zinc-800 dark:text-zinc-200",
							children: song
						})
					]
				}, song))
			})] })
		]
	});
}
//#endregion
//#region src/pages/catalog/components/ItemGallery.tsx
function ItemGallery({ gallery, title }) {
	const [active, setActive] = (0, import_react.useState)(0);
	const [lightbox, setLightbox] = (0, import_react.useState)(false);
	if (!gallery || gallery.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold text-zinc-900 dark:text-white mb-4",
			children: "Galería"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full aspect-video rounded-2xl overflow-hidden mb-3 cursor-zoom-in group",
			onClick: () => setLightbox(true),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: gallery[active].url,
					alt: gallery[active].caption,
					className: "w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-white text-sm font-medium",
						children: gallery[active].caption
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-fullscreen-line text-sm" })
				}),
				gallery.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: (e) => {
						e.stopPropagation();
						setActive((i) => (i - 1 + gallery.length) % gallery.length);
					},
					className: "absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-left-s-line" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: (e) => {
						e.stopPropagation();
						setActive((i) => (i + 1) % gallery.length);
					},
					className: "absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-s-line" })
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-medium",
					children: [
						active + 1,
						" / ",
						gallery.length
					]
				})
			]
		}),
		gallery.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-2 overflow-x-auto pb-1",
			children: gallery.map((img, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setActive(i),
				className: `flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden transition-all cursor-pointer ${i === active ? "ring-2 ring-zinc-900 dark:ring-white opacity-100" : "opacity-50 hover:opacity-80"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: img.url,
					alt: img.caption,
					className: "w-full h-full object-cover object-top"
				})
			}, img.id))
		})
	] }), lightbox && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4",
		onClick: () => setLightbox(false),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setLightbox(false),
				className: "absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-line text-xl" })
			}),
			gallery.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: (e) => {
					e.stopPropagation();
					setActive((i) => (i - 1 + gallery.length) % gallery.length);
				},
				className: "absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-left-s-line text-xl" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: (e) => {
					e.stopPropagation();
					setActive((i) => (i + 1) % gallery.length);
				},
				className: "absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-s-line text-xl" })
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-5xl w-full",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: gallery[active].url,
						alt: gallery[active].caption,
						className: "w-full rounded-2xl object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-zinc-400 text-sm text-center mt-3",
						children: gallery[active].caption
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-zinc-600 text-xs text-center mt-1",
						children: [
							title,
							" — ",
							active + 1,
							" de ",
							gallery.length
						]
					})
				]
			})
		]
	})] });
}
//#endregion
//#region src/pages/catalog/components/ItemReviews.tsx
function ItemReviews({ itemId, totalReviews, communityRating }) {
	const { isLoggedIn, profile } = useAuth();
	const { getEntry, addOrUpdate } = useTracker();
	const entry = getEntry(itemId);
	const { reviews, loading } = useItemReviews(itemId);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [reviewText, setReviewText] = (0, import_react.useState)(entry?.review ?? "");
	const [hoverRating, setHoverRating] = (0, import_react.useState)(null);
	const [formRating, setFormRating] = (0, import_react.useState)(entry?.rating ?? null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	const [sortBy, setSortBy] = (0, import_react.useState)("recent");
	const [showAll, setShowAll] = (0, import_react.useState)(false);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!reviewText.trim() || !entry) return;
		setSaving(true);
		await addOrUpdate(itemId, entry.category, entry.status, formRating, reviewText);
		setSaving(false);
		setSubmitted(true);
		setShowForm(false);
	};
	const displayRating = hoverRating ?? formRating;
	const allReviews = reviews;
	const realCount = allReviews.length;
	const publicRatings = allReviews.filter((r) => r.rating !== null);
	const displayCount = realCount > 0 ? realCount : totalReviews;
	const displayAvg = publicRatings.length > 0 ? (publicRatings.reduce((s, r) => s + (r.rating ?? 0), 0) / publicRatings.length).toFixed(1) : communityRating;
	const sorted = sortBy === "top" ? [...allReviews].sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1)) : allReviews;
	const visible = showAll ? sorted : sorted.slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-bold text-zinc-900 dark:text-white",
					children: "Reseñas de la comunidad"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-zinc-500 mt-0.5",
					children: [
						displayCount.toLocaleString(),
						" reseña",
						displayCount !== 1 ? "s" : "",
						" · Media",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-semibold text-amber-500",
							children: [displayAvg, "/10"]
						})
					]
				})] }),
				isLoggedIn && entry && !showForm && !submitted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setShowForm(true),
					className: "flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-quill-pen-line" }), entry.review ? "Editar reseña" : "Escribir reseña"]
				}),
				isLoggedIn && !entry && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-zinc-400",
					children: "Añade este ítem al tracker para escribir una reseña."
				})
			]
		}),
		showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "mb-6 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-bold text-zinc-900 dark:text-white mb-4",
					children: "Tu reseña"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2",
							children: "Puntuación"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1",
							children: Array.from({ length: 10 }, (_, i) => i + 1).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onMouseEnter: () => setHoverRating(n),
								onMouseLeave: () => setHoverRating(null),
								onClick: () => setFormRating(n),
								className: "flex-1 flex items-center justify-center py-1.5 rounded-lg transition-colors cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950/30",
								children: displayRating !== null && n <= displayRating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-line text-zinc-300 dark:text-zinc-600" })
							}, n))
						}),
						displayRating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-center text-xs font-semibold text-amber-500 mt-1",
							children: [displayRating, "/10"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: reviewText,
					onChange: (e) => setReviewText(e.target.value.slice(0, 500)),
					placeholder: "Comparte tu opinión con la comunidad...",
					rows: 4,
					className: "w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400/30 resize-none mb-2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-zinc-400",
						children: [reviewText.length, "/500"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowForm(false),
							className: "px-4 py-2 rounded-lg text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer whitespace-nowrap",
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: !reviewText.trim() || saving,
							className: "px-4 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold disabled:opacity-40 cursor-pointer whitespace-nowrap flex items-center gap-2",
							children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-loader-4-line animate-spin" }), "Publicar"]
						})]
					})]
				})
			]
		}),
		submitted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-checkbox-circle-fill text-emerald-500 text-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-emerald-700 dark:text-emerald-400",
				children: "Reseña guardada"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-emerald-600/70 dark:text-emerald-500/70",
				children: "Tu opinión ya está guardada en tu tracker."
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 mb-5 w-fit",
			children: ["recent", "top"].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setSortBy(s),
				className: `px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${sortBy === s ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`,
				children: s === "recent" ? "Más recientes" : "Mejor valoradas"
			}, s))
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-4",
			children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3.5 w-24 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-16 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" })]
			}, i))
		}) : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center py-10 gap-2 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-quill-pen-line text-2xl text-zinc-300 dark:text-zinc-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-zinc-400",
				children: "Sé el primero en escribir una reseña."
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-4",
			children: visible.map((review) => {
				const colors = [
					"#8b5cf6",
					"#f43f5e",
					"#f59e0b",
					"#10b981",
					"#0ea5e9",
					"#ec4899"
				];
				const accent = colors[review.user_id.charCodeAt(0) % colors.length];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-4 mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0",
									style: { background: accent },
									children: review.initials ?? "??"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold text-zinc-900 dark:text-white",
									children: review.display_name ?? "Usuario"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-zinc-400",
									children: new Date(review.updated_at).toLocaleDateString("es-ES", {
										day: "numeric",
										month: "short",
										year: "numeric"
									})
								})] })]
							}), review.rating !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 flex-shrink-0 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-lg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-xs" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-bold text-amber-600 dark:text-amber-400",
										children: review.rating
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-400",
										children: "/10"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed",
							children: review.review
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-thumb-up-line" }), "Útil"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-flag-line" }), "Reportar"]
							})]
						})
					]
				}, review.id);
			})
		}),
		!showAll && sorted.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setShowAll(true),
			className: "w-full mt-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer",
			children: [
				"Ver todas las reseñas (",
				sorted.length,
				")"
			]
		})
	] });
}
//#endregion
//#region src/pages/catalog/components/ItemCommunityStats.tsx
function getRatingDistribution(avg) {
	const dist = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
	const peak = Math.round(avg) - 1;
	for (let i = 0; i < 10; i++) {
		const distance = Math.abs(i - peak);
		dist[i] = Math.max(2, Math.round(40 * Math.exp(-.5 * distance * distance)));
	}
	return dist;
}
function ItemCommunityStats({ communityRating, totalRatings, totalReviews }) {
	const dist = getRatingDistribution(communityRating);
	const maxVal = Math.max(...dist);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-bold text-zinc-900 dark:text-white mb-4",
				children: "Estadísticas de la comunidad"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-6 items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center flex-shrink-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-5xl font-black text-zinc-900 dark:text-white leading-none",
							style: { fontFamily: "'Space Grotesk', sans-serif" },
							children: communityRating
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-0.5 mt-2",
							children: [
								1,
								2,
								3,
								4,
								5
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `text-sm ${s <= Math.round(communityRating / 2) ? "ri-star-fill text-amber-400" : "ri-star-line text-zinc-300 dark:text-zinc-600"}` }, s))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-zinc-400 mt-1.5 text-center",
							children: [(totalRatings / 1e3).toFixed(1), "k valoraciones"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 flex flex-col gap-1.5",
					children: dist.map((val, i) => {
						const score = 10 - i;
						const pct = Math.round(val / maxVal * 100);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-zinc-500 w-3 text-right flex-shrink-0",
									children: score
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full bg-amber-400 transition-all",
										style: { width: `${pct}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-zinc-400 w-6 text-right flex-shrink-0",
									children: [pct, "%"]
								})
							]
						}, score);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-700",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-lg font-bold text-zinc-900 dark:text-white",
							style: { fontFamily: "'Space Grotesk', sans-serif" },
							children: [(totalRatings / 1e3).toFixed(0), "k"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-zinc-500",
							children: "Valoraciones"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-lg font-bold text-zinc-900 dark:text-white",
							style: { fontFamily: "'Space Grotesk', sans-serif" },
							children: [(totalReviews / 1e3).toFixed(1), "k"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-zinc-500",
							children: "Reseñas"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-lg font-bold text-zinc-900 dark:text-white",
							style: { fontFamily: "'Space Grotesk', sans-serif" },
							children: [Math.round(totalReviews / totalRatings * 100), "%"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-zinc-500",
							children: "Reseñaron"
						})]
					})
				]
			})
		]
	});
}
//#endregion
//#region src/hooks/useItemReportCount.ts
var EDGE_URL$1 = edgeFunctionUrl("item-reports");
function useItemReportCount(itemId) {
	const [pending, setPending] = (0, import_react.useState)(0);
	const [total, setTotal] = (0, import_react.useState)(0);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!itemId) return;
		let cancelled = false;
		const fetchCount = async () => {
			try {
				const { data: sessionData } = await supabase.auth.getSession();
				const token = sessionData.session?.access_token;
				const res = await fetch(`${EDGE_URL$1}?item_id=${encodeURIComponent(itemId)}`, { headers: token ? { Authorization: `Bearer ${token}` } : void 0 });
				if (!res.ok) return;
				const reports = (await res.json()).reports ?? [];
				if (!cancelled) {
					setTotal(reports.length);
					setPending(reports.filter((r) => r.status === "pending").length);
				}
			} catch {} finally {
				if (!cancelled) setLoading(false);
			}
		};
		fetchCount();
		return () => {
			cancelled = true;
		};
	}, [itemId]);
	return {
		pending,
		total,
		loading
	};
}
//#endregion
//#region src/hooks/useItemReportHistory.ts
var EDGE_URL = edgeFunctionUrl("item-reports");
function useItemReportHistory(itemId) {
	const [reports, setReports] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!itemId) {
			setLoading(false);
			return;
		}
		let cancelled = false;
		const fetchHistory = async () => {
			setLoading(true);
			setError(false);
			try {
				const { data: sessionData } = await supabase.auth.getSession();
				const token = sessionData.session?.access_token;
				const res = await fetch(`${EDGE_URL}?item_id=${encodeURIComponent(itemId)}`, { headers: token ? { Authorization: `Bearer ${token}` } : void 0 });
				if (!res.ok) throw new Error("fetch failed");
				const all = ((await res.json()).reports ?? []).filter((r) => r.status === "resolved" || r.status === "dismissed");
				if (!cancelled) setReports(all);
			} catch {
				if (!cancelled) setError(true);
			} finally {
				if (!cancelled) setLoading(false);
			}
		};
		fetchHistory();
		return () => {
			cancelled = true;
		};
	}, [itemId]);
	return {
		reports,
		loading,
		error
	};
}
//#endregion
//#region src/pages/catalog/components/ItemReportHistory.tsx
function formatDate(iso) {
	if (!iso) return "—";
	return new Date(iso).toLocaleDateString("es-ES", {
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
}
function ReportHistoryRow({ report }) {
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const isResolved = report.status === "resolved";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setExpanded((v) => !v),
			className: "w-full flex items-start gap-2.5 text-left cursor-pointer group",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `mt-0.5 w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full ${isResolved ? "bg-emerald-100 dark:bg-emerald-950/40" : "bg-zinc-100 dark:bg-zinc-800"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `text-xs ${isResolved ? "ri-checkbox-circle-line text-emerald-500" : "ri-close-circle-line text-zinc-400"}` })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300 leading-snug truncate",
						children: report.reason
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-zinc-400 mt-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `font-medium ${isResolved ? "text-emerald-500" : "text-zinc-400"}`,
								children: isResolved ? "Resuelto" : "Descartado"
							}),
							" · ",
							formatDate(report.resolved_at ?? report.reported_at)
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `ri-arrow-down-s-line text-zinc-300 dark:text-zinc-600 flex-shrink-0 mt-0.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}` })
			]
		}), expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ml-7 flex flex-col gap-1.5 pb-1",
			children: [
				report.details && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-zinc-600 dark:text-zinc-300",
							children: "Descripción: "
						}), report.details]
					})
				}),
				report.resolved_note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `px-3 py-2 rounded-lg border ${isResolved ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30" : "bg-zinc-50 dark:bg-zinc-800/60 border-zinc-100 dark:border-zinc-700/50"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs leading-relaxed",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `font-semibold ${isResolved ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-500 dark:text-zinc-400"}`,
							children: ["Nota del admin:", " "]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-zinc-500 dark:text-zinc-400",
							children: report.resolved_note
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-zinc-400",
					children: ["Reportado el ", formatDate(report.reported_at)]
				})
			]
		})]
	});
}
function ItemReportHistory({ itemId }) {
	const { reports, loading, error } = useItemReportHistory(itemId);
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pt-3 border-t border-zinc-100 dark:border-zinc-800",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 mb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-4 h-4 flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-history-line text-zinc-400 text-xs" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold text-zinc-400 uppercase tracking-wider",
				children: "Historial de correcciones"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-2",
			children: [1, 2].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse" }, i))
		})]
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pt-3 border-t border-zinc-100 dark:border-zinc-800",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-xs text-zinc-400 flex items-center gap-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-rose-400" }), "No se pudo cargar el historial"]
		})
	});
	if (reports.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pt-3 border-t border-zinc-100 dark:border-zinc-800",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 mb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-4 h-4 flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-history-line text-zinc-400 text-xs" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold text-zinc-400 uppercase tracking-wider",
				children: "Historial de correcciones"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-zinc-400 italic",
			children: "Sin correcciones registradas aún."
		})]
	});
	const resolved = reports.filter((r) => r.status === "resolved").length;
	const dismissed = reports.filter((r) => r.status === "dismissed").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pt-3 border-t border-zinc-100 dark:border-zinc-800",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setCollapsed((v) => !v),
			className: "w-full flex items-center gap-2 mb-3 cursor-pointer group",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-4 h-4 flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-history-line text-zinc-400 text-xs" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex-1 text-left",
					children: "Historial de correcciones"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [
						resolved > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold",
							children: [
								resolved,
								" resuelto",
								resolved > 1 ? "s" : ""
							]
						}),
						dismissed > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-semibold",
							children: [
								dismissed,
								" descartado",
								dismissed > 1 ? "s" : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `ri-arrow-down-s-line text-zinc-300 dark:text-zinc-600 text-sm transition-transform duration-200 ${collapsed ? "rotate-180" : ""}` })
					]
				})
			]
		}), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-3",
			children: reports.map((report) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportHistoryRow, { report }, report.id))
		})]
	});
}
//#endregion
//#region src/pages/catalog/components/ItemTrackerSidebar.tsx
var ITEM_REPORTS_URL = edgeFunctionUrl("item-reports");
var REPORT_REASONS = [
	"Información incorrecta",
	"Imagen equivocada",
	"Título o año erróneo",
	"Contenido duplicado",
	"Descripción inapropiada",
	"Otro"
];
function ReportModal({ itemTitle, itemId, itemCategory, itemCover, onClose }) {
	const { session } = useAuth();
	const [reason, setReason] = (0, import_react.useState)("");
	const [details, setDetails] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("idle");
	const overlayRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const handleKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleKey);
		return () => document.removeEventListener("keydown", handleKey);
	}, [onClose]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!reason) return;
		setStatus("sending");
		try {
			setStatus((await fetch(ITEM_REPORTS_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
				},
				body: JSON.stringify({
					item_id: itemId,
					item_title: itemTitle,
					item_category: itemCategory,
					item_cover: itemCover,
					reason,
					details: details || null
				})
			})).ok ? "sent" : "error");
		} catch {
			setStatus("error");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: overlayRef,
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4",
		onClick: (e) => {
			if (e.target === overlayRef.current) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 w-full max-w-md shadow-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-flag-2-line text-rose-500 text-sm" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-bold text-zinc-900 dark:text-white",
						children: "Reportar problema"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-zinc-400 truncate max-w-[220px]",
						children: itemTitle
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-line text-zinc-500 text-sm" })
				})]
			}), status === "sent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-6 py-10 flex flex-col items-center gap-3 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-12 h-12 flex items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-checkbox-circle-line text-emerald-500 text-2xl" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-zinc-900 dark:text-white",
						children: "¡Reporte enviado!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-zinc-400",
						children: "Gracias por ayudarnos a mejorar el catálogo. Lo revisaremos pronto."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "mt-2 px-5 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium cursor-pointer whitespace-nowrap",
						children: "Cerrar"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "px-6 py-5 flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider",
							children: "Motivo del reporte"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-1.5",
							children: REPORT_REASONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setReason(r),
								className: `px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer whitespace-nowrap ${reason === r ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"}`,
								children: r
							}, r))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider",
								children: ["Detalles adicionales ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-normal normal-case",
									children: "(opcional)"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								name: "details",
								value: details,
								onChange: (e) => {
									if (e.target.value.length <= 500) setDetails(e.target.value);
								},
								placeholder: "Describe el problema con más detalle...",
								rows: 3,
								className: "w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-zinc-400 text-right",
								children: [details.length, "/500"]
							})
						]
					}),
					status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-rose-500 flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line" }), "Error al enviar. Inténtalo de nuevo."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap",
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: !reason || status === "sending",
							className: "flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2",
							children: status === "sending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-loader-4-line animate-spin" }), " Enviando..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-flag-2-line" }), " Enviar reporte"] })
						})]
					})
				]
			})]
		})
	});
}
var STATUS_OPTIONS = [
	{
		value: "pending",
		label: "Pendiente",
		icon: "ri-bookmark-line",
		color: "text-zinc-600 dark:text-zinc-400",
		bg: "bg-zinc-100 dark:bg-zinc-800"
	},
	{
		value: "in_progress",
		label: "En progreso",
		icon: "ri-loader-4-line",
		color: "text-amber-600 dark:text-amber-400",
		bg: "bg-amber-50 dark:bg-amber-950/30"
	},
	{
		value: "completed",
		label: "Completado",
		icon: "ri-checkbox-circle-line",
		color: "text-emerald-600 dark:text-emerald-400",
		bg: "bg-emerald-50 dark:bg-emerald-950/30"
	},
	{
		value: "dropped",
		label: "Abandonado",
		icon: "ri-close-circle-line",
		color: "text-rose-600 dark:text-rose-400",
		bg: "bg-rose-50 dark:bg-rose-950/30"
	}
];
function ItemTrackerSidebar({ item }) {
	const { isLoggedIn, profile } = useAuth();
	const isAdmin = profile?.role === "admin";
	const { getEntry, addOrUpdate, remove } = useTracker();
	const { pending: reportsPending, total: reportsTotal, loading: reportsLoading } = useItemReportCount(isAdmin ? item.id : "");
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	const [reportOpen, setReportOpen] = (0, import_react.useState)(false);
	const [toast, setToast] = (0, import_react.useState)(null);
	const entry = getEntry(item.id);
	const statusOpt = STATUS_OPTIONS.find((s) => s.value === entry?.status);
	const showToast = (msg) => {
		setToast(msg);
		setTimeout(() => setToast(null), 2500);
	};
	const handleSave = (status, rating, review) => {
		addOrUpdate(item.id, item.category, status, rating, review);
		showToast(entry ? "Tracker actualizado" : "¡Añadido al tracker!");
	};
	const handleRemove = () => {
		remove(item.id);
		showToast("Eliminado del tracker");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full aspect-[2/3] overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: item.cover,
					alt: item.title,
					className: "w-full h-full object-cover object-top"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5 flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xl font-black text-zinc-900 dark:text-white",
									style: { fontFamily: "'Space Grotesk', sans-serif" },
									children: item.rating
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-zinc-400",
									children: "/10"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-zinc-400",
							children: [(item.total_ratings / 1e3).toFixed(1), "k votos"]
						})]
					}),
					isLoggedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-2",
						children: entry ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${statusOpt?.bg} ${statusOpt?.color}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: statusOpt?.icon }),
								statusOpt?.label,
								entry.rating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-auto flex items-center gap-1 text-amber-500",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-xs" }), entry.rating]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setModalOpen(true),
							className: "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-edit-line" }), "Editar entrada"]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setModalOpen(true),
							className: "w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-add-line" }), "Añadir al tracker"]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/auth",
						className: "w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-login-box-line" }), "Inicia sesión para trackear"]
					}),
					isLoggedIn && !entry && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-1.5",
						children: STATUS_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								addOrUpdate(item.id, item.category, opt.value, null, "");
								showToast("¡Añadido al tracker!");
							},
							className: `flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${opt.bg} ${opt.color} hover:opacity-80`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: opt.icon }), opt.label]
						}, opt.value))
					}),
					entry?.review && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-3 border-t border-zinc-100 dark:border-zinc-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2",
							children: "Tu reseña"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3 italic",
							children: [
								"“",
								entry.review,
								"”"
							]
						})]
					}),
					isAdmin && !reportsLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-3 border-t border-zinc-100 dark:border-zinc-800",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/reports",
							className: `w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors cursor-pointer group ${reportsPending > 0 ? "bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50" : "bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 ${reportsPending > 0 ? "bg-rose-100 dark:bg-rose-900/40" : "bg-zinc-100 dark:bg-zinc-700"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `ri-shield-check-line text-sm ${reportsPending > 0 ? "text-rose-500" : "text-zinc-400"}` })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: `text-xs font-semibold ${reportsPending > 0 ? "text-rose-600 dark:text-rose-400" : "text-zinc-500 dark:text-zinc-400"}`,
											children: reportsPending > 0 ? `${reportsPending} reporte${reportsPending > 1 ? "s" : ""} pendiente${reportsPending > 1 ? "s" : ""}` : "Sin reportes pendientes"
										}),
										reportsTotal > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-zinc-400",
											children: [reportsTotal, " en total · Ver en admin"]
										}),
										reportsTotal === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-zinc-400",
											children: "Panel de admin"
										})
									]
								}),
								reportsPending > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-rose-500 text-white text-xs font-bold",
									children: reportsPending > 9 ? "9+" : reportsPending
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-s-line text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 transition-colors flex-shrink-0" })
							]
						})
					}),
					isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemReportHistory, { itemId: item.id }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: isAdmin ? "" : "pt-3 border-t border-zinc-100 dark:border-zinc-800",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setReportOpen(true),
							className: "w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-flag-2-line" }), "Reportar un problema con este ítem"]
						})
					})
				]
			})]
		}),
		modalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddToTrackerModal, {
			itemId: item.id,
			category: item.category,
			title: item.title,
			cover: item.cover,
			existing: entry,
			onSave: handleSave,
			onRemove: handleRemove,
			onClose: () => setModalOpen(false)
		}),
		reportOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportModal, {
			itemTitle: item.title,
			itemId: item.id,
			itemCategory: item.category,
			itemCover: item.cover,
			onClose: () => setReportOpen(false)
		}),
		toast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-checkbox-circle-line text-emerald-400 dark:text-emerald-600" }), toast]
		})
	] });
}
//#endregion
//#region src/pages/catalog/components/RelatedItems.tsx
function getGenre(item) {
	const genres = item.metadata?.genres;
	if (Array.isArray(genres)) return String(genres[0] ?? "");
	return String(item.metadata?.genre ?? "");
}
function RelatedItems({ category, currentId }) {
	const CATEGORIES = useCategories();
	const [items, setItems] = (0, import_react.useState)([]);
	const cat = CATEGORIES.find((c) => c.id === category);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const load = async () => {
			const { data } = await supabase.from("catalog_items").select("id, slug, title, image_url, release_date, metadata").eq("category", category).neq("slug", currentId).order("updated_at", { ascending: false }).limit(5);
			if (!cancelled) setItems(data ?? []);
		};
		load();
		return () => {
			cancelled = true;
		};
	}, [category, currentId]);
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-6 h-6 flex items-center justify-center rounded-lg flex-shrink-0",
				style: { background: `${cat?.accent}20` },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
					className: `${cat?.icon} text-xs`,
					style: { color: cat?.accent }
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "text-sm font-bold text-zinc-900 dark:text-white",
				children: ["Mas en ", cat?.label]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-3",
			children: items.map((item) => {
				const rating = item.metadata?.rating != null ? Number(item.metadata.rating).toFixed(1) : null;
				const year = item.release_date?.slice(0, 4) ?? "";
				const genre = getGenre(item);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: `/catalog/${category}/${item.slug}`,
					className: "group flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-800",
						children: item.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: item.image_url,
							alt: item.title,
							className: "w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full h-full flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${cat?.icon ?? "ri-image-line"} text-zinc-400` })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xs font-semibold text-zinc-900 dark:text-white leading-tight line-clamp-2 mb-1 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors",
								children: item.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-zinc-500",
								children: [
									year,
									year && genre ? " · " : "",
									genre
								]
							}),
							rating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 mt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-xs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300",
									children: rating
								})]
							})
						]
					})]
				}, item.id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: `/catalog`,
			className: "flex items-center justify-center gap-1.5 mt-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer",
			children: [
				"Ver mas en ",
				cat?.label,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-line" })
			]
		})
	] });
}
//#endregion
//#region src/pages/catalog/components/RelatedPeople.tsx
function EntityCard({ entity }) {
	const roleConf = ROLE_CONFIG[entity.role] ?? {
		label: entity.role,
		icon: "ri-user-line",
		color: "#71717a",
		priority: 99
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group flex items-center gap-3 p-3 rounded-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-12 h-12 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-700",
					style: { background: entity.image ? void 0 : `${roleConf.color}18` },
					children: entity.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: entity.image,
						alt: entity.name,
						className: "w-full h-full object-cover object-top"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full h-full flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
							className: `${roleConf.icon} text-lg`,
							style: { color: roleConf.color }
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-zinc-900",
					style: { background: roleConf.color },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
						className: `${roleConf.icon} text-white`,
						style: { fontSize: 7 }
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold text-zinc-900 dark:text-white leading-tight line-clamp-1",
					children: entity.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium mt-0.5",
					style: { color: roleConf.color },
					children: roleConf.label
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-5 h-5 flex-shrink-0" })
		]
	});
}
function EntitiesSkeleton({ count = 5 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-1",
		children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 p-3 animate-pulse",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex flex-col gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-28" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded w-16" })]
			})]
		}, i))
	});
}
function RoleGroupHeader({ label, icon, color, count }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between mb-1 px-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-5 h-5 flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
					className: `${icon} text-sm`,
					style: { color }
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400",
				children: label
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-semibold px-1.5 py-0.5 rounded-md",
			style: {
				background: `${color}18`,
				color
			},
			children: count
		})]
	});
}
function RelatedPeople({ item, itemId }) {
	const { entities, loading } = useItemEntities(itemId ?? null);
	if (!itemId) return null;
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-between mb-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-bold text-zinc-900 dark:text-white",
				children: "Personas y estudios"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntitiesSkeleton, { count: 5 })]
	});
	if (entities.length === 0) return null;
	const grouped = entities.reduce((acc, e) => {
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
	const sortedRoles = Object.keys(grouped).sort((a, b) => {
		const ia = roleOrder.indexOf(a);
		const ib = roleOrder.indexOf(b);
		return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-bold text-zinc-900 dark:text-white",
				children: "Personas y estudios"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full font-medium",
				children: entities.length
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-6",
			children: sortedRoles.map((role) => {
				const conf = ROLE_CONFIG[role] ?? {
					label: role,
					icon: "ri-user-line",
					color: "#71717a",
					priority: 99
				};
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGroupHeader, {
					label: conf.label,
					icon: conf.icon,
					color: conf.color,
					count: grouped[role].length
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col",
					children: grouped[role].map((entity) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntityCard, { entity }, entity.id))
				})] }, role);
			})
		})]
	});
}
//#endregion
//#region src/hooks/useCatalogItem.ts
var EDGE_FN_URL = edgeFunctionUrl("catalog-item");
var memCache = /* @__PURE__ */ new Map();
function useCatalogItem(slug) {
	const [item, setItem] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [source, setSource] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!slug) return;
		if (memCache.has(slug)) {
			const cached = memCache.get(slug);
			setItem(cached.item);
			setSource(cached.source);
			setLoading(false);
			setError(null);
			return;
		}
		let cancelled = false;
		setLoading(true);
		setError(null);
		(async () => {
			try {
				const params = new URLSearchParams({ slug });
				const res = await fetch(`${EDGE_FN_URL}?${params}`);
				if (!res.ok) {
					const body = await res.json().catch(() => ({}));
					throw new Error(body.error ?? `HTTP ${res.status}`);
				}
				const json = await res.json();
				if (!cancelled) {
					memCache.set(slug, {
						item: json.data,
						source: json.source
					});
					setItem(json.data);
					setSource(json.source);
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
		item,
		loading,
		error,
		source
	};
}
function getItemYear(item) {
	return item.release_date?.slice(0, 4) ?? "";
}
function getItemRating(item) {
	const r = item.metadata?.rating;
	return r != null ? Number(r) : null;
}
function getItemGenres(item) {
	const g = item.metadata?.genres;
	if (Array.isArray(g)) return g;
	const single = item.metadata?.genre;
	if (single) return [String(single)];
	return [];
}
function getItemBackdrop(item) {
	return item.metadata?.backdrop_url ?? item.image_url ?? null;
}
function getItemScreenshots(item) {
	const shots = item.metadata?.screenshots ?? item.metadata?.backdrops;
	if (Array.isArray(shots)) return shots;
	return [];
}
//#endregion
//#region src/pages/catalog/detail/page.tsx
function toItemDetail(item, categoryId) {
	const meta = item.metadata ?? {};
	const year = parseInt(getItemYear(item) || "0", 10);
	const rating = getItemRating(item) ?? 0;
	const genres = getItemGenres(item);
	const backdrop = getItemBackdrop(item);
	const gallery = getItemScreenshots(item).slice(0, 4).map((url, i) => ({
		id: `${item.slug}-shot-${i}`,
		url,
		caption: `${item.title} — imagen ${i + 1}`
	}));
	const base = {
		id: item.slug,
		category: categoryId,
		title: item.title,
		cover: item.image_url ?? "",
		backdrop: backdrop ?? item.image_url ?? "",
		rating: Math.round(rating * 10) / 10,
		year,
		genre: genres[0] ?? "",
		description: item.description ?? "Sin descripción disponible.",
		tags: genres.slice(0, 6),
		community_rating: Math.round(rating * 10) / 10,
		total_ratings: Number(meta.ratings_count ?? meta.vote_count ?? 0),
		total_reviews: 0,
		gallery: gallery.length > 0 ? gallery : void 0
	};
	if (categoryId === "videojuegos") {
		const devs = meta.developers;
		const pubs = meta.publishers;
		const plats = meta.platforms;
		base.developer = devs?.[0] ?? void 0;
		base.publisher = pubs?.[0] ?? void 0;
		base.platforms = plats ?? void 0;
		base.tags = meta.tags?.slice(0, 6) ?? genres.slice(0, 6);
	}
	if (categoryId === "peliculas") {
		base.director = meta.director ?? void 0;
		base.cast = meta.cast ?? void 0;
		const runtime = meta.runtime;
		if (runtime) base.duration = `${Math.floor(runtime / 60)}h ${runtime % 60}min`;
	}
	if (categoryId === "series") {
		base.cast = meta.cast ?? void 0;
		base.seasons = meta.seasons ?? void 0;
		base.episodes = meta.episodes ?? void 0;
		base.network = meta.networks?.[0] ?? void 0;
	}
	if (categoryId === "libros") {
		base.author = meta.authors?.[0] ?? void 0;
		base.pages = meta.page_count ?? void 0;
		base.isbn = meta.isbn ?? void 0;
	}
	if (categoryId === "conciertos") {
		base.artist = meta.artists?.[0] ?? void 0;
		base.venue = meta.venue ?? void 0;
		base.city = meta.city ?? void 0;
	}
	return base;
}
function buildJsonLd(item, categoryId) {
	const appCategory = toAppCategory(categoryId);
	const schemaType = appCategory ? SCHEMA_TYPE_BY_APP_CATEGORY[appCategory] : "CreativeWork";
	const siteUrl = getSiteUrl();
	return {
		"@context": "https://schema.org",
		"@type": schemaType,
		name: item.title,
		description: item.description,
		image: item.cover,
		url: `${siteUrl}/catalog/${categoryId}/${item.id}`,
		datePublished: String(item.year),
		genre: item.genre,
		...item.total_ratings > 0 ? { aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: item.community_rating,
			bestRating: 10,
			worstRating: 1,
			ratingCount: item.total_ratings,
			reviewCount: item.total_reviews
		} } : {}
	};
}
function DetailSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-zinc-50 dark:bg-zinc-950 animate-pulse",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full h-[380px] md:h-[480px] bg-zinc-200 dark:bg-zinc-800" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-screen-xl mx-auto px-4 md:px-6 py-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col lg:flex-row gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 flex flex-col gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-2/3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-4/6" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full lg:w-72 flex-shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-[2/3] bg-zinc-200 dark:bg-zinc-800 rounded-2xl" })
				})]
			})
		})]
	});
}
function SourceBadge({ source }) {
	const config = {
		cache: {
			label: "Desde caché",
			icon: "ri-database-2-line",
			cls: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
		},
		external_cached: {
			label: "Guardado en caché",
			icon: "ri-save-line",
			cls: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400"
		},
		external: {
			label: "API externa",
			icon: "ri-global-line",
			cls: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
		},
		mock: {
			label: "Datos de ejemplo",
			icon: "ri-test-tube-line",
			cls: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
		}
	}[source] ?? {
		label: source,
		icon: "ri-information-line",
		cls: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.cls}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: config.icon }), config.label]
	});
}
function ItemDetailPage() {
	const { category = "", id = "" } = useParams();
	const sourceBadgeRef = useScrollReveal({ rootMargin: "0px" });
	const infoRef = useScrollReveal();
	const peopleRef = useScrollReveal({ rootMargin: "0px 0px -30px 0px" });
	const galleryRef = useScrollReveal();
	const statsRef = useScrollReveal();
	const reviewsRef = useScrollReveal();
	const sidebarRef = useScrollReveal({ rootMargin: "0px" });
	const { item: realItem, loading, error, source } = useCatalogItem(id);
	const resolvedCategoryId = realItem ? toAppCategory(realItem.category) ?? category : toAppCategory(category) ?? category;
	const fullItem = realItem ? toItemDetail(realItem, resolvedCategoryId) : null;
	const dataSource = realItem ? source ?? "external" : null;
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pt-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailSkeleton, {})
	})] });
	if (!fullItem && !loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-white dark:bg-zinc-950 flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col items-center justify-center gap-4 text-zinc-400 pt-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-16 h-16 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-file-unknow-line text-3xl" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg font-semibold text-zinc-700 dark:text-zinc-300",
					children: "Ítem no encontrado"
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-rose-500 max-w-xs text-center",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => window.history.length > 1 ? window.history.back() : void 0,
					className: "text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline cursor-pointer",
					children: "Volver al catalogo"
				})
			]
		})]
	});
	if (!fullItem) return null;
	const jsonLd = buildJsonLd(fullItem, resolvedCategoryId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-zinc-50 dark:bg-zinc-950",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoHead, {
				title: `${fullItem.title} (${fullItem.year}) — ${fullItem.genre} | Vaultly`,
				description: (fullItem.description ?? "").length > 155 ? `${fullItem.description.slice(0, 152)}...` : fullItem.description,
				keywords: `${fullItem.title}, ${fullItem.genre}, ${fullItem.year}, Vaultly`,
				canonical: `/catalog/${resolvedCategoryId}/${id}`,
				ogType: "article",
				ogImage: fullItem.cover,
				jsonLd
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemHero, { item: fullItem }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-screen-xl mx-auto px-4 md:px-6 py-10",
					children: [dataSource && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: sourceBadgeRef,
						className: "sr-item flex items-center gap-3 mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceBadge, { source: dataSource }), loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-zinc-400 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-loader-4-line animate-spin" }), "Actualizando datos..."]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col lg:flex-row gap-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0 flex flex-col gap-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									ref: infoRef,
									className: "sr-item bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemInfo, { item: fullItem })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									ref: peopleRef,
									className: "sr-item",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelatedPeople, {
										item: fullItem,
										itemId: realItem?.id ?? null
									})
								}),
								fullItem.gallery && fullItem.gallery.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									ref: galleryRef,
									className: "sr-item bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemGallery, {
										gallery: fullItem.gallery,
										title: fullItem.title
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									ref: statsRef,
									className: "sr-item",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCommunityStats, {
										communityRating: fullItem.community_rating,
										totalRatings: fullItem.total_ratings,
										totalReviews: fullItem.total_reviews
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									ref: reviewsRef,
									className: "sr-item bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemReviews, {
										itemId: fullItem.id,
										totalReviews: fullItem.total_reviews,
										communityRating: fullItem.community_rating
									})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: sidebarRef,
							className: "sr-item-right w-full lg:w-72 flex-shrink-0 flex flex-col gap-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sticky top-24",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemTrackerSidebar, { item: fullItem }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelatedItems, {
										category: resolvedCategoryId,
										currentId: id
									})
								})]
							})
						})]
					})]
				})]
			})
		]
	});
}
//#endregion
export { ItemDetailPage as default };

//# sourceMappingURL=page-BngnXQQK.js.map