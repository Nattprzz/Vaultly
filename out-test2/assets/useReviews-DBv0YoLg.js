import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { c as useAuth, h as require_react, l as supabase, t as useCategories } from "./index-cosAM6zi.js";
//#region src/hooks/useReviews.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function getCatMeta(catId, categories) {
	return categories.find((c) => c.id === catId) ?? {
		label: catId,
		icon: "ri-stack-line",
		accent: "#6b7280"
	};
}
function formatDate(dateStr) {
	return new Date(dateStr).toLocaleDateString("es-ES", {
		day: "numeric",
		month: "long",
		year: "numeric"
	});
}
function useMyReviews() {
	const { user } = useAuth();
	const categories = useCategories();
	const [reviews, setReviews] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const load = (0, import_react.useCallback)(async () => {
		if (!user) return;
		setLoading(true);
		const { data } = await supabase.from("user_item_tracking").select("id, user_id, item_slug, category, rating, review, updated_at").eq("user_id", user.id).not("review", "is", null).neq("review", "").not("rating", "is", null).order("updated_at", { ascending: false });
		if (data) {
			const slugs = [...new Set(data.map((r) => r.item_slug).filter(Boolean))];
			const catalogBySlug = /* @__PURE__ */ new Map();
			if (slugs.length > 0) {
				const { data: catalogRows } = await supabase.from("catalog_items").select("slug, title, image_url, cover_url").in("slug", slugs);
				catalogRows?.forEach((item) => catalogBySlug.set(item.slug, item));
			}
			setReviews(data.map((r) => {
				const meta = getCatMeta(r.category ?? "", categories);
				const item = catalogBySlug.get(r.item_slug ?? "");
				return {
					id: r.id,
					user_id: r.user_id,
					item_slug: r.item_slug ?? r.id,
					category: r.category ?? "",
					categoryLabel: meta.label,
					categoryIcon: meta.icon,
					categoryAccent: meta.accent,
					rating: Number(r.rating),
					review: r.review,
					updated_at: r.updated_at,
					title: item?.title ?? String(r.item_slug ?? "").replace(/-/g, " "),
					cover: item?.image_url ?? item?.cover_url ?? ""
				};
			}));
		}
		setLoading(false);
	}, [user, categories]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	return {
		reviews,
		loading,
		refresh: load
	};
}
function usePublicReviews(userId, privacy) {
	const categories = useCategories();
	const [reviews, setReviews] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [hidden, setHidden] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!userId || !privacy?.is_public || !privacy.show_reviews) {
			setReviews([]);
			setHidden(Boolean(userId));
			setLoading(false);
			return;
		}
		const load = async () => {
			setLoading(true);
			setHidden(false);
			const { data } = await supabase.from("user_item_tracking").select("id, user_id, item_slug, category, rating, review, updated_at").eq("user_id", userId).not("review", "is", null).neq("review", "").not("rating", "is", null).order("updated_at", { ascending: false });
			if (data) {
				const slugs = [...new Set(data.map((r) => r.item_slug).filter(Boolean))];
				const catalogBySlug = /* @__PURE__ */ new Map();
				if (slugs.length > 0) {
					const { data: catalogRows } = await supabase.from("catalog_items").select("slug, title, image_url, cover_url").in("slug", slugs);
					catalogRows?.forEach((item) => catalogBySlug.set(item.slug, item));
				}
				setReviews(data.map((r) => {
					const meta = getCatMeta(r.category ?? "", categories);
					const item = catalogBySlug.get(r.item_slug ?? "");
					return {
						id: r.id,
						user_id: r.user_id,
						item_slug: r.item_slug ?? r.id,
						category: r.category ?? "",
						categoryLabel: meta.label,
						categoryIcon: meta.icon,
						categoryAccent: meta.accent,
						rating: privacy.show_ratings ? Number(r.rating) : null,
						review: r.review,
						updated_at: r.updated_at,
						title: item?.title ?? String(r.item_slug ?? "").replace(/-/g, " "),
						cover: item?.image_url ?? item?.cover_url ?? ""
					};
				}));
			}
			setLoading(false);
		};
		load();
	}, [
		userId,
		privacy?.is_public,
		privacy?.show_reviews,
		privacy?.show_ratings,
		categories
	]);
	return {
		reviews,
		loading,
		hidden
	};
}
function useItemReviews(itemSlug) {
	const categories = useCategories();
	const [reviews, setReviews] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!itemSlug) return;
		const load = async () => {
			setLoading(true);
			const { data: trackingData } = await supabase.from("user_item_tracking").select("id, user_id, item_slug, category, rating, review, updated_at").eq("item_slug", itemSlug).not("review", "is", null).neq("review", "").not("rating", "is", null).order("updated_at", { ascending: false });
			if (!trackingData || trackingData.length === 0) {
				setReviews([]);
				setLoading(false);
				return;
			}
			const userIds = [...new Set(trackingData.map((r) => r.user_id))];
			const { data: profiles } = await supabase.from("profiles").select("id, display_name, initials, is_public, show_reviews, show_ratings").in("id", userIds);
			const profileMap = {};
			profiles?.filter((p) => p.is_public && p.show_reviews).forEach((p) => {
				profileMap[p.id] = {
					display_name: p.display_name,
					initials: p.initials,
					show_ratings: p.show_ratings
				};
			});
			const meta = getCatMeta(trackingData[0]?.category ?? "", categories);
			const { data: catalogItem } = await supabase.from("catalog_items").select("slug, title, image_url, cover_url").eq("slug", itemSlug).maybeSingle();
			setReviews(trackingData.filter((r) => profileMap[r.user_id]).map((r) => ({
				id: r.id,
				user_id: r.user_id,
				item_slug: r.item_slug ?? itemSlug,
				category: r.category ?? "",
				categoryLabel: meta.label,
				categoryIcon: meta.icon,
				categoryAccent: meta.accent,
				rating: profileMap[r.user_id]?.show_ratings ? Number(r.rating) : null,
				review: r.review,
				updated_at: r.updated_at,
				title: catalogItem?.title ?? itemSlug.replace(/-/g, " "),
				cover: catalogItem?.image_url ?? catalogItem?.cover_url ?? "",
				display_name: profileMap[r.user_id]?.display_name ?? "Usuario",
				initials: profileMap[r.user_id]?.initials ?? "??"
			})));
			setLoading(false);
		};
		load();
	}, [itemSlug, categories]);
	return {
		reviews,
		loading
	};
}
//#endregion
export { usePublicReviews as i, useItemReviews as n, useMyReviews as r, formatDate as t };

//# sourceMappingURL=useReviews-DBv0YoLg.js.map