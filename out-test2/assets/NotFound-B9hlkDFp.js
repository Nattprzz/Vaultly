import { d as useLocation, s as require_jsx_runtime } from "./index-cosAM6zi.js";
//#region src/pages/NotFound.tsx
var import_jsx_runtime = require_jsx_runtime();
function NotFound() {
	const location = useLocation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex flex-col items-center justify-center h-screen text-center px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "absolute bottom-0 text-9xl md:text-[12rem] font-black text-gray-50 select-none pointer-events-none z-0",
			children: "404"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl md:text-2xl font-semibold mt-6",
					children: "This page has not been generated"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-base text-gray-400 font-mono",
					children: location.pathname
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-lg md:text-xl text-gray-500",
					children: "Tell me more about this page, so I can generate it"
				})
			]
		})]
	});
}
//#endregion
export { NotFound as default };

//# sourceMappingURL=NotFound-B9hlkDFp.js.map