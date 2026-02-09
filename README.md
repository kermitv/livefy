# Livify

A lightweight local-first life management app shell.

## Run (Vite Local)

```bash
cd /Users/kermitv/Projects/Livify
npm install
npm run dev -- --host 0.0.0.0 --port 8080
```

Then open [http://localhost:8080](http://localhost:8080).

## Build + Preview (Vite Local)

```bash
cd /Users/kermitv/Projects/Livify
npm run build
npm run preview -- --host 0.0.0.0 --port 8080
```

Then open [http://localhost:8080](http://localhost:8080).

## Run (Docker)

```bash
cd /Users/kermitv/Projects/Livify
docker compose up --build livify
```

Then open [http://localhost:8080](http://localhost:8080).

Stop with `Ctrl+C`, or run detached via `docker compose up -d --build`.

## Run (Docker Dev Live-Reload)

```bash
cd /Users/kermitv/Projects/Livify
docker compose up livify-dev
```

Then open [http://localhost:8080](http://localhost:8080).
Edits to app files auto-refresh via Vite HMR.

If `livify` is already running on port `8080`, stop it first:

```bash
docker compose stop livify
```

## Files
- `index.html`: app structure
- `styles.css`: visual design and responsive layout
- `main.js`: web app entrypoint
- `package.json`: Vite scripts and dependencies
- `vite.config.js`: Vite config and docs copy plugin
- `src/domain/schema.js`: versioned app state + migration
- `src/persistence/localStorageAdapter.js`: storage adapter boundary
- `src/store/createStore.js`: state/actions business logic
- `src/ui/createAppUI.js`: DOM rendering and event wiring
- `src/ui/docsPanel.js`: in-app Markdown docs viewer
- `compose.yaml`: local container orchestration
- `Dockerfile`: Vite build + Nginx runtime image
- `docs/`: in-app loadable Markdown documentation
- `dist/docs/index.json`: auto-generated docs manifest used by the in-app docs panel
- `BRAINSTORM.md`: product direction and next decisions

## Docs Deep Link

Open a specific docs page directly with:

`#docs?file=<name>.md`

Example:

[http://localhost:8080/#docs?file=decisions.md](http://localhost:8080/#docs?file=decisions.md)
