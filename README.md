# Vaultly

Vaultly usa Supabase como backend y Tailwind CSS para la interfaz.

## Variables de entorno

Crea un `.env.local` para desarrollo local y configura estos valores en los secrets de Supabase cuando despliegues Edge Functions:

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

Las claves privadas no deben usarse en el frontend. Las busquedas externas se hacen desde Supabase Edge Functions:

- `catalog-search`: busca y normaliza videojuegos, peliculas, series, libros y conciertos.
- `catalog-item`: obtiene el detalle de un item externo y lo guarda en cache.
- `search-anime`: busca anime o manga en AniList mediante GraphQL, sin API key.

## Comandos

```bash
npm install
npm run dev
npm run lint
npm run type-check
npm run build
```
