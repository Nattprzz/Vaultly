# Vaultly — Project Plan

## 1. Project Description

**Vaultly** es una aplicación web de catálogo + tracker personal. Permite a los usuarios explorar, registrar y hacer seguimiento de su consumo cultural: videojuegos, películas, series, libros y conciertos.

- **Posicionamiento**: Tracker personal todo-en-uno para cultura y entretenimiento.
- **Usuarios objetivo**: Personas que quieren llevar un registro organizado de lo que han jugado, visto, leído o escuchado.
- **Valor diferencial**: Catálogo unificado con tracker personalizable por categoría, reseñas propias y perfil compartible.

---

## 2. Page Structure

- `/` — Home (landing pública + resumen si logueado)
- `/catalog` — Catálogo general (exploración pública)
- `/catalog/:category` — Catálogo por categoría (games, movies, series, books, concerts)
- `/catalog/:category/:id` — Detalle de ítem
- `/dashboard` — Dashboard general del usuario (privado)
- `/tracker` — Vista del tracker del usuario (privado)
- `/tracker/:category` — Tracker por categoría (privado)
- `/profile` — Perfil del usuario (privado)
- `/profile/share` — Perfil público compartible
- `/settings` — Configuración de la app
- `/auth/login` — Iniciar sesión
- `/auth/register` — Registro
- `/admin` — Panel de administración (solo admin)
- `*` — 404 Not Found

---

## 3. Core Features

### Públicas (sin login)
- [ ] Explorar catálogo por categoría
- [ ] Buscar contenido en el catálogo
- [ ] Ver detalle de cada ítem
- [ ] Iniciar sesión / Registrarse
- [ ] Configuración básica (modo oscuro/claro, idioma)

### Privadas (con login)
- [ ] Selección de categorías activas (onboarding)
- [ ] Dashboard general con resumen de actividad
- [ ] Tracker por categoría (añadir, actualizar estado, puntuar)
- [ ] Reseñas personales por ítem
- [ ] Perfil compartible públicamente
- [ ] Configuración avanzada (notificaciones, categorías activas)

### Admin
- [ ] Panel de administración
- [ ] Gestión de usuarios
- [ ] Gestión de ítems del catálogo
- [ ] Moderación de reseñas

---

## 4. Data Model Design

### Table: profiles
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | FK → auth.users |
| username | text | Nombre de usuario único |
| display_name | text | Nombre visible |
| avatar_url | text | URL del avatar |
| bio | text | Descripción del perfil |
| active_categories | text[] | Categorías activas seleccionadas |
| is_admin | boolean | Si es administrador |
| is_public | boolean | Si el perfil es público |
| created_at | timestamptz | Fecha de creación |

### Table: catalog_items
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| category | text | games / movies / series / books / concerts |
| external_id | text | ID de la API externa |
| title | text | Título del ítem |
| cover_url | text | Imagen de portada |
| description | text | Descripción |
| release_date | date | Fecha de lanzamiento |
| metadata | jsonb | Campos específicos por categoría |
| created_at | timestamptz | Fecha de inserción en BD |

### Table: tracker_entries
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK → profiles.id |
| item_id | uuid | FK → catalog_items.id |
| status | text | pending / in_progress / completed / dropped |
| rating | int2 | Puntuación 1-10 |
| review | text | Reseña personal |
| started_at | date | Fecha de inicio |
| finished_at | date | Fecha de finalización |
| created_at | timestamptz | Fecha de creación |
| updated_at | timestamptz | Última actualización |

### Table: reviews (públicas)
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK → profiles.id |
| item_id | uuid | FK → catalog_items.id |
| rating | int2 | Puntuación 1-10 |
| body | text | Texto de la reseña |
| is_public | boolean | Si es visible públicamente |
| created_at | timestamptz | Fecha de creación |

---

## 5. Backend / Third-party Integration Plan

- **Supabase Auth**: Login, registro, sesión de usuario, roles (admin/user)
- **Supabase Database**: Almacenamiento de perfiles, catálogo cacheado, tracker, reseñas
- **Supabase RLS**: Políticas de seguridad por fila para proteger datos privados
- **Supabase Edge Functions**: Proxy seguro para llamadas a APIs externas (IGDB para juegos, TMDB para peliculas/series, Google Books para libros, Ticketmaster para conciertos y AniList para anime/manga)
- **APIs externas** (cacheadas en catalog_items):
  - IGDB API -> Videojuegos
  - TMDB API -> Peliculas y Series
  - Google Books API -> Libros
  - Ticketmaster API -> Conciertos
  - AniList GraphQL -> Anime y manga

---

## 6. Development Phase Plan

### Phase 1: UI Base — Home + Navbar + Catálogo
- **Goal**: Construir la estructura visual principal de la app con datos mock
- **Deliverable**: Home page, Navbar (logueado/no logueado), página de Catálogo con categorías

### Phase 2: Auth — Login, Registro y Onboarding
- **Goal**: Implementar autenticación con Supabase y selección de categorías activas
- **Deliverable**: Páginas de login/registro, onboarding de categorías, sesión persistente

### Phase 3: Dashboard + Tracker
- **Goal**: Vista de resumen de actividad y tracker por categoría
- **Deliverable**: Dashboard con estadísticas, Tracker con estados (pendiente, en progreso, completado, abandonado)

### Phase 4: Catálogo real + APIs externas
- **Goal**: Conectar APIs externas via Edge Functions y cachear en Supabase
- **Deliverable**: Búsqueda real, detalle de ítem, caché en BD

### Phase 5: Perfil + Reseñas + Compartir
- **Goal**: Perfil de usuario, reseñas públicas y enlace compartible
- **Deliverable**: Página de perfil, sistema de reseñas, URL pública del tracker

### Phase 6: Configuración + Admin Panel
- **Goal**: Ajustes de la app y panel de administración
- **Deliverable**: Página de settings, panel admin con gestión de usuarios e ítems

### Phase 7: Pulido final + SEO + Seguridad
- **Goal**: Optimización, minificación, RLS completo, SEO
- **Deliverable**: App lista para producción

---

## 7. Current Progress

- [x] Phase 1 — En progreso
- [ ] Phase 2
- [ ] Phase 3
- [ ] Phase 4
- [ ] Phase 5
- [ ] Phase 6
- [ ] Phase 7
