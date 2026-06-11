import { s as require_jsx_runtime, u as Link } from "./index-cosAM6zi.js";
import { t as SeoHead } from "./SeoHead-SAtaEFdZ.js";
import { t as useTheme } from "./useTheme-CjO9s6QO.js";
//#region src/pages/privacy/page.tsx
var import_jsx_runtime = require_jsx_runtime();
var SECTIONS = [
	{
		id: "informacion-recopilada",
		title: "1. Información que recopilamos",
		content: [
			{
				subtitle: "Información que tú nos proporcionas",
				text: "Cuando creas una cuenta en Vaultly, recopilamos tu dirección de correo electrónico, nombre de usuario y contraseña (almacenada de forma cifrada). Opcionalmente puedes añadir una foto de perfil, biografía y preferencias de contenido."
			},
			{
				subtitle: "Información generada por tu actividad",
				text: "Registramos los ítems que añades a tu tracker (películas, series, libros, videojuegos, anime, etc.), las valoraciones y reseñas que publicas, las listas que creas y compartes, y tus interacciones con otros usuarios de la plataforma."
			},
			{
				subtitle: "Información técnica",
				text: "Recopilamos automáticamente datos técnicos como tu dirección IP, tipo de navegador, sistema operativo, páginas visitadas dentro de Vaultly y la fecha y hora de acceso. Esta información se usa exclusivamente para mejorar el servicio y garantizar su seguridad."
			}
		]
	},
	{
		id: "uso-informacion",
		title: "2. Cómo usamos tu información",
		content: [
			{
				subtitle: "Prestación del servicio",
				text: "Usamos tu información para crear y gestionar tu cuenta, mostrarte tu tracker personalizado, generar estadísticas de tu consumo cultural y permitirte compartir tu perfil público con otros usuarios."
			},
			{
				subtitle: "Mejora de la plataforma",
				text: "Analizamos patrones de uso de forma agregada y anonimizada para mejorar las funcionalidades existentes, desarrollar nuevas características y optimizar la experiencia de usuario."
			},
			{
				subtitle: "Comunicaciones",
				text: "Podemos enviarte correos electrónicos relacionados con tu cuenta (confirmación de registro, recuperación de contraseña, notificaciones de actividad). Nunca te enviaremos publicidad de terceros sin tu consentimiento explícito."
			}
		]
	},
	{
		id: "compartir-informacion",
		title: "3. Compartir tu información",
		content: [
			{
				subtitle: "Perfil público",
				text: "Si configuras tu perfil como público, tu nombre de usuario, foto de perfil, estadísticas de consumo y reseñas serán visibles para cualquier persona, incluso sin cuenta en Vaultly. Puedes cambiar esta configuración en cualquier momento desde Ajustes → Privacidad."
			},
			{
				subtitle: "Terceros",
				text: "No vendemos, alquilamos ni compartimos tu información personal con terceros con fines comerciales. Podemos compartir datos técnicos anonimizados con proveedores de servicios que nos ayudan a operar la plataforma (hosting, análisis), siempre bajo acuerdos de confidencialidad."
			},
			{
				subtitle: "Obligaciones legales",
				text: "Podemos divulgar tu información si así lo exige la ley, una orden judicial o para proteger los derechos, la propiedad o la seguridad de Vaultly, sus usuarios o el público en general."
			}
		]
	},
	{
		id: "seguridad",
		title: "4. Seguridad de los datos",
		content: [{
			subtitle: "Medidas técnicas",
			text: "Utilizamos cifrado TLS para todas las comunicaciones entre tu navegador y nuestros servidores. Las contraseñas se almacenan usando algoritmos de hash seguros (bcrypt). Realizamos auditorías de seguridad periódicas y mantenemos nuestros sistemas actualizados."
		}, {
			subtitle: "Acceso restringido",
			text: "Solo el personal autorizado de Vaultly tiene acceso a los datos de usuarios, y únicamente cuando es necesario para prestar soporte técnico o resolver incidencias. Todo acceso queda registrado en nuestros logs de auditoría."
		}]
	},
	{
		id: "tus-derechos",
		title: "5. Tus derechos",
		content: [
			{
				subtitle: "Acceso y portabilidad",
				text: "Tienes derecho a acceder a todos los datos que tenemos sobre ti y a solicitar una copia en formato legible por máquina. Puedes exportar tu tracker completo desde Ajustes → Cuenta."
			},
			{
				subtitle: "Rectificación",
				text: "Puedes actualizar o corregir tu información personal en cualquier momento desde la sección de Ajustes de tu cuenta."
			},
			{
				subtitle: "Eliminación",
				text: "Puedes solicitar la eliminación completa de tu cuenta y todos los datos asociados. Esta acción es irreversible. Para iniciar el proceso, ve a Ajustes → Cuenta → Eliminar cuenta, o contáctanos en privacy@vaultly.app."
			},
			{
				subtitle: "Oposición y limitación",
				text: "Puedes oponerte al procesamiento de tus datos para determinados fines o solicitar que limitemos su uso. Para ejercer estos derechos, contáctanos en privacy@vaultly.app."
			}
		]
	},
	{
		id: "cookies",
		title: "6. Cookies y tecnologías similares",
		content: [{
			subtitle: "Cookies esenciales",
			text: "Usamos cookies estrictamente necesarias para mantener tu sesión iniciada y recordar tus preferencias básicas (como el tema claro/oscuro). Estas cookies no pueden desactivarse sin afectar al funcionamiento de la plataforma."
		}, {
			subtitle: "Cookies analíticas",
			text: "Con tu consentimiento, utilizamos cookies analíticas para entender cómo se usa Vaultly y mejorar la experiencia. Puedes gestionar tus preferencias de cookies en cualquier momento desde la configuración de tu navegador."
		}]
	},
	{
		id: "menores",
		title: "7. Menores de edad",
		content: [{
			subtitle: "Restricción de edad",
			text: "Vaultly no está dirigido a menores de 13 años. No recopilamos conscientemente información personal de niños menores de 13 años. Si eres padre o tutor y crees que tu hijo nos ha proporcionado información personal, contáctanos en privacy@vaultly.app para que podamos eliminarla."
		}]
	},
	{
		id: "cambios",
		title: "8. Cambios en esta política",
		content: [{
			subtitle: "Notificación de cambios",
			text: "Podemos actualizar esta Política de Privacidad ocasionalmente. Cuando realicemos cambios significativos, te notificaremos por correo electrónico o mediante un aviso destacado en la plataforma antes de que los cambios entren en vigor. La fecha de la última actualización siempre aparecerá al inicio de este documento."
		}]
	},
	{
		id: "contacto",
		title: "9. Contacto",
		content: [{
			subtitle: "Responsable del tratamiento",
			text: "Si tienes preguntas, dudas o solicitudes relacionadas con esta Política de Privacidad o el tratamiento de tus datos personales, puedes contactarnos en: privacy@vaultly.app. Nos comprometemos a responder en un plazo máximo de 30 días."
		}]
	}
];
function PrivacyPage() {
	const { theme, toggleTheme } = useTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-white dark:bg-zinc-950",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoHead, {
				title: "Política de Privacidad — Vaultly",
				description: "Conoce cómo Vaultly recopila, usa y protege tu información personal. Tu privacidad es nuestra prioridad.",
				keywords: "privacidad, datos personales, RGPD, Vaultly",
				canonical: "/privacy"
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
					className: "max-w-3xl mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/40 mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-shield-check-line text-violet-500 text-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-violet-600 dark:text-violet-400 text-xs font-medium",
								children: "Tu privacidad importa"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4 leading-tight",
							style: { fontFamily: "'Space Grotesk', sans-serif" },
							children: "Política de Privacidad"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-zinc-500 dark:text-zinc-400 text-base md:text-lg leading-relaxed mb-6",
							children: "En Vaultly nos tomamos muy en serio la protección de tus datos personales. Esta política explica de forma clara y transparente qué información recopilamos, cómo la usamos y qué derechos tienes sobre ella."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-4 text-sm text-zinc-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-calendar-line text-zinc-400" }), "Última actualización: 14 de abril de 2026"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-file-text-line text-zinc-400" }), "Versión 2.1"]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-screen-xl mx-auto px-4 md:px-6 py-12 md:py-16 flex flex-col lg:flex-row gap-10 lg:gap-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "hidden lg:block w-56 flex-shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sticky top-24",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4",
							children: "Contenido"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "flex flex-col gap-1",
							children: SECTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `#${s.id}`,
								rel: "nofollow",
								className: "text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors py-1 leading-snug cursor-pointer",
								children: s.title
							}, s.id))
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 min-w-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-12",
						children: [SECTIONS.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							id: section.id,
							className: "scroll-mt-24",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xl font-bold text-zinc-900 dark:text-white mb-6",
								style: { fontFamily: "'Space Grotesk', sans-serif" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `#${section.id}`,
									className: "hover:text-violet-500 transition-colors",
									children: section.title
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col gap-5",
								children: section.content.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-2",
										children: item.subtitle
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed",
										children: item.text
									})]
								}, i))
							})]
						}, section.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-gradient-to-br from-violet-50 to-rose-50 dark:from-violet-950/20 dark:to-rose-950/20 border border-violet-100 dark:border-violet-900/30 p-8 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center mx-auto mb-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-mail-line text-white text-lg" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-lg font-bold text-zinc-900 dark:text-white mb-2",
									style: { fontFamily: "'Space Grotesk', sans-serif" },
									children: "¿Tienes alguna pregunta?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-zinc-500 dark:text-zinc-400 mb-5 max-w-sm mx-auto",
									children: "Si tienes dudas sobre cómo tratamos tus datos, no dudes en contactarnos. Respondemos en menos de 30 días."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "mailto:privacy@vaultly.app",
									className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "ri-mail-send-line" }), "privacy@vaultly.app"]
								})
							]
						})]
					})
				})]
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
									className: "text-violet-500 font-medium",
									children: "Privacidad"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/terms",
									className: "hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors",
									children: "Términos"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/contact",
									className: "hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors",
									children: "Contacto"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/",
									className: "hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors",
									children: "Inicio"
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
export { PrivacyPage as default };

//# sourceMappingURL=page-CKWWD8Cc.js.map