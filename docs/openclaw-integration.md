# OpenClaw Integration Guide

## Mental Model

- Livefy = source of truth (memory + UI)
- OpenClaw = operator (automation + integrations)
- LLMs (local/cloud) = interchangeable reasoning layer

OpenClaw should act on Livefy, not replace it.

## Where OpenClaw Fits

### 1. Capture and routing
- Accept mobile chat input (Telegram/WhatsApp/etc.)
- Convert messages into structured Livefy entries:
  - inbox items
  - open loops
  - tasks

This is the highest-value early use case: low-friction capture from anywhere.

### 2. Lightweight memory operations
- "Show my open loops"
- "What are my top next actions?"
- "Summarize what changed this week"

OpenClaw becomes a chat interface to Livefy state.

### 3. Controlled execution
- Email/calendar triage
- Reminders
- Periodic checks
- External service pulls
- Approved script execution

## Security Posture

Treat OpenClaw as high risk because it can touch real systems. Skills/extension ecosystems can introduce supply-chain and prompt-injection risk.

Default policy:
- run in isolated environment
- minimal permissions only
- narrow API to Livefy
- explicit human confirmation for high-impact actions
- no arbitrary shell or unrestricted filesystem access

## Phased Rollout

### Phase 1 (now)
- Livefy local memory (markdown/SQLite), versioned in git
- Ollama on Mac bare metal for extraction/structuring
- Phone access is capture-only (no automation)

### Phase 2 (safe introduction)
- Host OpenClaw on dedicated hardware or isolated VM/container
- Grant least privilege
- Allow writes through one small ingest API only:
  - append inbox entry
  - create open loop
  - create task

### Phase 3 (optional)
- Add controlled actions (email/calendar)
- Keep explicit confirmation for privileged operations
- Add context-packaging controls for cloud model usage

## Hosting Options

### Home dedicated box (privacy-first)
- Good fit: Mac mini / NUC + private VPN
- Pros: data locality and control
- Cons: depends on home internet/power reliability

### VPS (availability-first)
- Good fit: globally reachable agent endpoint
- Pros: uptime and simpler remote access
- Cons: internet-exposed hardening burden

For either option, Livefy remains the memory layer; OpenClaw is the gateway/operator.

## Practical Near-Term Path

If goal is cheap mobile capture now:
- deploy Livefy capture UI
- write captures to `inbox.md`
- process and structure later with Ollama on Mac

OpenClaw can be added later for chat capture and integrations after the core capture/review loop is stable.
