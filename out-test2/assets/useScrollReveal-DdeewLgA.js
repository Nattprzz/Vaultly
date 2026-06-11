import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { h as require_react } from "./index-cosAM6zi.js";
//#region src/hooks/useScrollReveal.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* Returns a ref to attach to any element.
* When the element enters the viewport, the class `sr-visible` is added.
* Pair with CSS: opacity-0 translate-y-4 → opacity-100 translate-y-0
*/
function useScrollReveal(options = {}) {
	const ref = (0, import_react.useRef)(null);
	const { threshold = .1, rootMargin = "0px 0px -40px 0px", once = true } = options;
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				el.classList.add("sr-visible");
				if (once) observer.disconnect();
			} else if (!once) el.classList.remove("sr-visible");
		}, {
			threshold,
			rootMargin
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, [
		threshold,
		rootMargin,
		once
	]);
	return ref;
}
//#endregion
export { useScrollReveal as t };

//# sourceMappingURL=useScrollReveal-DdeewLgA.js.map