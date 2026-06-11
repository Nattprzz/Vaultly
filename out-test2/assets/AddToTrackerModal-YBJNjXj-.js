import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { h as require_react, s as require_jsx_runtime } from "./index-cosAM6zi.js";
//#region src/pages/catalog/components/AddToTrackerModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var STATUS_OPTIONS = [
	{
		value: "pending",
		label: "Pendiente",
		icon: "ri-bookmark-line",
		color: "text-zinc-500"
	},
	{
		value: "in_progress",
		label: "En progreso",
		icon: "ri-loader-4-line",
		color: "text-amber-500"
	},
	{
		value: "completed",
		label: "Completado",
		icon: "ri-checkbox-circle-line",
		color: "text-emerald-500"
	},
	{
		value: "dropped",
		label: "Abandonado",
		icon: "ri-close-circle-line",
		color: "text-rose-500"
	}
];
function AddToTrackerModal({ itemId, category, title, cover, existing, onSave, onRemove, onClose }) {
	const [status, setStatus] = (0, import_react.useState)(existing?.status ?? "pending");
	const [rating, setRating] = (0, import_react.useState)(existing?.rating ?? null);
	const [review, setReview] = (0, import_react.useState)(existing?.review ?? "");
	const [hoverRating, setHoverRating] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "";
		};
	}, []);
	const handleSave = () => {
		onSave(status, rating, review);
		onClose();
	};
	const displayRating = hoverRating ?? rating;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4",
		onClick: (e) => {
			if (e.target === e.currentTarget) onClose();
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4 p-5 border-b border-zinc-100 dark:border-zinc-800",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-16 rounded-lg overflow-hidden flex-shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: cover,
								alt: title,
								className: "w-full h-full object-cover object-top"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-zinc-400 mb-0.5",
								children: existing ? "Actualizar en tracker" : "Añadir al tracker"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-zinc-900 dark:text-white text-sm leading-tight line-clamp-2",
								children: title
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onClose,
							className: "w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer flex-shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-close-line" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 flex flex-col gap-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3",
							children: "Estado"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2",
							children: STATUS_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setStatus(opt.value),
								className: `flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${status === opt.value ? "border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${opt.icon} ${status === opt.value ? "" : opt.color}` }), opt.label]
							}, opt.value))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider",
									children: "Puntuación"
								}), rating !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setRating(null),
									className: "text-xs text-zinc-400 hover:text-zinc-600 cursor-pointer",
									children: "Quitar"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1",
								children: Array.from({ length: 10 }, (_, i) => i + 1).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onMouseEnter: () => setHoverRating(n),
									onMouseLeave: () => setHoverRating(null),
									onClick: () => setRating(n),
									className: "flex-1 flex items-center justify-center py-2 rounded-lg transition-colors cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950/30",
									children: displayRating !== null && n <= displayRating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-base text-amber-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-line text-base text-zinc-300 dark:text-zinc-600" })
								}, n))
							}),
							displayRating !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-center text-sm font-semibold text-amber-500 mt-1",
								children: [displayRating, "/10"]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3",
								children: ["Reseña personal ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "normal-case font-normal text-zinc-400",
									children: "(opcional)"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: review,
								onChange: (e) => setReview(e.target.value.slice(0, 500)),
								placeholder: "¿Qué te pareció? Escribe tu opinión...",
								rows: 3,
								className: "w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-right text-xs text-zinc-400 mt-1",
								children: [review.length, "/500"]
							})
						] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 px-5 pb-5",
					children: [existing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							onRemove();
							onClose();
						},
						className: "flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-500 text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer whitespace-nowrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-delete-bin-line" }), "Eliminar"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleSave,
						className: "flex-1 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap",
						children: existing ? "Actualizar" : "Añadir al tracker"
					})]
				})
			]
		})]
	});
}
//#endregion
export { AddToTrackerModal as t };

//# sourceMappingURL=AddToTrackerModal-YBJNjXj-.js.map