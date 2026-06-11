import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { h as require_react } from "./index-cosAM6zi.js";
//#region src/hooks/useTheme.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var STORAGE_KEY = "vaultly-theme";
function useTheme() {
	const [theme, setTheme] = (0, import_react.useState)(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) return stored;
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	});
	(0, import_react.useEffect)(() => {
		const root = document.documentElement;
		if (theme === "dark") root.classList.add("dark");
		else root.classList.remove("dark");
		localStorage.setItem(STORAGE_KEY, theme);
	}, [theme]);
	const toggleTheme = () => setTheme((prev) => prev === "dark" ? "light" : "dark");
	return {
		theme,
		toggleTheme
	};
}
//#endregion
export { useTheme as t };

//# sourceMappingURL=useTheme-CjO9s6QO.js.map