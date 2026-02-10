# Phase 2 POC Execution Plan

This document is authoritative for Phase 2 POC execution tasks.
All tasks below must follow `docs/PRD.md` and `docs/ARCHITECTURE.md` strictly.

## TASK-001: Project Spine and Authority Docs

### Goal

Establish authoritative guidance for the repo.

### Done When

- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/TASKS.md` exist
- Each document states it is authoritative
- Early notes remain in `docs/archive/`

## TASK-002: Local Persistence Layer (IndexedDB)

### Goal

Persist core entities locally.

### Done When

- Dexie database is defined
- `InboxItem` CRUD works
- Data survives reload
- No LLM integration yet

### Expected Files

- `src/db/db.ts`
- `src/db/schema.ts`

## TASK-003: Inbox UI

### Goal

Allow fast capture and review of raw information.

### Done When

- User can paste text and save to Inbox
- Inbox list displays saved items
- Clicking an item shows raw text
- No forced classification

### Expected Files

- `src/features/inbox/*`

## TASK-004: Local Backend Scaffold

### Status

Completed

Dev-only /api/triage returns draft interpretations (mock)

### Goal

Create LLM boundary without wiring intelligence yet.

### Done When

- Local Node server runs
- `/api/triage` endpoint exists
- Endpoint returns mock proposal JSON
- Frontend can call it successfully

### Expected Files

- `server/index.js`

## TASK-005: Triage UI (Proposals)

### Goal

Display and manage LLM proposals.

### Done When

- User can run triage on an inbox item
- Proposals render grouped by type
- Each proposal has accept/reject controls
- Status persists

### Expected Files

- `src/features/triage/*`

## TASK-006: Accept Proposals to Planning Entities

### Goal

Materialize accepted proposals into real data.

### Done When

- Accepted proposals create goals, methods, and actions
- Rejected proposals do not resurface
- All accepted items link back to source inbox item

## TASK-007: Basic Planning View

### Goal

Prove follow-through value.

### Done When

- `Today` view shows due or pinned actions
- `Backlog` shows remaining actions
- No automation, reminders, or nagging
