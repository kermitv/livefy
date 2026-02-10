# Mac Memory Analysis (AI Mode)

## Goal
Capture a fast, accurate memory snapshot on macOS so you can decide what to close before running local AI workloads.

## 1) Quick Snapshot (Most Useful, Lowest Effort)
Run:

```bash
ps -axo pid,comm,rss | sort -nrk3 | head -20
```

What this gives:
- top 20 processes by resident memory (RSS)
- RSS values in KB
- fastest way to spot memory-heavy processes

Use this first and share output for targeted recommendations.

## 2) Memory Pressure + Swap Context
Run:

```bash
vm_stat
sysctl vm.swapusage
```

What this gives:
- paging behavior
- compression vs swap pressure
- system-level memory stress indicators

## 3) App-Level Memory View (Human-Readable)
Run:

```bash
ps -axo comm,rss | awk '{a[$1]+=$2} END {for (i in a) printf "%-30s %10.0f MB\n", i, a[i]/1024}' | sort -nrk2 | head -20
```

Useful for grouping by app category:
- browser
- editor/IDE
- Ollama
- Docker
- background utilities

## Do Not Target These by Default
Avoid closing core system processes unless clearly malfunctioning:
- `WindowServer`
- `kernel_task`
- `launchd`
- core system daemons
- `Finder` (unless misbehaving)

## Typical Focus Targets
Prioritize evaluation of:
- browsers
- IDE/editor instances
- containers
- background apps
- leftover services

## AI Mode Output Review Checklist
After collecting output:
1. identify top memory consumers
2. classify safe-to-close vs keep-running
3. define a minimal “AI mode” app set
4. decide whether to stop Ollama or switch to a smaller model

## TL;DR Command
Run this first:

```bash
ps -axo pid,comm,rss | sort -nrk3 | head -20
```
