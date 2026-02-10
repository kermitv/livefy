# Ollama Setup

## Goal
Set up Ollama locally on macOS for reliable Livefy extraction workflows.

## 1) Confirm Installation
Run:

```bash
which ollama
ollama --version
```

If not installed:

```bash
brew install ollama
```

## 2) Start Local Server (Pick One)
Option A (recommended to start, manual server):

```bash
OLLAMA_FLASH_ATTENTION="1" OLLAMA_KV_CACHE_TYPE="q8_0" ollama serve
```

Why this is a good default on Apple Silicon:
- `OLLAMA_FLASH_ATTENTION=1` improves inference speed
- `OLLAMA_KV_CACHE_TYPE=q8_0` can reduce memory pressure

Option B (background service):

```bash
brew services start ollama
```

## 3) Verify Server Health
Run:

```bash
curl -s http://127.0.0.1:11434/api/tags | head
```

Success signal: JSON output is returned.

## 4) Choose a Starter Model (M1, 16 GB)
Use a small model first for responsiveness.

Option A:

```bash
ollama pull phi3
ollama run phi3
```

Option B:

```bash
ollama pull qwen2.5:3b
ollama run qwen2.5:3b
```

Recommended first pick: `phi3`.

## 5) Quick Prompt Sanity Check
In the interactive model prompt, test with:

```text
Extract and return JSON with keys "decisions", "open_loops", "next_actions" from:
"I'll defer where OpenClaw runs until later. Build Livefy Inbox UI first. Install Ollama on Mac. Consider phone capture via Vercel."
```

Success signal: sensible JSON returned quickly and system remains responsive.

## 6) Monitor and Stop Running Models
Check active models:

```bash
ollama ps
```

Stop model when done:

```bash
ollama stop phi3
# or
ollama stop qwen2.5:3b
```

On 16 GB systems, stopping models helps reclaim memory quickly.

## 7) Validate API Endpoint for Livefy Integration
Run:

```bash
curl http://127.0.0.1:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model":"phi3",
    "prompt":"Return JSON with keys decisions, open_loops, next_actions for: Build inbox UI. Defer OpenClaw hosting. Install Ollama.",
    "stream": false
  }'
```

Success signal: JSON response returned from local API.

## 8) Practical Mac Usage Defaults
When actively running Ollama:
- Prefer one browser and fewer heavy background apps
- Close Docker Desktop unless needed
- Keep active editor windows minimal
- Watch memory/swap and reduce concurrent workload if pressure rises

For memory diagnostics and "AI mode" process triage:
- `docs/mac-memory-ai-mode.md`

## Next Step
Pick optimization priority:
1. fastest responses
2. better reasoning (slower)

Then capture:

```bash
ollama --version
ollama list
```

Then keep extraction in Livefy rule-based until UI/store contracts are stable, and swap extraction engine behind a toggle.
