# Livefy – Architecture Notes

## Phase 1 Purpose
Livefy acts as a capture and surfacing layer for life and work thinking.

Goals:
- Capture decisions, open loops, and next actions
- Integrate with local LLMs (Ollama) for extraction and summarization
- Provide a simple UI to surface what matters
- Defer automation (OpenClaw) until capture loop is stable

## Phase 1 MVP
- Single-page UI
- Text area for pasting notes or conversations
- "Extract" button
- Local LLM processes input
- Outputs:
  - Decisions
  - Open loops
  - Next actions
- Results saved locally (markdown or JSON)

## Explicit Non-Goals (Phase 1)
- No background automation
- No account integrations
- No long-running agents
- No task execution without review
