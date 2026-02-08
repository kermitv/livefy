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
