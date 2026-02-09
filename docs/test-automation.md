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
