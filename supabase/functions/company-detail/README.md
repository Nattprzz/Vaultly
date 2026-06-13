# company-detail

Obtiene, normaliza y cachea una ficha de compañía de videojuegos desde IGDB.

## Prueba local

1. Configura los secrets de Supabase/IGDB:

```sh
supabase secrets set IGDB_CLIENT_ID=... IGDB_CLIENT_SECRET=...
```

2. Sirve la función:

```sh
supabase functions serve company-detail --env-file .env
```

3. Consulta una compañía:

```sh
curl "http://127.0.0.1:54321/functions/v1/company-detail?slug=rockstar-games"
```

Para saltar la caché de 7 días:

```sh
curl "http://127.0.0.1:54321/functions/v1/company-detail?slug=rockstar-games&force_sync=1"
```
