# Documentacion del proyecto Vaultly

Este documento resume el proyecto completo para que otra IA, como ChatGPT, pueda entender rapidamente que es Vaultly, como esta organizado, que tecnologias usa y cuales son sus piezas principales.

## 1. Resumen ejecutivo

Vaultly es una aplicacion web de catalogo y tracker personal para consumo cultural. Permite explorar contenidos, guardarlos en un tracker privado, puntuar, reseñar y compartir parte del perfil publicamente.

Las categorias principales son:

- Videojuegos
- Peliculas
- Series
- Libros
- Conciertos

El producto combina tres areas:

- Catalogo publico: busqueda, filtros y detalle de items.
- Tracker privado: seguimiento personal por usuario, estados, puntuaciones y reseñas.
- Administracion: gestion de usuarios, catalogo, entidades, reportes y auditoria.

El frontend esta construido con React, Vite, TypeScript y Tailwind CSS. El backend principal es Supabase: Auth, base de datos PostgreSQL, RLS y Edge Functions. Las llamadas a APIs externas se hacen desde Edge Functions para no exponer claves privadas en el navegador.

## 2. Stack tecnico

### Frontend

- React 19
- TypeScript
- Vite
- React Router DOM 7
- Tailwind CSS
- i18next + react-i18next
- Recharts para graficas
- Lucide React y clases de iconos tipo Remix Icon usadas en componentes
- Supabase JS Client

### Backend

- Supabase Auth
- Supabase PostgreSQL
- Supabase Row Level Security
- Supabase Edge Functions en Deno

### APIs externas integradas desde Edge Functions

- IGDB: videojuegos
- TMDB: peliculas y series
- Google Books: libros
- Ticketmaster: conciertos
- AniList: anime/manga, segun funciones existentes

## 3. Estructura general del repositorio

```text
.
|-- src/
|   |-- App.tsx
|   |-- main.tsx
|   |-- index.css
|   |-- router/
|   |-- components/
|   |-- pages/
|   |-- hooks/
|   |-- lib/
|   |-- mocks/
|   `-- i18n/
|-- supabase/
|   |-- migrations/
|   `-- functions/
|-- public/
|-- eslint-rules/
|-- package.json
|-- vite.config.ts
|-- tailwind.config.ts
|-- README.md
`-- project_plan.md
```

### Carpetas importantes

- `src/pages`: paginas principales de la app, separadas por dominio: home, catalog, tracker, dashboard, profile, admin, settings, etc.
- `src/pages/*/components`: componentes especificos de cada pagina.
- `src/components/feature`: componentes compartidos de producto, como Navbar, ProtectedRoute, SeoHead y NotificationBell.
- `src/hooks`: hooks de acceso a datos, autenticacion, settings, catalogo, tracker, admin, reportes y estadisticas.
- `src/lib`: utilidades compartidas, cliente Supabase, categorias, URLs de Edge Functions, auditoria y site config.
- `src/mocks`: datos mock usados para mostrar contenido inicial o fallback visual.
- `supabase/migrations`: esquema SQL de la base de datos y ajustes del trigger de registro.
- `supabase/functions`: Edge Functions y clientes compartidos para APIs externas.

## 4. Configuracion de Vite y runtime

El punto de entrada principal es `src/main.tsx`, que monta `App`.

`src/App.tsx` envuelve la app con:

- `I18nextProvider`
- `BrowserRouter`
- `AppRoutes`

`vite.config.ts` define:

- Alias `@` hacia `./src`.
- `base` desde `BASE_PATH` o `/`.
- Variables globales como `__BASE_PATH__`, `__IS_PREVIEW__` y valores relacionados con Readdy.
- Autoimport de React, React Router y react-i18next.
- Servidor local en puerto `3000`.
- Build en carpeta `out`.

## 5. Rutas de la aplicacion

Las rutas estan definidas en `src/router/config.tsx` y se cargan con lazy loading.

### Rutas publicas

- `/`: home
- `/auth`: login/registro
- `/auth/reset-password`: recuperacion de contraseña
- `/catalog`: catalogo general
- `/catalog/:category`: catalogo por categoria
- `/catalog/:category/:id`: detalle de item
- `/u/:username`: perfil publico
- `/person/:id`: pagina de persona
- `/entity/:slug`: pagina de entidad
- `/entities`: listado de entidades
- `/compare`: comparador
- `/settings`: ajustes, actualmente publica en routing
- `/privacy`: privacidad
- `/terms`: terminos
- `/contact`: contacto
- `*`: 404

### Rutas protegidas

Protegidas por `ProtectedRoute`:

- `/dashboard`
- `/tracker`
- `/tracker/:category`
- `/profile`

### Rutas de admin

Protegidas por `ProtectedRoute requireAdmin`:

- `/admin`
- `/admin/users`
- `/admin/catalog`
- `/admin/reviews`
- `/admin/entities`
- `/admin/reports`
- `/admin/audit`

`ProtectedRoute` usa `useAuth`. Si no hay sesion redirige a `/auth`. Si una ruta requiere admin y el perfil no tiene `role = 'admin'`, redirige a `/dashboard`.

## 6. Categorias y nomenclatura

Hay dos nomenclaturas de categorias:

### Categorias internas de la app

Usadas en base de datos y UI:

- `videojuegos`
- `peliculas`
- `series`
- `libros`
- `conciertos`

### Categorias de API

Usadas al llamar Edge Functions:

- `games`
- `movies`
- `series`
- `books`
- `concerts`

El mapeo esta en `src/lib/categories.ts`:

- `API_CATEGORY_BY_APP`
- `APP_CATEGORY_BY_API`
- `toApiCategory`
- `toAppCategory`
- `SCHEMA_TYPE_BY_APP_CATEGORY`

Este mapeo es importante porque el frontend puede trabajar con rutas en español, pero las funciones externas esperan categorias en ingles.

## 7. Autenticacion

El hook principal es `src/hooks/useAuth.ts`.

Responsabilidades:

- Recupera la sesion con `supabase.auth.getSession()`.
- Escucha cambios con `supabase.auth.onAuthStateChange()`.
- Carga el perfil desde la tabla `profiles`.
- Si el perfil tiene `status = 'suspended'`, cierra sesion.
- Expone `user`, `profile`, `session`, `isLoggedIn`, `loading`, `logout` y `refreshProfile`.

El perfil incluye:

- `id`
- `email`
- `display_name`
- `initials`
- `username`
- `bio`
- `avatar_url`
- preferencias publicas
- `role`
- `status`

## 8. Modelo de datos Supabase

El esquema principal esta en `supabase/migrations/20260506140000_initial_schema.sql`.

### `profiles`

Perfil extendido de cada usuario. Se relaciona con `auth.users`.

Campos clave:

- `id`
- `email`
- `username`
- `display_name`
- `initials`
- `bio`
- `avatar_url`
- `role`: `user` o `admin`
- `status`: `active`, `suspended` o `pending`
- `is_public`
- `show_ratings`
- `show_reviews`
- `share_tracker`

### `user_tracker_settings`

Ajustes del tracker por usuario.

Campos clave:

- `user_id`
- `selected_categories`

Por defecto selecciona peliculas, series y libros.

### `catalog_items`

Catalogo cacheado de items culturales.

Campos clave:

- `id`
- `slug`
- `title`
- `category`
- `source`
- `source_item_id`
- `description`
- `image_url`
- `cover_url`
- `release_date`
- `metadata`

Tiene unicidad por:

- `(category, source, source_item_id)`
- `(category, slug)`

### `user_item_tracking`

Entradas del tracker personal.

Campos clave:

- `id`
- `user_id`
- `item_id`
- `item_slug`
- `category`
- `status_en`: `pending`, `in_progress`, `completed`, `dropped`
- `rating`
- `review`
- `started_at`
- `finished_at`

Tiene unicidad por `(user_id, item_slug)`.

### `entities`

Personas u organizaciones relacionadas con items.

Ejemplos:

- desarrolladores
- publishers
- directores
- actores
- creadores
- autores
- artistas

Campos:

- `id`
- `name`
- `type`
- `slug`
- `image`
- `bio`
- `metadata`

### `item_entities`

Tabla puente entre items y entidades.

Campos:

- `item_id`
- `entity_id`
- `role`

La clave primaria es `(item_id, entity_id, role)`.

### `item_reports`

Reportes de usuarios sobre problemas en items del catalogo.

Campos clave:

- `item_id`
- `item_slug`
- `item_title`
- `item_category`
- `user_id`
- `reason`
- `details`
- `status`: `pending`, `resolved`, `dismissed`
- `resolved_at`
- `resolved_note`

### `admin_audit_logs`

Historial de acciones administrativas.

Campos clave:

- `user_id`
- `action`
- `entity`
- `entity_id`
- `metadata`

## 9. Seguridad y RLS

El esquema activa RLS en:

- `profiles`
- `user_tracker_settings`
- `catalog_items`
- `user_item_tracking`
- `entities`
- `item_entities`
- `item_reports`
- `admin_audit_logs`

Politicas principales:

- Los perfiles publicos son legibles si `is_public = true`, si el usuario es dueño, o si el usuario actual es admin.
- Los usuarios pueden actualizar su propio perfil, pero no elevar su `role`.
- Los admins pueden gestionar perfiles.
- El catalogo es legible publicamente.
- Solo admins pueden escribir en catalogo, entidades e item_entities.
- El tracker es legible por el dueño, admins o publicamente si el perfil permite compartir tracker.
- Solo el dueño puede escribir sus entradas del tracker.
- Los reportes pueden ser creados por usuarios y gestionados por admins.
- La auditoria solo es legible/escribible por admins.

La funcion `public.is_admin()` comprueba si `auth.uid()` tiene perfil con `role = 'admin'`.

## 10. Registro de usuarios

Hay un trigger `on_auth_user_created` que llama a `public.handle_new_user()` cuando se crea un usuario en `auth.users`.

La migracion `20260507110000_fix_auth_signup_trigger.sql` mejora este flujo:

- Normaliza usernames con `normalize_username`.
- Expone `username_available(candidate text)`.
- Evita duplicados añadiendo parte del UUID si el username ya existe.
- Usa email fallback si falta email.
- Crea o actualiza `profiles`.
- Crea o actualiza `user_tracker_settings`.
- Lee `selected_categories` desde metadata del usuario si viene informado.

## 11. Catalogo

La pagina principal es `src/pages/catalog/page.tsx`.

Funcionalidades:

- Tabs por categoria.
- Categoria `Todo`.
- Busqueda con debounce de 500 ms.
- Busqueda externa si hay al menos 2 caracteres y una categoria API valida.
- Filtros por año, rating, genero, plataforma, idioma, ciudad, duracion, paginas y estado de serie.
- Ordenacion.
- Infinite scroll con `IntersectionObserver`.
- Datos mock como fallback o estado inicial.
- Indicador de fuente: cache, API externa o guardado en cache.

El hook de busqueda es `src/hooks/useCatalogSearch.ts`.

Responsabilidades:

- Construye URL hacia `catalog-search`.
- Maneja estado de carga, error, pagina y `hasMore`.
- Usa `AbortController` para cancelar busquedas anteriores.
- Mantiene cache en memoria por pagina con clave `category:query:page`.
- Deduplica resultados por `slug` al cargar mas.

## 12. Detalle de item

La pagina es `src/pages/catalog/detail/page.tsx`.

Funcionalidades:

- Lee `category` e `id` de la URL.
- Usa mock si el ID existe en `ITEM_DETAIL_MOCK`.
- Si parece slug real, carga datos con `useCatalogItem`.
- Convierte `CatalogItemFull` al shape visual `ItemDetail`.
- Renderiza:
  - `ItemHero`
  - `ItemInfo`
  - `RelatedPeople`
  - `ItemGallery`
  - `ItemCommunityStats`
  - `ItemReviews`
  - `ItemTrackerSidebar`
  - `RelatedItems`
- Genera SEO con `SeoHead` y JSON-LD segun la categoria.

## 13. Tracker

El hook principal es `src/hooks/useTracker.ts`.

Responsabilidades:

- Carga entradas desde `user_item_tracking` del usuario actual.
- Convierte filas de base de datos a `TrackerEntry`.
- Expone:
  - `entries`
  - `getEntry`
  - `addOrUpdate`
  - `remove`
  - `isTracked`
  - `loading`

Estados posibles:

- `pending`
- `in_progress`
- `completed`
- `dropped`

`addOrUpdate` hace actualizacion optimista en UI y luego:

- Si existe una fila para `(user_id, item_slug)`, la actualiza.
- Si no existe, inserta una nueva.

`remove` borra la entrada del estado local de forma optimista y despues elimina la fila en Supabase.

## 14. Edge Functions

Las funciones viven en `supabase/functions`.

### `catalog-search`

Funcion de busqueda del catalogo.

Entrada por query params:

- `category`
- `query`
- `page`

Flujo:

1. Valida categoria y query.
2. Mapea categoria API a categoria interna.
3. Busca primero en `catalog_items` usando `ilike` sobre `title`.
4. Si hay resultados cacheados, devuelve `source: 'cache'`.
5. Si no hay cache, llama a la API externa correspondiente.
6. Inserta o actualiza los items en `catalog_items`.
7. Extrae entidades desde metadata y las inserta en `entities` e `item_entities`.
8. Devuelve `source: 'external_cached'` o `external`.

### `catalog-item`

Funcion para obtener detalle de un item.

Entrada por query params:

- `slug`
- `category`
- `source_id`
- `force_sync`

Flujo:

1. Si no hay `force_sync`, intenta leer desde cache.
2. Si el item cacheado no tiene entidades vinculadas, intenta crearlas en background.
3. Si no esta en cache, resuelve categoria y source ID.
4. Llama a la API externa adecuada.
5. Guarda el item en `catalog_items`.
6. Inserta entidades relacionadas.
7. Devuelve item y fuente.

### `admin-catalog`

CRUD administrativo del catalogo.

Requiere token Bearer y comprueba que el usuario tenga perfil con `role = 'admin'`.

Metodos:

- `GET`: lista items con paginacion, filtro por categoria y busqueda.
- `POST`: crea item manual.
- `PATCH`: actualiza item por `id`.
- `DELETE`: elimina item por `id`.

### Otras funciones

Tambien existen:

- `catalog-entity`
- `item-reports`
- `search-anime`

Ademas, en `_shared/api` estan los clientes/normalizadores para:

- `anilist.ts`
- `googleBooks.ts`
- `igdb.ts`
- `ticketmaster.ts`
- `tmdb.ts`
- `types.ts`
- `utils.ts`

## 15. Administracion

La pagina de admin es `src/pages/admin/page.tsx`.

Secciones:

- `overview`: resumen general
- `users`: gestion de usuarios
- `catalog`: gestion de catalogo
- `entities`: entidades relacionadas
- `reviews`: moderacion de reseñas
- `reports`: reportes de usuarios
- `audit`: auditoria

Componentes principales:

- `AdminSidebar`
- `AdminOverview`
- `AdminUsers`
- `AdminCatalog`
- `AdminReviews`
- `AdminReports`
- `AdminEntities`
- `AdminAuditLogs`
- `ItemEntitiesEditor`

Hooks relacionados:

- `useAdminUsers`
- `useAdminCatalog`
- `useAdminEntities`
- `useAdminItemEntities`
- `useAdminReports`
- `useAdminAuditLogs`

## 16. Perfiles y visibilidad publica

El sistema separa perfil privado y perfil publico.

Rutas:

- `/profile`: perfil privado del usuario autenticado.
- `/u/:username`: perfil publico.

Las flags de privacidad en `profiles` controlan que se muestra:

- `is_public`
- `show_ratings`
- `show_reviews`
- `share_tracker`

La RLS permite leer entradas de tracker de otro usuario si el perfil es publico y permite compartir tracker.

## 17. Entidades y personas

El proyecto tiene dos conceptos cercanos:

- `person`: ruta `/person/:id`, probablemente orientada a una persona concreta.
- `entity`: ruta `/entity/:slug`, basada en la tabla `entities`.

Las Edge Functions extraen entidades desde metadata externa:

- Juegos: developers y publishers.
- Peliculas: director y reparto.
- Series: creadores y reparto.
- Libros: autores.
- Conciertos: artistas.

Esto permite navegar de un item a personas/organizaciones relacionadas y mostrar trabajos relacionados.

## 18. SEO e internacionalizacion

### SEO

El componente `SeoHead` se usa para:

- title
- description
- keywords
- canonical
- Open Graph
- JSON-LD
- noindex en admin

Las paginas de catalogo y detalle generan JSON-LD con tipos de Schema.org:

- `VideoGame`
- `Movie`
- `TVSeries`
- `Book`
- `MusicEvent`

### i18n

La configuracion esta en `src/i18n/index.ts`.

- Usa i18next.
- Usa `i18next-browser-languagedetector`.
- Usa `react-i18next`.
- `lng` inicial configurado como `en`.
- `fallbackLng` en `en`.
- Recursos desde `src/i18n/local/index.ts`.

## 19. Variables de entorno

Segun `README.md`, se esperan estas variables:

```env
VITE_PUBLIC_SUPABASE_URL=
VITE_PUBLIC_SUPABASE_ANON_KEY=
VITE_PUBLIC_SUPABASE_FUNCTIONS_URL=
VITE_SITE_URL=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
IGDB_CLIENT_ID=
IGDB_CLIENT_SECRET=
TMDB_API_KEY=
GOOGLE_BOOKS_API_KEY=
TICKETMASTER_API_KEY=
TICKETMASTER_SECRET=
```

Importante:

- Las variables `VITE_*` se exponen al frontend.
- Las claves privadas no deben usarse en frontend.
- Las claves privadas de APIs externas y `SUPABASE_SERVICE_ROLE_KEY` deben estar solo en Supabase Edge Functions/secrets.

## 20. Comandos principales

```bash
npm install
npm run dev
npm run lint
npm run type-check
npm run build
```

Scripts definidos:

- `dev`: arranca Vite.
- `build`: genera build de produccion en `out`.
- `preview`: sirve la build.
- `lint`: ejecuta ESLint sobre `src`.
- `type-check`: ejecuta TypeScript sin emitir archivos.

## 21. Flujo de datos principal

### Busqueda en catalogo

1. Usuario abre `/catalog/:category`.
2. Escribe una query.
3. `CatalogPage` aplica debounce.
4. `useCatalogSearch` llama a `catalog-search`.
5. `catalog-search` busca primero en `catalog_items`.
6. Si hay cache, devuelve resultados.
7. Si no hay cache, llama a API externa.
8. Guarda resultados en Supabase.
9. Devuelve items normalizados.
10. Frontend muestra grid, filtros, fuente y paginacion.

### Detalle de item

1. Usuario abre `/catalog/:category/:id`.
2. `ItemDetailPage` decide si usar mock o slug real.
3. `useCatalogItem` llama a `catalog-item`.
4. `catalog-item` lee cache o sincroniza desde API externa.
5. El frontend transforma metadata en campos visuales.
6. Se muestran hero, datos, entidades, reseñas, tracker y relacionados.

### Añadir al tracker

1. Usuario autenticado interactua con `ItemTrackerSidebar` o modal.
2. Se llama a `useTracker.addOrUpdate`.
3. La UI se actualiza optimistamente.
4. Supabase inserta o actualiza `user_item_tracking`.
5. La entrada queda asociada a `user_id` y `item_slug`.

### Perfil publico

1. Visitante abre `/u/:username`.
2. Se carga perfil si `is_public` lo permite.
3. Se muestran estadisticas, tracker y reseñas segun flags de privacidad.

### Admin

1. Usuario entra en `/admin/*`.
2. `ProtectedRoute requireAdmin` valida `profile.role`.
3. Componentes admin usan hooks especificos.
4. Operaciones sensibles pasan por RLS o Edge Functions con comprobacion admin.

## 22. Estado actual y mocks

El proyecto contiene muchos mocks en `src/mocks`, por ejemplo:

- `catalog.ts`
- `itemDetail.ts`
- `dashboard.ts`
- `trackerEntries.ts`
- `publicProfile.ts`
- `people.ts`
- `admin.ts`

Esto indica que varias vistas pueden renderizar datos de ejemplo mientras se conectan completamente a Supabase o APIs reales.

El catalogo mezcla:

- datos mock cuando no hay busqueda externa activa;
- resultados reales/cacheados cuando hay busqueda por categoria.

## 23. Puntos importantes para una IA que modifique el proyecto

- Respetar el alias `@` para imports desde `src`.
- Mantener la separacion entre categorias internas y categorias API.
- No poner claves privadas en frontend.
- Para nuevas llamadas externas, crear o extender Edge Functions.
- Para datos privados, revisar RLS antes de asumir que una query funcionara desde el cliente anon.
- Usar `ProtectedRoute` para rutas privadas o admin.
- Mantener los tipos de tracker status existentes: `pending`, `in_progress`, `completed`, `dropped`.
- Si se añaden nuevas categorias, hay que tocar:
  - `src/lib/categories.ts`
  - constraints SQL
  - hooks/filtros
  - mocks
  - Edge Functions
  - UI de categorias
  - SEO Schema.org si aplica
- Si se añaden campos a `catalog_items.metadata`, deben normalizarse en las funciones compartidas de API y consumirse con cuidado en frontend.

## 24. Riesgos o detalles a revisar

- Algunos textos del proyecto parecen tener caracteres mal codificados en archivos existentes, por ejemplo acentos renderizados como secuencias extrañas. Conviene revisar codificacion UTF-8.
- `AdminPage` contiene un comentario que dice que en produccion comprobaria `is_admin`, aunque el routing ya usa `ProtectedRoute requireAdmin`. Aun asi, conviene revisar que todos los endpoints admin validen permisos en backend.
- `settings` esta como ruta publica en `config.tsx`. Si debe ser privada, habria que envolverla en `ProtectedRoute`.
- `useTracker` usa `item_slug` como identificador principal (`itemId`) y no siempre `item_id` UUID. Esto es intencional en el codigo actual, pero hay que tenerlo en cuenta si se migra a relaciones estrictas con `catalog_items.id`.
- El catalogo usa mocks cuando no hay busqueda externa. Si se quiere un catalogo 100% real, habria que cargar listados reales desde Supabase incluso sin query.

## 25. Como explicarle el proyecto a ChatGPT en una frase

Vaultly es una app React + Supabase para explorar un catalogo cultural multi-categoria, cachear resultados de APIs externas mediante Edge Functions, permitir a usuarios autenticados llevar un tracker personal con puntuaciones y reseñas, mostrar perfiles publicos controlados por privacidad y ofrecer un panel admin para gestionar usuarios, catalogo, entidades, reportes y auditoria.
