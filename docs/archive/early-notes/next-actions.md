# Next Actions

## Immediate
- Migrate frontend to Vite while preserving current module boundaries
- Keep Docker workflow working after Vite migration:
  - dev container for hot reload
  - production-style container serving built assets
- Add first deployment target (pick one static host) and document release steps
- Validate local Ollama setup and baseline model choice using `docs/ollama-setup.md`

## Near-term
- Add CI to build and publish `dist/` for the chosen host
- Choose iOS path:
  - Capacitor wrapper first, or
  - shared UI stack migration first
- Add second storage adapter stub for future native persistence (iOS/web parity)

## Later
- Decide backend posture (local-only vs optional cloud sync)
- Define auth/sync strategy if cross-device sync is needed
- Revisit OpenClaw integration once capture loop and app architecture are stable
