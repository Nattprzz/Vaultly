import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { c as useAuth, d as useLocation, f as useNavigate, h as require_react, l as supabase, m as useSearchParams, r as CATEGORIES, s as require_jsx_runtime, u as Link } from "./index-cosAM6zi.js";
import { t as SeoHead } from "./SeoHead-SAtaEFdZ.js";
import { t as useTheme } from "./useTheme-CjO9s6QO.js";
import { t as SETTINGS_STORAGE_KEY } from "./useSettings-CZ1Tg8p7.js";
//#region src/pages/auth/components/ForgotPasswordForm.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function validateEmail$2(val) {
	if (!val) return "El correo electrónico es obligatorio.";
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Introduce un correo válido.";
	return "";
}
function ForgotPasswordForm({ onBack, prefillEmail = "" }) {
	const [email, setEmail] = (0, import_react.useState)(prefillEmail);
	const [touched, setTouched] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [sent, setSent] = (0, import_react.useState)(false);
	const [serverError, setServerError] = (0, import_react.useState)("");
	const emailError = validateEmail$2(email);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setTouched(true);
		setServerError("");
		if (emailError) return;
		setLoading(true);
		try {
			const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/auth/reset-password` });
			if (error) {
				setServerError(error.message);
				return;
			}
			setSent(true);
		} catch {
			setServerError("Error inesperado. Inténtalo de nuevo.");
		} finally {
			setLoading(false);
		}
	};
	const inputBase = "w-full py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none transition-colors";
	const inputNormal = "border-zinc-200 dark:border-zinc-700 focus:border-violet-400 dark:focus:border-violet-500";
	const inputErrorClass = "border-rose-400 dark:border-rose-500 focus:border-rose-400 dark:focus:border-rose-500 bg-rose-50/40 dark:bg-rose-950/10";
	const inputSuccessClass = "border-emerald-400 dark:border-emerald-500 focus:border-emerald-400 dark:focus:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10";
	const getEmailClass = () => {
		if (touched && emailError) return inputErrorClass;
		if (touched && !emailError && email) return inputSuccessClass;
		return inputNormal;
	};
	if (sent) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4 py-4 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-mail-send-line text-3xl text-emerald-500" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-bold text-zinc-900 dark:text-white mb-1.5",
					style: { fontFamily: "'Space Grotesk', sans-serif" },
					children: "¡Email enviado!"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-zinc-500 leading-relaxed",
					children: [
						"Si existe una cuenta con",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-zinc-700 dark:text-zinc-300",
							children: email
						}),
						", recibirás un enlace para restablecer tu contraseña en los próximos minutos."
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-xl px-4 py-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-information-line flex-shrink-0 mt-0.5" }), "Revisa también tu carpeta de spam si no ves el email en tu bandeja de entrada."]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					setSent(false);
					setEmail("");
					setTouched(false);
				},
				className: "w-full py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap",
				children: "Enviar de nuevo"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onBack,
				className: "w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-rose-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap flex items-center justify-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-left-line" }), "Volver al inicio de sesión"]
			})]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "flex flex-col gap-5",
		noValidate: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3 px-4 py-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-lg bg-violet-100 dark:bg-violet-950/40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-lock-password-line text-violet-500 text-sm" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pt-0.5",
					children: "Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider",
						children: ["Correo electrónico ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-rose-500",
							children: "*"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${touched && emailError ? "text-rose-400" : "text-zinc-400"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-mail-line text-sm" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								name: "email",
								value: email,
								onChange: (e) => {
									setEmail(e.target.value);
									setTouched(true);
									setServerError("");
								},
								onBlur: () => setTouched(true),
								placeholder: "tu@email.com",
								autoComplete: "email",
								autoFocus: true,
								className: `${inputBase} pl-10 pr-9 ${getEmailClass()}`
							}),
							touched && !emailError && email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line text-sm" })
							})
						]
					}),
					touched && emailError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-1.5 text-xs text-rose-500",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-xs flex-shrink-0" }), emailError]
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
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-loader-4-line animate-spin" }), "Enviando enlace..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-send-plane-line" }), "Enviar enlace de recuperación"] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onBack,
				className: "flex items-center justify-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-left-line text-xs" }), "Volver al inicio de sesión"]
			})
		]
	});
}
//#endregion
//#region src/pages/auth/components/LoginForm.tsx
function validateEmail$1(val) {
	if (!val) return "El correo electrónico es obligatorio.";
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Introduce un correo válido.";
	return "";
}
function validatePassword$1(val) {
	if (!val) return "La contraseña es obligatoria.";
	return "";
}
function LoginForm({ onSwitch, onViewChange }) {
	const navigate = useNavigate();
	const location = useLocation();
	const [view, setView] = (0, import_react.useState)("login");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPass, setShowPass] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [serverError, setServerError] = (0, import_react.useState)("");
	const [touched, setTouched] = (0, import_react.useState)({
		email: false,
		password: false
	});
	const from = location.state?.from?.pathname ?? "/dashboard";
	const touch = (field) => setTouched((prev) => ({
		...prev,
		[field]: true
	}));
	const emailError = validateEmail$1(email);
	const passwordError = validatePassword$1(password);
	const switchView = (v) => {
		setView(v);
		onViewChange?.(v);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setServerError("");
		setTouched({
			email: true,
			password: true
		});
		if (emailError || passwordError) return;
		setLoading(true);
		try {
			const { error: authError } = await supabase.auth.signInWithPassword({
				email: email.trim(),
				password
			});
			if (authError) {
				if (authError.message.includes("Invalid login credentials")) setServerError("Email o contraseña incorrectos.");
				else if (authError.message.includes("Email not confirmed")) setServerError("Confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.");
				else setServerError(authError.message);
				return;
			}
			navigate(from, { replace: true });
		} catch {
			setServerError("Error inesperado. Inténtalo de nuevo.");
		} finally {
			setLoading(false);
		}
	};
	const inputBase = "w-full py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none transition-colors";
	const inputNormal = "border-zinc-200 dark:border-zinc-700 focus:border-violet-400 dark:focus:border-violet-500";
	const inputError = "border-rose-400 dark:border-rose-500 focus:border-rose-400 dark:focus:border-rose-500 bg-rose-50/40 dark:bg-rose-950/10";
	const inputSuccess = "border-emerald-400 dark:border-emerald-500 focus:border-emerald-400 dark:focus:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10";
	const getEmailClass = () => {
		if (touched.email && emailError) return inputError;
		if (touched.email && !emailError && email) return inputSuccess;
		return inputNormal;
	};
	const getPasswordClass = () => {
		if (touched.password && passwordError) return inputError;
		if (touched.password && !passwordError && password) return inputSuccess;
		return inputNormal;
	};
	if (view === "forgot") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForgotPasswordForm, {
		prefillEmail: email,
		onBack: () => switchView("login")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "flex flex-col gap-5",
		noValidate: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider",
						children: ["Correo electrónico ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-rose-500",
							children: "*"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${touched.email && emailError ? "text-rose-400" : "text-zinc-400"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-mail-line text-sm" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								name: "email",
								value: email,
								onChange: (e) => {
									setEmail(e.target.value);
									touch("email");
									setServerError("");
								},
								onBlur: () => touch("email"),
								placeholder: "tu@email.com",
								autoComplete: "email",
								className: `${inputBase} pl-10 pr-9 ${getEmailClass()}`
							}),
							touched.email && !emailError && email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line text-sm" })
							})
						]
					}),
					touched.email && emailError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-1.5 text-xs text-rose-500",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-xs flex-shrink-0" }), emailError]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider",
							children: ["Contraseña ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-rose-500",
								children: "*"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => switchView("forgot"),
							className: "text-xs text-violet-500 hover:text-violet-600 transition-colors cursor-pointer",
							children: "¿Olvidaste tu contraseña?"
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
								name: "password",
								value: password,
								onChange: (e) => {
									setPassword(e.target.value);
									touch("password");
									setServerError("");
								},
								onBlur: () => touch("password"),
								placeholder: "••••••••",
								autoComplete: "current-password",
								className: `${inputBase} pl-10 pr-14 ${getPasswordClass()}`
							}),
							touched.password && !passwordError && password && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line text-sm" })
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
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-loader-4-line animate-spin" }), "Iniciando sesión..."] }) : "Iniciar sesión"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-px bg-zinc-200 dark:bg-zinc-700" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-zinc-400",
						children: "o continúa con"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-px bg-zinc-200 dark:bg-zinc-700" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer whitespace-nowrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-google-fill text-base text-rose-500" }), "Google"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer whitespace-nowrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-discord-fill text-base text-indigo-400" }), "Discord"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-center text-sm text-zinc-500",
				children: [
					"¿No tienes cuenta?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onSwitch,
						className: "text-violet-500 font-semibold hover:text-violet-600 transition-colors cursor-pointer",
						children: "Regístrate gratis"
					})
				]
			})
		]
	});
}
//#endregion
//#region src/pages/auth/components/RegisterForm.tsx
function getInitials(name) {
	return name.split(/[\s_-]+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}
function validateEmail(val) {
	if (!val) return "El correo electrónico es obligatorio.";
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Introduce un correo válido.";
	return "";
}
function validateUsername(val) {
	if (!/^[a-z0-9_]*$/.test(val)) return "Solo letras, nÃºmeros y guiones bajos.";
	if (!val) return "El nombre de usuario es obligatorio.";
	if (val.length < 3) return "Mínimo 3 caracteres.";
	return "";
}
function validatePassword(val) {
	if (!val) return "La contraseña es obligatoria.";
	if (val.length < 8) return "Mínimo 8 caracteres.";
	return "";
}
var STEPS = [{
	num: 1,
	label: "Tu cuenta",
	icon: "ri-user-line"
}, {
	num: 2,
	label: "Intereses",
	icon: "ri-heart-line"
}];
var DEFAULT_SELECTED_CATEGORIES = [
	"videojuegos",
	"peliculas",
	"series",
	"libros"
];
function persistSelectedCategories(activeCategories) {
	try {
		const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
		const previous = raw ? JSON.parse(raw) : {};
		localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({
			...previous,
			activeCategories
		}));
	} catch {}
}
function RegisterForm({ onSwitch, onStepChange }) {
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)(1);
	const [stepAnimKey, setStepAnimKey] = (0, import_react.useState)(0);
	const [stepDirection, setStepDirection] = (0, import_react.useState)("forward");
	const [username, setUsername] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPass, setShowPass] = (0, import_react.useState)(false);
	const [selectedCats, setSelectedCats] = (0, import_react.useState)(DEFAULT_SELECTED_CATEGORIES);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [serverError, setServerError] = (0, import_react.useState)("");
	const [success, setSuccess] = (0, import_react.useState)(false);
	const [termsAccepted, setTermsAccepted] = (0, import_react.useState)(false);
	const [termsTouched, setTermsTouched] = (0, import_react.useState)(false);
	const [touched, setTouched] = (0, import_react.useState)({
		username: false,
		email: false,
		password: false
	});
	const touch = (field) => setTouched((prev) => ({
		...prev,
		[field]: true
	}));
	const usernameError = validateUsername(username);
	const emailError = validateEmail(email);
	const passwordError = validatePassword(password);
	const toggleCat = (id) => {
		setSelectedCats((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
	};
	const handleStep1 = (e) => {
		e.preventDefault();
		setServerError("");
		setTouched({
			username: true,
			email: true,
			password: true
		});
		setTermsTouched(true);
		if (usernameError || emailError || passwordError) return;
		if (!termsAccepted) return;
		goToStep(2);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setServerError("");
		if (selectedCats.length === 0) {
			setServerError("Selecciona al menos una categoría.");
			return;
		}
		persistSelectedCategories(selectedCats);
		setLoading(true);
		try {
			const normalizedUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_");
			const displayName = normalizedUsername.replace(/[_-]/g, " ");
			const initials = getInitials(normalizedUsername);
			const { data: usernameAvailable, error: usernameCheckError } = await supabase.rpc("username_available", { candidate: normalizedUsername });
			if (usernameCheckError) throw usernameCheckError;
			if (usernameAvailable === false) {
				setServerError("Este nombre de usuario ya estÃ¡ en uso.");
				return;
			}
			const { data, error: signUpError } = await supabase.auth.signUp({
				email: email.trim(),
				password,
				options: { data: {
					username: normalizedUsername,
					display_name: displayName,
					initials,
					selected_categories: selectedCats
				} }
			});
			if (signUpError) {
				if (signUpError.message.includes("already registered")) setServerError("Este email ya está registrado. Prueba a iniciar sesión.");
				else if (signUpError.message.includes("Database error saving new user")) setServerError("No se pudo crear el perfil. Revisa que el nombre de usuario no exista y vuelve a intentarlo.");
				else setServerError(signUpError.message);
				return;
			}
			if (data.user) {
				const { error: settingsError } = await supabase.from("user_tracker_settings").upsert({
					user_id: data.user.id,
					selected_categories: selectedCats,
					updated_at: (/* @__PURE__ */ new Date()).toISOString()
				}, { onConflict: "user_id" });
				if (settingsError && data.session) throw settingsError;
			}
			if (!data.session) setSuccess(true);
			else navigate("/dashboard");
		} catch {
			setServerError("Error inesperado. Inténtalo de nuevo.");
		} finally {
			setLoading(false);
		}
	};
	const goToStep = (next) => {
		setStepDirection(next > step ? "forward" : "back");
		setStep(next);
		setStepAnimKey((k) => k + 1);
		onStepChange?.(next);
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
	const inputError = "border-rose-400 dark:border-rose-500 focus:border-rose-400 dark:focus:border-rose-500 bg-rose-50/40 dark:bg-rose-950/10";
	const inputSuccess = "border-emerald-400 dark:border-emerald-500 focus:border-emerald-400 dark:focus:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10";
	const getUsernameClass = () => {
		if (usernameHasError) return inputError;
		if (touched.username && !usernameError && username) return inputSuccess;
		return inputNormal;
	};
	const getEmailClass = () => {
		if (touched.email && emailError) return inputError;
		if (touched.email && !emailError && email) return inputSuccess;
		return inputNormal;
	};
	const getPasswordClass = () => {
		if (touched.password && passwordError) return inputError;
		if (touched.password && !passwordError && password) return inputSuccess;
		return inputNormal;
	};
	const usernameHasError = touched.username && !!usernameError;
	const slideClass = stepDirection === "forward" ? "reg-step-forward" : "reg-step-back";
	if (success) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-5 py-4 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-mail-check-line text-3xl text-emerald-500" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg font-bold text-zinc-900 dark:text-white mb-1",
				style: { fontFamily: "'Space Grotesk', sans-serif" },
				children: "¡Revisa tu email!"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-zinc-500 leading-relaxed",
				children: [
					"Te hemos enviado un enlace de confirmación a",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-zinc-700 dark:text-zinc-300",
						children: email
					}),
					". Haz clic en él para activar tu cuenta."
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onSwitch,
				className: "px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-rose-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap",
				children: "Ir a iniciar sesión"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes regStepForward {
          from { opacity: 0; transform: translateX(22px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes regStepBack {
          from { opacity: 0; transform: translateX(-22px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .reg-step-forward { animation: regStepForward 0.28s cubic-bezier(0.22,1,0.36,1) both; }
        .reg-step-back    { animation: regStepBack    0.28s cubic-bezier(0.22,1,0.36,1) both; }
      ` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-0",
						children: STEPS.map((s, idx) => {
							const done = step > s.num;
							const active = step === s.num;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center flex-1 last:flex-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-1.5 flex-shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${done ? "bg-gradient-to-br from-violet-500 to-rose-500" : active ? "bg-gradient-to-br from-violet-500 to-rose-500 ring-4 ring-violet-100 dark:ring-violet-950/50" : "bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700"}`,
										children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line text-white text-sm" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${s.icon} text-sm ${active ? "text-white" : "text-zinc-400 dark:text-zinc-500"}` })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-xs font-medium whitespace-nowrap transition-colors duration-300 ${active ? "text-zinc-900 dark:text-white" : done ? "text-violet-500" : "text-zinc-400"}`,
										children: s.label
									})]
								}), idx < STEPS.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex-1 mx-3 mb-5 h-0.5 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-700",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full bg-gradient-to-r from-violet-500 to-rose-500 transition-all duration-500 ease-out",
										style: { width: done || step > s.num ? "100%" : "0%" }
									})
								})]
							}, s.num);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-gradient-to-r from-violet-500 to-rose-500 rounded-full transition-all duration-500 ease-out",
							style: { width: step === 1 ? "50%" : "100%" }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-zinc-400 text-right",
						children: [
							"Paso ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-zinc-600 dark:text-zinc-300",
								children: step
							}),
							" de ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-zinc-600 dark:text-zinc-300",
								children: "2"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: slideClass,
				children: step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleStep1,
					className: "flex flex-col gap-4",
					noValidate: true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider",
									children: ["Nombre de usuario ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-rose-500",
										children: "*"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${usernameHasError ? "text-rose-400" : "text-zinc-400"}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-at-line text-sm" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: username,
											onChange: (e) => {
												setUsername(e.target.value.toLowerCase().replace(/\s/g, ""));
												touch("username");
											},
											onBlur: () => touch("username"),
											placeholder: "tu_usuario",
											autoComplete: "username",
											className: `${inputBase} pl-10 pr-9 ${getUsernameClass()}`
										}),
										touched.username && !usernameError && username && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line text-sm" })
										})
									]
								}),
								touched.username && usernameError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-1.5 text-xs text-rose-500",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-xs flex-shrink-0" }), usernameError]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider",
									children: ["Correo electrónico ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-rose-500",
										children: "*"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${touched.email && emailError ? "text-rose-400" : "text-zinc-400"}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-mail-line text-sm" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "email",
											name: "email",
											value: email,
											onChange: (e) => {
												setEmail(e.target.value);
												touch("email");
											},
											onBlur: () => touch("email"),
											placeholder: "tu@email.com",
											autoComplete: "email",
											className: `${inputBase} pl-10 pr-9 ${getEmailClass()}`
										}),
										touched.email && !emailError && email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line text-sm" })
										})
									]
								}),
								touched.email && emailError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-1.5 text-xs text-rose-500",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-xs flex-shrink-0" }), emailError]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider",
									children: ["Contraseña ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
											},
											onBlur: () => touch("password"),
											placeholder: "Mínimo 8 caracteres",
											autoComplete: "new-password",
											className: `${inputBase} pl-10 pr-14 ${getPasswordClass()}`
										}),
										touched.password && !passwordError && password && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line text-sm" })
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: `flex items-start gap-3 cursor-pointer group rounded-xl px-3.5 py-3 border transition-colors ${termsTouched && !termsAccepted ? "border-rose-300 dark:border-rose-700 bg-rose-50/40 dark:bg-rose-950/10" : termsAccepted ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/10" : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 hover:border-zinc-300 dark:hover:border-zinc-600"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex-shrink-0 mt-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: termsAccepted,
										onChange: (e) => {
											setTermsAccepted(e.target.checked);
											setTermsTouched(true);
										},
										className: "sr-only"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `w-4.5 h-4.5 w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-all ${termsAccepted ? "bg-gradient-to-br from-violet-500 to-rose-500 border-transparent" : termsTouched && !termsAccepted ? "border-rose-400 bg-white dark:bg-zinc-800" : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 group-hover:border-violet-400"}`,
										children: termsAccepted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
											className: "ri-check-line text-white",
											style: { fontSize: "10px" }
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed select-none",
									children: [
										"He leído y acepto los",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/terms",
											target: "_blank",
											rel: "noopener noreferrer",
											onClick: (e) => e.stopPropagation(),
											className: "text-violet-500 font-semibold hover:text-violet-600 transition-colors underline underline-offset-2",
											children: "Términos de Uso"
										}),
										" ",
										"y la",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/privacy",
											target: "_blank",
											rel: "noopener noreferrer",
											onClick: (e) => e.stopPropagation(),
											className: "text-violet-500 font-semibold hover:text-violet-600 transition-colors underline underline-offset-2",
											children: "Política de Privacidad"
										}),
										" ",
										"de Vaultly."
									]
								})]
							}), termsTouched && !termsAccepted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-1.5 text-xs text-rose-500",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-xs flex-shrink-0" }), "Debes aceptar los términos para continuar."]
							})]
						}),
						serverError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-rose-500 text-sm flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-rose-600 dark:text-rose-400",
								children: serverError
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							className: "w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-rose-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap flex items-center justify-center gap-2",
							children: ["Continuar", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-line" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-px bg-zinc-200 dark:bg-zinc-700" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-zinc-400",
									children: "o regístrate con"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-px bg-zinc-200 dark:bg-zinc-700" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer whitespace-nowrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-google-fill text-base text-rose-500" }), "Google"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer whitespace-nowrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-discord-fill text-base text-indigo-400" }), "Discord"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-center text-sm text-zinc-500",
							children: [
								"¿Ya tienes cuenta?",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: onSwitch,
									className: "text-violet-500 font-semibold hover:text-violet-600 transition-colors cursor-pointer",
									children: "Inicia sesión"
								})
							]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "flex flex-col gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-zinc-600 dark:text-zinc-400 mb-3",
								children: "Elige las categorías que quieres trackear. Puedes cambiarlas después en Configuración."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-2",
								children: CATEGORIES.map((cat) => {
									const active = selectedCats.includes(cat.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => toggleCat(cat.id),
										className: `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${active ? "border-violet-400 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300" : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-5 h-5 flex items-center justify-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${cat.icon} text-sm` })
											}),
											cat.label,
											active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "ml-auto w-4 h-4 flex items-center justify-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line text-xs text-violet-500" })
											})
										]
									}, cat.id);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-zinc-400 mt-2",
								children: [
									selectedCats.length,
									" categoría",
									selectedCats.length !== 1 ? "s" : "",
									" seleccionada",
									selectedCats.length !== 1 ? "s" : ""
								]
							})
						] }),
						serverError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-rose-500 text-sm flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-rose-600 dark:text-rose-400",
								children: serverError
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => goToStep(1),
								className: "flex-1 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-left-line mr-1.5" }), "Atrás"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: loading,
								className: "flex-[2] py-3 rounded-xl bg-gradient-to-r from-violet-500 to-rose-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap disabled:opacity-60 flex items-center justify-center gap-2",
								children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-loader-4-line animate-spin" }), "Creando cuenta..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line" }), "Crear mi cuenta"] })
							})]
						})
					]
				})
			}, stepAnimKey)
		]
	});
}
//#endregion
//#region src/pages/auth/page.tsx
var SHOWCASE = [
	{
		quote: "Finalmente un lugar donde tengo todo mi consumo cultural organizado. Películas, libros, series... todo en un solo sitio.",
		author: "María G.",
		role: "Cinéfila & lectora",
		avatar: "MG"
	},
	{
		quote: "El tracker de anime es increíble. Puedo ver exactamente cuántos episodios llevo y qué sigue en mi lista.",
		author: "Kenji T.",
		role: "Otaku & gamer",
		avatar: "KT"
	},
	{
		quote: "Me encanta poder compartir mi perfil con amigos y ver qué están leyendo o viendo. Es como Goodreads pero para todo.",
		author: "Laura P.",
		role: "Bookworm",
		avatar: "LP"
	}
];
var STATS = [
	{
		value: "2.4M+",
		label: "Ítems trackeados"
	},
	{
		value: "180K+",
		label: "Usuarios activos"
	},
	{
		value: "10",
		label: "Categorías"
	}
];
function AuthPage() {
	const { isLoggedIn } = useAuth();
	const { theme, toggleTheme } = useTheme();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [mode, setMode] = (0, import_react.useState)(searchParams.get("mode") === "register" ? "register" : "login");
	const [loginView, setLoginView] = (0, import_react.useState)("login");
	const [registerStep, setRegisterStep] = (0, import_react.useState)(1);
	const [showcaseIdx, setShowcaseIdx] = (0, import_react.useState)(0);
	const [animKey, setAnimKey] = (0, import_react.useState)(0);
	const [direction, setDirection] = (0, import_react.useState)("right");
	const prevModeRef = (0, import_react.useRef)(mode);
	(0, import_react.useEffect)(() => {
		if (isLoggedIn) navigate("/dashboard");
	}, [isLoggedIn, navigate]);
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => setShowcaseIdx((i) => (i + 1) % SHOWCASE.length), 4e3);
		return () => clearInterval(t);
	}, []);
	const switchMode = (next) => {
		if (next === mode) return;
		setDirection(next === "register" ? "right" : "left");
		prevModeRef.current = mode;
		setMode(next);
		setAnimKey((k) => k + 1);
	};
	const switchLoginView = (v) => {
		setDirection(v === "forgot" ? "right" : "left");
		setLoginView(v);
		setAnimKey((k) => k + 1);
	};
	const isRegister = mode === "register";
	const isForgot = !isRegister && loginView === "forgot";
	const headerTitle = isRegister ? registerStep === 1 ? "Crea tu cuenta" : "Tus intereses" : isForgot ? "Recuperar contraseña" : "Bienvenido de vuelta";
	const headerSubtitle = isRegister ? registerStep === 1 ? "Únete a la comunidad y empieza a trackear tu cultura." : "Elige qué tipos de contenido quieres seguir." : isForgot ? "Te enviaremos un enlace para restablecer tu contraseña." : "Inicia sesión para acceder a tu vault personal.";
	const slideInClass = direction === "right" ? "auth-slide-in-right" : "auth-slide-in-left";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex bg-white dark:bg-zinc-950",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes authSlideInRight {
          from { opacity: 0; transform: translateX(28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes authSlideInLeft {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .auth-slide-in-right {
          animation: authSlideInRight 0.32s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .auth-slide-in-left {
          animation: authSlideInLeft 0.32s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes authFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .auth-fade-up {
          animation: authFadeUp 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      ` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoHead, {
				title: "Iniciar sesión o registrarse — Vaultly",
				description: "Accede a tu cuenta de Vaultly o crea una nueva para empezar a trackear tu consumo cultural.",
				canonical: "/auth",
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
								className: "flex-1 flex flex-col justify-center gap-10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-4xl font-bold text-white leading-tight mb-4",
										style: { fontFamily: "'Space Grotesk', sans-serif" },
										children: [
											"Tu universo cultural,",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "bg-gradient-to-r from-violet-400 to-rose-400 bg-clip-text text-transparent",
												children: "todo en un vault."
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-zinc-400 text-base leading-relaxed max-w-sm",
										children: "Trackea películas, series, libros, videojuegos, anime y mucho más. Comparte tu perfil y descubre qué están consumiendo tus amigos."
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex gap-8",
										children: STATS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-2xl font-bold text-white",
											style: { fontFamily: "'Space Grotesk', sans-serif" },
											children: s.value
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-zinc-500 mt-0.5",
											children: s.label
										})] }, s.label))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 max-w-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex gap-1 mb-3",
												children: [
													1,
													2,
													3,
													4,
													5
												].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-star-fill text-amber-400 text-xs" }, i))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-zinc-300 text-sm leading-relaxed mb-4 italic",
												children: [
													"“",
													SHOWCASE[showcaseIdx].quote,
													"”"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0",
													children: SHOWCASE[showcaseIdx].avatar
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-white text-sm font-semibold",
													children: SHOWCASE[showcaseIdx].author
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-zinc-500 text-xs",
													children: SHOWCASE[showcaseIdx].role
												})] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex gap-1.5 mt-4",
												children: SHOWCASE.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => setShowcaseIdx(i),
													className: `h-1 rounded-full transition-all cursor-pointer ${i === showcaseIdx ? "w-5 bg-violet-400" : "w-1.5 bg-zinc-600"}`
												}, i))
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-zinc-600 text-xs",
								children: [
									"© 2026 Vaultly · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/privacy",
										rel: "nofollow",
										className: "hover:text-zinc-400 transition-colors",
										children: "Privacidad"
									}),
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/terms",
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `mb-6 auth-fade-up`,
							children: [
								isForgot && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-lock-password-line text-violet-500 text-xs" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-500",
										children: "Recuperación de contraseña"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-2xl font-bold text-zinc-900 dark:text-white mb-1.5",
									style: { fontFamily: "'Space Grotesk', sans-serif" },
									children: headerTitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-zinc-500",
									children: headerSubtitle
								}),
								(!isRegister || registerStep === 1) && !isForgot && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-zinc-400 mt-2",
									children: [
										"Los campos marcados con ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-rose-500 font-semibold",
											children: "*"
										}),
										" son obligatorios."
									]
								})
							]
						}, `header-${animKey}-${registerStep}`),
						!isForgot && !(isRegister && registerStep === 2) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex bg-zinc-100 dark:bg-zinc-800/60 rounded-xl p-1 mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => switchMode("login"),
								className: `flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${!isRegister ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`,
								children: "Iniciar sesión"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => switchMode("register"),
								className: `flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${isRegister ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`,
								children: "Registrarse"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: slideInClass,
							children: isRegister ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegisterForm, {
								onSwitch: () => switchMode("login"),
								onStepChange: (s) => setRegisterStep(s)
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginForm, {
								onSwitch: () => switchMode("register"),
								onViewChange: switchLoginView
							})
						}, `form-${animKey}`)
					]
				})]
			})
		]
	});
}
//#endregion
export { AuthPage as default };

//# sourceMappingURL=page-Bjj36uyp.js.map