# Ollama Model Usage (macOS)

## Goal
Operate Ollama reliably on macOS, interpret common warnings correctly, and keep model usage efficient for Livefy workflows.

## Interpreting Missing Log Files
If `~/.ollama/logs/server.log` does not exist, this is usually normal.

Common runtime modes on macOS:
1. foreground mode (`ollama serve`): logs go to terminal stdout/stderr
2. background service mode (`brew services`/`launchd`): logs are handled by macOS unified logging

Conclusion: missing `~/.ollama/logs/server.log` does not imply a broken install.

## Interpreting the MLX Warning
Warning example:

```text
MLX: Failed to load symbol: mlx_metal_device_info
```

This is often emitted at runtime to stderr and may not appear in file logs.

In many Apple Silicon setups, it is benign when:
- models run successfully
- response speed is acceptable
- no crashes occur

If `phi3` works, installation is typically healthy.

## Quick Health Checklist
Run in order:

1. check version

```bash
ollama --version
```

2. start server in foreground

```bash
ollama serve
```

3. in another terminal, run a model

```bash
ollama run phi3
```

Healthy signs:
- no repeated severe Metal/runtime failures
- normal response speed
- no crashes

## Optional: Inspect macOS Unified Logs
Only needed for deeper debugging:

```bash
log show --predicate 'process == "ollama"' --last 5m
```

## Practical Working Set Recommendation
Start with a minimal two-model set:

1. extraction/structuring model

```bash
ollama pull phi3
```

2. coding-focused model

```bash
ollama pull deepseek-coder:6.7b
```

Keep memory pressure low by stopping inactive models:

```bash
ollama stop phi3
ollama stop deepseek-coder:6.7b
```

## Current-State Summary Template
Use this summary format in notes:
- Ollama install status: healthy/unhealthy
- primary extraction model: `<model>`
- primary coding model: `<model>`
- runtime warning status: cosmetic/actionable
- crash status: none/present

## Next Options
Choose one focus area:
1. verify active backend (Metal vs fallback)
2. add simple model-routing aliases/scripts
3. wire Codex CLI -> Ollama offline workflow
