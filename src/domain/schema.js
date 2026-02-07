export const APP_STATE_VERSION = 2;

export function createEmptyState() {
  return {
    version: APP_STATE_VERSION,
    profile: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    },
    dashboard: {
      energy: 6,
      notes: "",
      outcomes: "",
    },
    tasks: [],
    habits: [],
    habitChecksByDate: {},
  };
}

export function migrateState(raw) {
  const next = createEmptyState();
  if (!raw || typeof raw !== "object") return next;

  const energy = Number(raw.dashboard?.energy ?? raw.energy ?? next.dashboard.energy);
  next.dashboard.energy = Number.isFinite(energy) ? Math.max(1, Math.min(10, energy)) : 6;
  next.dashboard.notes = String(raw.dashboard?.notes ?? raw.notes ?? "");
  next.dashboard.outcomes = String(raw.dashboard?.outcomes ?? raw.outcomes ?? "");

  const tasks = Array.isArray(raw.tasks) ? raw.tasks : [];
  next.tasks = tasks
    .filter((task) => task && typeof task === "object" && typeof task.text === "string")
    .map((task) => ({
      id: typeof task.id === "string" ? task.id : makeId(),
      text: task.text.trim(),
      done: Boolean(task.done),
      createdAt: typeof task.createdAt === "string" ? task.createdAt : new Date().toISOString(),
    }))
    .filter((task) => task.text.length > 0);

  const habits = Array.isArray(raw.habits) ? raw.habits : [];
  next.habits = habits
    .filter((habit) => habit && typeof habit === "object" && typeof habit.text === "string")
    .map((habit) => ({
      id: typeof habit.id === "string" ? habit.id : makeId(),
      text: habit.text.trim(),
      createdAt: typeof habit.createdAt === "string" ? habit.createdAt : new Date().toISOString(),
    }))
    .filter((habit) => habit.text.length > 0);

  const checks = raw.habitChecksByDate;
  if (checks && typeof checks === "object") {
    for (const [dateKey, value] of Object.entries(checks)) {
      if (!dateKey || typeof value !== "object" || value === null) continue;
      const row = {};
      for (const [habitId, checked] of Object.entries(value)) {
        row[habitId] = Boolean(checked);
      }
      next.habitChecksByDate[dateKey] = row;
    }
  }

  return next;
}

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `id_${Math.random().toString(36).slice(2, 10)}`;
}
