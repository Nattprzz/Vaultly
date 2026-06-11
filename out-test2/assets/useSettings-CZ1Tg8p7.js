import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { c as useAuth, h as require_react, l as supabase } from "./index-cosAM6zi.js";
//#region src/hooks/useSettings.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var SETTINGS_STORAGE_KEY = "vaultly-settings";
var DEFAULT_SETTINGS = {
	language: "es",
	activeCategories: [
		"videojuegos",
		"peliculas",
		"series",
		"libros"
	],
	notifications: {
		newReleases: true,
		communityActivity: false,
		weeklyDigest: true,
		trackerReminders: true
	},
	privacy: {
		publicProfile: true,
		shareTracker: true,
		showRatings: true,
		showReviews: true
	}
};
function loadSettings() {
	try {
		const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
		if (raw) return {
			...DEFAULT_SETTINGS,
			...JSON.parse(raw)
		};
	} catch {}
	return DEFAULT_SETTINGS;
}
function saveSettings(s) {
	localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(s));
}
function useSettings() {
	const { user, isLoggedIn } = useAuth();
	const [settings, setSettings] = (0, import_react.useState)(loadSettings);
	(0, import_react.useEffect)(() => {
		if (!isLoggedIn || !user) return;
		supabase.from("user_tracker_settings").select("selected_categories").eq("user_id", user.id).maybeSingle().then(({ data }) => {
			const selected = data?.selected_categories;
			if (!Array.isArray(selected) || selected.length === 0) return;
			setSettings((prev) => {
				const next = {
					...prev,
					activeCategories: selected
				};
				saveSettings(next);
				return next;
			});
		});
	}, [isLoggedIn, user]);
	const persistActiveCategories = (0, import_react.useCallback)(async (activeCategories) => {
		if (!user) return;
		await supabase.from("user_tracker_settings").upsert({
			user_id: user.id,
			selected_categories: activeCategories,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}, { onConflict: "user_id" });
	}, [user]);
	return {
		settings,
		update: (0, import_react.useCallback)((key, value) => {
			setSettings((prev) => {
				const next = {
					...prev,
					[key]: value
				};
				saveSettings(next);
				return next;
			});
		}, []),
		updateNested: (0, import_react.useCallback)((section, field, value) => {
			setSettings((prev) => {
				const next = {
					...prev,
					[section]: {
						...prev[section],
						[field]: value
					}
				};
				saveSettings(next);
				return next;
			});
		}, []),
		toggleCategory: (0, import_react.useCallback)((catId) => {
			setSettings((prev) => {
				const has = prev.activeCategories.includes(catId);
				if (has && prev.activeCategories.length <= 1) return prev;
				const activeCategories = has ? prev.activeCategories.filter((c) => c !== catId) : [...prev.activeCategories, catId];
				const next = {
					...prev,
					activeCategories
				};
				saveSettings(next);
				persistActiveCategories(activeCategories);
				return next;
			});
		}, [persistActiveCategories]),
		reset: (0, import_react.useCallback)(() => {
			saveSettings(DEFAULT_SETTINGS);
			setSettings(DEFAULT_SETTINGS);
			persistActiveCategories(DEFAULT_SETTINGS.activeCategories);
		}, [persistActiveCategories])
	};
}
//#endregion
export { useSettings as n, SETTINGS_STORAGE_KEY as t };

//# sourceMappingURL=useSettings-CZ1Tg8p7.js.map