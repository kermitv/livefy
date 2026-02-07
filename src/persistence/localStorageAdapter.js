export function createLocalStorageAdapter(options) {
  const { key, fallbackKeys = [], storage = globalThis.localStorage } = options;

  return {
    load() {
      const candidates = [key, ...fallbackKeys];
      for (const candidate of candidates) {
        try {
          const raw = storage.getItem(candidate);
          if (!raw) continue;
          return JSON.parse(raw);
        } catch {
          // Try the next key if parsing fails.
        }
      }
      return null;
    },
    save(value) {
      storage.setItem(key, JSON.stringify(value));
    },
  };
}
