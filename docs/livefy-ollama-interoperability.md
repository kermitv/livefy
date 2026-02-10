# Livefy + Ollama Interoperability Plan

## Goal
Bring Livefy into active use now as the capture and surfacing layer around Ollama, while deferring heavier automation risk until core loops are stable.

## Recommended Phasing

### Phase 1A (Now): Ollama as the Engine
- Run local models reliably
- Validate model fit for hardware
- Establish reusable prompts

### Phase 1B (Now): Livefy as Notebook + Dashboard
- Capture messy input
- Extract decisions/open loops/next actions
- Store and surface structured output

### Phase 2 (Later): OpenClaw as Automation Layer
- Add automation only after Livefy output loops are stable
- Keep OpenClaw as an operator, not system-of-record owner

## Why Not Jump to OpenClaw Yet
Introducing OpenClaw too early increases:
- permission and security complexity
- third-party skill risk surface
- moving parts and debugging load

Current highest ROI:
- stable local LLM loop
- reliable decision/open-loop capture
- simple UI to surface what matters

## Recommended Sequence

### 1) Stabilize Local LLM Loop (Ollama)
- Confirm repeatable server/model startup
- Choose 1-2 models that fit your machine
- Finalize 3 reusable prompts:
  - daily plan
  - session recap
  - decision capture

### 2) Build Livefy Minimal MVP (Capture + Surfacing)
Minimum feature set:
- Inbox text input
- Button to extract:
  - decisions
  - open loops
  - next actions
- Save extracted results
- Views for:
  - Open Loops
  - Next Actions
  - Decisions

Constraint:
- Do not build full assistant chat UI yet
- Build the control panel first

## Install Now, Integrate Later (Mac Guidance)
This is the right time to install Ollama on Mac without changing Livefy architecture.

Current Livefy loop should stay:
- UI -> rule-based extract -> store -> render

Near-term target becomes:
- UI -> extract()
  - rule-based (default)
  - ollamaExtract() (optional)
  -> store -> render

Key point:
- UI and store remain stable
- only extraction engine changes later

What installing Ollama now means:
- runtime is available
- small-model performance can be validated
- integration path is proven

What it does **not** mean:
- no architecture rewrite
- no forced switch away from rule-based extraction
- no containerization/network exposure work yet
- no prompt optimization phase yet

For Mac setup commands and checks, use:
- `docs/ollama-setup.md`

### 3) Add OpenClaw After Loop Stability
Once capture/surface loop is stable, OpenClaw can:
- write entries
- update tasks
- schedule reminders
- run safe scripts

This preserves sequence integrity: automation outputs must have a reliable destination.

## Concrete Deliverables

### A) Docs Artifacts
- `docs/assistant-notes.md`
- `docs/open-loops.md`
- `docs/decisions.md`
- `docs/next-actions.md`

### B) Minimal Data Schema
- `open_loops.json`
- `decisions.json`
- `tasks.json`

### C) Single-Page Flow
- Text area + `Process` button
- Call local Ollama API: `127.0.0.1:11434`
- Display extracted items
- Persist extracted results

## Weekly Prioritization Recommendation
- 70% Livefy (capture + UI)
- 30% Ollama (models + prompts)
- Defer OpenClaw until capture/surface loop is proven

## Simple Decision Rule
- UI not done -> no AI engine changes
- store not stable -> no AI engine changes
- extraction contract stable -> swap extraction engines freely

## Decisions To Make During Development
- Source-of-truth format: markdown, JSON, or both
- Extraction confidence thresholds before auto-save
- Review gates before promoting extracted items to tasks
- iOS/web synchronization strategy (local-only vs optional cloud sync)
- OpenClaw integration boundary and permission model
