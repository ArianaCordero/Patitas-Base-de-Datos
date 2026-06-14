# Deploy

## Frontend — Vercel

```bash
# 1. Ir al directorio del frontend
cd client

# 2. Instalar Vercel CLI (si no lo tienes)
npm i -g vercel

# 3. Configurar variables de entorno en Vercel
#    Ve a https://vercel.com -> proyecto -> Settings -> Environment Variables
#    Agrega:
#      VITE_API_URL = https://tu-backend.railway.app/api

# 4. Desplegar
vercel --prod
```

El `vercel.json` ya está configurado con rewrites para SPA.

---

## Backend — Railway

```bash
# 1. Ir al directorio del servidor
cd server

# 2. Asegúrate de tener el proyecto en GitHub
#    Railway se conecta directo al repo

# 3. En Railway.app:
#    - New Project -> Deploy from GitHub repo
#    - Root Directory: server
#    - Start Command: node index.js

# 4. Agregar variables de entorno en Railway:
#    PORT = 3001
#    CLIENT_URL = https://tu-frontend.vercel.app
#    PG_HOST = (host de tu PostgreSQL, usa Railway Postgres o Supabase)
#    PG_PORT = 5432
#    PG_USER = postgres
#    PG_PASSWORD = (tu password)
#    PG_DATABASE = patitas_db
#    MONGO_URI = mongodb+srv://... (usa MongoDB Atlas)
#    JWT_SECRET = (genera una clave segura)
#    APP_ENCRYPTION_KEY = (genera otra clave segura)

# 5. Railway deploy automático al hacer push a main
```

## Backend — Render

Render incluye PostgreSQL gratis. El archivo `server/render.yaml` ya está configurado.

```bash
# 1. Subir el repo a GitHub

# 2. En https://dashboard.render.com:
#    - New -> Blueprint
#    - Conecta tu repo de GitHub
#    - Render detecta automáticamente render.yaml
#    - Te pide llenar las variables sync:false:
#        CLIENT_URL = https://tu-frontend.vercel.app
#        PG_USER = postgres
#        PG_PASSWORD = (la genera Render, la ves en Database dashboard)
#        MONGO_URI = mongodb+srv://... (MongoDB Atlas)
#        JWT_SECRET = (openssl rand -hex 32)
#        APP_ENCRYPTION_KEY = (openssl rand -hex 16)

# 3. Render crea:
#    - Un Web Service (Node.js) con auto-deploy
#    - Una base de datos PostgreSQL

# 4. Deploy automático al hacer push a main
```

**Alternativas** (misma config básica): Fly.io, Koyeb, Cyclic.sh, Northflank.

## Requisitos previos

- PostgreSQL (Railway Postgres o [Supabase](https://supabase.com) gratis)
- MongoDB ([MongoDB Atlas](https://www.mongodb.com/atlas) gratis)

### Inicializar base de datos

Conéctate a tu PostgreSQL remoto y ejecuta:

```bash
psql $PG_CONNECTION_STRING -f database/postgres/01_schema.sql
psql $PG_CONNECTION_STRING -f database/postgres/02_roles.sql
psql $PG_CONNECTION_STRING -f database/postgres/03_views.sql
psql $PG_CONNECTION_STRING -f database/postgres/04_procedures.sql
```

Para MongoDB, ejecuta el seed localmente apuntando a tu Atlas:

```bash
cd database/mongodb
npm install
MONGO_URI=mongodb+srv://... node seed.js
```
