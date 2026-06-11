import { a as __toESM } from "./chunk-DKxDMwdo.js";
import { h as require_react, s as require_jsx_runtime, u as Link } from "./index-cosAM6zi.js";
import { t as SeoHead } from "./SeoHead-SAtaEFdZ.js";
import { t as useTheme } from "./useTheme-CjO9s6QO.js";
//#region src/pages/contact/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var FAQ_CATEGORIES = [
	{
		id: "cuenta",
		label: "Cuenta",
		icon: "ri-user-line",
		items: [
			{
				q: "¿Cómo cambio mi contraseña?",
				a: "Ve a la página de inicio de sesión y haz clic en \"¿Olvidaste tu contraseña?\". Te enviaremos un enlace de recuperación a tu correo. También puedes cambiarlo desde Ajustes → Cuenta si ya estás dentro.",
				link: {
					text: "Recuperar contraseña",
					to: "/auth"
				}
			},
			{
				q: "¿Puedo cambiar mi nombre de usuario?",
				a: "Sí, puedes modificarlo en cualquier momento desde Ajustes → Cuenta. Ten en cuenta que si tienes un perfil público compartido, la URL cambiará y los enlaces anteriores dejarán de funcionar.",
				link: {
					text: "Ir a Ajustes",
					to: "/settings"
				}
			},
			{
				q: "¿Cómo elimino mi cuenta?",
				a: "Puedes eliminar tu cuenta permanentemente desde Ajustes → Cuenta → Eliminar cuenta. Esta acción es irreversible: se borrarán todos tus datos, tracker, reseñas y perfil. Si tienes dudas, contáctanos antes.",
				link: null
			},
			{
				q: "¿Puedo tener varias cuentas?",
				a: "No, los Términos de Uso de Vaultly permiten una única cuenta por persona. Si necesitas acceso para un equipo o uso profesional, escríbenos a hola@vaultly.app.",
				link: null
			}
		]
	},
	{
		id: "tracker",
		label: "Tracker",
		icon: "ri-bookmark-line",
		items: [
			{
				q: "¿Cuántos ítems puedo añadir al tracker?",
				a: "En el plan gratuito no hay límite de ítems. Puedes trackear tantas películas, series, libros, videojuegos y demás como quieras.",
				link: null
			},
			{
				q: "¿Puedo importar mi historial desde otras plataformas?",
				a: "Actualmente no tenemos importación automática desde plataformas externas (Letterboxd, Goodreads, MAL...), pero es una funcionalidad que tenemos en el roadmap. Si quieres que la prioricemos, ¡mándanos una sugerencia!",
				link: {
					text: "Enviar sugerencia",
					to: "/contact"
				}
			},
			{
				q: "¿Cómo exporto mis datos del tracker?",
				a: "Puedes exportar todo tu tracker en formato CSV o JSON desde Ajustes → Cuenta → Exportar datos. El archivo incluye todos tus ítems, estados, puntuaciones y fechas.",
				link: {
					text: "Ir a Ajustes",
					to: "/settings"
				}
			},
			{
				q: "¿El tracker funciona sin conexión?",
				a: "Actualmente Vaultly requiere conexión a internet para sincronizar tu tracker. Estamos trabajando en un modo offline para una versión futura.",
				link: null
			}
		]
	},
	{
		id: "privacidad",
		label: "Privacidad",
		icon: "ri-shield-check-line",
		items: [
			{
				q: "¿Quién puede ver mi perfil?",
				a: "Por defecto tu perfil es público, pero puedes hacerlo privado en cualquier momento desde Ajustes → Privacidad. Con el perfil privado, solo tú puedes ver tu tracker y estadísticas.",
				link: {
					text: "Ajustes de privacidad",
					to: "/settings"
				}
			},
			{
				q: "¿Vendéis mis datos a terceros?",
				a: "No. Nunca vendemos, alquilamos ni compartimos tus datos personales con terceros con fines comerciales. Puedes leer todos los detalles en nuestra Política de Privacidad.",
				link: {
					text: "Política de Privacidad",
					to: "/privacy"
				}
			},
			{
				q: "¿Cómo solicito la eliminación de mis datos?",
				a: "Puedes eliminar tu cuenta y todos los datos asociados desde Ajustes → Cuenta. Si necesitas una eliminación específica de ciertos datos o tienes una solicitud RGPD, escríbenos a privacy@vaultly.app.",
				link: null
			}
		]
	},
	{
		id: "tecnico",
		label: "Técnico",
		icon: "ri-tools-line",
		items: [
			{
				q: "¿En qué navegadores funciona Vaultly?",
				a: "Vaultly funciona en las versiones modernas de Chrome, Firefox, Safari y Edge. Recomendamos mantener el navegador actualizado para la mejor experiencia.",
				link: null
			},
			{
				q: "La página no carga correctamente, ¿qué hago?",
				a: "Prueba a limpiar la caché del navegador (Ctrl+Shift+R o Cmd+Shift+R en Mac) y recarga la página. Si el problema persiste, repórtalo usando el formulario de contacto indicando tu navegador y sistema operativo.",
				link: {
					text: "Reportar un bug",
					to: "/contact"
				}
			},
			{
				q: "¿Tenéis app móvil?",
				a: "Actualmente Vaultly es una aplicación web optimizada para móvil. Estamos desarrollando apps nativas para iOS y Android. Síguenos en redes para enterarte cuando estén disponibles.",
				link: null
			},
			{
				q: "¿Tenéis API pública?",
				a: "Todavía no tenemos una API pública documentada, pero es algo que tenemos en mente para el futuro. Si eres desarrollador y tienes un caso de uso concreto, escríbenos.",
				link: {
					text: "Contactar",
					to: "/contact"
				}
			}
		]
	}
];
var TOPICS = [
	{
		value: "soporte-tecnico",
		label: "Soporte técnico",
		icon: "ri-tools-line"
	},
	{
		value: "reporte-bug",
		label: "Reportar un bug",
		icon: "ri-bug-line"
	},
	{
		value: "sugerencia",
		label: "Sugerencia o mejora",
		icon: "ri-lightbulb-line"
	},
	{
		value: "cuenta",
		label: "Problema con mi cuenta",
		icon: "ri-user-settings-line"
	},
	{
		value: "privacidad",
		label: "Privacidad y datos",
		icon: "ri-shield-check-line"
	},
	{
		value: "otro",
		label: "Otro",
		icon: "ri-chat-3-line"
	}
];
var CONTACT_CARDS = [
	{
		icon: "ri-mail-line",
		color: "text-violet-500",
		bg: "bg-violet-50 dark:bg-violet-950/30",
		title: "Email general",
		desc: "Para consultas generales y soporte",
		value: "hola@vaultly.app",
		href: "mailto:hola@vaultly.app"
	},
	{
		icon: "ri-shield-check-line",
		color: "text-emerald-500",
		bg: "bg-emerald-50 dark:bg-emerald-950/30",
		title: "Privacidad y datos",
		desc: "Solicitudes RGPD y datos personales",
		value: "privacy@vaultly.app",
		href: "mailto:privacy@vaultly.app"
	},
	{
		icon: "ri-scales-3-line",
		color: "text-amber-500",
		bg: "bg-amber-50 dark:bg-amber-950/30",
		title: "Legal",
		desc: "Consultas legales y términos",
		value: "legal@vaultly.app",
		href: "mailto:legal@vaultly.app"
	}
];
function ContactPage() {
	const { theme, toggleTheme } = useTheme();
	const formRef = (0, import_react.useRef)(null);
	const [topic, setTopic] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [submitStatus, setSubmitStatus] = (0, import_react.useState)("idle");
	const [touched, setTouched] = (0, import_react.useState)({
		topic: false,
		name: false,
		email: false,
		message: false
	});
	const [faqCategory, setFaqCategory] = (0, import_react.useState)("cuenta");
	const [openFaq, setOpenFaq] = (0, import_react.useState)(null);
	const touch = (field) => setTouched((prev) => ({
		...prev,
		[field]: true
	}));
	const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	const errors = {
		topic: !topic ? "Selecciona un motivo de contacto." : "",
		name: !name.trim() ? "El nombre es obligatorio." : "",
		email: !email ? "El correo electrónico es obligatorio." : !emailValid ? "Introduce un correo válido." : "",
		message: !message.trim() ? "El mensaje es obligatorio." : message.length > 500 ? "Máximo 500 caracteres." : ""
	};
	const hasErrors = Object.values(errors).some(Boolean);
	const charsLeft = 500 - message.length;
	const inputBase = "w-full py-3 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none transition-colors";
	const inputNormal = "border-zinc-200 dark:border-zinc-700 focus:border-violet-400 dark:focus:border-violet-500";
	const inputErr = "border-rose-400 dark:border-rose-500 bg-rose-50/40 dark:bg-rose-950/10 focus:border-rose-400";
	const handleSubmit = async (e) => {
		e.preventDefault();
		setTouched({
			topic: true,
			name: true,
			email: true,
			message: true
		});
		if (hasErrors) return;
		setSubmitStatus("sending");
		try {
			const body = new URLSearchParams({
				topic,
				name: name.trim(),
				email: email.trim(),
				message: message.trim()
			});
			if ((await fetch("https://readdy.ai/api/form/d7f10maa509fjl5l01jg", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: body.toString()
			})).ok) {
				setSubmitStatus("success");
				setTopic("");
				setName("");
				setEmail("");
				setMessage("");
				setTouched({
					topic: false,
					name: false,
					email: false,
					message: false
				});
			} else setSubmitStatus("error");
		} catch {
			setSubmitStatus("error");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-white dark:bg-zinc-950",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoHead, {
				title: "Contacto — Vaultly",
				description: "¿Tienes alguna pregunta, sugerencia o problema? Contacta con el equipo de Vaultly. Respondemos en menos de 48 horas.",
				keywords: "contacto, soporte, ayuda, Vaultly",
				canonical: "/contact"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-screen-xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2.5 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-archive-2-line text-white text-sm" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-zinc-900 dark:text-white text-base",
							style: { fontFamily: "'Space Grotesk', sans-serif" },
							children: "Vaultly"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: toggleTheme,
							className: "w-9 h-9 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: theme === "dark" ? "ri-sun-line" : "ri-moon-line" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							className: "px-4 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap",
							children: "Iniciar sesión"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-b border-zinc-100 dark:border-zinc-800 py-14 md:py-20 px-4 md:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-3xl mx-auto text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-customer-service-2-line text-rose-500 text-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-rose-600 dark:text-rose-400 text-xs font-medium",
								children: "Estamos aquí para ayudarte"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4 leading-tight",
							style: { fontFamily: "'Space Grotesk', sans-serif" },
							children: "Contacta con nosotros"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-zinc-500 dark:text-zinc-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto",
							children: "¿Tienes una pregunta, encontraste un bug o quieres compartir una idea? Escríbenos y te respondemos en menos de 48 horas."
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-b border-zinc-100 dark:border-zinc-800 py-10 px-4 md:px-6 bg-zinc-50/50 dark:bg-zinc-900/20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4",
					children: CONTACT_CARDS.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: card.href,
						className: "flex items-start gap-4 bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors cursor-pointer group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${card.icon} ${card.color} text-base` })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-0.5",
									children: card.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-zinc-400 mb-1.5 leading-snug",
									children: card.desc
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium text-violet-500 group-hover:text-violet-600 transition-colors truncate",
									children: card.value
								})
							]
						})]
					}, card.title))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-screen-xl mx-auto px-4 md:px-6 py-12 md:py-16 flex flex-col lg:flex-row gap-10 lg:gap-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "w-full lg:w-72 flex-shrink-0 flex flex-col gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4",
								children: "Tiempos de respuesta"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col gap-3",
								children: [
									{
										label: "Soporte técnico",
										time: "&lt; 24h",
										color: "text-emerald-500"
									},
									{
										label: "Bugs críticos",
										time: "&lt; 4h",
										color: "text-rose-500"
									},
									{
										label: "Sugerencias",
										time: "&lt; 72h",
										color: "text-amber-500"
									},
									{
										label: "Consultas legales",
										time: "&lt; 30 días",
										color: "text-zinc-500"
									}
								].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm text-zinc-600 dark:text-zinc-400",
										children: item.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-xs font-semibold ${item.color}`,
										dangerouslySetInnerHTML: { __html: item.time }
									})]
								}, item.label))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4",
								children: "Antes de escribirnos"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col gap-2",
								children: [
									{
										icon: "ri-question-line",
										text: "¿Cómo exporto mis datos?",
										href: "/settings"
									},
									{
										icon: "ri-lock-password-line",
										text: "¿Olvidé mi contraseña?",
										href: "/auth"
									},
									{
										icon: "ri-user-settings-line",
										text: "Cambiar ajustes de privacidad",
										href: "/settings"
									},
									{
										icon: "ri-shield-check-line",
										text: "Política de Privacidad",
										href: "/privacy"
									},
									{
										icon: "ri-file-list-3-line",
										text: "Términos de Uso",
										href: "/terms"
									}
								].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.href,
									className: "flex items-center gap-2.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors py-1 group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-5 h-5 flex items-center justify-center flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${item.icon} text-sm text-zinc-400 group-hover:text-violet-500 transition-colors` })
									}), item.text]
								}, item.text))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4",
								children: "Síguenos"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-3",
								children: [
									{
										icon: "ri-twitter-x-line",
										label: "Twitter / X"
									},
									{
										icon: "ri-instagram-line",
										label: "Instagram"
									},
									{
										icon: "ri-discord-line",
										label: "Discord"
									}
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#",
									rel: "nofollow noopener",
									title: s.label,
									className: "w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${s.icon} text-sm` })
								}, s.label))
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 min-w-0",
					children: submitStatus === "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center gap-6 py-16 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-checkbox-circle-line text-4xl text-emerald-500" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold text-zinc-900 dark:text-white mb-2",
								style: { fontFamily: "'Space Grotesk', sans-serif" },
								children: "¡Mensaje enviado!"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto",
								children: [
									"Hemos recibido tu mensaje. Te responderemos en el correo",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-zinc-700 dark:text-zinc-300",
										children: email || "indicado"
									}),
									" ",
									"lo antes posible."
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSubmitStatus("idle"),
								className: "px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-rose-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap",
								children: "Enviar otro mensaje"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						ref: formRef,
						id: "contact-form",
						"data-readdy-form": true,
						onSubmit: handleSubmit,
						noValidate: true,
						className: "flex flex-col gap-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-bold text-zinc-900 dark:text-white mb-1",
								style: { fontFamily: "'Space Grotesk', sans-serif" },
								children: "Envíanos un mensaje"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-zinc-500",
								children: "Rellena el formulario y te responderemos en breve."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider",
										children: ["Motivo de contacto ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-rose-500",
											children: "*"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
										children: TOPICS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												setTopic(t.value);
												touch("topic");
											},
											className: `flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer text-left ${topic === t.value ? "border-violet-400 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300" : touched.topic && !topic ? "border-rose-300 dark:border-rose-700 bg-rose-50/30 dark:bg-rose-950/10 text-zinc-600 dark:text-zinc-400" : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "w-4 h-4 flex items-center justify-center flex-shrink-0",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${t.icon} text-sm` })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate",
													children: t.label
												}),
												topic === t.value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "ml-auto w-4 h-4 flex items-center justify-center flex-shrink-0",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line text-xs text-violet-500" })
												})
											]
										}, t.value))
									}),
									touched.topic && errors.topic && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-1.5 text-xs text-rose-500",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-xs flex-shrink-0" }), errors.topic]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider",
											children: ["Nombre ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-rose-500",
												children: "*"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: `absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center ${touched.name && errors.name ? "text-rose-400" : "text-zinc-400"}`,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-user-line text-sm" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													name: "name",
													value: name,
													onChange: (e) => {
														setName(e.target.value);
														touch("name");
													},
													onBlur: () => touch("name"),
													placeholder: "Tu nombre",
													autoComplete: "name",
													className: `${inputBase} pl-10 ${touched.name && errors.name ? inputErr : inputNormal}`
												}),
												touched.name && !errors.name && name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line text-sm" })
												})
											]
										}),
										touched.name && errors.name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-center gap-1.5 text-xs text-rose-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-xs flex-shrink-0" }), errors.name]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
													className: `absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center ${touched.email && errors.email ? "text-rose-400" : "text-zinc-400"}`,
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
													className: `${inputBase} pl-10 ${touched.email && errors.email ? inputErr : inputNormal}`
												}),
												touched.email && !errors.email && email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-check-line text-sm" })
												})
											]
										}),
										touched.email && errors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-center gap-1.5 text-xs text-rose-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-xs flex-shrink-0" }), errors.email]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-xs font-semibold text-zinc-500 uppercase tracking-wider",
											children: ["Mensaje ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-rose-500",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `text-xs ${charsLeft < 50 ? charsLeft < 0 ? "text-rose-500" : "text-amber-500" : "text-zinc-400"}`,
											children: [charsLeft, " caracteres restantes"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										name: "message",
										value: message,
										onChange: (e) => {
											setMessage(e.target.value);
											touch("message");
										},
										onBlur: () => touch("message"),
										placeholder: "Describe tu consulta con el mayor detalle posible. Si es un bug, incluye los pasos para reproducirlo.",
										rows: 6,
										maxLength: 500,
										className: `${inputBase} resize-none leading-relaxed ${touched.message && errors.message ? inputErr : inputNormal}`
									}),
									touched.message && errors.message && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-1.5 text-xs text-rose-500",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-xs flex-shrink-0" }), errors.message]
									})
								]
							}),
							submitStatus === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-error-warning-line text-rose-500 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-rose-600 dark:text-rose-400",
									children: [
										"Hubo un error al enviar el mensaje. Inténtalo de nuevo o escríbenos directamente a",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: "mailto:hola@vaultly.app",
											className: "font-semibold underline",
											children: "hola@vaultly.app"
										}),
										"."
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row items-start sm:items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: submitStatus === "sending",
									className: "flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-rose-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed",
									children: submitStatus === "sending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-loader-4-line animate-spin" }), "Enviando..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-send-plane-line" }), "Enviar mensaje"] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-zinc-400 leading-relaxed",
									children: [
										"Al enviar aceptas nuestra",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/privacy",
											className: "text-violet-500 hover:text-violet-600 transition-colors",
											children: "Política de Privacidad"
										}),
										"."
									]
								})]
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "faq",
				className: "border-t border-zinc-100 dark:border-zinc-800 py-14 md:py-20 px-4 md:px-6 bg-zinc-50/50 dark:bg-zinc-900/20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-screen-xl mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/40 mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-question-answer-line text-violet-500 text-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-violet-600 dark:text-violet-400 text-xs font-medium",
										children: "Preguntas frecuentes"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white",
									style: { fontFamily: "'Space Grotesk', sans-serif" },
									children: "Respuestas rápidas"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-zinc-500 dark:text-zinc-400 mt-1.5",
									children: "Puede que tu duda ya esté resuelta aquí. Si no, usa el formulario de arriba."
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: FAQ_CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										setFaqCategory(cat.id);
										setOpenFaq(null);
									},
									className: `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${faqCategory === cat.id ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `${cat.icon} text-sm` }), cat.label]
								}, cat.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-w-3xl",
							children: FAQ_CATEGORIES.find((c) => c.id === faqCategory)?.items.map((item, idx) => {
								const key = `${faqCategory}-${idx}`;
								const isOpen = openFaq === key;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-b border-zinc-200 dark:border-zinc-800 last:border-b-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setOpenFaq(isOpen ? null : key),
										className: "w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer group",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-sm font-semibold leading-snug transition-colors ${isOpen ? "text-violet-600 dark:text-violet-400" : "text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white"}`,
											children: item.q
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg transition-all ${isOpen ? "bg-violet-100 dark:bg-violet-950/40 text-violet-500 rotate-45" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700"}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-add-line text-sm" })
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "overflow-hidden transition-all duration-300 ease-in-out",
										style: {
											maxHeight: isOpen ? "300px" : "0px",
											opacity: isOpen ? 1 : 0
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pb-5 pr-11",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3",
												children: item.a
											}), item.link && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: item.link.to,
												className: "inline-flex items-center gap-1.5 text-xs font-semibold text-violet-500 hover:text-violet-600 transition-colors",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-arrow-right-line text-xs" }), item.link.text]
											})]
										})
									})]
								}, key);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 px-5 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 max-w-3xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center flex-shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-customer-service-2-line text-rose-500 text-base" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold text-zinc-800 dark:text-zinc-200",
										children: "¿No encontraste lo que buscabas?"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-zinc-500 dark:text-zinc-400 mt-0.5",
										children: "Usa el formulario de arriba y te respondemos en menos de 48 horas."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "#contact-form",
									className: "flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap flex-shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-send-plane-line" }), "Escribirnos"]
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-zinc-100 dark:border-zinc-800 py-8 px-4 md:px-6 mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-archive-2-line text-white text-xs" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-zinc-900 dark:text-white text-sm",
								style: { fontFamily: "'Space Grotesk', sans-serif" },
								children: "Vaultly"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-zinc-400 text-xs",
							children: "© 2026 Vaultly. Todos los derechos reservados."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4 text-zinc-400 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/privacy",
									className: "hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors",
									children: "Privacidad"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/terms",
									className: "hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors",
									children: "Términos"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/contact",
									className: "text-rose-500 font-medium",
									children: "Contacto"
								})
							]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { ContactPage as default };

//# sourceMappingURL=page-DIL6KXgP.js.map