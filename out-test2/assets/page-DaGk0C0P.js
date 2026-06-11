import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { a as isValidHexColor, c as useAuth, f as useNavigate, h as require_react, i as DEFAULT_CATEGORY_COLORS, l as supabase, n as useCategoryColors, o as normalizeHexColor, r as CATEGORIES, s as require_jsx_runtime, t as useCategories, u as Link } from "./index-cosAM6zi.js";
import { t as SeoHead } from "./SeoHead-SAtaEFdZ.js";
import { t as useTheme } from "./useTheme-CjO9s6QO.js";
import { n as useSettings } from "./useSettings-CZ1Tg8p7.js";
import { t as Navbar } from "./Navbar-XnbO_Z_a.js";
//#region src/pages/settings/components/SettingsSidebar.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var NAV_ITEMS = [
	{
		id: "appearance",
		label: "Apariencia",
		icon: "ri-palette-line",
		description: "Tema, colores y fuentes"
	},
	{
		id: "categories",
		label: "Categorías",
		icon: "ri-apps-2-line",
		description: "Gestiona tu tracker"
	},
	{
		id: "language",
		label: "Idioma",
		icon: "ri-translate-2",
		description: "Idioma de la aplicación"
	},
	{
		id: "notifications",
		label: "Notificaciones",
		icon: "ri-notification-3-line",
		description: "Alertas y avisos"
	},
	{
		id: "privacy",
		label: "Privacidad",
		icon: "ri-shield-check-line",
		description: "Visibilidad de tu perfil"
	},
	{
		id: "account",
		label: "Cuenta",
		icon: "ri-user-settings-line",
		description: "Datos y seguridad"
	}
];
function SettingsSidebar({ active, onChange, items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "w-full lg:w-64 flex-shrink-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "flex flex-col gap-1",
			children: (items ? NAV_ITEMS.filter((item) => items.includes(item.id)) : NAV_ITEMS).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => onChange(item.id),
				className: `flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer w-full ${active === item.id ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 ${active === item.id ? "bg-white/20 dark:bg-zinc-900/20" : "bg-zinc-100 dark:bg-zinc-800"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${item.icon} text-sm` })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold leading-tight",
						children: item.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `text-xs leading-tight mt-0.5 ${active === item.id ? "text-white/60 dark:text-zinc-900/60" : "text-zinc-400"}`,
						children: item.description
					})]
				})]
			}, item.id))
		})
	});
}
//#endregion
//#region src/pages/settings/components/SettingsCard.tsx
function SettingsCard({ title, description, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-6 py-5 border-b border-zinc-100 dark:border-zinc-800",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-bold text-zinc-900 dark:text-white text-base",
				children: title
			}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-zinc-500 dark:text-zinc-400 mt-0.5",
				children: description
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-6",
			children
		})]
	});
}
function ToggleRow({ label, description, checked, onChange, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-4 py-3 border-b border-zinc-50 dark:border-zinc-800 last:border-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-zinc-900 dark:text-white",
				children: label
			}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-zinc-500 dark:text-zinc-400 mt-0.5",
				children: description
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => !disabled && onChange(!checked),
			disabled,
			className: `relative w-11 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer ${checked ? "bg-zinc-900 dark:bg-white" : "bg-zinc-200 dark:bg-zinc-700"} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform ${checked ? "translate-x-5 bg-white dark:bg-zinc-900" : "translate-x-0 bg-white dark:bg-zinc-400"}` })
		})]
	});
}
//#endregion
//#region src/pages/settings/components/AppearanceSection.tsx
var THEME_OPTIONS = [{
	id: "light",
	label: "Claro",
	icon: "ri-sun-line",
	preview: "bg-white border-zinc-200",
	previewInner: "bg-zinc-100",
	previewText: "text-zinc-800"
}, {
	id: "dark",
	label: "Oscuro",
	icon: "ri-moon-line",
	preview: "bg-zinc-900 border-zinc-700",
	previewInner: "bg-zinc-800",
	previewText: "text-zinc-200"
}];
var FONT_SIZES = [
	{
		id: "sm",
		label: "Pequeño",
		sample: "text-xs"
	},
	{
		id: "base",
		label: "Normal",
		sample: "text-sm"
	},
	{
		id: "lg",
		label: "Grande",
		sample: "text-base"
	}
];
function AppearanceSection() {
	const { theme, toggleTheme } = useTheme();
	const savedFont = localStorage.getItem("vaultly-font-size") ?? "base";
	const setFont = (id) => localStorage.setItem("vaultly-font-size", id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SettingsCard, {
				title: "Tema",
				description: "Elige entre modo claro u oscuro para la interfaz.",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-4",
					children: THEME_OPTIONS.map((opt) => {
						const isActive = theme === opt.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								if (theme !== opt.id) toggleTheme();
							},
							className: `relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${isActive ? "border-zinc-900 dark:border-white" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `w-full h-20 rounded-lg border ${opt.preview} flex flex-col gap-1.5 p-2 overflow-hidden`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-2 w-16 rounded-full ${opt.previewInner}` }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-2 w-10 rounded-full ${opt.previewInner} opacity-60` }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-1 mt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-6 w-8 rounded ${opt.previewInner}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-6 w-8 rounded ${opt.previewInner} opacity-60` })]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${opt.icon} text-sm text-zinc-600 dark:text-zinc-400` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-sm font-semibold ${isActive ? "text-zinc-900 dark:text-white" : "text-zinc-600 dark:text-zinc-400"}`,
										children: opt.label
									})]
								}),
								isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full bg-zinc-900 dark:bg-white",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line text-white dark:text-zinc-900 text-xs" })
								})
							]
						}, opt.id);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-zinc-400 dark:text-zinc-500 mt-3",
					children: "Tu preferencia se guarda en este dispositivo y se aplica al instante en toda la aplicación."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsCard, {
				title: "Colores de categoría",
				description: "El color de acento de Vaultly varía según la categoría (videojuegos, películas, series, libros, conciertos) para ayudarte a distinguirlas de un vistazo.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-palette-line text-zinc-400 text-base mt-0.5 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-zinc-600 dark:text-zinc-300",
						children: [
							"Puedes personalizar el color de cada categoría — se usa en chips, insignias, bordes y filtros activos en todo Vaultly. Ve a la pestaña ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-zinc-900 dark:text-white",
								children: "Categorías"
							}),
							" en el menú lateral para editarlos."
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsCard, {
				title: "Tamaño de texto",
				description: "Ajusta el tamaño de la fuente en la interfaz.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-3",
					children: FONT_SIZES.map((fs) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setFont(fs.id),
						className: `flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all cursor-pointer ${savedFont === fs.id ? "border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `font-semibold text-zinc-900 dark:text-white ${fs.sample}`,
							children: "Aa"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-zinc-500",
							children: fs.label
						})]
					}, fs.id))
				})
			})
		]
	});
}
//#endregion
//#region src/pages/settings/components/CategoryColorEditor.tsx
var SUGGESTED_SWATCHES = {
	videojuegos: [
		"#84cc16",
		"#22c55e",
		"#14b8a6",
		"#65a30d",
		"#a3e635"
	],
	peliculas: [
		"#ef4444",
		"#f97316",
		"#fb7185",
		"#dc2626",
		"#f43f5e"
	],
	series: [
		"#8b5cf6",
		"#6366f1",
		"#3b82f6",
		"#a78bfa",
		"#7c3aed"
	],
	libros: [
		"#c2780c",
		"#92400e",
		"#d97706",
		"#a16207",
		"#b45309"
	],
	conciertos: [
		"#ec4899",
		"#d946ef",
		"#e11d48",
		"#f472b6",
		"#db2777"
	]
};
function ColorSwatchButton({ color, selected, onClick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		title: label,
		"aria-label": label,
		className: `relative w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110 ${selected ? "ring-2 ring-offset-2 ring-zinc-900 dark:ring-white dark:ring-offset-zinc-900" : ""}`,
		style: { background: color },
		children: selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line text-white text-sm absolute inset-0 flex items-center justify-center" })
	});
}
function CategoryColorRow({ catId }) {
	const { colors, isCustomized, setColor, resetColor } = useCategoryColors();
	const cat = CATEGORIES.find((c) => c.id === catId);
	const current = colors[catId];
	const isDefault = !isCustomized(catId);
	const colorInputRef = (0, import_react.useRef)(null);
	const hexInputRef = (0, import_react.useRef)(null);
	const [hexDraft, setHexDraft] = (0, import_react.useState)(current);
	const [hexError, setHexError] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (document.activeElement !== hexInputRef.current) {
			setHexDraft(current);
			setHexError(false);
		}
	}, [current]);
	const commitHex = (value) => {
		const trimmed = value.trim();
		if (isValidHexColor(trimmed)) {
			setColor(catId, normalizeHexColor(trimmed));
			setHexError(false);
		} else setHexError(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3 py-4 border-b border-zinc-50 dark:border-zinc-800 last:border-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0",
					style: {
						background: `${current}1a`,
						color: current
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${cat.icon} text-lg` })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-zinc-900 dark:text-white",
						children: cat.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-zinc-500 dark:text-zinc-400 truncate",
						children: cat.description
					})]
				}),
				!isDefault && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						resetColor(catId);
						setHexDraft(DEFAULT_CATEGORY_COLORS[catId]);
						setHexError(false);
					},
					className: "flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer flex-shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-go-back-line text-sm" }), "Restaurar"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-4 pl-[3.25rem]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: SUGGESTED_SWATCHES[catId].map((swatch) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorSwatchButton, {
						color: swatch,
						selected: current.toLowerCase() === swatch.toLowerCase(),
						onClick: () => {
							setColor(catId, swatch);
							setHexDraft(swatch);
							setHexError(false);
						},
						label: `Usar ${swatch} para ${cat.label}`
					}, swatch))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-px h-6 bg-zinc-100 dark:bg-zinc-800 hidden sm:block" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "relative w-8 h-8 rounded-full cursor-pointer overflow-hidden border-2 border-dashed border-zinc-300 dark:border-zinc-600 flex items-center justify-center hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors",
							title: "Elegir color personalizado",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-palette-line text-xs text-zinc-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: colorInputRef,
								type: "color",
								value: current,
								onChange: (e) => {
									setColor(catId, e.target.value);
									setHexDraft(e.target.value);
									setHexError(false);
								},
								className: "absolute inset-0 opacity-0 cursor-pointer",
								"aria-label": `Color personalizado para ${cat.label}`
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 select-none",
								children: "#"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: hexInputRef,
								type: "text",
								value: hexDraft.replace(/^#/, ""),
								onChange: (e) => setHexDraft("#" + e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6)),
								onBlur: (e) => commitHex("#" + e.target.value.replace(/^#/, "")),
								onKeyDown: (e) => {
									if (e.key === "Enter") e.target.blur();
								},
								maxLength: 6,
								spellCheck: false,
								className: `w-24 pl-5 pr-2 py-1.5 text-xs font-mono rounded-lg border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 transition-colors ${hexError ? "border-rose-400 focus:ring-rose-200 dark:focus:ring-rose-900" : "border-zinc-200 dark:border-zinc-700 focus:ring-zinc-200 dark:focus:ring-zinc-700"}`,
								"aria-label": `Código hexadecimal para ${cat.label}`,
								"aria-invalid": hexError
							})]
						}),
						hexError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-rose-500",
							children: "Código no válido"
						})
					]
				}),
				!isDefault && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] uppercase tracking-wide font-medium text-zinc-400 dark:text-zinc-500 ml-auto",
					children: "Personalizado"
				})
			]
		})]
	});
}
function CategoryColorEditor() {
	const { resetAll, isCustomized } = useCategoryColors();
	const anyCustomized = CATEGORIES.some((c) => isCustomized(c.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SettingsCard, {
		title: "Colores por categoría",
		description: "Cada categoría tiene un color de identidad que se usa en chips, insignias, bordes y filtros activos. Personalízalo a tu gusto.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col",
			children: CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryColorRow, { catId: cat.id }, cat.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-zinc-400 dark:text-zinc-500",
				children: "Los colores se aplican en todo Vaultly: catálogo, tracker, panel y perfil."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: resetAll,
				disabled: !anyCustomized,
				className: "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex-shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-refresh-line text-sm" }), "Restaurar todos los valores por defecto"]
			})]
		})]
	});
}
//#endregion
//#region src/pages/settings/components/CategoriesSection.tsx
function CategoriesSection() {
	const { settings, toggleCategory } = useSettings();
	const categories = useCategories();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SettingsCard, {
				title: "Categorías activas",
				description: "Selecciona qué categorías quieres ver en tu tracker, en el catálogo y en el navbar. Debes tener al menos una activa.",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
					children: categories.map((cat) => {
						const isActive = settings.activeCategories.includes(cat.id);
						const isLast = isActive && settings.activeCategories.length === 1;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => toggleCategory(cat.id),
							disabled: isLast,
							className: `relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${isActive ? "border-transparent" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 opacity-60"} ${isLast ? "cursor-not-allowed" : ""}`,
							style: isActive ? {
								borderColor: cat.accent,
								background: `${cat.accent}10`
							} : {},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0",
									style: {
										background: `${cat.accent}1f`,
										color: cat.accent
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${cat.icon} text-xl` })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-zinc-900 dark:text-white text-sm",
										children: cat.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-zinc-500 dark:text-zinc-400 mt-0.5",
										children: cat.description
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isActive ? "border-transparent" : "border-zinc-300 dark:border-zinc-600"}`,
									style: isActive ? { background: cat.accent } : {},
									children: isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line text-white text-xs" })
								})
							]
						}, cat.id);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-start gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-information-line text-zinc-400 text-sm mt-0.5 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-zinc-500 dark:text-zinc-400",
						children: "Las categorías desactivadas no aparecerán en tu tracker, en tu catálogo personalizado ni en el menú de navegación. Puedes volver a activarlas cuando quieras."
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryColorEditor, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SettingsCard, {
				title: "Resumen de tu tracker",
				description: "Así se ven tus categorías activas con tus colores actuales.",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: categories.filter((cat) => settings.activeCategories.includes(cat.id)).map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
						style: {
							background: `${cat.accent}1a`,
							color: cat.accent
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${cat.icon} text-sm` }), cat.label]
					}, cat.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-zinc-400 mt-3",
					children: [
						settings.activeCategories.length,
						" de ",
						categories.length,
						" categorías activas"
					]
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/settings/components/LanguageSection.tsx
var LANGUAGES = [
	{
		id: "es",
		label: "Español",
		native: "Español",
		flag: "🇪🇸"
	},
	{
		id: "en",
		label: "Inglés",
		native: "English",
		flag: "🇬🇧"
	},
	{
		id: "fr",
		label: "Francés",
		native: "Français",
		flag: "🇫🇷"
	},
	{
		id: "de",
		label: "Alemán",
		native: "Deutsch",
		flag: "🇩🇪"
	},
	{
		id: "pt",
		label: "Portugués",
		native: "Português",
		flag: "🇵🇹"
	},
	{
		id: "it",
		label: "Italiano",
		native: "Italiano",
		flag: "🇮🇹"
	},
	{
		id: "ja",
		label: "Japonés",
		native: "日本語",
		flag: "🇯🇵"
	},
	{
		id: "ko",
		label: "Coreano",
		native: "한국어",
		flag: "🇰🇷"
	}
];
function LanguageSection() {
	const { settings, update } = useSettings();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SettingsCard, {
			title: "Idioma de la aplicación",
			description: "Selecciona el idioma en el que quieres usar Vaultly.",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
				children: LANGUAGES.map((lang) => {
					const isActive = settings.language === lang.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => update("language", lang.id),
						className: `flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 transition-all cursor-pointer text-left ${isActive ? "border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl flex-shrink-0",
								children: lang.flag
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-sm font-semibold ${isActive ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-300"}`,
									children: lang.native
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-zinc-400",
									children: lang.label
								})]
							}),
							isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-5 h-5 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center flex-shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line text-white dark:text-zinc-900 text-xs" })
							})
						]
					}, lang.id);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 flex items-start gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-translate-2 text-amber-500 text-sm mt-0.5 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-amber-700 dark:text-amber-400",
					children: "El soporte completo de idiomas estará disponible próximamente. Actualmente la app está disponible en español."
				})]
			})]
		})
	});
}
//#endregion
//#region src/pages/settings/components/NotificationsSection.tsx
function NotificationsSection() {
	const { settings, updateNested } = useSettings();
	const n = settings.notifications;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SettingsCard, {
			title: "Notificaciones",
			description: "Controla qué tipo de alertas quieres recibir de Vaultly.",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
					label: "Nuevos lanzamientos",
					description: "Aviso cuando salga contenido nuevo en tus categorías activas.",
					checked: n.newReleases,
					onChange: (v) => updateNested("notifications", "newReleases", v)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
					label: "Actividad de la comunidad",
					description: "Cuando alguien comenta o valora el mismo contenido que tú.",
					checked: n.communityActivity,
					onChange: (v) => updateNested("notifications", "communityActivity", v)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
					label: "Resumen semanal",
					description: "Un email cada semana con tu actividad y recomendaciones.",
					checked: n.weeklyDigest,
					onChange: (v) => updateNested("notifications", "weeklyDigest", v)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
					label: "Recordatorios del tracker",
					description: "Te recordamos los ítems que llevan tiempo en progreso.",
					checked: n.trackerReminders,
					onChange: (v) => updateNested("notifications", "trackerReminders", v)
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsCard, {
			title: "Estado de las notificaciones",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex-shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-notification-3-line text-emerald-500" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-semibold text-zinc-900 dark:text-white",
					children: [Object.values(n).filter(Boolean).length, " notificaciones activas"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-zinc-500 dark:text-zinc-400",
					children: "Las notificaciones se enviarán al email de tu cuenta."
				})] })]
			})
		})]
	});
}
//#endregion
//#region src/pages/settings/components/PrivacySection.tsx
function PrivacySection() {
	const { profile, refreshProfile } = useAuth();
	const [priv, setPriv] = (0, import_react.useState)({
		is_public: true,
		share_tracker: true,
		show_ratings: true,
		show_reviews: true
	});
	const [saveStatus, setSaveStatus] = (0, import_react.useState)("idle");
	(0, import_react.useEffect)(() => {
		if (profile) setPriv({
			is_public: profile.is_public ?? true,
			share_tracker: profile.share_tracker ?? true,
			show_ratings: profile.show_ratings ?? true,
			show_reviews: profile.show_reviews ?? true
		});
	}, [profile]);
	const update = (key, value) => {
		setPriv((prev) => {
			const next = {
				...prev,
				[key]: value
			};
			if (key === "is_public" && !value) {
				next.share_tracker = false;
				next.show_ratings = false;
				next.show_reviews = false;
			}
			return next;
		});
	};
	const handleSave = async () => {
		if (!profile) return;
		setSaveStatus("saving");
		const { error } = await supabase.from("profiles").update({
			is_public: priv.is_public,
			share_tracker: priv.share_tracker,
			show_ratings: priv.show_ratings,
			show_reviews: priv.show_reviews,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", profile.id);
		if (error) {
			setSaveStatus("error");
			setTimeout(() => setSaveStatus("idle"), 3e3);
		} else {
			await refreshProfile();
			setSaveStatus("saved");
			setTimeout(() => setSaveStatus("idle"), 2500);
		}
	};
	const profileUsername = profile?.username ?? profile?.email?.split("@")[0] ?? "usuario";
	const shareUrl = `${window.location.origin}/u/${profileUsername}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SettingsCard, {
				title: "Visibilidad del perfil",
				description: "Controla qué pueden ver otros usuarios de tu actividad en Vaultly.",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "Perfil público",
								description: "Cualquiera puede ver tu perfil y estadísticas generales.",
								checked: priv.is_public,
								onChange: (v) => update("is_public", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "Compartir tracker",
								description: "Tu tracker es visible para quien tenga el enlace.",
								checked: priv.share_tracker,
								onChange: (v) => update("share_tracker", v),
								disabled: !priv.is_public
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "Mostrar puntuaciones",
								description: "Tus valoraciones son visibles en tu perfil público.",
								checked: priv.show_ratings,
								onChange: (v) => update("show_ratings", v),
								disabled: !priv.is_public
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "Mostrar reseñas",
								description: "Tus reseñas son visibles en el catálogo y en tu perfil.",
								checked: priv.show_reviews,
								onChange: (v) => update("show_reviews", v),
								disabled: !priv.is_public
							})
						]
					}),
					!priv.is_public && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-lock-line text-zinc-500 text-sm flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-zinc-600 dark:text-zinc-400",
							children: [
								"Tu perfil está en modo ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "privado" }),
								". Solo tú puedes verlo."
							]
						})]
					}),
					saveStatus === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-rose-500 text-sm flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-rose-600 dark:text-rose-400",
							children: "Error al guardar. Inténtalo de nuevo."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleSave,
							disabled: saveStatus === "saving",
							className: `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap disabled:opacity-60 ${saveStatus === "saved" ? "bg-emerald-500 text-white" : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90"}`,
							children: [
								saveStatus === "saving" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-loader-4-line animate-spin" }), " Guardando..."] }),
								saveStatus === "saved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-checkbox-circle-line" }), " Guardado"] }),
								saveStatus === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-save-line" }), " Guardar cambios"] }),
								saveStatus === "idle" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-save-line" }), " Guardar cambios"] })
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SettingsCard, {
				title: "Enlace de tu perfil público",
				description: "Comparte tu perfil con amigos o en redes sociales.",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `transition-opacity ${!priv.is_public ? "opacity-40 pointer-events-none select-none" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-link text-zinc-400 text-sm flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-zinc-600 dark:text-zinc-400 truncate",
								children: shareUrl
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => navigator.clipboard.writeText(shareUrl),
							className: "flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-file-copy-line" }), "Copiar"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap items-center gap-2 mt-4",
						children: [
							{
								icon: "ri-twitter-x-line",
								label: "X / Twitter",
								href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`
							},
							{
								icon: "ri-whatsapp-line",
								label: "WhatsApp",
								href: `https://wa.me/?text=${encodeURIComponent(shareUrl)}`
							},
							{
								icon: "ri-telegram-line",
								label: "Telegram",
								href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`
							}
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: s.href,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: s.icon }), s.label]
						}, s.label))
					})]
				}), !priv.is_public && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-zinc-400 mt-3",
					children: "Activa el perfil público para obtener tu enlace compartible."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3 px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-information-line text-zinc-400 text-base flex-shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-0.5",
					children: "¿Cómo funciona la privacidad?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed",
					children: [
						"Con el perfil público activado, cualquiera puede ver tu página en ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono",
							children: ["/u/", profileUsername]
						}),
						". Puedes controlar de forma granular qué información es visible: puntuaciones, reseñas y tracker son opcionales. Los cambios se aplican de inmediato al guardar."
					]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsCard, {
				title: "Documentos legales",
				description: "Consulta nuestras políticas y condiciones de uso en cualquier momento.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800",
					children: [
						{
							to: "/privacy",
							icon: "ri-shield-check-line",
							iconColor: "text-violet-500",
							iconBg: "bg-violet-50 dark:bg-violet-950/30",
							title: "Política de Privacidad",
							desc: "Cómo recopilamos, usamos y protegemos tus datos personales.",
							badge: "Actualizado abr. 2026",
							badgeColor: "bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400"
						},
						{
							to: "/terms",
							icon: "ri-file-list-3-line",
							iconColor: "text-amber-500",
							iconBg: "bg-amber-50 dark:bg-amber-950/30",
							title: "Términos de Uso",
							desc: "Condiciones que regulan el acceso y uso de la plataforma.",
							badge: "Versión 3.0",
							badgeColor: "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
						},
						{
							to: "/contact",
							icon: "ri-customer-service-2-line",
							iconColor: "text-rose-500",
							iconBg: "bg-rose-50 dark:bg-rose-950/30",
							title: "Contacto y soporte",
							desc: "Envíanos una consulta, reporta un bug o comparte una sugerencia.",
							badge: "Respuesta &lt; 48h",
							badgeColor: "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
						}
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "flex items-center gap-4 py-4 first:pt-0 last:pb-0 group hover:opacity-80 transition-opacity cursor-pointer",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${item.icon} ${item.iconColor} text-base` })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold text-zinc-800 dark:text-zinc-200",
										children: item.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-xs px-2 py-0.5 rounded-full font-medium ${item.badgeColor}`,
										dangerouslySetInnerHTML: { __html: item.badge }
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug",
									children: item.desc
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-5 h-5 flex items-center justify-center flex-shrink-0 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-external-link-line text-sm" })
							})
						]
					}, item.to))
				})
			})
		]
	});
}
//#endregion
//#region src/pages/settings/components/AccountSection.tsx
function AccountSection() {
	const { profile, logout, refreshProfile } = useAuth();
	const { reset } = useSettings();
	const navigate = useNavigate();
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [username, setUsername] = (0, import_react.useState)("");
	const [bio, setBio] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const [saveError, setSaveError] = (0, import_react.useState)("");
	const [touched, setTouched] = (0, import_react.useState)({
		displayName: false,
		username: false,
		bio: false
	});
	const [showResetConfirm, setShowResetConfirm] = (0, import_react.useState)(false);
	const [showLogoutConfirm, setShowLogoutConfirm] = (0, import_react.useState)(false);
	const [avatarUploading, setAvatarUploading] = (0, import_react.useState)(false);
	const [avatarError, setAvatarError] = (0, import_react.useState)("");
	const [currentPassword, setCurrentPassword] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [showCurrentPass, setShowCurrentPass] = (0, import_react.useState)(false);
	const [showNewPass, setShowNewPass] = (0, import_react.useState)(false);
	const [showConfirmPass, setShowConfirmPass] = (0, import_react.useState)(false);
	const [pwTouched, setPwTouched] = (0, import_react.useState)({
		current: false,
		newPw: false,
		confirm: false
	});
	const [pwSaving, setPwSaving] = (0, import_react.useState)(false);
	const [pwSaved, setPwSaved] = (0, import_react.useState)(false);
	const [pwError, setPwError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (profile) {
			setDisplayName(profile.display_name ?? "");
			setUsername(profile.username ?? "");
			setBio(profile.bio ?? "");
		}
	}, [profile]);
	const touch = (field) => setTouched((prev) => ({
		...prev,
		[field]: true
	}));
	const displayNameError = touched.displayName && !displayName.trim() ? "El nombre visible es obligatorio." : "";
	const usernameError = touched.username && username.trim().length < 3 ? "Mínimo 3 caracteres." : "";
	const inputBase = "w-full px-4 py-2.5 rounded-xl border text-sm text-zinc-900 dark:text-white focus:outline-none transition-all";
	const inputNormal = "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500/30";
	const inputErrorClass = "border-rose-400 dark:border-rose-500 bg-rose-50/40 dark:bg-rose-950/10 focus:ring-2 focus:ring-rose-500/20";
	const inputSuccessClass = "border-emerald-400 dark:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10 focus:ring-2 focus:ring-emerald-500/20";
	const getDisplayNameClass = () => {
		if (displayNameError) return inputErrorClass;
		if (touched.displayName && displayName.trim()) return inputSuccessClass;
		return inputNormal;
	};
	const getUsernameClass = () => {
		if (usernameError) return inputErrorClass;
		if (touched.username && username.trim().length >= 3) return inputSuccessClass;
		return inputNormal;
	};
	const getBioClass = () => {
		if (touched.bio && bio.trim()) return inputSuccessClass;
		return inputNormal;
	};
	const getInitials = (name) => name.split(/[\s_-]+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
	const handleSave = async () => {
		setTouched({
			displayName: true,
			username: true,
			bio: true
		});
		if (!displayName.trim() || username.trim().length < 3) return;
		if (!profile) return;
		setSaving(true);
		setSaveError("");
		const { error } = await supabase.from("profiles").update({
			display_name: displayName.trim(),
			username: username.trim().toLowerCase().replace(/\s/g, "_"),
			bio: bio.trim(),
			initials: getInitials(displayName.trim() || username.trim()),
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", profile.id);
		setSaving(false);
		if (error) setSaveError("Error al guardar. Inténtalo de nuevo.");
		else {
			await refreshProfile();
			setSaved(true);
			setTimeout(() => setSaved(false), 2500);
		}
	};
	const handleAvatarChange = async (e) => {
		const file = e.target.files?.[0];
		if (!file || !profile) return;
		setAvatarError("");
		if (file.size > 2 * 1024 * 1024) {
			setAvatarError("El archivo no puede superar 2 MB.");
			return;
		}
		if (![
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/gif"
		].includes(file.type)) {
			setAvatarError("Formato no válido. Usa JPG, PNG, WEBP o GIF.");
			return;
		}
		setAvatarUploading(true);
		try {
			const ext = file.name.split(".").pop();
			const path = `${profile.id}/avatar.${ext}`;
			const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
			if (uploadError) {
				setAvatarError("Error al subir la imagen.");
				return;
			}
			const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
			const urlWithCache = `${publicUrl}?t=${Date.now()}`;
			const { error: updateError } = await supabase.from("profiles").update({
				avatar_url: urlWithCache,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", profile.id);
			if (updateError) {
				setAvatarError("Error al guardar el avatar.");
				return;
			}
			await refreshProfile();
		} catch {
			setAvatarError("Error inesperado. Inténtalo de nuevo.");
		} finally {
			setAvatarUploading(false);
			e.target.value = "";
		}
	};
	const handleRemoveAvatar = async () => {
		if (!profile?.avatar_url) return;
		setAvatarUploading(true);
		try {
			const path = `${profile.id}/avatar`;
			await supabase.storage.from("avatars").remove([
				`${path}.jpg`,
				`${path}.jpeg`,
				`${path}.png`,
				`${path}.webp`,
				`${path}.gif`
			]);
			await supabase.from("profiles").update({
				avatar_url: null,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", profile.id);
			await refreshProfile();
		} catch {
			setAvatarError("Error al eliminar el avatar.");
		} finally {
			setAvatarUploading(false);
		}
	};
	const touchPw = (field) => setPwTouched((prev) => ({
		...prev,
		[field]: true
	}));
	const currentPwError = pwTouched.current && !currentPassword ? "Introduce tu contraseña actual." : "";
	const newPwError = pwTouched.newPw ? !newPassword ? "La nueva contraseña es obligatoria." : newPassword.length < 8 ? "Mínimo 8 caracteres." : newPassword === currentPassword ? "Debe ser diferente a la actual." : "" : "";
	const confirmPwError = pwTouched.confirm ? !confirmPassword ? "Confirma la nueva contraseña." : confirmPassword !== newPassword ? "Las contraseñas no coinciden." : "" : "";
	const pwStrength = newPassword.length === 0 ? 0 : newPassword.length < 6 ? 1 : newPassword.length < 10 ? 2 : 3;
	const pwStrengthLabel = [
		"",
		"Débil",
		"Media",
		"Fuerte"
	];
	const pwStrengthColor = [
		"",
		"bg-rose-400",
		"bg-amber-400",
		"bg-emerald-400"
	];
	const getPwClass = (hasError, isValid) => {
		if (hasError) return inputErrorClass;
		if (isValid) return inputSuccessClass;
		return inputNormal;
	};
	const handleChangePassword = async () => {
		setPwTouched({
			current: true,
			newPw: true,
			confirm: true
		});
		if (!currentPassword || newPwError || confirmPwError || confirmPassword !== newPassword) return;
		setPwSaving(true);
		setPwError("");
		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user?.email) {
				setPwError("No se pudo verificar tu sesión.");
				return;
			}
			const { error: signInError } = await supabase.auth.signInWithPassword({
				email: user.email,
				password: currentPassword
			});
			if (signInError) {
				setPwError("La contraseña actual es incorrecta.");
				return;
			}
			const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
			if (updateError) {
				setPwError(updateError.message);
				return;
			}
			setPwSaved(true);
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			setPwTouched({
				current: false,
				newPw: false,
				confirm: false
			});
			setTimeout(() => setPwSaved(false), 3e3);
		} catch {
			setPwError("Error inesperado. Inténtalo de nuevo.");
		} finally {
			setPwSaving(false);
		}
	};
	const handleLogout = async () => {
		await logout();
		navigate("/");
	};
	const handleReset = () => {
		reset();
		setShowResetConfirm(false);
	};
	const initials = profile?.initials ?? profile?.display_name?.slice(0, 2).toUpperCase() ?? "??";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsCard, {
				title: "Información de perfil",
				description: "Actualiza tu nombre visible, usuario y descripción pública.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-shrink-0 group",
								children: [profile?.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: profile.avatar_url,
									alt: "Avatar",
									className: "w-16 h-16 rounded-full object-cover object-top"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center text-white text-xl font-bold",
									children: initials
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: `absolute inset-0 rounded-full flex items-center justify-center bg-black/50 cursor-pointer transition-opacity ${avatarUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`,
									children: [avatarUploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-loader-4-line text-white text-lg animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-camera-line text-white text-lg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/jpeg,image/png,image/webp,image/gif",
										className: "sr-only",
										onChange: handleAvatarChange,
										disabled: avatarUploading
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold text-zinc-900 dark:text-white",
										children: profile?.display_name ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-zinc-500",
										children: ["@", profile?.username ?? profile?.email]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-zinc-400",
										children: profile?.email
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 mt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-1.5 text-xs text-violet-500 font-medium cursor-pointer hover:text-violet-600 transition-colors whitespace-nowrap",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-upload-2-line text-xs" }),
												"Cambiar foto",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "file",
													accept: "image/jpeg,image/png,image/webp,image/gif",
													className: "sr-only",
													onChange: handleAvatarChange,
													disabled: avatarUploading
												})
											]
										}), profile?.avatar_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-zinc-300 dark:text-zinc-600",
											children: "·"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: handleRemoveAvatar,
											disabled: avatarUploading,
											className: "text-xs text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50",
											children: "Eliminar"
										})] })]
									}),
									avatarError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-1 text-xs text-rose-500 mt-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-xs" }), avatarError]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-zinc-400",
										children: "JPG, PNG, WEBP o GIF · Máx. 2 MB"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5",
										children: ["Nombre visible ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-rose-500",
											children: "*"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: displayName,
											onChange: (e) => {
												setDisplayName(e.target.value);
												touch("displayName");
											},
											onBlur: () => touch("displayName"),
											placeholder: "Tu nombre público",
											className: `${inputBase} ${getDisplayNameClass()} pr-9`
										}), touched.displayName && displayName.trim() && !displayNameError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line text-sm" })
										})]
									}),
									displayNameError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-1.5 text-xs text-rose-500 mt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-xs flex-shrink-0" }), displayNameError]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5",
										children: ["Nombre de usuario ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-rose-500",
											children: "*"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm",
												children: "@"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: username,
												onChange: (e) => {
													setUsername(e.target.value.toLowerCase().replace(/\s/g, "_"));
													touch("username");
												},
												onBlur: () => touch("username"),
												placeholder: "tu_usuario",
												className: `${inputBase} pl-8 ${getUsernameClass()} pr-9`
											}),
											touched.username && username.trim().length >= 3 && !usernameError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line text-sm" })
											})
										]
									}),
									usernameError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-1.5 text-xs text-rose-500 mt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-xs flex-shrink-0" }), usernameError]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-zinc-400 mt-1",
										children: ["Tu perfil público estará en ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-zinc-600 dark:text-zinc-300",
											children: ["/u/", username || "tu_usuario"]
										})]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5",
										children: "Biografía"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: bio,
										onChange: (e) => {
											setBio(e.target.value.slice(0, 200));
											touch("bio");
										},
										onBlur: () => touch("bio"),
										rows: 3,
										placeholder: "Cuéntanos algo sobre ti...",
										className: `${inputBase} ${getBioClass()} resize-none`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-right text-xs text-zinc-400 mt-1",
										children: [bio.length, "/200"]
									})
								] })
							]
						}),
						saveError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-rose-500 text-sm flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-rose-600 dark:text-rose-400",
								children: saveError
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleSave,
							disabled: saving,
							className: `self-start flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap disabled:opacity-60 ${saved ? "bg-emerald-500 text-white" : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90"}`,
							children: saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-loader-4-line animate-spin" }), " Guardando..."] }) : saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-checkbox-circle-line" }), " Guardado"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-save-line" }), " Guardar cambios"] })
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsCard, {
				title: "Cambiar contraseña",
				description: "Introduce tu contraseña actual y elige una nueva.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5",
								children: ["Contraseña actual ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-rose-500",
									children: "*"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${currentPwError ? "text-rose-400" : "text-zinc-400"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-lock-line text-sm" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: showCurrentPass ? "text" : "password",
										value: currentPassword,
										onChange: (e) => {
											setCurrentPassword(e.target.value);
											touchPw("current");
											setPwError("");
										},
										onBlur: () => touchPw("current"),
										placeholder: "Tu contraseña actual",
										autoComplete: "current-password",
										className: `${inputBase} pl-10 pr-14 ${getPwClass(!!currentPwError, pwTouched.current && !!currentPassword && !currentPwError)}`
									}),
									pwTouched.current && currentPassword && !currentPwError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line text-sm" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowCurrentPass((p) => !p),
										className: "absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: showCurrentPass ? "ri-eye-off-line text-sm" : "ri-eye-line text-sm" })
									})
								]
							}),
							currentPwError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-1.5 text-xs text-rose-500 mt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-xs flex-shrink-0" }), currentPwError]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5",
								children: ["Nueva contraseña ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-rose-500",
									children: "*"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${newPwError ? "text-rose-400" : "text-zinc-400"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-lock-password-line text-sm" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: showNewPass ? "text" : "password",
										value: newPassword,
										onChange: (e) => {
											setNewPassword(e.target.value);
											touchPw("newPw");
										},
										onBlur: () => touchPw("newPw"),
										placeholder: "Mínimo 8 caracteres",
										autoComplete: "new-password",
										className: `${inputBase} pl-10 pr-14 ${getPwClass(!!newPwError, pwTouched.newPw && !newPwError && newPassword.length >= 8)}`
									}),
									pwTouched.newPw && !newPwError && newPassword.length >= 8 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line text-sm" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowNewPass((p) => !p),
										className: "absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: showNewPass ? "ri-eye-off-line text-sm" : "ri-eye-line text-sm" })
									})
								]
							}),
							newPwError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-1.5 text-xs text-rose-500 mt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-xs flex-shrink-0" }), newPwError]
							}),
							newPassword.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mt-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-1 flex-1",
									children: [
										1,
										2,
										3
									].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-1 flex-1 rounded-full transition-all ${i <= pwStrength ? pwStrengthColor[pwStrength] : "bg-zinc-200 dark:bg-zinc-700"}` }, i))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-xs font-medium ${pwStrength === 1 ? "text-rose-400" : pwStrength === 2 ? "text-amber-400" : "text-emerald-400"}`,
									children: pwStrengthLabel[pwStrength]
								})]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5",
								children: ["Confirmar contraseña ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-rose-500",
									children: "*"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${confirmPwError ? "text-rose-400" : "text-zinc-400"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-shield-check-line text-sm" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: showConfirmPass ? "text" : "password",
										value: confirmPassword,
										onChange: (e) => {
											setConfirmPassword(e.target.value);
											touchPw("confirm");
										},
										onBlur: () => touchPw("confirm"),
										placeholder: "Repite la nueva contraseña",
										autoComplete: "new-password",
										className: `${inputBase} pl-10 pr-14 ${getPwClass(!!confirmPwError, pwTouched.confirm && !confirmPwError && !!confirmPassword && confirmPassword === newPassword)}`
									}),
									pwTouched.confirm && !confirmPwError && confirmPassword && confirmPassword === newPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line text-sm" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowConfirmPass((p) => !p),
										className: "absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: showConfirmPass ? "ri-eye-off-line text-sm" : "ri-eye-line text-sm" })
									})
								]
							}),
							confirmPwError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-1.5 text-xs text-rose-500 mt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-xs flex-shrink-0" }), confirmPwError]
							})
						] }),
						pwError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-rose-500 text-sm flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-rose-600 dark:text-rose-400",
								children: pwError
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleChangePassword,
							disabled: pwSaving,
							className: `self-start flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap disabled:opacity-60 ${pwSaved ? "bg-emerald-500 text-white" : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90"}`,
							children: pwSaving ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-loader-4-line animate-spin" }), " Guardando..."] }) : pwSaved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-checkbox-circle-line" }), " Contraseña actualizada"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-key-2-line" }), " Cambiar contraseña"] })
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsCard, {
				title: "Sesión activa",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-computer-line text-zinc-500" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-zinc-900 dark:text-white",
							children: "Navegador web"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-zinc-500",
							children: "Sesión actual · Activa ahora"
						})] })]
					}), !showLogoutConfirm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setShowLogoutConfirm(true),
						className: "flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-logout-box-line" }), "Cerrar sesión"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowLogoutConfirm(false),
							className: "px-3 py-2 text-sm text-zinc-500 cursor-pointer whitespace-nowrap",
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleLogout,
							className: "px-4 py-2 rounded-xl bg-rose-500 text-white text-sm font-semibold cursor-pointer whitespace-nowrap",
							children: "Confirmar"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsCard, {
				title: "Zona de peligro",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-zinc-900 dark:text-white",
							children: "Restablecer configuración"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-zinc-500 dark:text-zinc-400 mt-0.5",
							children: "Vuelve a los ajustes predeterminados de la app."
						})] }), !showResetConfirm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowResetConfirm(true),
							className: "px-4 py-2 rounded-xl border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-colors cursor-pointer whitespace-nowrap",
							children: "Restablecer"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowResetConfirm(false),
								className: "px-3 py-2 text-sm text-zinc-500 cursor-pointer whitespace-nowrap",
								children: "Cancelar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleReset,
								className: "px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold cursor-pointer whitespace-nowrap",
								children: "Confirmar"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-rose-700 dark:text-rose-400",
							children: "Eliminar cuenta"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-zinc-500 dark:text-zinc-400 mt-0.5",
							children: "Esta acción es irreversible. Se borrarán todos tus datos."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "px-4 py-2 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-sm font-medium hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors cursor-pointer whitespace-nowrap",
							children: "Eliminar"
						})]
					})]
				})
			})
		]
	});
}
//#endregion
//#region src/pages/settings/page.tsx
var SECTION_TITLES = {
	appearance: {
		title: "Apariencia",
		subtitle: "Personaliza el aspecto visual de Vaultly."
	},
	categories: {
		title: "Categorías",
		subtitle: "Elige qué categorías aparecen en tu tracker."
	},
	language: {
		title: "Idioma",
		subtitle: "Selecciona el idioma de la interfaz."
	},
	notifications: {
		title: "Notificaciones",
		subtitle: "Gestiona tus alertas y avisos."
	},
	privacy: {
		title: "Privacidad",
		subtitle: "Controla la visibilidad de tu perfil y tracker."
	},
	account: {
		title: "Cuenta",
		subtitle: "Gestiona tu información personal y seguridad."
	}
};
var PUBLIC_SECTIONS = ["appearance", "language"];
var PRIVATE_SECTIONS = [
	"notifications",
	"privacy",
	"account"
];
function SectionContent({ section }) {
	switch (section) {
		case "appearance": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppearanceSection, {});
		case "categories": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoriesSection, {});
		case "language": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageSection, {});
		case "notifications": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsSection, {});
		case "privacy": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrivacySection, {});
		case "account": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountSection, {});
	}
}
function SettingsPage() {
	const { isLoggedIn } = useAuth();
	const [activeSection, setActiveSection] = (0, import_react.useState)("appearance");
	const availableSections = isLoggedIn ? [...PUBLIC_SECTIONS, ...PRIVATE_SECTIONS] : PUBLIC_SECTIONS;
	(0, import_react.useEffect)(() => {
		if (!isLoggedIn && !PUBLIC_SECTIONS.includes(activeSection)) setActiveSection("appearance");
	}, [activeSection, isLoggedIn]);
	const { title, subtitle } = SECTION_TITLES[activeSection];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-zinc-50 dark:bg-zinc-950",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoHead, {
				title: "Configuración — Vaultly",
				description: "Personaliza tu experiencia en Vaultly: apariencia, categorías, idioma, notificaciones y privacidad.",
				canonical: "/settings",
				noIndex: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "pt-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-screen-xl mx-auto px-4 md:px-6 py-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl md:text-4xl font-black text-zinc-900 dark:text-white",
							style: { fontFamily: "'Space Grotesk', sans-serif" },
							children: "Configuración"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-zinc-500 dark:text-zinc-400 mt-1",
							children: "Personaliza tu experiencia en Vaultly"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col lg:flex-row gap-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsSidebar, {
							active: activeSection,
							onChange: setActiveSection,
							items: availableSections
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl font-bold text-zinc-900 dark:text-white",
									style: { fontFamily: "'Space Grotesk', sans-serif" },
									children: title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-zinc-500 dark:text-zinc-400 mt-0.5",
									children: subtitle
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionContent, { section: activeSection })]
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { SettingsPage as default };

//# sourceMappingURL=page-DaGk0C0P.js.map