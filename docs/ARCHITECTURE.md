# Phase 2 POC Architecture

## Architectural Intent

This architecture prioritizes:
- Local-first execution
- Privacy
- Clarity of data ownership
- Explicit boundaries between memory, intelligence, and automation

It is designed to support Phase 2 POC only, while leaving clean extension points for future phases.

## High-Level Components

### Frontend (Vite + React)

- Single-page application
- Responsible for:
- Capture UI
- Review and approval flows
- Planning views
- Never calls LLMs directly

### Local Persistence

- IndexedDB (via Dexie)
- Stores:
- Raw inbox items
- LLM proposals
- Accepted goals, methods, and actions
- Raw inbox text is immutable

### Local Backend (Node)

- Lightweight Express server
- Exposes:
- `/api/triage`
- Acts as the sole interface to LLM providers

### LLM Provider Layer

- Initial provider: Ollama (local)
- Cloud providers may be added later behind the same interface
- LLMs:
- Read raw text
- Return structured proposals
- Never write directly to persistence

## Data Model (Conceptual)

### InboxItem

- `id`
- `createdAt`
- `title` (optional)
- `sourceDate` (optional)
- `rawText`

### Proposal

- `id`
- `inboxItemId`
- `kind` (`goal | method | action | event | summary | risk`)
- `payload` (JSON)
- `confidence`
- `status` (`proposed | accepted | rejected`)
- `model`
- `promptVersion`

### Accepted Entities

- `Goal`
- `Method`
- `Action`

Each accepted entity links back to its originating `inboxItemId`.

## Critical Guardrails

- Raw inbox content is never modified or deleted automatically
- LLMs generate proposals only
- Acceptance is a user action, not an AI decision
- All derived entities retain traceability to source text

## Deferred Architecture Decisions

Explicitly deferred:
- Cloud sync
- Auth and accounts
- Mobile packaging (`Capacitor` vs native)
- OpenClaw runtime and privileges
- Long-term storage backend

These remain tracked as open loops and must not block Phase 2 work.
