import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { h as require_react, l as supabase } from "./index-cosAM6zi.js";
//#region src/hooks/useItemEntities.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var ROLE_CONFIG = {
	director: {
		label: "Director/a",
		icon: "ri-movie-line",
		color: "#f43f5e",
		priority: 1
	},
	developer: {
		label: "Desarrollador",
		icon: "ri-code-box-line",
		color: "#8b5cf6",
		priority: 1
	},
	author: {
		label: "Autor/a",
		icon: "ri-book-open-line",
		color: "#10b981",
		priority: 1
	},
	artist: {
		label: "Artista",
		icon: "ri-music-line",
		color: "#ec4899",
		priority: 1
	},
	publisher: {
		label: "Publisher",
		icon: "ri-building-line",
		color: "#6366f1",
		priority: 2
	},
	actor: {
		label: "Reparto",
		icon: "ri-user-star-line",
		color: "#f59e0b",
		priority: 3
	},
	creator: {
		label: "Creador/a",
		icon: "ri-lightbulb-line",
		color: "#0ea5e9",
		priority: 2
	},
	studio: {
		label: "Estudio",
		icon: "ri-film-line",
		color: "#14b8a6",
		priority: 2
	}
};
var memCache = /* @__PURE__ */ new Map();
function useItemEntities(itemId) {
	const [entities, setEntities] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!itemId) {
			setEntities([]);
			return;
		}
		if (memCache.has(itemId)) {
			setEntities(memCache.get(itemId));
			return;
		}
		let cancelled = false;
		setLoading(true);
		setError(null);
		(async () => {
			try {
				const { data, error: dbError } = await supabase.from("item_entities").select(`
            role,
            entities (
              id,
              name,
              slug,
              type,
              image,
              bio
            )
          `).eq("item_id", itemId);
				if (dbError) throw dbError;
				const result = (data ?? []).filter((row) => row.entities).map((row) => ({
					id: row.entities.id,
					name: row.entities.name,
					slug: row.entities.slug,
					type: row.entities.type,
					image: row.entities.image ?? null,
					bio: row.entities.bio ?? null,
					role: row.role
				}));
				result.sort((a, b) => {
					return (ROLE_CONFIG[a.role]?.priority ?? 99) - (ROLE_CONFIG[b.role]?.priority ?? 99);
				});
				if (!cancelled) {
					memCache.set(itemId, result);
					setEntities(result);
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
	}, [itemId]);
	return {
		entities,
		loading,
		error
	};
}
//#endregion
export { useItemEntities as n, ROLE_CONFIG as t };

//# sourceMappingURL=useItemEntities-kJeAlpQ0.js.map