# Ollama Setup (Windows + WSL2)

## Goal
Set up Ollama in Ubuntu on WSL2 and verify local model execution for Livefy workflows.

## Current State Check
Given:
- Default Distribution: `Ubuntu-22.04`
- Default Version: `2`

This means:
- WSL2 is installed
- Ubuntu is installed
- Correct WSL version is already active
- No reinstall is needed

## 1) Start Ubuntu
From PowerShell or Start menu:

```bash
wsl
```

or open `Ubuntu-22.04` directly from Start menu.

Expected prompt:

```text
kermit@machine:~$
```

## 2) Update Ubuntu
Run:

```bash
sudo apt update && sudo apt upgrade -y
```

This may take a few minutes.

## 3) Install Ollama
Run:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Verify:

```bash
ollama --version
```

## 4) Verify GPU Access
Run:

```bash
nvidia-smi
```

Expected: GPU details are printed.

If it fails, check/install NVIDIA drivers for WSL support.

## 5) Run First Model
Run:

```bash
ollama run llama3.1:8b
```

Then test with:

```text
Explain why the sky is blue.
```

Success confirms:
- model runs
- GPU path works
- system is ready for local agent workflows

## Resource Use Expectations
While model inference is running, it is normal to see:
- GPU memory increase
- RAM usage increase
- CPU usage spikes

## Phase 1 Milestone
When the above flow succeeds, local AI is running on your machine and ready for integration work.

## Next Check
Confirm which NVIDIA driver path is currently installed:
- WSL-capable NVIDIA CUDA driver path, or
- regular Windows GPU driver only

This is usually clear from the result of:

```bash
nvidia-smi
```
