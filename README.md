# Livify

A lightweight local-first life management app shell.

## Run (no Docker)
Serve locally with Python:

```bash
cd /Users/kermitv/Projects/Livify
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

Note: opening `index.html` directly as a file may fail because the app now uses ES modules.

## Run (Docker)

```bash
cd /Users/kermitv/Projects/Livify
docker compose up --build
```

Then open [http://localhost:8080](http://localhost:8080).

Stop with `Ctrl+C`, or run detached via `docker compose up -d --build`.

## Run (Docker Dev Live-Reload)

```bash
cd /Users/kermitv/Projects/Livify
docker compose up livify-dev
```

Then open [http://localhost:8080](http://localhost:8080).
Edits to `index.html`, `styles.css`, `main.js`, and files under `src/` auto-refresh in the browser.

If `livify` is already running on port `8080`, stop it first:

```bash
docker compose stop livify
```

## Files
- `index.html`: app structure
- `styles.css`: visual design and responsive layout
- `main.js`: web app entrypoint
- `src/domain/schema.js`: versioned app state + migration
- `src/persistence/localStorageAdapter.js`: storage adapter boundary
- `src/store/createStore.js`: state/actions business logic
- `src/ui/createAppUI.js`: DOM rendering and event wiring
- `compose.yaml`: local container orchestration
- `Dockerfile`: static app container image
- `BRAINSTORM.md`: product direction and next decisions
