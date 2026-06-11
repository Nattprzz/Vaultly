import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { f as useNavigate, h as require_react, l as supabase, s as require_jsx_runtime, u as Link } from "./index-cosAM6zi.js";
import { t as SeoHead } from "./SeoHead-SAtaEFdZ.js";
import { t as useTheme } from "./useTheme-CjO9s6QO.js";
//#region src/pages/auth/reset-password/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function validatePassword(val) {
	if (!val) return "La contraseña es obligatoria.";
	if (val.length < 8) return "Mínimo 8 caracteres.";
	return "";
}
function validateConfirm(pass, confirm) {
	if (!confirm) return "Confirma tu nueva contraseña.";
	if (pass !== confirm) return "Las contraseñas no coinciden.";
	return "";
}
function ResetPasswordPage() {
	const navigate = useNavigate();
	const { theme, toggleTheme } = useTheme();
	const [pageState, setPageState] = (0, import_react.useState)("loading");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [showPass, setShowPass] = (0, import_react.useState)(false);
	const [showConfirm, setShowConfirm] = (0, import_react.useState)(false);
	const [touched, setTouched] = (0, import_react.useState)({
		password: false,
		confirm: false
	});
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [serverError, setServerError] = (0, import_react.useState)("");
	const touch = (field) => setTouched((prev) => ({
		...prev,
		[field]: true
	}));
	const passwordError = validatePassword(password);
	const confirmError = validateConfirm(password, confirm);
	(0, import_react.useEffect)(() => {
		const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
			if (event === "PASSWORD_RECOVERY") setPageState("ready");
			else if (event === "SIGNED_IN") setPageState((prev) => prev === "loading" ? "ready" : prev);
		});
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (session) setPageState("ready");
			else {
				const t = setTimeout(() => {
					setPageState((prev) => prev === "loading" ? "expired" : prev);
				}, 2e3);
				return () => clearTimeout(t);
			}
		});
		return () => subscription.unsubscribe();
	}, []);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setServerError("");
		setTouched({
			password: true,
			confirm: true
		});
		if (passwordError || confirmError) return;
		setLoading(true);
		try {
			const { error } = await supabase.auth.updateUser({ password });
			if (error) {
				setServerError(error.message);
				return;
			}
			setPageState("success");
		} catch {
			setServerError("Error inesperado. Inténtalo de nuevo.");
		} finally {
			setLoading(false);
		}
	};
	const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
	const strengthLabel = [
		"",
		"Débil",
		"Media",
		"Fuerte"
	];
	const strengthColor = [
		"",
		"bg-rose-400",
		"bg-amber-400",
		"bg-emerald-400"
	];
	const inputBase = "w-full py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none transition-colors";
	const inputNormal = "border-zinc-200 dark:border-zinc-700 focus:border-violet-400 dark:focus:border-violet-500";
	const inputErr = "border-rose-400 dark:border-rose-500 focus:border-rose-400 dark:focus:border-rose-500 bg-rose-50/40 dark:bg-rose-950/10";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex bg-white dark:bg-zinc-950",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoHead, {
				title: "Restablecer contraseña — Vaultly",
				description: "Establece una nueva contraseña para tu cuenta de Vaultly.",
				canonical: "/auth/reset-password",
				noIndex: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden lg:flex flex-col flex-1 relative overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "https://readdy.ai/api/search-image?query=abstract%20dark%20cinematic%20collage%20of%20film%20reels%20books%20vinyl%20records%20game%20controllers%20and%20anime%20art%20arranged%20in%20a%20beautiful%20grid%20pattern%20with%20deep%20violet%20and%20rose%20gradient%20overlay%20on%20dark%20background%20moody%20atmospheric%20editorial%20photography%20style&width=800&height=1000&seq=auth-bg-01&orientation=portrait",
						alt: "Vaultly background",
						className: "absolute inset-0 w-full h-full object-cover object-top"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-zinc-950/80 via-violet-950/60 to-zinc-950/90" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 flex flex-col h-full p-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								className: "flex items-center gap-2.5 cursor-pointer w-fit",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-archive-2-line text-white" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-xl text-white tracking-tight",
									style: { fontFamily: "'Space Grotesk', sans-serif" },
									children: "Vaultly"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 flex flex-col justify-center gap-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-shield-keyhole-line text-3xl text-violet-300" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-3xl font-bold text-white leading-tight mb-3",
										style: { fontFamily: "'Space Grotesk', sans-serif" },
										children: [
											"Nueva contraseña,",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "bg-gradient-to-r from-violet-400 to-rose-400 bg-clip-text text-transparent",
												children: "acceso seguro."
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-zinc-400 text-sm leading-relaxed max-w-xs",
										children: "Elige una contraseña fuerte para proteger tu vault. Te recomendamos usar al menos 10 caracteres con letras, números y símbolos."
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-col gap-3 max-w-xs",
										children: [
											{
												icon: "ri-lock-2-line",
												text: "Mínimo 8 caracteres"
											},
											{
												icon: "ri-eye-off-line",
												text: "Nunca compartimos tu contraseña"
											},
											{
												icon: "ri-shield-check-line",
												text: "Cifrado de extremo a extremo"
											}
										].map((tip) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${tip.icon} text-violet-300 text-sm` })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-zinc-400 text-sm",
												children: tip.text
											})]
										}, tip.text))
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-zinc-600 text-xs",
								children: [
									"© 2026 Vaultly · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#",
										rel: "nofollow",
										className: "hover:text-zinc-400 transition-colors",
										children: "Privacidad"
									}),
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#",
										rel: "nofollow",
										className: "hover:text-zinc-400 transition-colors",
										children: "Términos"
									})
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col w-full lg:w-[480px] flex-shrink-0 relative overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2 cursor-pointer lg:invisible",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-archive-2-line text-white text-xs" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-zinc-900 dark:text-white text-sm",
							style: { fontFamily: "'Space Grotesk', sans-serif" },
							children: "Vaultly"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: toggleTheme,
						className: "ml-auto w-9 h-9 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: theme === "dark" ? "ri-sun-line" : "ri-moon-line" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 flex flex-col justify-center px-8 md:px-12 py-6",
					children: [
						pageState === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center gap-4 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-12 h-12 rounded-full border-2 border-violet-200 dark:border-violet-800 border-t-violet-500 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-zinc-500",
								children: "Verificando enlace..."
							})]
						}),
						pageState === "expired" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center gap-4 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-time-line text-3xl text-rose-500" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-xl font-bold text-zinc-900 dark:text-white mb-1.5",
									style: { fontFamily: "'Space Grotesk', sans-serif" },
									children: "Enlace expirado"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-zinc-500 leading-relaxed",
									children: "Este enlace de recuperación ya no es válido o ha caducado. Los enlaces tienen una validez de 1 hora."
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/auth",
									className: "w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-rose-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap flex items-center justify-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-refresh-line" }), "Solicitar nuevo enlace"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/",
									className: "w-full py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center",
									children: "Volver al inicio"
								})]
							})]
						}),
						pageState === "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center gap-4 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-shield-check-line text-3xl text-emerald-500" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-xl font-bold text-zinc-900 dark:text-white mb-1.5",
									style: { fontFamily: "'Space Grotesk', sans-serif" },
									children: "¡Contraseña actualizada!"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-zinc-500 leading-relaxed",
									children: "Tu contraseña se ha restablecido correctamente. Ya puedes iniciar sesión con tu nueva contraseña."
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => navigate("/dashboard"),
								className: "w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-rose-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap flex items-center justify-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-dashboard-line" }), "Ir a mi dashboard"]
							})]
						}),
						pageState === "ready" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-shield-keyhole-line text-violet-500 text-xs" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-500",
										children: "Restablecimiento de contraseña"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-2xl font-bold text-zinc-900 dark:text-white mb-1.5",
									style: { fontFamily: "'Space Grotesk', sans-serif" },
									children: "Nueva contraseña"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-zinc-500",
									children: "Elige una contraseña segura para tu cuenta."
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							className: "flex flex-col gap-5",
							noValidate: true,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider",
											children: ["Nueva contraseña ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-rose-500",
												children: "*"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: `absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${touched.password && passwordError ? "text-rose-400" : "text-zinc-400"}`,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-lock-line text-sm" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: showPass ? "text" : "password",
													value: password,
													onChange: (e) => {
														setPassword(e.target.value);
														touch("password");
														setServerError("");
													},
													onBlur: () => touch("password"),
													placeholder: "Mínimo 8 caracteres",
													autoComplete: "new-password",
													autoFocus: true,
													className: `${inputBase} pl-10 pr-11 ${touched.password && passwordError ? inputErr : inputNormal}`
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setShowPass((p) => !p),
													className: "absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: showPass ? "ri-eye-off-line text-sm" : "ri-eye-line text-sm" })
												})
											]
										}),
										touched.password && passwordError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-center gap-1.5 text-xs text-rose-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-xs flex-shrink-0" }), passwordError]
										}),
										password.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 mt-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex gap-1 flex-1",
												children: [
													1,
													2,
													3
												].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor[strength] : "bg-zinc-200 dark:bg-zinc-700"}` }, i))
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-xs font-medium ${strength === 1 ? "text-rose-400" : strength === 2 ? "text-amber-400" : "text-emerald-400"}`,
												children: strengthLabel[strength]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider",
											children: ["Confirmar contraseña ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-rose-500",
												children: "*"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: `absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${touched.confirm && confirmError ? "text-rose-400" : "text-zinc-400"}`,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-lock-2-line text-sm" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: showConfirm ? "text" : "password",
													value: confirm,
													onChange: (e) => {
														setConfirm(e.target.value);
														touch("confirm");
														setServerError("");
													},
													onBlur: () => touch("confirm"),
													placeholder: "Repite tu contraseña",
													autoComplete: "new-password",
													className: `${inputBase} pl-10 pr-11 ${touched.confirm && confirmError ? inputErr : inputNormal}`
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setShowConfirm((p) => !p),
													className: "absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: showConfirm ? "ri-eye-off-line text-sm" : "ri-eye-line text-sm" })
												})
											]
										}),
										touched.confirm && confirmError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-center gap-1.5 text-xs text-rose-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-xs flex-shrink-0" }), confirmError]
										}),
										touched.confirm && !confirmError && confirm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-center gap-1.5 text-xs text-emerald-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-checkbox-circle-line text-xs flex-shrink-0" }), "Las contraseñas coinciden"]
										})
									]
								}),
								serverError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-rose-500 text-sm flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-rose-600 dark:text-rose-400",
										children: serverError
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: loading,
									className: "w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-rose-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap disabled:opacity-60 flex items-center justify-center gap-2",
									children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-loader-4-line animate-spin" }), "Guardando contraseña..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-shield-check-line" }), "Establecer nueva contraseña"] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-center text-sm text-zinc-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/auth",
										className: "text-violet-500 font-semibold hover:text-violet-600 transition-colors cursor-pointer",
										children: "Volver al inicio de sesión"
									})
								})
							]
						})] })
					]
				})]
			})
		]
	});
}
//#endregion
export { ResetPasswordPage as default };

//# sourceMappingURL=page-BlSPvhRN.js.map