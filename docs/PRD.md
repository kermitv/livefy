# Phase 2 POC Product Requirements

## Product Definition

Livify is a personal memory and follow-through system.

It helps a single user capture meaningful information (thoughts, conversations, decisions, plans), keep that information durable and portable, and later transform it—deliberately and with control—into goals, methods, and next actions.

Livify is not a productivity app, task manager, or automation engine.
It is a memory-first system of record that supports reflection, planning, and gentle follow-through.

## Phase 2 POC Objective

The Phase 2 POC exists to answer one question:

Can Livify reliably turn unstructured personal information into a usable, trustworthy planning system without losing context or control?

If the answer is yes, we proceed toward MVP. If not, we stop or rethink.

## In-Scope for Phase 2

The POC must support:
- A universal Inbox for capturing unstructured text
- Durable local persistence of captured information
- LLM-assisted triage that proposes (but does not enforce) the following:
- Summaries
- Goals
- Methods
- Actions
- Events
- Explicit user approval before anything becomes a “real” plan item
- A simple planning view showing accepted actions (Today + Backlog)

## Out-of-Scope (Explicit Non-Goals)

The following are intentionally excluded from Phase 2:
- Multi-user support
- Authentication or accounts
- Cloud sync
- Email, calendar, or external side effects
- Automatic task creation without user confirmation
- OpenClaw automation
- iOS or mobile packaging
- Perfect methodology (GTD, PARA, etc.)

Uncertainty in these areas is acceptable and tracked separately as open loops.

## Core Principles (Authoritative)

- Memory comes first
Raw captured text is immutable truth. Derived structure never overwrites it.
- Capture now, organize later
The system never forces up-front classification.
- Proposals, not actions
LLM output is always a suggestion requiring explicit acceptance.
- Local-first ownership
Data belongs to the user and is stored locally in durable formats.
- AI is optional and interchangeable
Models assist but do not define the system.
- Gentle follow-through
Livify supports reflection and progress without pressure or nagging.

## Success Criteria (POC)

The POC is successful if:
- A long, messy artifact (e.g., a counseling session summary) can be pasted into Inbox
- Livify proposes reasonable goals, methods, and actions from that artifact
- The user can selectively accept or reject those proposals
- Accepted items persist and appear correctly in planning views
- The system feels trustworthy and non-destructive
