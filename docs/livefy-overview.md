# Livefy: A Personal Memory and Follow-Through System

## Overview

Livefy is a personal life and work assistant built around a simple idea:

**memory comes first.**

Most tools help you think in the moment, but they do not help you *remember*, revisit, or follow through. Conversations, decisions, and good ideas often disappear into chat logs, notes apps, or mental clutter.

Livefy exists to capture what matters, keep it durable and portable, and gently help you return to it when the time is right.

---

## Core Principles

### 1. Local-First Ownership

Livefy treats your information as something you own.

Decisions, open loops, notes, and plans live in formats you control (initially simple markdown files). They are not locked inside a proprietary service or opaque database.

LLMs—local or cloud—are tools that *operate on your data*, not owners of it.

---

### 2. Capture Without Friction

Livefy prioritizes fast, low-effort capture.

You should never have to stop and decide:
- “Is this a task?”
- “Is this a project note?”
- “Is this personal or work?”

Everything can go into a single Inbox first. Organization is optional and deferred.

---

### 3. Structure Later, With Context

When you are ready—and only when you are ready—Livefy helps you organize captured material into human-friendly buckets such as:
- Decisions
- Open Loops
- Next Actions
- Projects
- Reference Notes

AI can assist with extraction and structuring, but review and control always remain with you.

Nothing disappears automatically.

---

### 4. Gentle Follow-Through

Livefy is not a nagging productivity system.

Instead, it supports follow-through through:
- reminders tied to things *you said mattered*
- prompts that help you reflect or decide
- visibility into unresolved open loops
- light gamification to make progress tangible and motivating

The goal is support, not pressure.

---

### 5. AI Is Optional and Interchangeable

AI is not the product.

Livefy is designed so that:
- local models can be used for privacy and cost control
- cloud models can be used selectively when needed
- model providers can be swapped without losing your memory system

Your data model and workflow remain stable even as model capabilities change.

---

## OpenClaw Relationship

Livefy is the memory system. OpenClaw is an optional operator layer.

That means:
- Livefy remains the source of truth
- OpenClaw can provide capture, chat access, and approved integrations
- automation should be introduced behind strict boundaries and least privilege

See `docs/openclaw-integration.md` for rollout phases, trust boundaries, and deployment options.
