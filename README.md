## Aprosoft Assessment

Next.js + MongoDB app with Teams CRUD and approval workflow.

### Prerequisites
- Node.js 18+
- npm or pnpm or yarn
- Docker (for running MongoDB via docker-compose)

### Environment Variables
Copy the example env and adjust if needed:

```bash
cp env.example .env
```

Variables used:
- `MONGODB_URI` (default in example points to local docker Mongo)
- `MONGODB_DB_NAME` (database name)
- `NEXT_PUBLIC_BASE_URL` (server-side absolute URL, e.g. `http://localhost:3000`)

### Run with Docker (MongoDB)
Start MongoDB locally via docker-compose:

```bash
docker compose up -d
```

This starts a `mongo:6` container exposing `27017` and creates a `aprosoft` database.

### Install & Run (App)
Install dependencies and start the dev server:

```bash
npm install
npm run dev
# open http://localhost:3000
```

### Build & Start (Production)
Create an optimized production build and run it:

```bash
npm run build
npm start
# app runs on http://localhost:3000
```

### Common Commands
- `npm run dev`: start Next.js dev server
- `npm run build`: create production build
- `npm start`: start production server (after build)
- `docker compose up -d`: start MongoDB container
- `docker compose down`: stop containers and network

### Notes
- Ensure `.env` has a reachable `MONGODB_URI`. If using the provided compose file, the default from `env.example` works: `mongodb://localhost:27017/aprosoft`.
- If accessing APIs during SSR, `NEXT_PUBLIC_BASE_URL` should match your app origin (e.g., `http://localhost:3000`).
