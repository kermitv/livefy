# Codex CLI + Ollama (Local OSS Mode)

## Goal
Run Codex CLI against local Ollama models in OSS mode, with profile-based model selection and localhost verification.

## 1) Start Ollama
In one terminal:

```bash
ollama serve
```

Expected endpoint: `http://127.0.0.1:11434`.

## 2) Pull Local Models
Examples:

```bash
ollama pull deepseek-coder:6.7b
ollama pull qwen2.5-coder:7b
```

## 3) Configure Codex CLI for Ollama
Create or update:

`~/.codex/config.toml`

Use:

```toml
oss_provider = "ollama"

[model_providers.ollama]
name = "Ollama"
base_url = "http://localhost:11434/v1"

[profiles.deepseek_local]
model_provider = "ollama"
model = "deepseek-coder:6.7b"

[profiles.qwen_coder_local]
model_provider = "ollama"
model = "qwen2.5-coder:7b"
```

## 4) Run Codex with Local Model
Option A (profile):

```bash
codex --oss -p deepseek_local
```

Option B (one-off model):

```bash
codex --oss -c model_provider=ollama -c model=deepseek-coder:6.7b
```

Option C (interactive):

```bash
codex --oss
```

Then switch model in-session (for example using `/model`) and choose local model name.

## 5) Verify It Is Truly Local
With Ollama running, temporarily disconnect internet and run:

```bash
codex --oss -p deepseek_local
```

If it still works, routing is local.

## Known Gotcha
Some Codex/Ollama setups may ignore custom `base_url` and still assume `localhost:11434/v1`.

For this workflow, that is acceptable as long as Ollama uses default port `11434`.

## Quick Debug Inputs
If routing behavior is unclear, capture:

```bash
codex --version
which codex
head -n 20 ~/.codex/config.toml
```

Redact secrets before sharing config content.
