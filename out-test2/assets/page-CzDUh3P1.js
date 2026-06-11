import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { h as require_react, p as useParams, s as require_jsx_runtime, u as Link } from "./index-cosAM6zi.js";
import { n as getSiteUrl, t as SeoHead } from "./SeoHead-SAtaEFdZ.js";
import { t as Navbar } from "./Navbar-XnbO_Z_a.js";
import { t as useScrollReveal } from "./useScrollReveal-DdeewLgA.js";
import { t as PEOPLE_MOCK } from "./people-vbkXE967.js";
//#region src/pages/person/components/PersonHero.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function PersonHero({ person }) {
	const avgRating = person.works.length > 0 ? (person.works.reduce((s, w) => s + w.rating, 0) / person.works.length).toFixed(1) : "—";
	const backdropRef = (0, import_react.useRef)(null);
	const breadcrumbRef = (0, import_react.useRef)(null);
	const photoRef = (0, import_react.useRef)(null);
	const badgeRef = (0, import_react.useRef)(null);
	const titleRef = (0, import_react.useRef)(null);
	const metaRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const timers = [
			[backdropRef, 0],
			[photoRef, 100],
			[breadcrumbRef, 120],
			[badgeRef, 200],
			[titleRef, 290],
			[metaRef, 380]
		].map(([ref, delay]) => setTimeout(() => ref.current?.classList.add("sr-visible"), delay));
		return () => timers.forEach(clearTimeout);
	}, [person.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-full overflow-hidden",
		style: { minHeight: 340 },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: backdropRef,
			className: "sr-item absolute inset-0 w-full h-full",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: person.backdrop,
				alt: person.name,
				className: "w-full h-full object-cover object-top"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/30" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 max-w-screen-xl mx-auto px-4 md:px-6 pt-10 pb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				ref: breadcrumbRef,
				className: "sr-item-up flex items-center gap-2 text-xs text-zinc-400 mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "hover:text-white transition-colors cursor-pointer",
						children: "Inicio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-s-line" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/catalog",
						className: "hover:text-white transition-colors cursor-pointer",
						children: "Catálogo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-s-line" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-zinc-300",
						children: person.name
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row gap-6 items-start sm:items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: photoRef,
					className: "sr-item-scale w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-white/10 flex-shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: person.photo,
						alt: person.name,
						className: "w-full h-full object-cover object-top"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							ref: badgeRef,
							className: "sr-item inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-medium mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-user-star-line" }), person.role]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							ref: titleRef,
							className: "sr-item text-3xl md:text-4xl font-black text-white mb-2 leading-tight",
							style: { fontFamily: "'Space Grotesk', sans-serif" },
							children: person.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							ref: metaRef,
							className: "sr-item flex flex-wrap items-center gap-3 text-sm text-zinc-400",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-map-pin-line text-xs" }), person.nationality]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1 h-1 rounded-full bg-zinc-600" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-calendar-line text-xs" }),
										"Nacido en ",
										person.birthYear
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1 h-1 rounded-full bg-zinc-600" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-film-line text-xs" }),
										person.works.length,
										" obras"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1 h-1 rounded-full bg-zinc-600" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-xs" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white font-semibold",
											children: avgRating
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "media" })
									]
								})
							]
						})
					]
				})]
			})]
		})]
	});
}
//#endregion
//#region src/pages/person/components/PersonBio.tsx
function PersonBio({ person }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-bold text-zinc-900 dark:text-white mb-4",
				style: { fontFamily: "'Space Grotesk', sans-serif" },
				children: "Biografía"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm mb-6",
				children: person.bio
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3",
				children: "Conocido/a por"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: person.known_for.map((title) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium",
					children: title
				}, title))
			})] })
		]
	});
}
//#endregion
//#region src/pages/person/components/PersonWorks.tsx
var CATEGORY_LABELS = {
	games: "Videojuego",
	movies: "Película",
	series: "Serie",
	books: "Libro",
	concerts: "Concierto",
	anime: "Anime"
};
var CATEGORY_COLORS = {
	games: "bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400",
	movies: "bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400",
	series: "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400",
	books: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400",
	concerts: "bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400",
	anime: "bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-400"
};
function PersonWorks({ person }) {
	const sorted = [...person.works].sort((a, b) => b.year - a.year);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: "text-lg font-bold text-zinc-900 dark:text-white mb-5",
			style: { fontFamily: "'Space Grotesk', sans-serif" },
			children: ["Filmografía & Obras", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "ml-2 text-sm font-normal text-zinc-400",
				children: [
					"(",
					sorted.length,
					")"
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4",
			children: sorted.map((work) => {
				const linkTo = [
					"g1",
					"g2",
					"g3",
					"g4",
					"g5",
					"g6",
					"m1",
					"m2",
					"s1",
					"s2",
					"b1",
					"c1"
				].includes(work.id) ? `/catalog/${work.category}/${work.id}` : "#";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: linkTo,
					className: `group flex flex-col gap-2 ${linkTo === "#" ? "pointer-events-none" : "cursor-pointer"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative rounded-xl overflow-hidden aspect-[2/3] bg-zinc-100 dark:bg-zinc-800",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: work.cover,
								alt: work.title,
								title: `${work.title} — ${work.genre}`,
								className: "w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-xs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-white text-xs font-semibold",
									children: work.rating
								})]
							}),
							linkTo !== "#" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-line text-zinc-900 text-sm" })
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-zinc-900 dark:text-white leading-tight line-clamp-2 mb-1",
							children: work.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-xs px-1.5 py-0.5 rounded-md font-medium ${CATEGORY_COLORS[work.category] ?? "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`,
								children: CATEGORY_LABELS[work.category] ?? work.category
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-zinc-400",
								children: work.year
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-zinc-500 mt-0.5 italic",
							children: work.role
						})
					] })]
				}, work.id);
			})
		})]
	});
}
//#endregion
//#region src/pages/person/components/PersonStats.tsx
function PersonStats({ person }) {
	const ratings = person.works.map((w) => w.rating);
	const avg = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
	const max = ratings.length > 0 ? Math.max(...ratings) : 0;
	const min = ratings.length > 0 ? Math.min(...ratings) : 0;
	const categoryCounts = person.works.reduce((acc, w) => {
		acc[w.category] = (acc[w.category] ?? 0) + 1;
		return acc;
	}, {});
	const CATEGORY_LABELS = {
		games: "Videojuegos",
		movies: "Películas",
		series: "Series",
		books: "Libros",
		concerts: "Conciertos",
		anime: "Anime"
	};
	const stats = [
		{
			label: "Obras totales",
			value: person.works.length,
			icon: "ri-film-line"
		},
		{
			label: "Rating medio",
			value: avg.toFixed(1),
			icon: "ri-star-fill",
			accent: true
		},
		{
			label: "Mejor valorada",
			value: max.toFixed(1),
			icon: "ri-trophy-line"
		},
		{
			label: "Menor valoración",
			value: min.toFixed(1),
			icon: "ri-arrow-down-line"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-bold text-zinc-900 dark:text-white mb-5",
				style: { fontFamily: "'Space Grotesk', sans-serif" },
				children: "Estadísticas"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 mb-6",
				children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-zinc-50 dark:bg-zinc-800/60 rounded-xl p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-8 h-8 flex items-center justify-center mb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${s.icon} text-lg ${s.accent ? "text-amber-400" : "text-zinc-400"}` })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `text-2xl font-black mb-0.5 ${s.accent ? "text-amber-500" : "text-zinc-900 dark:text-white"}`,
							style: { fontFamily: "'Space Grotesk', sans-serif" },
							children: s.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-zinc-500",
							children: s.label
						})
					]
				}, s.label))
			}),
			Object.keys(categoryCounts).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3",
				children: "Por categoría"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-2",
				children: Object.entries(categoryCounts).map(([cat, count]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-zinc-600 dark:text-zinc-400 w-24 flex-shrink-0",
							children: CATEGORY_LABELS[cat] ?? cat
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-gradient-to-r from-violet-500 to-rose-500 transition-all duration-500",
								style: { width: `${count / person.works.length * 100}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300 w-4 text-right",
							children: count
						})
					]
				}, cat))
			})] })
		]
	});
}
//#endregion
//#region src/pages/person/page.tsx
function PersonPage() {
	const { id = "" } = useParams();
	const person = PEOPLE_MOCK[id];
	const bioRef = useScrollReveal();
	const worksRef = useScrollReveal({ rootMargin: "0px 0px -40px 0px" });
	const statsRef = useScrollReveal({ rootMargin: "0px" });
	if (!person) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-white dark:bg-zinc-950 flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col items-center justify-center gap-4 text-zinc-400 pt-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-user-unfollow-line text-5xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg font-semibold",
					children: "Persona no encontrada"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/catalog",
					className: "text-sm text-violet-500 hover:underline cursor-pointer",
					children: "Volver a Explorar"
				})
			]
		})]
	});
	const avgRating = person.works.length > 0 ? (person.works.reduce((s, w) => s + w.rating, 0) / person.works.length).toFixed(1) : null;
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: person.name,
		image: person.photo,
		description: person.bio,
		nationality: person.nationality,
		birthDate: String(person.birthYear),
		jobTitle: person.role,
		url: `${getSiteUrl()}/person/${person.id}`
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-zinc-50 dark:bg-zinc-950",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoHead, {
				title: `${person.name} — ${person.role} | Vaultly`,
				description: `${person.name} es ${person.role.toLowerCase()} ${person.nationality.toLowerCase()}. Conocido/a por: ${person.known_for.join(", ")}. ${person.works.length} obras${avgRating ? ` con una media de ${avgRating}` : ""}.`,
				keywords: `${person.name}, ${person.role}, ${person.known_for.join(", ")}, Vaultly`,
				canonical: `/person/${person.id}`,
				ogImage: person.photo,
				jsonLd
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonHero, { person }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-w-screen-xl mx-auto px-4 md:px-6 py-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col lg:flex-row gap-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0 flex flex-col gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								ref: bioRef,
								className: "sr-item",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonBio, { person })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								ref: worksRef,
								className: "sr-item",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonWorks, { person })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: statsRef,
							className: "sr-item-right w-full lg:w-72 flex-shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "sticky top-24",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonStats, { person })
							})
						})]
					})
				})]
			})
		]
	});
}
//#endregion
export { PersonPage as default };

//# sourceMappingURL=page-CzDUh3P1.js.map