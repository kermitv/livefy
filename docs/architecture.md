# Livefy – Architecture Notes

## Phase 1 Purpose
Livefy acts as a capture and surfacing layer for life and work thinking.

Goals:
- Capture decisions, open loops, and next actions
- Integrate with local LLMs (Ollama) for extraction and summarization
- Provide a simple UI to surface what matters
- Defer automation (OpenClaw) until capture loop is stable

## System Roles

- Livefy: source of truth for memory and follow-through state
- OpenClaw: automation/operator layer that reads/writes through approved interfaces
- LLMs: interchangeable inference layer (local first, cloud optional)

Design rule: automation is a client of memory, not the owner of memory.

## Phase 1 MVP
- Single-page UI
- Universal Inbox text area for notes/conversations/tasks/thoughts
- "Extract" button
- Local LLM processes input
- Outputs:
  - Decisions
  - Open loops
  - Next actions
- Results saved locally (markdown or JSON)
- Optional tags/project links at processing time (not required at capture time)

Reference workflow: `docs/capture-and-organize.md`.

## Explicit Non-Goals (Phase 1)
- No background automation
- No account integrations
- No long-running agents
- No task execution without review

## Phase 2 Boundary (Planned)

When OpenClaw is introduced:
- run it in an isolated environment (dedicated box or VM/container)
- grant minimal permissions
- allow only narrow ingest API operations into Livefy:
  - append inbox
  - create open loop
  - create task
- block unrestricted filesystem roaming and arbitrary shell execution

## Explicit Deferral

- Runtime placement details ("where it runs") are intentionally deferred and tracked as an open loop.
- Phase 1 must remain unblocked by unresolved infrastructure choices.
