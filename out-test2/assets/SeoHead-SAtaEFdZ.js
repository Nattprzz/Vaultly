import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { h as require_react } from "./index-cosAM6zi.js";
//#region src/lib/site.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function getSiteUrl() {
	const configured = "http://localhost:5173";
	const fallback = globalThis.location?.origin ?? "http://localhost:5173";
	return (configured ?? fallback).replace(/\/$/, "");
}
//#endregion
//#region src/components/feature/SeoHead.tsx
function SeoHead({ title, description, keywords, canonical, ogType = "website", ogImage, jsonLd, noIndex = false }) {
	const siteUrl = getSiteUrl();
	const resolvedCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
	const resolvedImage = ogImage ?? `${siteUrl}/og-image.png`;
	(0, import_react.useEffect)(() => {
		document.title = title;
		const setMeta = (selector, attr, value) => {
			let el = document.querySelector(selector);
			if (!el) {
				el = document.createElement("meta");
				const [attrName, attrVal] = selector.replace("meta[", "").replace("]", "").split("=\"");
				el.setAttribute(attrName, attrVal.replace("\"", ""));
				document.head.appendChild(el);
			}
			el.setAttribute(attr, value);
		};
		setMeta("meta[name=\"description\"]", "content", description);
		if (keywords) setMeta("meta[name=\"keywords\"]", "content", keywords);
		setMeta("meta[name=\"robots\"]", "content", noIndex ? "noindex, nofollow" : "index, follow");
		let canonicalEl = document.querySelector("link[rel=\"canonical\"]");
		if (!canonicalEl) {
			canonicalEl = document.createElement("link");
			canonicalEl.rel = "canonical";
			document.head.appendChild(canonicalEl);
		}
		canonicalEl.href = resolvedCanonical;
		setMeta("meta[property=\"og:title\"]", "content", title);
		setMeta("meta[property=\"og:description\"]", "content", description);
		setMeta("meta[property=\"og:type\"]", "content", ogType);
		setMeta("meta[property=\"og:url\"]", "content", resolvedCanonical);
		setMeta("meta[property=\"og:image\"]", "content", resolvedImage);
		setMeta("meta[name=\"twitter:title\"]", "content", title);
		setMeta("meta[name=\"twitter:description\"]", "content", description);
		setMeta("meta[name=\"twitter:image\"]", "content", resolvedImage);
		document.querySelectorAll("script[data-seo-jsonld]").forEach((s) => s.remove());
		if (jsonLd) (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).forEach((schema) => {
			const script = document.createElement("script");
			script.type = "application/ld+json";
			script.setAttribute("data-seo-jsonld", "true");
			script.textContent = JSON.stringify(schema);
			document.head.appendChild(script);
		});
		return () => {
			document.title = "Vaultly - Trackea películas, series, libros, videojuegos y anime";
		};
	}, [
		title,
		description,
		keywords,
		resolvedCanonical,
		ogType,
		resolvedImage,
		noIndex,
		jsonLd
	]);
	return null;
}
//#endregion
export { getSiteUrl as n, SeoHead as t };

//# sourceMappingURL=SeoHead-SAtaEFdZ.js.map