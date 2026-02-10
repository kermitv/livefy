# Test Automation

## Goal
Automate the core regression checks so app behavior, docs rendering, and container packaging stay reliable as the codebase evolves.

## Recommended Strategy

### 1) Unit Tests (Store + Domain)
- Test `src/store/createStore.js` actions and state transitions
- Test `src/domain/schema.js` migration behavior across state versions
- Keep these fast and deterministic for local feedback

### 2) Browser E2E Smoke Tests
- Use Playwright to validate critical user flows:
  - app loads
  - task and habit CRUD
  - persistence after refresh
  - docs panel loads markdown files

### 3) Container Smoke Checks (CI)
- Build and run with Docker Compose
- Verify HTTP responses for:
  - `index.html`
  - `main.js`
  - key module paths
  - representative docs markdown path(s)
- Catch packaging/runtime regressions early

### 4) Docs Quality Checks
- Lint markdown
- Validate internal links and references
- Prevent docs drift as architecture and decisions change

## Why This Fits Livefy
- Covers both logic correctness and user-facing behavior
- Matches current architecture (modular store/domain/UI)
- Protects Docker and static-host deployment assumptions

## Future Note (Post-Vite)
After Vite migration, test automation becomes easier to standardize around `test`, `build`, and preview commands in CI.

## Suggested Next Step
Set up a first automation slice:
- unit tests for store/domain
- one Playwright smoke suite
- one CI workflow to run tests and smoke checks on each push

## Manual Smoke Checklist (Current)

### 1) Dev Server + App Load
- Start:

```bash
cd /Users/kermitv/Projects/Livify
docker compose up livify-dev
```

- Open [http://localhost:8080](http://localhost:8080)
- Confirm app loads without console errors

### 2) Docs Manifest Availability
- Open [http://localhost:8080/docs/index.json](http://localhost:8080/docs/index.json)
- Confirm response includes expected markdown files
- Confirm `ollama-windows-setup.md` is present

### 3) In-App Docs Discovery + Render
- Open Docs panel in app
- Confirm dropdown includes `ollama-windows-setup.md`
- Select it and confirm markdown renders
- Use `Reload` button and confirm content re-fetches

### 4) Deep-Linking + Navigation Sync
- Open:
  - [http://localhost:8080/#docs?file=ollama-windows-setup.md](http://localhost:8080/#docs?file=ollama-windows-setup.md)
  - [http://localhost:8080/#docs?file=decisions.md](http://localhost:8080/#docs?file=decisions.md)
- Confirm correct file opens in each case
- Change dropdown and confirm hash updates
- Use browser back/forward and confirm panel stays in sync

### 5) Production-Style Packaging Check
- Run:

```bash
cd /Users/kermitv/Projects/Livify
docker compose up --build livify
```

- Confirm:
  - `/docs/index.json` is reachable
  - Docs panel still renders markdown files in production container
