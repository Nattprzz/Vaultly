# Identidad visual de Vaultly — 5 conceptos y propuesta final

Paleta de marca para los 5 conceptos: **azul profundo** (`#3B82F6` / `#2563EB`), **negro/grafito** (`#0B0F14`), **gris azulado** (`#334155` / `#94A3B8`), **blanco** (`#F8FAFC`). Sin morado, sin rosa, sin degradados llamativos.

---

## 1. Minimalista — "El corchete-V"
**Concepto**: una "V" construida con dos trazos rectos en ángulo, como un corchete o soporte de estantería visto de perfil — referencia discreta a "estante/colección" sin ilustrar nada literal.
**Justificación**: máxima legibilidad a cualquier tamaño; lenguaje de marca tipo Linear/Vercel (geometría pura, cero decoración).
**Colores**: trazo azul `#3B82F6` sobre fondo `#0B0F14` (oscuro) o grafito `#0F172A` sobre blanco (claro).
**Sidebar**: marca de 28×28 px sin caja, alineada a la izquierda junto al wordmark "Vaultly" en gris claro.
**Favicon**: el corchete solo, sin wordmark — reconocible incluso a 16 px.
**Encaje**: muy "producto técnico"; quizá demasiado austero para transmitir calidez de "colección personal".

## 2. Corporativo — "El sello de archivo"
**Concepto**: un sello/escudo geométrico hexagonal con una línea horizontal central (referencia a un sello de autenticidad / archivo certificado).
**Justificación**: comunica seguridad y permanencia — encaja con "vault" como custodia de algo valioso.
**Colores**: contorno gris azulado `#334155`, relleno azul `#2563EB` solo en la línea central.
**Sidebar**: emblema de 32×32 px con borde sutil, sensación "institucional".
**Favicon**: el hexágono se reconoce bien, pero pierde detalle interno a 16 px (riesgo de verse como un punto).
**Encaje**: transmite confianza, pero puede sentirse más "banco/fintech" que "app cultural".

## 3. Tecnológico — "Capas apiladas"
**Concepto**: tres barras horizontales de distinto ancho apiladas con pequeño desfase, formando simultáneamente una "V" en negativo y una estantería/pila de elementos (juegos, películas, libros…).
**Justificación**: doble lectura — organización (capas/categorías) + a la vez inicial de la marca; muy alineado con "biblioteca personal" y "seguimiento".
**Colores**: tres tonos de azul-grafito en degradado tonal sutil (`#2563EB` → `#475569` → `#94A3B8`), nunca arcoíris.
**Sidebar**: ícono compacto de 24–28 px, las barras se leen como "secciones" — refuerza la metáfora de navegación.
**Favicon**: funciona muy bien a 16 px porque son formas simples y de alto contraste.
**Encaje**: el más "tecnológico/SaaS" en el buen sentido — ordenado, moderno, atemporal.

## 4. Editorial — "El marcapáginas"
**Concepto**: una cinta/marcapáginas vertical con un pliegue en la base, combinada con una línea fina — alusión directa a libros/colecciones curadas.
**Justificación**: conecta con "descubrimiento" y "curaduría" más que con tecnología pura; tono más cálido y humano.
**Colores**: cinta en azul `#3B82F6`, pliegue en gris azulado oscuro.
**Sidebar**: se integra bien como ícono vertical, pero su forma alargada complica encajarlo en un cuadrado de avatar.
**Favicon**: pierde definición a tamaños pequeños (el pliegue se difumina).
**Encaje**: bonito pero menos "tecnológico/confianza" — se acerca más a una app de lectura que a un tracker multi-categoría.

## 5. Premium — "El prisma-V"
**Concepto**: una "V" formada por dos facetas triangulares con un degradado tonal interno muy sutil, como una gema o cristal tallado.
**Justificación**: sugiere "algo valioso guardado" (vault) con acabado pulido y exclusivo.
**Colores**: facetas en dos tonos de azul muy próximos (`#2563EB` / `#1E3A5F`), brillo mínimo en el borde.
**Sidebar**: efecto de faceta puede generar ruido visual a tamaños pequeños si no se simplifica mucho.
**Favicon**: requiere simplificar a una sola faceta — se pierde parte del concepto.
**Encaje**: el más arriesgado de "verse genérico tipo IA" si no se ejecuta con mucho cuidado (los prismas/gemas son un cliché visual de marcas "premium" genéricas).

---

## Elección final: **Concepto 3 — "Capas apiladas"**

Es el que mejor cumple **todos** tus criterios a la vez:
- **Profesional y atemporal**: geometría pura, sin ilustración ni cliché ("letras en un cuadrado", "gema brillante", "escudo gaming").
- **Tecnológico**: las barras evocan datos/capas/sistema de organización — encaja con Linear/GitHub/Raycast.
- **Funciona en todos los tamaños**: de favicon de 16 px a pantalla de login, sin perder definición (es la prueba de fuego de cualquier logo real).
- **Doble significado coherente con el producto**: "capas" = categorías que rastreas (videojuegos, películas, series, libros, conciertos) apiladas y organizadas = la promesa central de Vaultly. Y al mismo tiempo, las tres barras desplazadas trazan una "V" en el espacio negativo.
- **Una sola familia tonal** (azul → grafito → gris azulado): nunca compite con los acentos de categoría, así que el sistema de colores se mantiene limpio y jerárquico.

He creado el logo real (`Logo.tsx`, componente SVG reutilizable) con tres variantes — icono solo (sidebar/favicon/avatar), icono + wordmark (navbar/login), y wordmark solo — todas adaptadas a modo claro/oscuro mediante `currentColor` y los tokens de marca.
