# Decisions

## 2026-02-08
- Start with local-first LLM development using Ollama
- Use Livefy as capture and surfacing layer before adding automation
- Defer OpenClaw until data capture loop is reliable
- Keep Phase 1 intentionally simple
- Keep Livefy as system of record; OpenClaw is an operator only
- Introduce OpenClaw behind a minimal ingest API (inbox/open loop/task writes only)
- Require explicit confirmation for privileged actions (email/calendar/external side effects)
- Treat third-party skills/extensions as high risk until vetted process exists
- Adopt "capture now, organize later" as the default UX rule for Phase 1
- Defer runtime-placement decisions as tracked open loops; do not block capture workflow on infrastructure choices

## 2026-02-09
- Current frontend is vanilla web + ES modules (not Next.js, not Vite yet)
- Keep Docker workflows for both production-style preview and live-reload dev
- Direction chosen: migrate to Vite next for better DX and clean static deploy builds
- Architecture refactor completed to support dual-target evolution (web now, iOS later):
  - Versioned app state + migration layer
  - Persistence adapter boundary
  - Store/actions module for business logic
  - UI module separated from state logic
- iOS strategy remains open between:
  - Capacitor wrapper around current web app, or
  - Shared frontend stack (likely Vite + React) for web and iOS
