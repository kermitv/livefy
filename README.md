# Livify

A lightweight local-first life management app shell.

## Run (no Docker)
Open `/Users/kermitv/Projects/Livify/index.html` directly in a browser.

Or serve locally with Python:

```bash
cd /Users/kermitv/Projects/Livify
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

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
Edits to `index.html`, `styles.css`, and `app.js` auto-refresh in the browser.

If `livify` is already running on port `8080`, stop it first:

```bash
docker compose stop livify
```

## Files
- `index.html`: app structure
- `styles.css`: visual design and responsive layout
- `app.js`: local state + interactions
- `compose.yaml`: local container orchestration
- `Dockerfile`: static app container image
- `BRAINSTORM.md`: product direction and next decisions
