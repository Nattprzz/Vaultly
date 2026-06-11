# Auditoria de Arquitectura y Producto - Vaultly

Documento basado en el estado actual del repositorio. Algunas respuestas distinguen entre lo que ya esta implementado en codigo, lo que esta parcialmente implementado con mocks y lo que seria una decision de producto pendiente.

## Producto

1. Vaultly permite explorar un catalogo cultural multi-categoria, buscar contenido, ver fichas, guardar items en un tracker personal, cambiar su estado, puntuar, escribir notas/resenas, consultar estadisticas, compartir un perfil publico y administrar catalogo/reportes desde un panel interno.
2. La accion principal sera buscar o abrir un elemento y actualizar su seguimiento: anadirlo al tracker, cambiar estado o puntuarlo.
3. Primera version imprescindible: registro/login, catalogo basico, busqueda por categoria, ficha de item, anadir al tracker, cambiar estado, puntuar, perfil basico, privacidad minima y persistencia en Supabase.
4. Futuras u opcionales: comparador, entidades avanzadas, rankings, recomendaciones, logros, feed social, colecciones, multiples seguimientos, premium, estadisticas avanzadas y moderacion sofisticada.
5. Funcionalidades no esenciales anadidas por valor percibido: comparador, entidades/personas, auditoria admin, reportes detallados, SEO avanzado, paginas legales, panel admin completo, graficas y muchas secciones de perfil.
6. Si hubiera que lanzar manana, eliminaria comparador, entidades avanzadas, admin complejo, auditoria, reportes sofisticados, rankings futuros, social avanzado y filtros demasiado especificos.
7. Un usuario lo usaria frente a Letterboxd, Backloggd o Goodreads porque Vaultly unifica varias categorias en una sola app, en vez de obligar a usar una plataforma distinta por tipo de contenido.
8. La funcionalidad estrella es el tracker cultural unificado por categorias.
9. Si se elimina el 80%, debe permanecer: catalogo, ficha de item, tracker personal, estados, puntuacion y perfil del usuario.
10. Resuelve mejor la fragmentacion entre plataformas especializadas.
11. Su diferencia es combinar videojuegos, peliculas, series, libros y conciertos en un unico tracker con categorias configurables.

## Registro y Onboarding

12. Si. El catalogo, fichas publicas, home y perfiles publicos pueden usarse sin cuenta.
13. En el codigo actual no se ve login con Google u otros proveedores; se usa Supabase Auth, que podria soportarlos si se configuran.
14. Si. Existe ruta `/auth/reset-password` y pagina de recuperacion.
15. Depende de la configuracion de Supabase Auth; en el codigo no se ve una logica propia de verificacion de correo.
16. No hay flujo claro de eliminacion de cuenta implementado en el codigo revisado.
17. Si se elimina desde Supabase Auth, por `on delete cascade` se eliminaria el perfil y datos dependientes como ajustes y tracker.
18. Podrian conservarse catalogo, entidades, reportes anonimizados o auditoria si no dependen directamente del usuario o usan `on delete set null`.
19. Tras registrarse, el trigger crea `profiles` y `user_tracker_settings`; despues el usuario deberia entrar en la app con categorias por defecto o las seleccionadas.
20. Parcialmente. La app tiene navegacion y catalogo, pero el primer flujo podria ser mas guiado.
21. Existe soporte de categorias seleccionadas en metadata y settings, pero no se aprecia un onboarding fuerte como flujo separado.
22. Si, al menos a nivel de modelo y trigger: `selected_categories` puede venir de metadata del usuario.
23. El tracker comienza vacio. Actualmente se ayuda mas mediante catalogo/busqueda que mediante una carga guiada inicial.

## Perfil de Usuario

24. Almacena id, email, username, display_name, initials, bio, avatar_url, role, status, privacidad y timestamps.
25. Puede modificar datos propios de perfil y preferencias permitidas; la RLS impide elevar su `role`.
26. Si. Existe `avatar_url`.
27. Si. `is_public`, `show_ratings`, `show_reviews` y `share_tracker`.
28. Si. Hay ajustes de categorias activas, apariencia, idioma, privacidad, notificaciones y cuenta en la UI.
29. Hay configuracion de idioma con i18next; region no se ve claramente implementada.

## Tracking

30. Estados: `pending`, `in_progress`, `completed`, `dropped`.
31. Si. Son los mismos para todas las categorias.
32. No en el estado actual.
33. Si. `rating` entre 1 y 10.
34. Si. Campo `review` en `user_item_tracking`.
35. Si en base de datos: `started_at` y `finished_at`; hay que verificar si toda la UI los edita.
36. No se ve un campo de favoritos especifico.
37. No hay estado `archived`.
38. No hay campo de ocultar entradas concretas.
39. No. La unicidad `(user_id, item_slug)` permite una entrada por item y usuario.
40. Los estados expresan progreso; una lista de favoritos solo expresa interes o preferencia.
41. No hay campo de tiempo invertido.
42. No hay soporte explicito de relecturas, revisionados o rejugadas.
43. No. La arquitectura actual lo impide por unicidad.
44. No se ven objetivos de usuario implementados.
45. No se ven colecciones personalizadas implementadas.

## Catalogo

46. Lo crean APIs externas mediante cache y administradores mediante panel admin.
47. No. Tambien pueden existir items manuales creados por admin.
48. Si. `admin-catalog` permite crear items manuales.
49. No directamente en el estado actual.
50. Si una API elimina contenido, el item cacheado puede seguir existiendo en `catalog_items`.
51. Si una API modifica datos, el cache solo cambia si se vuelve a sincronizar o se hace `force_sync`.
52. Se cachean slug, titulo, categoria, source, source_item_id, descripcion, imagenes, fecha y metadata JSON.
53. No hay TTL definido; permanece indefinidamente hasta actualizacion o borrado.
54. Con unicidad por `(category, source, source_item_id)` y `(category, slug)`.
55. Para contenido externo, el dato definitivo inicial procede de APIs; una vez cacheado, Supabase pasa a ser la fuente operativa.
56. Si falla una API, se puede seguir usando cache existente; las busquedas nuevas fallaran.
57. Actualmente se tratan como fuentes distintas; no hay deduplicacion cross-API avanzada.
58. Administradores.
59. Si. Existe `item_reports`.
60. Puede reportar errores; sugerencias de cambio como flujo formal no se ve separado.
61. No directamente; podria reportar o un admin crearlo manualmente.

## Busqueda y Descubrimiento

62. Filtros: ano minimo/maximo, rating minimo, genero, plataforma, idioma, ciudad, duracion, numero de paginas, estado de serie y ordenacion.
63. Si. Busqueda por nombre/titulo.
64. Si, como filtro sobre resultados disponibles.
65. Si.
66. Si, especialmente en videojuegos.
67. Si.
68. Para estado de serie si aparece en metadata; no para estado personal del tracker en catalogo.
69. Si. Los filtros se combinan.
70. Actualmente descubre contenido buscando, navegando categorias, usando mocks/listados y relacionados.
71. No hay recomendaciones personalizadas reales.
72. No aplica aun.
73. No se ven tendencias reales implementadas.
74. No se ven rankings reales implementados.
75. Hay secciones destacadas/mock en home, pero no listas destacadas reales basadas en datos.

## Estadisticas

76. Muestra estadisticas de dashboard, progreso por categoria, actividad reciente/semanal, stats de perfil y comunidad segun componentes existentes.
77. No.
78. No se ve una estadistica anual fuerte implementada.
79. Si, hay progreso/estadisticas por categoria.
80. Parece calculable y algunas vistas muestran medias, pero depende de hooks/componentes concretos.
81. Hay actividad reciente/semanal; rachas como concepto no se ven.
82. No.
83. Faltan horas, objetivos, estadisticas anuales, comparativas temporales, rewatch/replay, distribucion por generos y exportacion.
84. Para una primera version pueden sobrar graficas avanzadas, comparador y estadisticas admin muy detalladas.
85. No se ven insignias/logros.

## Social

86. Puede ver perfil publico, tracker compartido, ratings y resenas si las flags de privacidad lo permiten.
87. Nunca deberia ver email privado, datos de autenticacion, ajustes internos, datos de otros usuarios no publicos, roles sensibles ni auditoria.
88. No.
89. No.
90. Hay actividad reciente en dashboard/perfil, pero no necesariamente social.
91. No hay feed social real.
92. No se ve interaccion directa entre usuarios.
93. No se ven comentarios entre usuarios.
94. No se ven likes.
95. Para consultar gustos, tracker, resenas y progreso cultural de otra persona.

## Roles y Permisos

96. Si, si existe catalogo editable, moderacion, reportes y gestion de usuarios.
97. Gestionar usuarios, catalogo, entidades, reportes, resenas y auditoria.
98. Si, mediante seccion admin/users y hooks admin.
99. Si.
100. Si.
101. No para una primera version.
102. Si. USER y ADMIN bastan.
103. USER existe para usuarios normales; ADMIN para operaciones que afectan datos globales o moderacion.
104. USER: gestionar su tracker. ADMIN: modificar catalogo/usuarios/reportes.
105. Si se elimina ADMIN, habria que gestionar catalogo y moderacion directamente en base de datos o eliminar esas funciones.
106. Puede haber duplicidad entre validacion frontend `ProtectedRoute requireAdmin`, RLS y Edge Functions; es duplicacion defensiva aceptable.
107. Frontend valida navegacion y visibilidad; backend valida con RLS, `is_admin()` y comprobacion de token en Edge Functions.
108. No se aprecia una operacion sensible obvia sin validacion, pero conviene auditar todos los hooks admin.
109. Si intenta modificar datos manualmente, RLS deberia bloquear lo no permitido; Edge Functions admin tambien comprueban token/rol.

## Arquitectura y Dominio

110. La entidad principal de negocio es la entrada de tracking de un usuario sobre un item de catalogo.
111. Minimo: `profiles`, `user_tracker_settings`, `catalog_items`, `user_item_tracking`.
112. `item_entities` existe para resolver la relacion muchos-a-muchos entre items y entidades; no es parche, es tabla puente.
113. Las mas dificiles de explicar a un MVP son `admin_audit_logs`, `item_reports` y `entities`.
114. La relacion items-entidades puede crecer en complejidad, pero es razonable.
115. Del usuario: perfil, ajustes, tracker, ratings/resenas personales. Del catalogo: items, metadata, entidades. De terceros: source IDs, imagenes, ratings externos y metadata importada.
116. Metadata externa de IGDB/TMDB/Google Books/Ticketmaster/AniList.
117. Si cambia el proveedor, habria que adaptar Edge Functions y normalizadores; el frontend sufriria poco si se mantiene el contrato.
118. Parcialmente si se mantiene `CatalogItem` y metadata compatible; no totalmente porque hay campos especificos por proveedor.
119. Si. Las categorias estan parametrizadas, aunque habria que ajustar constraints, mappings, filtros y UI.

## Base de Datos

120. `profiles`: perfil/rol; `user_tracker_settings`: categorias activas; `catalog_items`: cache/catalogo; `user_item_tracking`: tracker; `entities`: personas/organizaciones; `item_entities`: relacion item-entidad; `item_reports`: incidencias; `admin_audit_logs`: auditoria.
121. Para MVP eliminaria `admin_audit_logs` o `entities`.
122. `admin_audit_logs`, porque falta confirmar si se escribe consistentemente en todas las acciones.
123. Posibles columnas a revisar: `cover_url` frente a `image_url`, `item_id` nullable frente a `item_slug`, y campos de fechas si la UI no los usa.
124. Si. Hay duplicidad potencial entre `image_url`/`cover_url`, item data cacheada y datos externos en metadata.
125. Algunos campos de `metadata` podrian ser tablas si se necesitan filtros globales fuertes: generos, plataformas, reparto, autores.
126. Para MVP, entidades relacionadas podrian simplificarse en JSON si no se requiere navegacion por entidad.

## API y Backend

127. `catalog-search` probablemente sera el endpoint mas usado.
128. `catalog-search` y `catalog-item`, por integracion externa, cache y entidades.
129. Hay repeticion conceptual entre `catalog-search` y `catalog-item` en extraccion/upsert de entidades.
130. Si. Logica de slug de entidades, extraccion de entidades y mapeo de categorias se repite.
131. Si. Validacion de categorias/admin aparece en varios sitios.
132. Parcialmente. Muchas respuestas usan `{ data, source }` o `{ error }`, pero no hay contrato global unico.
133. `supabase/functions/catalog-search/index.ts`, porque mezcla busqueda, cache, normalizacion y entidades.
134. Reescribiria la capa de Edge Functions hacia servicios compartidos mas pequenos.
135. `src/lib/categories.ts` esta bien disenado: centraliza mappings.
136. Peor disenado: duplicacion entre Edge Functions de catalogo y posible mezcla de mocks/datos reales en paginas.

## Rendimiento y Escalabilidad

137. Busqueda/listado de `catalog_items` por categoria y titulo.
138. Busqueda externa + upsert masivo + creacion de entidades.
139. Ya existen indices por categoria, titulo tsvector, tracking user, item_slug, entities type, reports status y audit created. Faltaria considerar indices por `source_item_id`, `slug`, `category/title` y `user_id/category/status`.
140. Con 10.000 items deberia funcionar si los indices se usan bien.
141. Con 100.000 items, `ilike '%query%'` puede volverse costoso; habria que usar busqueda full-text o motor externo.
142. Cuello de botella: busqueda externa, rate limits y consultas de catalogo sin busqueda optimizada.
143. Con 100.000 usuarios rompe primero tracker/reportes/estadisticas si se calculan en cliente o sin agregados.
144. `user_item_tracking` crecera mas rapido.
145. Edge Functions de busqueda y APIs externas.
146. Busqueda/catalogo y estadisticas agregadas.
147. No se ve monitorizacion propia.
148. No se ven logs centralizados; solo logs de Supabase/console.
149. No se ve estrategia explicita de backups; dependeria de Supabase.

## Seguridad

150. Con Supabase Auth.
151. Las contrasenas las gestiona Supabase Auth; no se almacenan en la app.
152. Depende de Supabase Auth y configuracion del proyecto.
153. No se ven rate limits propios en Edge Functions.
154. Con RLS y filtros por `auth.uid()`.
155. Con RLS, `public.is_admin()` y comprobacion de token/rol en Edge Functions admin.
156. Devuelve error; si hay cache previa, parte de la app puede seguir funcionando.

## Administracion y Moderacion

157. Panel admin para usuarios, catalogo, entidades, resenas, reportes y auditoria.
158. Puede suspenderse/gestionarse desde admin si la UI lo soporta; falta flujo anti-spam automatico.
159. Moderacion manual de resenas/reportes; no se ve moderacion automatica.
160. Usuario puede reportar y admin corregir ficha o resolver reporte.
161. Existe tabla de auditoria; para ser auditoria real debe verificarse que todas las acciones admin escriben logs consistentemente.

## Monetizacion

162. Podria monetizar con plan premium, afiliados, exportaciones avanzadas, estadisticas pro o recomendaciones.
163. Premium: colecciones avanzadas, estadisticas profundas, exportacion/importacion, perfiles avanzados, recomendaciones, sincronizaciones y objetivos.
164. Pagaria quien quiera un tracker unico, historico completo, estadisticas avanzadas y personalizacion.
165. Coste mensual inicial bajo-medio: Supabase, dominios, hosting, APIs externas y posibles limites de uso; exacto depende de trafico.
166. Rentabilidad dependeria de conversion premium y costes API; podria ser rentable con pocos miles de usuarios activos si el coste por usuario se mantiene bajo.

## Experiencia de Usuario (UX)

167. Aproximadamente 2-4 clics: buscar, abrir item, anadir/configurar estado.
168. Aproximadamente 1-2 clics si el item ya esta visible en sidebar/modal.
169. Aproximadamente 1-3 clics segun modal/componente.
170. El alta inicial del tracker puede requerir buscar manualmente muchos elementos; ahi hay friccion.
171. La pantalla mas importante es catalogo/detalle con accion de anadir al tracker.
172. Probablemente admin o catalogo con mezcla de filtros/mocks/datos reales; requiere validacion visual, pero no es necesariamente mala.

## TFG

173. Demostraria login, busqueda real, cache en Supabase, detalle de item, anadir al tracker, perfil publico, privacidad, admin y reportes.
174. No ensenaria funciones poco maduras como comparador, social inexistente, recomendaciones futuras o admin demasiado detallado si no esta pulido.
175. Faltan onboarding claro, uso consistente de datos reales, recuperacion/verificacion documentada, eliminacion de cuenta, recomendaciones o al menos MVP cerrado.
176. Preguntaran por diferenciacion, RLS, cache, APIs externas, duplicados, privacidad, escalabilidad y por que usar Supabase.
177. Lo mas dificil de defender: mezcla de mocks y datos reales, y cache sin TTL.
178. Habra que justificar la arquitectura de cache con Edge Functions y categorias normalizadas.
179. Mayor valor academico: integracion full-stack con Supabase, RLS, APIs externas, cache, roles y producto multi-dominio.
180. Version ideal TFG: catalogo real estable, tracker completo, dashboard simple, perfil publico, admin minimo y demo fluida sin funcionalidades sobrantes.

## Futuro y Mantenimiento

181. Proximo mes: cerrar MVP, onboarding, limpiar mocks, mejorar UX de anadir items, completar settings, documentar RLS y probar flujos.
182. Proximos seis meses: recomendaciones, colecciones, import/export, estadisticas avanzadas, social ligero, deduplicacion cross-API y monitorizacion.
183. Incompletas: onboarding, catalogo real sin mocks, eliminacion de cuenta, recomendaciones, auditoria real y moderacion.
184. Poco valor inmediato: comparador, auditoria compleja, entidades profundas y admin demasiado amplio.
185. Riesgos tecnicos: cache sin TTL, repeticion en Edge Functions, dependencia de APIs externas, busqueda `ilike`, mezcla de slugs/UUIDs y mocks.
186. Riesgos de producto: intentar competir con demasiadas plataformas a la vez, exceso de funcionalidades y propuesta diferencial poco enfocada.
187. Impide considerarlo terminado: falta de MVP cerrado, flujos incompletos, falta de pruebas visibles, datos mock y decisiones pendientes de privacidad/cuenta.
188. Vision 3-5 anos: Vaultly como tracker cultural universal, con catalogo multi-fuente, recomendaciones personales, perfiles publicos, colecciones, estadisticas potentes y comunidad ligera centrada en descubrir y recordar experiencias culturales.
