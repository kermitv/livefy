# Codex CLI Basics

## Goal
Use Codex CLI effectively for day-to-day coding workflows, including offline/local model usage with Ollama.

## Installation

### macOS / Linux (npm)

```bash
npm install -g @openai/codex
```

### macOS (Homebrew)

```bash
brew install --cask codex
```

Verify:

```bash
codex --version
```

## Getting Started (Interactive)
Start a session:

```bash
codex
```

Example prompt:

```text
Explain what this Python file does
```

## One-Off Command Usage
Run a single instruction without staying in a session:

```bash
codex "Generate a Python script that parses a CSV and plots a histogram"
```

## Approval Modes
Codex supports different automation levels:
- `suggest` (default): asks before applying edits
- `auto-edit`: applies edits, still prompts before shell commands
- `full-auto`: applies edits and runs commands without prompts

Example:

```bash
codex --approval-mode full-auto "Refactor this project to use async/await in all DB calls"
```

## Local Models (Ollama via `--oss`)
Start Ollama first:

```bash
ollama serve
```

Basic local invocation:

```bash
codex --oss
```

Specify local model directly:

```bash
codex --oss -m deepseek-coder:6.7b
codex --oss -m qwen2.5-coder:7b
```

## Config Profiles (`~/.codex/config.toml`)
Example:

```toml
[model_providers.ollama]
name = "Ollama"
base_url = "http://localhost:11434/v1"

[profiles.deepseek_local]
model_provider = "ollama"
model = "deepseek-coder:6.7b"
```

Run with profile:

```bash
codex --oss --profile deepseek_local
```

## Interactive Slash Commands
Inside interactive sessions, use slash commands for context/tooling operations.

Example:

```text
/mcp
```

## Practical Usage Tips
- Run inside a Git repo for better context handling
- Start from project root so files/tests/config are visible
- Choose approval mode based on trust and task scope
- Use `--oss` + Ollama for offline/private workflows

## Common Workflows

### Explain Code

```bash
codex "Explain the purpose of this folder and its major functions"
```

### Refactor

```bash
codex --approval-mode auto-edit "Refactor all JS functions in this folder to TypeScript"
```

### Fix Bugs

```bash
codex "Here is the failing test output. Fix the failing code so the test passes."
```

### Generate Tests

```bash
codex "Create unit tests for this Python module"
```

## Troubleshooting
- If Codex hangs/errors: verify network or config (`~/.codex/config.toml`)
- If local models fail: ensure `ollama serve` is running
- If system slows: use smaller models and reduce parallel app load

## Summary
Codex CLI supports:
- interactive and one-off coding assistance
- configurable approval safety levels
- local/offline model routing via `--oss`
- reusable profiles through `config.toml`
