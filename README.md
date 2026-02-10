# Livify

Local-first personal memory and follow-through system.

## Docker Modes

- `livify-dev`: development mode (Vite client + local Node/Express API for `/api/triage` mock endpoint)
- `livify`: production-style mode (Vite build served by nginx)

Both services map to host port `8080`. Run one at a time.

## Dev Startup (Recommended)

```bash
docker compose up -d livify-dev
docker compose logs -f --tail=120 livify-dev
```

Open [http://localhost:8080](http://localhost:8080).

### Dev install behavior (codified)

`livify-dev` uses a named volume (`livify_node_modules`) and auto-installs dependencies only when needed:

- If `node_modules/.bin/concurrently` is missing, it runs `npm install`
- If `package-lock.json` changed since last install, it runs `npm install` again
- Otherwise it skips install and starts immediately

No manual install step is required for normal use.

## Restart Dev

```bash
docker compose down
docker compose up -d livify-dev
```

## Production-Style Run

```bash
docker compose up -d --build livify
docker compose logs -f --tail=120 livify
```

Open [http://localhost:8080](http://localhost:8080).

## Clean Rebuild (if needed)

Use this when dependencies or volumes become inconsistent:

```bash
docker compose down -v
docker compose up -d --build livify-dev
```

## Key Files

- `compose.yaml`: container startup behavior and volume wiring
- `Dockerfile`: production image build (Vite build + nginx serve)
- `vite.config.js`: Vite config, docs plugin, and `/api` dev proxy
- `server/index.js`: local dev Express API (`POST /api/triage` mock proposals)
- `src/features/inbox/InboxPage.tsx`: Inbox UI with reflect call + draft interpretations
- `src/db/db.ts`: Dexie database and CRUD utilities
- `src/db/schema.ts`: local data model types
